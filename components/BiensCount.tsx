'use client'

import AnimatedCounter from '@/components/ui/AnimatedCounter'

export default function BiensCount({ count, city }: { count: number; city?: string }) {
  return (
    <p className="text-slate-500 mt-1 text-sm">
      <AnimatedCounter value={count} duration={1} /> bien{count > 1 ? 's' : ''} disponible{count > 1 ? 's' : ''}
      {city ? ` à ${city}` : ''}
    </p>
  )
}
