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
  if (!keys || !keys.length) return new THREE.Color('#2563eb')
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
  camZ: [
    [0, 8.2],
    [0.15, 7.2],
    [0.35, 6.4],
    [0.55, 5.6],
    [0.72, 4.4],
    [0.82, 3.8],
    [1, 5.4],
  ],
  camY: [
    [0, 0.4],
    [0.3, 0.1],
    [0.7, -0.1],
    [1, 0.3],
  ],
  camRX: [
    [0, -0.04],
    [0.35, 0.06],
    [0.7, 0.08],
    [1, -0.02],
  ],
  portalScale: [
    [0, 0.9],
    [0.35, 1.0],
    [0.72, 1.25],
    [1, 0.95],
  ],
  portalBreakoutZ: [
    [0, 0],
    [0.3, 0.2],
    [0.5, 0.6],
    [0.72, 1.6],
    [0.85, 1.2],
    [1, 0.4],
  ],
  garmentScale: [
    [0, 0.45],
    [0.2, 0.65],
    [0.4, 0.85],
    [0.72, 1.32],
    [0.85, 1.15],
    [1, 0.9],
  ],
  rotY: [
    [0, -0.2],
    [0.25, 0.3],
    [0.5, 0.8],
    [0.72, 1.4],
    [0.85, 0.9],
    [1, 0.3],
  ],
  fabricOp: [
    [0, 0.8],
    [0.2, 0.7],
    [0.35, 0.15],
    [0.5, 0],
    [1, 0],
  ],
  patternOp: [
    [0, 0],
    [0.18, 0.9],
    [0.4, 0.8],
    [0.55, 0.1],
    [1, 0],
  ],
  screenPrintOp: [
    [0, 0],
    [0.38, 0],
    [0.48, 0.9],
    [0.62, 0.7],
    [0.75, 0.1],
    [1, 0],
  ],
  garmentOp: [
    [0, 0.1],
    [0.25, 0.4],
    [0.55, 0.95],
    [0.72, 1.0],
    [1, 0.9],
  ],
  keyIntensity: [
    [0, 2.4],
    [0.5, 2.8],
    [0.72, 3.2],
    [1, 2.0],
  ],
  brandGlow: [
    [0, '#2563eb'],
    [0.35, '#0ea5e9'],
    [0.72, '#3b82f6'],
    [1, '#2563eb'],
  ],
}

const LOOK_AT = new THREE.Vector3(0, 0, 0)

function CameraRig({ state, pointer, reduced }) {
  const bgRef = useRef(null)
  const keyRef = useRef(null)
  const rimRef = useRef(null)

  useFrame(({ camera }, delta) => {
    const p = reduced ? 0.72 : clamp01(state.v)
    const damp = 1 - Math.exp(-3.5 * delta)
    const mx = (pointer.current.x || 0) * 0.55
    const my = (pointer.current.y || 0) * 0.4

    camera.position.x += (mx - camera.position.x) * damp
    camera.position.y += (sample(K.camY, p) + my - camera.position.y) * damp
    camera.position.z += (sample(K.camZ, p) - camera.position.z) * damp
    camera.rotation.x = sample(K.camRX, p)
    camera.lookAt(LOOK_AT)

    if (keyRef.current) {
      keyRef.current.intensity = sample(K.keyIntensity, p)
      keyRef.current.color.copy(sampleColor(K.brandGlow, p))
    }
  })

  return (
    <>
      <color attach="background" ref={bgRef} args={['#05070c']} />
      <fog attach="fog" args={['#05070c', 9, 20]} />
      <ambientLight intensity={0.65} />
      <directionalLight ref={keyRef} position={[4, 5, 6]} intensity={2.6} castShadow />
      <pointLight position={[-4, 2, 4]} intensity={1.2} color="#0ea5e9" />
      <pointLight ref={rimRef} position={[0, 3, -3.5]} intensity={2.2} color="#93c5fd" />
    </>
  )
}

