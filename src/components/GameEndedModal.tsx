import styles from '@/styles/Game.module.css'
import { useState, useEffect } from 'react'
import { parseNumber } from '@/utils/functions'

import MotusCanvas from '@/components/MotusCanvas'

type SessionData = { points: number, streak: number }
type GameEndedModalProps = {
    session: SessionData,
    word: string[],
    guesses: string[],
    gameState: number,
    setSession: (session: SessionData) => void,
    startGame: () => void
}

const ranks = {
    F: ["#fc494c"],
    D: ["#fc7049"],
    C: ["#fcb749"],
    B: ["#a2cc68"],
    A: ["#7ed64f"],
    S: ["linear-gradient(45deg, #687ccc, #ae68cc)"]
}

/**
 * Retourne le rang, le sous rang ('-', '', '+') dans un tableau
 */
const getRank = (x: number) => {
    if (x <= 1) return ["F", ""]
    let rank = (x/350) + (Math.log(x + 10) - 2)/3;
    let rankDiff = rank - Math.floor(rank);
    return ["DCBAS"[Math.floor(rank)], (rankDiff < 0.33 ? "-" : rankDiff < 0.66 ? "" : "+")];
}

const getNextRankPoints = (currentRank: string) => {
    if (currentRank === "S") return 999999;
    let rank = "DCBAS".indexOf(currentRank);
    return Math.floor(350 * (rank) - Math.exp(3 * rank + 2) - 10);
}

/**
 * Modal de fin de partie
 * @param props 
 * @returns 
 */
export default function GameEndedModal(props: GameEndedModalProps) {

    const [wikitionaryData, setWikitionaryData] = useState({ });
    const [displayVisual, setDisplayVisual] = useState(false);

    const [rank, subRank] = getRank(props.session.points);
    const nextRankPts = getNextRankPoints(rank);

    // useEffect(() => {
    //     fetch('api/word?type=stats')
    //         .then(res => res.json())
    //         .then(data => setStats(data))
    // }, []);

    return (
        <>
        <div className={styles.modal} style={{ display: displayVisual ? "none" : "flex" }}>
            <div className={styles.alignCenter}>
                {props.gameState === 2 ? <>
                        <h1 className={styles.lostTitle}>Perdu..</h1>
                        <p className={styles.modalText}>Le mot à trouver était "
                            {props.word.map((l, i) =>
                                // Mettre en surbrillance les lettres non trouvées
                                props.guesses[props.guesses.length - 1][i] === l ? l :
                                <span className={styles.wrongLetterModal}>{l}</span>)
                            }"</p>
                    </> : <>
                        <h1 className={styles.lostTitle}>Gagné !</h1>
                        <p className={styles.modalText}>Vous avez trouvé "{props.word.join("")}" en {props.guesses.length} essais.</p>
                    </>
                }

                { /*  Afficher les "info boites" */ }
                <div className={styles.infoboxContainer}>

                    <div className={styles.infobox + " " + styles.wBottom} style={{ background: ranks[rank as keyof typeof ranks][0] }}>
                        <h1>{rank + subRank}</h1>
                        <h3>Votre rang</h3>
                        <div className={styles.progressbar}>
                            <div className={styles.fill} style={{ width: Math.round(props.session.points/nextRankPts * 100) + "%" }}></div>
                            <h4>{props.session.points}/{Math.round(nextRankPts)}</h4>
                        </div>
                    </div>

                    <div className={styles.infobox} style={{ background: "#6f7be3" }}>
                        <h1>{props.session.streak}</h1>
                        <h3>Consécutifs</h3>
                    </div>

                    <div className={styles.infobox + " " + styles.clickable} onClick={() => setDisplayVisual(true)}>
                        <MotusCanvas mot={props.word} guesses={props.guesses} width="100" height="90" />
                        <h3>Partager</h3>
                    </div>

                </div>

                <div className={styles.break}></div>
                <button className={styles.modalButton + " " + styles.modalButtonStart} onClick={props.startGame}>
                    {props.gameState === 2 ? "Réessayer" : "Nouvelle partie"}
                </button>
            </div>
        </div>

        { /*  Afficher le canvas */
            displayVisual ?
            <div className={styles.modal + " " + styles.sm}>
                <div>
                    <MotusCanvas mot={props.word} guesses={props.guesses} width="500" height="400" className={styles.visualisationCanvas} />
                    <div className={styles.alignCenter}>
                        <button className={styles.modalButton} onClick={() => setDisplayVisual(false)}>Fermer</button>
                    </div>
                </div>
            </div> : null 
        }
        </>
    )
}
