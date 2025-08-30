"use client"

import type { ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

type Props = {
  children: ReactNode
  className?: string
  yParallax?: [number, number]
}

export default function SectionReveal({ children, className, yParallax = [0, -30] }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 30%"] })
  const y = useTransform(scrollYProgress, [0, 1], yParallax)

  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      style={{ y }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      {children}
    </motion.section>
  )
}
