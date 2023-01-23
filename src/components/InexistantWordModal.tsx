import styles from '@/styles/Game.module.css'

type InexistantWordModalProps = {
    setModalState: (state: string) => void
}

/**
 * Modal d'erreur signalant que le mot entré n'existe pas
 * @param props 
 * @returns 
 */
export default function InexistantWordModal(props: InexistantWordModalProps) {

    function handleClose() {
        props.setModalState("");
    }

    return (
        <div className={styles.modal + " " + styles.sm}>
            <div>
                <p className={styles.modalText}>Le mot n'est pas dans la liste</p>
                <div className={styles.alignRight + " " + styles.break}>
                    <button className={styles.modalButton} onClick={handleClose}>Fermer</button>
                </div>
            </div>
        </div>
    )

}