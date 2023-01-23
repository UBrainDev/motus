import styles from '@/styles/Game.module.css'

type InputTileProps = {
    word: string[],
    knownLetters: string[],
    guessWord: Function,
}

/**
 * Tuile de saisie
 * @param props 
 * @returns 
 */
export default function InputTile(props: InputTileProps) {

    function handleKeyDown(e: any, i: number) {

        if(e.key === "Backspace" && i === 0) return;

        // Champ de saisie courant
        const currentInput = (document.getElementById(`guessInput${i}`)! as HTMLInputElement);

        // Annule l'action par défaut de l'événement
        e.preventDefault();

        // Définir la valeur du champ avant le changement de focus
        if(e.key.length === 1) {
            currentInput.value = e.key;
            document.getElementById(`guessInput${i + 1}`)?.focus(); 
            props.guessWord();
        } 
        
        // Si l'utilisateur cherche à supprimer la lettre, vider le champ
        else if (e.key === "Backspace") {
            currentInput.value = "";
            return document.getElementById(`guessInput${i - 1}`)?.focus();
        }

    }

    return (
        <div className={styles.tile}>
            {
                // Ajouter un champ de saisie pour chaque lettre du mot
                props.word.map((_: string, index: number) => (
                    <input 
                        className={styles.tileLetter}
                        id={"guessInput"+index}
                        key={index}
                        placeholder={props.knownLetters[index] || "_"}
                        onKeyDown={(e) => handleKeyDown(e, index)} />
                ))
            }
        </div>
    )

}
