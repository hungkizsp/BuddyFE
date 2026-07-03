import { Canvas } from '@react-three/fiber';
import BuddyCharacter from './BuddyCharacter';

export default function AdventureScene({ gameState, onArrivedAtTable, buddyPosition }) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        shadows
      >
        {/* Soft atmospheric lighting */}
        <ambientLight intensity={1.4} color="#fffbf0" />
        
        {/* Sun-like light from the window/upper-right */}
        <directionalLight
          position={[6, 8, 4]}
          intensity={1.8}
          color="#fff2d1"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Fill light from the left side to highlight the mesh */}
        <directionalLight 
          position={[-6, 2, 2]} 
          intensity={0.6} 
          color="#e0f2fe" 
        />

        {/* Character Node */}
        <BuddyCharacter 
          gameState={gameState} 
          onArrivedAtTable={onArrivedAtTable}
          position={buddyPosition}
        />
      </Canvas>
    </div>
  );
}
