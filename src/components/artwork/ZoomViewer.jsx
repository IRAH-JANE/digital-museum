import { useCallback, useEffect, useRef, useState } from 'react'
import { Maximize2, Minimize2, Minus, Plus, RotateCw, Undo2 } from 'lucide-react'
import { SmartImage } from './SmartImage'
import { cn } from '../../utils/cn'

const MIN = 1
const MAX = 6
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

/**
 * The close-looking view: wheel and pinch to zoom, drag to pan, double-click to
 * jump in and out, rotate for prints hung the wrong way up, and fullscreen.
 * Panning is constrained so the work can never be dragged off the wall.
 */
export function ZoomViewer({ artwork, className, onFullscreenChange }) {
  const stageRef = useRef(null)
  const dragState = useRef(null)
  const pinchState = useRef(null)

  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dragging, setDragging] = useState(false)

  const reset = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
    setRotation(0)
  }, [])

  useEffect(() => {
    reset()
  }, [artwork.id, reset])

  /** Keep the image anchored inside the stage as it grows. */
  const constrain = useCallback((next, atScale) => {
    const box = stageRef.current?.getBoundingClientRect()
    if (!box) return next
    const limitX = (box.width * (atScale - 1)) / 2
    const limitY = (box.height * (atScale - 1)) / 2
    return { x: clamp(next.x, -limitX, limitX), y: clamp(next.y, -limitY, limitY) }
  }, [])

  const zoomTo = useCallback(
    (nextScale, origin) => {
      const target = clamp(nextScale, MIN, MAX)
      setScale(target)
      setOffset((current) => {
        if (target === MIN) return { x: 0, y: 0 }
        if (!origin) return constrain(current, target)
        return constrain(current, target)
      })
    },
    [constrain],
  )

  const onWheel = useCallback(
    (event) => {
      if (!event.ctrlKey && Math.abs(event.deltaY) < 2) return
      event.preventDefault()
      zoomTo(scale * (event.deltaY > 0 ? 0.88 : 1.12))
    },
    [scale, zoomTo],
  )

  useEffect(() => {
    const node = stageRef.current
    if (!node) return undefined
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [onWheel])

  const onPointerDown = (event) => {
    if (scale === MIN) return
    event.currentTarget.setPointerCapture?.(event.pointerId)
    dragState.current = { x: event.clientX - offset.x, y: event.clientY - offset.y }
    setDragging(true)
  }

  const onPointerMove = (event) => {
    if (!dragState.current) return
    const next = { x: event.clientX - dragState.current.x, y: event.clientY - dragState.current.y }
    setOffset(constrain(next, scale))
  }

  const endDrag = () => {
    dragState.current = null
    setDragging(false)
  }

  /* Two-finger pinch on touch screens. */
  const onTouchStart = (event) => {
    if (event.touches.length !== 2) return
    const [a, b] = event.touches
    pinchState.current = {
      distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
      scale,
    }
  }

  const onTouchMove = (event) => {
    if (event.touches.length !== 2 || !pinchState.current) return
    event.preventDefault()
    const [a, b] = event.touches
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    zoomTo((pinchState.current.scale * distance) / pinchState.current.distance)
  }

  const onTouchEnd = () => {
    pinchState.current = null
  }

  const toggleFullscreen = useCallback(async () => {
    const node = stageRef.current?.parentElement
    if (!node) return
    try {
      if (!document.fullscreenElement) {
        await node.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      /* Fullscreen can be refused; the viewer keeps working without it. */
    }
  }, [])

  useEffect(() => {
    const onChange = () => {
      const active = Boolean(document.fullscreenElement)
      setIsFullscreen(active)
      onFullscreenChange?.(active)
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [onFullscreenChange])

  /* Keys that only apply while the viewer has the visitor's attention. */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
      if (event.key === '+' || event.key === '=') zoomTo(scale * 1.25)
      if (event.key === '-' || event.key === '_') zoomTo(scale * 0.8)
      if (event.key === '0') reset()
      if (event.key.toLowerCase() === 'f') toggleFullscreen()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [scale, zoomTo, reset, toggleFullscreen])

  return (
    <div className={cn('relative select-none bg-[var(--mat)]', className)}>
      <div
        ref={stageRef}
        className={cn(
          'relative flex h-full w-full touch-pan-y items-center justify-center overflow-hidden',
          scale > MIN ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in',
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDoubleClick={() => (scale > MIN ? reset() : zoomTo(2.4))}
        role="img"
        aria-label={`${artwork.title} by ${artwork.artist}. Zoom level ${Math.round(scale * 100)} per cent.`}
      >
        <div
          className="h-full w-full transition-transform duration-300 ease-gallery"
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale}) rotate(${rotation}deg)`,
            transitionDuration: dragging ? '0ms' : undefined,
          }}
        >
          <SmartImage
            src={artwork.image}
            seed={artwork.id}
            alt={`${artwork.title} by ${artwork.artist}`}
            eager
            className="h-full w-full bg-transparent"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-3 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-1 border border-[var(--rule)] bg-[var(--paper)]/92 px-1.5 py-1 backdrop-blur">
          <button
            type="button"
            className="btn btn-quiet px-2 py-1.5"
            onClick={() => zoomTo(scale * 0.8)}
            disabled={scale <= MIN}
            aria-label="Zoom out"
          >
            <Minus size={15} strokeWidth={1.25} />
          </button>
          <span className="w-14 text-center text-xs tabular-nums tracking-plaque text-[var(--ink-soft)]">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            className="btn btn-quiet px-2 py-1.5"
            onClick={() => zoomTo(scale * 1.25)}
            disabled={scale >= MAX}
            aria-label="Zoom in"
          >
            <Plus size={15} strokeWidth={1.25} />
          </button>
          <span className="mx-1 h-5 w-px bg-[var(--rule)]" aria-hidden="true" />
          <button
            type="button"
            className="btn btn-quiet px-2 py-1.5"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            aria-label="Rotate 90 degrees"
          >
            <RotateCw size={15} strokeWidth={1.25} />
          </button>
          <button
            type="button"
            className="btn btn-quiet px-2 py-1.5"
            onClick={reset}
            disabled={scale === MIN && rotation === 0}
            aria-label="Reset the view"
          >
            <Undo2 size={15} strokeWidth={1.25} />
          </button>
          <button
            type="button"
            className="btn btn-quiet px-2 py-1.5"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Leave fullscreen' : 'View fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={15} strokeWidth={1.25} /> : <Maximize2 size={15} strokeWidth={1.25} />}
          </button>
        </div>
      </div>
    </div>
  )
}
