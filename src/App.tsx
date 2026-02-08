import { InteractiveBubble } from './interactiveBubble';
import { RandomPosition } from './randomPosition';
import './App.css'

function App() {
  const bubbleRef = InteractiveBubble();
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

      <div ref={containerRef} className="gradients-container">
        <div className="g1"></div>
        <div className="g2"></div>
        <div className="g3"></div>
        <div className="g4"></div>
        <div className="g5"></div>
        <div ref={bubbleRef} className="interactive"></div>
      </div>

    </div>


    {/*}
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
      */}
    </>
  )
}

export default App
