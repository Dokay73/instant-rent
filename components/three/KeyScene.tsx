'use client'

/**
 * KeyScene — clé 3D "signature" du hero Instant Rent.
 * La clé tourne au fil du SCROLL (de la clé au bail), avec un flottement idle
 * et des reflets bleus (aurora de la marque). 100% procédural : aucun modèle
 * externe à charger, reflets via lightformers (pas de HDR réseau).
 * Rendu client uniquement (WebGL) — à importer via next/dynamic { ssr:false }.
 */

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Float, ContactShadows, AdaptiveDpr } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

function Key({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const scrollRot = useRef(0) // cible de rotation issue du scroll (radians)
  const scrollDamped = useRef(0)

  // Tumble 3D autour d'un axe légèrement incliné (≠ spin plat) combiné à un tilt de
  // présentation : la clé se voit toujours en 3/4, jamais aplatie de profil.
  const axis = useMemo(() => new THREE.Vector3(0.32, 1, 0).normalize(), [])
  const base = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(0.34, 0, 0.12)), [])
  const spin = useMemo(() => new THREE.Quaternion(), [])

  useEffect(() => {
    const onScroll = () => { scrollRot.current = window.scrollY * 0.005 }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame((state, delta) => {
    if (!group.current) return
    // lissage du scroll (amortissement) pour une rotation soyeuse
    scrollDamped.current = THREE.MathUtils.damp(scrollDamped.current, scrollRot.current, 5, delta)
    const idle = reduced ? 0.6 : state.clock.elapsedTime * 0.16
    spin.setFromAxisAngle(axis, idle + scrollDamped.current)
    group.current.quaternion.copy(base).multiply(spin)
  })

  // Matériau laiton premium, partagé par toutes les pièces (cohérence + perf)
  const brass = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c9a94e',
    metalness: 1,
    roughness: 0.26,
    envMapIntensity: 1.35,
  }), [])

  return (
    <group ref={group} scale={1.22} position={[0, 0, 0]}>
      {/* Anneau (bow) — la boucle du haut */}
      <mesh material={brass} position={[0, 1.72, 0]}>
        <torusGeometry args={[0.5, 0.135, 24, 64]} />
      </mesh>
      {/* Détail interne de l'anneau */}
      <mesh material={brass} position={[0, 1.72, 0]}>
        <torusGeometry args={[0.27, 0.045, 16, 48]} />
      </mesh>
      {/* Collerette */}
      <mesh material={brass} position={[0, 1.02, 0]}>
        <torusGeometry args={[0.17, 0.06, 16, 40]} />
      </mesh>
      {/* Tige (shaft) */}
      <mesh material={brass} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2.25, 32]} />
      </mesh>
      {/* Embout barillet */}
      <mesh material={brass} position={[0, -1.12, 0]}>
        <cylinderGeometry args={[0.145, 0.145, 0.26, 32]} />
      </mesh>
      {/* Panneton (bit) — les dents, en escalier */}
      <mesh material={brass} position={[0.33, -0.52, 0]}>
        <boxGeometry args={[0.5, 0.22, 0.3]} />
      </mesh>
      <mesh material={brass} position={[0.42, -0.82, 0]}>
        <boxGeometry args={[0.62, 0.22, 0.3]} />
      </mesh>
      <mesh material={brass} position={[0.28, -0.7, 0]}>
        <boxGeometry args={[0.2, 0.42, 0.3]} />
      </mesh>
    </group>
  )
}

function Scene({ reduced }: { reduced: boolean }) {
  const key = <Key reduced={reduced} />
  return (
    <>
      <ambientLight intensity={0.28} />
      {/* lumière clé (blanche) */}
      <directionalLight position={[4, 6, 5]} intensity={2.1} />
      {/* jante bleue marque (aurora) */}
      <directionalLight position={[-5, -1, -3]} intensity={2.3} color="#4a6cf7" />
      <directionalLight position={[3, -3, 4]} intensity={0.9} color="#7e97fa" />

      {reduced ? key : (
        <Float speed={1.4} rotationIntensity={0} floatIntensity={0.7} floatingRange={[-0.12, 0.12]}>
          {key}
        </Float>
      )}

      {/* Reflets sur le métal — environnement procédural, aucun téléchargement */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.2} position={[0, 3, 3]} scale={[6, 6, 1]} />
        <Lightformer intensity={1.6} color="#4a6cf7" position={[-4, 0, -3]} scale={[7, 7, 1]} />
        <Lightformer intensity={1.1} color="#7e97fa" position={[4, -2, 2]} scale={[5, 5, 1]} />
        <Lightformer intensity={0.8} position={[0, -3, 1]} scale={[8, 3, 1]} />
      </Environment>

      {/* Ombre douce d'assise */}
      <ContactShadows position={[0, -2.3, 0]} opacity={0.35} blur={2.6} scale={9} far={4.5} color="#020617" />
    </>
  )
}

export default function KeyScene({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 7], fov: 40 }}
      style={{ background: 'transparent', pointerEvents: 'none' }}
    >
      <AdaptiveDpr pixelated={false} />
      <Scene reduced={reduced} />
    </Canvas>
  )
}
