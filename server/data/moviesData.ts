export interface MovieData {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: { id: number; name: string }[];
  genre_ids: number[];
  runtime: number;
  maturity_rating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  trailer_key: string; // YouTube video ID
  tagline: string;
  director: string;
  cast: { id: number; name: string; character: string; profile_path: string | null }[];
  match_score?: number;
  is_trending?: boolean;
  is_top_10?: boolean;
  top_10_rank?: number;
}

export const GENRES_LIST = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

export const REAL_MOVIES: MovieData[] = [
  {
    id: 693134,
    title: 'Dune: Part Two',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    poster_path: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s52009.jpg',
    release_date: '2024-03-01',
    vote_average: 8.3,
    vote_count: 5200,
    popularity: 380.5,
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' }],
    genre_ids: [878, 12],
    runtime: 166,
    maturity_rating: 'PG-13',
    trailer_key: 'Way9Dexny3w',
    tagline: 'Long live the fighters.',
    director: 'Denis Villeneuve',
    cast: [
      { id: 1190668, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: 'https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg' },
      { id: 505710, name: 'Zendaya', character: 'Chani', profile_path: 'https://image.tmdb.org/t/p/w185/r3A7evO7aqKVUQ4neSNcmZ9YXvH.jpg' },
      { id: 932, name: 'Rebecca Ferguson', character: 'Lady Jessica', profile_path: 'https://image.tmdb.org/t/p/w185/lJloTOheuQSirSLXNA3JHsrMNfH.jpg' },
      { id: 1373737, name: 'Florence Pugh', character: 'Princess Irulan', profile_path: 'https://image.tmdb.org/t/p/w185/750rAYhmMOHzyL9594SC69879Jm.jpg' },
      { id: 1392137, name: 'Austin Butler', character: 'Feyd-Rautha Harkonnen', profile_path: 'https://image.tmdb.org/t/p/w185/2gT4WvXmN3fW26G8j307G31g9b8.jpg' }
    ],
    is_trending: true,
    is_top_10: true,
    top_10_rank: 1
  },
  {
    id: 157336,
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    poster_path: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/rAiYTsqJJR0KP8UN8vMzNzj948U.jpg',
    release_date: '2014-11-05',
    vote_average: 8.4,
    vote_count: 34500,
    popularity: 295.2,
    genres: [{ id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }, { id: 878, name: 'Sci-Fi' }],
    genre_ids: [12, 18, 878],
    runtime: 169,
    maturity_rating: 'PG-13',
    trailer_key: 'zSWdZVtXT7E',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    director: 'Christopher Nolan',
    cast: [
      { id: 10297, name: 'Matthew McConaughey', character: 'Joseph Cooper', profile_path: 'https://image.tmdb.org/t/p/w185/eDVLb5f0vXkF6N331i0qYtS1r0.jpg' },
      { id: 1813, name: 'Anne Hathaway', character: 'Dr. Amelia Brand', profile_path: 'https://image.tmdb.org/t/p/w185/tLel4FGQEZYwO3JCj1E68i46W5t.jpg' },
      { id: 83002, name: 'Jessica Chastain', character: 'Murphy Cooper (Adult)', profile_path: 'https://image.tmdb.org/t/p/w185/nkFr6n69WpX0qR8n1a877y0uF5k.jpg' },
      { id: 3895, name: 'Michael Caine', character: 'Professor Brand', profile_path: 'https://image.tmdb.org/t/p/w185/klNxOq3rN83Wl4k35s7S1bQ6m6f.jpg' }
    ],
    is_trending: true,
    is_top_10: true,
    top_10_rank: 2
  },
  {
    id: 27205,
    title: 'Inception',
    overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.',
    poster_path: 'https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    release_date: '2010-07-15',
    vote_average: 8.4,
    vote_count: 36000,
    popularity: 210.4,
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' }],
    genre_ids: [28, 878, 12],
    runtime: 148,
    maturity_rating: 'PG-13',
    trailer_key: 'YoHD9XEInc0',
    tagline: 'Your mind is the scene of the crime.',
    director: 'Christopher Nolan',
    cast: [
      { id: 6193, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profile_path: 'https://image.tmdb.org/t/p/w185/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' },
      { id: 24045, name: 'Joseph Gordon-Levitt', character: 'Arthur', profile_path: 'https://image.tmdb.org/t/p/w185/dhv9e8fD86L0Jv1W25B7s2S6W0M.jpg' },
      { id: 27578, name: 'Elliot Page', character: 'Ariadne', profile_path: 'https://image.tmdb.org/t/p/w185/2gT4WvXmN3fW26G8j307G31g9b8.jpg' },
      { id: 2524, name: 'Tom Hardy', character: 'Eames', profile_path: 'https://image.tmdb.org/t/p/w185/d81K0lhq1y59U43gYw3Xh68k47f.jpg' }
    ],
    is_trending: true,
    is_top_10: true,
    top_10_rank: 3
  },
  {
    id: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    overview: 'After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence. But when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders.',
    poster_path: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    release_date: '2023-05-31',
    vote_average: 8.4,
    vote_count: 6700,
    popularity: 240.8,
    genres: [{ id: 16, name: 'Animation' }, { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 878, name: 'Sci-Fi' }],
    genre_ids: [16, 28, 12, 878],
    runtime: 140,
    maturity_rating: 'PG',
    trailer_key: 'cqGjhVJWtEg',
    tagline: 'It\'s how you wear the mask that matters.',
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: [
      { id: 587506, name: 'Shameik Moore', character: 'Miles Morales (voice)', profile_path: 'https://image.tmdb.org/t/p/w185/yugvBffZgYf7Qz45C1uFv4o6mK9.jpg' },
      { id: 56734, name: 'Hailee Steinfeld', character: 'Gwen Stacy (voice)', profile_path: 'https://image.tmdb.org/t/p/w185/i4EmsH5H1Jg86W7o7M9P50z41uP.jpg' },
      { id: 1253360, name: 'Oscar Isaac', character: 'Miguel O\'Hara (voice)', profile_path: 'https://image.tmdb.org/t/p/w185/dW5nxqh9Y9xiMPjj771T747m0eD.jpg' }
    ],
    is_trending: true,
    is_top_10: true,
    top_10_rank: 4
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II, exploring the profound moral dilemmas and political fallout that reshaped humanity forever.',
    poster_path: 'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/rM5Y09G9h9qN955z70OqW56Q6t3.jpg',
    release_date: '2023-07-19',
    vote_average: 8.1,
    vote_count: 9200,
    popularity: 230.1,
    genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'History' }],
    genre_ids: [18, 36],
    runtime: 180,
    maturity_rating: 'R',
    trailer_key: 'uYPbbksJxIg',
    tagline: 'The world forever changes.',
    director: 'Christopher Nolan',
    cast: [
      { id: 2037, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profile_path: 'https://image.tmdb.org/t/p/w185/360R4c7a6e12eR8ZkM8f72.jpg' },
      { id: 5081, name: 'Emily Blunt', character: 'Katherine Oppenheimer', profile_path: 'https://image.tmdb.org/t/p/w185/9hGZf72o81eP7o3p8h98.jpg' },
      { id: 1892, name: 'Matt Damon', character: 'Leslie Groves', profile_path: 'https://image.tmdb.org/t/p/w185/elSlNg0WqjK3P5e8Zqg7f2.jpg' },
      { id: 3223, name: 'Robert Downey Jr.', character: 'Lewis Strauss', profile_path: 'https://image.tmdb.org/t/p/w185/1YjdSym1j57f2.jpg' }
    ],
    is_trending: true,
    is_top_10: true,
    top_10_rank: 5
  },
  {
    id: 155,
    title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime. With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
    poster_path: 'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    release_date: '2008-07-16',
    vote_average: 8.5,
    vote_count: 32400,
    popularity: 198.6,
    genres: [{ id: 18, name: 'Drama' }, { id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 53, name: 'Thriller' }],
    genre_ids: [18, 28, 80, 53],
    runtime: 152,
    maturity_rating: 'PG-13',
    trailer_key: 'EXeTwQWrcwY',
    tagline: 'Welcome to a world without rules.',
    director: 'Christopher Nolan',
    cast: [
      { id: 3894, name: 'Christian Bale', character: 'Bruce Wayne / Batman', profile_path: 'https://image.tmdb.org/t/p/w185/b7fTC9WFZ6Z2o77Z5xZ.jpg' },
      { id: 1810, name: 'Heath Ledger', character: 'Joker', profile_path: 'https://image.tmdb.org/t/p/w185/543o1o2b3m7y0i9o8.jpg' },
      { id: 3895, name: 'Michael Caine', character: 'Alfred Pennyworth', profile_path: 'https://image.tmdb.org/t/p/w185/klNxOq3rN83Wl4k35s7S1bQ6m6f.jpg' },
      { id: 64, name: 'Gary Oldman', character: 'James Gordon', profile_path: 'https://image.tmdb.org/t/p/w185/2v9FsB9OqVv9100.jpg' }
    ],
    is_trending: true,
    is_top_10: true,
    top_10_rank: 6
  },
  {
    id: 335984,
    title: 'Blade Runner 2049',
    overview: 'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what\'s left of society into chaos. K\'s discovery leads him on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for 30 years.',
    poster_path: 'https://image.tmdb.org/t/p/w780/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/ilRyazdMJwN95exOP9v0YgD05nN.jpg',
    release_date: '2017-10-04',
    vote_average: 8.0,
    vote_count: 13500,
    popularity: 180.2,
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 18, name: 'Drama' }, { id: 9648, name: 'Mystery' }],
    genre_ids: [878, 18, 9648],
    runtime: 164,
    maturity_rating: 'R',
    trailer_key: 'gCcx85zbxz4',
    tagline: 'There\'s still a page left.',
    director: 'Denis Villeneuve',
    cast: [
      { id: 30614, name: 'Ryan Gosling', character: 'Officer K', profile_path: 'https://image.tmdb.org/t/p/w185/lyUyARFG7g59qU6x17g79i.jpg' },
      { id: 3, name: 'Harrison Ford', character: 'Rick Deckard', profile_path: 'https://image.tmdb.org/t/p/w185/5B8y68593Xj7819h5G.jpg' },
      { id: 224513, name: 'Ana de Armas', character: 'Joi', profile_path: 'https://image.tmdb.org/t/p/w185/3vxvsmYykFaBKnUIROWBY84.jpg' },
      { id: 543505, name: 'Sylvia Hoeks', character: 'Luv', profile_path: 'https://image.tmdb.org/t/p/w185/543o1o2b3m7y0i9o8.jpg' }
    ],
    is_trending: true,
    is_top_10: true,
    top_10_rank: 7
  },
  {
    id: 76600,
    title: 'Avatar: The Way of Water',
    overview: 'Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.',
    poster_path: 'https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
    release_date: '2022-12-14',
    vote_average: 7.7,
    vote_count: 11400,
    popularity: 205.3,
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' }, { id: 28, name: 'Action' }],
    genre_ids: [878, 12, 28],
    runtime: 192,
    maturity_rating: 'PG-13',
    trailer_key: 'd9MyW72ELq0',
    tagline: 'Return to Pandora.',
    director: 'James Cameron',
    cast: [
      { id: 65731, name: 'Sam Worthington', character: 'Jake Sully', profile_path: 'https://image.tmdb.org/t/p/w185/vM9jK65l389v4uY.jpg' },
      { id: 8691, name: 'Zoe Saldana', character: 'Neytiri', profile_path: 'https://image.tmdb.org/t/p/w185/vQBwms5Bg59.jpg' },
      { id: 10205, name: 'Sigourney Weaver', character: 'Kiri', profile_path: 'https://image.tmdb.org/t/p/w185/bcWw1w2q19.jpg' }
    ],
    is_trending: true,
    is_top_10: true,
    top_10_rank: 8
  },
  {
    id: 550,
    title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
    poster_path: 'https://image.tmdb.org/t/p/w780/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    release_date: '1999-10-15',
    vote_average: 8.4,
    vote_count: 28800,
    popularity: 135.4,
    genres: [{ id: 18, name: 'Drama' }],
    genre_ids: [18],
    runtime: 139,
    maturity_rating: 'R',
    trailer_key: 'qtRKdV9eiZs',
    tagline: 'Mischief. Mayhem. Soap.',
    director: 'David Fincher',
    cast: [
      { id: 819, name: 'Edward Norton', character: 'The Narrator', profile_path: 'https://image.tmdb.org/t/p/w185/87e1u0o89.jpg' },
      { id: 287, name: 'Brad Pitt', character: 'Tyler Durden', profile_path: 'https://image.tmdb.org/t/p/w185/cckcYc2v0v.jpg' },
      { id: 1283, name: 'Helena Bonham Carter', character: 'Marla Singer', profile_path: 'https://image.tmdb.org/t/p/w185/543o1o2b.jpg' }
    ],
    is_trending: false,
    is_top_10: true,
    top_10_rank: 9
  },
  {
    id: 603,
    title: 'The Matrix',
    overview: 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
    poster_path: 'https://image.tmdb.org/t/p/w780/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/7u3fh0eglhjY2r3w8pdohv14w7v.jpg',
    release_date: '1999-03-30',
    vote_average: 8.2,
    vote_count: 25400,
    popularity: 150.8,
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }],
    genre_ids: [28, 878],
    runtime: 136,
    maturity_rating: 'R',
    trailer_key: 'vKQi3bBA1y8',
    tagline: 'Welcome to the Real World.',
    director: 'Lana Wachowski, Lilly Wachowski',
    cast: [
      { id: 6384, name: 'Keanu Reeves', character: 'Thomas A. Anderson / Neo', profile_path: 'https://image.tmdb.org/t/p/w185/4D0PpW6vQ.jpg' },
      { id: 2975, name: 'Laurence Fishburne', character: 'Morpheus', profile_path: 'https://image.tmdb.org/t/p/w185/8MGZ24.jpg' },
      { id: 530, name: 'Carrie-Anne Moss', character: 'Trinity', profile_path: 'https://image.tmdb.org/t/p/w185/87e1u0.jpg' }
    ],
    is_trending: true,
    is_top_10: true,
    top_10_rank: 10
  },
  {
    id: 299536,
    title: 'Avengers: Infinity War',
    overview: 'As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos. A despot of intergalactic infamy, his goal is to collect all six Infinity Stones.',
    poster_path: 'https://image.tmdb.org/t/p/w780/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg',
    release_date: '2018-04-25',
    vote_average: 8.3,
    vote_count: 29000,
    popularity: 215.7,
    genres: [{ id: 12, name: 'Adventure' }, { id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }],
    genre_ids: [12, 28, 878],
    runtime: 149,
    maturity_rating: 'PG-13',
    trailer_key: '6ZfuNTqbHE8',
    tagline: 'An entire universe. Once and for all.',
    director: 'Anthony Russo, Joe Russo',
    cast: [
      { id: 3223, name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man', profile_path: 'https://image.tmdb.org/t/p/w185/1YjdSym1j57f2.jpg' },
      { id: 16828, name: 'Chris Evans', character: 'Steve Rogers / Captain America', profile_path: 'https://image.tmdb.org/t/p/w185/3bOGNsH2guof.jpg' },
      { id: 74568, name: 'Chris Hemsworth', character: 'Thor', profile_path: 'https://image.tmdb.org/t/p/w185/jpurJ9j.jpg' }
    ]
  },
  {
    id: 496243,
    title: 'Parasite',
    overview: 'All unemployed, Ki-taek\'s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    poster_path: 'https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg',
    release_date: '2019-05-30',
    vote_average: 8.5,
    vote_count: 17800,
    popularity: 122.9,
    genres: [{ id: 35, name: 'Comedy' }, { id: 53, name: 'Thriller' }, { id: 18, name: 'Drama' }],
    genre_ids: [35, 53, 18],
    runtime: 133,
    maturity_rating: 'R',
    trailer_key: '5xH0hhMBqYg',
    tagline: 'Act like you own the place.',
    director: 'Bong Joon-ho',
    cast: [
      { id: 20738, name: 'Song Kang-ho', character: 'Kim Ki-taek', profile_path: 'https://image.tmdb.org/t/p/w185/tN3a9j30.jpg' },
      { id: 1021485, name: 'Lee Sun-kyun', character: 'Park Dong-ik', profile_path: 'https://image.tmdb.org/t/p/w185/m1A81p6.jpg' },
      { id: 1116670, name: 'Cho Yeo-jeong', character: 'Park Yeon-kyo', profile_path: 'https://image.tmdb.org/t/p/w185/n5q5q6.jpg' }
    ]
  },
  {
    id: 129,
    title: 'Spirited Away',
    overview: 'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.',
    poster_path: 'https://image.tmdb.org/t/p/w780/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/mSDsSDwaP3E7dEfUPWy4J0djt4O.jpg',
    release_date: '2001-07-20',
    vote_average: 8.5,
    vote_count: 16100,
    popularity: 112.5,
    genres: [{ id: 16, name: 'Animation' }, { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' }],
    genre_ids: [16, 10751, 14],
    runtime: 125,
    maturity_rating: 'PG',
    trailer_key: 'ByXuk9QqQkk',
    tagline: 'Tunnel to another world.',
    director: 'Hayao Miyazaki',
    cast: [
      { id: 19588, name: 'Rumi Hiiragi', character: 'Chihiro Ogino (voice)', profile_path: 'https://image.tmdb.org/t/p/w185/z3M9k.jpg' },
      { id: 19589, name: 'Miyu Irino', character: 'Haku (voice)', profile_path: 'https://image.tmdb.org/t/p/w185/k1u7P.jpg' }
    ]
  },
  {
    id: 680,
    title: 'Pulp Fiction',
    overview: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.',
    poster_path: 'https://image.tmdb.org/t/p/w780/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    release_date: '1994-09-10',
    vote_average: 8.5,
    vote_count: 27300,
    popularity: 142.3,
    genres: [{ id: 53, name: 'Thriller' }, { id: 80, name: 'Crime' }],
    genre_ids: [53, 80],
    runtime: 154,
    maturity_rating: 'R',
    trailer_key: 's7EdQ4FqbhY',
    tagline: 'Just because you are a character doesn\'t mean that you have character.',
    director: 'Quentin Tarantino',
    cast: [
      { id: 8891, name: 'John Travolta', character: 'Vincent Vega', profile_path: 'https://image.tmdb.org/t/p/w185/7h2Vq.jpg' },
      { id: 2231, name: 'Samuel L. Jackson', character: 'Jules Winnfield', profile_path: 'https://image.tmdb.org/t/p/w185/mXN47.jpg' },
      { id: 139, name: 'Uma Thurman', character: 'Mia Wallace', profile_path: 'https://image.tmdb.org/t/p/w185/76N2.jpg' }
    ]
  },
  {
    id: 475557,
    title: 'Joker',
    overview: 'During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.',
    poster_path: 'https://image.tmdb.org/t/p/w780/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
    release_date: '2019-10-02',
    vote_average: 8.1,
    vote_count: 24700,
    popularity: 130.5,
    genres: [{ id: 80, name: 'Crime' }, { id: 53, name: 'Thriller' }, { id: 18, name: 'Drama' }],
    genre_ids: [80, 53, 18],
    runtime: 122,
    maturity_rating: 'R',
    trailer_key: 'zAGVQLHvwOY',
    tagline: 'Put on a happy face.',
    director: 'Todd Phillips',
    cast: [
      { id: 73421, name: 'Joaquin Phoenix', character: 'Arthur Fleck / Joker', profile_path: 'https://image.tmdb.org/t/p/w185/nELj9.jpg' },
      { id: 380, name: 'Robert De Niro', character: 'Murray Franklin', profile_path: 'https://image.tmdb.org/t/p/w185/cTXUo.jpg' },
      { id: 1545693, name: 'Zazie Beetz', character: 'Sophie Dumond', profile_path: 'https://image.tmdb.org/t/p/w185/7U7Ym.jpg' }
    ]
  },
  {
    id: 278,
    title: 'The Shawshank Redemption',
    overview: 'Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unflagging sense of hope.',
    poster_path: 'https://image.tmdb.org/t/p/w780/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    release_date: '1994-09-23',
    vote_average: 8.7,
    vote_count: 26800,
    popularity: 165.2,
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    genre_ids: [18, 80],
    runtime: 142,
    maturity_rating: 'R',
    trailer_key: 'PLl99DlL6b4',
    tagline: 'Fear can hold you prisoner. Hope can set you free.',
    director: 'Frank Darabont',
    cast: [
      { id: 504, name: 'Tim Robbins', character: 'Andy Dufresne', profile_path: 'https://image.tmdb.org/t/p/w185/A8e4b78.jpg' },
      { id: 192, name: 'Morgan Freeman', character: 'Ellis Boyd "Red" Redding', profile_path: 'https://image.tmdb.org/t/p/w185/oGJQBg.jpg' }
    ]
  },
  {
    id: 11,
    title: 'Star Wars: A New Hope',
    overview: 'Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.',
    poster_path: 'https://image.tmdb.org/t/p/w780/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/zqkmTXzjkAgMfRTHLpcC26KclpW.jpg',
    release_date: '1977-05-25',
    vote_average: 8.2,
    vote_count: 19800,
    popularity: 110.4,
    genres: [{ id: 12, name: 'Adventure' }, { id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }],
    genre_ids: [12, 28, 878],
    runtime: 121,
    maturity_rating: 'PG',
    trailer_key: 'vZ734NWnAHA',
    tagline: 'A long time ago in a galaxy far, far away...',
    director: 'George Lucas',
    cast: [
      { id: 2, name: 'Mark Hamill', character: 'Luke Skywalker', profile_path: 'https://image.tmdb.org/t/p/w185/9W1jU.jpg' },
      { id: 3, name: 'Harrison Ford', character: 'Han Solo', profile_path: 'https://image.tmdb.org/t/p/w185/5B8y.jpg' },
      { id: 4, name: 'Carrie Fisher', character: 'Princess Leia Organa', profile_path: 'https://image.tmdb.org/t/p/w185/z3M9k.jpg' }
    ]
  },
  {
    id: 238,
    title: 'The Godfather',
    overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps up to take care of the would-be killers, launching a campaign of bloody revenge.',
    poster_path: 'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    release_date: '1972-03-14',
    vote_average: 8.7,
    vote_count: 19800,
    popularity: 170.0,
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    genre_ids: [18, 80],
    runtime: 175,
    maturity_rating: 'R',
    trailer_key: 'UaVTIH8mujA',
    tagline: 'An offer you can\'t refuse.',
    director: 'Francis Ford Coppola',
    cast: [
      { id: 3084, name: 'Marlon Brando', character: 'Don Vito Corleone', profile_path: 'https://image.tmdb.org/t/p/w185/fuTE9a0c.jpg' },
      { id: 1158, name: 'Al Pacino', character: 'Michael Corleone', profile_path: 'https://image.tmdb.org/t/p/w185/2Jw9P.jpg' },
      { id: 3085, name: 'James Caan', character: 'Sonny Corleone', profile_path: 'https://image.tmdb.org/t/p/w185/1e9U.jpg' }
    ]
  },
  {
    id: 508947,
    title: 'Turning Red',
    overview: 'Thirteen-year-old Mei is experiencing the awkwardness of being a teenager with a twist – when she gets too excited, she transforms into a giant red panda.',
    poster_path: 'https://image.tmdb.org/t/p/w780/qsdjk9oAKSQMWs0Vt5Pyfh6O4GZ.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/fOy2JurzKANt6Bz7xFuXN2Oz7Yv.jpg',
    release_date: '2022-03-10',
    vote_average: 7.4,
    vote_count: 5100,
    popularity: 92.4,
    genres: [{ id: 16, name: 'Animation' }, { id: 10751, name: 'Family' }, { id: 35, name: 'Comedy' }, { id: 14, name: 'Fantasy' }],
    genre_ids: [16, 10751, 35, 14],
    runtime: 100,
    maturity_rating: 'PG',
    trailer_key: 'XdKzUbAiswE',
    tagline: 'Growing up is a beast.',
    director: 'Domee Shi',
    cast: [
      { id: 2435422, name: 'Rosalie Chiang', character: 'Meilin Lee (voice)', profile_path: 'https://image.tmdb.org/t/p/w185/p8.jpg' },
      { id: 16255, name: 'Sandra Oh', character: 'Ming Lee (voice)', profile_path: 'https://image.tmdb.org/t/p/w185/7h.jpg' }
    ]
  },
  {
    id: 671,
    title: 'Harry Potter and the Philosopher\'s Stone',
    overview: 'Harry Potter has lived under the stairs at his aunt and uncle\'s house his whole life. But on his 11th birthday, he learns he\'s a powerful wizard with a place waiting for him at Hogwarts School of Witchcraft and Wizardry.',
    poster_path: 'https://image.tmdb.org/t/p/w780/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/hziiv146OpD2qvrwv0JedIM98O.jpg',
    release_date: '2001-11-16',
    vote_average: 7.9,
    vote_count: 26000,
    popularity: 145.2,
    genres: [{ id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }],
    genre_ids: [12, 14],
    runtime: 152,
    maturity_rating: 'PG',
    trailer_key: 'VyHV0BRZxiQ',
    tagline: 'Let the magic begin.',
    director: 'Chris Columbus',
    cast: [
      { id: 10980, name: 'Daniel Radcliffe', character: 'Harry Potter', profile_path: 'https://image.tmdb.org/t/p/w185/eP4d.jpg' },
      { id: 10989, name: 'Rupert Grint', character: 'Ron Weasley', profile_path: 'https://image.tmdb.org/t/p/w185/7V8.jpg' },
      { id: 10990, name: 'Emma Watson', character: 'Hermione Granger', profile_path: 'https://image.tmdb.org/t/p/w185/tH8.jpg' }
    ]
  },
  {
    id: 19995,
    title: 'Avatar',
    overview: 'In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.',
    poster_path: 'https://image.tmdb.org/t/p/w780/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/vL5LR6WdxWPquCcxQegcuvHNCRa.jpg',
    release_date: '2009-12-15',
    vote_average: 7.6,
    vote_count: 31000,
    popularity: 185.0,
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }, { id: 878, name: 'Sci-Fi' }],
    genre_ids: [28, 12, 14, 878],
    runtime: 162,
    maturity_rating: 'PG-13',
    trailer_key: '5PSNL1qE6VY',
    tagline: 'Enter the world.',
    director: 'James Cameron',
    cast: [
      { id: 65731, name: 'Sam Worthington', character: 'Jake Sully', profile_path: 'https://image.tmdb.org/t/p/w185/vM9j.jpg' },
      { id: 8691, name: 'Zoe Saldana', character: 'Neytiri', profile_path: 'https://image.tmdb.org/t/p/w185/vQB.jpg' }
    ]
  },
  {
    id: 372058,
    title: 'Your Name.',
    overview: 'High schoolers Mitsuha and Taki are complete strangers living separate lives in rural Japan and Tokyo. But suddenly, they start switching bodies when they fall asleep.',
    poster_path: 'https://image.tmdb.org/t/p/w780/q719jXXEzOoYaps6qFsC8llRaQ.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/dIWwZW7dJJ1qC6CwhPaW7BmvrR9.jpg',
    release_date: '2016-08-26',
    vote_average: 8.5,
    vote_count: 11000,
    popularity: 105.0,
    genres: [{ id: 16, name: 'Animation' }, { id: 10749, name: 'Romance' }, { id: 18, name: 'Drama' }],
    genre_ids: [16, 10749, 18],
    runtime: 106,
    maturity_rating: 'PG',
    trailer_key: 'xU47nhruN-Q',
    tagline: 'Treasure the experience. Dreams fade away after you wake up.',
    director: 'Makoto Shinkai',
    cast: [
      { id: 1530034, name: 'Ryunosuke Kamiki', character: 'Taki Tachibana (voice)', profile_path: 'https://image.tmdb.org/t/p/w185/9u.jpg' },
      { id: 1675200, name: 'Mone Kamishiraishi', character: 'Mitsuha Miyamizu (voice)', profile_path: 'https://image.tmdb.org/t/p/w185/1k.jpg' }
    ]
  },
  {
    id: 120,
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    overview: 'Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home behind in order to begin an epic quest to the fires of Mount Doom to destroy it before the Dark Lord Sauron can reclaim it.',
    poster_path: 'https://image.tmdb.org/t/p/w780/6oom5QYQ2yQTMJIbnvbkBL9cDK6.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/568iC8m0c7q3d96gZ7m9qf5.jpg',
    release_date: '2001-12-18',
    vote_average: 8.4,
    vote_count: 24500,
    popularity: 160.0,
    genres: [{ id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }, { id: 28, name: 'Action' }],
    genre_ids: [12, 14, 28],
    runtime: 178,
    maturity_rating: 'PG-13',
    trailer_key: 'V75dMMW8V98',
    tagline: 'One ring to rule them all.',
    director: 'Peter Jackson',
    cast: [
      { id: 109, name: 'Elijah Wood', character: 'Frodo Baggins', profile_path: 'https://image.tmdb.org/t/p/w185/f8y.jpg' },
      { id: 1327, name: 'Ian McKellen', character: 'Gandalf', profile_path: 'https://image.tmdb.org/t/p/w185/87e.jpg' }
    ]
  },
  {
    id: 438631,
    title: 'Dune',
    overview: 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.',
    poster_path: 'https://image.tmdb.org/t/p/w780/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg',
    release_date: '2021-09-15',
    vote_average: 7.8,
    vote_count: 11000,
    popularity: 190.0,
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' }],
    genre_ids: [878, 12],
    runtime: 155,
    maturity_rating: 'PG-13',
    trailer_key: 'n9xhJrPXop4',
    tagline: 'Beyond fear, destiny awaits.',
    director: 'Denis Villeneuve',
    cast: [
      { id: 1190668, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: 'https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg' },
      { id: 932, name: 'Rebecca Ferguson', character: 'Lady Jessica', profile_path: 'https://image.tmdb.org/t/p/w185/lJloTOheuQSirSLXNA3JHsrMNfH.jpg' }
    ]
  }
];
