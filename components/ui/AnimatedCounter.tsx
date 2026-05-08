'use client'

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'

export default function AnimatedCounter({
  value,
  duration = 1.5,
  className,
  suffix = '',
}: {
  value: number
  duration?: number
  className?: string
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 })
  const display = useTransform(spring, (latest) => Math.round(latest).toLocaleString('fr-FR'))

  useEffect(() => {
    if (inView) motionValue.set(value)
  }, [inView, value, motionValue])

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}
