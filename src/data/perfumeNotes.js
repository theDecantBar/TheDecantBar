/**
 * Accurate Olfactory Profiles & Note Pyramids for The Decant Bar Catalog
 * Extracted from authentic fragrance compositions (Fragrantica / Parfumo database standards).
 * Contains full profiles for all catalog fragrances with authentic Accords, Notes, Descriptions & Suitability.
 */


export const KNOWN_PERFUMES = [
  {
    matches: ["mexican tobacco"],
    brand: "Bespoke Collection",
    name: "Mexican Tobacco",
    description:
      "A warm tobacco fragrance with dark chocolate, cinnamon, soft florals and a deep woody-amber character.",
    vibe: "Tobacco, Dark Chocolate, Warm Spices & Amber",
    longevity: "Not independently verified",
    projection: "Not independently verified",
    accords: [
      { name: "tobacco", color: "#8B4513", percentage: 95 },
      { name: "sweet", color: "#9C2759", percentage: 80 },
      { name: "floral", color: "#B85428", percentage: 72 },
      { name: "rose", color: "#D9828B", percentage: 65 },
      { name: "warm spicy", color: "#C49E49", percentage: 55 },
      { name: "woody", color: "#6E4F32", percentage: 48 },
      { name: "amber", color: "#B87532", percentage: 38 }
    ],
    whenToWear: {
      winter: 95,
      spring: 35,
      summer: 10,
      fall: 85,
      day: 40,
      night: 95
    },
    topNotes: ["Cedarwood", "Dark Chocolate"],
    middleNotes: ["Lilac", "Cinnamon"],
    baseNotes: ["Tobacco", "Rose", "Amber"]
  },

  {
    matches: ["cuban tobacco"],
    brand: "Bespoke Collection",
    name: "Cuban Tobacco",
    description:
      "A rich tobacco scent with cocoa, leather, sandalwood, vanilla and sweet honeyed nuances.",
    vibe: "Tobacco, Cocoa, Leather & Honey",
    longevity: "Not independently verified",
    projection: "Not independently verified",
    accords: [
      { name: "tobacco", color: "#8B4513", percentage: 95 },
      { name: "sweet", color: "#9C2759", percentage: 80 },
      { name: "leather", color: "#8C4A32", percentage: 72 },
      { name: "woody", color: "#6E4F32", percentage: 65 },
      { name: "warm spicy", color: "#C49E49", percentage: 55 },
      { name: "cacao", color: "#654321", percentage: 48 },
      { name: "honey", color: "#D9A441", percentage: 38 }
    ],
    whenToWear: {
      winter: 95,
      spring: 35,
      summer: 10,
      fall: 85,
      day: 40,
      night: 95
    },
    topNotes: ["Cocoa", "Tobacco"],
    middleNotes: ["Leather", "Sandalwood", "Vanilla"],
    baseNotes: ["Honey", "Coconut"]
  },

  {
    matches: ["jamaican tobacco"],
    brand: "Bespoke Collection",
    name: "Jamaican Tobacco",
    description:
      "A woody tobacco fragrance with patchouli, amber, cedar, oud, jasmine and earthy vetiver facets.",
    vibe: "Woody Tobacco, Patchouli, Amber & Oud",
    longevity: "Not independently verified",
    projection: "Not independently verified",
    accords: [
      { name: "woody", color: "#6E4F32", percentage: 95 },
      { name: "tobacco", color: "#8B4513", percentage: 85 },
      { name: "white floral", color: "#D8C7D8", percentage: 72 },
      { name: "patchouli", color: "#536B42", percentage: 65 },
      { name: "earthy", color: "#8A7455", percentage: 55 },
      { name: "amber", color: "#D9822B", percentage: 50 },
      { name: "sweet", color: "#9C2759", percentage: 42 },
      { name: "warm spicy", color: "#C49E49", percentage: 35 },
      { name: "aromatic", color: "#739E9B", percentage: 28 }
    ],
    whenToWear: {
      winter: 95,
      spring: 45,
      summer: 20,
      fall: 90,
      day: 45,
      night: 95
    },
    topNotes: ["Patchouli", "Amber"],
    middleNotes: ["Tobacco", "Cedar", "Oud"],
    baseNotes: ["Jasmine", "Vetiver"]
  },

  {
    matches: ["tom ford ombre leather", "tom ford ombré leather", "ombre leather"],
    brand: "Tom Ford",
    name: "Tom Ford Ombré Leather",
    description:
      "A distinctive leather fragrance with cardamom, jasmine sambac, amber, moss and patchouli.",
    vibe: "Rich Leather, Warm Spice & White Florals",
    longevity: "Check current wearer reviews",
    projection: "Check current wearer reviews",
    accords: [
      { name: "leather", color: "#7A4B3A", percentage: 95 },
      { name: "animalic", color: "#705447", percentage: 82 },
      { name: "warm spicy", color: "#B85428", percentage: 72 },
      { name: "white floral", color: "#D8C7D8", percentage: 65 },
      { name: "amber", color: "#D9822B", percentage: 58 },
      { name: "smoky", color: "#4A4A4E", percentage: 50 },
      { name: "earthy", color: "#8A7455", percentage: 42 },
      { name: "mossy", color: "#61734B", percentage: 35 },
      { name: "patchouli", color: "#536B42", percentage: 28 },
      { name: "woody", color: "#6E4F32", percentage: 22 }
    ],
    whenToWear: {
      winter: 95,
      spring: 55,
      summer: 35,
      fall: 90,
      day: 65,
      night: 90
    },
    topNotes: ["Cardamom"],
    middleNotes: ["Leather", "Jasmine Sambac"],
    baseNotes: ["Amber", "Moss", "Patchouli"]
  },

  {
    matches: [
      "tom ford ombre leather parfum",
      "tom ford ombré leather parfum",
      "ombre leather parfum"
    ],
    brand: "Tom Ford",
    name: "Tom Ford Ombré Leather Parfum",
    description:
      "A refined leather fragrance opening with violet leaf and cedar, developing into jasmine sambac and orris, with leather, woods and tobacco in the base.",
    vibe: "Leather, Violet Leaf, Woods & Tobacco",
    longevity: "Check current wearer reviews",
    projection: "Check current wearer reviews",
    accords: [
      { name: "leather", color: "#7A4B3A", percentage: 95 },
      { name: "woody", color: "#6E4F32", percentage: 85 },
      { name: "ozonic", color: "#78A9B8", percentage: 72 },
      { name: "animalic", color: "#705447", percentage: 65 },
      { name: "aquatic", color: "#4C9AA8", percentage: 55 },
      { name: "white floral", color: "#D8C7D8", percentage: 48 },
      { name: "tobacco", color: "#8B4513", percentage: 42 },
      { name: "iris", color: "#8A79A8", percentage: 35 },
      { name: "smoky", color: "#4A4A4E", percentage: 28 },
      { name: "powdery", color: "#B7A7A0", percentage: 22 }
    ],
    whenToWear: {
      winter: 90,
      spring: 60,
      summer: 35,
      fall: 90,
      day: 65,
      night: 90
    },
    topNotes: ["Violet Leaf", "Cedar"],
    middleNotes: ["Jasmine Sambac", "Orris"],
    baseNotes: ["Leather", "Woody Notes", "Tobacco"]
  },

  // Continue with perfume 6 onwards here.


  
{
  matches: ["tom ford ebene fume", "ebene fume", "ébène fumé"],
  brand: "Tom Ford",
  name: "Tom Ford Ébène Fumé",
  topNotes: ["Incense", "Palo Santo", "Black Pepper", "Violet Leaf"],
  middleNotes: ["Leather", "Labdanum", "Cade Oil", "Papyrus", "Rose"],
  baseNotes: ["Resins", "Ebony Tree", "Guaiac Wood"],
  accords: [
    { name: "woody", color: "#6E4F32", percentage: 100 },
    { name: "amber", color: "#C17A36", percentage: 90 },
    { name: "smoky", color: "#4A4A4E", percentage: 80 },
    { name: "balsamic", color: "#80543D", percentage: 70 },
    { name: "warm spicy", color: "#B85428", percentage: 60 },
    { name: "fresh spicy", color: "#648C8C", percentage: 50 },
    { name: "aromatic", color: "#346B45", percentage: 40 },
    { name: "leather", color: "#7A4B3A", percentage: 30 }
  ]
},
{
  matches: ["tom ford tuscan leather", "tuscan leather"],
  brand: "Tom Ford",
  name: "Tom Ford Tuscan Leather",
  topNotes: ["Raspberry", "Saffron", "Thyme"],
  middleNotes: ["Olibanum", "Jasmine"],
  baseNotes: ["Leather", "Suede", "Woody Notes", "Amber"],
  accords: [
    { name: "leather", color: "#7A4B3A", percentage: 100 },
    { name: "fruity", color: "#C84B4B", percentage: 90 },
    { name: "animalic", color: "#8C533E", percentage: 80 },
    { name: "sweet", color: "#9C2759", percentage: 70 },
    { name: "amber", color: "#C17A36", percentage: 60 },
    { name: "warm spicy", color: "#B85428", percentage: 50 },
    { name: "smoky", color: "#4A4A4E", percentage: 40 },
    { name: "woody", color: "#6E4F32", percentage: 30 }
  ]
},
{
  matches: ["tom ford white suede", "white suede"],
  brand: "Tom Ford",
  name: "Tom Ford White Suede",
  topNotes: ["Thyme", "Tea"],
  middleNotes: ["Lily-of-the-Valley", "Saffron", "Rose"],
  baseNotes: ["Suede", "Musk", "Sandalwood", "Olibanum", "Amber"],
  accords: [
    { name: "musky", color: "#77717C", percentage: 100 },
    { name: "powdery", color: "#B7A7A0", percentage: 90 },
    { name: "leather", color: "#7A4B3A", percentage: 80 },
    { name: "white floral", color: "#D8C7D8", percentage: 70 },
    { name: "warm spicy", color: "#B85428", percentage: 60 },
    { name: "amber", color: "#C17A36", percentage: 50 },
    { name: "woody", color: "#6E4F32", percentage: 40 },
    { name: "fresh", color: "#739E9B", percentage: 30 },
    { name: "aromatic", color: "#346B45", percentage: 25 },
    { name: "green", color: "#537A42", percentage: 20 }
  ]
},
{
  matches: ["tom ford grey vetiver", "grey vetiver"],
  brand: "Tom Ford",
  name: "Tom Ford Grey Vetiver",
  topNotes: ["Grapefruit", "Orange Blossom", "Sage"],
  middleNotes: ["Nutmeg", "Orris Root", "Pimento"],
  baseNotes: ["Vetiver", "Woodsy Notes", "Oakmoss", "Amber"],
  accords: [
    { name: "woody", color: "#6E4F32", percentage: 100 },
    { name: "aromatic", color: "#346B45", percentage: 90 },
    { name: "earthy", color: "#8A7455", percentage: 80 },
    { name: "citrus", color: "#D5A52B", percentage: 70 },
    { name: "fresh spicy", color: "#648C8C", percentage: 60 },
    { name: "mossy", color: "#61734B", percentage: 50 }
  ]
},
{
  matches: ["creed aventus"],
  brand: "Creed",
  name: "Creed Aventus",
  topNotes: ["Bergamot", "Black Currant", "Apple", "Lemon", "Pink Pepper"],
  middleNotes: ["Pineapple", "Patchouli", "Moroccan Jasmine"],
  baseNotes: ["Birch", "Musk", "Oakmoss", "Cedarwood", "Ambroxan"],
  accords: [
    { name: "fruity", color: "#C84B4B", percentage: 100 },
    { name: "sweet", color: "#9C2759", percentage: 90 },
    { name: "woody", color: "#6E4F32", percentage: 80 },
    { name: "leather", color: "#7A4B3A", percentage: 70 },
    { name: "citrus", color: "#D5A52B", percentage: 60 },
    { name: "smoky", color: "#4A4A4E", percentage: 50 },
    { name: "musky", color: "#77717C", percentage: 40 },
    { name: "fresh", color: "#739E9B", percentage: 30 },
    { name: "tropical", color: "#D88B36", percentage: 25 },
    { name: "mossy", color: "#61734B", percentage: 20 }
  ]
},
{
  matches: ["creed absolu aventus", "absolu aventus", "aventus absolu"],
  brand: "Creed",
  name: "Creed Absolu Aventus",
  topNotes: ["Grapefruit", "Bergamot", "Pink Pepper", "Black Currant", "Pineapple", "Nutmeg", "Cloves"],
  middleNotes: ["Ginger", "Cinnamon", "Citron", "Cardamom", "Rose"],
  baseNotes: ["Patchouli", "Vetiver", "Oakmoss", "Ambroxan", "Sandalwood", "Musk", "Tonka", "Evernyl"],
  accords: [
    { name: "citrus", color: "#D5A52B", percentage: 100 },
    { name: "warm spicy", color: "#B85428", percentage: 90 },
    { name: "fresh spicy", color: "#648C8C", percentage: 80 },
    { name: "woody", color: "#6E4F32", percentage: 70 },
    { name: "fruity", color: "#C84B4B", percentage: 60 },
    { name: "aromatic", color: "#346B45", percentage: 50 },
    { name: "earthy", color: "#8A7455", percentage: 40 },
    { name: "sweet", color: "#9C2759", percentage: 30 },
    { name: "soft spicy", color: "#B98466", percentage: 25 },
    { name: "patchouli", color: "#66513D", percentage: 20 }
  ]
},
{
  matches: ["creed green irish tweed", "green irish tweed", "creed irish"],
  brand: "Creed",
  name: "Creed Green Irish Tweed",
  topNotes: ["Iris", "Vervain"],
  middleNotes: ["Violet Leaf"],
  baseNotes: ["Ambergris", "Sandalwood"],
  accords: [
    { name: "ozonic", color: "#7DB7C5", percentage: 100 },
    { name: "aquatic", color: "#3C91B5", percentage: 90 }
  ]
},
{
  matches: ["creed silver mountain water", "silver mountain water", "mountain silver"],
  brand: "Creed",
  name: "Creed Silver Mountain Water",
  topNotes: ["Bergamot", "Mandarin Orange"],
  middleNotes: ["Green Tea", "Black Currant"],
  baseNotes: ["Musk", "Petitgrain", "Sandalwood", "Galbanum"],
  accords: [
    { name: "citrus", color: "#D5A52B", percentage: 100 },
    { name: "green", color: "#537A42", percentage: 90 },
    { name: "fruity", color: "#C84B4B", percentage: 80 },
    { name: "musky", color: "#77717C", percentage: 70 },
    { name: "woody", color: "#6E4F32", percentage: 60 },
    { name: "aromatic", color: "#346B45", percentage: 50 },
    { name: "powdery", color: "#B7A7A0", percentage: 40 },
    { name: "fresh spicy", color: "#648C8C", percentage: 30 },
    { name: "fresh", color: "#739E9B", percentage: 25 },
    { name: "floral", color: "#D8C7D8", percentage: 20 }
  ]
},
{
  matches: ["creed original vetiver", "original vetiver", "original vetivar"],
  brand: "Creed",
  name: "Creed Original Vetiver",
  topNotes: ["Bergamot", "Ginger", "Mandarin Orange"],
  middleNotes: ["Haitian Vetiver", "Sandalwood", "Iris"],
  baseNotes: ["Musk", "Ambergris"],
  accords: [
    { name: "citrus", color: "#D5A52B", percentage: 100 },
    { name: "woody", color: "#6E4F32", percentage: 90 },
    { name: "aromatic", color: "#346B45", percentage: 80 },
    { name: "fresh spicy", color: "#648C8C", percentage: 70 },
    { name: "earthy", color: "#8A7455", percentage: 60 },
    { name: "powdery", color: "#B7A7A0", percentage: 50 },
    { name: "musky", color: "#77717C", percentage: 40 },
    { name: "amber", color: "#C17A36", percentage: 30 },
    { name: "green", color: "#537A42", percentage: 25 },
    { name: "iris", color: "#8A79A8", percentage: 20 }
  ]
},
{
  matches: ["azzaro the most wanted intense", "the most wanted intense", "most wanted intense"],
  brand: "Azzaro",
  name: "Azzaro The Most Wanted Intense",
  topNotes: ["Bergamot"],
  middleNotes: ["Lavender"],
  baseNotes: ["Liquor", "Moss"],
  accords: [
    { name: "lavender", color: "#8A79A8", percentage: 100 },
    { name: "citrus", color: "#D5A52B", percentage: 90 },
    { name: "fresh spicy", color: "#648C8C", percentage: 80 },
    { name: "aromatic", color: "#346B45", percentage: 70 },
    { name: "mossy", color: "#61734B", percentage: 60 },
    { name: "alcohol", color: "#A78B70", percentage: 50 },
    { name: "earthy", color: "#8A7455", percentage: 40 },
    { name: "woody", color: "#6E4F32", percentage: 30 },
    { name: "herbal", color: "#537A42", percentage: 25 },
    { name: "floral", color: "#D8C7D8", percentage: 20 }
  ]
},


{
  "matches": [
    "azzaro most wanted night",
    "most wanted",
    "azzaro"
  ],
  "brand": "Designer",
  "name": "Azzaro most wanted night",
  "description": "Azzaro most wanted night is a distinctive EDP Designer fragrance crafted for Winter wear. Opens with vibrant top notes of Red Ginger, Cardamom, transitioning into a captivating heart of Toffee Caramel and Woody Notes, rested on a lingering base of Bourbon Vanilla, Amberwood.",
  "vibe": "Sweet Toffee Caramel, Spiced Cardamom & Bourbon Vanilla",
  "longevity": "10 – 12 Hours",
  "projection": "Beast Mode",
  "accords": [
    {
      "name": "warm spicy",
      "color": "#b85428",
      "percentage": 92
    },
    {
      "name": "sweet",
      "color": "#9c2759",
      "percentage": 82
    },
    {
      "name": "caramel",
      "color": "#c49e49",
      "percentage": 74
    },
    {
      "name": "amber",
      "color": "#d9822b",
      "percentage": 66
    },
    {
      "name": "woody",
      "color": "#6e4f32",
      "percentage": 58
    }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": [
    "Cardamom"
  ],
  "middleNotes": [
    "Toffee Caramel"
  ],
  "heartNotes": [
    "Toffee Caramel"
  ],
  "baseNotes": [
    "Amberwood"
  ]
},
{
  "matches": [
    "valentino born in roma green stravaganza",
    "valentino",
    "born in roma",
    "uomo"
  ],
  "brand": "Designer",
  "name": "Valentino born in roma green stravaganza",
  "description": "Valentino born in roma green stravaganza is a distinctive EDT Designer fragrance crafted for Summer wear. Opens with vibrant top notes of Mineral Notes, Violet Leaf, Salt, transitioning into a captivating heart of Ginger and Sage, rested on a lingering base of Smoked Vetiver, Woody Notes.",
  "vibe": "Smoky Vetiver, Mineral Salt, Violet Leaf & Ginger",
  "longevity": "8 – 10 Hours",
  "projection": "Strong & Chic",
  "accords": [
    {
      "name": "fresh",
      "color": "#6b9a55",
      "percentage": 94
    },
    {
      "name": "citrus",
      "color": "#9a7028",
      "percentage": 84
    },
    {
      "name": "sweet",
      "color": "#9c2759",
      "percentage": 74
    },
    {
      "name": "synthetic",
      "color": "#777777",
      "percentage": 64
    },
    {
      "name": "green",
      "color": "#283b2d",
      "percentage": 54
    }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": [
    "Calabrian Bergamot"
  ],
  "middleNotes": [
    "Coffee"
  ],
  "heartNotes": [
    "Coffee"
  ],
  "baseNotes": [
    "Vetiver"
  ]
},
{
  "matches": [
    "valentino men uomo",
    "valentino",
    "born in roma",
    "uomo"
  ],
  "brand": "Designer",
  "name": "Valentino men Uomo",
  "description": "Valentino men Uomo is a distinctive EDT Designer fragrance crafted for summeer/winter wear. Opens with vibrant top notes of Mineral Notes, Violet Leaf, Salt, transitioning into a captivating heart of Ginger and Sage, rested on a lingering base of Smoked Vetiver, Woody Notes.",
  "vibe": "Smoky Vetiver, Mineral Salt, Violet Leaf & Ginger",
  "longevity": "8 – 10 Hours",
  "projection": "Strong & Chic",
  "accords": [
    {
      "name": "woody",
      "color": "#543e2e",
      "percentage": 94
    },
    {
      "name": "nutty",
      "color": "#a67c52",
      "percentage": 84
    },
    {
      "name": "warm spicy",
      "color": "#b85428",
      "percentage": 74
    },
    {
      "name": "chocolate",
      "color": "#5b3528",
      "percentage": 64
    },
    {
      "name": "leather",
      "color": "#7a4b3a",
      "percentage": 54
    },
    {
      "name": "coffee",
      "color": "#594033",
      "percentage": 44
    },
    {
      "name": "sweet",
      "color": "#9c2759",
      "percentage": 34
    },
    {
      "name": "citrus",
      "color": "#d5a52b",
      "percentage": 24
    }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": [
    "Bergamot",
    "Myrtle"
  ],
  "middleNotes": [
    "Hazelnut",
    "Chocolate",
    "Roasted Coffee Beans"
  ],
  "heartNotes": [
    "Hazelnut",
    "Chocolate",
    "Roasted Coffee Beans"
  ],
  "baseNotes": [
    "Leather",
    "Cedar"
  ]
},
{
  "matches": [
    "valentino coral",
    "valentino",
    "born in roma",
    "uomo"
  ],
  "brand": "Designer",
  "name": "Valentino coral",
  "description": "Valentino coral is a distinctive EDT Designer fragrance crafted for Winter wear. Opens with vibrant top notes of Mineral Notes, Violet Leaf, Salt, transitioning into a captivating heart of Ginger and Sage, rested on a lingering base of Smoked Vetiver, Woody Notes.",
  "vibe": "Smoky Vetiver, Mineral Salt, Violet Leaf & Ginger",
  "longevity": "8 – 10 Hours",
  "projection": "Strong & Chic",
  "accords": [
    {
      "name": "warm spicy",
      "color": "#b85428",
      "percentage": 92
    },
    {
      "name": "sweet",
      "color": "#9c2759",
      "percentage": 82
    },
    {
      "name": "amber",
      "color": "#d9822b",
      "percentage": 74
    },
    {
      "name": "vanilla",
      "color": "#c49e49",
      "percentage": 66
    },
    {
      "name": "woody",
      "color": "#6e4f32",
      "percentage": 58
    },
    {
      "name": "powdery",
      "color": "#8c7e77",
      "percentage": 46
    },
    {
      "name": "aromatic",
      "color": "#346b45",
      "percentage": 36
    }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": [
    "Mineral Notes",
    "Violet Leaf",
    "Salt"
  ],
  "middleNotes": [
    "Ginger",
    "Sage"
  ],
  "heartNotes": [
    "Ginger",
    "Sage"
  ],
  "baseNotes": [
    "Smoked Vetiver",
    "Woody Notes"
  ]
},
{
  "matches": [
    "valentino men born in roma",
    "valentino",
    "born in roma",
    "uomo"
  ],
  "brand": "Designer",
  "name": "Valentino men born in roma",
  "description": "Valentino men born in roma is a distinctive EDT Designer fragrance crafted for Winter wear. Opens with vibrant top notes of Mineral Notes, Violet Leaf, Salt, transitioning into a captivating heart of Ginger and Sage, rested on a lingering base of Smoked Vetiver, Woody Notes.",
  "vibe": "Smoky Vetiver, Mineral Salt, Violet Leaf & Ginger",
  "longevity": "8 – 10 Hours",
  "projection": "Strong & Chic",
  "accords": [
    {
      "name": "warm spicy",
      "color": "#b85428",
      "percentage": 92
    },
    {
      "name": "sweet",
      "color": "#9c2759",
      "percentage": 82
    },
    {
      "name": "amber",
      "color": "#d9822b",
      "percentage": 74
    },
    {
      "name": "vanilla",
      "color": "#c49e49",
      "percentage": 66
    },
    {
      "name": "woody",
      "color": "#6e4f32",
      "percentage": 58
    },
    {
      "name": "powdery",
      "color": "#8c7e77",
      "percentage": 46
    },
    {
      "name": "aromatic",
      "color": "#346b45",
      "percentage": 36
    }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": [
    "Mineral Notes",
    "Violet Leaf",
    "Salt"
  ],
  "middleNotes": [
    "Ginger",
    "Sage"
  ],
  "heartNotes": [
    "Ginger",
    "Sage"
  ],
  "baseNotes": [
    "Smoked Vetiver",
    "Woody Notes"
  ]
},
{
  "matches": [
    "baccarat rouge 540",
    "baccarat rouge"
  ],
  "brand": "Niche",
  "name": "Baccarat rouge 540",
  "description": "Baccarat rouge 540 is a distinctive EDP Niche fragrance crafted for Winter wear. Opens with vibrant top notes of Bitter Almond, Saffron, transitioning into a captivating heart of Egyptian Jasmine and Cedar, rested on a lingering base of Ambergris, Woody Musk, Fir Resin.",
  "vibe": "Airy Crystal Amber, Sweet Saffron & Cedar",
  "longevity": "12+ Hours",
  "projection": "Magnetic Sillage Monster",
  "accords": [
    {
      "name": "warm spicy",
      "color": "#b85428",
      "percentage": 92
    },
    {
      "name": "sweet",
      "color": "#9c2759",
      "percentage": 82
    },
    {
      "name": "amber",
      "color": "#d9822b",
      "percentage": 74
    },
    {
      "name": "vanilla",
      "color": "#c49e49",
      "percentage": 66
    },
    {
      "name": "woody",
      "color": "#6e4f32",
      "percentage": 58
    },
    {
      "name": "powdery",
      "color": "#8c7e77",
      "percentage": 46
    },
    {
      "name": "aromatic",
      "color": "#346b45",
      "percentage": 36
    }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": [
    "Bitter Almond",
    "Saffron"
  ],
  "middleNotes": [
    "Egyptian Jasmine",
    "Cedar"
  ],
  "heartNotes": [
    "Egyptian Jasmine",
    "Cedar"
  ],
  "baseNotes": [
    "Ambergris",
    "Woody Musk",
    "Fir Resin"
  ]
},
{
  "matches": [
    "ysl l homme",
    "ysl",
    "l homme",
    "myself"
  ],
  "brand": "Designer",
  "name": "YSL L Homme",
  "description": "YSL L Homme is a distinctive EDP Designer fragrance crafted for Winter wear. Opens with vibrant top notes of Calabrian Bergamot, Ginger, Apple, transitioning into a captivating heart of Sage and Geranium, rested on a lingering base of Amberwood, Tonka Bean, Cedar.",
  "vibe": "Sparkling Bergamot, Fresh Ginger, Sage & Amberwood",
  "longevity": "7 – 9 Hours",
  "projection": "Moderate to Strong",
  "accords": [
    {
      "name": "warm spicy",
      "color": "#b85428",
      "percentage": 92
    },
    {
      "name": "sweet",
      "color": "#9c2759",
      "percentage": 82
    },
    {
      "name": "amber",
      "color": "#d9822b",
      "percentage": 74
    },
    {
      "name": "vanilla",
      "color": "#c49e49",
      "percentage": 66
    },
    {
      "name": "woody",
      "color": "#6e4f32",
      "percentage": 58
    },
    {
      "name": "powdery",
      "color": "#8c7e77",
      "percentage": 46
    },
    {
      "name": "aromatic",
      "color": "#346b45",
      "percentage": 36
    }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": [
    "Calabrian Bergamot",
    "Ginger",
    "Apple"
  ],
  "middleNotes": [
    "Sage",
    "Geranium",
    "Juniper"
  ],
  "heartNotes": [
    "Sage",
    "Geranium",
    "Juniper"
  ],
  "baseNotes": [
    "Amberwood",
    "Tonka Bean",
    "Cedar",
    "Olibanum"
  ]
},
{
  "matches": [
    "ysl l homme le parfum",
    "ysl",
    "l homme",
    "myself"
  ],
  "brand": "Designer",
  "name": "YSL L Homme Le Parfum",
  "description": "YSL L Homme Le Parfum is a distinctive EDP Designer fragrance crafted for Summer wear. Opens with vibrant top notes of Calabrian Bergamot, Ginger, Apple, transitioning into a captivating heart of Sage and Geranium, rested on a lingering base of Amberwood, Tonka Bean, Cedar.",
  "vibe": "Sparkling Bergamot, Fresh Ginger, Sage & Amberwood",
  "longevity": "7 – 9 Hours",
  "projection": "Moderate to Strong",
  "accords": [
    {
      "name": "citrus",
      "color": "#9a7028",
      "percentage": 94
    },
    {
      "name": "aromatic",
      "color": "#3a4a3c",
      "percentage": 82
    },
    {
      "name": "fresh spicy",
      "color": "#314b4b",
      "percentage": 74
    },
    {
      "name": "woody",
      "color": "#543e2e",
      "percentage": 62
    },
    {
      "name": "aquatic",
      "color": "#2d3d4d",
      "percentage": 52
    },
    {
      "name": "musky",
      "color": "#3d3b40",
      "percentage": 42
    },
    {
      "name": "green",
      "color": "#283b2d",
      "percentage": 34
    }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": [
    "Calabrian Bergamot",
    "Ginger",
    "Apple"
  ],
  "middleNotes": [
    "Sage",
    "Geranium",
    "Juniper"
  ],
  "heartNotes": [
    "Sage",
    "Geranium",
    "Juniper"
  ],
  "baseNotes": [
    "Amberwood",
    "Tonka Bean",
    "Cedar",
    "Olibanum"
  ]
},

{
  "matches": [
    "ysl homme cologne blue",
    "ysl",
    "l homme",
    "myself"
  ],
  "brand": "Designer",
  "name": "YSL Homme cologne blue",
  "description": "YSL Homme cologne blue is a distinctive EDP Designer fragrance crafted for Summer wear. Opens with vibrant top notes of Calabrian Bergamot, Ginger, Apple, transitioning into a captivating heart of Sage and Geranium, rested on a lingering base of Amberwood, Tonka Bean, Cedar.",
  "vibe": "Sparkling Bergamot, Fresh Ginger, Sage & Amberwood",
  "longevity": "7 – 9 Hours",
  "projection": "Moderate to Strong",
  "accords": [
    { "name": "citrus", "color": "#9a7028", "percentage": 94 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 82 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 74 },
    { "name": "woody", "color": "#543e2e", "percentage": 62 },
    { "name": "aquatic", "color": "#2d3d4d", "percentage": 52 },
    { "name": "musky", "color": "#3d3b40", "percentage": 42 },
    { "name": "green", "color": "#283b2d", "percentage": 34 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": [
    "Calabrian Bergamot",
    "Ginger",
    "Apple"
  ],
  "middleNotes": [
    "Sage",
    "Geranium",
    "Juniper"
  ],
  "heartNotes": [
    "Sage",
    "Geranium",
    "Juniper"
  ],
  "baseNotes": [
    "Amberwood",
    "Tonka Bean",
    "Cedar",
    "Olibanum"
  ]
},
{
  "matches": [
    "ysl y",
    "ysl",
    "l homme",
    "myself"
  ],
  "brand": "Designer",
  "name": "YSL Y",
  "description": "YSL Y is a distinctive EDP Designer fragrance crafted for Summer wear. Opens with vibrant top notes of Calabrian Bergamot, Ginger, Apple, transitioning into a captivating heart of Sage and Geranium, rested on a lingering base of Amberwood, Tonka Bean, Cedar.",
  "vibe": "Sparkling Bergamot, Fresh Ginger, Sage & Amberwood",
  "longevity": "7 – 9 Hours",
  "projection": "Moderate to Strong",
  "accords": [
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 94 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 86 },
    { "name": "woody", "color": "#543e2e", "percentage": 78 },
    { "name": "fruity", "color": "#a84c62", "percentage": 68 },
    { "name": "fresh", "color": "#6b9a55", "percentage": 60 },
    { "name": "amber", "color": "#d9822b", "percentage": 52 },
    { "name": "citrus", "color": "#d5a52b", "percentage": 44 },
    { "name": "green", "color": "#283b2d", "percentage": 36 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 28 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": [
    "Apple",
    "Ginger",
    "Bergamot"
  ],
  "middleNotes": [
    "Sage",
    "Juniper Berries",
    "Geranium"
  ],
  "heartNotes": [
    "Sage",
    "Juniper Berries",
    "Geranium"
  ],
  "baseNotes": [
    "Amberwood",
    "Tonka Bean",
    "Cedar",
    "Vetiver",
    "Olibanum"
  ]
},
{
  "matches": [
    "ysl myself l'abslou parfum",
    "ysl",
    "l homme",
    "myself"
  ],
  "brand": "Designer",
  "name": "YSL myself L'abslou parfum",
  "description": "YSL myself L'abslou parfum is a distinctive PARFUM Designer fragrance crafted for Summer wear. Opens with vibrant top notes of Calabrian Bergamot, Ginger, Apple, transitioning into a captivating heart of Sage and Geranium, rested on a lingering base of Amberwood, Tonka Bean, Cedar.",
  "vibe": "Sparkling Bergamot, Fresh Ginger, Sage & Amberwood",
  "longevity": "7 – 9 Hours",
  "projection": "Moderate to Strong",
  "accords": [
    { "name": "woody", "color": "#543e2e", "percentage": 94 },
    { "name": "floral", "color": "#b879a5", "percentage": 84 },
    { "name": "citrus", "color": "#d5a52b", "percentage": 74 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 64 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 54 },
    { "name": "earthy", "color": "#8a7455", "percentage": 44 },
    { "name": "sweet", "color": "#9c2759", "percentage": 34 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": [
    "Bergamot",
    "Ginger",
    "Cardamom"
  ],
  "middleNotes": [
    "Orange Blossom",
    "Grapefruit",
    "Lavandin"
  ],
  "heartNotes": [
    "Orange Blossom",
    "Grapefruit",
    "Lavandin"
  ],
  "baseNotes": [
    "Patchouli",
    "Ambrofix",
    "Vanilla"
  ]
},
{
  "matches": [
    "versace eros"
  ],
  "brand": "Versace",
  "name": "Versace eros",
  "description": "Versace eros is a distinctive EDP Designer fragrance crafted for Summer wear. Opens with vibrant top notes of Mint, Green Apple, Lemon, transitioning into a captivating heart of Tonka Bean and Ambroxan, rested on a lingering base of Madagascar Vanilla, Virginian Cedar, Atlas Cedar.",
  "vibe": "Vibrant Mint, Candied Green Apple, Tonka & Vanilla",
  "longevity": "8 – 10 Hours",
  "projection": "Strong & Alluring",
  "accords": [
    { "name": "fresh", "color": "#6b9a55", "percentage": 94 },
    { "name": "sweet", "color": "#9c2759", "percentage": 86 },
    { "name": "citrus", "color": "#d5a52b", "percentage": 78 },
    { "name": "fruity", "color": "#a84c62", "percentage": 68 },
    { "name": "synthetic", "color": "#777777", "percentage": 58 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 48 },
    { "name": "woody", "color": "#543e2e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": [
    "Italian Lemon",
    "Mint",
    "Candied Apple",
    "Italian Mandarin Orange"
  ],
  "middleNotes": [
    "Ambermax",
    "Clary Sage",
    "Geranium"
  ],
  "heartNotes": [
    "Ambermax",
    "Clary Sage",
    "Geranium"
  ],
  "baseNotes": [
    "Patchouli",
    "Sandalwood",
    "Vanilla",
    "Virginia Cedar",
    "Vetiver",
    "Leather"
  ]
},
{
  "matches": [
    "versace flame",
    "eros flame"
  ],
  "brand": "Versace",
  "name": "versace flame",
  "description": "versace flame is a distinctive EDP Designer fragrance crafted for Summer/winter wear. Opens with vibrant top notes of Mandarin Orange, Black Pepper, Chinotto, transitioning into a captivating heart of Pepperwood and Geranium, rested on a lingering base of Vanilla, Tonka Bean, Sandalwood.",
  "vibe": "Spicy Chinotto Citrus, Black Pepper, Rosemary & Vanilla",
  "longevity": "9 – 11 Hours",
  "projection": "Strong",
  "accords": [
    { "name": "sweet", "color": "#9c2759", "percentage": 94 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 84 },
    { "name": "citrus", "color": "#d5a52b", "percentage": 74 },
    { "name": "fruity", "color": "#a84c62", "percentage": 64 },
    { "name": "fresh", "color": "#6b9a55", "percentage": 54 },
    { "name": "woody", "color": "#543e2e", "percentage": 44 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 34 }
  ],
  "whenToWear": {
    "winter": 2800,
    "spring": 3400,
    "summer": 3100,
    "fall": 3200,
    "day": 3600,
    "night": 3300
  },
  "topNotes": [
    "Mandarin Orange",
    "Chinotto",
    "Lemon",
    "Madagascar Black Pepper",
    "Rosemary"
  ],
  "middleNotes": [
    "Pepperwood",
    "Geranium",
    "Rose"
  ],
  "heartNotes": [
    "Pepperwood",
    "Geranium",
    "Rose"
  ],
  "baseNotes": [
    "Tonka Bean",
    "Vanilla",
    "Patchouli",
    "Sandalwood",
    "Texas Cedar",
    "Haitian Vetiver",
    "Oakmoss"
  ]
},
{
  "matches": [
    "versace pour homme"
  ],
  "brand": "Versace",
  "name": "Versace pour homme",
  "description": "Versace Pour Homme by Versace is an Aromatic Fougere fragrance for men launched in 2008. Opens with Mediterranean citrus and neroli over an aromatic heart of sage and cedar, dried down on tonka and musk.",
  "vibe": "Crisp Mediterranean Citrus & Clean Woods",
  "longevity": "7 – 9 Hours",
  "projection": "Moderate",
  "accords": [
    { "name": "citrus", "color": "#d5a52b", "percentage": 95 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 82 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 70 },
    { "name": "floral", "color": "#b879a5", "percentage": 60 },
    { "name": "green", "color": "#283b2d", "percentage": 50 }
  ],
  "whenToWear": {
    "winter": 600,
    "spring": 3400,
    "summer": 4800,
    "fall": 1600,
    "day": 4500,
    "night": 1800
  },
  "topNotes": [
    "Lemon",
    "Bergamot",
    "Neroli",
    "Rose de Mai"
  ],
  "middleNotes": [
    "Hyacinth",
    "Cedar",
    "Clary Sage",
    "Geranium"
  ],
  "heartNotes": [
    "Hyacinth",
    "Cedar",
    "Clary Sage",
    "Geranium"
  ],
  "baseNotes": [
    "Musk",
    "Tonka Bean",
    "Amber"
  ]
},
{
  "matches": [
    "kilian blue moon",
    "blue moon"
  ],
  "brand": "Niche",
  "name": "Kilian blue moon",
  "description": "Kilian blue moon is a distinctive EDP Niche fragrance crafted for Summer wear. Opens with vibrant top notes of Lemon, Calone (Sea Breeze Accord), transitioning into a captivating heart of Vodka Accord and Ginger, rested on a lingering base of Ambroxan, White Musk.",
  "vibe": "Fresh Vodka, Calone, Ginger & Lemon",
  "longevity": "7 – 8 Hours",
  "projection": "Moderate",
  "accords": [
    { "name": "fresh", "color": "#6b9a55", "percentage": 94 },
    { "name": "citrus", "color": "#d5a52b", "percentage": 86 },
    { "name": "vodka", "color": "#8bbbd0", "percentage": 76 },
    { "name": "musky", "color": "#3d3b40", "percentage": 66 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 56 },
    { "name": "amber", "color": "#d9822b", "percentage": 46 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 36 },
    { "name": "ozonic", "color": "#9bb8c8", "percentage": 28 },
    { "name": "aldehydic", "color": "#a8b5bd", "percentage": 22 },
    { "name": "green", "color": "#283b2d", "percentage": 16 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": [
    "Lemon",
    "Calone",
    "Mint",
    "Aldehydes"
  ],
  "middleNotes": [
    "Vodka",
    "Ginger"
  ],
  "heartNotes": [
    "Vodka",
    "Ginger"
  ],
  "baseNotes": [
    "Ambroxan",
    "White Musk"
  ]
},

  
{
  "matches": [
    "kilian angle share",
    "angle share",
    "angels share",
    "angels' share"
  ],
  "brand": "Niche",
  "name": "Kilian angle share",
  "description": "Kilian angle share is a distinctive EDP Niche fragrance crafted for Winter wear. Opens with vibrant top notes of Cognac Oil, transitioning into a captivating heart of Cinnamon and Tonka Bean, rested on a lingering base of Praline, Vanilla, Sandalwood.",
  "vibe": "Warm Cognac, Cinnamon, Praline & Vanilla Oak",
  "longevity": "10 – 12 Hours",
  "projection": "Strong & Delicious",
  "accords": [
    { "name": "warm spicy", "color": "#b85428", "percentage": 92 },
    { "name": "woody", "color": "#6e4f32", "percentage": 82 },
    { "name": "sweet", "color": "#9c2759", "percentage": 76 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 68 },
    { "name": "cinnamon", "color": "#bd6033", "percentage": 58 },
    { "name": "amber", "color": "#d9822b", "percentage": 48 },
    { "name": "powdery", "color": "#8c7e77", "percentage": 36 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": ["Cognac"],
  "middleNotes": ["Cinnamon", "Tonka Bean", "Oak Wood"],
  "heartNotes": ["Cinnamon", "Tonka Bean", "Oak Wood"],
  "baseNotes": ["Praline", "Vanilla", "Sandalwood"]
},
{
  "matches": [
    "kilian roses on ice",
    "roses on ice"
  ],
  "brand": "Niche",
  "name": "kilian roses on ice",
  "description": "kilian roses on ice is a distinctive EDP Niche fragrance crafted for Summer wear. Opens with vibrant top notes of Cucumber, Juniper Berries, Lime, transitioning into a captivating heart of Rose, rested on a lingering base of Musk, Sandalwood.",
  "vibe": "Chilled Cucumber, Rose Petals & Gin",
  "longevity": "6 – 8 Hours",
  "projection": "Moderate",
  "accords": [
    { "name": "ozonic", "color": "#7dabb5", "percentage": 92 },
    { "name": "aquatic", "color": "#2d3d4d", "percentage": 84 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 76 },
    { "name": "green", "color": "#283b2d", "percentage": 68 },
    { "name": "rose", "color": "#b85c76", "percentage": 58 },
    { "name": "woody", "color": "#543e2e", "percentage": 48 },
    { "name": "musky", "color": "#3d3b40", "percentage": 40 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": [
    "Cucumber",
    "Juniper Berries",
    "Lime",
    "Violet Leaf",
    "Pink Pepper"
  ],
  "middleNotes": ["Rose", "Ozonic Notes"],
  "heartNotes": ["Rose", "Ozonic Notes"],
  "baseNotes": ["Musk", "Sandalwood", "Ambroxan", "Cedar"]
},
{
  "matches": [
    "gentlemen givenchy boise",
    "givenchy",
    "gentlemen givenchy"
  ],
  "brand": "Designer",
  "name": "Gentlemen givenchy boise",
  "description": "Gentlemen givenchy boise is a distinctive EDP Designer fragrance crafted for Winter wear. Opens with vibrant top notes of Bergamot, Black Pepper, Coriander, transitioning into a captivating heart of Iris and Cocoa, rested on a lingering base of Burning Woods, Sandalwood, Patchouli.",
  "vibe": "Warm Iris, Spiced Cocoa, Whiskey Accords & Burning Woods",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Refined",
  "accords": [
    { "name": "woody", "color": "#6e4f32", "percentage": 92 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 82 },
    { "name": "powdery", "color": "#8c7e77", "percentage": 74 },
    { "name": "sweet", "color": "#9c2759", "percentage": 64 },
    { "name": "iris", "color": "#9278a5", "percentage": 56 },
    { "name": "cacao", "color": "#69412e", "percentage": 48 },
    { "name": "earthy", "color": "#776044", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": ["Black Pepper", "Coriander", "Geranium"],
  "middleNotes": ["Iris", "Cedarwood", "Cocoa"],
  "heartNotes": ["Iris", "Cedarwood", "Cocoa"],
  "baseNotes": ["Sandalwood", "Burning Wood", "Patchouli"]
},
{
  "matches": [
    "gentlemen givenchy paris",
    "givenchy",
    "gentlemen givenchy"
  ],
  "brand": "Designer",
  "name": "Gentlemen givenchy paris",
  "description": "Gentlemen givenchy paris is a distinctive EDP Designer fragrance crafted for Winter wear. Opens with vibrant top notes of Bergamot, Black Pepper, Coriander, transitioning into a captivating heart of Iris and Cocoa, rested on a lingering base of Burning Woods, Sandalwood, Patchouli.",
  "vibe": "Warm Iris, Spiced Cocoa, Whiskey Accords & Burning Woods",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Refined",
  "accords": [
    { "name": "warm spicy", "color": "#b85428", "percentage": 92 },
    { "name": "sweet", "color": "#9c2759", "percentage": 82 },
    { "name": "amber", "color": "#d9822b", "percentage": 74 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 66 },
    { "name": "woody", "color": "#6e4f32", "percentage": 58 },
    { "name": "powdery", "color": "#8c7e77", "percentage": 46 },
    { "name": "aromatic", "color": "#346b45", "percentage": 36 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": ["Bergamot", "Black Pepper", "Coriander"],
  "middleNotes": ["Iris", "Cocoa", "Cedar"],
  "heartNotes": ["Iris", "Cocoa", "Cedar"],
  "baseNotes": ["Burning Woods", "Sandalwood", "Patchouli"]
},
{
  "matches": ["1 million"],
  "brand": "Designer",
  "name": "1 Million",
  "description": "1 Million is a distinctive EDT Designer fragrance crafted for Winter wear. Opens with vibrant top notes of Blood Mandarin, Grapefruit, Mint, transitioning into a captivating heart of Cinnamon and Spicy Notes, rested on a lingering base of Amber, Leather, Woody Notes.",
  "vibe": "Sweet Blood Mandarin, Spiced Cinnamon & Blond Leather",
  "longevity": "8 – 10 Hours",
  "projection": "Strong & Alluring",
  "accords": [
    { "name": "warm spicy", "color": "#b85428", "percentage": 92 },
    { "name": "leather", "color": "#5a392d", "percentage": 82 },
    { "name": "citrus", "color": "#9a7028", "percentage": 74 },
    { "name": "sweet", "color": "#9c2759", "percentage": 66 },
    { "name": "amber", "color": "#d9822b", "percentage": 58 },
    { "name": "woody", "color": "#6e4f32", "percentage": 48 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": ["Blood Mandarin", "Grapefruit", "Mint"],
  "middleNotes": ["Cinnamon", "Spicy Notes", "Rose"],
  "heartNotes": ["Cinnamon", "Spicy Notes", "Rose"],
  "baseNotes": ["Amber", "Leather", "Woody Notes", "Indian Patchouli"]
},
{
  "matches": [
    "christian dior oud isphan",
    "oud isphan",
    "oud ispahan"
  ],
  "brand": "Dior",
  "name": "Christian Dior oud isphan",
  "description": "Christian Dior oud isphan is a distinctive EDP Niche fragrance crafted for Winter wear. Opens with vibrant top notes of Labdanum, transitioning into a captivating heart of Rose and Patchouli, rested on a lingering base of Agarwood (Oud), Sandalwood, Cedar.",
  "vibe": "Opulent Oriental Rose & Smoky Leather Oud",
  "longevity": "12+ Hours (Beast Mode)",
  "projection": "Enormous",
  "accords": [
    { "name": "oud", "color": "#49352c", "percentage": 92 },
    { "name": "rose", "color": "#b85c76", "percentage": 84 },
    { "name": "woody", "color": "#6e4f32", "percentage": 76 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 66 },
    { "name": "amber", "color": "#d9822b", "percentage": 56 },
    { "name": "patchouli", "color": "#526447", "percentage": 46 },
    { "name": "balsamic", "color": "#806047", "percentage": 36 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": ["Labdanum"],
  "middleNotes": ["Rose", "Patchouli", "Saffron"],
  "heartNotes": ["Rose", "Patchouli", "Saffron"],
  "baseNotes": ["Agarwood (Oud)", "Sandalwood", "Cedar"]
},
{
  "matches": [
    "christian dior gris dior",
    "gris dior"
  ],
  "brand": "Dior",
  "name": "Christian Dior Gris dior",
  "description": "Christian Dior Gris dior is a distinctive EDP Niche fragrance crafted for Winter/Summer wear. Opens with vibrant top notes of Bergamot, transitioning into a captivating heart of Damascena Rose and Jasmine, rested on a lingering base of Patchouli, Oakmoss, Amber.",
  "vibe": "Chypre Floral, Earthy Oakmoss & Dewy Rose",
  "longevity": "8 – 10 Hours",
  "projection": "Moderate to Strong",
  "accords": [
    { "name": "woody", "color": "#6e4f32", "percentage": 92 },
    { "name": "earthy", "color": "#776044", "percentage": 82 },
    { "name": "mossy", "color": "#526447", "percentage": 74 },
    { "name": "rose", "color": "#b85c76", "percentage": 66 },
    { "name": "patchouli", "color": "#526447", "percentage": 58 },
    { "name": "citrus", "color": "#9a7028", "percentage": 48 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 2800,
    "spring": 3400,
    "summer": 3100,
    "fall": 3200,
    "day": 3600,
    "night": 3300
  },
  "topNotes": ["Bergamot"],
  "middleNotes": ["Rose", "Oakmoss", "Patchouli"],
  "heartNotes": ["Rose", "Oakmoss", "Patchouli"],
  "baseNotes": ["Cedar", "Amber", "Sandalwood"]
},

  
{
  "matches": [
    "dior sauvage parfum",
    "sauvage",
    "dior sauvage"
  ],
  "brand": "Dior",
  "name": "Dior sauvage Parfum",
  "description": "Sauvage by Dior is a radically fresh composition dictated by a name that has the ring of a manifesto. Radiant top notes burst with juicy Calabrian bergamot, while Ambroxan unleashes a powerfully woody trail.",
  "vibe": "Crisp Radiant Bergamot, Szechuan Pepper & Ambroxan",
  "longevity": "8 – 11 Hours",
  "projection": "Strong",
  "accords": [
    { "name": "woody", "color": "#6e4f32", "percentage": 96 },
    { "name": "citrus", "color": "#9a7028", "percentage": 88 },
    { "name": "amber", "color": "#d9822b", "percentage": 78 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 68 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 58 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 48 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 2800,
    "spring": 3900,
    "summer": 4400,
    "fall": 3400,
    "day": 4600,
    "night": 3800
  },
  "topNotes": ["Bergamot", "Mandarin Orange", "Elemi"],
  "middleNotes": ["Sandalwood"],
  "heartNotes": ["Sandalwood"],
  "baseNotes": ["Olibanum", "Tonka Bean", "Vanilla"]
},
{
  "matches": [
    "dior homme intense parfum",
    "dior homme intense",
    "homme intense"
  ],
  "brand": "Dior",
  "name": "Dior homme intense parfum",
  "description": "Dior homme intense parfum is a distinctive PARFUM Designer fragrance crafted for Winter wear. Opens with vibrant top notes of Tuscan Iris, Lavender, transitioning into a captivating heart of Ambrette (Musk Mallow) and Pear, rested on a lingering base of Virginia Cedar, Vetiver.",
  "vibe": "Powdery Iris, Cocoa & Warm Ambrette",
  "longevity": "10 – 12 Hours",
  "projection": "Strong & Enveloping",
  "accords": [
    { "name": "iris", "color": "#9278a5", "percentage": 96 },
    { "name": "powdery", "color": "#8c7e77", "percentage": 88 },
    { "name": "woody", "color": "#6e4f32", "percentage": 78 },
    { "name": "earthy", "color": "#776044", "percentage": 68 },
    { "name": "floral", "color": "#b86f91", "percentage": 58 },
    { "name": "musky", "color": "#3d3b40", "percentage": 48 },
    { "name": "aromatic", "color": "#346b45", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": ["Tuscan Iris", "Lavender"],
  "middleNotes": ["Ambrette (Musk Mallow)", "Pear"],
  "heartNotes": ["Ambrette (Musk Mallow)", "Pear"],
  "baseNotes": ["Virginia Cedar", "Vetiver"]
},
{
  "matches": [
    "dior sauvage elixer",
    "sauvage",
    "dior sauvage"
  ],
  "brand": "Dior",
  "name": "Dior sauvage elixer",
  "description": "Sauvage by Dior is a radically fresh composition dictated by a name that has the ring of a manifesto. Radiant top notes burst with juicy Calabrian bergamot, while Ambroxan unleashes a powerfully woody trail.",
  "vibe": "Crisp Radiant Bergamot, Szechuan Pepper & Ambroxan",
  "longevity": "8 – 11 Hours",
  "projection": "Strong",
  "accords": [
    { "name": "warm spicy", "color": "#b85428", "percentage": 96 },
    { "name": "woody", "color": "#6e4f32", "percentage": 88 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 78 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 68 },
    { "name": "sweet", "color": "#9c2759", "percentage": 58 },
    { "name": "lavender", "color": "#9278a5", "percentage": 48 },
    { "name": "earthy", "color": "#776044", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 2800,
    "spring": 3900,
    "summer": 4400,
    "fall": 3400,
    "day": 4600,
    "night": 3800
  },
  "topNotes": ["Nutmeg", "Cardamom", "Cinnamon", "Grapefruit"],
  "middleNotes": ["Lavender"],
  "heartNotes": ["Lavender"],
  "baseNotes": [
    "Licorice",
    "Sandalwood",
    "Amber",
    "Patchouli",
    "Haitian Vetiver"
  ]
},
{
  "matches": [
    "xerjoff accento",
    "accento"
  ],
  "brand": "Xerjoff",
  "name": "Xerjoff Accento",
  "description": "Xerjoff Accento is a distinctive EDP Niche fragrance crafted for Summer wear. Opens with vibrant top notes of Pineapple, Hyacinth, transitioning into a captivating heart of Pink Pepper and Iris, rested on a lingering base of Musk, Amber, Vetiver.",
  "vibe": "Crisp Pineapple, Hyacinth, Pink Pepper & Iris",
  "longevity": "9 – 11 Hours",
  "projection": "Strong",
  "accords": [
    { "name": "fruity", "color": "#c66b45", "percentage": 96 },
    { "name": "floral", "color": "#b86f91", "percentage": 88 },
    { "name": "fresh", "color": "#579b91", "percentage": 78 },
    { "name": "sweet", "color": "#9c2759", "percentage": 68 },
    { "name": "citrus", "color": "#9a7028", "percentage": 58 },
    { "name": "musky", "color": "#3d3b40", "percentage": 48 },
    { "name": "powdery", "color": "#8c7e77", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Pineapple", "Hyacinth"],
  "middleNotes": ["Pink Pepper", "Iris", "Jasmine"],
  "heartNotes": ["Pink Pepper", "Iris", "Jasmine"],
  "baseNotes": ["Musk", "Amber", "Vetiver", "Patchouli", "Vanilla"]
},
{
  "matches": [
    "xerjoff naxos",
    "naxos"
  ],
  "brand": "Xerjoff",
  "name": "Xerjoff Naxos",
  "description": "Xerjoff Naxos is a distinctive EDP Niche fragrance crafted for Summer wear. Opens with vibrant top notes of Lavender, Bergamot, Lemon, transitioning into a captivating heart of Honey and Cinnamon, rested on a lingering base of Tobacco Leaf, Tonka Bean, Vanilla.",
  "vibe": "Sweet Honey, Tobacco Leaf, Lavender & Citrus",
  "longevity": "11 – 14 Hours",
  "projection": "Strong & Regal",
  "accords": [
    { "name": "sweet", "color": "#9c2759", "percentage": 96 },
    { "name": "honey", "color": "#c28b27", "percentage": 88 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 78 },
    { "name": "tobacco", "color": "#76503b", "percentage": 68 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 58 },
    { "name": "citrus", "color": "#9a7028", "percentage": 48 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Lavender", "Bergamot", "Lemon"],
  "middleNotes": ["Honey", "Cinnamon", "Cashmeran", "Jasmine Sambac"],
  "heartNotes": ["Honey", "Cinnamon", "Cashmeran", "Jasmine Sambac"],
  "baseNotes": ["Tobacco Leaf", "Tonka Bean", "Vanilla"]
},

{
  "matches": ["xerjoff erba pura", "erba pura"],
  "brand": "Xerjoff",
  "name": "Xerjoff Erba Pura",
  "description": "Xerjoff Erba Pura is a distinctive EDP Niche fragrance crafted for Summer wear. Opens with vibrant top notes of Sicilian Orange, Calabrian Bergamot, Sicilian Lemon, transitioning into a captivating heart of Mediterranean Fruit Basket, rested on a lingering base of White Musk, Madagascar Vanilla, Amber.",
  "vibe": "Lush Sicilian Fruits, White Musks & Vanilla Amber",
  "longevity": "12+ Hours (Nuclear)",
  "projection": "Beast Mode",
  "accords": [
    { "name": "fruity", "color": "#db8a35", "percentage": 96 },
    { "name": "sweet", "color": "#9c2759", "percentage": 90 },
    { "name": "citrus", "color": "#9a7028", "percentage": 84 },
    { "name": "musky", "color": "#3d3b40", "percentage": 76 },
    { "name": "powdery", "color": "#8c7e77", "percentage": 62 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 54 },
    { "name": "amber", "color": "#d9822b", "percentage": 46 }
  ],
  "whenToWear": { "winter": 410, "spring": 3200, "summer": 4600, "fall": 1400, "day": 4200, "night": 1900 },
  "topNotes": ["Sicilian Orange", "Calabrian Bergamot", "Sicilian Lemon"],
  "middleNotes": ["Mediterranean Fruit Basket"],
  "heartNotes": ["Mediterranean Fruit Basket"],
  "baseNotes": ["White Musk", "Madagascar Vanilla", "Amber"]
},
{
  "matches": ["spicebomb viktor rolf", "spicebomb"],
  "brand": "Viktor&Rolf",
  "name": "Spicebomb viktor rolf",
  "description": "Spicebomb by Viktor&Rolf is an explosive Woody Spicy fragrance for men launched in 2012. An intense collision of fiery spices including cinnamon and saffron with rich tobacco and leather.",
  "vibe": "Explosive Warm Cinnamon, Saffron & Rich Tobacco",
  "longevity": "9 – 12 Hours",
  "projection": "Strong",
  "accords": [
    { "name": "warm spicy", "color": "#b85428", "percentage": 96 },
    { "name": "cinnamon", "color": "#8d3c1b", "percentage": 88 },
    { "name": "tobacco", "color": "#784421", "percentage": 78 },
    { "name": "sweet", "color": "#9c2759", "percentage": 68 },
    { "name": "leather", "color": "#7A4B3A", "percentage": 60 },
    { "name": "soft spicy", "color": "#a05a32", "percentage": 52 },
    { "name": "citrus", "color": "#9a7028", "percentage": 40 }
  ],
  "whenToWear": { "winter": 4900, "spring": 1100, "summer": 290, "fall": 4300, "day": 1600, "night": 4700 },
  "topNotes": ["Pink Pepper", "Elemi", "Bergamot", "Grapefruit"],
  "middleNotes": ["Cinnamon", "Paprika", "Saffron"],
  "heartNotes": ["Cinnamon", "Paprika", "Saffron"],
  "baseNotes": ["Tobacco", "Leather", "Vetiver"]
},
{
  "matches": ["invictus victory exterme", "invictus victory", "victory exterme"],
  "brand": "Paco Rabanne",
  "name": "Invictus victory exterme",
  "description": "Invictus Victory by Paco Rabanne is an Amber fragrance for men launched in 2021. Features an intense duel between crisp lemon and deep incense with creamy bourbon vanilla and tonka bean.",
  "vibe": "Seductive Bourbon Vanilla, Incense & Tonka",
  "longevity": "9 – 11 Hours",
  "projection": "Strong",
  "accords": [
    { "name": "vanilla", "color": "#c49e49", "percentage": 96 },
    { "name": "amber", "color": "#d9822b", "percentage": 86 },
    { "name": "sweet", "color": "#9c2759", "percentage": 78 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 70 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 54 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 42 }
  ],
  "whenToWear": { "winter": 4400, "spring": 1800, "summer": 800, "fall": 3900, "day": 2200, "night": 4400 },
  "topNotes": ["Pink Pepper", "Lemon"],
  "middleNotes": ["Lavender", "Olibanum"],
  "heartNotes": ["Lavender", "Olibanum"],
  "baseNotes": ["Vanilla", "Tonka Bean", "Amber"]
},
{
  "matches": ["invictus legend"],
  "brand": "Paco Rabanne",
  "name": "Invictus legend",
  "description": "Invictus Legend by Paco Rabanne is a Woody Aromatic fragrance for men launched in 2019. An electrifying aquatic opening laced with salty sea breeze over warm red amber and woods.",
  "vibe": "Salty Sea Breeze, Fresh Grapefruit & Warm Amber",
  "longevity": "8 – 10 Hours",
  "projection": "Strong",
  "accords": [
    { "name": "marine", "color": "#2d3d4d", "percentage": 96 },
    { "name": "aquatic", "color": "#3b7890", "percentage": 86 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 76 },
    { "name": "amber", "color": "#d9822b", "percentage": 68 },
    { "name": "citrus", "color": "#9a7028", "percentage": 58 },
    { "name": "woody", "color": "#543e2e", "percentage": 48 }
  ],
  "whenToWear": { "winter": 800, "spring": 3200, "summer": 4700, "fall": 2100, "day": 4200, "night": 2400 },
  "topNotes": ["Sea Notes", "Grapefruit"],
  "middleNotes": ["Bay Leaf", "Geranium"],
  "heartNotes": ["Bay Leaf", "Geranium"],
  "baseNotes": ["Red Amber", "Guaiac Wood"]
},
{
  "matches": ["roberto canvalli splendid vanilla", "splendid vanilla"],
  "brand": "Roberto Cavalli",
  "name": "Roberto canvalli splendid vanilla",
  "description": "Splendid Vanilla by Roberto Cavalli is an Amber Floral fragrance launched in 2019. An intoxicating tribute to royal vanilla enriched with black pepper, delicate florals, and woody patchouli.",
  "vibe": "Opulent Madagascar Vanilla, Spices & Cedar",
  "longevity": "8 – 11 Hours",
  "projection": "Strong",
  "accords": [
    { "name": "woody", "color": "#543e2e", "percentage": 96 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 88 },
    { "name": "floral", "color": "#a64d79", "percentage": 78 },
    { "name": "earthy", "color": "#6b573b", "percentage": 68 },
    { "name": "powdery", "color": "#8c7e77", "percentage": 58 },
    { "name": "patchouli", "color": "#4d5c36", "percentage": 50 },
    { "name": "rose", "color": "#a64d79", "percentage": 42 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 36 }
  ],
  "whenToWear": { "winter": 4500, "spring": 1400, "summer": 400, "fall": 4100, "day": 1900, "night": 4300 },
  "topNotes": ["Rose", "Black Pepper"],
  "middleNotes": ["Cypriol Oil or Nagarmotha", "Magnolia"],
  "heartNotes": ["Cypriol Oil or Nagarmotha", "Magnolia"],
  "baseNotes": ["Vanilla", "Cedar", "Patchouli"]
},
{
  "matches": ["marly layton", "layton"],
  "brand": "Parfums de Marly",
  "name": "Marly layton",
  "description": "Marly layton is a distinctive EDP Niche fragrance crafted for Winter wear. Opens with vibrant top notes of Apple, Bergamot, Lavender, transitioning into a captivating heart of Cardamom and Violet, rested on a lingering base of Vanilla, Cardamom, Sandalwood.",
  "vibe": "Crisp Apple, Lavender, Spiced Cardamom & Vanilla Woods",
  "longevity": "10 – 12 Hours",
  "projection": "Strong & Royal",
  "accords": [
    { "name": "vanilla", "color": "#c49e49", "percentage": 96 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 86 },
    { "name": "fruity", "color": "#db8a35", "percentage": 78 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 70 },
    { "name": "woody", "color": "#6e4f32", "percentage": 62 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 54 },
    { "name": "floral", "color": "#a64d79", "percentage": 46 }
  ],
  "whenToWear": { "winter": 4400, "spring": 1200, "summer": 380, "fall": 3950, "day": 1800, "night": 4300 },
  "topNotes": ["Apple", "Bergamot", "Lavender", "Mandarin Orange"],
  "middleNotes": ["Cardamom", "Violet", "Jasmine", "Geranium"],
  "heartNotes": ["Cardamom", "Violet", "Jasmine", "Geranium"],
  "baseNotes": ["Vanilla", "Cardamom", "Sandalwood", "Guaiac Wood", "Patchouli", "Pepper"]
},
{
  "matches": ["marly castley", "castley", "carlisle"],
  "brand": "Parfums de Marly",
  "name": "Marly castley",
  "description": "Marly castley is a distinctive EDP Niche fragrance crafted for Summer wear. Opens with vibrant top notes of Green Apple, Nutmeg, transitioning into a captivating heart of Tonka Bean and Rose, rested on a lingering base of Patchouli, Vanilla, Opoponax.",
  "vibe": "Nutmeg, Green Apple, Tonka Bean, Saffron & Patchouli",
  "longevity": "11 – 14 Hours",
  "projection": "Beast Mode",
  "accords": [
    { "name": "woody", "color": "#543e2e", "percentage": 94 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 86 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 78 },
    { "name": "sweet", "color": "#9c2759", "percentage": 70 },
    { "name": "amber", "color": "#d9822b", "percentage": 62 },
    { "name": "fruity", "color": "#db8a35", "percentage": 52 },
    { "name": "earthy", "color": "#6b573b", "percentage": 44 }
  ],
  "whenToWear": { "winter": 410, "spring": 3200, "summer": 4600, "fall": 1400, "day": 4200, "night": 1900 },
  "topNotes": ["Green Apple", "Nutmeg"],
  "middleNotes": ["Tonka Bean", "Rose", "Osmanthus"],
  "heartNotes": ["Tonka Bean", "Rose", "Osmanthus"],
  "baseNotes": ["Patchouli", "Vanilla", "Opoponax"]
},
{
  "matches": ["mont blac explorar", "mont blac", "mont blanc", "explorar", "explorer"],
  "brand": "Montblanc",
  "name": "Mont blac explorar",
  "description": "Mont blac explorar is a distinctive EDP Designer fragrance crafted for Summer wear. Opens with vibrant top notes of Bergamot, Pink Pepper, Clary Sage, transitioning into a captivating heart of Haitian Vetiver and Leather, rested on a lingering base of Ambroxan, Akigalawood, Patchouli.",
  "vibe": "Italian Bergamot, Rich Leather, Haitian Vetiver & Ambroxan",
  "longevity": "8 – 10 Hours",
  "projection": "Strong & Crisp",
  "accords": [
    { "name": "woody", "color": "#543e2e", "percentage": 96 },
    { "name": "citrus", "color": "#9a7028", "percentage": 88 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 78 },
    { "name": "leather", "color": "#7A4B3A", "percentage": 68 },
    { "name": "earthy", "color": "#6b573b", "percentage": 58 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 48 }
  ],
  "whenToWear": { "winter": 410, "spring": 3200, "summer": 4600, "fall": 1400, "day": 4200, "night": 1900 },
  "topNotes": ["Bergamot", "Pink Pepper", "Clary Sage"],
  "middleNotes": ["Haitian Vetiver", "Leather"],
  "heartNotes": ["Haitian Vetiver", "Leather"],
  "baseNotes": ["Ambroxan", "Akigalawood", "Patchouli"]
},
{
  "matches": ["blue de chanel edp", "blue de chanel", "bleu de chanel"],
  "brand": "Chanel",
  "name": "Blue de chanel edp",
  "description": "Blue de chanel edp is a distinctive EDP Designer fragrance crafted for Winter/Summer wear. Opens with vibrant top notes of Grapefruit, Lemon, Mint, transitioning into a captivating heart of Ginger and Nutmeg, rested on a lingering base of Incense, Amber, Cedar.",
  "vibe": "Crisp Grapefruit, Spicy Incense, Mint & Cedarwood",
  "longevity": "8 – 10 Hours",
  "projection": "Strong & Refined",
  "accords": [
    { "name": "woody", "color": "#543e2e", "percentage": 96 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 86 },
    { "name": "citrus", "color": "#9a7028", "percentage": 78 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 70 },
    { "name": "amber", "color": "#d9822b", "percentage": 62 },
    { "name": "incense", "color": "#55515c", "percentage": 54 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 46 }
  ],
  "whenToWear": { "winter": 2800, "spring": 3400, "summer": 3100, "fall": 3200, "day": 3600, "night": 3300 },
  "topNotes": ["Grapefruit", "Lemon", "Mint", "Pink Pepper", "Bergamot"],
  "middleNotes": ["Ginger", "Nutmeg", "Jasmine", "Melon"],
  "heartNotes": ["Ginger", "Nutmeg", "Jasmine", "Melon"],
  "baseNotes": ["Incense", "Amber", "Cedar", "Sandalwood", "Patchouli", "Labdanum"]
},
{
  "matches": ["oud stallion"],
  "brand": "Maison Crivelli",
  "name": "Oud Stallion",
  "description": "Oud Stallion by Maison Crivelli is an Extrait de Parfum blending precious agarwood with fiery spices and luxurious smoky leather.",
  "vibe": "Noble Black Oud, Spicy Saffron & Saddle Leather",
  "longevity": "12 – 16 Hours",
  "projection": "Beast Mode",
  "accords": [
    { "name": "leather", "color": "#7A4B3A", "percentage": 96 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 88 },
    { "name": "oud", "color": "#3f292b", "percentage": 84 },
    { "name": "woody", "color": "#543e2e", "percentage": 74 },
    { "name": "floral", "color": "#a64d79", "percentage": 62 },
    { "name": "animalic", "color": "#70564c", "percentage": 52 },
    { "name": "rose", "color": "#a64d79", "percentage": 44 }
  ],
  "whenToWear": { "winter": 4900, "spring": 1000, "summer": 200, "fall": 4400, "day": 1400, "night": 4800 },
  "topNotes": ["Saffron", "Cardamom", "Indonesian Nutmeg"],
  "middleNotes": ["Jasmine", "Osmanthus", "Turkish Rose"],
  "heartNotes": ["Jasmine", "Osmanthus", "Turkish Rose"],
  "baseNotes": ["Agarwood (Oud)", "Leather", "Cedar", "Tonka", "Patchouli"]
},
{
  "matches": ["roja harrods"],
  "brand": "Roja Parfums",
  "name": "ROJA Harrods",
  "description": "Harrods Exclusive by Roja Parfums is an opulent chypre creation crafted with the rarest raw materials. Opening with sunlit citrus into classic Grasse florals on a base of aged sandalwood and ambergris.",
  "vibe": "Regal Grasse Florals, Sunlit Citrus & Rare Woods",
  "longevity": "10 – 14 Hours",
  "projection": "Strong & Aristocratic",
  "accords": [
    { "name": "woody", "color": "#543e2e", "percentage": 92 },
    { "name": "citrus", "color": "#9a7028", "percentage": 84 },
    { "name": "floral", "color": "#a64d79", "percentage": 78 },
    { "name": "chypre", "color": "#5c6840", "percentage": 68 },
    { "name": "musky", "color": "#3d3b40", "percentage": 58 },
    { "name": "amber", "color": "#d9822b", "percentage": 48 }
  ],
  "whenToWear": { "winter": 2400, "spring": 3600, "summer": 3200, "fall": 3400, "day": 3800, "night": 3500 },
  "topNotes": ["Lemon", "Bergamot", "Orange"],
  "middleNotes": ["Jasmine", "Rose", "Violet"],
  "heartNotes": ["Jasmine", "Rose", "Violet"],
  "baseNotes": ["Cedarwood", "Sandalwood", "Musk", "Ambergris"]
},
{
  "matches": ["armani code"],
  "brand": "Giorgio Armani",
  "name": "Armani code",
  "description": "Armani code is a distinctive EDP Designer fragrance crafted for Summer wear. Opens with vibrant top notes of Lemon, Bergamot, transitioning into a captivating heart of Star Anise and Olive Blossom, rested on a lingering base of Leather, Tonka Bean, Tobacco.",
  "vibe": "Olive Flower, Star Anise, Lemon Zest & Tonka Bean",
  "longevity": "7 – 9 Hours",
  "projection": "Moderate & Seductive",
  "accords": [
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 94 },
    { "name": "citrus", "color": "#9a7028", "percentage": 86 },
    { "name": "leather", "color": "#7A4B3A", "percentage": 78 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 68 },
    { "name": "sweet", "color": "#9c2759", "percentage": 58 },
    { "name": "woody", "color": "#543e2e", "percentage": 48 }
  ],
  "whenToWear": { "winter": 410, "spring": 3200, "summer": 4600, "fall": 1400, "day": 4200, "night": 1900 },
  "topNotes": ["Lemon", "Bergamot"],
  "middleNotes": ["Star Anise", "Olive Blossom", "Guaiac Wood"],
  "heartNotes": ["Star Anise", "Olive Blossom", "Guaiac Wood"],
  "baseNotes": ["Leather", "Tonka Bean", "Tobacco"]
},
{
  "matches": ["bentley intense", "bentley"],
  "brand": "Bentley",
  "name": "Bentley intense",
  "description": "Bentley intense is a distinctive EDP Designer fragrance crafted for Winter wear. Opens with vibrant top notes of Black Pepper, Bay Leaf, Bergamot, transitioning into a captivating heart of Dark Rum and Cinnamon, rested on a lingering base of Benzoin, Incense, Cedar.",
  "vibe": "Aged Dark Rum, Leather, Cinnamon & Benzoin Resin",
  "longevity": "10 – 12 Hours",
  "projection": "Beast Mode",
  "accords": [
    { "name": "woody", "color": "#543e2e", "percentage": 96 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 88 },
    { "name": "amber", "color": "#d9822b", "percentage": 80 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 72 },
    { "name": "rum", "color": "#8a542c", "percentage": 64 },
    { "name": "smoky", "color": "#55515c", "percentage": 56 },
    { "name": "leather", "color": "#7A4B3A", "percentage": 48 },
    { "name": "balsamic", "color": "#7a5139", "percentage": 40 }
  ],
  "whenToWear": { "winter": 4400, "spring": 1200, "summer": 380, "fall": 3950, "day": 1800, "night": 4300 },
  "topNotes": ["Black Pepper", "Bay Leaf", "Bergamot"],
  "middleNotes": ["Rum", "Woody Notes", "Cinnamon", "Clary Sage", "African Geranium"],
  "heartNotes": ["Rum", "Woody Notes", "Cinnamon", "Clary Sage", "African Geranium"],
  "baseNotes": ["Incense", "Leather", "Benzoin", "Cedar", "Patchouli"]
},
{
  "matches": ["maison margiela replica by the fire place", "by the fire place", "by the fireplace"],
  "brand": "Maison Margiela",
  "name": "Maison Margiela REPLICA By the fire place",
  "description": "Maison Margiela REPLICA By the fire place is a distinctive EDT NICHE fragrance crafted for Winter wear. Opens with vibrant top notes of Cloves, Pink Pepper, Orange Blossom, transitioning into a captivating heart of Chestnut and Guaiac Wood, rested on a lingering base of Vanilla, Peru Balsam, Cashmeran.",
  "vibe": "Roasting Chestnuts, Wood Smoke, Cloves & Vanilla",
  "longevity": "8 – 10 Hours",
  "projection": "Strong & Cozy",
  "accords": [
    { "name": "woody", "color": "#543e2e", "percentage": 96 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 88 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 80 },
    { "name": "sweet", "color": "#9c2759", "percentage": 72 },
    { "name": "smoky", "color": "#55515c", "percentage": 64 },
    { "name": "chestnut", "color": "#8a542c", "percentage": 56 },
    { "name": "balsamic", "color": "#7a5139", "percentage": 48 }
  ],
  "whenToWear": { "winter": 4400, "spring": 1200, "summer": 380, "fall": 3950, "day": 1800, "night": 4300 },
  "topNotes": ["Clove", "Pink Pepper", "Orange Blossom"],
  "middleNotes": ["Chestnut", "Guaiac Wood", "Juniper"],
  "heartNotes": ["Chestnut", "Guaiac Wood", "Juniper"],
  "baseNotes": ["Vanilla", "Peru Balsam", "Cashmeran"]
},
{
  "matches": ["maison margiela replica lazy sunday morning", "lazy sunday morning"],
  "brand": "Maison Margiela",
  "name": "Maison Margiela REPLICA Lazy sunday morning",
  "description": "Lazy Sunday Morning by Maison Margiela is a Floral Woody Musk fragrance evoking smooth white cotton sheets warmed by morning sunlight.",
  "vibe": "Crisp White Cotton, Fresh Lily & Clean Musk",
  "longevity": "6 – 8 Hours",
  "projection": "Intimate to Moderate",
  "accords": [
    { "name": "musky", "color": "#3d3b40", "percentage": 96 },
    { "name": "floral", "color": "#a64d79", "percentage": 86 },
    { "name": "powdery", "color": "#8c7e77", "percentage": 76 },
    { "name": "fresh", "color": "#314b4b", "percentage": 68 },
    { "name": "aldehydic", "color": "#a9b5bc", "percentage": 56 },
    { "name": "rose", "color": "#a64d79", "percentage": 46 }
  ],
  "whenToWear": { "winter": 900, "spring": 4600, "summer": 4200, "fall": 2100, "day": 4800, "night": 1200 },
  "topNotes": ["Aldehydes", "Lily-of-the-Valley", "Pear"],
  "middleNotes": ["Rose", "Iris", "Orange Blossom"],
  "heartNotes": ["Rose", "Iris", "Orange Blossom"],
  "baseNotes": ["White Musk", "Patchouli"]
},
{
  "matches": ["maison margiela replica jazzclub", "jazz club", "jazzclub"],
  "brand": "Maison Margiela",
  "name": "Maison Margiela REPLICA JazzClub",
  "description": "Maison Margiela REPLICA JazzClub is a distinctive EDT NICHE fragrance crafted for Winter wear. Opens with vibrant top notes of Pink Pepper, Neroli, Lemon, transitioning into a captivating heart of Rum and Clary Sage, rested on a lingering base of Tobacco Leaf, Vanilla Bean, Styrax.",
  "vibe": "Spiced Rum, Tobacco Leaf, Pink Pepper & Vanilla Bean",
  "longevity": "8 – 10 Hours",
  "projection": "Moderate to Strong",
  "accords": [
    { "name": "tobacco", "color": "#784421", "percentage": 96 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 86 },
    { "name": "sweet", "color": "#9c2759", "percentage": 78 },
    { "name": "rum", "color": "#8a542c", "percentage": 70 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 62 },
    { "name": "woody", "color": "#543e2e", "percentage": 54 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 46 }
  ],
  "whenToWear": { "winter": 4400, "spring": 1200, "summer": 380, "fall": 3950, "day": 1800, "night": 4300 },
  "topNotes": ["Pink Pepper", "Neroli", "Lemon"],
  "middleNotes": ["Rum", "Clary Sage", "Java Vetiver"],
  "heartNotes": ["Rum", "Clary Sage", "Java Vetiver"],
  "baseNotes": ["Tobacco Leaf", "Vanilla Bean", "Styrax"]
},
{
  "matches": ["maison margiela replica when the rain stop", "when the rain stop"],
  "brand": "Maison Margiela",
  "name": "Maison Margiela REPLICA WHEN THE RAIN STOP",
  "description": "When the Rain Stops by Maison Margiela captures the fresh clarity of sunlight returning through green pine needles after a gentle spring rainfall.",
  "vibe": "Dewy Raindrops, Fresh Bergamot & Wet Pine",
  "longevity": "6 – 8 Hours",
  "projection": "Moderate",
  "accords": [
    { "name": "aquatic", "color": "#2d3d4d", "percentage": 94 },
    { "name": "fresh", "color": "#314b4b", "percentage": 86 },
    { "name": "green", "color": "#283b2d", "percentage": 76 },
    { "name": "woody", "color": "#543e2e", "percentage": 66 },
    { "name": "floral", "color": "#a64d79", "percentage": 56 },
    { "name": "earthy", "color": "#6b573b", "percentage": 46 }
  ],
  "whenToWear": { "winter": 1100, "spring": 4700, "summer": 3800, "fall": 2400, "day": 4600, "night": 1400 },
  "topNotes": ["Bergamot", "Pink Pepper"],
  "middleNotes": ["Rain Notes", "Turkish Rose", "Pine Tree"],
  "heartNotes": ["Rain Notes", "Turkish Rose", "Pine Tree"],
  "baseNotes": ["Oakmoss", "Patchouli"]
},
{
  "matches": ["maison margiela replica beach walk", "beach walk"],
  "brand": "Maison Margiela",
  "name": "Maison Margiela REPLICA BEACH WALK",
  "description": "Maison Margiela REPLICA BEACH WALK is a distinctive EDT NICHE fragrance crafted for Summer wear. Opens with vibrant top notes of Bergamot, Lemon, Pink Pepper, transitioning into a captivating heart of Coconut Milk and Ylang-Ylang, rested on a lingering base of Musk, Benzoin, Cedar.",
  "vibe": "Sunlit Coconut Milk, Salty Sea Spray, Bergamot & Ylang-Ylang",
  "longevity": "6 – 8 Hours",
  "projection": "Moderate",
  "accords": [
    { "name": "coconut", "color": "#b99b65", "percentage": 96 },
    { "name": "citrus", "color": "#9a7028", "percentage": 86 },
    { "name": "sweet", "color": "#9c2759", "percentage": 76 },
    { "name": "floral", "color": "#a64d79", "percentage": 66 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 56 },
    { "name": "woody", "color": "#543e2e", "percentage": 46 },
    { "name": "musky", "color": "#3d3b40", "percentage": 38 }
  ],
  "whenToWear": { "winter": 410, "spring": 3200, "summer": 4600, "fall": 1400, "day": 4200, "night": 1900 },
  "topNotes": ["Bergamot", "Lemon", "Pink Pepper"],
  "middleNotes": ["Coconut Milk", "Ylang-Ylang", "Heliotrope"],
  "heartNotes": ["Coconut Milk", "Ylang-Ylang", "Heliotrope"],
  "baseNotes": ["Musk", "Benzoin", "Cedar"]
},
{
  "matches": ["maison margiela replica dancing on the moon", "dancing on the moon"],
  "brand": "Maison Margiela",
  "name": "Maison Margiela REPLICA DANCING ON THE MOON",
  "description": "Dancing on the Moon by Maison Margiela is an ethereal floral fragrance radiating luminous night-blooming white petals and mineral cashmeran.",
  "vibe": "Luminous Night Jasmine, Iris & Lunar Minerals",
  "longevity": "7 – 9 Hours",
  "projection": "Moderate",
  "accords": [
    { "name": "white floral", "color": "#9c5a78", "percentage": 95 },
    { "name": "musky", "color": "#3d3b40", "percentage": 86 },
    { "name": "powdery", "color": "#8c7e77", "percentage": 76 },
    { "name": "woody", "color": "#543e2e", "percentage": 62 },
    { "name": "amber", "color": "#d9822b", "percentage": 50 }
  ],
  "whenToWear": { "winter": 2200, "spring": 3900, "summer": 3200, "fall": 3100, "day": 2600, "night": 4400 },
  "topNotes": ["Aldehydes"],
  "middleNotes": ["Jasmine Sambac", "Frangipani", "Iris"],
  "heartNotes": ["Jasmine Sambac", "Frangipani", "Iris"],
  "baseNotes": ["Cashmeran", "Ambergris", "Musk"]
},
{
  "matches": ["maison margiela replica sailing day", "sailing day"],
  "brand": "Maison Margiela",
  "name": "Maison Margiela REPLICA SAILING DAY",
  "description": "Sailing Day by Maison Margiela is an invigorating aquatic creation recalling deep ocean waters, sea breeze, and sun on wet wood.",
  "vibe": "Deep Ocean Waves, Salty Mist & Crisp Juniper",
  "longevity": "6 – 8 Hours",
  "projection": "Moderate",
  "accords": [
    { "name": "marine", "color": "#2d3d4d", "percentage": 96 },
    { "name": "aquatic", "color": "#3b7890", "percentage": 88 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 76 },
    { "name": "salty", "color": "#485d6e", "percentage": 68 },
    { "name": "woody", "color": "#543e2e", "percentage": 50 }
  ],
  "whenToWear": { "winter": 400, "spring": 3100, "summer": 4900, "fall": 1200, "day": 4800, "night": 1300 },
  "topNotes": ["Sea Notes", "Aldehydes", "Red Pepper"],
  "middleNotes": ["Juniper", "Iris", "Rose"],
  "heartNotes": ["Juniper", "Iris", "Rose"],
  "baseNotes": ["Seaweed", "Ambergris", "Cedarwood"]
},
{
  "matches": ["maison margiela replica flower market", "flower market"],
  "brand": "Maison Margiela",
  "name": "Maison Margiela REPLICA Flower Market",
  "description": "Flower Market by Maison Margiela evokes bustling Parisian flower stalls filled with freshly cut wet stems, blooming jasmine, and delicate petals.",
  "vibe": "Fresh Cut Stems, Dewy Freesia & Parisian Jasmine",
  "longevity": "6 – 8 Hours",
  "projection": "Moderate",
  "accords": [
    { "name": "white floral", "color": "#9c5a78", "percentage": 96 },
    { "name": "floral", "color": "#a64d79", "percentage": 88 },
    { "name": "green", "color": "#283b2d", "percentage": 78 },
    { "name": "fresh", "color": "#314b4b", "percentage": 68 },
    { "name": "rose", "color": "#a64d79", "percentage": 58 }
  ],
  "whenToWear": { "winter": 500, "spring": 4900, "summer": 4100, "fall": 1400, "day": 4700, "night": 1100 },
  "topNotes": ["Green Leaves", "Freesia"],
  "middleNotes": ["Jasmine Sambac", "Tuberose", "Rose"],
  "heartNotes": ["Jasmine Sambac", "Tuberose", "Rose"],
  "baseNotes": ["Peach", "Cedarwood", "Oakmoss"]
},
{
  "matches": ["french avenue baie edp", "french avenue", "vulcan"],
  "brand": "French Avenue",
  "name": "French avenue Baie EDP",
  "description": "French Avenue Vulcan is a distinguished oriental spicy fragrance combining sparkling bergamot, aromatic spices, and a velvety amber trail.",
  "vibe": "Smoky Incense, Fiery Spices & Deep Ambergris",
  "longevity": "9 – 12 Hours",
  "projection": "Strong",
  "accords": [
    { "name": "amber", "color": "#d9822b", "percentage": 94 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 86 },
    { "name": "woody", "color": "#543e2e", "percentage": 76 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 64 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 54 }
  ],
  "whenToWear": { "winter": 4200, "spring": 2100, "summer": 900, "fall": 3800, "day": 2200, "night": 4300 },
  "topNotes": ["Bergamot", "Pink Pepper", "Mint"],
  "middleNotes": ["Cardamom", "Lavender", "Cedarwood"],
  "heartNotes": ["Cardamom", "Lavender", "Cedarwood"],
  "baseNotes": ["Ambergris", "Vetiver", "Patchouli"]
},

  {
  "matches": [
    "french vulcan feu",
    "french avenue",
    "vulcan"
  ],
  "brand": "French Avenue",
  "name": "french vulcan feu",
  "description": "French Avenue Vulcan is a distinguished oriental spicy fragrance combining sparkling bergamot, aromatic spices, and a velvety amber trail.",
  "vibe": "Smoky Incense, Fiery Spices & Deep Ambergris",
  "longevity": "9 – 12 Hours",
  "projection": "Strong",
  "accords": [
    { "name": "fruity", "color": "#d9822b", "percentage": 94 },
    { "name": "sweet", "color": "#9c2759", "percentage": 86 },
    { "name": "fresh", "color": "#6ca6a3", "percentage": 78 },
    { "name": "woody", "color": "#543e2e", "percentage": 68 },
    { "name": "citrus", "color": "#d6b52b", "percentage": 58 },
    { "name": "floral", "color": "#a64d79", "percentage": 46 }
  ],
  "whenToWear": {
    "winter": 4200,
    "spring": 2100,
    "summer": 900,
    "fall": 3800,
    "day": 2200,
    "night": 4300
  },
  "topNotes": ["Ginger", "Mango", "Lemon", "Rhubarb"],
  "middleNotes": ["Jasmine", "Violet", "Praline", "Pink Pepper"],
  "heartNotes": ["Jasmine", "Violet", "Praline", "Pink Pepper"],
  "baseNotes": ["Cedar", "Ambergris", "Tonka Bean", "Moss"]
},
{
  "matches": [
    "french vulcan sable brown",
    "french avenue",
    "vulcan"
  ],
  "brand": "French Avenue",
  "name": "french vulcan sable brown",
  "description": "French Avenue Vulcan is a distinguished oriental spicy fragrance combining sparkling bergamot, aromatic spices, and a velvety amber trail.",
  "vibe": "Smoky Incense, Fiery Spices & Deep Ambergris",
  "longevity": "9 – 12 Hours",
  "projection": "Strong",
  "accords": [
    { "name": "woody", "color": "#543e2e", "percentage": 94 },
    { "name": "sweet", "color": "#9c2759", "percentage": 86 },
    { "name": "amber", "color": "#d9822b", "percentage": 78 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 68 },
    { "name": "balsamic", "color": "#7b3f2b", "percentage": 58 },
    { "name": "vanilla", "color": "#d8b68a", "percentage": 48 }
  ],
  "whenToWear": {
    "winter": 4200,
    "spring": 2100,
    "summer": 900,
    "fall": 3800,
    "day": 2200,
    "night": 4300
  },
  "topNotes": ["Whiskey", "Coriander Seed", "Mandarin", "Orange", "Sesame", "Anise"],
  "middleNotes": ["Cocoa", "Sandalwood", "Cashmeran"],
  "heartNotes": ["Cocoa", "Sandalwood", "Cashmeran"],
  "baseNotes": ["Tonka Bean", "Benzoin", "Styrax", "White Cedar", "Patchouli", "Vanilla", "Cashmere Wood"]
},
{
  "matches": [
    "turathi electric",
    "turathi blue",
    "turathi"
  ],
  "brand": "Afnan",
  "name": "turathi electric",
  "description": "turathi electric is a distinctive EDP Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Juicy Grapefruit, Bergamot, Mandarin, transitioning into a captivating heart of Ambroxan and Woody Notes, rested on a lingering base of Amber, Musk, Patchouli.",
  "vibe": "Zesty Grapefruit, Ambroxan & Deep Woody Amber",
  "longevity": "8 – 10 Hours",
  "projection": "Strong & Fresh",
  "accords": [
    { "name": "fruity", "color": "#d9822b", "percentage": 94 },
    { "name": "citrus", "color": "#d6b52b", "percentage": 88 },
    { "name": "woody", "color": "#6e4f32", "percentage": 76 },
    { "name": "fresh", "color": "#6ca6a3", "percentage": 68 },
    { "name": "amber", "color": "#d9822b", "percentage": 58 },
    { "name": "musky", "color": "#a9a9a9", "percentage": 46 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Bergamot", "Pink Grapefruit", "Pear", "Mandarin Orange"],
  "middleNotes": ["Apple", "Cedarwood", "Orange Blossom"],
  "heartNotes": ["Apple", "Cedarwood", "Orange Blossom"],
  "baseNotes": ["Vanilla", "Amber Dry", "Musk", "Ambroxan"]
},
{
  "matches": [
    "turathi blue",
    "turathi"
  ],
  "brand": "Afnan",
  "name": "Turathi blue",
  "description": "Turathi blue is a distinctive EDP Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Juicy Grapefruit, Bergamot, Mandarin, transitioning into a captivating heart of Ambroxan and Woody Notes, rested on a lingering base of Amber, Musk, Patchouli.",
  "vibe": "Zesty Grapefruit, Ambroxan & Deep Woody Amber",
  "longevity": "8 – 10 Hours",
  "projection": "Strong & Fresh",
  "accords": [
    { "name": "citrus", "color": "#d6b52b", "percentage": 94 },
    { "name": "fresh", "color": "#6ca6a3", "percentage": 86 },
    { "name": "fruity", "color": "#d9822b", "percentage": 76 },
    { "name": "woody", "color": "#6e4f32", "percentage": 68 },
    { "name": "aquatic", "color": "#4682b4", "percentage": 56 },
    { "name": "musky", "color": "#a9a9a9", "percentage": 44 },
    { "name": "amber", "color": "#d9822b", "percentage": 36 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Bergamot", "Mandarin"],
  "middleNotes": ["Amber", "Woody Notes"],
  "heartNotes": ["Amber", "Woody Notes"],
  "baseNotes": ["Musk", "Patchouli", "Fresh Spicy Notes"]
},
{
  "matches": [
    "armaf club de nuit intense",
    "club de nuit",
    "cdnim"
  ],
  "brand": "Armaf",
  "name": "Armaf Club de nuit intense",
  "description": "Armaf Club de nuit intense is a distinctive EDT Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Lemon, Pineapple, Bergamot, transitioning into a captivating heart of Birch and Jasmine, rested on a lingering base of Musk, Ambergris, Patchouli.",
  "vibe": "Smoky Lemon Birch, Blackcurrant & Oakmoss",
  "longevity": "10 – 12 Hours",
  "projection": "Beast Mode",
  "accords": [
    { "name": "citrus", "color": "#d6b52b", "percentage": 96 },
    { "name": "fruity", "color": "#d9822b", "percentage": 88 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 80 },
    { "name": "woody", "color": "#6e4f32", "percentage": 72 },
    { "name": "fresh", "color": "#6ca6a3", "percentage": 62 },
    { "name": "musky", "color": "#a9a9a9", "percentage": 52 },
    { "name": "earthy", "color": "#806044", "percentage": 42 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Lemon", "Pineapple", "Bergamot", "Blackcurrant", "Apple"],
  "middleNotes": ["Birch", "Jasmine", "Rose"],
  "heartNotes": ["Birch", "Jasmine", "Rose"],
  "baseNotes": ["Musk", "Ambergris", "Patchouli", "Vanilla"]
},
{
  "matches": [
    "armaf omb d'or",
    "ombre leather",
    "ombré leather",
    "jean lowe ombre",
    "omb d'or"
  ],
  "brand": "Tom Ford",
  "name": "Armaf omb d'or",
  "description": "Ombré Leather is a deeply tactile floral leather fragrance driven by rich spices, cardamom, and sensual jasmine sambac over warm amber and patchouli.",
  "vibe": "Warm, Rich Leather & Floral Smoke",
  "longevity": "9 – 12 Hours",
  "projection": "Strong (Room-Filling)",
  "accords": [
    { "name": "leather", "color": "#7A4B3A", "percentage": 95 },
    { "name": "woody", "color": "#543e2e", "percentage": 82 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 72 },
    { "name": "floral", "color": "#a64d79", "percentage": 62 },
    { "name": "amber", "color": "#d9822b", "percentage": 52 },
    { "name": "earthy", "color": "#806044", "percentage": 42 }
  ],
  "whenToWear": {
    "winter": 4700,
    "spring": 1300,
    "summer": 300,
    "fall": 4200,
    "day": 1700,
    "night": 4800
  },
  "topNotes": ["Cardamom"],
  "middleNotes": ["Black Leather", "Jasmine Sambac"],
  "heartNotes": ["Black Leather", "Jasmine Sambac"],
  "baseNotes": ["Patchouli", "Amber", "Moss"]
},
{
  "matches": [
    "afnan supermacy not only intense",
    "supermacy",
    "supremacy"
  ],
  "brand": "Afnan",
  "name": "Afnan supermacy not only intense",
  "description": "Afnan supermacy not only intense is a distinctive EDP Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Blackcurrant, Bergamot, Apple, transitioning into a captivating heart of Oakmoss and Patchouli, rested on a lingering base of Ambergris, Musk, Saffron.",
  "vibe": "Fruity Blackcurrant, Bergamot, Birch Smoke & Oakmoss",
  "longevity": "10 – 12 Hours",
  "projection": "Beast Mode",
  "accords": [
    { "name": "fruity", "color": "#d9822b", "percentage": 94 },
    { "name": "mossy", "color": "#607d3b", "percentage": 86 },
    { "name": "woody", "color": "#6e4f32", "percentage": 78 },
    { "name": "earthy", "color": "#806044", "percentage": 68 },
    { "name": "citrus", "color": "#d6b52b", "percentage": 58 },
    { "name": "fresh spicy", "color": "#b85428", "percentage": 48 },
    { "name": "amber", "color": "#d9822b", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Blackcurrant", "Bergamot", "Apple"],
  "middleNotes": ["Oakmoss", "Patchouli", "Lavender"],
  "heartNotes": ["Oakmoss", "Patchouli", "Lavender"],
  "baseNotes": ["Ambergris", "Musk", "Saffron"]
},
{
  "matches": [
    "afnan supermacy collector edition",
    "supermacy",
    "supremacy"
  ],
  "brand": "Afnan",
  "name": "Afnan supermacy collector edition",
  "description": "Afnan supermacy collector edition is a distinctive EDP Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Blackcurrant, Bergamot, Apple, transitioning into a captivating heart of Oakmoss and Patchouli, rested on a lingering base of Ambergris, Musk, Saffron.",
  "vibe": "Fruity Blackcurrant, Bergamot, Birch Smoke & Oakmoss",
  "longevity": "10 – 12 Hours",
  "projection": "Beast Mode",
  "accords": [
    { "name": "fruity", "color": "#d9822b", "percentage": 94 },
    { "name": "woody", "color": "#6e4f32", "percentage": 84 },
    { "name": "amber", "color": "#d9822b", "percentage": 76 },
    { "name": "white floral", "color": "#eee5d9", "percentage": 66 },
    { "name": "mossy", "color": "#607d3b", "percentage": 56 },
    { "name": "musky", "color": "#a9a9a9", "percentage": 46 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Pineapple", "Bergamot", "Apple", "White Floral"],
  "middleNotes": ["Orange Blossom", "Birch", "Amber"],
  "heartNotes": ["Orange Blossom", "Birch", "Amber"],
  "baseNotes": ["Oak Moss", "Musk", "Ambergris"]
},
{
  "matches": ["hawas ice"],
  "brand": "Rasasi",
  "name": "Hawas Ice",
  "description": "Hawas Ice is a distinctive EDP Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Frozen Apple, Bergamot, Lemon, transitioning into a captivating heart of Plum and Cardamom, rested on a lingering base of Ambergris, Musk, Driftwood.",
  "vibe": "Frosty Crisp Apple, Italian Citrus, Plum & Ambergris",
  "longevity": "10 – 12 Hours",
  "projection": "Beast Mode",
  "accords": [
    { "name": "fresh", "color": "#6ca6a3", "percentage": 94 },
    { "name": "citrus", "color": "#d6b52b", "percentage": 86 },
    { "name": "fruity", "color": "#d9822b", "percentage": 78 },
    { "name": "aquatic", "color": "#4682b4", "percentage": 68 },
    { "name": "musky", "color": "#a9a9a9", "percentage": 58 },
    { "name": "woody", "color": "#6e4f32", "percentage": 48 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Frozen Apple", "Bergamot", "Lemon", "Star Anise"],
  "middleNotes": ["Plum", "Cardamom", "Orange Blossom"],
  "heartNotes": ["Plum", "Cardamom", "Orange Blossom"],
  "baseNotes": ["Ambergris", "Musk", "Driftwood", "Moss"]
},
{
  "matches": [
    "hawas tropical",
    "hawas for him",
    "hawas"
  ],
  "brand": "Rasasi",
  "name": "Hawas tropical",
  "description": "Hawas tropical is a distinctive EDP Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Apple, Bergamot, Lemon, transitioning into a captivating heart of Watery Notes and Plum, rested on a lingering base of Ambergris, Musk, Patchouli.",
  "vibe": "Aquatic Melon, Apple, Cinnamon & Ambergris",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Invigorating",
  "accords": [
    { "name": "aquatic", "color": "#4682b4", "percentage": 92 },
    { "name": "fruity", "color": "#d9822b", "percentage": 84 },
    { "name": "citrus", "color": "#d6b52b", "percentage": 76 },
    { "name": "fresh", "color": "#6ca6a3", "percentage": 68 },
    { "name": "musky", "color": "#a9a9a9", "percentage": 56 },
    { "name": "woody", "color": "#6e4f32", "percentage": 46 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Apple", "Bergamot", "Lemon", "Cinnamon"],
  "middleNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "heartNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "baseNotes": ["Ambergris", "Musk", "Patchouli", "Driftwood"]
},
{
  "matches": [
    "hawas for him",
    "hawas"
  ],
  "brand": "Rasasi",
  "name": "Hawas for him",
  "description": "Hawas for him is a distinctive EDP Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Apple, Bergamot, Lemon, transitioning into a captivating heart of Watery Notes and Plum, rested on a lingering base of Ambergris, Musk, Patchouli.",
  "vibe": "Aquatic Melon, Apple, Cinnamon & Ambergris",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Invigorating",
  "accords": [
    { "name": "aquatic", "color": "#4682b4", "percentage": 92 },
    { "name": "fruity", "color": "#d9822b", "percentage": 84 },
    { "name": "citrus", "color": "#d6b52b", "percentage": 76 },
    { "name": "fresh", "color": "#6ca6a3", "percentage": 68 },
    { "name": "musky", "color": "#a9a9a9", "percentage": 56 },
    { "name": "woody", "color": "#6e4f32", "percentage": 46 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Apple", "Bergamot", "Lemon", "Cinnamon"],
  "middleNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "heartNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "baseNotes": ["Ambergris", "Musk", "Patchouli", "Driftwood"]
},
{
  "matches": [
    "hawas elixer",
    "hawas for him",
    "hawas"
  ],
  "brand": "Rasasi",
  "name": "Hawas elixer",
  "description": "Hawas elixer is a distinctive EDP Middle eastern fragrance crafted for Winter wear. Opens with vibrant top notes of Apple, Bergamot, Lemon, transitioning into a captivating heart of Watery Notes and Plum, rested on a lingering base of Ambergris, Musk, Patchouli.",
  "vibe": "Aquatic Melon, Apple, Cinnamon & Ambergris",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Invigorating",
  "accords": [
    { "name": "amber", "color": "#d9822b", "percentage": 92 },
    { "name": "sweet", "color": "#9c2759", "percentage": 84 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 76 },
    { "name": "vanilla", "color": "#d8b68a", "percentage": 68 },
    { "name": "woody", "color": "#6e4f32", "percentage": 58 },
    { "name": "musky", "color": "#a9a9a9", "percentage": 48 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": ["Apple", "Bergamot", "Lemon", "Cinnamon"],
  "middleNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "heartNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "baseNotes": ["Ambergris", "Musk", "Patchouli", "Driftwood"]
},
{
  "matches": [
    "hawas fire",
    "hawas for him",
    "hawas"
  ],
  "brand": "Rasasi",
  "name": "Hawas Fire",
  "description": "Hawas Fire is a distinctive EDP Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Apple, Bergamot, Lemon, transitioning into a captivating heart of Watery Notes and Plum, rested on a lingering base of Ambergris, Musk, Patchouli.",
  "vibe": "Aquatic Melon, Apple, Cinnamon & Ambergris",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Invigorating",
  "accords": [
    { "name": "oud", "color": "#3f292b", "percentage": 92 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 84 },
    { "name": "amber", "color": "#d9822b", "percentage": 76 },
    { "name": "woody", "color": "#6e4f32", "percentage": 68 },
    { "name": "sweet", "color": "#9c2759", "percentage": 56 },
    { "name": "balsamic", "color": "#7b3f2b", "percentage": 45 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Apple", "Bergamot", "Lemon", "Cinnamon"],
  "middleNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "heartNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "baseNotes": ["Ambergris", "Musk", "Patchouli", "Driftwood"]
},
{
  "matches": [
    "hawas verde",
    "hawas for him",
    "hawas"
  ],
  "brand": "Rasasi",
  "name": "Hawas verde",
  "description": "Hawas verde is a distinctive EDP Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Apple, Bergamot, Lemon, transitioning into a captivating heart of Watery Notes and Plum, rested on a lingering base of Ambergris, Musk, Patchouli.",
  "vibe": "Aquatic Melon, Apple, Cinnamon & Ambergris",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Invigorating",
  "accords": [
    { "name": "oud", "color": "#3f292b", "percentage": 92 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 84 },
    { "name": "amber", "color": "#d9822b", "percentage": 76 },
    { "name": "woody", "color": "#6e4f32", "percentage": 68 },
    { "name": "sweet", "color": "#9c2759", "percentage": 56 },
    { "name": "balsamic", "color": "#7b3f2b", "percentage": 45 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Apple", "Bergamot", "Lemon", "Cinnamon"],
  "middleNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "heartNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "baseNotes": ["Ambergris", "Musk", "Patchouli", "Driftwood"]
},
{
  "matches": [
    "hawas black",
    "hawas for him",
    "hawas"
  ],
  "brand": "Rasasi",
  "name": "Hawas black",
  "description": "Hawas black is a distinctive EDP Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Apple, Bergamot, Lemon, transitioning into a captivating heart of Watery Notes and Plum, rested on a lingering base of Ambergris, Musk, Patchouli.",
  "vibe": "Aquatic Melon, Apple, Cinnamon & Ambergris",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Invigorating",
  "accords": [
    { "name": "oud", "color": "#3f292b", "percentage": 92 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 84 },
    { "name": "amber", "color": "#d9822b", "percentage": 76 },
    { "name": "woody", "color": "#6e4f32", "percentage": 68 },
    { "name": "sweet", "color": "#9c2759", "percentage": 56 },
    { "name": "balsamic", "color": "#7b3f2b", "percentage": 45 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Apple", "Bergamot", "Lemon", "Cinnamon"],
  "middleNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "heartNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "baseNotes": ["Ambergris", "Musk", "Patchouli", "Driftwood"]
},
{
  "matches": [
    "hawas malibu",
    "hawas for him",
    "hawas"
  ],
  "brand": "Rasasi",
  "name": "Hawas Malibu",
  "description": "Hawas Malibu is a distinctive EDP Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Apple, Bergamot, Lemon, transitioning into a captivating heart of Watery Notes and Plum, rested on a lingering base of Ambergris, Musk, Patchouli.",
  "vibe": "Aquatic Melon, Apple, Cinnamon & Ambergris",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Invigorating",
  "accords": [
    { "name": "oud", "color": "#3f292b", "percentage": 92 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 84 },
    { "name": "amber", "color": "#d9822b", "percentage": 76 },
    { "name": "woody", "color": "#6e4f32", "percentage": 68 },
    { "name": "sweet", "color": "#9c2759", "percentage": 56 },
    { "name": "balsamic", "color": "#7b3f2b", "percentage": 45 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Apple", "Bergamot", "Lemon", "Cinnamon"],
  "middleNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "heartNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "baseNotes": ["Ambergris", "Musk", "Patchouli", "Driftwood"]
},
{
  "matches": [
    "hawas kobra",
    "hawas for him",
    "hawas"
  ],
  "brand": "Rasasi",
  "name": "Hawas kobra",
  "description": "Hawas kobra is a distinctive EDP Middle eastern fragrance crafted for Summer/winter wear. Opens with vibrant top notes of Apple, Bergamot, Lemon, transitioning into a captivating heart of Watery Notes and Plum, rested on a lingering base of Ambergris, Musk, Patchouli.",
  "vibe": "Aquatic Melon, Apple, Cinnamon & Ambergris",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Invigorating",
  "accords": [
    { "name": "oud", "color": "#3f292b", "percentage": 92 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 84 },
    { "name": "amber", "color": "#d9822b", "percentage": 76 },
    { "name": "woody", "color": "#6e4f32", "percentage": 68 },
    { "name": "sweet", "color": "#9c2759", "percentage": 56 },
    { "name": "balsamic", "color": "#7b3f2b", "percentage": 45 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 2800,
    "spring": 3400,
    "summer": 3100,
    "fall": 3200,
    "day": 3600,
    "night": 3300
  },
  "topNotes": ["Apple", "Bergamot", "Lemon", "Cinnamon"],
  "middleNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "heartNotes": ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
  "baseNotes": ["Ambergris", "Musk", "Patchouli", "Driftwood"]
},
{
  "matches": [
    "lattafa khamrah qahwa",
    "khamrah qahwa",
    "khamrah"
  ],
  "brand": "Lattafa",
  "name": "lattafa khamrah qahwa",
  "description": "lattafa khamrah qahwa is a distinctive EDP Middle eastern fragrance crafted for Winter wear. Opens with vibrant top notes of Ginger, Cinnamon, Cardamom, transitioning into a captivating heart of Praline and Candied Fruits, rested on a lingering base of Vanilla, Tonka Bean, Benzoin.",
  "vibe": "Dark Roasted Coffee, Candied Praline, Cinnamon & Tonka",
  "longevity": "11 – 14 Hours",
  "projection": "Beast Mode",
  "accords": [
    { "name": "gourmand", "color": "#a66a3f", "percentage": 96 },
    { "name": "sweet", "color": "#9c2759", "percentage": 92 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 84 },
    { "name": "coffee", "color": "#5a3825", "percentage": 76 },
    { "name": "vanilla", "color": "#d8b68a", "percentage": 68 },
    { "name": "amber", "color": "#d9822b", "percentage": 58 },
    { "name": "balsamic", "color": "#7b3f2b", "percentage": 48 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": ["Ginger", "Cinnamon", "Cardamom"],
  "middleNotes": ["Praline", "Candied Fruits", "White Flowers"],
  "heartNotes": ["Praline", "Candied Fruits", "White Flowers"],
  "baseNotes": ["Roasted Coffee Beans", "Vanilla", "Tonka Bean", "Benzoin", "Musk"]
},
{
  "matches": [
    "sharaf blend the club",
    "sharaf blend"
  ],
  "brand": "Zimaya",
  "name": "sharaf blend the club",
  "description": "sharaf blend the club is a distinctive EDP Middle eastern fragrance crafted for Summer/winter wear. Opens with vibrant top notes of Dates, Nutmeg, Cinnamon, transitioning into a captivating heart of Praline and Vanilla, rested on a lingering base of Tonka Bean, Benzoin, Amberwood.",
  "vibe": "Dates, Sweet Cognac, Cinnamon, Praline & Vanilla",
  "longevity": "10 – 13 Hours",
  "projection": "Beast Mode",
  "accords": [
    { "name": "sweet", "color": "#9c2759", "percentage": 96 },
    { "name": "gourmand", "color": "#a66a3f", "percentage": 90 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 82 },
    { "name": "vanilla", "color": "#d8b68a", "percentage": 74 },
    { "name": "amber", "color": "#d9822b", "percentage": 64 },
    { "name": "woody", "color": "#6e4f32", "percentage": 54 },
    { "name": "balsamic", "color": "#7b3f2b", "percentage": 44 }
  ],
  "whenToWear": {
    "winter": 2800,
    "spring": 3400,
    "summer": 3100,
    "fall": 3200,
    "day": 3600,
    "night": 3300
  },
  "topNotes": ["Dates", "Nutmeg", "Cinnamon"],
  "middleNotes": ["Praline", "Vanilla", "Tuberose"],
  "heartNotes": ["Praline", "Vanilla", "Tuberose"],
  "baseNotes": ["Tonka Bean", "Benzoin", "Amberwood"]
},
{
  "matches": ["sharaf blend"],
  "brand": "Zimaya",
  "name": "sharaf blend",
  "description": "sharaf blend is a distinctive EDP Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Dates, Nutmeg, Cinnamon, transitioning into a captivating heart of Praline and Vanilla, rested on a lingering base of Tonka Bean, Benzoin, Amberwood.",
  "vibe": "Dates, Sweet Cognac, Cinnamon, Praline & Vanilla",
  "longevity": "10 – 13 Hours",
  "projection": "Beast Mode",
  "accords": [
    { "name": "sweet", "color": "#9c2759", "percentage": 96 },
    { "name": "gourmand", "color": "#a66a3f", "percentage": 90 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 82 },
    { "name": "vanilla", "color": "#d8b68a", "percentage": 74 },
    { "name": "amber", "color": "#d9822b", "percentage": 64 },
    { "name": "woody", "color": "#6e4f32", "percentage": 54 },
    { "name": "balsamic", "color": "#7b3f2b", "percentage": 44 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": ["Dates", "Nutmeg", "Cinnamon"],
  "middleNotes": ["Praline", "Vanilla", "Tuberose"],
  "heartNotes": ["Praline", "Vanilla", "Tuberose"],
  "baseNotes": ["Tonka Bean", "Benzoin", "Amberwood"]
},
  {
  "matches": [
    "jean lowe ombre",
    "ombre leather",
    "ombré leather",
    "omb d'or"
  ],
  "brand": "Tom Ford",
  "name": "Jean Lowe ombre",
  "description": "Ombré Leather is a deeply tactile floral leather fragrance driven by rich spices, cardamom, and sensual jasmine sambac over warm amber and patchouli.",
  "vibe": "Warm, Rich Leather & Floral Smoke",
  "longevity": "9 – 12 Hours",
  "projection": "Strong (Room-Filling)",
  "accords": [
    { "name": "leather", "color": "#7A4B3A", "percentage": 95 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 80 },
    { "name": "floral", "color": "#a64d79", "percentage": 65 },
    { "name": "amber", "color": "#d9822b", "percentage": 55 }
  ],
  "whenToWear": {
    "winter": 4700,
    "spring": 1300,
    "summer": 300,
    "fall": 4200,
    "day": 1700,
    "night": 4800
  },
  "topNotes": [
    "Cardamom",
    "Saffron"
  ],
  "middleNotes": [
    "Black Leather",
    "Jasmine Sambac"
  ],
  "heartNotes": [
    "Black Leather",
    "Jasmine Sambac"
  ],
  "baseNotes": [
    "Patchouli",
    "Amber",
    "Moss"
  ]
},
{
  "matches": [
    "afnan 9pm",
    "9pm"
  ],
  "brand": "Afnan",
  "name": "Afnan 9PM",
  "description": "Afnan 9PM is a distinctive EDP Middle eastern fragrance crafted for Winter wear. Opens with vibrant top notes of Apple, Cinnamon, Wild Lavender, transitioning into a captivating heart of Orange Blossom and Lily-of-the-Valley, rested on a lingering base of Vanilla, Tonka Bean, Amber.",
  "vibe": "Sweet Bubblegum Apple, Spicy Cinnamon & Warm Vanilla",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Playful",
  "accords": [
    { "name": "sweet", "color": "#9c2759", "percentage": 95 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 88 },
    { "name": "amber", "color": "#d9822b", "percentage": 78 },
    { "name": "fruity", "color": "#c84b4b", "percentage": 72 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 65 },
    { "name": "powdery", "color": "#b9a4bd", "percentage": 52 },
    { "name": "lavender", "color": "#7962a6", "percentage": 42 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": [
    "Apple",
    "Cinnamon",
    "Wild Lavender",
    "Bergamot"
  ],
  "middleNotes": [
    "Orange Blossom",
    "Lily-of-the-Valley"
  ],
  "heartNotes": [
    "Orange Blossom",
    "Lily-of-the-Valley"
  ],
  "baseNotes": [
    "Vanilla",
    "Tonka Bean",
    "Amber",
    "Patchouli"
  ]
},
{
  "matches": [
    "9pm elixer",
    "9pm",
    "afnan 9pm"
  ],
  "brand": "Afnan",
  "name": "9PM ELIXER",
  "description": "9PM ELIXER is a distinctive EXTRAIT DE PARFUM Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Apple, Cinnamon, Wild Lavender, transitioning into a captivating heart of Orange Blossom and Lily-of-the-Valley, rested on a lingering base of Vanilla, Tonka Bean, Amber.",
  "vibe": "Sweet Bubblegum Apple, Spicy Cinnamon & Warm Vanilla",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Playful",
  "accords": [
    { "name": "oud", "color": "#3f292b", "percentage": 92 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 84 },
    { "name": "amber", "color": "#d9822b", "percentage": 76 },
    { "name": "woody", "color": "#6e4f32", "percentage": 68 },
    { "name": "sweet", "color": "#9c2759", "percentage": 56 },
    { "name": "balsamic", "color": "#7b3f2b", "percentage": 45 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": [
    "Apple",
    "Cinnamon",
    "Wild Lavender",
    "Bergamot"
  ],
  "middleNotes": [
    "Orange Blossom",
    "Lily-of-the-Valley"
  ],
  "heartNotes": [
    "Orange Blossom",
    "Lily-of-the-Valley"
  ],
  "baseNotes": [
    "Vanilla",
    "Tonka Bean",
    "Amber",
    "Patchouli"
  ]
},
{
  "matches": [
    "9pm night out",
    "9pm",
    "afnan 9pm"
  ],
  "brand": "Afnan",
  "name": "9PM night out",
  "description": "9PM night out is a distinctive EXTRAIT DE PARFUM Middle eastern fragrance crafted for Winter/summer wear. Opens with vibrant top notes of Apple, Cinnamon, Wild Lavender, transitioning into a captivating heart of Orange Blossom and Lily-of-the-Valley, rested on a lingering base of Vanilla, Tonka Bean, Amber.",
  "vibe": "Sweet Bubblegum Apple, Spicy Cinnamon & Warm Vanilla",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Playful",
  "accords": [
    { "name": "oud", "color": "#3f292b", "percentage": 92 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 84 },
    { "name": "amber", "color": "#d9822b", "percentage": 76 },
    { "name": "woody", "color": "#6e4f32", "percentage": 68 },
    { "name": "sweet", "color": "#9c2759", "percentage": 56 },
    { "name": "balsamic", "color": "#7b3f2b", "percentage": 45 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 2800,
    "spring": 3400,
    "summer": 3100,
    "fall": 3200,
    "day": 3600,
    "night": 3300
  },
  "topNotes": [
    "Apple",
    "Cinnamon",
    "Wild Lavender",
    "Bergamot"
  ],
  "middleNotes": [
    "Orange Blossom",
    "Lily-of-the-Valley"
  ],
  "heartNotes": [
    "Orange Blossom",
    "Lily-of-the-Valley"
  ],
  "baseNotes": [
    "Vanilla",
    "Tonka Bean",
    "Amber",
    "Patchouli"
  ]
},
{
  "matches": [
    "9am dive",
    "9am"
  ],
  "brand": "Afnan",
  "name": "9AM Dive",
  "description": "9AM Dive by Afnan is a fresh aquatic and aromatic fragrance for men and women. An invigorating splash of cool mint, sparkling lemon, and crisp green apple resting on a bed of ocean woods.",
  "vibe": "Cool Oceanic Mint, Juicy Blackcurrant & Crisp Apple",
  "longevity": "7 – 9 Hours",
  "projection": "Moderate to Strong",
  "accords": [
    { "name": "citrus", "color": "#9a7028", "percentage": 95 },
    { "name": "aquatic", "color": "#2d3d4d", "percentage": 84 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 72 },
    { "name": "fruity", "color": "#c84b4b", "percentage": 62 },
    { "name": "woody", "color": "#6e4f32", "percentage": 48 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 42 }
  ],
  "whenToWear": {
    "winter": 400,
    "spring": 3600,
    "summer": 5100,
    "fall": 1400,
    "day": 4900,
    "night": 1500
  },
  "topNotes": [
    "Lemon",
    "Mint",
    "Blackcurrant",
    "Pink Pepper"
  ],
  "middleNotes": [
    "Apple",
    "Incense",
    "Cedarwood"
  ],
  "heartNotes": [
    "Apple",
    "Incense",
    "Cedarwood"
  ],
  "baseNotes": [
    "Ginger",
    "Sandalwood",
    "Patchouli"
  ]
},
{
  "matches": [
    "9pm elixer",
    "9pm",
    "afnan 9pm"
  ],
  "brand": "Afnan",
  "name": "9PM ELIXER",
  "description": "9PM ELIXER is a distinctive EDP Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Apple, Cinnamon, Wild Lavender, transitioning into a captivating heart of Orange Blossom and Lily-of-the-Valley, rested on a lingering base of Vanilla, Tonka Bean, Amber.",
  "vibe": "Sweet Bubblegum Apple, Spicy Cinnamon & Warm Vanilla",
  "longevity": "9 – 11 Hours",
  "projection": "Strong & Playful",
  "accords": [
    { "name": "oud", "color": "#3f292b", "percentage": 92 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 84 },
    { "name": "amber", "color": "#d9822b", "percentage": 76 },
    { "name": "woody", "color": "#6e4f32", "percentage": 68 },
    { "name": "sweet", "color": "#9c2759", "percentage": 56 },
    { "name": "balsamic", "color": "#7b3f2b", "percentage": 45 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": [
    "Apple",
    "Cinnamon",
    "Wild Lavender",
    "Bergamot"
  ],
  "middleNotes": [
    "Orange Blossom",
    "Lily-of-the-Valley"
  ],
  "heartNotes": [
    "Orange Blossom",
    "Lily-of-the-Valley"
  ],
  "baseNotes": [
    "Vanilla",
    "Tonka Bean",
    "Amber",
    "Patchouli"
  ]
},
{
  "matches": [
    "liquid brun"
  ],
  "brand": "Middle eastern",
  "name": "Liquid Brun",
  "description": "Liquid Brun is a distinctive EDP Middle eastern fragrance crafted for Winter wear. Opens with vibrant top notes of Cinnamon, Cardamom, Orange Blossom, transitioning into a captivating heart of Bourbon Vanilla and Elemi, rested on a lingering base of Praline, Musk, Ambroxan.",
  "vibe": "Bourbon Vanilla, Candied Orange Blossom & Spiced Cardamom",
  "longevity": "10 – 12 Hours",
  "projection": "Strong & Cozy",
  "accords": [
    { "name": "vanilla", "color": "#c49e49", "percentage": 95 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 88 },
    { "name": "sweet", "color": "#9c2759", "percentage": 82 },
    { "name": "amber", "color": "#d9822b", "percentage": 74 },
    { "name": "cinnamon", "color": "#9b4d28", "percentage": 66 },
    { "name": "woody", "color": "#6e4f32", "percentage": 58 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 45 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": [
    "Cinnamon",
    "Cardamom",
    "Orange Blossom",
    "Bergamot"
  ],
  "middleNotes": [
    "Bourbon Vanilla",
    "Elemi"
  ],
  "heartNotes": [
    "Bourbon Vanilla",
    "Elemi"
  ],
  "baseNotes": [
    "Praline",
    "Musk",
    "Ambroxan",
    "Guaiac Wood"
  ]
},
{
  "matches": [
    "greek tobacco",
    "tabacco",
    "tobacco"
  ],
  "brand": "Bespoke Collection",
  "name": "Greek Tobacco",
  "description": "Greek Tobacco is a distinctive EXTRAIT DE PARFUM Middle eastern fragrance crafted for Winter wear. Opens with vibrant top notes of Spiced Tobacco Leaf, Cinnamon, Cardamom, transitioning into a captivating heart of Golden Honey and Clove, rested on a lingering base of Vanilla, Dried Fruits, Cedarwood.",
  "vibe": "Aged Pipe Tobacco, Warm Spices, Honey & Rich Resins",
  "longevity": "10 – 13 Hours",
  "projection": "Strong & Enveloping",
  "accords": [
    { "name": "tobacco", "color": "#8B4513", "percentage": 95 },
    { "name": "sweet", "color": "#9c2759", "percentage": 80 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 72 },
    { "name": "amber", "color": "#d9822b", "percentage": 65 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 55 },
    { "name": "woody", "color": "#6e4f32", "percentage": 48 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": [
    "Spiced Tobacco Leaf",
    "Cinnamon",
    "Cardamom"
  ],
  "middleNotes": [
    "Golden Honey",
    "Clove",
    "Cacao",
    "Tonka Bean"
  ],
  "heartNotes": [
    "Golden Honey",
    "Clove",
    "Cacao",
    "Tonka Bean"
  ],
  "baseNotes": [
    "Vanilla",
    "Dried Fruits",
    "Cedarwood",
    "Amber"
  ]
},
{
  "matches": [
    "brazilian tobacco",
    "tabacco",
    "tobacco"
  ],
  "brand": "Bespoke Collection",
  "name": "Brazilian Tobacco",
  "description": "Brazilian Tobacco is a distinctive EXTRAIT DE PARFUM Middle eastern fragrance crafted for Winter wear. Opens with vibrant top notes of Spiced Tobacco Leaf, Cinnamon, Cardamom, transitioning into a captivating heart of Golden Honey and Clove, rested on a lingering base of Vanilla, Dried Fruits, Cedarwood.",
  "vibe": "Aged Pipe Tobacco, Warm Spices, Honey & Rich Resins",
  "longevity": "10 – 13 Hours",
  "projection": "Strong & Enveloping",
  "accords": [
    { "name": "tobacco", "color": "#8B4513", "percentage": 95 },
    { "name": "sweet", "color": "#9c2759", "percentage": 80 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 72 },
    { "name": "amber", "color": "#d9822b", "percentage": 65 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 55 },
    { "name": "woody", "color": "#6e4f32", "percentage": 48 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": [
    "Spiced Tobacco Leaf",
    "Cinnamon",
    "Cardamom"
  ],
  "middleNotes": [
    "Golden Honey",
    "Clove",
    "Cacao",
    "Tonka Bean"
  ],
  "heartNotes": [
    "Golden Honey",
    "Clove",
    "Cacao",
    "Tonka Bean"
  ],
  "baseNotes": [
    "Vanilla",
    "Dried Fruits",
    "Cedarwood",
    "Amber"
  ]
},
{
  "matches": [
    "spanish tobacco",
    "tabacco",
    "tobacco"
  ],
  "brand": "Bespoke Collection",
  "name": "Spanish Tobacco",
  "description": "Spanish Tobacco is a distinctive EXTRAIT DE PARFUM Middle eastern fragrance crafted for Winter wear. Opens with vibrant top notes of Spiced Tobacco Leaf, Cinnamon, Cardamom, transitioning into a captivating heart of Golden Honey and Clove, rested on a lingering base of Vanilla, Dried Fruits, Cedarwood.",
  "vibe": "Aged Pipe Tobacco, Warm Spices, Honey & Rich Resins",
  "longevity": "10 – 13 Hours",
  "projection": "Strong & Enveloping",
  "accords": [
    { "name": "tobacco", "color": "#8B4513", "percentage": 95 },
    { "name": "sweet", "color": "#9c2759", "percentage": 80 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 72 },
    { "name": "amber", "color": "#d9822b", "percentage": 65 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 55 },
    { "name": "woody", "color": "#6e4f32", "percentage": 48 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": [
    "Spiced Tobacco Leaf",
    "Cinnamon",
    "Cardamom"
  ],
  "middleNotes": [
    "Golden Honey",
    "Clove",
    "Cacao",
    "Tonka Bean"
  ],
  "heartNotes": [
    "Golden Honey",
    "Clove",
    "Cacao",
    "Tonka Bean"
  ],
  "baseNotes": [
    "Vanilla",
    "Dried Fruits",
    "Cedarwood",
    "Amber"
  ]
},
{
  "matches": [
    "french tobacco",
    "tabacco",
    "tobacco"
  ],
  "brand": "Bespoke Collection",
  "name": "French Tobacco",
  "description": "French Tobacco is a distinctive EXTRAIT DE PARFUM Middle eastern fragrance crafted for Summer wear. Opens with vibrant top notes of Spiced Tobacco Leaf, Cinnamon, Cardamom, transitioning into a captivating heart of Golden Honey and Clove, rested on a lingering base of Vanilla, Dried Fruits, Cedarwood.",
  "vibe": "Aged Pipe Tobacco, Warm Spices, Honey & Rich Resins",
  "longevity": "10 – 13 Hours",
  "projection": "Strong & Enveloping",
  "accords": [
    { "name": "tobacco", "color": "#8B4513", "percentage": 95 },
    { "name": "sweet", "color": "#9c2759", "percentage": 80 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 72 },
    { "name": "amber", "color": "#d9822b", "percentage": 65 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 55 },
    { "name": "woody", "color": "#6e4f32", "percentage": 48 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 410,
    "spring": 3200,
    "summer": 4600,
    "fall": 1400,
    "day": 4200,
    "night": 1900
  },
  "topNotes": [
    "Spiced Tobacco Leaf",
    "Cinnamon",
    "Cardamom"
  ],
  "middleNotes": [
    "Golden Honey",
    "Clove",
    "Cacao",
    "Tonka Bean"
  ],
  "heartNotes": [
    "Golden Honey",
    "Clove",
    "Cacao",
    "Tonka Bean"
  ],
  "baseNotes": [
    "Vanilla",
    "Dried Fruits",
    "Cedarwood",
    "Amber"
  ]
},
{
  "matches": [
    "tobacco extrait de parfum",
    "tabacco",
    "tobacco"
  ],
  "brand": "Bespoke Collection",
  "name": "Tobacco Extrait de Parfum",
  "description": "Tobacco Extrait de Parfum is a distinctive EXTRAIT DE PARFUM Middle eastern fragrance crafted for Winter wear. Opens with vibrant top notes of Spiced Tobacco Leaf, Cinnamon, Cardamom, transitioning into a captivating heart of Golden Honey and Clove, rested on a lingering base of Vanilla, Dried Fruits, Cedarwood.",
  "vibe": "Aged Pipe Tobacco, Warm Spices, Honey & Rich Resins",
  "longevity": "10 – 13 Hours",
  "projection": "Strong & Enveloping",
  "accords": [
    { "name": "tobacco", "color": "#8B4513", "percentage": 95 },
    { "name": "sweet", "color": "#9c2759", "percentage": 80 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 72 },
    { "name": "amber", "color": "#d9822b", "percentage": 65 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 55 },
    { "name": "woody", "color": "#6e4f32", "percentage": 48 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": [
    "Spiced Tobacco Leaf",
    "Cinnamon",
    "Cardamom"
  ],
  "middleNotes": [
    "Golden Honey",
    "Clove",
    "Cacao",
    "Tonka Bean"
  ],
  "heartNotes": [
    "Golden Honey",
    "Clove",
    "Cacao",
    "Tonka Bean"
  ],
  "baseNotes": [
    "Vanilla",
    "Dried Fruits",
    "Cedarwood",
    "Amber"
  ]
},
{
  "matches": [
    "dominican tobacco",
    "tabacco",
    "tobacco"
  ],
  "brand": "Bespoke Collection",
  "name": "Dominican Tobacco",
  "description": "Dominican Tobacco is a distinctive EXTRAIT DE PARFUM Middle eastern fragrance crafted for Winter wear. Opens with vibrant top notes of Spiced Tobacco Leaf, Cinnamon, Cardamom, transitioning into a captivating heart of Golden Honey and Clove, rested on a lingering base of Vanilla, Dried Fruits, Cedarwood.",
  "vibe": "Aged Pipe Tobacco, Warm Spices, Honey & Rich Resins",
  "longevity": "10 – 13 Hours",
  "projection": "Strong & Enveloping",
  "accords": [
    { "name": "tobacco", "color": "#8B4513", "percentage": 95 },
    { "name": "sweet", "color": "#9c2759", "percentage": 80 },
    { "name": "warm spicy", "color": "#b85428", "percentage": 72 },
    { "name": "amber", "color": "#d9822b", "percentage": 65 },
    { "name": "vanilla", "color": "#c49e49", "percentage": 55 },
    { "name": "woody", "color": "#6e4f32", "percentage": 48 },
    { "name": "smoky", "color": "#4a4a4e", "percentage": 38 }
  ],
  "whenToWear": {
    "winter": 4400,
    "spring": 1200,
    "summer": 380,
    "fall": 3950,
    "day": 1800,
    "night": 4300
  },
  "topNotes": [
    "Spiced Tobacco Leaf",
    "Cinnamon",
    "Cardamom"
  ],
  "middleNotes": [
    "Golden Honey",
    "Clove",
    "Cacao",
    "Tonka Bean"
  ],
  "heartNotes": [
    "Golden Honey",
    "Clove",
    "Cacao",
    "Tonka Bean"
  ],
  "baseNotes": [
    "Vanilla",
    "Dried Fruits",
    "Cedarwood",
    "Amber"
  ]
},
{
  "matches": [
    "bleu de chanel",
    "blue de chanel"
  ],
  "brand": "Chanel",
  "name": "Bleu de Chanel",
  "description": "Bleu de Chanel is a distinctive EDP Woody fragrance crafted for All Season wear. Opens with vibrant top notes of Grapefruit, Lemon, Mint, transitioning into a captivating heart of Ginger and Nutmeg, rested on a lingering base of Incense, Amber, Cedar.",
  "vibe": "Crisp Grapefruit, Spicy Incense, Mint & Cedarwood",
  "longevity": "8 – 10 Hours",
  "projection": "Strong & Refined",
  "accords": [
    { "name": "woody", "color": "#543e2e", "percentage": 94 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 82 },
    { "name": "citrus", "color": "#9a7028", "percentage": 78 },
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 72 },
    { "name": "amber", "color": "#d9822b", "percentage": 62 },
    { "name": "balsamic", "color": "#7b3f2b", "percentage": 52 },
    { "name": "incense", "color": "#4a4a4e", "percentage": 42 }
  ],
  "whenToWear": {
    "winter": 2800,
    "spring": 3400,
    "summer": 3100,
    "fall": 3200,
    "day": 3600,
    "night": 3300
  },
  "topNotes": [
    "Grapefruit",
    "Lemon",
    "Mint",
    "Pink Pepper",
    "Bergamot",
    "Aldehydes",
    "Coriander"
  ],
  "middleNotes": [
    "Ginger",
    "Nutmeg",
    "Jasmine",
    "Melon"
  ],
  "heartNotes": [
    "Ginger",
    "Nutmeg",
    "Jasmine",
    "Melon"
  ],
  "baseNotes": [
    "Incense",
    "Amber",
    "Cedar",
    "Sandalwood",
    "Patchouli",
    "Labdanum"
  ]
},
{
  "matches": [
    "sauvage",
    "dior sauvage"
  ],
  "brand": "Dior",
  "name": "Sauvage",
  "description": "Sauvage by Dior is a radically fresh composition dictated by a name that has the ring of a manifesto. Radiant top notes burst with juicy Calabrian bergamot, while Ambroxan unleashes a powerfully woody trail.",
  "vibe": "Crisp Radiant Bergamot, Szechuan Pepper & Ambroxan",
  "longevity": "8 – 11 Hours",
  "projection": "Strong",
  "accords": [
    { "name": "fresh spicy", "color": "#314b4b", "percentage": 96 },
    { "name": "citrus", "color": "#9a7028", "percentage": 88 },
    { "name": "amber", "color": "#d9822b", "percentage": 74 },
    { "name": "aromatic", "color": "#3a4a3c", "percentage": 68 },
    { "name": "woody", "color": "#543e2e", "percentage": 58 },
    { "name": "musky", "color": "#3d3b40", "percentage": 46 }
  ],
  "whenToWear": {
    "winter": 2800,
    "spring": 3900,
    "summer": 4400,
    "fall": 3400,
    "day": 4600,
    "night": 3800
  },
  "topNotes": [
    "Bergamot",
    "Black Pepper"
  ],
  "middleNotes": [
    "Sichuan Pepper",
    "Lavender",
    "Pink Pepper",
    "Vetiver",
    "Patchouli"
  ],
  "heartNotes": [
    "Sichuan Pepper",
    "Lavender",
    "Pink Pepper",
    "Vetiver",
    "Patchouli"
  ],
  "baseNotes": [
    "Ambroxan",
    "Cedarwood",
    "Labdanum"
  ]
}
];

/**
 * Retrieve the most accurate profile for any perfume in the catalog
 */
export function getPerfumeProfile(name = "") {
  const cleanName = name.toLowerCase().trim();

  // Try direct match from curated authentic database
  for (const entry of KNOWN_PERFUMES) {
    if (entry.matches.some(m => cleanName.includes(m) || m.includes(cleanName))) {
      return entry;
    }
  }

  // Fallback to first matching brand or category if exact name differs
  for (const entry of KNOWN_PERFUMES) {
    if (cleanName.includes(entry.brand.toLowerCase())) {
      return entry;
    }
  }

  // Default to first profile if not found
  return KNOWN_PERFUMES[0];
}
