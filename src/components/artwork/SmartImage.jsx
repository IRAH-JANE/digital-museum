import { useEffect, useRef, useState } from 'react'
import { generatedCanvas, pigment } from '../../utils/images'
import { cn } from '../../utils/cn'

/**
 * Lazy, fade-in artwork image.
 *
 * Nothing downloads until the frame is near the viewport. While it loads, the
 * mount is filled with a colour derived from the work's own id, so the wall is
 * never blank and never shifts. If the file cannot be reached, the same seed
 * produces a museum placeholder rather than a broken-image icon — and once
 * that fallback is showing, it stays showing. (Deriving the shown src from
 * live status, rather than from a flag that sticks, used to flip the `<img>`
 * back to the original broken URL the instant the fallback finished loading,
 * which retried the bad request forever and could leave the frame blank
 * mid-cycle.)
 */
export function SmartImage({
  src,
  seed,
  alt,
  className,
  imgClassName,
  eager = false,
  sizes,
  onStatusChange,
}) {
  const holder = useRef(null)
  const [visible, setVisible] = useState(eager)
  const [status, setStatus] = useState('idle')
  const [useFallback, setUseFallback] = useState(false)
  const tones = pigment(seed ?? alt ?? 'artwork')

  useEffect(() => {
    setStatus('idle')
    setUseFallback(false)
  }, [src])

  useEffect(() => {
    if (visible || typeof IntersectionObserver === 'undefined') {
      if (typeof IntersectionObserver === 'undefined') setVisible(true)
      return undefined
    }
    const node = holder.current
    if (!node) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '320px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  const resolved = useFallback ? generatedCanvas(seed ?? alt ?? 'artwork', { title: alt }) : src

  const onError = () => {
    if (useFallback) {
      // The fallback SVG itself failed to draw (shouldn't happen — it's a
      // data URI) — stop here rather than retrying, so nothing loops forever.
      setStatus('loaded')
      return
    }
    setUseFallback(true)
    setStatus('idle')
  }

  return (
    <div
      ref={holder}
      className={cn('relative overflow-hidden', className)}
      style={{ backgroundColor: tones.a }}
    >
      {status !== 'loaded' ? (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ background: `linear-gradient(${140 + tones.angle}deg, ${tones.a}, ${tones.b})` }}
          aria-hidden="true"
        />
      ) : null}

      {visible && resolved ? (
        <img
          src={resolved}
          alt={alt}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setStatus('loaded')}
          onError={onError}
          className={cn(
            'relative h-full w-full object-contain transition-opacity duration-[900ms] ease-gallery',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      ) : null}

      {useFallback && status === 'loaded' ? (
        <span className="plaque absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/35 px-2 py-0.5 text-[10px] text-white/80">
          Photograph unavailable
        </span>
      ) : null}
    </div>
  )
}
