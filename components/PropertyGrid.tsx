'use client'

import { motion } from 'motion/react'
import PropertyCard from './PropertyCard'

interface Property {
  id: string
  address: string
  city: string
  rent_hc: number
  charges: number
  deposit: number
  description: string | null
  allowed_durations: number[]
  images_urls: string[] | null
}

export default function PropertyGrid({ properties }: { properties: Property[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, i) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <PropertyCard property={property} />
        </motion.div>
      ))}
    </div>
  )
}
