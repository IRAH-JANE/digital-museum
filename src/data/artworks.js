import { wiki, generatedCanvas } from '../utils/images'

/**
 * The collection.
 *
 * Every historical work here is in the public domain, and the factual fields —
 * date, medium, dimensions, location — follow the holding institution's own
 * catalogue. Interpretation is confined to `curatorNote`, which the interface
 * always labels as such. The shape of each record matches what a museum API
 * would return, so `artworks` can later be swapped for a fetch without the
 * components changing.
 */

const work = ({ file, thumbWidth = 760, fullWidth = 1600, ...rest }) => ({
  ...rest,
  image: file ? wiki(file, fullWidth) : null,
  thumb: file ? wiki(file, thumbWidth) : null,
  sourceFile: file ?? null,
  generated: false,
})

const generated = ({ variant, ...rest }) => ({
  ...rest,
  image: generatedCanvas(rest.id, { title: rest.title, variant }),
  thumb: generatedCanvas(rest.id, { title: rest.title, variant }),
  sourceFile: null,
  generated: true,
})

export const artworks = [
  /* ------------------------------ Renaissance ----------------------------- */
  work({
    id: 'mona-lisa',
    title: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    artistId: 'leonardo',
    year: 1503,
    yearText: 'c. 1503–1519',
    period: 'renaissance',
    medium: 'Painting',
    materials: 'Oil on poplar panel',
    category: 'Portrait',
    region: 'Europe',
    dimensions: '77 × 53 cm',
    location: 'Musée du Louvre, Paris',
    roomId: 'renaissance',
    file: 'Mona Lisa, by Leonardo da Vinci, from C2RMF retouched.jpg',
    description:
      'A half-length portrait of a seated woman, generally identified as Lisa Gherardini, set against a receding landscape of water and bare rock. Leonardo built the face from many thin, blended layers, leaving no visible brushstrokes at the edges of the mouth and eyes.',
    historicalContext:
      'Leonardo appears to have begun the painting in Florence around 1503 and kept it with him, unfinished, until his death in France in 1519. It entered the French royal collection and has hung in the Louvre since the end of the eighteenth century, where its 1911 theft turned it into a global celebrity.',
    curatorNote:
      'Interpretation: the landscape behind her does not line up from left to right, and the horizon sits at different heights on either side of her head. Cover one half and then the other, and her expression seems to change with it.',
    tags: ['portrait', 'sfumato', 'florence', 'louvre', 'famous'],
  }),
  work({
    id: 'lady-with-an-ermine',
    title: 'Lady with an Ermine',
    artist: 'Leonardo da Vinci',
    artistId: 'leonardo',
    year: 1490,
    yearText: 'c. 1489–1491',
    period: 'renaissance',
    medium: 'Painting',
    materials: 'Oil on walnut panel',
    category: 'Portrait',
    region: 'Europe',
    dimensions: '54 × 39 cm',
    location: 'Czartoryski Museum, Kraków',
    roomId: 'renaissance',
    file: 'Lady with an Ermine - Leonardo da Vinci (adjusted levels).jpg',
    description:
      'A young woman, usually identified as Cecilia Gallerani, turns sharply to her left while holding a white ermine. The twist of the neck and shoulders was unusual for portraiture of the 1480s, which favoured flat profiles.',
    historicalContext:
      'Painted in Milan while Leonardo was working for Ludovico Sforza, whose emblem included the ermine. The panel was bought in Italy in the 1790s for the Czartoryski collection in Poland and was seized and recovered twice during the twentieth century.',
    curatorNote:
      'Interpretation: the animal is doing what the sitter cannot — looking straight where she is being pulled, alert and slightly tense, a second portrait smuggled into the first.',
    tags: ['portrait', 'milan', 'animal', 'sforza'],
  }),
  work({
    id: 'birth-of-venus',
    title: 'The Birth of Venus',
    artist: 'Sandro Botticelli',
    artistId: 'botticelli',
    year: 1486,
    yearText: 'c. 1484–1486',
    period: 'renaissance',
    medium: 'Painting',
    materials: 'Tempera on canvas',
    category: 'Mythology',
    region: 'Europe',
    dimensions: '172.5 × 278.9 cm',
    location: 'Uffizi Gallery, Florence',
    roomId: 'renaissance',
    file: 'Sandro Botticelli - La nascita di Venere - Google Art Project - edited.jpg',
    description:
      'Venus arrives on the shore standing in a scallop shell, blown in by wind gods while an attendant reaches out with a flowered cloak. Botticelli painted it in tempera on canvas rather than panel, which is why the surface is unusually matte.',
    historicalContext:
      'Made in Florence during the Medici era, when classical mythology was being read alongside Christian philosophy in humanist circles. The painting is first recorded in a Medici villa in 1550 and entered the Uffizi in the nineteenth century.',
    curatorNote:
      'Interpretation: nothing in the picture obeys gravity — the hair, the cloak, the shell, the roses all drift at their own speed, as if the scene has not decided to be solid yet.',
    tags: ['mythology', 'florence', 'uffizi', 'tempera', 'famous'],
  }),
  work({
    id: 'primavera',
    title: 'Primavera',
    artist: 'Sandro Botticelli',
    artistId: 'botticelli',
    year: 1482,
    yearText: 'c. 1480s',
    period: 'renaissance',
    medium: 'Painting',
    materials: 'Tempera on panel',
    category: 'Mythology',
    region: 'Europe',
    dimensions: '202 × 314 cm',
    location: 'Uffizi Gallery, Florence',
    roomId: 'renaissance',
    file: 'Botticelli-primavera.jpg',
    description:
      'Nine figures stand in an orange grove in an arrangement that has never been conclusively explained. Botanists have identified around two hundred plant species in the painting, most of them flowering in Florence in spring.',
    historicalContext:
      'Recorded in the 1490s in a Medici townhouse in Florence, hanging near The Birth of Venus. Interpretations have drawn on Ovid, Lucretius and contemporary Neoplatonic writing, and no single reading is accepted as definitive.',
    curatorNote:
      'Interpretation: read it right to left, against the habit of the eye, and it becomes a sequence — seizure, transformation, then a garden where everything has already settled.',
    tags: ['mythology', 'florence', 'garden', 'uffizi'],
  }),
  work({
    id: 'creation-of-adam',
    title: 'The Creation of Adam',
    artist: 'Michelangelo Buonarroti',
    artistId: 'michelangelo',
    year: 1512,
    yearText: 'c. 1508–1512',
    period: 'renaissance',
    medium: 'Painting',
    materials: 'Fresco',
    category: 'Religious',
    region: 'Europe',
    dimensions: '280 × 570 cm',
    location: 'Sistine Chapel, Vatican City',
    roomId: 'renaissance',
    file: 'Michelangelo - Creation of Adam (cropped).jpg',
    description:
      'One panel of the Sistine Chapel ceiling, showing God reaching toward a reclining Adam whose hand stays slack. It is painted in true fresco, pigment into wet plaster, which allows no revision once the day’s section has dried.',
    historicalContext:
      'Michelangelo painted the ceiling between 1508 and 1512 under commission from Pope Julius II, working on scaffolding he designed himself. The surface was heavily cleaned between 1980 and 1994, revealing colours far brighter than the ones visitors had known for centuries.',
    curatorNote:
      'Interpretation: the gap between the two fingers is the subject. Michelangelo painted the moment before contact, not the contact.',
    tags: ['fresco', 'religious', 'vatican', 'ceiling', 'famous'],
  }),

  /* -------------------------------- Baroque -------------------------------- */
  work({
    id: 'girl-with-pearl-earring',
    title: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
    artistId: 'vermeer',
    year: 1665,
    yearText: 'c. 1665',
    period: 'baroque',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Portrait',
    region: 'Europe',
    dimensions: '44.5 × 39 cm',
    location: 'Mauritshuis, The Hague',
    roomId: 'baroque',
    file: '1665 Girl with a Pearl Earring.jpg',
    description:
      'A girl in a blue and gold turban turns over her shoulder toward the viewer, set against a dark ground that recent analysis shows was originally a deep green curtain. It is a tronie — a study of a type or costume rather than a commissioned likeness.',
    historicalContext:
      'Painted in Delft during the Dutch Republic’s commercial peak, when ultramarine made from imported lapis lazuli cost more than gold. The canvas sold for a very small sum in 1881 and was given to the Mauritshuis in 1902.',
    curatorNote:
      'Interpretation: the pearl is barely two strokes of paint, one white and one grey, and it only becomes a pearl at a distance. Step close and it dissolves.',
    tags: ['portrait', 'delft', 'tronie', 'ultramarine', 'famous'],
  }),
  work({
    id: 'the-milkmaid',
    title: 'The Milkmaid',
    artist: 'Johannes Vermeer',
    artistId: 'vermeer',
    year: 1658,
    yearText: 'c. 1658–1661',
    period: 'baroque',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Genre scene',
    region: 'Europe',
    dimensions: '45.5 × 41 cm',
    location: 'Rijksmuseum, Amsterdam',
    roomId: 'baroque',
    file: 'Johannes Vermeer - Het melkmeisje - Google Art Project.jpg',
    description:
      'A kitchen maid pours milk from a jug in a plain room lit by a window with a broken pane. The bread crust and basket are built from small dots of thick, light-catching paint.',
    historicalContext:
      'Domestic labour was an unusually dignified subject in seventeenth-century Dutch painting, where moral instruction was often folded into ordinary scenes. The painting has been in the Rijksmuseum since 1908.',
    curatorNote:
      'Interpretation: the whole picture is arranged around a thread of milk that has not stopped falling in three hundred and fifty years.',
    tags: ['genre', 'domestic', 'amsterdam', 'light'],
  }),
  work({
    id: 'night-watch',
    title: 'The Night Watch',
    artist: 'Rembrandt van Rijn',
    artistId: 'rembrandt',
    year: 1642,
    yearText: '1642',
    period: 'baroque',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Group portrait',
    region: 'Europe',
    dimensions: '379.5 × 453.5 cm',
    location: 'Rijksmuseum, Amsterdam',
    roomId: 'baroque',
    file: 'The Night Watch - HD.jpg',
    description:
      'A civic militia company steps forward out of shadow, captured mid-movement rather than lined up for the viewer. Its proper title names the captain, Frans Banninck Cocq, and his lieutenant.',
    historicalContext:
      'Commissioned as a group portrait for the militia’s hall, with each sitter paying a share. The canvas was cut down in 1715 to fit a wall in Amsterdam’s town hall, and the darkened varnish that gave it the nickname has since been removed.',
    curatorNote:
      'Interpretation: Rembrandt was paid for likenesses and delivered an event instead. Several sitters bought a face half-hidden behind someone else’s musket.',
    tags: ['group portrait', 'amsterdam', 'militia', 'famous'],
  }),
  work({
    id: 'rembrandt-self-portrait',
    title: 'Self-Portrait',
    artist: 'Rembrandt van Rijn',
    artistId: 'rembrandt',
    year: 1659,
    yearText: '1659',
    period: 'baroque',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Self-portrait',
    region: 'Europe',
    dimensions: '84.5 × 66 cm',
    location: 'National Gallery of Art, Washington',
    roomId: 'baroque',
    file: 'Rembrandt van Rijn - Self-Portrait - Google Art Project.jpg',
    description:
      'A late self-portrait painted after the artist’s insolvency, with the face worked in heavy impasto and the background left almost bare. The hands are barely indicated.',
    historicalContext:
      'Rembrandt painted himself throughout his career, in etching, drawing and oil. The series is often treated as a single work made over forty years, tracking a face from confident youth to a much plainer old age.',
    curatorNote:
      'Interpretation: he gives the light to the forehead and the eyes and lets everything below the collar go. There is nothing here to sell.',
    tags: ['self-portrait', 'late work', 'impasto'],
  }),
  work({
    id: 'calling-of-saint-matthew',
    title: 'The Calling of Saint Matthew',
    artist: 'Michelangelo Merisi da Caravaggio',
    artistId: 'caravaggio',
    year: 1600,
    yearText: '1599–1600',
    period: 'baroque',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Religious',
    region: 'Europe',
    dimensions: '322 × 340 cm',
    location: 'San Luigi dei Francesi, Rome',
    roomId: 'baroque',
    file: 'The Calling of Saint Matthew-Caravaggo (1599-1600).jpg',
    description:
      'Men count money at a table in a dark room when a shaft of light and a pointing hand arrive from the right. The figures wear contemporary sixteenth-century dress rather than biblical costume.',
    historicalContext:
      'One of two canvases painted for the Contarelli Chapel, Caravaggio’s first major public commission. The chapel made his reputation in Rome almost immediately, and painters across Europe began imitating his lighting within a decade.',
    curatorNote:
      'Interpretation: scholars still argue about which man is Matthew. The painting is more interesting if you cannot tell — the light has entered the room and nobody has decided yet.',
    tags: ['religious', 'rome', 'chiaroscuro', 'tenebrism'],
  }),

  /* ------------------------------ Romanticism ------------------------------ */
  work({
    id: 'third-of-may',
    title: 'The Third of May 1808',
    artist: 'Francisco de Goya',
    artistId: 'goya',
    year: 1814,
    yearText: '1814',
    period: 'romanticism',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'History',
    region: 'Europe',
    dimensions: '268 × 347 cm',
    location: 'Museo del Prado, Madrid',
    roomId: 'romanticism',
    file: 'El tres de mayo de 1808 en Madrid.jpg',
    description:
      'A firing squad, seen from behind and faceless, executes Madrid citizens by lantern light. The central figure throws his arms wide in a white shirt that carries almost all the light in the painting.',
    historicalContext:
      'Goya painted it six years after the event, when French occupying forces had been driven out of Spain. It was commissioned by the provisional government and is often described as one of the first paintings to treat modern war without heroism.',
    curatorNote:
      'Interpretation: the soldiers are a machine — identical, angled, without eyes. Everything human in the picture is crowded into the left third and about to be gone.',
    tags: ['history', 'war', 'madrid', 'prado'],
  }),
  work({
    id: 'fighting-temeraire',
    title: 'The Fighting Temeraire',
    artist: 'J. M. W. Turner',
    artistId: 'turner',
    year: 1839,
    yearText: '1839',
    period: 'romanticism',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Marine',
    region: 'Europe',
    dimensions: '90.7 × 121.6 cm',
    location: 'National Gallery, London',
    roomId: 'romanticism',
    file: 'The Fighting Temeraire, JMW Turner, National Gallery.jpg',
    description:
      'A warship that fought at Trafalgar is towed up the Thames to be broken up, pulled by a small black steam tug. The sunset occupies more of the canvas than either vessel.',
    historicalContext:
      'The real tow took place in 1838. Turner adjusted the details freely — the ship had already been stripped of its masts — and refused to sell the painting during his lifetime.',
    curatorNote:
      'Interpretation: the tug is the only thing in the picture painted in hard, definite blacks. The past is luminous and vague; the future is small, dark and entirely sure of itself.',
    tags: ['marine', 'sunset', 'thames', 'london'],
  }),
  work({
    id: 'rain-steam-speed',
    title: 'Rain, Steam and Speed — The Great Western Railway',
    artist: 'J. M. W. Turner',
    artistId: 'turner',
    year: 1844,
    yearText: '1844',
    period: 'romanticism',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Landscape',
    region: 'Europe',
    dimensions: '91 × 121.8 cm',
    location: 'National Gallery, London',
    roomId: 'romanticism',
    file: 'Rain Steam and Speed the Great Western Railway.jpg',
    description:
      'A locomotive crosses Maidenhead Railway Bridge through rain, its black funnel the only hard form in a field of dissolving light. A hare runs ahead of it along the track.',
    historicalContext:
      'Painted nine years into Britain’s railway boom, when steam travel was still new enough to be frightening. Critics at the 1844 Royal Academy exhibition were divided over whether it was finished.',
    curatorNote:
      'Interpretation: he paints weather and machinery with the same brush, so you cannot say where the storm stops and the engine starts.',
    tags: ['landscape', 'railway', 'weather', 'london'],
  }),
  work({
    id: 'wanderer-sea-of-fog',
    title: 'Wanderer above the Sea of Fog',
    artist: 'Caspar David Friedrich',
    artistId: 'friedrich',
    year: 1818,
    yearText: 'c. 1818',
    period: 'romanticism',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Landscape',
    region: 'Europe',
    dimensions: '94.8 × 74.8 cm',
    location: 'Hamburger Kunsthalle, Hamburg',
    roomId: 'romanticism',
    file: 'Caspar David Friedrich - Wanderer above the sea of fog.jpg',
    description:
      'A man stands on a rocky outcrop with his back turned, looking over a landscape filled with fog. The rocks in the distance are based on real formations in the Elbe Sandstone Mountains.',
    historicalContext:
      'Friedrich painted several compositions using a back-turned figure, a device that became closely identified with German Romanticism. The painting entered the Hamburger Kunsthalle collection in 1970.',
    curatorNote:
      'Interpretation: you cannot see his face, so the painting quietly hands you his position. The viewpoint is the subject.',
    tags: ['landscape', 'fog', 'romantic', 'germany', 'famous'],
  }),
  work({
    id: 'sea-of-ice',
    title: 'The Sea of Ice',
    artist: 'Caspar David Friedrich',
    artistId: 'friedrich',
    year: 1824,
    yearText: '1823–1824',
    period: 'romanticism',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Landscape',
    region: 'Europe',
    dimensions: '96.7 × 126.9 cm',
    location: 'Hamburger Kunsthalle, Hamburg',
    roomId: 'romanticism',
    file: 'Caspar David Friedrich - Das Eismeer - Hamburger Kunsthalle - 02.jpg',
    description:
      'Slabs of broken ice pile into a jagged pyramid, with the crushed stern of a ship barely visible on the right. Friedrich studied ice floes on the Elbe during the winter of 1820 to 1821.',
    historicalContext:
      'The painting was connected to contemporary British expeditions searching for a Northwest Passage. It found no buyer in Friedrich’s lifetime and was largely dismissed until the twentieth century.',
    curatorNote:
      'Interpretation: the wreck is almost an afterthought, tucked in at the edge. The ice is not hostile — it is simply indifferent, which is worse.',
    tags: ['landscape', 'ice', 'arctic', 'shipwreck'],
  }),

  /* ----------------------------- Impressionism ----------------------------- */
  work({
    id: 'impression-sunrise',
    title: 'Impression, Sunrise',
    artist: 'Claude Monet',
    artistId: 'monet',
    year: 1872,
    yearText: '1872',
    period: 'impressionism',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Marine',
    region: 'Europe',
    dimensions: '48 × 63 cm',
    location: 'Musée Marmottan Monet, Paris',
    roomId: 'impressionism',
    file: 'Monet - Impression, Sunrise.jpg',
    description:
      'The harbour at Le Havre at dawn, with masts and cranes reduced to grey strokes and an orange sun laid over the water. The whole canvas is thinly painted and was made quickly.',
    historicalContext:
      'Shown at the 1874 independent exhibition in Paris, where the critic Louis Leroy used its title to mock the whole group as "Impressionists". The name stuck and the painters eventually adopted it.',
    curatorNote:
      'Interpretation: measured for brightness, the sun is almost the same value as the sky around it. It reads as blazing because of colour alone.',
    tags: ['marine', 'sunrise', 'le havre', 'paris', 'famous'],
  }),
  work({
    id: 'water-lilies',
    title: 'Water Lilies',
    artist: 'Claude Monet',
    artistId: 'monet',
    year: 1906,
    yearText: '1906',
    period: 'impressionism',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Landscape',
    region: 'Europe',
    dimensions: '89.9 × 94.1 cm',
    location: 'Art Institute of Chicago',
    roomId: 'impressionism',
    file: 'Claude Monet - Water Lilies - 1906, Ryerson.jpg',
    description:
      'The surface of the lily pond at Giverny, painted with no horizon, no bank and no sky except as reflection. Monet returned to this motif roughly 250 times.',
    historicalContext:
      'Monet diverted a stream to build the water garden at Giverny in the 1890s, then spent the rest of his life painting it. The later canvases were made as his eyesight deteriorated from cataracts.',
    curatorNote:
      'Interpretation: there is no ground plane to stand on. The painting asks you to accept that up and down have stopped applying.',
    tags: ['landscape', 'giverny', 'water', 'series'],
  }),
  work({
    id: 'grainstack-sunset',
    title: 'Grainstack (Sunset)',
    artist: 'Claude Monet',
    artistId: 'monet',
    year: 1891,
    yearText: '1890–1891',
    period: 'impressionism',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Landscape',
    region: 'Europe',
    dimensions: '73.3 × 92.6 cm',
    location: 'Museum of Fine Arts, Boston',
    roomId: 'impressionism',
    file: 'Claude Monet - Graystaks I.JPG',
    description:
      'One canvas from a series showing the same stacks of harvested grain in a field near Giverny under changing light. Monet worked on several canvases at once, switching as the light moved.',
    historicalContext:
      'Fifteen of the grainstacks were exhibited together in Paris in 1891 and sold quickly. The series established the idea of painting one subject repeatedly as a single sustained project.',
    curatorNote:
      'Interpretation: the subject is not the stack. The stack is a fixed object placed in the picture so that everything else can be measured against it.',
    tags: ['landscape', 'series', 'light', 'giverny'],
  }),
  work({
    id: 'ballet-class',
    title: 'The Ballet Class',
    artist: 'Edgar Degas',
    artistId: 'degas',
    year: 1874,
    yearText: 'c. 1873–1876',
    period: 'impressionism',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Genre scene',
    region: 'Europe',
    dimensions: '85 × 75 cm',
    location: 'Musée d’Orsay, Paris',
    roomId: 'impressionism',
    file: 'Edgar Degas - The Ballet Class - Google Art Project.jpg',
    description:
      'Dancers wait, stretch and scratch during a rehearsal while an ageing ballet master leans on a stick. The floor tilts steeply upward, pushing the figures toward the viewer.',
    historicalContext:
      'Degas had access to the rehearsal rooms of the Paris Opéra and treated the ballet as work rather than spectacle. Most of the dancers were girls from poor families, employed under difficult conditions.',
    curatorNote:
      'Interpretation: almost nobody is dancing. He consistently painted the minutes on either side of the performance.',
    tags: ['dance', 'paris', 'opera', 'genre'],
  }),
  work({
    id: 'moulin-de-la-galette',
    title: 'Bal du moulin de la Galette',
    artist: 'Pierre-Auguste Renoir',
    artistId: 'renoir',
    year: 1876,
    yearText: '1876',
    period: 'impressionism',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Genre scene',
    region: 'Europe',
    dimensions: '131 × 175 cm',
    location: 'Musée d’Orsay, Paris',
    roomId: 'impressionism',
    file: 'Pierre-Auguste Renoir, Le Moulin de la Galette.jpg',
    description:
      'A Sunday afternoon dance in a Montmartre garden, with sunlight falling through trees onto faces, hats and jackets in irregular patches. Renoir used friends and local residents as models.',
    historicalContext:
      'Shown at the third Impressionist exhibition in 1877. Contemporary critics objected that the dappled light made the figures look diseased.',
    curatorNote:
      'Interpretation: the blue-violet shadows on the men’s coats were the scandal. Renoir refused to paint shade as a darker version of the same colour.',
    tags: ['dance', 'montmartre', 'paris', 'light', 'crowd'],
  }),
  work({
    id: 'childs-bath',
    title: 'The Child’s Bath',
    artist: 'Mary Cassatt',
    artistId: 'cassatt',
    year: 1893,
    yearText: '1893',
    period: 'impressionism',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Genre scene',
    region: 'Americas',
    dimensions: '100.3 × 66.1 cm',
    location: 'Art Institute of Chicago',
    roomId: 'impressionism',
    file: "Mary Cassatt - The Child's Bath - Google Art Project.jpg",
    description:
      'Seen from above, a woman washes a child’s feet in a basin. Patterned wallpaper, striped dress and carpet meet with almost no perspective between them.',
    historicalContext:
      'Cassatt saw a major exhibition of Japanese prints in Paris in 1890 and adopted their high viewpoints and flat pattern. She was the only American invited to exhibit with the French Impressionists.',
    curatorNote:
      'Interpretation: the one place the pattern stops is where the two of them touch. Everything else in the room is busy.',
    tags: ['domestic', 'japonisme', 'chicago', 'mother and child'],
  }),

  /* -------------------------------- Modern --------------------------------- */
  work({
    id: 'starry-night',
    title: 'The Starry Night',
    artist: 'Vincent van Gogh',
    artistId: 'vangogh',
    year: 1889,
    yearText: '1889',
    period: 'modern',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Landscape',
    region: 'Europe',
    dimensions: '73.7 × 92.1 cm',
    location: 'Museum of Modern Art, New York',
    roomId: 'modern',
    file: 'Van Gogh - Starry Night - Google Art Project.jpg',
    description:
      'A night sky in heavy rolling strokes above a village, with a cypress rising through the left side of the canvas. Van Gogh painted it from memory and imagination rather than outdoors at night.',
    historicalContext:
      'Painted in June 1889 from a room at the asylum of Saint-Paul-de-Mausole in Saint-Rémy-de-Provence, where the artist had admitted himself. He mentioned the morning star and the view from his barred window in letters to his brother Theo.',
    curatorNote:
      'Interpretation: the village below is painted in short, orderly, almost dutiful strokes. Only the sky is allowed to move.',
    tags: ['night', 'landscape', 'provence', 'moma', 'famous'],
  }),
  work({
    id: 'sunflowers',
    title: 'Sunflowers',
    artist: 'Vincent van Gogh',
    artistId: 'vangogh',
    year: 1888,
    yearText: '1888',
    period: 'modern',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Still life',
    region: 'Europe',
    dimensions: '92.1 × 73 cm',
    location: 'National Gallery, London',
    roomId: 'modern',
    file: 'Vincent Willem van Gogh 127.jpg',
    description:
      'Fifteen sunflowers in an earthenware vase, in stages from fresh to dried, painted almost entirely in yellows against a yellow ground. Van Gogh used the then-new chrome yellow pigments.',
    historicalContext:
      'Made in Arles to decorate the room Paul Gauguin would occupy at the Yellow House. Van Gogh painted several versions and considered the series among his strongest work.',
    curatorNote:
      'Interpretation: the flowers are at every stage of dying at once. It is a still life about time, dressed as decoration.',
    tags: ['still life', 'arles', 'yellow', 'famous'],
  }),
  work({
    id: 'bedroom-in-arles',
    title: 'The Bedroom',
    artist: 'Vincent van Gogh',
    artistId: 'vangogh',
    year: 1888,
    yearText: '1888',
    period: 'modern',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Interior',
    region: 'Europe',
    dimensions: '72.4 × 91.3 cm',
    location: 'Van Gogh Museum, Amsterdam',
    roomId: 'modern',
    file: 'Vincent van Gogh - De slaapkamer - Google Art Project.jpg',
    description:
      'The artist’s own room at the Yellow House in Arles, with the floor and walls tipped at angles that do not resolve. The walls were originally violet; the pigment has faded toward blue.',
    historicalContext:
      'Van Gogh described the painting in a letter as an image of rest, achieved through colour rather than through drawing. He made three versions, of which this is the first.',
    curatorNote:
      'Interpretation: everything in the room is paired — two chairs, two pillows, two portraits — in a picture about being alone in it.',
    tags: ['interior', 'arles', 'yellow house'],
  }),
  work({
    id: 'vangogh-self-portrait',
    title: 'Self-Portrait',
    artist: 'Vincent van Gogh',
    artistId: 'vangogh',
    year: 1889,
    yearText: '1889',
    period: 'modern',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Self-portrait',
    region: 'Europe',
    dimensions: '65 × 54.2 cm',
    location: 'Musée d’Orsay, Paris',
    roomId: 'modern',
    file: 'Vincent van Gogh - Self-Portrait - Google Art Project (454045).jpg',
    description:
      'A self-portrait in a pale blue-green field of swirling strokes, the face turned three-quarters and the eyes fixed on the viewer. The background moves more than the sitter does.',
    historicalContext:
      'Painted at Saint-Rémy in September 1889. Van Gogh made more than thirty self-portraits in four years, in part because he could not afford models.',
    curatorNote:
      'Interpretation: the same brushwork that makes the background restless is used, slightly slowed, on his jacket. He is made of the same weather.',
    tags: ['self-portrait', 'saint-rémy', 'orsay'],
  }),
  work({
    id: 'the-scream',
    title: 'The Scream',
    artist: 'Edvard Munch',
    artistId: 'munch',
    year: 1893,
    yearText: '1893',
    period: 'modern',
    medium: 'Mixed Media',
    materials: 'Oil, tempera and pastel on cardboard',
    category: 'Symbolism',
    region: 'Europe',
    dimensions: '91 × 73.5 cm',
    location: 'National Gallery, Oslo',
    roomId: 'modern',
    file: 'Edvard Munch, 1893, The Scream, oil, tempera and pastel on cardboard, 91 x 73 cm, National Gallery of Norway.jpg',
    description:
      'A figure on a bridge holds its head while the sky behind runs red and orange in horizontal bands. Two other figures walk away at the far end of the railing.',
    historicalContext:
      'Munch wrote of walking at sunset near Kristiania and feeling an endless scream passing through nature. He produced four versions in different media between 1893 and 1910.',
    curatorNote:
      'Interpretation: the figure is covering its ears. The title points at the landscape, not the face.',
    tags: ['symbolism', 'oslo', 'anxiety', 'famous'],
  }),
  work({
    id: 'the-kiss',
    title: 'The Kiss',
    artist: 'Gustav Klimt',
    artistId: 'klimt',
    year: 1908,
    yearText: '1907–1908',
    period: 'modern',
    medium: 'Painting',
    materials: 'Oil and gold leaf on canvas',
    category: 'Allegory',
    region: 'Europe',
    dimensions: '180 × 180 cm',
    location: 'Belvedere, Vienna',
    roomId: 'modern',
    file: 'The Kiss - Gustav Klimt - Google Cultural Institute.jpg',
    description:
      'Two figures kneel at the edge of a flowered meadow, wrapped in a single gold robe patterned with rectangles on one side and circles on the other. Only the faces, hands and feet are painted as flesh.',
    historicalContext:
      'Made at the height of Klimt’s golden phase, after his 1903 visits to the Byzantine mosaics of Ravenna. The Austrian state bought it before it was even finished.',
    curatorNote:
      'Interpretation: her feet are curled over the edge of the flower bed, with nothing underneath. The gold hides how narrow the ground is.',
    tags: ['vienna', 'gold', 'allegory', 'famous'],
  }),
  work({
    id: 'composition-vii',
    title: 'Composition VII',
    artist: 'Wassily Kandinsky',
    artistId: 'kandinsky',
    year: 1913,
    yearText: '1913',
    period: 'modern',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Abstraction',
    region: 'Europe',
    dimensions: '200 × 300 cm',
    location: 'Tretyakov Gallery, Moscow',
    roomId: 'modern',
    file: 'Vassily Kandinsky, 1913 - Composition 7.jpg',
    description:
      'A large canvas with no fixed centre, built from colliding colour masses and black lines. Kandinsky made more than thirty preparatory studies and painted the final version in four days.',
    historicalContext:
      'Painted in Munich shortly before the First World War, in the years when Kandinsky was writing about colour as a directly spiritual force. He regarded the Compositions as his most ambitious works.',
    curatorNote:
      'Interpretation: the studies show recognisable figures that were progressively removed. What is left is the structure they were standing in.',
    tags: ['abstraction', 'munich', 'colour', 'large'],
  }),
  work({
    id: 'the-swan',
    title: 'The Swan, No. 1',
    artist: 'Hilma af Klint',
    artistId: 'af-klint',
    year: 1915,
    yearText: '1914–1915',
    period: 'modern',
    medium: 'Painting',
    materials: 'Oil on canvas',
    category: 'Abstraction',
    region: 'Europe',
    dimensions: '150 × 150 cm',
    location: 'Moderna Museet, Stockholm (Hilma af Klint Foundation)',
    roomId: 'modern',
    file: 'Hilma af Klint - Group IX SUW, The Swan No. 1 (13947).jpg',
    description:
      'Two swans, one white and one black, meet across a horizontal division, each mirrored exactly in the other’s field. It opens a series of twenty-four paintings.',
    historicalContext:
      'Part of The Paintings for the Temple, made between 1906 and 1915. Af Klint left instructions that the work should not be shown for twenty years after her death, and it remained largely unseen until 1986.',
    curatorNote:
      'Interpretation: the series begins with the two swans fully formed and slowly dismantles them into geometry. This is the last moment anything in it is recognisable.',
    tags: ['abstraction', 'stockholm', 'series', 'symmetry'],
  }),

  /* -------------------------------- Asian art ------------------------------- */
  work({
    id: 'great-wave',
    title: 'Under the Wave off Kanagawa (The Great Wave)',
    artist: 'Katsushika Hokusai',
    artistId: 'hokusai',
    year: 1831,
    yearText: 'c. 1831',
    period: 'romanticism',
    medium: 'Drawing',
    materials: 'Woodblock print, ink and colour on paper',
    category: 'Landscape',
    region: 'Asia',
    dimensions: '25.7 × 37.9 cm',
    location: 'Impressions in the Met, British Museum and elsewhere',
    roomId: 'asian',
    file: 'Tsunami by hokusai 19th century.jpg',
    description:
      'A breaking wave rears over three fishing boats, with Mount Fuji small and still on the horizon beneath its claws of foam. It is the first print in Thirty-Six Views of Mount Fuji.',
    historicalContext:
      'Printed from carved woodblocks in an edition that ran to thousands of impressions, sold cheaply in Edo. The deep blue is imported Prussian blue, newly available in Japan in the 1830s.',
    curatorNote:
      'Interpretation: the mountain and the foam are drawn with the same peaked silhouette, one permanent and one lasting a second.',
    tags: ['ukiyo-e', 'wave', 'fuji', 'print', 'famous'],
  }),
  work({
    id: 'red-fuji',
    title: 'Fine Wind, Clear Morning (Red Fuji)',
    artist: 'Katsushika Hokusai',
    artistId: 'hokusai',
    year: 1831,
    yearText: 'c. 1831',
    period: 'romanticism',
    medium: 'Drawing',
    materials: 'Woodblock print, ink and colour on paper',
    category: 'Landscape',
    region: 'Asia',
    dimensions: '25.7 × 38 cm',
    location: 'Impressions in major print collections',
    roomId: 'asian',
    file: 'Red Fuji southern wind clear morning.jpg',
    description:
      'Mount Fuji fills the frame in red-brown, with streaked cloud above and dark forest at its base. The composition is reduced to three bands and one diagonal.',
    historicalContext:
      'Also from Thirty-Six Views of Mount Fuji. The mountain briefly takes on a reddish colour in late summer at dawn, when the snow has receded.',
    curatorNote:
      'Interpretation: it is the same mountain that the wave dwarfed, given the whole sheet. The series keeps changing your distance from one object.',
    tags: ['ukiyo-e', 'fuji', 'print', 'minimal'],
  }),
  work({
    id: 'sudden-shower',
    title: 'Sudden Shower over Shin-Ōhashi Bridge and Atake',
    artist: 'Utagawa Hiroshige',
    artistId: 'hiroshige',
    year: 1857,
    yearText: '1857',
    period: 'romanticism',
    medium: 'Drawing',
    materials: 'Woodblock print, ink and colour on paper',
    category: 'Landscape',
    region: 'Asia',
    dimensions: '34 × 24.5 cm',
    location: 'Impressions in the Brooklyn Museum and elsewhere',
    roomId: 'asian',
    file: 'Hiroshige, Sudden shower over Shin-Ōhashi bridge and Atake, 1857.jpg',
    description:
      'Rain falls in straight diagonal lines across a wooden bridge while figures hurry over it under mats and umbrellas. The far bank is a flat grey wash.',
    historicalContext:
      'From One Hundred Famous Views of Edo, made in the last years of Hiroshige’s life. Van Gogh painted a full copy of this print in oils in 1887.',
    curatorNote:
      'Interpretation: rain had never been printed as lines before this series made it ordinary. The technical problem was cutting a straight hairline across an entire block.',
    tags: ['ukiyo-e', 'rain', 'edo', 'bridge', 'print'],
  }),
  work({
    id: 'plum-park-kameido',
    title: 'Plum Park in Kameido',
    artist: 'Utagawa Hiroshige',
    artistId: 'hiroshige',
    year: 1857,
    yearText: '1857',
    period: 'romanticism',
    medium: 'Drawing',
    materials: 'Woodblock print, ink and colour on paper',
    category: 'Landscape',
    region: 'Asia',
    dimensions: '36 × 23.5 cm',
    location: 'Impressions in the Brooklyn Museum and elsewhere',
    roomId: 'asian',
    file: 'Ando Hiroshige - Plum Garden, Kameido - Google Art Project.jpg',
    description:
      'A plum tree trunk cuts straight up the foreground, so close that the orchard and visitors behind it are seen through its branches. The sky is graded from green to red.',
    historicalContext:
      'Also from One Hundred Famous Views of Edo. Van Gogh copied this print in oils, adding a border of invented Japanese characters.',
    curatorNote:
      'Interpretation: the tree blocks the view of the thing you came to see, and that obstruction is the composition.',
    tags: ['ukiyo-e', 'edo', 'plum', 'print', 'japonisme'],
  }),

  /* ------------------------------- Photography ------------------------------ */
  work({
    id: 'boulevard-du-temple',
    title: 'Boulevard du Temple',
    artist: 'Louis Daguerre',
    artistId: 'daguerre',
    year: 1838,
    yearText: 'c. 1838',
    period: 'romanticism',
    medium: 'Photography',
    materials: 'Daguerreotype',
    category: 'Cityscape',
    region: 'Europe',
    dimensions: 'Approx. 12.9 × 16.3 cm',
    location: 'Bayerisches Nationalmuseum, Munich (original lost)',
    roomId: 'photography',
    file: 'Boulevard du Temple by Daguerre.jpg',
    description:
      'A busy Paris street that appears almost empty, because the exposure ran for several minutes and moving traffic left no trace. A man having his boots polished stood still long enough to register.',
    historicalContext:
      'One of the earliest surviving photographs to include a human figure, made a year before the daguerreotype process was announced publicly in 1839. The original plate was damaged in the twentieth century and survives through reproductions.',
    curatorNote:
      'Interpretation: the first person ever photographed was, as far as anyone can tell, standing still by accident.',
    tags: ['photography', 'paris', 'daguerreotype', 'first'],
  }),
  work({
    id: 'horse-in-motion',
    title: 'The Horse in Motion',
    artist: 'Eadweard Muybridge',
    artistId: 'muybridge',
    year: 1878,
    yearText: '1878',
    period: 'romanticism',
    medium: 'Photography',
    materials: 'Albumen prints from collodion negatives',
    category: 'Study',
    region: 'Americas',
    dimensions: 'Card: 10.8 × 16.5 cm',
    location: 'Library of Congress, Washington',
    roomId: 'photography',
    file: 'The Horse in Motion high res.jpg',
    description:
      'A sequence of frames of a galloping horse, made with cameras triggered in turn by trip wires across a track. The frames show all four hooves off the ground at once.',
    historicalContext:
      'Commissioned by Leland Stanford in California to settle whether a galloping horse is ever fully airborne. The sequence method led directly toward motion pictures.',
    curatorNote:
      'Interpretation: painters had been drawing the gallop wrong for centuries, with legs splayed front and back. One strip of card corrected an entire tradition.',
    tags: ['photography', 'motion', 'sequence', 'science'],
  }),
  work({
    id: 'migrant-mother',
    title: 'Migrant Mother',
    artist: 'Dorothea Lange',
    artistId: 'lange',
    year: 1936,
    yearText: '1936',
    period: 'modern',
    medium: 'Photography',
    materials: 'Gelatin silver print',
    category: 'Documentary',
    region: 'Americas',
    dimensions: 'Negative: 4 × 5 in',
    location: 'Library of Congress, Washington',
    roomId: 'photography',
    file: 'Lange-MigrantMother02.jpg',
    description:
      'A woman in a pea-pickers’ camp in Nipomo, California, looks past the camera with two children turned into her shoulders. Lange made six exposures and spent about ten minutes there.',
    historicalContext:
      'Made for the Farm Security Administration during the Depression and published within days, prompting federal food shipments to the camp. The sitter was later identified as Florence Owens Thompson, who said she never benefited from the photograph.',
    curatorNote:
      'Interpretation: neither child shows a face. Their refusal is what keeps the picture from being easy to look at.',
    tags: ['photography', 'documentary', 'depression', 'famous'],
  }),
  work({
    id: 'tetons-snake-river',
    title: 'The Tetons and the Snake River',
    artist: 'Ansel Adams',
    artistId: 'adams',
    year: 1942,
    yearText: '1942',
    period: 'modern',
    medium: 'Photography',
    materials: 'Gelatin silver print',
    category: 'Landscape',
    region: 'Americas',
    dimensions: 'Negative: 8 × 10 in',
    location: 'National Archives, Washington',
    roomId: 'photography',
    file: 'Adams The Tetons and the Snake River.jpg',
    description:
      'The Snake River curves through the foreground toward the Teton range, with clouds breaking above the peaks. Adams used deep tonal separation between water, forest and rock.',
    historicalContext:
      'Made in Grand Teton National Park under a Department of the Interior commission, which is why the negative is a US public record. A copy of this image was included on the Voyager Golden Record in 1977.',
    curatorNote:
      'Interpretation: the river is the brightest thing in the frame and leads exactly where he wants your eye. Nothing about this is a found composition.',
    tags: ['photography', 'landscape', 'wyoming', 'black and white'],
  }),

  /* -------------------------------- Sculpture ------------------------------- */
  work({
    id: 'the-thinker',
    title: 'The Thinker',
    artist: 'Auguste Rodin',
    artistId: 'rodin',
    year: 1904,
    yearText: 'Modelled 1880–1881; this cast 1904',
    period: 'modern',
    medium: 'Sculpture',
    materials: 'Bronze',
    category: 'Figure',
    region: 'Europe',
    dimensions: '189 × 98 × 140 cm (monumental version)',
    location: 'Musée Rodin, Paris, and casts worldwide',
    roomId: 'sculpture',
    file: 'The Thinker, Rodin.jpg',
    description:
      'A seated nude man leans forward with his chin on the back of his hand, every muscle tensed rather than relaxed. It exists in many authorised casts at different sizes.',
    historicalContext:
      'Originally conceived as a smaller figure above the doorway of The Gates of Hell, where it represented the poet Dante looking down on his characters. Rodin later enlarged and exhibited it independently.',
    curatorNote:
      'Interpretation: it is a strange posture for thought — the wrong hand, the whole body clenched. He gives thinking the physical strain of lifting something.',
    tags: ['sculpture', 'bronze', 'figure', 'paris', 'famous'],
  }),
  work({
    id: 'david',
    title: 'David',
    artist: 'Michelangelo Buonarroti',
    artistId: 'michelangelo',
    year: 1504,
    yearText: '1501–1504',
    period: 'renaissance',
    medium: 'Sculpture',
    materials: 'Carrara marble',
    category: 'Figure',
    region: 'Europe',
    dimensions: '517 cm tall',
    location: 'Galleria dell’Accademia, Florence',
    roomId: 'sculpture',
    file: "Michelangelo's David.JPG",
    description:
      'A colossal standing nude with a sling over one shoulder and a stone in the right hand, the head and hands deliberately oversized. Michelangelo carved it from a block other sculptors had rejected as flawed.',
    historicalContext:
      'Commissioned for the roofline of Florence Cathedral but installed instead outside the Palazzo Vecchio, where it became a civic symbol of the republic. It was moved indoors in 1873 to protect it from weather.',
    curatorNote:
      'Interpretation: the proportions are corrected for a viewer far below. Seen at eye level, as most people now see it, the hands look unreasonably large.',
    tags: ['sculpture', 'marble', 'florence', 'famous'],
  }),
  work({
    id: 'venus-de-milo',
    title: 'Venus de Milo',
    artist: 'Maker unrecorded',
    artistId: 'unknown',
    year: -120,
    yearText: 'c. 130–100 BCE',
    period: 'ancient',
    medium: 'Sculpture',
    materials: 'Parian marble',
    category: 'Figure',
    region: 'Europe',
    dimensions: '204 cm tall',
    location: 'Musée du Louvre, Paris',
    roomId: 'sculpture',
    file: 'Venus de Milo Louvre Ma399 n4.jpg',
    description:
      'A Hellenistic marble figure, generally identified as Aphrodite, carved in two blocks joined at the hip. Both arms were already missing when it was found.',
    historicalContext:
      'Discovered on the Aegean island of Milos in 1820 and acquired for the French crown. An inscribed base naming a sculptor from Antioch was recorded at the time of discovery and subsequently lost.',
    curatorNote:
      'Interpretation: the missing arms are now part of the work. Every reconstruction proposed since 1820 has looked worse than the damage.',
    tags: ['sculpture', 'ancient', 'greek', 'louvre', 'marble'],
  }),
  work({
    id: 'winged-victory',
    title: 'Winged Victory of Samothrace',
    artist: 'Maker unrecorded',
    artistId: 'unknown',
    year: -190,
    yearText: 'c. 200–190 BCE',
    period: 'ancient',
    medium: 'Sculpture',
    materials: 'Parian marble',
    category: 'Figure',
    region: 'Europe',
    dimensions: '244 cm (figure)',
    location: 'Musée du Louvre, Paris',
    roomId: 'sculpture',
    file: 'Nike of Samothrake Louvre Ma2369 n4.jpg',
    description:
      'A winged figure of Nike lands on the prow of a stone ship, her wet drapery pressed back by wind. The head and arms have not been recovered.',
    historicalContext:
      'Found in 1863 on Samothrace, in a sanctuary overlooking the sea, and reassembled from fragments. The ship-shaped base was identified and joined to the figure decades after the initial discovery.',
    curatorNote:
      'Interpretation: the carving is finished on the side that faced a visitor climbing the sanctuary steps, and rougher behind. It was designed for one approach.',
    tags: ['sculpture', 'ancient', 'greek', 'louvre', 'nike'],
  }),
  work({
    id: 'nefertiti-bust',
    title: 'Bust of Nefertiti',
    artist: 'Maker unrecorded',
    artistId: 'unknown',
    year: -1345,
    yearText: 'c. 1345 BCE',
    period: 'ancient',
    medium: 'Sculpture',
    materials: 'Limestone with stucco and paint',
    category: 'Portrait',
    region: 'Africa',
    dimensions: '48 cm tall',
    location: 'Neues Museum, Berlin',
    roomId: 'sculpture',
    file: 'Nofretete Neues Museum.jpg',
    description:
      'A painted limestone bust of the Egyptian queen Nefertiti, wearing a flat-topped blue crown. The left eye was never inlaid.',
    historicalContext:
      'Excavated in 1912 at Amarna in the workshop of the sculptor Thutmose, where it appears to have served as a reference model rather than a finished commission. Ownership has been formally disputed by Egypt since the 1920s.',
    curatorNote:
      'Interpretation: the unfinished eye is often read as damage, but a workshop model would not need both. It may simply never have been meant to be looked at.',
    tags: ['sculpture', 'ancient', 'egypt', 'berlin', 'portrait'],
  }),

  /* --------------------------- Digital & contemporary ----------------------- */
  generated({
    id: 'dm-field-recording',
    title: 'Field Recording I',
    artist: 'Digital Museum Studio',
    artistId: 'dm-studio',
    year: 2024,
    yearText: '2024',
    period: 'contemporary',
    medium: 'Digital',
    materials: 'Generated vector composition',
    category: 'Abstraction',
    region: 'Oceania',
    dimensions: 'Variable',
    location: 'Generated in your browser',
    roomId: 'digital',
    variant: 'wash',
    description:
      'A horizon of overlapping bands, drawn from a fixed seed so the composition is identical on every visit and every device. Nothing is stored; the image is written the moment the room opens.',
    historicalContext:
      'A demonstration work made for this project, not a historical artefact. It sits here to show how the collection handles media that has no photograph and no institution behind it.',
    curatorNote:
      'Interpretation: a museum label normally tells you where a thing is kept. This one has nowhere to be kept, which is either a problem or the point.',
    tags: ['digital', 'generative', 'demo', 'abstraction'],
  }),
  generated({
    id: 'dm-lattice',
    title: 'Lattice for an Empty Room',
    artist: 'Digital Museum Studio',
    artistId: 'dm-studio',
    year: 2024,
    yearText: '2024',
    period: 'contemporary',
    medium: 'Digital',
    materials: 'Generated vector composition',
    category: 'Abstraction',
    region: 'Oceania',
    dimensions: 'Variable',
    location: 'Generated in your browser',
    roomId: 'digital',
    variant: 'grid',
    description:
      'A grid of squares whose sizes and opacities are derived from the work’s own identifier. The same rules would produce a different picture under a different name.',
    historicalContext:
      'A demonstration work made for this project. Generative practice has a long precedent in art — Sol LeWitt issued wall-drawing instructions to be executed by others from 1968 onward.',
    curatorNote:
      'Interpretation: the title is doing the work the picture refuses to. Change the title and the squares rearrange themselves.',
    tags: ['digital', 'generative', 'demo', 'grid'],
  }),
  generated({
    id: 'dm-orbit',
    title: 'Orbit Study',
    artist: 'Digital Museum Studio',
    artistId: 'dm-studio',
    year: 2025,
    yearText: '2025',
    period: 'contemporary',
    medium: 'Digital',
    materials: 'Generated vector composition',
    category: 'Abstraction',
    region: 'Oceania',
    dimensions: 'Variable',
    location: 'Generated in your browser',
    roomId: 'digital',
    variant: 'orbit',
    description:
      'Concentric rings at slightly irregular centres, thinning as they widen. The drift between centres is the only decision the seed makes.',
    historicalContext:
      'A demonstration work made for this project, placed alongside the historical collection so the two can be compared directly.',
    curatorNote:
      'Interpretation: hang it beside the Hilma af Klint and the resemblance is uncomfortable. Circles were spiritual once; here they are arithmetic.',
    tags: ['digital', 'generative', 'demo', 'circles'],
  }),
  generated({
    id: 'dm-after-hours',
    title: 'After Hours',
    artist: 'Digital Museum Studio',
    artistId: 'dm-studio',
    year: 2025,
    yearText: '2025',
    period: 'contemporary',
    medium: 'Digital',
    materials: 'Generated vector composition',
    category: 'Abstraction',
    region: 'Oceania',
    dimensions: 'Variable',
    location: 'Generated in your browser',
    roomId: 'digital',
    variant: 'wash',
    description:
      'A darker companion to Field Recording I, built from the same rules with a different seed. Best seen with the gallery lights down.',
    historicalContext:
      'A demonstration work made for this project. It was written to be looked at in Night mode, where the surrounding room goes almost black.',
    curatorNote:
      'Interpretation: it was made for a lighting condition rather than a wall. Turn on Night at the Museum and it stops being a placeholder.',
    tags: ['digital', 'generative', 'demo', 'night'],
  }),
]

export const artworksById = Object.fromEntries(artworks.map((item) => [item.id, item]))

export function getArtwork(id) {
  return artworksById[id] ?? null
}

export function artworksByRoom(roomId) {
  return artworks.filter((item) => item.roomId === roomId)
}

export function artworksByArtist(artistId) {
  return artworks.filter((item) => item.artistId === artistId)
}

export function artworksByPeriod(periodId) {
  return artworks.filter((item) => item.period === periodId)
}

export const mediums = [...new Set(artworks.map((a) => a.medium))].sort()
export const regions = [...new Set(artworks.map((a) => a.region))].sort()
export const categories = [...new Set(artworks.map((a) => a.category))].sort()
export const yearBounds = {
  min: Math.min(...artworks.map((a) => a.year)),
  max: Math.max(...artworks.map((a) => a.year)),
}
