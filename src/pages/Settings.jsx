import { useRef, useState } from 'react'
import { AlertTriangle, Download, Upload } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { SectionHeading } from '../components/ui/SectionHeading'
import { AudioPlayer } from '../components/audio/AudioPlayer'
import { Modal } from '../components/ui/Modal'
import { clearAll, downloadJson, exportAll, importAll } from '../utils/storage'
import { useMuseum } from '../context/MuseumProvider'
import { cn } from '../utils/cn'

function Row({ label, hint, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] py-4">
      <div className="min-w-0">
        <p className="text-sm">{label}</p>
        {hint ? <p className="mt-1 max-w-reading text-xs text-[var(--ink-faint)]">{hint}</p> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 border transition-colors duration-300',
        checked ? 'border-[var(--gold)] bg-[var(--gold)]/20' : 'border-[var(--rule)]',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-300 ease-gallery',
          checked ? 'left-[1.5rem] bg-[var(--gold)]' : 'left-[0.15rem] bg-[var(--ink-faint)]',
        )}
      />
    </button>
  )
}

function Choice({ options, value, onChange, name }) {
  return (
    <div className="flex border border-[var(--rule)]" role="radiogroup" aria-label={name}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-1.5 text-xs uppercase tracking-plaque transition-colors duration-300',
            value === option.value
              ? 'bg-[var(--ink)] text-[var(--paper)]'
              : 'text-[var(--ink-soft)] hover:text-[var(--ink)]',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default function Settings() {
  const { settings, favorites, recent, progress, curator, pushToast } = useMuseum()
  const value = settings.settings
  const fileRef = useRef(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [importErrors, setImportErrors] = useState([])

  const onExport = () => {
    downloadJson(exportAll(), 'digital-museum-backup.json')
    pushToast({ kind: 'plain', title: 'Backup downloaded', body: 'digital-museum-backup.json' })
  }

  const onImportFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setImportErrors([])
    try {
      const payload = JSON.parse(await file.text())
      const result = importAll(payload)
      if (!result.ok) {
        setImportErrors(result.errors)
        return
      }
      pushToast({
        kind: 'plain',
        title: 'Collection imported',
        body: 'Reloading so everything reads from the new file.',
        duration: 2200,
      })
      setTimeout(() => window.location.reload(), 900)
    } catch {
      setImportErrors(['That file could not be read as JSON.'])
    }
  }

  const onClear = () => {
    favorites.clear()
    recent.clear()
    curator.clear()
    progress.reset()
    settings.reset()
    clearAll()
    setConfirmClear(false)
    pushToast({ kind: 'plain', title: 'Local data cleared', body: 'The museum is new again.' })
  }

  return (
    <PageTransition>
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10 lg:py-16">
          <p className="plaque text-[var(--gold)]">Preferences</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none">
            Settings
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-10">
        {/* ------------------------------------------------------------ appearance */}
        <section className="mb-16">
          <SectionHeading title="Appearance" />
          <Row label="Theme" hint="Auto follows your system setting.">
            <Choice
              name="Theme"
              value={value.theme}
              onChange={(theme) => settings.set({ theme })}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'auto', label: 'Auto' },
              ]}
            />
          </Row>
          <Row
            label="Night at the Museum"
            hint="Darkens the building, lifts the light on the works and changes the ambient track."
          >
            <Toggle
              label="Night at the Museum"
              checked={value.night}
              onChange={() => settings.toggleNight()}
            />
          </Row>
        </section>

        {/* ------------------------------------------------------------ experience */}
        <section className="mb-16">
          <SectionHeading title="Museum experience" />
          <Row label="Animations" hint="Page transitions, hover lifts and reveals.">
            <Toggle
              label="Animations"
              checked={value.animations}
              onChange={(animations) => settings.set({ animations })}
            />
          </Row>
          <Row
            label="Reduced motion"
            hint="Turns nearly all movement off. Your system preference is respected automatically as well."
          >
            <Toggle
              label="Reduced motion"
              checked={value.reducedMotion}
              onChange={(reducedMotion) => settings.set({ reducedMotion })}
            />
          </Row>
          <Row
            label="Ambient audio"
            hint="Starts a quiet room tone after your first click, never before."
          >
            <Toggle
              label="Ambient audio"
              checked={value.ambientAudio}
              onChange={(ambientAudio) => settings.set({ ambientAudio })}
            />
          </Row>
          <Row label="Auto-play guided tours" hint="Tours advance on their own until you pause.">
            <Toggle
              label="Auto-play guided tours"
              checked={value.autoPlayTour}
              onChange={(autoPlayTour) => settings.set({ autoPlayTour })}
            />
          </Row>
          <div className="mt-8">
            <AudioPlayer />
          </div>
        </section>

        {/* --------------------------------------------------------------- gallery */}
        <section className="mb-16">
          <SectionHeading title="Gallery" />
          <Row label="Artwork labels" hint="The title card under each framed work.">
            <Toggle
              label="Artwork labels"
              checked={value.showLabels}
              onChange={(showLabels) => settings.set({ showLabels })}
            />
          </Row>
          <Row label="Information density" hint="Compact tightens the spacing between works.">
            <Choice
              name="Information density"
              value={value.density}
              onChange={(density) => settings.set({ density })}
              options={[
                { value: 'comfortable', label: 'Comfortable' },
                { value: 'compact', label: 'Compact' },
              ]}
            />
          </Row>
        </section>

        {/* ------------------------------------------------------------------ data */}
        <section>
          <SectionHeading title="Data" note="Everything lives in this browser only." />
          <Row
            label="Export my collection"
            hint="Favourites, recently viewed, your exhibitions, progress and these settings, as JSON."
          >
            <button type="button" onClick={onExport} className="btn">
              <Download size={15} strokeWidth={1.5} />
              Export
            </button>
          </Row>
          <Row label="Import collection" hint="The file is checked before anything is written.">
            <>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                onChange={onImportFile}
                className="sr-only"
              />
              <button type="button" onClick={() => fileRef.current?.click()} className="btn">
                <Upload size={15} strokeWidth={1.5} />
                Import
              </button>
            </>
          </Row>
          {importErrors.length ? (
            <ul className="mt-3 border border-[var(--gold)]/50 bg-[var(--gold)]/5 p-4 text-xs text-[var(--ink-soft)]">
              {importErrors.map((error) => (
                <li key={error} className="flex items-start gap-2">
                  <AlertTriangle size={13} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[var(--gold)]" />
                  {error}
                </li>
              ))}
            </ul>
          ) : null}
          <Row
            label="Clear local data"
            hint={`Removes ${favorites.count} saved works, ${recent.items.length} recently viewed, ${curator.items.length} of your exhibitions and all progress.`}
          >
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="btn border-[var(--gold)] text-[var(--gold)]"
            >
              Clear
            </button>
          </Row>
        </section>
      </div>

      <Modal open={confirmClear} onClose={() => setConfirmClear(false)} title="Clear local data?">
        <p className="max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
          This erases your saved works, recently viewed list, exhibitions, achievements and
          preferences from this browser. It cannot be undone. Export a backup first if you want to
          keep any of it.
        </p>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={() => setConfirmClear(false)} className="btn">
            Keep everything
          </button>
          <button type="button" onClick={onExport} className="btn btn-quiet">
            Export first
          </button>
          <button type="button" onClick={onClear} className="btn btn-solid">
            Clear it all
          </button>
        </div>
      </Modal>
    </PageTransition>
  )
}
