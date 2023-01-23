import React, { useRef, useEffect } from 'react'

const MotusCanvas = (props: any) => {

    const canvasRef = useRef(null);

    const { mot, guesses, width, height } = props;
    const [ sqMargin, sqSize ] = [width/75, (width / mot.length) - (width/75)];

    useEffect(() => {

        const canvas = canvasRef.current as unknown as HTMLCanvasElement;
        const context = canvas.getContext('2d')!;

        // Supprimer le contenu du canvas
        context.clearRect(0, 0, width, height);

        context.fillStyle="#000000";
        context.font = "100 " + (sqSize - 2) + "px Arial";

        guesses.forEach((guess: string, i: number) => {
                
                guess.split('').forEach((letter: string, j: number) => {
    
                    let styles = ["#48494d", "#fff"]
                    if (mot[j] === letter) styles = ["#74e87c", "#48494d"];
                    
                    context.fillStyle = styles[0];
                    context.fillRect(j * (sqSize + sqMargin), i * (sqSize + 2 * sqMargin), sqSize, sqSize);

                    context.fillStyle = styles[1];
                    context.fillText(letter, j * (sqSize + sqMargin) + sqSize / 2 - context.measureText(letter).width / 2, i * (sqSize + 2 * sqMargin) + sqSize * 0.8);
    
                });

        });

    });
    
    return <canvas ref={canvasRef} {...props}/>

}

export default MotusCanvas
