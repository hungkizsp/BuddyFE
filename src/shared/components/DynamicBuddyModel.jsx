import { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

/**
 * DynamicBuddyModel - loads any GLB model dynamically from a given URL/path.
 * Falls back to the default Buddy model if no modelPath is provided.
 */
export default function DynamicBuddyModel({ modelPath, scale = 2, position = [0, -1.2, 0], ...props }) {
  const group = useRef()
  const effectivePath = modelPath || '/models/Meshy_AI_demo1_biped/Meshy_AI_demo1_biped_Animation_Idle_15_withSkin.glb'

  const { nodes, animations } = useGLTF(effectivePath)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    // Play the first available animation (idle)
    const actionName = Object.keys(actions)[0]
    if (actionName && actions[actionName]) {
      actions[actionName].reset().fadeIn(0.5).play()
    }
  }, [actions])

  const sceneNode =
    nodes?.Scene ||
    nodes?.Root ||
    nodes?.Sketchfab_model ||
    Object.values(nodes || {}).find(n => n.type === 'Group' || n.type === 'Object3D')

  if (!sceneNode) return null

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={sceneNode} scale={scale} position={position} />
    </group>
  )
}
