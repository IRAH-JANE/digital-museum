/**
 * The museum-wide timeline. `start`/`end` are approximate and are used only to
 * place a period on the timeline axis, not as historical claims.
 */
export const periods = [
  {
    id: 'ancient',
    name: 'Ancient',
    start: -1500,
    end: 400,
    axisLabel: '1500 BCE',
    summary: 'Egyptian, Greek and Roman making, surviving mostly in stone because stone is what survives.',
    events: [
      { year: -1345, label: 'A sculptor’s workshop at Amarna models a queen’s head' },
      { year: -190, label: 'A winged Nike is set above a harbour on Samothrace' },
      { year: -120, label: 'A marble Aphrodite is carved on Milos' },
    ],
  },
  {
    id: 'medieval',
    name: 'Medieval',
    start: 400,
    end: 1400,
    axisLabel: '400',
    summary:
      'A thousand years of manuscript, mosaic and altarpiece across Europe and Byzantium. No works from this period are currently on display here.',
    events: [
      { year: 547, label: 'The mosaics of San Vitale are completed at Ravenna' },
      { year: 1140, label: 'Gothic building begins at Saint-Denis' },
    ],
  },
  {
    id: 'renaissance',
    name: 'Renaissance',
    start: 1400,
    end: 1600,
    axisLabel: '1400',
    summary: 'Linear perspective, anatomy and classical subject matter reorganise European painting.',
    events: [
      { year: 1425, label: 'Masaccio uses one-point perspective in Florence' },
      { year: 1504, label: 'Michelangelo’s David is installed outside the Palazzo Vecchio' },
      { year: 1512, label: 'The Sistine Chapel ceiling is unveiled' },
    ],
  },
  {
    id: 'baroque',
    name: 'Baroque',
    start: 1600,
    end: 1750,
    axisLabel: '1600',
    summary: 'Dramatic light, movement and a growing market for pictures of ordinary rooms.',
    events: [
      { year: 1600, label: 'Caravaggio completes the Contarelli Chapel canvases' },
      { year: 1642, label: 'Rembrandt delivers The Night Watch' },
      { year: 1665, label: 'Vermeer paints Girl with a Pearl Earring' },
    ],
  },
  {
    id: 'romanticism',
    name: 'Romanticism',
    start: 1790,
    end: 1870,
    axisLabel: '1790',
    summary: 'Weather, war and the sublime, alongside the first photographs and the arrival of steam.',
    events: [
      { year: 1814, label: 'Goya paints The Third of May 1808' },
      { year: 1831, label: 'Hokusai’s Thirty-Six Views of Mount Fuji begins publication' },
      { year: 1839, label: 'The daguerreotype is announced in Paris' },
    ],
  },
  {
    id: 'impressionism',
    name: 'Impressionism',
    start: 1860,
    end: 1900,
    axisLabel: '1860',
    summary: 'Painters leave the studio, work quickly, and exhibit outside the official Salon.',
    events: [
      { year: 1874, label: 'The first independent exhibition opens in Paris' },
      { year: 1877, label: 'Renoir shows Bal du moulin de la Galette' },
      { year: 1890, label: 'A Japanese print exhibition in Paris reshapes French composition' },
    ],
  },
  {
    id: 'modern',
    name: 'Modern',
    start: 1880,
    end: 1945,
    axisLabel: '1880',
    summary: 'Resemblance becomes optional. Abstraction appears in several places at once.',
    events: [
      { year: 1889, label: 'Van Gogh paints The Starry Night at Saint-Rémy' },
      { year: 1908, label: 'Klimt exhibits The Kiss in Vienna' },
      { year: 1913, label: 'Kandinsky paints Composition VII in Munich' },
      { year: 1936, label: 'Dorothea Lange photographs a camp at Nipomo' },
    ],
  },
  {
    id: 'contemporary',
    name: 'Contemporary',
    start: 1945,
    end: 2030,
    axisLabel: '1945',
    summary: 'Work made now, including pieces with no physical original — such as the four generated in this museum.',
    events: [
      { year: 1968, label: 'Sol LeWitt issues wall drawings as written instructions' },
      { year: 1986, label: 'Hilma af Klint’s abstract work is shown publicly for the first time' },
      { year: 2024, label: 'This museum writes its first generated work' },
    ],
  },
]

export const periodsById = Object.fromEntries(periods.map((p) => [p.id, p]))

export function getPeriod(id) {
  return periodsById[id] ?? null
}

export function periodName(id) {
  return periodsById[id]?.name ?? 'Unattributed'
}
