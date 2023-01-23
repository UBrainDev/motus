import styles from '@/styles/Game.module.css'
import { useState, useEffect } from 'react'
import { parseNumber } from '@/utils/functions'

type ModalProps = {
    session: { points: number },
    startGame: () => void,
}

/**
 * Modal d'accueil
 * @param props 
 * @returns 
 */
export default function Modal(props: ModalProps) {

    const [stats, setStats] = useState({ mots: "..." });

    useEffect(() => {
        fetch('api/word?type=stats')
            .then(res => res.json())
            .then(data => setStats(data))
    }, []);

    return (
        <div className={styles.modal + " " + styles.stretchedModal}>
            <div className={styles.alignCenter}>
                <h1 className={styles.mainTitle}>Motus</h1>
                <p className={styles.modalText}>{parseNumber(stats.mots)} mots chargés dans le cache distant</p>
                <div className={styles.break}></div>
                <button className={styles.modalButton + " " + styles.modalButtonStart} onClick={props.startGame}>
                    {props.session.points > 0 ? "Reprendre" : "Commencer"}
                </button>
            </div>
        </div>
    )
}
