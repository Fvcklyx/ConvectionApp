import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const clamp01 = (v) => Math.min(1, Math.max(0, v))

function sample(keys, p) {
  if (!keys || !keys.length) return 0
  if (p <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i += 1) {
    const [p0, v0] = keys[i - 1]
    const [p1, v1] = keys[i]
    if (p <= p1) return v0 + (v1 - v0) * ((p - p0) / (p1 - p0))
  }
  return keys[keys.length - 1][1]
}

function sampleColor(keys, p) {
  if (!keys || !keys.length) return new THREE.Color('#315cff')
  if (p <= keys[0][0]) return new THREE.Color(keys[0][1])
  for (let i = 1; i < keys.length; i += 1) {
    const [p0, c0] = keys[i - 1]
    const [p1, c1] = keys[i]
    if (p <= p1) {
      const t = (p - p0) / (p1 - p0)
      return new THREE.Color(c0).lerp(new THREE.Color(c1), t)
    }
  }
  return new THREE.Color(keys[keys.length - 1][1])
}

const K = {
  camZ: [[0, 7.6], [0.05, 7.2], [0.12, 6.7], [0.2, 6.1], [0.28, 5.6], [0.36, 5.1], [0.44, 4.6], [0.52, 4.2], [0.6, 3.8], [0.68, 3.4], [0.76, 3.1], [0.8, 3.3], [0.85, 4.0], [0.92, 4.8], [1, 5.0]],
  camY: [[0, 0.1], [0.5, 0], [1, 0.25]],
  camRX: [[0, 0.02], [0.6, 0.07], [1, -0.02]],
  scale: [[0, 0.6], [0.12, 0.72], [0.2, 0.82], [0.28, 0.9], [0.36, 0.97], [0.44, 1.0], [0.52, 1.06], [0.6, 1.14], [0.68, 1.22], [0.76, 1.55], [0.8, 1.35], [0.86, 1.0], [0.94, 0.82], [1, 0.85]],
  posY: [[0, -0.15], [0.5, -0.2], [1, -0.05]],
  posZ: [[0, 0], [0.76, 0.75], [0.8, 0.3], [1, 0]],
  rotY: [[0, 0], [0.2, 0.2], [0.5, 0.9], [0.7, 1.4], [0.8, 1.2], [1, 0.5]],
  fabric: [[0, 0.5], [0.08, 0.85], [0.16, 0.5], [0.26, 0.1], [0.5, 0.08], [0.56, 0.85], [0.66, 0.2], [1, 0.06]],
  thread: [[0, 0], [0.06, 1], [0.32, 1], [0.4, 0], [0.42, 0], [0.5, 1], [0.66, 1], [0.74, 0], [1, 0]],
  particle: [[0, 1], [1, 0.55]],
  key: [[0, 2.1], [0.5, 1.8], [1, 1.5]],
  fill: [[0, 0.7], [1, 1.0]],
  garment: [[0, '#5b7fff'], [0.25, '#4167f0'], [0.5, '#315cff'], [0.7, '#274cd6'], [0.85, '#2e5cf0'], [1, '#2563eb']],
  trim: [[0, '#9db8ff'], [0.85, '#9db8ff'], [1, '#ffe3a0']],
  bg: [[0, '#05070c'], [0.3, '#070c16'], [0.6, '#060a12'], [1, '#04060c']],
}

const LOOK_AT = new THREE.Vector3(0, 0, 0)

function CameraRig({ state, pointer, reduced }) {
  const bgRef = useRef(null)
  const keyRef = useRef(null)
  const fillRef = useRef(null)
  const rimRef = useRef(null)
  useFrame(({ camera }, delta) => {
    const p = reduced ? 0.72 : clamp01(state.v)
    const damp = 1 - Math.exp(-3.2 * delta)
    const mx = (pointer.current.x || 0) * 0.5
    const my = (pointer.current.y || 0) * 0.35
    camera.position.x += (mx - camera.position.x) * damp
    camera.position.y += (sample(K.camY, p) + my - camera.position.y) * damp
    camera.position.z += (sample(K.camZ, p) - camera.position.z) * damp
    camera.rotation.x = sample(K.camRX, p)
    camera.lookAt(LOOK_AT)
    if (bgRef.current) bgRef.current.set(sampleColor(K.bg, p))
    if (keyRef.current) {
      keyRef.current.intensity = sample(K.key, p)
      keyRef.current.color.copy(sampleColor(K.garment, p))
    }
    if (fillRef.current) fillRef.current.intensity = sample(K.fill, p)
    if (rimRef.current) rimRef.current.color.copy(sampleColor(K.trim, p))
  })
  return (
    <>
      <color attach="background" ref={bgRef} args={['#05070c']} />
      <fog attach="fog" args={['#05070c', 9, 18]} />
      <ambientLight intensity={0.5} />
      <directionalLight ref={keyRef} position={[4, 5, 6]} intensity={2.1} castShadow />
      <pointLight ref={fillRef} position={[-4, 1, 3]} intensity={0.7} color="#3d66f0" />
      <pointLight ref={rimRef} position={[0, 2, -3]} intensity={1.7} />
    </>
  )
}

function usePrintTexture(color) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 256, 256)
    ctx.strokeStyle = color
    ctx.lineWidth = 12
    ctx.beginPath()
    ctx.arc(128, 128, 88, 0, Math.PI * 2)
    ctx.stroke()
    ctx.font = '900 104px Poppins, Arial, sans-serif'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('F', 128, 130)
    const texture = new THREE.CanvasTexture(canvas)
    texture.anisotropy = 4
    return texture
  }, [color])
}

