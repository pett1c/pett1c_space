import { useEffect, useRef, useState } from 'react';

const AudioVisualizer = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [speed, setSpeed] = useState(0.003);
    
    // refs for storing animation and audio states
    const requestRef = useRef<number | undefined>(undefined);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserLeftRef = useRef<AnalyserNode | null>(null);
    const analyserRightRef = useRef<AnalyserNode | null>(null);
    const dataArrayLeftRef = useRef<Float32Array | null>(null);
    const dataArrayRightRef = useRef<Float32Array | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    
    const rotationAngleRef = useRef(0);
    const rotationSpeedRef = useRef(0.003);
    const trailHistoryRef = useRef<{x: number, y: number}[][]>([]);
    const isPlayingRef = useRef(false);

    // constants from the original script
    const trailLength = 30;
    const colors = [
        { r: 0, g: 210, b: 255 },   // cyan
        { r: 30, g: 144, b: 255 },  // dodger blue
        { r: 65, g: 105, b: 225 },  // royal blue
        { r: 138, g: 43, b: 226 }   // blue violet
    ];

    // update refs when the settings state changes
    useEffect(() => {
        rotationSpeedRef.current = speed;
    }, [speed]);

    useEffect(() => {
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = volume;
        }
    }, [volume]);

    // point rotation function
    const rotatePoint = (x: number, y: number, centerX: number, centerY: number, angle: number) => {
        const translatedX = x - centerX;
        const translatedY = y - centerY;
        const rotatedX = translatedX * Math.cos(angle) - translatedY * Math.sin(angle);
        const rotatedY = translatedX * Math.sin(angle) + translatedY * Math.cos(angle);
        return { x: rotatedX + centerX, y: rotatedY + centerY };
    };

    // audio context initialization
    const initAudio = () => {
        if (audioContextRef.current) return;

        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContext();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaElementSource(audioRef.current!);
        const splitter = audioCtx.createChannelSplitter(2);
        const analyserLeft = audioCtx.createAnalyser();
        const analyserRight = audioCtx.createAnalyser();

        analyserLeft.fftSize = 1024;
        analyserRight.fftSize = 1024;
        analyserLeft.smoothingTimeConstant = 0.5;
        analyserRight.smoothingTimeConstant = 0.5;
        analyserLeft.minDecibels = -90;
        analyserLeft.maxDecibels = -10;
        analyserRight.minDecibels = -90;
        analyserRight.maxDecibels = -10;

        analyserLeftRef.current = analyserLeft;
        analyserRightRef.current = analyserRight;
        dataArrayLeftRef.current = new Float32Array(analyserLeft.fftSize);
        dataArrayRightRef.current = new Float32Array(analyserRight.fftSize);

        // visualization path
        const visualizerGain = audioCtx.createGain();
        visualizerGain.gain.value = 1.0;
        source.connect(visualizerGain);
        visualizerGain.connect(splitter);
        splitter.connect(analyserLeft, 0);
        splitter.connect(analyserRight, 1);

        // sound playback path
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = volume;
        gainNodeRef.current = gainNode;
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
    };

    // draw background
    const drawVectorScopeBackground = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotationAngleRef.current * 0.2);

        // circles
        [1, 0.75, 0.5, 0.25].forEach(scale => {
            ctx.beginPath();
            ctx.arc(0, 0, radius * scale, 0, Math.PI * 2);
            ctx.strokeStyle = scale === 1 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // axles
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, radius);
        ctx.moveTo(-radius, 0);
        ctx.lineTo(radius, 0);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();

        // diagonals
        const diag = radius * 0.7071;
        ctx.beginPath();
        ctx.moveTo(-diag, -diag);
        ctx.lineTo(diag, diag);
        ctx.moveTo(-diag, diag);
        ctx.lineTo(diag, -diag);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.stroke();

        ctx.restore();
    };

    // main animation cycle
    const animate = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // cleaning with fading effect
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.45;

        rotationAngleRef.current += rotationSpeedRef.current;
        if (rotationAngleRef.current > Math.PI * 2) rotationAngleRef.current -= Math.PI * 2;

        drawVectorScopeBackground(ctx, centerX, centerY, radius);

        const points = [];

        if (isPlayingRef.current && analyserLeftRef.current && analyserRightRef.current) {
            // active mode
            analyserLeftRef.current.getFloatTimeDomainData(dataArrayLeftRef.current! as any);
            analyserRightRef.current.getFloatTimeDomainData(dataArrayRightRef.current! as any);

            const bufferLength = analyserLeftRef.current.fftSize;
            let maxAmplitude = 0.01;
            for (let i = 0; i < bufferLength; i++) {
                maxAmplitude = Math.max(maxAmplitude, Math.abs(dataArrayLeftRef.current![i]), Math.abs(dataArrayRightRef.current![i]));
            }
            const normalizationFactor = Math.min(1.0 / maxAmplitude, 4.0);
            const sampleStep = Math.floor(bufferLength / 256);

            for (let i = 0; i < bufferLength; i += sampleStep) {
                const leftValue = dataArrayLeftRef.current![i] * normalizationFactor;
                const rightValue = dataArrayRightRef.current![i] * normalizationFactor;
                const rawX = centerX + radius * leftValue;
                const rawY = centerY + radius * rightValue;
                points.push(rotatePoint(rawX, rawY, centerX, centerY, rotationAngleRef.current));
            }
        } else {
            // waiting mode (lissajous)
            const time = Date.now() * 0.001;
            for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
                const frequency1 = 2;
                const frequency2 = 3;
                const phase = time * 0.5;
                const rawX = centerX + radius * 0.4 * Math.sin(angle * frequency1 + phase);
                const rawY = centerY + radius * 0.4 * Math.sin(angle * frequency2);
                points.push(rotatePoint(rawX, rawY, centerX, centerY, rotationAngleRef.current));
            }
        }

        // drawing points and lines
        if (points.length > 0) {
            // lines
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
            if (!isPlayingRef.current) ctx.lineTo(points[0].x, points[0].y); // Замыкаем в idle
            ctx.strokeStyle = isPlayingRef.current ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 180, 255, 0.3)';
            ctx.lineWidth = isPlayingRef.current ? 1 : 2;
            ctx.stroke();

            // points (saving history only for active mode)
            if (isPlayingRef.current) {
                trailHistoryRef.current.unshift(points);
                if (trailHistoryRef.current.length > trailLength) trailHistoryRef.current.pop();

                for (let t = 0; t < trailHistoryRef.current.length; t++) {
                    const framePoints = trailHistoryRef.current[t];
                    const opacity = 1 - (t / trailLength);
                    for (let i = 0; i < framePoints.length; i++) {
                        const point = framePoints[i];
                        const dist = Math.sqrt(Math.pow((point.x - centerX) / radius, 2) + Math.pow((point.y - centerY) / radius, 2));
                        const colorIndex = Math.min(Math.floor(dist * colors.length), colors.length - 1);
                        const color = colors[colorIndex] || colors[0];
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                        ctx.fill();
                    }
                }
            } else {
                // points for idle
                const time = Date.now() * 0.001;
                for (let i = 0; i < points.length; i++) {
                    ctx.beginPath();
                    ctx.arc(points[i].x, points[i].y, 1, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 210, 255, ${0.5 + 0.5 * Math.sin(i * 0.2 + time * 3)})`;
                    ctx.fill();
                }
            }
        }

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                canvasRef.current.width = containerRef.current.clientWidth;
                canvasRef.current.height = containerRef.current.clientHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    const togglePlay = async () => {
        if (!audioContextRef.current) initAudio();
        if (audioContextRef.current?.state === 'suspended') await audioContextRef.current.resume();

        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
            isPlayingRef.current = false;
            trailHistoryRef.current = [];
        } else {
            try {
                await audioRef.current?.play();
                setIsPlaying(true);
                isPlayingRef.current = true;
            } catch (e) { console.error(e); }
        }
    };

    return (
        <div ref={containerRef} className="visualizer-container" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: 'inherit' }}>
            <div className="visualizer-hover-bg"></div>
            <canvas ref={canvasRef} style={{ display: 'block', position: 'relative', zIndex: 1 }} />
            
            {/* settings menu */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 20 }}>
                <button 
                    className={`visualizer-button menu-btn ${isMenuOpen ? 'open' : ''}`} 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div className="hamburger-lines">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>
                
                <div className={`settings-menu ${isMenuOpen ? 'open' : ''}`}>
                    <div className="control-group">
                        <label>Volume</label>
                        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
                    </div>
                    <div className="control-group">
                        <label>Speed</label>
                        <input type="range" min="0" max="0.02" step="0.001" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} />
                    </div>
                </div>
            </div>

            {/* play/pause button */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
                <button onClick={togglePlay} className="visualizer-button">
                    {isPlaying ? (
                        <span style={{ display: 'block', width: '12px', height: '12px', background: 'rgba(255, 255, 255, 0.8)' }}></span>
                    ) : (
                        <span style={{ display: 'block', width: '0', height: '0', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid rgba(255, 255, 255, 0.8)', marginLeft: '4px' }}></span>
                    )}
                </button>
            </div>

            <audio ref={audioRef} src="/music.mp3" crossOrigin="anonymous" onEnded={() => {
                setIsPlaying(false);
                isPlayingRef.current = false;
                trailHistoryRef.current = [];
            }} />
        </div>
    );
};

export default AudioVisualizer;