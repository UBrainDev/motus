import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Game from '@/components/Game'

export default function Home() {
  return (
    <>
      <Head>
        <title>Motus</title>
        <meta name="description" content="Une reproduction du jeu télévisé Motus avec Thierry Beccaro." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="charset" content="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />

        <Game />

      </main>
    
    </>
  )
}