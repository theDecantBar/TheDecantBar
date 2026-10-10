/**
 * Accurate Olfactory Profiles & Note Pyramids for The Decant Bar Catalog
 * Extracted from authentic fragrance compositions (Fragrantica / Parfumo database standards).
 */

const KNOWN_PERFUMES = [
  // TOM FORD
  {
    matches: ["ombre leather", "ombré leather"],
    vibe: "Warm, Rich Leather & Floral Smoke",
    longevity: "9 – 12 Hours",
    projection: "Strong (Room-Filling)",
    highlights: [
      "A dark, tactile leather fragrance driven by rich spices and floral warmth.",
      "Opens with a sharp aromatic burst of green cardamom before deepening into tactile black leather.",
      "Dries down into rich amber, earthy moss, and sultry patchouli that lingers on fabric for days.",
      "Ideal for evening wear, colder weather, formal occasions, and bold statements."
    ],
    topNotes: ["Cardamom", "Saffron"],
    heartNotes: ["Black Leather", "Jasmine Sambac"],
    baseNotes: ["Patchouli", "Amber", "Moss"]
  },
  {
    matches: ["tuscan leather"],
    vibe: "Smoky Raw Leather, Sweet Raspberry & Saffron",
    longevity: "10 – 14 Hours",
    projection: "Beast Mode",
    highlights: [
      "Tom Ford's iconic private blend combining ultra-luxurious suede leather with sweet wild raspberry.",
      "Distinctive opening that is instantly recognized in high-end perfume circles.",
      "Incredible sillage that projects powerfully with a distinguished, confident aura."
    ],
    topNotes: ["Raspberry", "Saffron", "Thyme"],
    heartNotes: ["Olibanum (Frankincense)", "Jasmine"],
    baseNotes: ["Leather", "Suede", "Amber", "Woody Notes"]
  },
  {
    matches: ["ebene fume", "ebume fume"],
    vibe: "Smoky Palo Santo, Incense & Rich Woods",
    longevity: "8 – 10 Hours",
    projection: "Moderate to Strong",
    highlights: [
      "Meditative, transcendent fragrance centered around mystical Palo Santo wood smoke.",
      "Blended with warm black pepper, African ebony wood, and rich labdanum amber.",
      "Perfect for autumn and winter evenings with an aura of quiet luxury and sophistication."
    ],
    topNotes: ["Palo Santo Smoke", "Incense", "Black Pepper", "Violet Leaf"],
    heartNotes: ["Leather", "Papyrus", "Labdanum", "Cade Oil", "Rose"],
    baseNotes: ["Ebony Wood", "Guaiac Wood", "Resins"]
  },
  {
    matches: ["grey vetiver"],
    vibe: "Clean, Sophisticated Woody Citrus",
    longevity: "7 – 9 Hours",
    projection: "Moderate (Gentlemanly)",
    highlights: [
      "The definitive modern gentleman's fragrance featuring sun-drenched vetiver and refined citrus.",
      "Crisp, tailored, and exceptionally versatile for office, warm days, and business meetings.",
      "A sparkling opening of grapefruit transitions into warm nutmeg, orris root, and oakmoss."
    ],
    topNotes: ["Grapefruit", "Orange Blossom", "Sage"],
    heartNotes: ["Nutmeg", "Orris Root", "Pimento"],
    baseNotes: ["Vetiver", "Oakmoss", "Amber"]
  },
  {
    matches: ["white suede"],
    vibe: "Velvety Suede, Musks & Delicate Florals",
    longevity: "7 – 8 Hours",
    projection: "Moderate & Intimate",
    highlights: [
      "An addictive musk creation featuring raw leather softened with creamy rose and warm amber.",
      "Sensual, clean skin scent that feels cozy, elegant, and intimate.",
      "A versatile unisex masterpiece suitable for all seasons."
    ],
    topNotes: ["Thyme", "Tea"],
    heartNotes: ["Lily-of-the-Valley", "Saffron", "Rose"],
    baseNotes: ["Suede", "Musk", "Sandalwood", "Amber", "Olibanum"]
  },

  // CREED
  {
    matches: ["creed aventus"],
    vibe: "Smoky Pineapple, Crisp Birch & Oakmoss",
    longevity: "8 – 10 Hours",
    projection: "Strong & Magnetic",
    highlights: [
      "The legendary niche masterpiece celebrated for its iconic masculine opening and smoky woods.",
      "Fresh juicy pineapple and blackcurrant collide with dry birch smoke and patchouli.",
      "Anchored by a refined base of oakmoss, ambergris, and sweet vanilla.",
      "The ultimate signature scent for any occasion, season, or formal event."
    ],
    topNotes: ["Pineapple", "Bergamot", "Blackcurrant", "Apple"],
    heartNotes: ["Birch", "Patchouli", "Moroccan Jasmine", "Rose"],
    baseNotes: ["Musk", "Oakmoss", "Ambergris", "Vanilla"]
  },
  {
    matches: ["aventus absolu"],
    vibe: "Spicy Dark Citrus & Smoky Woods",
    longevity: "9 – 12 Hours",
    projection: "Strong",
    highlights: [
      "A richer, darker limited interpretation of Aventus with an added punch of ginger and cinnamon.",
      "Amplified spice and darker woods make it exceptional for colder evenings and night outings.",
      "Retains the beloved pineapple DNA while introducing sophisticated resinous warmth."
    ],
    topNotes: ["Bergamot", "Lemon", "Blackcurrant", "Grapefruit", "Ginger"],
    heartNotes: ["Pineapple", "Patchouli", "Pink Pepper", "Cardamom", "Cinnamon"],
    baseNotes: ["Haitian Vetiver", "Cashmeran", "Labdanum", "Ambroxan", "Musk", "Oakmoss"]
  },
  {
    matches: ["creed irish", "irish"],
    vibe: "Fresh Green Verbena, Violet & Ambergris",
    longevity: "7 – 9 Hours",
    projection: "Moderate to Strong",
    highlights: [
      "A stroll through the Irish countryside; crisp, vibrant, and effortlessly aristocratic.",
      "Invigorating top notes of lemon verbena and peppermint evoke dewy morning grass.",
      "Refined heart of Florentine iris and violet leaves resting on warm Mysore sandalwood."
    ],
    topNotes: ["Lemon Verbena", "Peppermint"],
    heartNotes: ["Violet Leaves", "Florentine Iris"],
    baseNotes: ["Mysore Sandalwood", "Ambergris"]
  },
  {
    matches: ["mountain silver", "silver mountain"],
    vibe: "Icy Mountain Air, Green Tea & Blackcurrant",
    longevity: "6 – 8 Hours",
    projection: "Moderate & Refreshing",
    highlights: [
      "Inspired by the exhilarating crispness of the Swiss Alps and sparkling mountain streams.",
      "Frosty citrus opening meets soothing green tea and bittersweet blackcurrant.",
      "A crystal-clean musk and galbanum dry-down that shines in spring and summer heat."
    ],
    topNotes: ["Bergamot", "Mandarin Orange"],
    heartNotes: ["Green Tea", "Blackcurrant"],
    baseNotes: ["Musk", "Petitgrain", "Sandalwood", "Galbanum"]
  },
  {
    matches: ["orijinal vetivar", "original vetiver"],
    vibe: "Sunlit Vetiver Leaves, Sparkling Citrus & Spices",
    longevity: "7 – 8 Hours",
    projection: "Moderate",
    highlights: [
      "A refreshing twist on traditional vetiver, infusing both the leaves and root for green vitality.",
      "Crisp Italian bergamot and bitter orange balanced by spicy coriander and pink pepper.",
      "Clean, soapy, invigorating dry-down loved for professional and daytime settings."
    ],
    topNotes: ["Bergamot", "Bitter Orange", "Mandarin", "Vetiver Leaves"],
    heartNotes: ["White Pepper", "Coriander", "Pink Berry"],
    baseNotes: ["Mysore Sandalwood", "Vetiver Root", "Ambergris", "Tonkin Musk"]
  },

  // DIOR
  {
    matches: ["sauvage elixer", "sauvage elixir"],
    vibe: "Ultra-Concentrated Spicy Licorice & Rich Woods",
    longevity: "12+ Hours (Nuclear)",
    projection: "Beast Mode",
    highlights: [
      "An exceptionally concentrated elixir pushing the Sauvage DNA into intoxicating richness.",
      "Potent spiced opening of cinnamon, nutmeg, and cardamom wrapped in sparkling grapefruit.",
      "A custom bleeding-edge lavender essence anchored on rich licorice, amber, and vetiver.",
      "High-concentration formulation: a light 2-spritz application provides 12+ hours of projection."
    ],
    topNotes: ["Nutmeg", "Cinnamon", "Cardamom", "Grapefruit"],
    heartNotes: ["Bleeding Lavender"],
    baseNotes: ["Licorice", "Sandalwood", "Amber", "Patchouli", "Haitian Vetiver"]
  },
  {
    matches: ["sauvage parfum"],
    vibe: "Warm Amber, Mandarin & Creamy Sandalwood",
    longevity: "9 – 11 Hours",
    projection: "Strong",
    highlights: [
      "A darker, more mature interpretation of Sauvage emphasizing balsamic warmth and citrus.",
      "Juicy mandarin and bergamot provide freshness before unveiling smoked Sri Lankan sandalwood.",
      "Smooth tonka bean and frankincense round off a rounded, luxurious masculine trail."
    ],
    topNotes: ["Bergamot", "Spicy Mandarin", "Elemi"],
    heartNotes: ["Sandalwood"],
    baseNotes: ["Olibanum (Frankincense)", "Tonka Bean", "Vanilla"]
  },
  {
    matches: ["dior homme intense", "homme intense"],
    vibe: "Powdery Iris, Cocoa & Warm Ambrette",
    longevity: "10 – 12 Hours",
    projection: "Strong & Enveloping",
    highlights: [
      "Universally acclaimed as one of the finest designer fragrances ever created.",
      "Signature Tuscan iris creates a luxurious, buttery, velvety cosmetic-cocoa warmth.",
      "Ecuadorian ambrette seeds and Virginia cedar add masculine woodiness and sensual depth.",
      "The gold standard for date nights, formal black-tie events, and winter evenings."
    ],
    topNotes: ["Tuscan Iris", "Lavender"],
    heartNotes: ["Ambrette (Musk Mallow)", "Pear"],
    baseNotes: ["Virginia Cedar", "Vetiver"]
  },
  {
    matches: ["gris dior"],
    vibe: "Chypre Floral, Earthy Oakmoss & Dewy Rose",
    longevity: "8 – 10 Hours",
    projection: "Moderate to Strong",
    highlights: [
      "The crown jewel of Christian Dior's Privée collection, celebrating the iconic Dior grey.",
      "A bold contemporary chypre balancing dewy Damask rose against damp patchouli and oakmoss.",
      "Subtle sparkling bergamot and warm amber create an aristocratic, genderless masterpiece."
    ],
    topNotes: ["Bergamot"],
    heartNotes: ["Damascena Rose", "Jasmine"],
    baseNotes: ["Patchouli", "Oakmoss", "Amber", "Cedar", "Sandalwood"]
  },
  {
    matches: ["oud isphan", "oud ispahan"],
    vibe: "Opulent Oriental Rose & Smoky Leather Oud",
    longevity: "12+ Hours (Beast Mode)",
    projection: "Enormous",
    highlights: [
      "An unforgettable oriental palace fantasy featuring intoxicating Damask rose and raw oud.",
      "Sensual labdanum and smoky woods envelope the floral heart with imperial intensity.",
      "A powerhouse Middle Eastern style creation that commands admiration and attention."
    ],
    topNotes: ["Labdanum"],
    heartNotes: ["Rose", "Patchouli", "Saffron"],
    baseNotes: ["Agarwood (Oud)", "Sandalwood", "Cedar"]
  },

  // BACCARAT & KILIAN
  {
    matches: ["baccarat rouge 540", "baccarat rouge"],
    vibe: "Airy Crystal Amber, Sweet Saffron & Cedar",
    longevity: "12+ Hours",
    projection: "Magnetic Sillage Monster",
    highlights: [
      "One of the most famous and desired fragrances in the world, crafted by Maison Francis Kurkdjian.",
      "Unique luminous ambergris accord with burnt sugar sweetness and delicate jasmine facets.",
      "Translucent yet fills the room effortlessly with a trail that turns heads everywhere.",
      "Completely unisex, ultra-luxurious, and universally recognizable."
    ],
    topNotes: ["Bitter Almond", "Saffron"],
    heartNotes: ["Egyptian Jasmine", "Cedar"],
    baseNotes: ["Ambergris", "Woody Musk", "Fir Resin"]
  },
  {
    matches: ["angle share", "angels share", "angels' share"],
    vibe: "Warm Cognac, Cinnamon, Praline & Vanilla Oak",
    longevity: "10 – 12 Hours",
    projection: "Strong & Delicious",
    highlights: [
      "Inspired by the Hennessy cognac-making heritage and the evaporation from oak barrels.",
      "Opens with a shot of real cognac oil before blossoming into warm cinnamon and tonka bean.",
      "A decadent base of praline, candied vanilla, and aged oak wood makes it irresistibly cozy.",
      "The undisputed king of winter date-night and gourmand fragrances."
    ],
    topNotes: ["Cognac Oil"],
    heartNotes: ["Cinnamon", "Tonka Bean", "Oak Wood"],
    baseNotes: ["Praline", "Vanilla", "Sandalwood"]
  },
  {
    matches: ["blue moon"],
    vibe: "Fresh Vodka, Calone, Ginger & Lemon",
    longevity: "7 – 8 Hours",
    projection: "Moderate",
    highlights: [
      "Inspired by Kilian Hennessy's signature summer cocktail, the Blue Lagoon.",
      "An icy opening of lemon and calone recreating the sensation of chilled on-the-rocks vodka.",
      "Crisp ginger and white musk provide a luminous, breezy seaside energy."
    ],
    topNotes: ["Lemon", "Calone (Sea Breeze Accord)"],
    heartNotes: ["Vodka Accord", "Ginger"],
    baseNotes: ["Ambroxan", "White Musk"]
  },
  {
    matches: ["roses on ice"],
    vibe: "Chilled Cucumber, Rose Petals & Gin",
    longevity: "6 – 8 Hours",
    projection: "Moderate",
    highlights: [
      "A tribute to Hendricks Gin on the rocks, spiked with fresh cucumber slices and lime.",
      "Delicate Centifolia rose adds an unexpected crisp floral romance.",
      "Clean sandalwood and cedar create a sharp, refreshing daytime summer signature."
    ],
    topNotes: ["Cucumber", "Juniper Berries", "Lime"],
    heartNotes: ["Rose"],
    baseNotes: ["Musk", "Sandalwood"]
  },

  // HAWAS COLLECTION
  {
    matches: ["hawas ice"],
    vibe: "Frosty Crisp Apple, Italian Citrus, Plum & Ambergris",
    longevity: "10 – 12 Hours",
    projection: "Beast Mode",
    highlights: [
      "The refreshed, frosty evolution of the legendary Rasasi Hawas DNA.",
      "Invigorating opening of frozen green apple, Sicilian bergamot, and sweet lemon.",
      "Aquatic heart spiced with cinnamon and cardamom, balanced by juicy dark plum.",
      "Nuclear longevity that cuts right through extreme summer heat and humidity."
    ],
    topNotes: ["Frozen Apple", "Bergamot", "Lemon", "Star Anise"],
    heartNotes: ["Plum", "Cardamom", "Orange Blossom"],
    baseNotes: ["Ambergris", "Musk", "Driftwood", "Moss"]
  },
  {
    matches: ["hawas for him", "hawas"],
    vibe: "Aquatic Melon, Apple, Cinnamon & Ambergris",
    longevity: "9 – 11 Hours",
    projection: "Strong & Invigorating",
    highlights: [
      "The world-renowned aquatic powerhouse that dominates high-heat summer rotation.",
      "Crisp apple, watery notes, and bergamot blended with exotic spices.",
      "Massive compliment getter designed for the active, adventurous modern man."
    ],
    topNotes: ["Apple", "Bergamot", "Lemon", "Cinnamon"],
    heartNotes: ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
    baseNotes: ["Ambergris", "Musk", "Patchouli", "Driftwood"]
  },
  {
    matches: ["hawas black"],
    vibe: "Dark Citrus, Smoked Spices & Resinous Amber",
    longevity: "9 – 11 Hours",
    projection: "Strong",
    highlights: [
      "The nocturnal, brooding sibling of Hawas bringing dark woods and dense resins.",
      "Zesty opening tempered with black pepper and smoky cedarwood.",
      "Exceptional for clubbing, night drives, and autumn evenings."
    ],
    topNotes: ["Black Pepper", "Bergamot", "Grapefruit"],
    heartNotes: ["Smoked Cedar", "Patchouli", "Sage"],
    baseNotes: ["Amber", "Leather", "Musk"]
  },
  {
    matches: ["hawas fire"],
    vibe: "Fiery Spices, Warm Amber & Sizzling Woods",
    longevity: "8 – 10 Hours",
    projection: "Strong",
    highlights: [
      "A daring spicy-warm variation infused with fiery cinnamon, nutmeg, and warm woods.",
      "Blends sweet fruit undertones with an intense, sensual glow."
    ],
    topNotes: ["Fiery Cinnamon", "Red Fruits", "Citrus"],
    heartNotes: ["Spiced Nutmeg", "Lavender", "Amberwood"],
    baseNotes: ["Vanilla", "Tonka Bean", "Cedar"]
  },

  // AZZARO
  {
    matches: ["most wanted", "azzaro"],
    vibe: "Sweet Toffee Caramel, Spiced Cardamom & Bourbon Vanilla",
    longevity: "10 – 12 Hours",
    projection: "Beast Mode",
    highlights: [
      "An addictive winter powerhouse beloved for its irresistible caramel and fiery spice.",
      "Opens with a kick of hot cardamom before melting into gooey toffee caramel.",
      "A magnetic base of bourbon vanilla and glowing amberwood makes it a top-tier date night fragrance."
    ],
    topNotes: ["Red Ginger", "Cardamom"],
    heartNotes: ["Toffee Caramel", "Woody Notes"],
    baseNotes: ["Bourbon Vanilla", "Amberwood"]
  },

  // PACO RABANNE
  {
    matches: ["1 million"],
    vibe: "Sweet Blood Mandarin, Spiced Cinnamon & Blond Leather",
    longevity: "8 – 10 Hours",
    projection: "Strong & Alluring",
    highlights: [
      "The globally renowned party fragrance that revolutionized modern sweet designer perfumery.",
      "Sparkling blood mandarin and peppermint give way to spicy cinnamon and velvety rose.",
      "Rich base of blond leather, white wood, amber, and patchouli."
    ],
    topNotes: ["Blood Mandarin", "Grapefruit", "Mint"],
    heartNotes: ["Cinnamon", "Spicy Notes", "Rose"],
    baseNotes: ["Amber", "Leather", "Woody Notes", "Indian Patchouli"]
  },

  // AFNAN & ARMAF
  {
    matches: ["9pm", "afnan 9pm"],
    vibe: "Sweet Bubblegum Apple, Spicy Cinnamon & Warm Vanilla",
    longevity: "9 – 11 Hours",
    projection: "Strong & Playful",
    highlights: [
      "The undisputed king of nightlife and evening party fragrances.",
      "Addictive opening of sweet green apple, spicy cinnamon, and wild lavender.",
      "A warm vanilla, tonka bean, and amber dry-down that garners endless compliments.",
      "Incredible performance at an accessible decant price point."
    ],
    topNotes: ["Apple", "Cinnamon", "Wild Lavender", "Bergamot"],
    heartNotes: ["Orange Blossom", "Lily-of-the-Valley"],
    baseNotes: ["Vanilla", "Tonka Bean", "Amber", "Patchouli"]
  },
  {
    matches: ["supermacy", "supremacy"],
    vibe: "Fruity Blackcurrant, Bergamot, Birch Smoke & Oakmoss",
    longevity: "10 – 12 Hours",
    projection: "Beast Mode",
    highlights: [
      "Afnan's celebrated Extrait de Parfum offering richer, denser fruit and smoke than typical fresh scents.",
      "Opens with dark blackcurrant and bergamot before unveiling deep patchouli and oakmoss.",
      "Extremely long-lasting sillage that performs through all seasons."
    ],
    topNotes: ["Blackcurrant", "Bergamot", "Apple"],
    heartNotes: ["Oakmoss", "Patchouli", "Lavender"],
    baseNotes: ["Ambergris", "Musk", "Saffron"]
  },
  {
    matches: ["turathi blue", "turathi"],
    vibe: "Zesty Grapefruit, Ambroxan & Deep Woody Amber",
    longevity: "8 – 10 Hours",
    projection: "Strong & Fresh",
    highlights: [
      "Renowned as one of the best fresh luxury citrus/amber scents, matching the DNA of Bvlgari Tygar.",
      "Ultra-juicy, sparkling grapefruit opening backed by modern radiant ambroxan.",
      "Warm woody base that ensures it cuts through high summer temperatures with ease."
    ],
    topNotes: ["Juicy Grapefruit", "Bergamot", "Mandarin"],
    heartNotes: ["Ambroxan", "Woody Notes"],
    baseNotes: ["Amber", "Musk", "Patchouli", "Spices"]
  },
  {
    matches: ["liquid brun"],
    vibe: "Bourbon Vanilla, Candied Orange Blossom & Spiced Cardamom",
    longevity: "10 – 12 Hours",
    projection: "Strong & Cozy",
    highlights: [
      "French Avenue's masterwork inspired by Parfums de Marly Althaïr.",
      "Opens with a warm blast of cinnamon and green cardamom paired with sweet orange blossom.",
      "Rich bourbon vanilla and praline create a smooth, buttery gourmand dry-down."
    ],
    topNotes: ["Cinnamon", "Cardamom", "Orange Blossom", "Bergamot"],
    heartNotes: ["Bourbon Vanilla", "Elemi"],
    baseNotes: ["Praline", "Musk", "Ambroxan", "Guaiac Wood"]
  },
  {
    matches: ["sharaf blend"],
    vibe: "Dates, Sweet Cognac, Cinnamon, Praline & Vanilla",
    longevity: "10 – 13 Hours",
    projection: "Beast Mode",
    highlights: [
      "Zimaya's viral oriental gourmand sensation inspired by luxury boozy dessert scents.",
      "Exotic candied dates, nutmeg, and warm cinnamon wrapped in creamy vanilla and tonka.",
      "A rich, cozy winter fragrance that projects with imperial authority."
    ],
    topNotes: ["Dates", "Nutmeg", "Cinnamon"],
    heartNotes: ["Praline", "Vanilla", "Tuberose"],
    baseNotes: ["Tonka Bean", "Benzoin", "Amberwood"]
  },
  {
    matches: ["club de nuit", "cdnim"],
    vibe: "Smoky Lemon Birch, Blackcurrant & Oakmoss",
    longevity: "10 – 12 Hours",
    projection: "Beast Mode",
    highlights: [
      "The world's most famous and best-performing smoky pineapple/birch fragrance.",
      "Sharp citrus burst that quickly transforms into an intoxicating smoky birch and patchouli heart.",
      "Unmatched projection and longevity that easily turns heads in open air."
    ],
    topNotes: ["Lemon", "Pineapple", "Bergamot", "Blackcurrant", "Apple"],
    heartNotes: ["Birch", "Jasmine", "Rose"],
    baseNotes: ["Musk", "Ambergris", "Patchouli", "Vanilla"]
  },
  {
    matches: ["khamrah qahwa", "khamrah"],
    vibe: "Dark Roasted Coffee, Candied Praline, Cinnamon & Tonka",
    longevity: "11 – 14 Hours",
    projection: "Beast Mode",
    highlights: [
      "A rich, decadent gourmand infusion blending dark Arabian coffee with sweet praline and spices.",
      "Opens with a warm kick of cinnamon, cardamom, and roasted coffee beans.",
      "Melts into creamy vanilla, white flowers, and benzoin amber for an intoxicating winter scent."
    ],
    topNotes: ["Ginger", "Cinnamon", "Cardamom"],
    heartNotes: ["Praline", "Candied Fruits", "White Flowers", "Roasted Coffee Beans"],
    baseNotes: ["Vanilla", "Tonka Bean", "Benzoin", "Musk", "Oud"]
  },

  // XERJOFF
  {
    matches: ["naxos"],
    vibe: "Sweet Honey, Tobacco Leaf, Lavender & Citrus",
    longevity: "11 – 14 Hours",
    projection: "Strong & Regal",
    highlights: [
      "Celebrated as one of the single greatest fragrances in modern niche perfumery.",
      "Sparkling Mediterranean citrus and crisp lavender softened by golden organic honey.",
      "Rich aromatic tobacco leaf, cinnamon, and warm cashmeran create an opulent heart.",
      "Addictive vanilla and tonka bean dry-down that stays on skin and jackets for days."
    ],
    topNotes: ["Lavender", "Bergamot", "Lemon"],
    heartNotes: ["Honey", "Cinnamon", "Cashmeran", "Jasmine Sambac"],
    baseNotes: ["Tobacco Leaf", "Tonka Bean", "Vanilla"]
  },
  {
    matches: ["erba pura"],
    vibe: "Lush Sicilian Fruits, White Musks & Vanilla Amber",
    longevity: "12+ Hours (Nuclear)",
    projection: "Beast Mode",
    highlights: [
      "A joyful explosion of sun-ripened Mediterranean fruits immersed in crystalline white musks.",
      "Juicy orange, lemon, and bergamot that stay vibrant throughout the entire wear.",
      "Enormous sillage that fills any room with an uplifting, exotic tropical cloud."
    ],
    topNotes: ["Sicilian Orange", "Calabrian Bergamot", "Sicilian Lemon"],
    heartNotes: ["Mediterranean Fruit Basket"],
    baseNotes: ["White Musk", "Madagascar Vanilla", "Amber"]
  },
  {
    matches: ["accento"],
    vibe: "Crisp Pineapple, Hyacinth, Pink Pepper & Iris",
    longevity: "9 – 11 Hours",
    projection: "Strong",
    highlights: [
      "An elegant fruity-floral masterpiece opening with fresh pineapple and crisp hyacinth.",
      "Spicy pink pepper and powdery Tuscan iris bring refined Italian sophistication.",
      "A sensual finish of patchouli, amber, and vetiver."
    ],
    topNotes: ["Pineapple", "Hyacinth"],
    heartNotes: ["Pink Pepper", "Iris", "Jasmine"],
    baseNotes: ["Musk", "Amber", "Vetiver", "Patchouli", "Vanilla"]
  },

  // MAISON MARGIELA REPLICA
  {
    matches: ["jazz club", "jazzclub"],
    vibe: "Spiced Rum, Tobacco Leaf, Pink Pepper & Vanilla Bean",
    longevity: "8 – 10 Hours",
    projection: "Moderate to Strong",
    highlights: [
      "Captures the intimate ambiance of a dimly lit Brooklyn jazz club with cocktails and cigars.",
      "Exquisite opening of pink pepper and lemon leads into sweet spiced rum and clary sage.",
      "Sensual smoky base of dried tobacco leaf, bourbon vanilla bean, and styrax."
    ],
    topNotes: ["Pink Pepper", "Neroli", "Lemon"],
    heartNotes: ["Rum", "Clary Sage", "Java Vetiver"],
    baseNotes: ["Tobacco Leaf", "Vanilla Bean", "Styrax"]
  },
  {
    matches: ["by the fire place", "by the fireplace"],
    vibe: "Roasting Chestnuts, Wood Smoke, Cloves & Vanilla",
    longevity: "8 – 10 Hours",
    projection: "Strong & Cozy",
    highlights: [
      "Evokes a cozy winter evening sitting before a crackling fireplace in Chamonix.",
      "Warm roasted chestnuts and spicy cloves enveloped in realistic cedarwood smoke.",
      "A rich, comforting cushion of cashmere and sweet vanilla creates instant comfort."
    ],
    topNotes: ["Cloves", "Pink Pepper", "Orange Blossom"],
    heartNotes: ["Chestnut", "Guaiac Wood", "Juniper"],
    baseNotes: ["Vanilla", "Peru Balsam", "Cashmeran"]
  },
  {
    matches: ["beach walk"],
    vibe: "Sunlit Coconut Milk, Salty Sea Spray, Bergamot & Ylang-Ylang",
    longevity: "6 – 8 Hours",
    projection: "Moderate",
    highlights: [
      "Recalls memory of a stroll along a sandy summer beach with ocean breeze on warm skin.",
      "Luminous bergamot, creamy coconut milk, and exotic ylang-ylang flowers.",
      "Clean white musk and cedarwood evoke sun-warmed sand."
    ],
    topNotes: ["Bergamot", "Lemon", "Pink Pepper"],
    heartNotes: ["Coconut Milk", "Ylang-Ylang", "Heliotrope"],
    baseNotes: ["Musk", "Benzoin", "Cedar"]
  },

  // CHANEL & VERSACE
  {
    matches: ["blue de chanel", "bleu de chanel"],
    vibe: "Crisp Grapefruit, Spicy Incense, Mint & Cedarwood",
    longevity: "8 – 10 Hours",
    projection: "Strong & Refined",
    highlights: [
      "The definitive pinnacle of blue fragrances by master perfumer Jacques Polge.",
      "Zesty grapefruit and cool peppermint opening backed by pink pepper and ginger.",
      "Heart of spicy nutmeg and jasmine leads to a dark, smoky base of incense, labdanum, and sandalwood."
    ],
    topNotes: ["Grapefruit", "Lemon", "Mint", "Pink Pepper", "Bergamot"],
    heartNotes: ["Ginger", "Nutmeg", "Jasmine", "Melon"],
    baseNotes: ["Incense", "Amber", "Cedar", "Sandalwood", "Patchouli", "Labdanum"]
  },
  {
    matches: ["versace eros"],
    vibe: "Vibrant Mint, Candied Green Apple, Tonka & Vanilla",
    longevity: "8 – 10 Hours",
    projection: "Strong & Alluring",
    highlights: [
      "Passionate and masculine, named after the Greek god of love.",
      "Explosion of crisp Italian mint leaves, candied green apple, and bright lemon zest.",
      "Sensual heart of Venezuelan tonka bean and ambroxan resting on creamy Madagascar vanilla."
    ],
    topNotes: ["Mint", "Green Apple", "Lemon"],
    heartNotes: ["Tonka Bean", "Ambroxan", "Geranium"],
    baseNotes: ["Madagascar Vanilla", "Virginian Cedar", "Atlas Cedar", "Vetiver", "Oakmoss"]
  },
  {
    matches: ["eros flame", "versace flame"],
    vibe: "Spicy Chinotto Citrus, Black Pepper, Rosemary & Vanilla",
    longevity: "9 – 11 Hours",
    projection: "Strong",
    highlights: [
      "A fiery contrast to the classic Eros, infused with bitter Italian chinotto and black pepper.",
      "Warm rosemary and pepperwood add fiery sophistication to the tonka and vanilla core."
    ],
    topNotes: ["Mandarin Orange", "Black Pepper", "Chinotto", "Lemon", "Rosemary"],
    heartNotes: ["Pepperwood", "Geranium", "Rose"],
    baseNotes: ["Vanilla", "Tonka Bean", "Sandalwood", "Texas Cedar", "Patchouli", "Oakmoss"]
  },

  // PARFUMS DE MARLY
  {
    matches: ["layton", "marly layton"],
    vibe: "Crisp Apple, Lavender, Spiced Cardamom & Vanilla Woods",
    longevity: "10 – 12 Hours",
    projection: "Strong & Royal",
    highlights: [
      "A distinguished oriental-floral fragrance designed for aristocracy and modern elegance.",
      "Juicy green apple, bergamot, and soothing lavender provide a magnetic opening.",
      "Intoxicating heart of jasmine, violet, and geranium spiced with cardamom.",
      "A warm finish of caramelized vanilla, pepper, and precious woods."
    ],
    topNotes: ["Apple", "Bergamot", "Lavender", "Mandarin Orange"],
    heartNotes: ["Cardamom", "Violet", "Jasmine", "Geranium"],
    baseNotes: ["Vanilla", "Cardamom", "Sandalwood", "Guaiac Wood", "Patchouli", "Pepper"]
  },
  {
    matches: ["castley", "carlisle"],
    vibe: "Nutmeg, Green Apple, Tonka Bean, Saffron & Patchouli",
    longevity: "11 – 14 Hours",
    projection: "Beast Mode",
    highlights: [
      "A wave of warmth and mystery with dark, seductive, velvety richness.",
      "Spicy nutmeg and green apple meet bittersweet saffron and tonka bean.",
      "An earthy, resinous base of patchouli and vanilla creates unmatched winter projection."
    ],
    topNotes: ["Green Apple", "Nutmeg"],
    heartNotes: ["Tonka Bean", "Rose", "Osmanthus"],
    baseNotes: ["Patchouli", "Vanilla", "Opoponax"]
  },

  // YSL
  {
    matches: ["ysl", "l homme", "myself"],
    vibe: "Sparkling Bergamot, Fresh Ginger, Sage & Amberwood",
    longevity: "7 – 9 Hours",
    projection: "Moderate to Strong",
    highlights: [
      "The quintessential modern French fragrance blending crisp elegance with sensual woods.",
      "Vibrant opening of Calabrian bergamot and fresh spicy ginger.",
      "Aromatic heart of clary sage and geranium resting on sensual amberwood and tonka."
    ],
    topNotes: ["Calabrian Bergamot", "Ginger", "Apple"],
    heartNotes: ["Sage", "Geranium", "Juniper"],
    baseNotes: ["Amberwood", "Tonka Bean", "Cedar", "Olibanum"]
  },

  // VALENTINO
  {
    matches: ["valentino", "born in roma", "uomo"],
    vibe: "Smoky Vetiver, Mineral Salt, Violet Leaf & Ginger",
    longevity: "8 – 10 Hours",
    projection: "Strong & Chic",
    highlights: [
      "An edgy, aristocratic Roman tribute blending haute perfumery with modern streetwear culture.",
      "Vibrant mineral salt accord and violet leaf create an unforgettable signature opening.",
      "Smoked vetiver and rich woody notes provide exceptional evening longevity."
    ],
    topNotes: ["Mineral Notes", "Violet Leaf", "Salt"],
    heartNotes: ["Ginger", "Sage"],
    baseNotes: ["Smoked Vetiver", "Woody Notes"]
  },

  // GIVENCHY
  {
    matches: ["givenchy", "gentlemen givenchy"],
    vibe: "Warm Iris, Spiced Cocoa, Whiskey Accords & Burning Woods",
    longevity: "9 – 11 Hours",
    projection: "Strong & Refined",
    highlights: [
      "A gentlemanly masterpiece featuring buttery Florentine iris spiked with warm whisky notes.",
      "Sensual cocoa and warm burning cedarwood envelope the wearer in cozy sophistication."
    ],
    topNotes: ["Bergamot", "Black Pepper", "Coriander"],
    heartNotes: ["Iris", "Cocoa", "Cedar"],
    baseNotes: ["Burning Woods", "Sandalwood", "Patchouli"]
  },

  // BENTLEY
  {
    matches: ["bentley"],
    vibe: "Aged Dark Rum, Leather, Cinnamon & Benzoin Resin",
    longevity: "10 – 12 Hours",
    projection: "Beast Mode",
    highlights: [
      "Widely regarded as one of the greatest boozy leather fragrances in all of perfumery.",
      "Opulent notes of aged dark rum and black pepper lead into warm cinnamon and bay leaf.",
      "Resinous benzoin, patchouli, and raw leather create an opulent masculine trail."
    ],
    topNotes: ["Black Pepper", "Bay Leaf", "Bergamot"],
    heartNotes: ["Dark Rum", "Cinnamon", "Clary Sage", "Leather"],
    baseNotes: ["Benzoin", "Incense", "Cedar", "Patchouli"]
  },

  // MONTBLANC
  {
    matches: ["mont blac", "mont blanc", "explorar", "explorer"],
    vibe: "Italian Bergamot, Rich Leather, Haitian Vetiver & Ambroxan",
    longevity: "8 – 10 Hours",
    projection: "Strong & Crisp",
    highlights: [
      "An olfactory journey across the globe celebrating leather, vetiver, and sparkling citrus.",
      "Crisp Italian bergamot and pink pepper provide a clean, invigorating introduction.",
      "Smoky vetiver and rich amber woods make it an exceptional versatile daily signature."
    ],
    topNotes: ["Bergamot", "Pink Pepper", "Clary Sage"],
    heartNotes: ["Haitian Vetiver", "Leather"],
    baseNotes: ["Ambroxan", "Akigalawood", "Patchouli", "Cacao Pod"]
  },

  // ARMANI
  {
    matches: ["armani code"],
    vibe: "Olive Flower, Star Anise, Lemon Zest & Tonka Bean",
    longevity: "7 – 9 Hours",
    projection: "Moderate & Seductive",
    highlights: [
      "The definitive seductive oriental fragrance combining citrus with warm Mediterranean flora.",
      "Unveils an alluring heart of olive flower and star anise before settling into sweet tobacco and tonka."
    ],
    topNotes: ["Lemon", "Bergamot"],
    heartNotes: ["Star Anise", "Olive Blossom", "Guaiac Wood"],
    baseNotes: ["Leather", "Tonka Bean", "Tobacco"]
  },

  // TOBACCO COLLECTION (Ibrahim Al Qurashi / Middle Eastern)
  {
    matches: ["tabacco", "tobacco"],
    vibe: "Aged Pipe Tobacco, Warm Spices, Honey & Rich Resins",
    longevity: "10 – 13 Hours",
    projection: "Strong & Enveloping",
    highlights: [
      "An opulent artisanal creation showcasing premium cured tobacco leaves steeped in honey and spices.",
      "A warm aromatic greeting of cinnamon, clove, and dried fruits yields to velvety pipe tobacco.",
      "Grounded on sweet vanilla bean, tonka, and aged cedarwood."
    ],
    topNotes: ["Spiced Tobacco Leaf", "Cinnamon", "Cardamom"],
    heartNotes: ["Golden Honey", "Clove", "Cacao", "Tonka Bean"],
    baseNotes: ["Vanilla", "Dried Fruits", "Cedarwood", "Amber"]
  }
];

