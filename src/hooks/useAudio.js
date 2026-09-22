import { useCallback, useEffect, useRef, useState } from 'react'
import { ambienceById, ambienceTracks } from '../data/ambience'

/**
 * Ambient sound, synthesised.
 *
 * No audio files are shipped or fetched — each room is built live from
 * filtered noise, a couple of low oscillators and occasional soft tones. The
 * AudioContext is only created on a real user gesture, which is what browser
 * autoplay policy requires, so nothing ever plays without being asked for.
 */
function makeNoiseBuffer(ctx, type) {
  const length = ctx.sampleRate * 4
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  if (type === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.969 * b2 + white * 0.153852
      b3 = 0.8665 * b3 + white * 0.3104856
      b4 = 0.55 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.016898
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
    }
  } else {
    let last = 0
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    }
  }
  return buffer
}

export function useAudioEngine({ volume = 0.4, trackId = 'quiet-gallery' } = {}) {
  const ctxRef = useRef(null)
  const nodesRef = useRef([])
  const masterRef = useRef(null)
  const sparkleTimer = useRef(null)

  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [current, setCurrent] = useState(trackId)
  const [level, setLevel] = useState(volume)
  const [unsupported, setUnsupported] = useState(false)

  const teardown = useCallback(() => {
    if (sparkleTimer.current) clearTimeout(sparkleTimer.current)
    sparkleTimer.current = null
    nodesRef.current.forEach((node) => {
      try {
        node.stop?.()
        node.disconnect?.()
      } catch {
        /* node already stopped */
      }
    })
    nodesRef.current = []
  }, [])

  const build = useCallback(
    (id) => {
      const ctx = ctxRef.current
      const master = masterRef.current
      if (!ctx || !master) return
      const track = ambienceById[id] ?? ambienceTracks[0]
      teardown()

      if (track.noise) {
        const source = ctx.createBufferSource()
        source.buffer = makeNoiseBuffer(ctx, track.noise.type)
        source.loop = true
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = track.noise.cutoff
        const gain = ctx.createGain()
        gain.gain.value = track.noise.gain
        source.connect(filter).connect(gain).connect(master)
        source.start()
        nodesRef.current.push(source, filter, gain)
      }

      if (track.drone) {
        track.drone.notes.forEach((freq, index) => {
          const osc = ctx.createOscillator()
          osc.type = index % 2 ? 'triangle' : 'sine'
          osc.frequency.value = freq
          const gain = ctx.createGain()
          gain.gain.value = track.drone.gain
          // A slow detune keeps the drone from sounding like a test tone.
          const lfo = ctx.createOscillator()
          lfo.frequency.value = 0.05 + index * 0.017
          const lfoGain = ctx.createGain()
          lfoGain.gain.value = 1.5
          lfo.connect(lfoGain).connect(osc.detune)
          osc.connect(gain).connect(master)
          osc.start()
          lfo.start()
          nodesRef.current.push(osc, gain, lfo, lfoGain)
        })
      }

      if (track.sparkle) {
        const schedule = () => {
          const [min, max] = track.sparkle.interval
          const wait = min + Math.random() * (max - min)
          sparkleTimer.current = setTimeout(() => {
            const ctxNow = ctxRef.current
            if (!ctxNow || ctxNow.state === 'closed') return
            const note = track.sparkle.notes[Math.floor(Math.random() * track.sparkle.notes.length)]
            const osc = ctxNow.createOscillator()
            osc.type = 'sine'
            osc.frequency.value = note
            const gain = ctxNow.createGain()
            const now = ctxNow.currentTime
            gain.gain.setValueAtTime(0.0001, now)
            gain.gain.exponentialRampToValueAtTime(track.sparkle.gain, now + 0.25)
            gain.gain.exponentialRampToValueAtTime(0.0001, now + track.sparkle.decay)
            osc.connect(gain).connect(masterRef.current)
            osc.start(now)
            osc.stop(now + track.sparkle.decay + 0.1)
            schedule()
          }, wait)
        }
        schedule()
      }
    },
    [teardown],
  )

  const start = useCallback(
    async (id = current) => {
      try {
        if (!ctxRef.current) {
          const Ctx = window.AudioContext || window.webkitAudioContext
          if (!Ctx) {
            setUnsupported(true)
            return false
          }
          ctxRef.current = new Ctx()
          masterRef.current = ctxRef.current.createGain()
          masterRef.current.gain.value = 0
          masterRef.current.connect(ctxRef.current.destination)
        }
        await ctxRef.current.resume()
        build(id)
        const target = muted ? 0 : level
        masterRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime)
        masterRef.current.gain.setValueAtTime(0.0001, ctxRef.current.currentTime)
        masterRef.current.gain.linearRampToValueAtTime(target, ctxRef.current.currentTime + 2.5)
        setPlaying(true)
        setCurrent(id)
        return true
      } catch {
        setUnsupported(true)
        return false
      }
    },
    [build, current, level, muted],
  )

  const stop = useCallback(() => {
    const ctx = ctxRef.current
    if (ctx && masterRef.current) {
      const now = ctx.currentTime
      masterRef.current.gain.cancelScheduledValues(now)
      masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, now)
      masterRef.current.gain.linearRampToValueAtTime(0.0001, now + 1.2)
      setTimeout(teardown, 1300)
    }
    setPlaying(false)
  }, [teardown])

  const toggle = useCallback(() => (playing ? stop() : start()), [playing, start, stop])

  const selectTrack = useCallback(
    (id) => {
      setCurrent(id)
      if (playing) start(id)
    },
    [playing, start],
  )

  const changeVolume = useCallback((next) => {
    setLevel(next)
    if (masterRef.current && ctxRef.current) {
      masterRef.current.gain.linearRampToValueAtTime(next, ctxRef.current.currentTime + 0.2)
    }
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((wasMuted) => {
      const next = !wasMuted
      if (masterRef.current && ctxRef.current) {
        masterRef.current.gain.linearRampToValueAtTime(next ? 0.0001 : level, ctxRef.current.currentTime + 0.3)
      }
      return next
    })
  }, [level])

  useEffect(
    () => () => {
      teardown()
      ctxRef.current?.close?.()
    },
    [teardown],
  )

  return {
    playing,
    muted,
    current,
    volume: level,
    unsupported,
    tracks: ambienceTracks,
    start,
    stop,
    toggle,
    selectTrack,
    setVolume: changeVolume,
    toggleMute,
  }
}
