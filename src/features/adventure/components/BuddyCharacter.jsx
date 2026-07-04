import { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

import idleGlb from '../../../assets/Meshy_AI_demo1_biped/Meshy_AI_Animation_Idle_12_withSkin.glb?url';
import waveGlb from '../../../assets/Meshy_AI_demo1_biped/wave.glb?url';
export default function BuddyCharacter({ gameState, onArrivedAtTable, position }) {
  const groupRef = useRef();
  const idleGltf = useGLTF(idleGlb);
  const idleClip = useMemo(() => {
    const clip = idleGltf.animations[0]?.clone();
    if (clip) clip.name = 'idle';
    return clip;
  }, [idleGltf.animations]);

  const { actions } = useAnimations([idleClip].filter(Boolean), groupRef);

  useEffect(() => {
    actions.idle?.reset().fadeIn(0.2).play();

    return () => {
      actions.idle?.fadeOut(0.2);
    };
  }, [actions]);

  useEffect(() => {
    if (gameState === 'walking-to-table') {
      onArrivedAtTable();
    }
  }, [gameState, onArrivedAtTable]);

  return (
    <group
      ref={groupRef}
      position={position || [-0.6, -1.8, 0]}
      rotation={[0, -0.1, 0]}
      scale={[1.3, 1.3, 1.3]}
      dispose={null}
    >
      <primitive object={idleGltf.scene} />
    </group>
  );
}

useGLTF.preload(idleGlb);
