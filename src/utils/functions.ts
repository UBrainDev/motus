/**
 * Ajoute des espaces dans un nombre pour le rendre plus lisible
 * @param number 
 * @returns 
 */
export function parseNumber(number: string | number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}