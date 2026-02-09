import { useInteractiveBubble } from './interactiveBubble';
import { RandomPosition } from './randomPosition';
import './App.css'

function App() {
  const bubbleRef = useInteractiveBubble();
  const containerRef = RandomPosition();

  return (
    <>
    <div className="gradient-bg">

      <svg xmlns="https://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -1" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />"
          </filter>
        </defs>
      </svg>

      <svg style={{display: 'none'}}>
        <filter id="de-glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="1" seed="5" result="turbulence">
          </feTurbulence>
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5"/>
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0"/>
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5"/>
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap"/>
          <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lighting-color="white" result="specLight">
            <fePointLight x="-200" y="-200" z="300"/>
          </feSpecularLighting>
          <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage"/>
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale="150" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </svg>


      <div ref={containerRef} className="gradients-container">
        <div className="g1"></div>
        <div className="g2"></div>
        <div className="g3"></div>
        <div className="g4"></div>
        <div className="g5"></div>
        <div ref={bubbleRef} className="interactive"></div>
      </div>

      <div className="container">
        <div className="row row-1">
          <div className="col col-1">
            <div className="col-box"></div>
          </div>
          <div className="col col-2">
            <div className="col-box"></div>
            <div className="col-box"></div>
          </div>
        </div>

        <div className="row row-2">
          <div className="col col-1">
            <div className="col-box"></div>
            <div className="col-box"></div>
          </div>
          <div className="col col-2">
            <div className="col-box"></div>
            <div className="col-box"></div>
          </div>
        </div>

        <div className="row row-3">
          <div className="col col-1">
            <div className="col-box-big"></div>
            <div className="col-box"></div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
