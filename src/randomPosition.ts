import { useEffect, useRef } from 'react';

export const RandomPosition = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            for (let i = 0; i <= 5; i++) {
                const randomX = Math.floor(Math.random() * 100) - 50;
                const randomY = Math.floor(Math.random() * 100) - 50;

                containerRef.current.style.setProperty(`--rnd-x${i}`, `${randomX}%`)
                containerRef.current.style.setProperty(`--rnd-y${i}`, `${randomY}%`)
            }

        }
    }, []);

    return containerRef;
}