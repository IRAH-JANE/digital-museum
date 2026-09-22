/**
 * Achievements are read from progress, never written to it separately, so they
 * cannot drift out of sync with what actually happened.
 * `test` receives the progress object and returns a boolean.
 */
export const achievements = [
  {
    id: 'first-visit',
    name: 'First visit',
    description: 'You walked through the entrance.',
    hint: 'Enter the museum.',
    test: (p) => p.entered === true,
  },
  {
    id: 'art-explorer',
    name: 'Art explorer',
    description: 'Ten works looked at properly.',
    hint: 'View 10 artworks.',
    test: (p) => p.viewedArtworks.length >= 10,
  },
  {
    id: 'curious-mind',
    name: 'Curious mind',
    description: 'Ten artists met.',
    hint: 'Discover 10 artists.',
    test: (p) => p.discoveredArtists.length >= 10,
  },
  {
    id: 'time-traveller',
    name: 'Time traveller',
    description: 'Five historical periods crossed.',
    hint: 'View work from 5 different periods.',
    test: (p) => p.periods.length >= 5,
  },
  {
    id: 'night-owl',
    name: 'Night owl',
    description: 'You stayed after the lights went down.',
    hint: 'Turn on Night at the Museum.',
    test: (p) => p.nightMode === true,
  },
  {
    id: 'curator',
    name: 'Curator',
    description: 'You hung your own exhibition.',
    hint: 'Create an exhibition in Curator mode.',
    test: (p) => p.exhibitionsCreated >= 1,
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Five works saved to your collection.',
    hint: 'Save 5 favourites.',
    test: (p) => p.favouritesPeak >= 5,
  },
  {
    id: 'full-circuit',
    name: 'Full circuit',
    description: 'Every room in the building.',
    hint: 'Visit all 9 rooms.',
    test: (p) => p.visitedRooms.length >= 9,
  },
  {
    id: 'guided',
    name: 'Guided',
    description: 'A tour taken from beginning to end.',
    hint: 'Finish a guided tour.',
    test: (p) => p.toursCompleted >= 1,
  },
  {
    id: 'deep-reader',
    name: 'Deep reader',
    description: 'Twenty-five works, one after another.',
    hint: 'View 25 artworks.',
    test: (p) => p.viewedArtworks.length >= 25,
  },
]

export const achievementsById = Object.fromEntries(achievements.map((a) => [a.id, a]))
