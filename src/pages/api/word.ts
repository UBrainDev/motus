// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { readFileSync } from 'fs';
import { join } from 'path';

let wordCount = 0; // Nombre de mots en cache

/**
 * Lecture et mise en cache des mots à partir du fichier importé
 */
const listeMots = 
  readFileSync(join(process.cwd(), 'src', 'data', 'liste_mots.txt'), 'utf16le')
  .split('\n')
  .map((mot: string, i: number, a: string[]) => {

      // Envoie un message dans la console à chaque fois qu'dixième de la liste de mots est chargé
      if(i % Math.round(a.length / 10) == 0) console.log(`[${Math.round(i / a.length * 100)}%] Chargement de la liste de mots.. ${i}/${a.length}`);
      
      // Récupérer le mot
      let parsedMot = mot.split(',')[0].toLowerCase();
      return parsedMot.match(/[ \\\-]|[0-9]/gm) ? null : parsedMot.normalize("NFD").replace(/\p{Diacritic}/gu, "");

  })
  .filter(mot => mot != null) // Supprimer les mots "vides"

  // Regroupe les mots par taille (nbr de lettres) dans un objet
  .reduce((acc: any, mot: string | null) => {
    if(!acc[mot!.length]) acc[mot!.length] = [];
    acc[mot!.length].push(mot);
    wordCount++;
    return acc;
  }, {});

console.log(`[100%] Nombre de mots en cache après filtrage : ${wordCount}`);

type DataWord = {
  mot?: string,
  exists?: boolean,
}

type DataStats = {
  mots: number,
  tailles: { [key: number]: number }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataWord | DataStats>
) {

  // Récupérer les paramètres de la requête (GET dans l'URL)
  const { type, taille, mot } = req.query as { type: string, taille: string, mot: string };

  if(type == "stats") {
  
    // Renvoyer les stats (status 200)
    return res.status(200).json(
      { 
        mots: wordCount, 
        tailles: Object.keys(listeMots).reduce((acc: any, taille: string) => {
          acc[taille] = listeMots[taille].length;
          return acc;
        }, {})
      }
    )
  
  } 
  
  /**
   * Vérifier si le mot donné existe
   */
  else if(type == "check") {

    // Vérifier si le mot existe
    if (!mot) return res.status(400).json({ mot: "Aucun mot donné" });
    else return res.status(200).json({ exists: listeMots[mot.length].includes(mot) });
  
  }
  
  // Si la requête est mal formée
  if(!taille) return res.status(400).json({ mot: "Requête mal formée (HTTP 400)" });

  // Si la taille demandée n'est pas indexée
  if(!listeMots[taille]) return res.status(400).json({ mot: "Taille de mot inexistante (HTTP 400)" });
  
  // Renvoyer un mot aléatoire (status 200)
  res.status(200).json(
    { mot: listeMots[taille][Math.floor(Math.random() * listeMots[taille].length)] }
  )

}