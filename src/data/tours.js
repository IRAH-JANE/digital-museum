/** Guided tours are ordered lists of work with a line of commentary each. */
export const tours = [
  {
    id: 'beginner',
    name: 'First visit',
    length: '6 stops · about 5 minutes',
    description: 'The short route. Six works, one from most rooms, no assumed knowledge.',
    stops: [
      { id: 'mona-lisa', note: 'Start here, because everyone does, and because the landscape behind her is stranger than the face.' },
      { id: 'girl-with-pearl-earring', note: 'Not a portrait of anyone in particular. A study of a turn of the head.' },
      { id: 'great-wave', note: 'Printed in thousands, sold cheaply. Fame arrived much later.' },
      { id: 'impression-sunrise', note: 'The painting a critic used to insult a whole generation.' },
      { id: 'starry-night', note: 'Painted from memory in an asylum room, not from a window at night.' },
      { id: 'the-thinker', note: 'Look at the posture. Nobody thinks like this.' },
    ],
  },
  {
    id: 'art-history',
    name: 'A short history',
    length: '8 stops · about 8 minutes',
    description: 'Chronological, from a limestone bust to a generated file.',
    stops: [
      { id: 'nefertiti-bust', note: 'A workshop model from Amarna, around 1345 BCE.' },
      { id: 'venus-de-milo', note: 'Hellenistic marble, arms already missing when found.' },
      { id: 'creation-of-adam', note: 'Fresco: no revisions possible once the plaster dries.' },
      { id: 'night-watch', note: 'A group portrait that refuses to sit still.' },
      { id: 'third-of-may', note: 'War painted without a hero in it.' },
      { id: 'impression-sunrise', note: 'The moment painting stops pretending to be finished.' },
      { id: 'composition-vii', note: 'Resemblance is dropped entirely.' },
      { id: 'dm-lattice', note: 'And finally, a work with no original object at all.' },
    ],
  },
  {
    id: 'modern',
    name: 'Modern art',
    length: '6 stops · about 6 minutes',
    description: 'Van Gogh to af Klint, the decades when the picture stopped being a window.',
    stops: [
      { id: 'sunflowers', note: 'New chrome yellows, used as loudly as possible.' },
      { id: 'bedroom-in-arles', note: 'Rest, expressed through colour rather than drawing.' },
      { id: 'the-scream', note: 'The figure is covering its ears. The sky is the one screaming.' },
      { id: 'the-kiss', note: 'Gold borrowed from Ravenna and applied to two people on a ledge.' },
      { id: 'composition-vii', note: 'Thirty studies, then four days of painting.' },
      { id: 'the-swan', note: 'Made in 1915, hidden until the 1980s.' },
    ],
  },
  {
    id: 'famous',
    name: 'The famous ones',
    length: '7 stops · about 6 minutes',
    description: 'The works people already have in their heads, with the detail they usually miss.',
    stops: [
      { id: 'mona-lisa', note: 'The horizon does not match on either side of her head.' },
      { id: 'starry-night', note: 'The village below is painted calmly. Only the sky moves.' },
      { id: 'girl-with-pearl-earring', note: 'The pearl is two strokes of paint.' },
      { id: 'great-wave', note: 'Fuji and the foam share a silhouette.' },
      { id: 'birth-of-venus', note: 'Painted on canvas in tempera, which is why it looks matte.' },
      { id: 'the-scream', note: 'Four versions exist, in four different media.' },
      { id: 'david', note: 'The hands are oversized because you were meant to be far below.' },
    ],
  },
]

export const toursById = Object.fromEntries(tours.map((t) => [t.id, t]))
