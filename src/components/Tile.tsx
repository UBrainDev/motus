import styles from '@/styles/Game.module.css'

/**
 * Styles associés aux motifs de lettres
 */
const patternStyles = {
    '0': "", // Lettre incorrecte
    '1': styles.tileLetterPlacement, // Mauvais placement
    '2': styles.tileLetterCorrect // Lettre correcte
}

type TileProps = {
    word: string,
    pattern?: string,
    disabled?: boolean
}

/**
 * Tuile de lettres
 * @param props 
 * @returns 
 */
export default function Tile(props: TileProps) {
    return (
        <div className={styles.tile + " " + (props.disabled ? styles.disabled : '')}>

            {
            // Pour chaque lettre dans le mot
            props.word.split('').map((letter: string, index: number) => {

                return props.pattern ?
                    <div className={styles.tileLetter + " " + patternStyles[props.pattern[index] as '0' | '1' | '2']} key={index}>{letter}</div>
                    : <div className={styles.tileLetter} key={index}>{letter}</div> // Pour les lettres sans pattern

            })}

        </div>
    )
}
