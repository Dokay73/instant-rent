'use client'

import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { motion } from 'motion/react'

export default function StatCard({
  value,
  label,
  suffix = '',
  delay = 0,
}: {
  value: number
  label: string
  suffix?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md hover:shadow-slate-100 p-4 text-center cursor-default transition-shadow"
    >
      <p className="text-2xl font-bold text-[#0B1F4B]" style={{ fontVariantNumeric: 'tabular-nums' }}>
        <AnimatedCounter value={value} suffix={suffix} duration={1.2} />
      </p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </motion.div>
  )
}
