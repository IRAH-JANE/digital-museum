import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SmartImage } from '../components/artwork/SmartImage'
import { Onboarding } from '../components/museum/Onboarding'
import { exhibitions } from '../data/exhibitions'
import { artworksById, artworks } from '../data/artworks'
import { artists } from '../data/artists'
import { rooms } from '../data/rooms'
import { pickForDay } from '../utils/dateUtils'
import { useMuseum } from '../context/MuseumProvider'

/** Works that hold up at full-bleed size, rotated slowly behind the title. */
const HERO_IDS = ['starry-night', 'great-wave', 'the-kiss', 'sea-of-ice', 'impression-sunrise']

export default function Landing() {
  const navigate = useNavigate()
  const { onboarded, setOnboarded, progress, settings } = useMuseum()
  const [slide, setSlide] = useState(0)
  const [entering, setEntering] = useState(false)
  const motionEnabled = settings.motionEnabled

  const heroes = useMemo(() => HERO_IDS.map((id) => artworksById[id]).filter(Boolean), [])
  const hero = heroes[slide % heroes.length]
  const featured = useMemo(() => pickForDay(exhibitions), [])

  useEffect(() => {
    if (!motionEnabled || heroes.length < 2) return undefined
    const timer = setInterval(() => setSlide((i) => i + 1), 7000)
    return () => clearInterval(timer)
  }, [motionEnabled, heroes.length])

  /* The entrance: fade the wall, push the view forward, then land in the lobby. */
  const enter = () => {
    progress.markEntered()
    if (!motionEnabled) {
      navigate('/museum')
      return
    }
    setEntering(true)
    setTimeout(() => navigate('/museum'), 1100)
  }

  if (!onboarded) {
    return <Onboarding onFinish={() => setOnboarded(true)} />
  }

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden">
      {/* Rotating exhibition image, dimmed to let the type sit on top of it */}
      <div className="absolute inset-0 -z-10 bg-[var(--night,#0D0C0B)]">
        <AnimatePresence mode="sync">
          <motion.div
            key={hero?.id ?? 'hero'}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: motionEnabled ? 1.08 : 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionEnabled ? 2.4 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <SmartImage
              src={hero?.image}
              seed={hero?.id}
              alt=""
              eager
              className="h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85" />
      </div>

      <motion.div
        className="relative mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-[110rem] flex-col justify-between px-5 py-12 text-[#F3EEE4] sm:px-10 sm:py-16"
        animate={entering ? { opacity: 0, scale: 1.14, filter: 'blur(6px)' } : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.05, ease: [0.4, 0, 0.2, 1] }}
      >
        <p className="text-[0.65rem] uppercase tracking-wall text-[#F3EEE4]/60">
          Est. in a browser · Open always · Admission free
        </p>

        <div className="max-w-4xl py-16">
          <motion.h1
            className="font-display text-[clamp(3rem,12vw,9.5rem)] font-light leading-[0.88] tracking-tight"
            initial={motionEnabled ? { opacity: 0, y: 30 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            DIGITAL
            <br />
            MUSEUM
          </motion.h1>
          <motion.p
            className="mt-8 max-w-xl text-base leading-relaxed text-[#F3EEE4]/80 sm:text-lg"
            initial={motionEnabled ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            Art, history, and imagination — preserved in a space without walls.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-wrap items-center gap-6"
            initial={motionEnabled ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <button
              type="button"
              onClick={enter}
              className="group inline-flex items-center gap-4 border border-[#F3EEE4]/40 px-8 py-4 text-xs uppercase tracking-plaque transition-all duration-500 ease-gallery hover:border-[#F3EEE4] hover:bg-[#F3EEE4] hover:text-[#151310]"
            >
              Enter museum
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-500 ease-gallery group-hover:translate-x-1.5"
              />
            </button>
            <p className="text-xs leading-relaxed text-[#F3EEE4]/55">
              Now showing
              <span className="ml-2 italic text-[#F3EEE4]/85">{featured.title}</span>
            </p>
          </motion.div>
        </div>

        <div className="grid gap-6 border-t border-[#F3EEE4]/15 pt-6 text-xs sm:grid-cols-4">
          {[
            { value: artworks.length, label: 'Works on display' },
            { value: artists.length, label: 'Artists' },
            { value: rooms.length, label: 'Rooms' },
            { value: exhibitions.length, label: 'Exhibitions' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-light">{stat.value}</p>
              <p className="mt-1 uppercase tracking-plaque text-[#F3EEE4]/50">{stat.label}</p>
            </div>
          ))}
          <p className="text-[0.7rem] leading-relaxed text-[#F3EEE4]/40 sm:col-span-4">
            On the wall behind the title: {hero?.title}
            {hero?.artist ? `, ${hero.artist}` : ''}
            {hero?.yearText ? `, ${hero.yearText}` : ''}.
          </p>
        </div>
      </motion.div>

      {/* The doorway itself: a white wipe as the gallery opens */}
      <AnimatePresence>
        {entering ? (
          <motion.div
            className="fixed inset-0 z-[150] bg-[var(--wall)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}
