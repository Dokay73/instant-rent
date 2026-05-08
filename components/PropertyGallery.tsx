'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const DPE_COLORS: Record<string, string> = {
  A: '#00B050', B: '#92D050', C: '#CCCC00', D: '#FFC000', E: '#FF6600', F: '#FF0000', G: '#C00000',
}

export default function PropertyGallery({
  images,
  alt,
  dpeClass,
}: {
  images: string[]
  alt: string
  dpeClass?: string | null
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const isOpen = lightboxIndex !== null

  const close = useCallback(() => setLightboxIndex(null), [])
  const next = useCallback(() => {
    setLightboxIndex(i => (i === null ? null : (i + 1) % images.length))
  }, [images.length])
  const prev = useCallback(() => {
    setLightboxIndex(i => (i === null ? null : (i - 1 + images.length) % images.length))
  }, [images.length])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close, next, prev])

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] rounded-2xl bg-slate-100 flex items-center justify-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="opacity-20">
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" fill="#0B1F4B" />
          <rect x="9" y="13" width="6" height="8" fill="#0B1F4B" />
        </svg>
      </div>
    )
  }

  return (
    <>
      {/* Image principale */}
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => setLightboxIndex(0)}
          whileHover={{ scale: 1.005 }}
          className="block w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 group cursor-zoom-in"
        >
          <img src={images[0]} alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {dpeClass && (
            <div className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow"
              style={{ backgroundColor: DPE_COLORS[dpeClass] || '#0B1F4B' }}>
              DPE {dpeClass}
            </div>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              {images.length} photos
            </div>
          )}
        </motion.button>

        {/* Galerie miniatures */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {images.slice(1, 5).map((url, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => setLightboxIndex(i + 1)}
                whileHover={{ y: -2 }}
                className="aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-zoom-in"
              >
                <img src={url} alt={alt + ' ' + (i + 2)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            <button onClick={close}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10">
              ✕
            </button>

            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prev() }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors z-10">
                  ‹
                </button>
                <button onClick={(e) => { e.stopPropagation(); next() }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors z-10">
                  ›
                </button>
              </>
            )}

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              src={images[lightboxIndex]}
              alt={alt}
              className="max-w-[92vw] max-h-[88vh] object-contain rounded-xl"
            />

            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur text-white text-sm px-4 py-2 rounded-full">
                {lightboxIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
