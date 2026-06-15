'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'

export function ProductImage({ imageUrl, alt }: { imageUrl: string, alt: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div 
        className="relative aspect-square w-full bg-[#ECE1D9] rounded-xl overflow-hidden border border-[#DDD0C2] cursor-zoom-in group shadow-sm"
        onClick={() => setIsOpen(true)}
      >
        <Image 
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-[#F3EAE5]/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={20} className="text-[#B28F76]" />
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setIsOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 p-2 bg-[#F3EAE5]/10 hover:bg-[#F3EAE5]/20 rounded-full text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
          >
            <X size={24} />
          </button>
          
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] aspect-square sm:aspect-auto sm:h-full bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <Image 
              src={imageUrl}
              alt={alt}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
