import { motion } from 'framer-motion'
import { useMuseumSettings } from '../../context/MuseumProvider'

/**
 * Scroll reveal, used sparingly — on the timelines and the exhibition pages,
 * where the order of arrival carries meaning. Disabled with reduced motion.
 */
export function Reveal({ children, delay = 0, y = 18, className, once = true }) {
  const { motionEnabled } = useMuseumSettings()
  if (!motionEnabled) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-12% 0px -12% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