function PhysicalPortalFrame({ state, reduced }) {
  const portalRef = useRef(null)

  useFrame(() => {
    if (!portalRef.current) return
    const p = reduced ? 0.72 : clamp01(state.v)
    const s = sample(K.portalScale, p)
    portalRef.current.scale.set(s, s, s)
  })

  return (
    <group ref={portalRef} position={[0, 0, -0.4]}>
      {/* Outer Industrial Boundary Frame */}
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[6.2, 0.08, 0.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -2.2, 0]}>
        <boxGeometry args={[6.2, 0.08, 0.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-3.1, 0, 0]}>
        <boxGeometry args={[0.08, 4.48, 0.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[3.1, 0, 0]}>
        <boxGeometry args={[0.08, 4.48, 0.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Internal Neon Rim Guide (GSM Primary Blue) */}
      <lineSegments position={[0, 0, 0.02]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(6.0, 4.2)]} />
        <lineBasicMaterial color="#3b82f6" linewidth={2} transparent opacity={0.45} />
      </lineSegments>

      {/* Frosted Glass Backing depth illusion */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[6.0, 4.2]} />
        <meshStandardMaterial
          color="#070c18"
          roughness={0.6}
          metalness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

function useBrandGraphicTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 512, 512)

    // Outer Emblem
    ctx.strokeStyle = '#2563eb'
    ctx.lineWidth = 14
    ctx.beginPath()
    ctx.arc(256, 256, 190, 0, Math.PI * 2)
    ctx.stroke()

    // Inner Emblem Rim
    ctx.strokeStyle = '#0ea5e9'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(256, 256, 170, 0, Math.PI * 2)
    ctx.stroke()

    // Bold Signature F Mark
    ctx.font = '900 240px Poppins, Arial, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('F', 256, 260)

    // Subtitle Badge
    ctx.font = '800 32px Poppins, Arial, sans-serif'
    ctx.fillStyle = '#93c5fd'
    ctx.fillText('CONVECTION', 256, 390)

    const tex = new THREE.CanvasTexture(canvas)
    tex.anisotropy = 4
    return tex
  }, [])
}

function Garment3D({ state, pointer, spin, reduced }) {
  const group = useRef(null)
  const bodyRef = useRef(null)
  const graphicRef = useRef(null)
  const brandTex = useBrandGraphicTexture()

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const p = reduced ? 0.72 : clamp01(state.v)

    // Scale & Position including dramatic BREAKOUT forward (+Z)
    const targetScale = sample(K.garmentScale, p)
    const breakoutZ = sample(K.portalBreakoutZ, p)
    g.position.set(0, -0.05, breakoutZ)
    g.scale.setScalar(targetScale)

    // Interactive rotation with pointer & spin inertia
    const baseRotY = sample(K.rotY, p)
    const pointerRotY = (pointer.current.x || 0) * 0.35
    g.rotation.y += (baseRotY + pointerRotY - g.rotation.y) * (1 - Math.exp(-2.6 * delta)) + (spin.current || 0)
    spin.current *= 1 - Math.min(1, 2.5 * delta)
    g.rotation.x += (((pointer.current.y || 0) * -0.2) - g.rotation.x) * (1 - Math.exp(-3 * delta))

    // Dynamic color & opacity based on progress
    const garmentOpacity = sample(K.garmentOp, p)
    if (bodyRef.current) {
      bodyRef.current.material.opacity = garmentOpacity
      bodyRef.current.material.color.copy(sampleColor(K.brandGlow, p))
    }
    if (graphicRef.current) {
      graphicRef.current.material.opacity = garmentOpacity * 0.95
    }
  })

  return (
    <group ref={group}>
      {/* Torso / Body */}
      <mesh ref={bodyRef} castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.76, 1.05, 16, 32]} />
        <meshStandardMaterial
          color="#2563eb"
          roughness={0.4}
          metalness={0.08}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Left Sleeve */}
      <mesh castShadow position={[-1.24, 0.44, 0]} rotation={[0, 0, -0.32]}>
        <capsuleGeometry args={[0.29, 1.25, 12, 24]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.42} metalness={0.06} />
      </mesh>

      {/* Right Sleeve */}
      <mesh castShadow position={[1.24, 0.44, 0]} rotation={[0, 0, 0.32]}>
        <capsuleGeometry args={[0.29, 1.25, 12, 24]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.42} metalness={0.06} />
      </mesh>

      {/* Ribbed Collar */}
      <mesh position={[0, 1.34, 0.38]} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[0.42, 0.1, 14, 32]} />
        <meshStandardMaterial color="#e0e7ff" roughness={0.25} />
      </mesh>

      {/* Front Chest Custom Graphic Plate */}
      <mesh ref={graphicRef} position={[0, 0.15, 0.72]}>
        <planeGeometry args={[0.75, 0.75]} />
        <meshStandardMaterial
          map={brandTex}
          transparent
          roughness={0.3}
          metalness={0.1}
          opacity={0.95}
        />
      </mesh>
    </group>
  )
}

