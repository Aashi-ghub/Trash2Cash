"use client"

import { useEffect, useState } from "react"

type Props = {
  words: string[]
  speed?: number
  pause?: number
  className?: string
}

export default function Typewriter({ words, speed = 45, pause = 1200, className }: Props) {
  const [i, setI] = useState(0)
  const [len, setLen] = useState(0)
  const [back, setBack] = useState(false)

  useEffect(() => {
    const w = words[i] || ""
    const t = setTimeout(
      () => {
        if (!back) {
          if (len < w.length) setLen((v) => v + 1)
          else setBack(true)
        } else {
          if (len > 0) setLen((v) => (v - 2 > 0 ? v - 2 : 0))
          else {
            setBack(false)
            setI((v) => (v + 1) % words.length)
          }
        }
      },
      back ? 24 : speed,
    )
    return () => clearTimeout(t)
  }, [i, len, back, words, speed])

  useEffect(() => {
    const w = words[i] || ""
    if (!back && len === w.length) {
      const t = setTimeout(() => setBack(true), pause)
      return () => clearTimeout(t)
    }
  }, [i, len, back, words, pause])

  const text = (words[i] || "").slice(0, len)
  return (
    <span className={className}>
      {text}
      <span className="ml-1 inline-block h-6 w-1.5 animate-pulse rounded-sm bg-emerald-700 align-[-2px]" />
    </span>
  )
}
