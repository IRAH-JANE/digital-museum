import { Pause, Play, Volume1, Volume2, VolumeX } from 'lucide-react'
import { useMuseum } from '../../context/MuseumProvider'
import { cn } from '../../utils/cn'

/** Ambient controls. Sound is synthesised in the browser — see hooks/useAudio. */
export function AudioPlayer({ className, compact = false }) {
  const { audio, settings } = useMuseum()

  if (audio.unsupported) {
    return (
      <p className={cn('text-sm text-[var(--ink-soft)]', className)}>
        This browser will not let the museum generate sound.
      </p>
    )
  }

  const VolumeIcon = audio.muted ? VolumeX : audio.volume > 0.5 ? Volume2 : Volume1

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center gap-2">
        <button type="button" className="btn px-3 py-2" onClick={audio.toggle}>
          {audio.playing ? <Pause size={15} strokeWidth={1.25} /> : <Play size={15} strokeWidth={1.25} />}
          {audio.playing ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          className="btn btn-quiet px-2 py-2"
          onClick={audio.toggleMute}
          aria-label={audio.muted ? 'Unmute' : 'Mute'}
          aria-pressed={audio.muted}
        >
          <VolumeIcon size={16} strokeWidth={1.25} />
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={audio.volume}
          onChange={(event) => audio.setVolume(Number(event.target.value))}
          aria-label="Ambient volume"
          className="h-1 flex-1 accent-[var(--gold)]"
        />
      </div>

      {!compact ? (
        <div className="flex flex-wrap gap-2">
          {audio.tracks.map((track) => (
            <button
              key={track.id}
              type="button"
              onClick={() => audio.selectTrack(track.id)}
              aria-pressed={audio.current === track.id}
              className={cn(
                'border px-3 py-1.5 text-left text-xs transition-colors duration-300',
                audio.current === track.id
                  ? 'border-[var(--gold)] text-[var(--gold)]'
                  : 'border-[var(--rule)] text-[var(--ink-soft)] hover:border-[var(--ink)]',
              )}
            >
              <span className="block">{track.name}</span>
              <span className="block text-[0.68rem] text-[var(--ink-faint)]">{track.description}</span>
            </button>
          ))}
        </div>
      ) : null}

      <label className="flex items-center gap-3 text-sm text-[var(--ink-soft)]">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[var(--gold)]"
          checked={settings.settings.ambientAudio}
          onChange={(event) => settings.set({ ambientAudio: event.target.checked })}
        />
        Start ambient sound automatically on future visits
      </label>
    </div>
  )
}