function StagePatternCutting({ state, reduced }) {
  const group = useRef(null)

  useFrame((sceneState) => {
    if (!group.current) return
    const p = reduced ? 0.72 : clamp01(state.v)
    const op = sample(K.patternOp, p)
    group.current.visible = op > 0.02
    group.current.position.y = Math.sin(sceneState.clock.elapsedTime * 1.5) * 0.05
  })

  return (
    <group ref={group} position={[0, 0, 0.3]}>
      {/* Pattern Blueprint Pieces */}
      <lineSegments position={[-1.4, 0.2, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 1.6)]} />
        <lineBasicMaterial color="#0ea5e9" linewidth={2} />
      </lineSegments>
      <lineSegments position={[1.4, 0.2, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 1.6)]} />
        <lineBasicMaterial color="#0ea5e9" linewidth={2} />
      </lineSegments>
      {/* Cutting Laser Scan Beam */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[4.2, 0.02, 0.02]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
  )
}

function StageFabricRaw({ state, reduced }) {
  const mesh = useRef(null)

  useFrame((sceneState) => {
    if (!mesh.current) return
    const p = reduced ? 0.72 : clamp01(state.v)
    const op = sample(K.fabricOp, p)
    mesh.current.visible = op > 0.02
    mesh.current.material.opacity = op * 0.75

    // Cloth ripple simulation
    const pos = mesh.current.geometry.attributes.position
    const t = sceneState.clock.elapsedTime
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      pos.setZ(i, Math.sin(x * 1.1 + t * 1.6) * 0.18 + Math.cos(y * 1.2 + t * 1.4) * 0.15)
    }
    pos.needsUpdate = true
  })

  return (
    <mesh ref={mesh} rotation={[-0.4, 0.3, 0]} position={[0, 0, -1.2]}>
      <planeGeometry args={[8.5, 6.5, 36, 26]} />
      <meshStandardMaterial
        color="#1d4ed8"
        side={THREE.DoubleSide}
        transparent
        roughness={0.8}
        opacity={0.7}
      />
    </mesh>
  )
}

function WorkshopParticles() {
  const points = useRef(null)

  const { geo, mat } = useMemo(() => {
    const count = 180
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 16
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    const material = new THREE.PointsMaterial({
      color: '#93c5fd',
      size: 0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { geo: geometry, mat: material }
  }, [])

  useFrame((sceneState) => {
    if (points.current) {
      points.current.rotation.y = sceneState.clock.elapsedTime * 0.03
    }
  })

  return <points ref={points} geometry={geo} material={mat} />
}

function WorkshopReflectiveFloor() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(26, 26, new THREE.Color('#2563eb'), new THREE.Color('#0f172a'))
    g.material.transparent = true
    g.material.opacity = 0.4
    g.position.y = -2.25
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
        camera={{ position: [0, 0.4, 8.2], fov: 42 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={onReady}
      >
        <CameraRig state={progressRef} pointer={pointer} reduced={reduced} />
        <PhysicalPortalFrame state={progressRef} reduced={reduced} />
        <Garment3D state={progressRef} pointer={pointer} spin={spin} reduced={reduced} />
        <StagePatternCutting state={progressRef} reduced={reduced} />
        <StageFabricRaw state={progressRef} reduced={reduced} />
        <WorkshopParticles state={progressRef} reduced={reduced} />
        <WorkshopReflectiveFloor />
      </Canvas>
    </WebGLErrorBoundary>
  )
}
