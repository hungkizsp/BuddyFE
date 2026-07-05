import { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from "three";
import idleGlb from '../../../assets/Meshy_AI_demo1_biped/Meshy_AI_Animation_Idle_12_withSkin.glb?url';
import waveGlb from '../../../assets/Meshy_AI_demo1_biped/wave.glb?url';
export default function BuddyCharacter({ gameState, onArrivedAtTable, position, scale }) {
  const groupRef = useRef();
  const idleGltf = useGLTF(idleGlb);
  const waveGltf = useGLTF(waveGlb);
  const idleClip = useMemo(() => {
    const clip = idleGltf.animations[0]?.clone();
    if (clip) clip.name = 'idle';
    return clip;
  }, [idleGltf.animations]);
  const waveClip = useMemo(() => {
    const clip = waveGltf.animations[0]?.clone();
    if (clip) clip.name = "wave";
    return clip;
  }, [waveGltf.animations]);

  const { actions } = useAnimations(
    [idleClip, waveClip].filter(Boolean),
    groupRef
  );

  useEffect(() => {
    if (!actions) return;

    if (gameState === "completed") {
      actions.idle?.fadeOut(0.2);

      actions.wave
        ?.reset()
        .setLoop(THREE.LoopRepeat)
        .fadeIn(0.2)
        .play();
    } else {
      actions.wave?.fadeOut(0.2);

      actions.idle
        ?.reset()
        .fadeIn(0.2)
        .play();
    }

    return () => {
      actions.idle?.stop();
      actions.wave?.stop();
    };
  }, [actions, gameState]);

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
      scale={scale ? [scale, scale, scale] : [1.3, 1.3, 1.3]}
      dispose={null}
    >
      <primitive object={idleGltf.scene} />
    </group>
  );
}
useGLTF.preload(idleGlb);
useGLTF.preload(waveGlb);
