"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float } from "@react-three/drei"
import { Suspense, useMemo, useRef } from "react"
import * as THREE from "three"
import { motion } from "framer-motion"
import Typewriter from "@/components/animations/typewriter"

function Tree({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const matFoliage = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2d7a56", roughness: 0.9, metalness: 0.0 }),
    [],
  )
  const matTrunk = useMemo(() => new THREE.MeshStandardMaterial({ color: "#6b4f3b", roughness: 1 }), [])
  return (
    <group position={position as any} scale={scale}>
      <mesh material={matFoliage} castShadow>
        <icosahedronGeometry args={[1, 0]} />
      </mesh>
      <mesh position={[0, -1.2, 0]} material={matTrunk} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 6]} />
      </mesh>
    </group>
  )
}

function Skyline() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#bcd3d7", roughness: 0.6, metalness: 0.2 }), [])
  const buildings = useMemo(() => {
    const arr: { pos: [number, number, number]; sx: number; sy: number; sz: number }[] = []
    const rows = 24
    for (let i = 0; i < rows; i++) {
      const x = -18 + Math.random() * 36
      const z = -35 - Math.random() * 20
      const h = 3 + Math.random() * 10
      const w = 0.6 + Math.random() * 1.6
      const d = 0.6 + Math.random() * 1.6
      arr.push({ pos: [x, h / 2 - 0.2, z], sx: w, sy: h, sz: d })
    }
    return arr
  }, [])
  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.pos as any} material={mat} receiveShadow castShadow>
          <boxGeometry args={[b.sx, b.sy, b.sz]} />
        </mesh>
      ))}
    </group>
  )
}

function LeavesField({ count = 180 }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const speeds = useMemo(() => Float32Array.from({ length: count }, () => 0.3 + Math.random() * 0.7), [count])
  const offsets = useMemo(() => Float32Array.from({ length: count }, () => Math.random() * Math.PI * 2), [count])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const radius = 18 + Math.sin(t * 0.08 + offsets[i]) * 2
      const angle = (i / count) * Math.PI * 2 + t * 0.05 * speeds[i]
      const y = 2 + Math.sin(t * 0.9 + i) * 0.6
      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius - 8)
      dummy.rotation.set(Math.sin(t + i) * 0.5, angle, Math.cos(t * 0.5 + i) * 0.5)
      dummy.scale.setScalar(0.12 + (i % 3) * 0.04)
      dummy.updateMatrix()
      ref.current?.setMatrixAt(i, dummy.matrix)
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined as any, undefined as any, count]}>
      <planeGeometry args={[0.6, 0.3]} />
      <meshStandardMaterial color={"#7ac38d"} roughness={0.8} metalness={0} side={THREE.DoubleSide} />
    </instancedMesh>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
      <cylinderGeometry args={[60, 60, 0.4, 64]} />
      <meshStandardMaterial color={"#e9efe8"} roughness={1} />
    </mesh>
  )
}

function TreesBand() {
  const trees = useMemo(() => {
    const arr: [number, number, number, number][] = []
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI + 0.2
      const r = 16 + (i % 5) * 0.6
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r - 10
      const s = 1.1 + Math.random() * 0.7
      const y = 0 // Declare y variable
      arr.push([x, y, z, s])
    }
    return arr
  }, [])
  return (
    <group>
      {trees.map(([x, y, z, s], i) => (
        <Tree key={i} position={[x, y, z] as any} scale={s} />
      ))}
    </group>
  )
}

export default function EcoHero() {
  return (
    <div className="w-full h-[90vh] md:h-screen relative overflow-hidden">
      <Canvas shadows camera={{ position: [0, 3, 10], fov: 50 }} gl={{ antialias: true }}>
        <fog attach="fog" args={["#d6eadc", 15, 55]} />
        <directionalLight position={[10, 15, 5]} intensity={1.4} castShadow />
        <ambientLight intensity={0.6} />
        <Suspense fallback={null}>
          <Environment preset="forest" />
          <Ground />
          <Skyline />
          <TreesBand />
          <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
            <LeavesField />
          </Float>
        </Suspense>
      </Canvas>

      {/* Overlay content */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <div className="mx-auto max-w-5xl px-6 md:px-8">
          <div className="pointer-events-auto w-full max-w-xl rounded-xl bg-white/70 backdrop-blur-md p-6 md:p-8 shadow-lg">
            <p className="text-sm font-medium text-emerald-700">Eco-Friendly Adventures</p>
            <h1 className="mt-2 text-balance text-4xl md:text-6xl font-semibold text-emerald-900">
              {"Discover Your "}
              <Typewriter
                className="block text-emerald-700"
                words={["Sustainable Potential", "Eco Journey", "Green Future"]}
                speed={46}
                pause={1200}
              />
            </h1>
            <p className="mt-4 text-base md:text-lg text-emerald-900/80">
              Join our platform that rewards daily eco-actions with points and perks. Explore, recycle, and earn.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 text-white hover:bg-emerald-800 transition-colors"
              >
                Join Now
              </a>
              <a
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-lg border border-emerald-700/30 bg-white/60 px-5 py-3 text-emerald-800 hover:bg-white transition-colors"
              >
                How it Works
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
