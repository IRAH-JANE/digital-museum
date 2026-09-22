import { artworks } from './artworks'

/**
 * Rooms are the museum's physical organisation. `floor` positions them on the
 * map; `atmosphere` carries the wall colour and light each room is hung under.
 */
const roomDefs = [
  {
    id: 'renaissance',
    number: '01',
    name: 'Renaissance',
    subtitle: 'Proportion, perspective and the rediscovered body',
    description:
      'Fifteenth- and sixteenth-century Italy, where painters rebuilt depth using mathematics and looked to antiquity for the shape of a human figure.',
    periodLabel: '1400 — 1600',
    periodId: 'renaissance',
    atmosphere: { wall: '#E7DECB', light: 'warm', mood: 'Daylight through high windows' },
    floor: { row: 1, col: 1, span: 1 },
  },
  {
    id: 'baroque',
    number: '02',
    name: 'Baroque',
    subtitle: 'Light used as an argument',
    description:
      'Seventeenth-century Rome, Amsterdam and Delft. Hard shadow, domestic quiet and group portraits that behave like theatre.',
    periodLabel: '1600 — 1750',
    periodId: 'baroque',
    atmosphere: { wall: '#2A2320', light: 'low', mood: 'Lamplight against dark panelling' },
    floor: { row: 1, col: 2, span: 1 },
  },
  {
    id: 'romanticism',
    number: '03',
    name: 'Romanticism',
    subtitle: 'Weather, ruin and the small figure',
    description:
      'Europe after the revolutions, painting storms, executions and the first railways with equal intensity.',
    periodLabel: '1790 — 1870',
    periodId: 'romanticism',
    atmosphere: { wall: '#3A3630', light: 'dim', mood: 'Storm light' },
    floor: { row: 2, col: 1, span: 1 },
  },
  {
    id: 'impressionism',
    number: '04',
    name: 'Impressionism',
    subtitle: 'Light, movement and fleeting moments captured through colour',
    description:
      'Paris in the 1870s and after: painters who left the studio, worked fast, and let shadows be coloured rather than grey.',
    periodLabel: '1860 — 1900',
    periodId: 'impressionism',
    atmosphere: { wall: '#F1ECE1', light: 'bright', mood: 'Open north light' },
    floor: { row: 2, col: 2, span: 1 },
  },
  {
    id: 'modern',
    number: '05',
    name: 'Modern Art',
    subtitle: 'When the picture stopped being a window',
    description:
      'From Van Gogh’s Arles to Kandinsky’s Munich and af Klint’s private temple, the decades in which European painting gave up on resemblance.',
    periodLabel: '1880 — 1945',
    periodId: 'modern',
    atmosphere: { wall: '#EDE7DB', light: 'bright', mood: 'Flat gallery light' },
    floor: { row: 3, col: 1, span: 1 },
  },
  {
    id: 'asian',
    number: '06',
    name: 'Asian Art',
    subtitle: 'Woodblock, water and the travelled road',
    description:
      'Ukiyo-e prints from Edo-period Japan — cheap, printed in the thousands, and quietly responsible for half of what Paris thought it invented.',
    periodLabel: '1700 — 1900',
    periodId: 'romanticism',
    atmosphere: { wall: '#E9E2D2', light: 'soft', mood: 'Paper light' },
    floor: { row: 3, col: 2, span: 1 },
  },
  {
    id: 'photography',
    number: '07',
    name: 'Photography',
    subtitle: 'The first machines that remembered',
    description:
      'From a Paris boulevard emptied by a long exposure to a Depression camp in California, the century in which images stopped being drawn.',
    periodLabel: '1838 — 1950',
    periodId: 'modern',
    atmosphere: { wall: '#25231F', light: 'low', mood: 'Print room, lights down' },
    floor: { row: 4, col: 1, span: 1 },
  },
  {
    id: 'sculpture',
    number: '08',
    name: 'Sculpture',
    subtitle: 'Work you have to walk around',
    description:
      'Marble, bronze and painted limestone across three thousand years, including several pieces whose makers were never recorded.',
    periodLabel: '1345 BCE — 1904',
    periodId: 'ancient',
    atmosphere: { wall: '#DED6C6', light: 'directional', mood: 'Skylight and long shadow' },
    floor: { row: 4, col: 2, span: 1 },
  },
  {
    id: 'digital',
    number: '09',
    name: 'Digital & Contemporary',
    subtitle: 'Works with no original to hang',
    description:
      'Four generated compositions written by the museum itself. They are demonstration pieces for this project — the labels say so, and so do we.',
    periodLabel: '2024 —',
    periodId: 'contemporary',
    atmosphere: { wall: '#1B1A19', light: 'screen', mood: 'Screen glow in a dark room' },
    floor: { row: 5, col: 1, span: 2 },
  },
]

export const rooms = roomDefs.map((room) => {
  const held = artworks.filter((item) => item.roomId === room.id)
  return {
    ...room,
    count: held.length,
    featuredId: held[0]?.id ?? null,
    featured: held[0] ?? null,
  }
})

export const roomsById = Object.fromEntries(rooms.map((room) => [room.id, room]))

export function getRoom(id) {
  return roomsById[id] ?? null
}
