import pool from "../config/db.js";
const products = [
  {
    name: "Tomford ombre leather",
    category: "Designer",
    weather: "Winter",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 399 },
      { size_ml: 5, price: 749 },
      { size_ml: 10, price: 1399 }
    ]
  },

  {
    name: "Tomford ombre leather parfum",
    category: "Designer",
    weather: "Winter",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 499 },
      { size_ml: 5, price: 849 },
      { size_ml: 10, price: 1499 }
    ]
  },

  {
    name: "Tomford ebume fume",
    category: "Designer",
    weather: "Winter",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 499 },
      { size_ml: 5, price: 849 },
      { size_ml: 10, price: 1499 }
    ]
  },

  {
    name: "Tom ford tuscan leather",
    category: "Designer",
    weather: "Winter",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 499 },
      { size_ml: 5, price: 849 },
      { size_ml: 10, price: 1499 }
    ]
  },

  {
    name: "Tomford white suede",
    category: "Designer",
    weather: "Summer",
    type: "EDP",
    gender: "W",
    variants: [
      { size_ml: 2, price: 499 },
      { size_ml: 5, price: 849 },
      { size_ml: 10, price: 1499 }
    ]
  },

  {
    name: "Tomford Grey Vetiver",
    category: null,
    weather: null,
    type: null,
    gender: null,
    variants: []
  },

  {
    name: "Creed aventus",
    category: "Niche",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 749 },
      { size_ml: 5, price: 1499 },
      { size_ml: 10, price: 2849 }
    ]
  },

  {
    name: "Creed aventus absolu",
    category: "Niche",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 849 },
      { size_ml: 5, price: 1549 },
      { size_ml: 10, price: 2999 }
    ]
  },

  {
    name: "Creed Irish",
    category: "Niche",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 649 },
      { size_ml: 5, price: 1349 },
      { size_ml: 10, price: 2499 }
    ]
  },

  {
    name: "Creed mountain silver",
    category: "Niche",
    weather: "Summer/winter",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 649 },
      { size_ml: 5, price: 1349 },
      { size_ml: 10, price: 2499 }
    ]
  },

    {
    name: "Creed orijinal vetivar",
    category: "Niche",
    weather: "Summer",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 649 },
      { size_ml: 5, price: 1349 },
      { size_ml: 10, price: 2499 }
    ]
  },

  {
    name: "Azzaro most wanted Parfum",
    category: "Designer",
    weather: "Winter",
    type: "PARFUM",
    gender: "M",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 499 },
      { size_ml: 10, price: 899 }
    ]
  },

  {
    name: "Azzaro most wanted Intense",
    category: "Designer",
    weather: "Winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 499 },
      { size_ml: 10, price: 899 }
    ]
  },

  {
    name: "Azzaro most wanted night",
    category: "Designer",
    weather: "Winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 499 },
      { size_ml: 10, price: 899 }
    ]
  },

  {
    name: "Valentino born in roma green stravaganza",
    category: "Designer",
    weather: "Summer",
    type: "EDT",
    gender: "M",
    variants: [
      { size_ml: 2, price: 299 },
      { size_ml: 5, price: 499 },
      { size_ml: 10, price: 899 }
    ]
  },

  {
    name: "Valentino men Uomo",
    category: "Designer",
    weather: "summeer/winter",
    type: "EDT",
    gender: "M",
    variants: [
      { size_ml: 2, price: 299 },
      { size_ml: 5, price: 499 },
      { size_ml: 10, price: 899 }
    ]
  },

  {
    name: "Valentino coral",
    category: "Designer",
    weather: "Winter",
    type: "EDT",
    gender: "M",
    variants: [
      { size_ml: 2, price: 299 },
      { size_ml: 5, price: 499 },
      { size_ml: 10, price: 899 }
    ]
  },

  {
    name: "Valentino men born in roma",
    category: "Designer",
    weather: "Winter",
    type: "EDT",
    gender: "M",
    variants: [
      { size_ml: 2, price: 299 },
      { size_ml: 5, price: 499 },
      { size_ml: 10, price: 899 }
    ]
  },

  {
    name: "Baccarat rouge 540",
    category: "Niche",
    weather: "Winter",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 899 },
      { size_ml: 5, price: 1999 },
      { size_ml: 10, price: 3499 }
    ]
  },

  {
    name: "YSL L Homme",
    category: "Designer",
    weather: "Winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 299 },
      { size_ml: 5, price: 499 },
      { size_ml: 10, price: 899 }
    ]
  },

    {
    name: "YSL L Homme Le Parfum",
    category: "Designer",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 299 },
      { size_ml: 5, price: 499 },
      { size_ml: 10, price: 899 }
    ]
  },

  {
    name: "YSL Homme cologne blue",
    category: "Designer",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 299 },
      { size_ml: 5, price: 499 },
      { size_ml: 10, price: 899 }
    ]
  },

  {
    name: "YSL Y",
    category: "Designer",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 699 }
    ]
  },

  {
    name: "YSL myself L'abslou parfum",
    category: "Designer",
    weather: "Summer",
    type: "PARFUM",
    gender: "M",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 699 }
    ]
  },

  {
    name: "Versace eros",
    category: "Designer",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 699 }
    ]
  },

  {
    name: "versace flame",
    category: "Designer",
    weather: "Summer/winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 699 }
    ]
  },

  {
    name: "Versace pour homme",
    category: "Designer",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 249 },
      { size_ml: 10, price: 399 }
    ]
  },

  {
    name: "Kilian blue moon",
    category: "Niche",
    weather: "Summer",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 599 },
      { size_ml: 5, price: 999 },
      { size_ml: 10, price: 1649 }
    ]
  },

  {
    name: "Kilian angle share",
    category: "Niche",
    weather: "Winter",
    type: "EDP",
    gender: "M/W",
    variants: []
  },

  {
    name: "kilian roses on ice",
    category: "Niche",
    weather: "Summer",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 599 },
      { size_ml: 5, price: 999 },
      { size_ml: 10, price: 1649 }
    ]
  },

    {
    name: "Gentlemen givenchy boise",
    category: "Designer",
    weather: "Winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 299 },
      { size_ml: 5, price: 499 },
      { size_ml: 10, price: 899 }
    ]
  },

  {
    name: "Gentlemen givenchy paris",
    category: "Designer",
    weather: "Winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 299 },
      { size_ml: 5, price: 499 },
      { size_ml: 10, price: 899 }
    ]
  },

  {
    name: "1 Million",
    category: "Designer",
    weather: "Winter",
    type: "EDT",
    gender: "M",
    variants: [
      { size_ml: 2, price: 179 },
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 699 }
    ]
  },

  {
    name: "Christian Dior oud isphan",
    category: "Niche",
    weather: "Winter",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 449 },
      { size_ml: 5, price: 999 },
      { size_ml: 10, price: 1649 }
    ]
  },

  {
    name: "Christian Dior Gris dior",
    category: "Niche",
    weather: "Winter/Summer",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 449 },
      { size_ml: 5, price: 999 },
      { size_ml: 10, price: 1649 }
    ]
  },

  {
    name: "Dior sauvage Parfum",
    category: "Designer",
    weather: "Winter/summer",
    type: "PARFUM",
    gender: "M",
    variants: [
      { size_ml: 2, price: 299 },
      { size_ml: 5, price: 499 },
      { size_ml: 10, price: 849 }
    ]
  },

  {
    name: "Dior homme intense parfum",
    category: "Designer",
    weather: "Winter",
    type: "PARFUM",
    gender: "M",
    variants: [
      { size_ml: 2, price: 349 },
      { size_ml: 5, price: 749 },
      { size_ml: 10, price: 1299 }
    ]
  },

  {
    name: "Dior sauvage elixer",
    category: "Designer",
    weather: "Winter/summer",
    type: "ELIXER",
    gender: "M",
    variants: [
      { size_ml: 2, price: 449 },
      { size_ml: 5, price: 999 },
      { size_ml: 10, price: 1649 }
    ]
  },

  {
    name: "Xerjoff Accento",
    category: "Niche",
    weather: "Summer",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 399 },
      { size_ml: 5, price: 749 },
      { size_ml: 10, price: 1399 }
    ]
  },

  {
    name: "Xerjoff Naxos",
    category: "Niche",
    weather: "Summer",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 449 },
      { size_ml: 5, price: 799 },
      { size_ml: 10, price: 1449 }
    ]
  },

    {
    name: "Xerjoff Erba Pura",
    category: "Niche",
    weather: "Summer",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 399 },
      { size_ml: 5, price: 749 },
      { size_ml: 10, price: 1399 }
    ]
  },

  {
    name: "Spicebomb viktor rolf",
    category: "Designer",
    weather: "Winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 449 },
      { size_ml: 10, price: 749 }
    ]
  },

  {
    name: "Invictus victory exterme",
    category: "Designer",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 299 },
      { size_ml: 10, price: 499 }
    ]
  },

  {
    name: "Invictus legend",
    category: "Designer",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 349 },
      { size_ml: 10, price: 599 }
    ]
  },

  {
    name: "Roberto canvalli splendid vanilla",
    category: "Designer",
    weather: "Winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 449 },
      { size_ml: 5, price: 999 },
      { size_ml: 10, price: 1649 }
    ]
  },

  {
    name: "Marly layton",
    category: "Niche",
    weather: "Winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 379 },
      { size_ml: 5, price: 749 },
      { size_ml: 10, price: 1499 }
    ]
  },

  {
    name: "Marly castley",
    category: "Niche",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 379 },
      { size_ml: 5, price: 749 },
      { size_ml: 10, price: 1499 }
    ]
  },

  {
    name: "Mont blac explorar",
    category: "Designer",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 699 }
    ]
  },

  {
    name: "Blue de chanel edp",
    category: "Designer",
    weather: "Winter/Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 299 },
      { size_ml: 5, price: 649 },
      { size_ml: 10, price: 1199 }
    ]
  },

  {
    name: "Oud Stallion",
    category: "Niche",
    weather: "Winter",
    type: "Extrait de parfum",
    gender: "M",
    variants: [
      { size_ml: 2, price: 599 },
      { size_ml: 5, price: 1799 },
      { size_ml: 10, price: 2999 }
    ]
  },
    {
    name: "ROJA Harrods",
    category: "Niche",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 2, price: 1199 },
      { size_ml: 5, price: 2499 },
      { size_ml: 10, price: 3999 }
    ]
  },

  {
    name: "Armani code",
    category: "Designer",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 599 },
      { size_ml: 10, price: 846 }
    ]
  },

  {
    name: "Bentley intense",
    category: "Designer",
    weather: "Winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 299 },
      { size_ml: 10, price: 499 }
    ]
  },

  {
    name: "Maison Margiela REPLICA By the fire place",
    category: "NICHE",
    weather: "Winter",
    type: "EDT",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 479 },
      { size_ml: 10, price: 799 }
    ]
  },

  {
    name: "Maison Margiela REPLICA Lazy sunday morning",
    category: "NICHE",
    weather: "Summer",
    type: "EDT",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 479 },
      { size_ml: 10, price: 799 }
    ]
  },

  {
    name: "Maison Margiela REPLICA JazzClub",
    category: "NICHE",
    weather: "Winter",
    type: "EDT",
    gender: "M",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 479 },
      { size_ml: 10, price: 799 }
    ]
  },

  {
    name: "Maison Margiela REPLICA WHEN THE RAIN STOP",
    category: "NICHE",
    weather: "Summer",
    type: "EDT",
    gender: "W",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 479 },
      { size_ml: 10, price: 799 }
    ]
  },

  {
    name: "Maison Margiela REPLICA BEACH WALK",
    category: "NICHE",
    weather: "Summer",
    type: "EDT",
    gender: "W",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 479 },
      { size_ml: 10, price: 799 }
    ]
  },

  {
    name: "Maison Margiela REPLICA DANCING ON THE MOON",
    category: "NICHE",
    weather: "Summer",
    type: "EDT",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 479 },
      { size_ml: 10, price: 799 }
    ]
  },

  {
    name: "Maison Margiela REPLICA SAILING DAY",
    category: "NICHE",
    weather: "Summer",
    type: "EDT",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 479 },
      { size_ml: 10, price: 799 }
    ]
  },

  {
    name: "Maison Margiela REPLICA Flower Market",
    category: "NICHE",
    weather: "Summer",
    type: "EDT",
    gender: "M/W",
    variants: [
      { size_ml: 2, price: 249 },
      { size_ml: 5, price: 479 },
      { size_ml: 10, price: 799 }
    ]
  },

    {
    name: "French avenue Baie EDP",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "W",
    variants: [
      { size_ml: 5, price: 269 },
      { size_ml: 10, price: 459 },
      { size_ml: 20, price: 849 },
      { size_ml: 50, price: 1799 }
    ]
  },

  {
    name: "french vulcan feu",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M/W",
    full_bottle_price: 3899,
    variants: [
      { size_ml: 5, price: 269 },
      { size_ml: 10, price: 459 },
      { size_ml: 20, price: 849 },
      { size_ml: 50, price: 1799 }
    ]
  },

  {
    name: "french vulcan sable brown",
    category: "Middle eastern",
    weather: "Winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 269 },
      { size_ml: 10, price: 459 },
      { size_ml: 20, price: 849 },
      { size_ml: 50, price: 1799 }
    ]
  },

  {
    name: "turathi electric",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 239 },
      { size_ml: 10, price: 429 },
      { size_ml: 20, price: 649 },
      { size_ml: 50, price: 1199 }
    ]
  },

  {
    name: "Turathi blue",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    full_bottle_price: 3500,
    variants: [
      { size_ml: 5, price: 249 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 699 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "Armaf Club de nuit intense",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDT",
    gender: "M",
    full_bottle_price: 4000,
    variants: [
      { size_ml: 5, price: 279 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 799 },
      { size_ml: 50, price: 1649 }
    ]
  },

  {
    name: "Armaf omb d'or",
    category: "Middle eastern",
    weather: "Winter",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 279 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 799 },
      { size_ml: 50, price: 1649 }
    ]
  },

  {
    name: "Afnan supermacy not only intense",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    full_bottle_price: 5000,
    variants: [
      { size_ml: 5, price: 260 },
      { size_ml: 10, price: 429 },
      { size_ml: 20, price: 649 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "Afnan supermacy collector edition",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    full_bottle_price: 5000,
    variants: [
      { size_ml: 5, price: 320 },
      { size_ml: 10, price: 539 },
      { size_ml: 20, price: 849 },
      { size_ml: 50, price: 1999 }
    ]
  },

  {
    name: "Hawas Ice",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 270 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 749 },
      { size_ml: 50, price: 1499 }
    ]
  },

    {
    name: "Hawas tropical",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 270 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 749 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "Hawas for him",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 270 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 749 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "Hawas elixer",
    category: "Middle eastern",
    weather: "Winter",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 270 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 749 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "Hawas Fire",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 270 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 749 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "Hawas verde",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 270 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 749 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "Hawas black",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 270 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 749 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "Hawas Malibu",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 270 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 749 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "Hawas kobra",
    category: "Middle eastern",
    weather: "Summer/winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 270 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 749 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "lattafa khamrah qahwa",
    category: "Middle eastern",
    weather: "Winter",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 270 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 749 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "sharaf blend the club",
    category: "Middle eastern",
    weather: "Summer/winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 270 },
      { size_ml: 10, price: 449 },
      { size_ml: 20, price: 749 },
      { size_ml: 50, price: 1499 }
    ]
  },

    {
    name: "sharaf blend",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 249 },
      { size_ml: 10, price: 399 },
      { size_ml: 20, price: 649 },
      { size_ml: 50, price: 1349 }
    ]
  },

  {
    name: "Jean Lowe ombre",
    category: "Middle eastern",
    weather: "Winter",
    type: "EDP",
    gender: "M",
    full_bottle_price: 5000,
    variants: [
      { size_ml: 5, price: 299 },
      { size_ml: 10, price: 519 },
      { size_ml: 20, price: 959 },
      { size_ml: 50, price: 2499 }
    ]
  },

  {
    name: "Afnan 9PM",
    category: "Middle eastern",
    weather: "Winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 249 },
      { size_ml: 10, price: 399 },
      { size_ml: 20, price: 649 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "9PM ELIXER",
    category: "Middle eastern",
    weather: "Summer",
    type: "EXTRAIT DE PARFUM",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 249 },
      { size_ml: 10, price: 399 },
      { size_ml: 20, price: 649 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "9PM night out",
    category: "Middle eastern",
    weather: "Winter/summer",
    type: "EXTRAIT DE PARFUM",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 249 },
      { size_ml: 10, price: 399 },
      { size_ml: 20, price: 649 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "9PM Dive",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 249 },
      { size_ml: 10, price: 399 },
      { size_ml: 20, price: 649 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "9PM REBEL",
    category: "Middle eastern",
    weather: "Summer",
    type: "EDP",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 249 },
      { size_ml: 10, price: 399 },
      { size_ml: 20, price: 649 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "Liquid Brun",
    category: "Middle eastern",
    weather: "Winter",
    type: "EDP",
    gender: "M",
    variants: [
      { size_ml: 5, price: 249 },
      { size_ml: 10, price: 399 },
      { size_ml: 20, price: 649 },
      { size_ml: 50, price: 1499 }
    ]
  },

  {
    name: "Greek Tabacco",
    category: "Middle eastern",
    weather: "Winter",
    type: "EXTRAIT DE PARFUM",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 749 },
      { size_ml: 20, price: 1199 },
      { size_ml: 50, price: 2999 }
    ]
  },

  {
    name: "Brazilan Tabacco",
    category: "Middle eastern",
    weather: "Winter",
    type: "EXTRAIT DE PARFUM",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 749 },
      { size_ml: 20, price: 1199 },
      { size_ml: 50, price: 2999 }
    ]
  },

    {
    name: "Spanish Tabacco",
    category: "Middle eastern",
    weather: "Winter",
    type: "EXTRAIT DE PARFUM",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 749 },
      { size_ml: 20, price: 1199 },
      { size_ml: 50, price: 2999 }
    ]
  },

  {
    name: "French Tabacco",
    category: "Middle eastern",
    weather: "Summer",
    type: "EXTRAIT DE PARFUM",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 749 },
      { size_ml: 20, price: 1199 },
      { size_ml: 50, price: 2999 }
    ]
  },

  {
    name: "Tabacco extrait de parfum",
    category: "Middle eastern",
    weather: "Winter",
    type: "EXTRAIT DE PARFUM",
    gender: "M",
    variants: [
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 749 },
      { size_ml: 20, price: 1199 },
      { size_ml: 50, price: 2999 }
    ]
  },

  {
    name: "Dominican Tabacco",
    category: "Middle eastern",
    weather: "Winter",
    type: "EXTRAIT DE PARFUM",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 749 },
      { size_ml: 20, price: 1199 },
      { size_ml: 50, price: 2999 }
    ]
  },

  {
    name: "Cuban Tabacco",
    category: "Middle eastern",
    weather: "Winter",
    type: "EXTRAIT DE PARFUM",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 749 },
      { size_ml: 20, price: 1199 },
      { size_ml: 50, price: 2999 }
    ]
  },

  {
    name: "Jamacian Tabacco",
    category: "Middle eastern",
    weather: "Winter",
    type: "EXTRAIT DE PARFUM",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 749 },
      { size_ml: 20, price: 1199 },
      { size_ml: 50, price: 2999 }
    ]
  },

  {
    name: "Mexican Tabacco",
    category: "Middle eastern",
    weather: "Winter",
    type: "EXTRAIT DE PARFUM",
    gender: "M/W",
    variants: [
      { size_ml: 5, price: 399 },
      { size_ml: 10, price: 749 },
      { size_ml: 20, price: 1199 },
      { size_ml: 50, price: 2999 }
    ]
  }
];

const client = await pool.connect();

try {
  await client.query("BEGIN");

  for (const product of products) {
    const productResult = await client.query(
      `INSERT INTO products
       (name, category, weather, type, gender, full_bottle_price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        product.name,
        product.category ?? null,
        product.weather ?? null,
        product.type ?? null,
        product.gender ?? null,
        product.full_bottle_price ?? null
      ]
    );

    const productId = productResult.rows[0].id;

    for (const variant of product.variants) {
      await client.query(
        `INSERT INTO product_variants
         (product_id, size_ml, price)
         VALUES ($1, $2, $3)`,
        [
          productId,
          variant.size_ml,
          variant.price
        ]
      );
    }
  }

  await client.query("COMMIT");

  console.log(`Successfully seeded ${products.length} products.`);
} catch (error) {
  await client.query("ROLLBACK");

  console.error("Seeding failed:", error.message);

  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
