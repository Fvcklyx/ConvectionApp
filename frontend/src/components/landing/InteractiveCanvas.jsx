import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function SceneTransform({ values, children }) {
  const group = useRef(null)
  useFrame(() => { if (!group.current) return; group.current.rotation.y = values.rotation.get(); group.current.scale.setScalar(values.scale.get()) })
  return <group ref={group}>{children}</group>
}

function Garment({ pointer, rotation, detail }) {
  const group = useRef(null)
  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.x += (pointer.current.y * 0.2 - group.current.rotation.x) * delta * 5
    group.current.rotation.y += (pointer.current.x * 0.35 + rotation.current - group.current.rotation.y) * delta * 4
  })
  const color = detail ? '#9bb5ff' : '#315cff'
  return <group ref={group} scale={detail ? 1.08 : 1}><mesh castShadow scale={[1.3, 1.45, 0.42]}><sphereGeometry args={[1, 32, 24]} /><meshStandardMaterial color={color} roughness={detail ? 0.22 : 0.38} metalness={0.08} /></mesh><mesh position={[-1.3, 0.35, 0]} rotation={[0, 0, -0.24]} castShadow><capsuleGeometry args={[0.34, 1.25, 8, 16]} /><meshStandardMaterial color={color} roughness={0.4} /></mesh><mesh position={[1.3, 0.35, 0]} rotation={[0, 0, 0.24]} castShadow><capsuleGeometry args={[0.34, 1.25, 8, 16]} /><meshStandardMaterial color={color} roughness={0.4} /></mesh><mesh position={[0, 1.1, 0.38]}><torusGeometry args={[0.35, 0.08, 12, 32]} /><meshStandardMaterial color="#e8f5ff" roughness={0.25} /></mesh></group>
}

class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError?.()
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export default function InteractiveCanvas({ values, pointer, rotation, detail, onReady, onError, fallback }) {
  const desktop = window.matchMedia('(min-width: 801px)').matches
  return <WebGLErrorBoundary onError={onError} fallback={fallback}><Canvas dpr={[0.8, 1.25]} shadows={desktop} camera={{ position: [0, 0.2, 5.2], fov: 38 }} onCreated={onReady}><ambientLight intensity={1.35} /><directionalLight position={[3, 4, 5]} intensity={2.5} castShadow={desktop} /><pointLight position={[-3, 1, 2]} color="#9bb5ff" intensity={3.5} /><SceneTransform values={values}><Garment pointer={pointer} rotation={rotation} detail={detail} /></SceneTransform></Canvas></WebGLErrorBoundary>
}
