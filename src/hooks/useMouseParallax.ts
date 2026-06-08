'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface ParallaxValues {
  x: number // -1 to 1 relative to element centre
  y: number // -1 to 1 relative to element centre
}

/**
 * Returns a ref to attach to a container element and normalised mouse position
 * values (x, y) in the range -1 → 1 relative to the element's centre.
 * Values are 0,0 when the mouse is not over the element.
 */
export function useMouseParallax<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const [pos, setPos] = useState<ParallaxValues>({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      setPos({
        x: (e.clientX - cx) / (rect.width / 2),
        y: (e.clientY - cy) / (rect.height / 2),
      })
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    // Smoothly return to 0 via CSS transition on the consumer side
    setPos({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove, handleMouseLeave])

  return { ref, pos }
}
