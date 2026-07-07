import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

export default function BuddyModel(props) {
  const group = useRef();
  
  // Load file 3D (Đường dẫn tính từ thư mục public)
  const { nodes, materials, animations } = useGLTF('/models/Meshy_AI_demo1_biped/Meshy_AI_demo1_biped_Animation_Idle_15_withSkin.glb');
  
  // Lấy các animation có trong file
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Chạy animation mặc định (Idle)
    const actionName = Object.keys(actions)[0]; 
    if (actionName && actions[actionName]) {
      actions[actionName].reset().fadeIn(0.5).play();
    }
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      {/* 
        Meshy AI models usually have 'nodes.Scene' or 'nodes.Root'
      */}
      <primitive object={nodes.Scene || nodes.Root || nodes.Sketchfab_model || Object.values(nodes).find(n => n.type === 'Group' || n.type === 'Object3D')} />
    </group>
  );
}

// Preload model
useGLTF.preload('/models/Meshy_AI_demo1_biped/Meshy_AI_demo1_biped_Animation_Idle_15_withSkin.glb');
