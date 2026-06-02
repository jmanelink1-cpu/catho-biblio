import Image from 'next/image'

/**
 * Full-bleed background image, optimized via next/image (AVIF/WebP, responsive).
 * Use `priority` for above-the-fold (hero) images; others lazy-load by default.
 */
export function BleedImage({
  src, alt, priority = false, sizes = '100vw',
}: {
  src: string
  alt: string
  priority?: boolean
  sizes?: string
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      style={{ objectFit: 'cover' }}
    />
  )
}
