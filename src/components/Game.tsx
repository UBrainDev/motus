import styles from '@/styles/Game.module.css'
import { useState, useEffect } from 'react'

// Components
import Tile from '@/components/Tile'
import InputTile from '@/components/InputTile'
import Modal from './StartModal';
import InexistantWordModal from './InexistantWordModal';
import GameEndedModal from './GameEndedModal';


export default function Game() {

    const [gameState, setGameState] = useState(0); // 0: Accueil, 1: En jeu, 2: Perdu, 3: Gagné
    const [modalState, setModalState] = useState("start"); // Nom du modal ouvert
    const [sessionData, setSessionData] = useState({ points: 0, streak: 0 }); // Données de la session en cours
    const [word, setWord] = useState([] as string[]); // Mot à trouver
    const [guesses, setGuesses] = useState([] as string[]); // Tableau des tentatives
    const [knownLetters, setKnownLetters] = useState([] as string[]); // Liste des lettres connues

    // Charger la session enregistrée dans le localStorage
    useEffect(() => {
        const session = localStorage.getItem('session');
        if (session) try{setSessionData(JSON.parse(session))} catch(e) {};
    }, []);

    // Ouvrir le modal de fin de jeu lorsque la partie se termine
    useEffect(() => {
        if (gameState > 1) setModalState("gameEnded");
    }, [gameState]);

    // Récupérer un mot aléatoire depuis l'API
    const getWord = async () => {

            // Contacter l'API (endpoint /word)
            const data = await (fetch('api/word?taille=4').then(res => res.json()));

            setWord(data.mot?.split('') || []);
            console.log("Mot à trouver: " + data.mot);
            return data.mot || "";

    }

    return (
        <>
            <div className={styles.gameContainer} style={{ display: word ? 'block' : 'none' }}>
                { guesses.map((guess, index) => {

                    // Créer un dictionnaire comptabilisant le nombre d'occurences de chaque lettre
                    let lettersCount = word.reduce((acc, letter) => 
                        { acc[letter] = (acc[letter] || 0) + 1; return acc; }, {} as { [key: string]: number });
                    
                    // "Motif" de la tentative (0 = mauvais, 1 = mauvais placement, 2 = bon)
                    let letterPattern = "";
                    
                    // Pour chaque lettre du mot à trouver
                    guess.split('').forEach((letter, index) => {

                        if(letter === word[index]) {
                            letterPattern += '2';
                            lettersCount[letter]--;
                        } else if (letter in lettersCount) {
                            letterPattern += lettersCount[letter] > 0 ? '1' : '0';
                            lettersCount[letter]--;
                        } else letterPattern += '0';

                    });

                    return <Tile word={guess} pattern={letterPattern} key={index} />

                }) }

                {
                    // Champ de saisie
                    guesses.length < 6 ? <InputTile word={word} guessWord={guessWord} knownLetters={knownLetters} /> : ""
                }

                {
                    // Tentatives restantes
                    guesses.length < 6 ? Array(5 - guesses.length).fill(0).map((_, index) => (
                        <Tile word={"\u200b".repeat(word.length)} key={index} disabled={true} />
                    )) : ""
                }

            </div>

            <div className={styles.modalContainer} style={{ display: modalState == "" ? "none" : "flex" }}>
                { 
                    modalState === "start" ? <Modal session={sessionData} startGame={startGame} /> :
                    modalState === "unknownLetter" ? <InexistantWordModal setModalState={setModalState} /> :
                    modalState === "gameEnded" ? <GameEndedModal session={sessionData} setSession={setSessionData} word={word} startGame={startGame} guesses={guesses} gameState={gameState} /> :
                    ""
                }
            </div>
        </>
    )

    async function startGame() {

        const newWord = await getWord();

        setKnownLetters(Array(newWord.length).fill(""));
        setModalState("");
        setGuesses([]);
        setGameState(1);

    }

    function endGame(won: boolean) {
        
        if (won) {
            sessionData.points += (word.length) * (6 - guesses.length);
            sessionData.streak++;
            setGameState(3);
        } else {
            if(sessionData.points > 0) sessionData.points -= 3;
            else sessionData.points = 1;
            sessionData.streak = 0;
            setGameState(2);
        }

        // Sauvegarder les données de la session dans le localStorage
        localStorage.setItem('session', JSON.stringify(sessionData));

    }

    async function guessWord() {
    
        // Récupérer la valeur de chaque champ de saisie
        const champsSaisie = Array.from(document.querySelectorAll('input[id^="guessInput"]'));

        const letters = champsSaisie
            .map((value: any, _: number) => value.value)
            .filter((value: string) => value !== "");

        // Vérifier que tous les champs sont remplis
        if(letters.length != word.length) return; 

        // Vérifier que le mot est dans la liste à l'aide de l'API
        champsSaisie.forEach((input: any) => input.disabled = true);
        const response = await fetch('api/word?type=check&mot=' + letters.join(''));
        const exists = (await response.json()).exists == 1 ? true : false;

        // Si le mot n'existe pas
        if (!exists) {
            champsSaisie.forEach((input: any) => input.disabled = false);
            return setModalState("unknownLetter");
        }

        // Ajouter le mot au tableau des tentatives
        setGuesses([...guesses, letters.join('')]);

        // Si le mot est trouvé
        if(letters.join('') === word.join('')) endGame(true);
        else if (guesses.length >= 5) endGame(false);

        // Récupérer les lettres connues
        setKnownLetters(knownLetters.map((l, i) =>
          l || (letters[i] === word[i] ? letters[i] : null)
        ));

        document.getElementById('guessInput0')?.focus();
        champsSaisie.forEach((input: any) => { input.value = ""; input.disabled = false; });
        
    }

}