function Garment({ state, pointer, spin, reduced }) {
  const group = useRef(null)
  const body = useRef(null)
  const printMat = useRef(null)
  const printTex = usePrintTexture('#0b0f1a')
  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const p = reduced ? 0.72 : clamp01(state.v)
    const targetScale = sample(K.scale, p)
    g.position.set(0, sample(K.posY, p), sample(K.posZ, p))
    g.scale.setScalar(targetScale)
    const targetRotY = sample(K.rotY, p) + (pointer.current.x || 0) * 0.25
    g.rotation.y += (targetRotY - g.rotation.y) * (1 - Math.exp(-2.4 * delta)) + (spin.current || 0)
    spin.current *= 1 - Math.min(1, 2.6 * delta)
    g.rotation.x += ((pointer.current.y || 0) * -0.18 - g.rotation.x) * (1 - Math.exp(-3 * delta))
    if (body.current) body.current.material.color.copy(sampleColor(K.garment, p))
    if (printMat.current) printMat.current.opacity = p > 0.16 && p < 0.9 ? 1 : 0.4
  })
  return (
    <group ref={group}>
      <mesh ref={body} castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.78, 1.0, 12, 28]} />
        <meshStandardMaterial color="#315cff" roughness={0.45} metalness={0.06} />
      </mesh>
      <mesh castShadow position={[-1.28, 0.42, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.3, 1.25, 10, 20]} />
        <meshStandardMaterial color="#4167f0" roughness={0.5} metalness={0.05} />
      </mesh>
      <mesh castShadow position={[1.28, 0.42, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.3, 1.25, 10, 20]} />
        <meshStandardMaterial color="#4167f0" roughness={0.5} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.28, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.12, 12, 28]} />
        <meshStandardMaterial color="#eaf0ff" roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.55, 0.5]}>
        <boxGeometry args={[0.8, 0.52, 0.08]} />
        <meshStandardMaterial ref={printMat} color="#0b0f1a" roughness={0.4} map={printTex} transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

function FabricPlane({ state, reduced }) {
  const mesh = useRef(null)
  const mat = useRef(null)
  useFrame((sceneState) => {
    const m = mesh.current
    if (!m) return
    const p = reduced ? 0.72 : clamp01(state.v)
    const opacity = sample(K.fabric, p)
    m.visible = opacity > 0.03
    if (mat.current) {
      mat.current.opacity = opacity
      mat.current.color.set('#223e9e')
    }
    m.scale.setScalar(0.8 + opacity * 0.6)
    const pos = m.geometry.attributes.position
    const t = sceneState.clock.elapsedTime
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      pos.setZ(i, Math.sin(x * 0.7 + t * 1.1) * 0.16 + Math.cos(y * 0.8 + t * 0.9) * 0.14)
    }
    pos.needsUpdate = true
  })
  return (
    <mesh ref={mesh} rotation={[-0.4, 0.35, 0]} position={[0, 0, -1.8]}>
      <planeGeometry args={[9, 7, 42, 30]} />
      <meshStandardMaterial ref={mat} color="#223e9e" side={THREE.DoubleSide} transparent roughness={0.85} opacity={0.5} />
    </mesh>
  )
}

function Threads({ state, reduced }) {
  const group = useRef(null)
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: '#7ea6ff', transparent: true, opacity: 0.8 }), [])
  useFrame((sceneState) => {
    const g = group.current
    if (!g) return
    const p = reduced ? 0.72 : clamp01(state.v)
    const opacity = sample(K.thread, p)
    material.opacity = opacity
    g.visible = opacity > 0.03
    g.rotation.z = sceneState.clock.elapsedTime * 0.15
  })
  return (
    <group ref={group}>
      {[-1.6, 0, 1.6].map((x) => (
        <mesh key={x} position={[x, 0, 0.2]} rotation={[0, 0, Math.PI / 2]} material={material}>
          <cylinderGeometry args={[0.02, 0.02, 12, 8]} />
        </mesh>
      ))}
    </group>
  )
}

function Particles({ state, reduced }) {
  const points = useRef(null)
  const material = useMemo(() => new THREE.PointsMaterial({
    color: '#8fb0ff', size: 0.03, sizeAttenuation: true, transparent: true,
    opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending,
  }), [])
  const geometry = useMemo(() => {
    const count = 140
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 14
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return geo
  }, [])
  useFrame((sceneState) => {
    const p = reduced ? 0.72 : clamp01(state.v)
    material.opacity = sample(K.particle, p) * 0.7
    if (points.current) points.current.rotation.y = sceneState.clock.elapsedTime * 0.02
  })
  return <points ref={points} geometry={geometry} material={material} />
}

function Floor() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(24, 24, new THREE.Color('#20336b'), new THREE.Color('#0d1526'))
    g.material.transparent = true
    g.material.opacity = 0.35
    g.position.y = -2.4
    return g
  }, [])
  return <primitive object={grid} />
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

export default function CinematicWorld({ progressRef, pointer, spin, reduced, onReady, onError, fallback }) {
  const desktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 801px)').matches
  return (
    <WebGLErrorBoundary onError={onError} fallback={fallback}>
      <Canvas
        dpr={[0.7, desktop ? 1.25 : 1]}
        shadows={desktop}
        camera={{ position: [0, 0.2, 7.6], fov: 40 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={onReady}
      >
        <CameraRig state={progressRef} pointer={pointer} reduced={reduced} />
        <Garment state={progressRef} pointer={pointer} spin={spin} reduced={reduced} />
        <FabricPlane state={progressRef} reduced={reduced} />
        <Threads state={progressRef} reduced={reduced} />
        <Particles state={progressRef} reduced={reduced} />
        <Floor />
      </Canvas>
    </WebGLErrorBoundary>
  )
}
