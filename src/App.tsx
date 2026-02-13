import { useInteractiveBubble } from './interactiveBubble';
import { RandomPosition } from './randomPosition';
import AudioVisualizer from './AudioVisualizer';
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
        <filter id="de-glass-distortion" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
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
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale="20" xChannelSelector="R" yChannelSelector="G"/>
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
            <div className="col-box">
              <div className="infobox1">
                <img id="avatar" src="/avatar.jpg" alt="my avatar btw"/>
                <div className="myname">
                  <h1>
                    Ihor
                    Tienietilov
                  </h1>
                  <div className="placeholder"></div>
                </div>
              </div>
              <div className="infobox2">
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut nulla error qui quo tempora dolorem earum. Expedita deserunt possimus quos sapiente. Expedita deserunt possimus quos sapiente. Expedita deserunt possimus quos sapiente. Expedita deserunt possimus quos sapiente.</p>
              </div>
            </div>
          </div>
          <div className="col col-2">
            <div className="col-box">
              <div className="projectbox1">
                <h1>flewe</h1>
              </div>
              <div className="projectbox2">
                <a href="http://github.com/pett1c/" target="_blank"><img src="" alt="flewe gif" /></a>
              </div>
              <div className="projectbox3">
                <div className="normalicon">
                  <img src="/unity.svg" alt="unity" />
                </div>
                <div className="normalicon">
                  <img src="/csharp.svg" alt="c#" />
                </div>
              </div>
            </div>
            <div className="col-box">
              <div className="projectbox1">
                <h1>music</h1>
              </div>
              <div className="projectbox2">
                <a href="http://github.com/pett1c/" target="_blank"><img src="" alt="visualizer gif" /></a>
              </div>
              <div className="projectbox3">
                <div className="normalicon">
                  <img src="/unity.svg" alt="unity" />
                </div>
                <div className="normalicon">
                  <img src="/csharp.svg" alt="c#" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row row-2">
          <div className="col col-1">
            <div className="col-box">
              <div className="musicbox">
                <a href="https://soundcloud.com/fr31tagabend" target="_blank"><img src="/fr31tagabend.jpg" alt="fr31tagabend avatar"/></a>
                <div className="musictext">
                  <h1>freitagabend</h1>
                  <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae quo dignissimos distinctio unde, optio perspiciatis nihil adipisci magni.</p>
                </div>
              </div>
            </div>
            <div className="col-box">
              <div className="musicbox">
                <a href="https://linktr.ee/wh01sme" target="_blank"><img src="/wh01sme.jpg" alt="wh01sme avatar"/></a>
                <div className="musictext">
                  <h1>wh01sme</h1>
                  <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae quo dignissimos distinctio unde, optio perspiciatis nihil adipisci magni.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-2">
            <div className="col-box">
              <div className="projectbox1">
                <h1>icontale</h1>
              </div>
              <div className="projectbox2">
                <a href="http://github.com/pett1c/" target="_blank"><img src="" alt="icontale gif" /></a>
              </div>
              <div className="projectbox3">
                <div className="normalicon">
                  <img src="/html5.svg" alt="html" />
                </div>
                <div className="normalicon">
                  <img src="/css3.svg" alt="css" />
                </div>
                <div className="normalicon">
                  <img src="/javascript.svg" alt="javascript" />
                </div>
                <div className="normalicon">
                  <img src="/nodejs.svg" alt="nodejs" />
                </div>
              </div>
            </div>
            <div className="col-box">
              <div className="projectbox1">
                <h1>quiz</h1>
              </div>
              <div className="projectbox2">
                <a href="http://github.com/pett1c/" target="_blank"><img src="" alt="wirtschaftsquiz gif" /></a>
              </div>
              <div className="projectbox3">
                <div className="normalicon">
                  <img src="/html5.svg" alt="html" />
                </div>
                <div className="normalicon">
                  <img src="/css3.svg" alt="css" />
                </div>
                <div className="normalicon">
                  <img src="/javascript.svg" alt="javascript" />
                </div>
                <div className="normalicon">
                  <img src="/nodejs.svg" alt="nodejs" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row row-3">
          <div className="col col-1">
            <div className="col-box-big">
              <AudioVisualizer />
            </div>
            <div className="col-box">
              <div className="contacticons">
                <a className="linkedin" href="#" target="_blank" rel="noopener noreferrer"><img src="/linkedin.svg" alt="linkedin" /></a>
                <a className="github" href="#" target="_blank" rel="noopener noreferrer"><img src="/github.svg" alt="github" /></a>
                <a className="instagram" href="#" target="_blank" rel="noopener noreferrer"><img src="/instagram.svg" alt="instagram" /></a>
                <a className="gmail" href="#" target="_blank" rel="noopener noreferrer"><img src="/gmail.svg" alt="gmail" /></a>
                <a className="telegram" href="#" target="_blank" rel="noopener noreferrer"><img src="/telegram.svg" alt="telegram" /></a>
                <a className="discord" href="#" target="_blank" rel="noopener noreferrer"><img src="/discord.svg" alt="discord" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
