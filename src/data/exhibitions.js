/** Temporary exhibitions: curated selections that cut across the room plan. */
export const exhibitions = [
  {
    id: 'colours-of-memory',
    title: 'The Colours of Memory',
    tagline: 'Colour as emotion, memory and identity',
    dates: 'On view through 30 November',
    curator: 'Curated by the Digital Museum',
    statement:
      'Every work here uses colour to do something other than describe. Van Gogh painted a bedroom in violet to stand for rest; Klimt used gold because gold had been used for holiness; Monet let shadows go blue because he could see that they were. The exhibition follows one decision — the decision to stop matching colour to the object — across three centuries.',
    coverId: 'the-kiss',
    artworkIds: [
      'the-kiss',
      'bedroom-in-arles',
      'sunflowers',
      'moulin-de-la-galette',
      'impression-sunrise',
      'red-fuji',
      'composition-vii',
      'the-scream',
    ],
    timeline: [
      { year: 1831, label: 'Prussian blue reaches Edo printmakers' },
      { year: 1876, label: 'Renoir is criticised for violet shadows' },
      { year: 1888, label: 'Van Gogh describes colour as rest in a letter to Theo' },
      { year: 1913, label: 'Kandinsky argues colour can work without a subject' },
    ],
  },
  {
    id: 'night-and-light',
    title: 'Night and Light',
    tagline: 'What painters do with the dark',
    dates: 'On view through 14 January',
    curator: 'Curated by the Digital Museum',
    statement:
      'Darkness is not the absence of a subject. Caravaggio used it to hide two thirds of a room so the remaining third would land; Goya lit an execution with a single lantern; Van Gogh painted a night sky he could not have seen from a barred window. Best viewed with Night at the Museum switched on.',
    coverId: 'starry-night',
    artworkIds: [
      'starry-night',
      'calling-of-saint-matthew',
      'third-of-may',
      'rembrandt-self-portrait',
      'night-watch',
      'dm-after-hours',
      'sea-of-ice',
    ],
    timeline: [
      { year: 1600, label: 'Caravaggio’s chapel canvases are unveiled in Rome' },
      { year: 1642, label: 'Rembrandt paints a militia stepping out of shadow' },
      { year: 1814, label: 'Goya lights an execution with one lantern' },
      { year: 1889, label: 'Van Gogh paints a night sky from memory' },
    ],
  },
  {
    id: 'figures-in-time',
    title: 'Figures in Time',
    tagline: 'Bodies held still, bodies caught moving',
    dates: 'On view through 2 March',
    curator: 'Curated by the Digital Museum',
    statement:
      'A marble figure has to choose one instant and stay in it for two thousand years. A camera can take a twenty-fourth of a second. This exhibition places sculpture beside photography and asks what each one does with the moment it is given.',
    coverId: 'winged-victory',
    artworkIds: [
      'winged-victory',
      'horse-in-motion',
      'the-thinker',
      'ballet-class',
      'david',
      'migrant-mother',
      'venus-de-milo',
    ],
    timeline: [
      { year: -190, label: 'A Nike is carved mid-landing on Samothrace' },
      { year: 1504, label: 'Michelangelo finishes a figure about to act' },
      { year: 1878, label: 'Muybridge stops a gallop in twelve frames' },
      { year: 1936, label: 'Lange spends ten minutes in a camp at Nipomo' },
    ],
  },
]

export const exhibitionsById = Object.fromEntries(exhibitions.map((e) => [e.id, e]))

export function getExhibition(id) {
  return exhibitionsById[id] ?? null
}
