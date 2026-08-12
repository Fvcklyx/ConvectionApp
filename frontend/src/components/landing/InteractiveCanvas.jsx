import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function SceneTransform({ values, children }) {
  const group = useRef(null)
  useFrame(() => { if (!group.current) return; group.current.rotation.y = values.rotation.get(); group.current.scale.setScalar(values.scale.get()) })
  return <group ref={group}>{children}</group>
}

function Fabric({ color, roughness = 0.42 }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={0.03} />
}

function Garment({ pointer, rotation, detail }) {
  const group = useRef(null)
  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.x += (pointer.current.y * 0.16 - group.current.rotation.x) * delta * 5
    group.current.rotation.y += (pointer.current.x * 0.28 + rotation.current - group.current.rotation.y) * delta * 4
  })
  const color = detail ? '#7897ff' : '#315cff'
  return <group ref={group} scale={detail ? 1.08 : 1}>
    <mesh castShadow scale={[1.28, 1.42, 0.48]} position={[0, -0.05, 0]}><sphereGeometry args={[1, 36, 28]} /><Fabric color={color} roughness={detail ? 0.28 : undefined} /></mesh>
    <mesh castShadow position={[-1.22, 0.35, 0]} rotation={[0, 0, -0.25]}><capsuleGeometry args={[0.29, 1.3, 10, 18]} /><Fabric color={color} /></mesh>
    <mesh castShadow position={[1.22, 0.35, 0]} rotation={[0, 0, 0.25]}><capsuleGeometry args={[0.29, 1.3, 10, 18]} /><Fabric color={color} /></mesh>
    <mesh position={[0, 1.05, 0.43]}><torusGeometry args={[0.36, 0.09, 14, 32]} /><Fabric color="#e8f5ff" roughness={0.25} /></mesh>
    <mesh position={[0, -0.45, 0.5]}><boxGeometry args={[0.72, 0.48, 0.08]} /><Fabric color={detail ? '#a9bbff' : '#2346c7'} /></mesh>
    <mesh position={[0, 0.1, 0.5]}><torusGeometry args={[0.12, 0.025, 8, 20]} /><Fabric color="#e8f5ff" roughness={0.3} /></mesh>
  </group>
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
  return <WebGLErrorBoundary onError={onError} fallback={fallback}><Canvas dpr={[0.8, 1.25]} shadows={desktop} camera={{ position: [0, 0.1, 5.4], fov: 36 }} onCreated={onReady} gl={{ antialias: true, powerPreference: 'high-performance' }}><ambientLight intensity={1.25} /><directionalLight position={[3, 4, 5]} intensity={2.4} castShadow={desktop} /><pointLight position={[-3, 1, 2]} color="#9bb5ff" intensity={3.2} /><SceneTransform values={values}><Garment pointer={pointer} rotation={rotation} detail={detail} /></SceneTransform></Canvas></WebGLErrorBoundary>
}
