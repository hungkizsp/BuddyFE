import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import planetGlb from '../../../assets/Meshy_AI_demo1_biped/Food-Forest-Planet.glb?url'

export default function FoodForestWorld3D(props) {
  const groupRef = useRef()
  const gltf = useGLTF(planetGlb)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={groupRef} {...props} dispose={null} scale={1}>
      <primitive object={gltf.scene} />
    </group>
  )
}

useGLTF.preload(planetGlb)