/**
 * Retrieve the most accurate profile for any perfume in the catalog
 */
export function getPerfumeProfile(name = "", category = "", weather = "", type = "", gender = "") {
  const cleanName = name.toLowerCase().trim();

  // Try direct match from curated authentic database
  for (const entry of KNOWN_PERFUMES) {
    if (entry.matches.some(m => cleanName.includes(m))) {
      return entry;
    }
  }

  // Smart fallback based on category and season for any remaining perfumes
  const isWinter = (weather || "").toLowerCase().includes("winter");
  const isNiche = (category || "").toLowerCase().includes("niche");
  const isMiddleEastern = (category || "").toLowerCase().includes("middle");

  if (isMiddleEastern) {
    return {
      vibe: "Opulent Arabian Spices, Smoked Amber & Rich Woods",
      longevity: "10 – 14 Hours",
      projection: "Strong to Beast Mode",
      highlights: [
        `Handcrafted ${type || "Extrait de Parfum"} blending traditional Middle Eastern perfumery with modern luxury.`,
        "Opens with exotic spices and resinous warmth before unfolding a deep, opulent heart.",
        "Long-lasting trail of golden amber, warm musk, and precious oriental woods.",
        "Crafted to perform exceptionally well throughout day and night."
      ],
      topNotes: ["Saffron", "Cardamom", "Bergamot"],
      heartNotes: ["Rose Damascena", "Incense", "Amberwood"],
      baseNotes: ["Oud Accord", "Vanilla", "Musk", "Patchouli"]
    };
  }

  if (isWinter) {
    return {
      vibe: "Warm Gourmand Spices, Velvety Woods & Amber",
      longevity: "8 – 11 Hours",
      projection: "Strong",
      highlights: [
        `A rich, comforting ${type || "Eau de Parfum"} tailored specifically for colder seasons and evening outings.`,
        "Warm spicy opening that invites closeness and leaves a memorable first impression.",
        "Cozy dry-down of amber, precious woods, and bourbon vanilla."
      ],
      topNotes: ["Cinnamon", "Bergamot", "Pink Pepper"],
      heartNotes: ["Cardamom", "Lavender", "Warm Woods"],
      baseNotes: ["Tonka Bean", "Amber", "Vanilla", "Cedar"]
    };
  }

  // Fresh / Designer / Summer fallback
  return {
    vibe: "Crisp Citrus, Aromatic Florals & Clean Woods",
    longevity: "7 – 9 Hours",
    projection: "Moderate to Strong",
    highlights: [
      `A versatile and refreshing ${type || "Eau de Parfum"} designed for effortless everyday elegance.`,
      "Invigorating burst of fresh citrus and aromatic herbs on the opening spray.",
      "Dries down into a clean, sophisticated base of vetiver, amber, and skin-close musks."
    ],
    topNotes: ["Italian Bergamot", "Lemon Zest", "Fresh Mint"],
    heartNotes: ["Lavender", "Pink Pepper", "Geranium"],
    baseNotes: ["Cedarwood", "Vetiver", "White Musk", "Ambroxan"]
  };
}
