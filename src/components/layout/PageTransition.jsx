import { motion } from 'framer-motion'
import { useMuseumSettings } from '../../context/MuseumProvider'

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 28 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -18 },
  },
  reveal: {
    initial: { opacity: 0, scale: 0.99 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0 },
  },
}

export function PageTransition({ children, kind = 'fade', className }) {
  const { motionEnabled } = useMuseumSettings()
  if (!motionEnabled) return <div className={className}>{children}</div>
  const variant = variants[kind] ?? variants.fade
  return (
    <motion.div
      className={className}
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
