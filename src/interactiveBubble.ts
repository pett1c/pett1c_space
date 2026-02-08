import { useEffect, useRef } from 'react';

export const InteractiveBubble = () => {
    const interBubbleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interBubble = interBubbleRef.current;
        if (!interBubble) return;

        let curX = 0, curY = 0, tgX = 0, tgY = 0;

        const move = () => {
            curX += (tgX - curX) / 20;
            curY += (tgY - curY) / 20;
            interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
            requestAnimationFrame(move);
        };

        const handleMouseMove = (event: MouseEvent) => {
            tgX = event.clientX;
            tgY = event.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        move();

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return interBubbleRef;
}