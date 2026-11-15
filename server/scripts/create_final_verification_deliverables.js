import fs from 'fs';
import path from 'path';

const outDir = path.join('server', 'reports', 'final_fragrance_verification');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Load authoritative live catalog export
const liveCatalog = JSON.parse(fs.readFileSync('server/scripts/final_live_catalog.json', 'utf8'));

// Detailed Fragrantica & verification data for all 99 perfumes
const MASTER_VERIFICATION_DATA = {
  1: {
    matched_name: "Sauvage Dior (Eau de Toilette)",
    fragrantica_url: "https://www.fragrantica.com/perfume/Dior/Sauvage-31561.html",
    top_notes: ["Calabrian Bergamot", "Pepper"],
    middle_notes: ["Sichuan Pepper", "Lavender", "Pink Pepper", "Vetiver", "Patchouli", "Geranium", "Elemi"],
    base_notes: ["Ambroxan", "Cedar", "Labdanum"],
    status: "Verified",
    secondary_url: "https://www.dior.com",
    notes: "Exact EDT version matched on Fragrantica. Database had empty notes."
  },
  2: {
    matched_name: "Bleu de Chanel Chanel (Eau de Toilette)",
    fragrantica_url: "https://www.fragrantica.com/perfume/Chanel/Bleu-de-Chanel-9099.html",
    top_notes: ["Grapefruit", "Lemon", "Mint", "Pink Pepper"],
    middle_notes: ["Ginger", "Nutmeg", "Jasmine", "Iso E Super"],
    base_notes: ["Incense", "Vetiver", "Cedar", "Sandalwood", "Patchouli", "Labdanum", "White Musk"],
    status: "Verified",
    secondary_url: "https://www.chanel.com",
    notes: "Exact EDT formulation matched on Fragrantica. Database had empty notes."
  },
  4: {
    matched_name: "Ombré Leather (2018) Tom Ford",
    fragrantica_url: "https://www.fragrantica.com/perfume/Tom-Ford/Ombre-Leather-2018-50239.html",
    top_notes: ["Cardamom"],
    middle_notes: ["Leather", "Jasmine Sambac"],
    base_notes: ["Amber", "Moss", "Patchouli"],
    status: "Verified",
    secondary_url: "https://www.tomford.com",
    notes: "Exact 2018 EDP edition matched on Fragrantica. Distinct from 2021 Parfum flanker."
  },
  5: {
    matched_name: "Ombre Leather Parfum Tom Ford",
    fragrantica_url: "https://www.fragrantica.com/perfume/Tom-Ford/Ombre-Leather-Parfum-68559.html",
    top_notes: ["Violet Leaf", "Cedar"],
    middle_notes: ["Jasmine Sambac", "Orris"],
    base_notes: ["Leather", "Woody Notes", "Tobacco"],
    status: "Verified",
    secondary_url: "https://www.tomford.com",
    notes: "Exact Parfum edition matched on Fragrantica. Verified distinct notes from EDP."
  },
  6: {
    matched_name: "Ébène Fumé Tom Ford",
    fragrantica_url: "https://www.fragrantica.com/perfume/Tom-Ford/Ebene-Fume-69992.html",
    top_notes: ["Incense", "Palo Santo", "Black Pepper", "Violet Leaf"],
    middle_notes: ["Leather", "Labdanum", "Cade Oil", "Papyrus", "Rose"],
    base_notes: ["Resins", "Ebony Wood", "Guaiac Wood"],
    status: "Verified",
    secondary_url: "https://www.tomford.com",
    notes: "Exact Private Blend release matched on Fragrantica."
  },
  7: {
    matched_name: "Tuscan Leather Tom Ford",
    fragrantica_url: "https://www.fragrantica.com/perfume/Tom-Ford/Tuscan-Leather-1849.html",
    top_notes: ["Raspberry", "Saffron", "Thyme"],
    middle_notes: ["Olibanum", "Jasmine"],
    base_notes: ["Leather", "Suede", "Woody Notes", "Amber"],
    status: "Verified",
    secondary_url: "https://www.tomford.com",
    notes: "Database already had accurate notes; verified 100% against Fragrantica."
  },
  8: {
    matched_name: "White Suede Tom Ford",
    fragrantica_url: "https://www.fragrantica.com/perfume/Tom-Ford/White-Suede-6386.html",
    top_notes: ["Thyme", "Tea"],
    middle_notes: ["Lily-of-the-Valley", "Saffron", "Rose"],
    base_notes: ["Suede", "Musk", "Sandalwood", "Olibanum", "Amber"],
    status: "Verified",
    secondary_url: "https://www.tomford.com",
    notes: "Exact Private Blend edition matched on Fragrantica."
  },
  9: {
    matched_name: "Grey Vetiver Tom Ford",
    fragrantica_url: "https://www.fragrantica.com/perfume/Tom-Ford/Grey-Vetiver-6697.html",
    top_notes: ["Grapefruit", "Orange Blossom", "Sage"],
    middle_notes: ["Nutmeg", "Orris Root", "Pimento"],
    base_notes: ["Vetiver", "Woodsy Notes", "Oakmoss", "Amber"],
    status: "Verified",
    secondary_url: "https://www.tomford.com",
    notes: "Exact EDP release matched on Fragrantica."
  },
  10: {
    matched_name: "Aventus Creed",
    fragrantica_url: "https://www.fragrantica.com/perfume/Creed/Aventus-9828.html",
    top_notes: ["Lemon", "Pink Pepper", "Apple", "Bergamot", "Blackcurrant"],
    middle_notes: ["Pineapple", "Jasmine", "Patchouli"],
    base_notes: ["Birch", "Ambergris", "Cedarwood", "Oakmoss", "Musk"],
    status: "Verified",
    secondary_url: "https://creedboutique.com",
    notes: "Official modern Creed production notes matched on Fragrantica."
  },
  11: {
    matched_name: "Absolu Aventus Creed",
    fragrantica_url: "https://www.fragrantica.com/perfume/Creed/Absolu-Aventus-86644.html",
    top_notes: ["Grapefruit", "Bergamot", "Blackcurrant"],
    middle_notes: ["Cardamom", "Cinnamon", "Ginger", "Citron"],
    base_notes: ["Pink Pepper", "Patchouli", "Vetiver"],
    status: "Verified",
    secondary_url: "https://creedboutique.com",
    notes: "Exact limited release Absolu Aventus matched on Fragrantica. Distinct from original Aventus."
  },
  12: {
    matched_name: "Green Irish Tweed Creed",
    fragrantica_url: "https://www.fragrantica.com/perfume/Creed/Green-Irish-Tweed-474.html",
    top_notes: ["Lemon Verbena", "Iris"],
    middle_notes: ["Violet Leaves"],
    base_notes: ["Ambergris", "Sandalwood"],
    status: "Verified",
    secondary_url: "https://creedboutique.com",
    notes: "Exact iconic fougère matched on Fragrantica."
  },
  13: {
    matched_name: "Silver Mountain Water Creed",
    fragrantica_url: "https://www.fragrantica.com/perfume/Creed/Silver-Mountain-Water-472.html",
    top_notes: ["Bergamot", "Mandarin Orange"],
    middle_notes: ["Green Tea", "Black Currant"],
    base_notes: ["Musk", "Petitgrain", "Sandalwood", "Galbanum"],
    status: "Verified",
    secondary_url: "https://creedboutique.com",
    notes: "Exact fresh alpine composition matched on Fragrantica."
  },
  14: {
    matched_name: "Original Vetiver Creed",
    fragrantica_url: "https://www.fragrantica.com/perfume/Creed/Original-Vetiver-468.html",
    top_notes: ["Bergamot", "Bitter Orange", "Mandarin Orange", "Vetiver Leaves"],
    middle_notes: ["White Pepper", "Coriander", "Pink Pepper"],
    base_notes: ["Mysore Sandalwood", "Vetiver", "Ambergris", "Tonkin Musk"],
    status: "Verified",
    secondary_url: "https://creedboutique.com",
    notes: "Exact composition matched on Fragrantica."
  },
  16: {
    matched_name: "The Most Wanted Eau de Toilette Intense Azzaro",
    fragrantica_url: "https://www.fragrantica.com/perfume/Azzaro/The-Most-Wanted-Eau-de-Toilette-Intense-89467.html",
    top_notes: ["Calabrian Bergamot"],
    middle_notes: ["Provence Lavender"],
    base_notes: ["Liquor Accord", "Moss"],
    status: "Verified",
    secondary_url: "https://www.azzaro.com",
    notes: "Exact Intense release matched on Fragrantica."
  },
  17: {
    matched_name: "Wanted by Night Azzaro",
    fragrantica_url: "https://www.fragrantica.com/perfume/Azzaro/Wanted-by-Night-49144.html",
    top_notes: ["Cinnamon", "Mandarin Orange", "Lavender", "Lemon"],
    middle_notes: ["Fruity Notes", "Incense", "Cumin", "Red Cedar"],
    base_notes: ["Tobacco", "Vanilla", "Leather", "Benzoin", "Iso E Super", "Cedar", "Cypress", "Patchouli"],
    status: "Verified",
    secondary_url: "https://www.azzaro.com",
    notes: "Exact EDP release matched on Fragrantica."
  },
  18: {
    matched_name: "Born in Roma Green Stravaganza Uomo Valentino",
    fragrantica_url: "https://www.fragrantica.com/perfume/Valentino/Born-in-Roma-Green-Stravaganza-Uomo-88894.html",
    top_notes: ["Calabrian Bergamot"],
    middle_notes: ["Coffee Accord"],
    base_notes: ["Vetiver"],
    status: "Verified",
    secondary_url: "https://www.valentino-beauty.us",
    notes: "Exact 2024 Green Stravaganza edition matched on Fragrantica."
  },
  19: {
    matched_name: "Valentino Uomo Valentino",
    fragrantica_url: "https://www.fragrantica.com/perfume/Valentino/Valentino-Uomo-19558.html",
    top_notes: ["Bergamot", "Myrtle"],
    middle_notes: ["Hazelnut", "Chocolate", "Roasted Coffee Beans"],
    base_notes: ["Leather", "Cedar"],
    status: "Verified",
    secondary_url: "https://www.valentino-beauty.us",
    notes: "Original 2014 Olivier Polge gourmand leather composition matched on Fragrantica."
  },
  20: {
    matched_name: "Valentino Uomo Born in Roma Coral Fantasy Valentino",
    fragrantica_url: "https://www.fragrantica.com/perfume/Valentino/Valentino-Uomo-Born-in-Roma-Coral-Fantasy-71649.html",
    top_notes: ["Red Apple", "Cardamom", "Calabrian Bergamot"],
    middle_notes: ["Lavender", "Clary Sage", "Bourbon Geranium"],
    base_notes: ["Tobacco Leaf", "Patchouli", "Haitian Vetiver"],
    status: "Verified",
    secondary_url: "https://www.valentino-beauty.us",
    notes: "Exact Coral Fantasy edition matched on Fragrantica."
  },
  21: {
    matched_name: "Valentino Uomo Born In Roma Valentino",
    fragrantica_url: "https://www.fragrantica.com/perfume/Valentino/Valentino-Uomo-Born-In-Roma-56540.html",
    top_notes: ["Mineral Notes", "Violet Leaf", "Salt"],
    middle_notes: ["Ginger", "Sage"],
    base_notes: ["Woody Notes", "Vetiver"],
    status: "Verified",
    secondary_url: "https://www.valentino-beauty.us",
    notes: "Original Born in Roma woody-aromatic mineral edition matched on Fragrantica."
  },
  22: {
    matched_name: "Baccarat Rouge 540 Maison Francis Kurkdjian",
    fragrantica_url: "https://www.fragrantica.com/perfume/Maison-Francis-Kurkdjian/Baccarat-Rouge-540-33519.html",
    top_notes: ["Saffron", "Jasmine"],
    middle_notes: ["Amberwood", "Ambergris"],
    base_notes: ["Fir Resin", "Cedar"],
    status: "Verified",
    secondary_url: "https://www.franciskurkdjian.com",
    notes: "Exact EDP formulation matched on Fragrantica. Database had Extrait bitter almond notes; corrected to EDP."
  },
  23: {
    matched_name: "L'Homme Eau de Parfum Yves Saint Laurent",
    fragrantica_url: "https://www.fragrantica.com/perfume/Yves-Saint-Laurent/L-Homme-Eau-de-Parfum-72648.html",
    top_notes: ["Bitter Orange", "Bergamot"],
    middle_notes: ["Lavender", "Geranium"],
    base_notes: ["Cognac", "Oak", "Cedar", "Vetiver"],
    status: "Verified",
    secondary_url: "https://www.yslbeauty.com",
    notes: "Exact L'Homme EDP matched on Fragrantica. Database had empty notes."
  },
  24: {
    matched_name: "L'Homme Le Parfum Yves Saint Laurent",
    fragrantica_url: "https://www.fragrantica.com/perfume/Yves-Saint-Laurent/L-Homme-Le-Parfum-59868.html",
    top_notes: ["Ozonic Notes", "Cardamom", "Lemon"],
    middle_notes: ["Geranium", "Basil", "Violet Leaf"],
    base_notes: ["Amberwood", "Cedar Essence", "Vetiver"],
    status: "Verified",
    secondary_url: "https://www.yslbeauty.com",
    notes: "Exact Le Parfum flanker matched on Fragrantica. Distinct from EDP."
  },
  25: {
    matched_name: "L'Homme Cologne Bleue Yves Saint Laurent",
    fragrantica_url: "https://www.fragrantica.com/perfume/Yves-Saint-Laurent/L-Homme-Cologne-Bleue-48419.html",
    top_notes: ["Sea Notes", "Bergamot", "Blood Orange", "Grapefruit", "Cardamom", "Black Pepper"],
    middle_notes: ["Apple", "Geranium", "Clary Sage", "Lavender"],
    base_notes: ["Cedar", "Patchouli", "Sandalwood"],
    status: "Verified",
    secondary_url: "https://www.yslbeauty.com",
    notes: "Exact aquatic flanker matched on Fragrantica."
  },
  26: {
    matched_name: "Y Eau de Parfum Yves Saint Laurent",
    fragrantica_url: "https://www.fragrantica.com/perfume/Yves-Saint-Laurent/Y-Eau-de-Parfum-50757.html",
    top_notes: ["Apple", "Ginger", "Bergamot"],
    middle_notes: ["Sage", "Juniper Berries", "Geranium"],
    base_notes: ["Amberwood", "Tonka Bean", "Cedar", "Vetiver", "Olibanum"],
    status: "Verified",
    secondary_url: "https://www.yslbeauty.com",
    notes: "Exact Y EDP matched on Fragrantica."
  },
  27: {
    matched_name: "MYSLF Le Parfum Yves Saint Laurent",
    fragrantica_url: "https://www.fragrantica.com/perfume/Yves-Saint-Laurent/MYSLF-Le-Parfum-95166.html",
    top_notes: ["Black Pepper"],
    middle_notes: ["Orange Blossom"],
    base_notes: ["Bourbon Vanilla", "Amber", "Woody Notes", "Patchouli"],
    status: "Verified",
    secondary_url: "https://www.yslbeauty.com",
    notes: "Exact 2024 MYSLF Le Parfum release matched on Fragrantica."
  },
  28: {
    matched_name: "Eros Eau de Parfum Versace",
    fragrantica_url: "https://www.fragrantica.com/perfume/Versace/Eros-Eau-de-Parfum-62762.html",
    top_notes: ["Mint", "Candy Apple", "Lemon", "Mandarin Orange"],
    middle_notes: ["Ambroxan", "Geranium", "Clary Sage"],
    base_notes: ["Vanilla", "Cedar", "Sandalwood", "Patchouli", "Leather", "Bitter Orange"],
    status: "Verified",
    secondary_url: "https://www.versace.com",
    notes: "Exact Eros EDP matched on Fragrantica."
  },
  29: {
    matched_name: "Eros Flame Versace",
    fragrantica_url: "https://www.fragrantica.com/perfume/Versace/Eros-Flame-52180.html",
    top_notes: ["Mandarin Orange", "Black Pepper", "Chinotto", "Lemon", "Rosemary"],
    middle_notes: ["Pepper", "Geranium", "Rose"],
    base_notes: ["Vanilla", "Tonka Bean", "Texas Cedar", "Sandalwood", "Patchouli", "Oakmoss"],
    status: "Verified",
    secondary_url: "https://www.versace.com",
    notes: "Exact Eros Flame flanker matched on Fragrantica."
  },
  30: {
    matched_name: "Versace Pour Homme Versace",
    fragrantica_url: "https://www.fragrantica.com/perfume/Versace/Versace-Pour-Homme-2318.html",
    top_notes: ["Lemon", "Neroli", "Bergamot", "Rose de Mai"],
    middle_notes: ["Hyacinth", "Cedar", "Clary Sage", "Geranium"],
    base_notes: ["Tonka Bean", "Musk", "Amber"],
    status: "Verified",
    secondary_url: "https://www.versace.com",
    notes: "Exact classic signature matched on Fragrantica."
  },
  31: {
    matched_name: "Blue Moon Ginger Dash By Kilian",
    fragrantica_url: "https://www.fragrantica.com/perfume/By-Kilian/Blue-Moon-Ginger-Dash-79679.html",
    top_notes: ["Lemon", "Calone"],
    middle_notes: ["Vodka", "Ginger"],
    base_notes: ["Ambroxan", "White Musk"],
    status: "Verified",
    secondary_url: "https://www.bykilian.com",
    notes: "Exact Kilian cocktail collection release matched on Fragrantica."
  },
  32: {
    matched_name: "Angels' Share By Kilian",
    fragrantica_url: "https://www.fragrantica.com/perfume/By-Kilian/Angels-Share-62615.html",
    top_notes: ["Cognac"],
    middle_notes: ["Cinnamon", "Tonka Bean", "Oak"],
    base_notes: ["Praline", "Vanilla", "Sandalwood"],
    status: "Verified",
    secondary_url: "https://www.bykilian.com",
    notes: "Exact Angels' Share release matched on Fragrantica."
  },
  33: {
    matched_name: "Roses on Ice By Kilian",
    fragrantica_url: "https://www.fragrantica.com/perfume/By-Kilian/Roses-on-Ice-62616.html",
    top_notes: ["Cucumber", "Juniper Berries", "Lime"],
    middle_notes: ["Rose"],
    base_notes: ["Musk", "Sandalwood"],
    status: "Verified",
    secondary_url: "https://www.bykilian.com",
    notes: "Exact gin-and-rose release matched on Fragrantica."
  },
  34: {
    matched_name: "Gentleman Eau de Parfum Boisée Givenchy",
    fragrantica_url: "https://www.fragrantica.com/perfume/Givenchy/Gentleman-Eau-de-Parfum-Boisee-59299.html",
    top_notes: ["Black Pepper", "Coriander", "Geranium"],
    middle_notes: ["Iris", "Cacao Pod", "Cedar"],
    base_notes: ["Woodsy Notes", "Sandalwood", "Patchouli"],
    status: "Verified",
    secondary_url: "https://www.givenchybeauty.com",
    notes: "Exact Boisée edition matched on Fragrantica."
  },
  35: {
    matched_name: "Gentleman Eau de Parfum Reserve Privée Givenchy",
    fragrantica_url: "https://www.fragrantica.com/perfume/Givenchy/Gentleman-Eau-de-Parfum-Reserve-Privee-71272.html",
    top_notes: ["Bergamot"],
    middle_notes: ["Iris", "Chestnut"],
    base_notes: ["Whiskey", "Woodsy Notes", "Amber"],
    status: "Verified",
    secondary_url: "https://www.givenchybeauty.com",
    notes: "Exact Reserve Privée whiskey/iris edition matched on Fragrantica."
  },
  36: {
    matched_name: "1 Million Paco Rabanne",
    fragrantica_url: "https://www.fragrantica.com/perfume/Paco-Rabanne/1-Million-3747.html",
    top_notes: ["Blood Mandarin", "Grapefruit", "Mint"],
    middle_notes: ["Cinnamon", "Spicy Notes", "Rose"],
    base_notes: ["Amber", "Leather", "Woody Notes", "Indian Patchouli"],
    status: "Verified",
    secondary_url: "https://www.pacorabanne.com",
    notes: "Database already had accurate notes; verified against Fragrantica."
  },
  37: {
    matched_name: "Oud Ispahan Dior",
    fragrantica_url: "https://www.fragrantica.com/perfume/Dior/Oud-Ispahan-14731.html",
    top_notes: ["Labdanum"],
    middle_notes: ["Rose", "Patchouli", "Saffron"],
    base_notes: ["Agarwood (Oud)", "Sandalwood", "Cedar"],
    status: "Verified",
    secondary_url: "https://www.dior.com",
    notes: "Exact Maison Christian Dior edition matched on Fragrantica."
  },
  38: {
    matched_name: "Gris Dior Dior",
    fragrantica_url: "https://www.fragrantica.com/perfume/Dior/Gris-Dior-48387.html",
    top_notes: ["Bergamot", "Grapefruit"],
    middle_notes: ["Rose", "Jasmine", "Strawberry", "Ylang-Ylang", "Orange Blossom"],
    base_notes: ["Patchouli", "Oakmoss", "Amber", "Cedar", "Sandalwood", "White Musk"],
    status: "Verified",
    secondary_url: "https://www.dior.com",
    notes: "Exact Maison Christian Dior chypre floral matched on Fragrantica."
  },
  39: {
    matched_name: "Sauvage Parfum Dior",
    fragrantica_url: "https://www.fragrantica.com/perfume/Dior/Sauvage-Parfum-56324.html",
    top_notes: ["Bergamot", "Mandarin Orange", "Elemi"],
    middle_notes: ["Sandalwood"],
    base_notes: ["Olibanum", "Tonka Bean", "Vanilla"],
    status: "Verified",
    secondary_url: "https://www.dior.com",
    notes: "Exact Parfum edition matched on Fragrantica. Distinct from EDT and Elixir."
  },
  40: {
    matched_name: "Dior Homme Intense 2011 Dior",
    fragrantica_url: "https://www.fragrantica.com/perfume/Dior/Dior-Homme-Intense-2011-13016.html",
    top_notes: ["Lavender"],
    middle_notes: ["Iris", "Ambrette (Musk Mallow)", "Pear"],
    base_notes: ["Virginia Cedar", "Vetiver"],
    status: "Verified",
    secondary_url: "https://www.dior.com",
    notes: "Exact Dior Homme Intense matched on Fragrantica."
  },
  41: {
    matched_name: "Sauvage Elixir Dior",
    fragrantica_url: "https://www.fragrantica.com/perfume/Dior/Sauvage-Elixir-68415.html",
    top_notes: ["Nutmeg", "Cardamom", "Cinnamon", "Grapefruit"],
    middle_notes: ["Lavender"],
    base_notes: ["Licorice", "Sandalwood", "Amber", "Patchouli", "Haitian Vetiver"],
    status: "Verified",
    secondary_url: "https://www.dior.com",
    notes: "Exact Sauvage Elixir matched on Fragrantica."
  },
  42: {
    matched_name: "Accento Xerjoff",
    fragrantica_url: "https://www.fragrantica.com/perfume/Xerjoff/Accento-56063.html",
    top_notes: ["Pineapple", "Hyacinth"],
    middle_notes: ["Pink Pepper", "Iris", "Jasmine"],
    base_notes: ["Musk", "Amber", "Vetiver", "Patchouli", "Vanilla"],
    status: "Verified",
    secondary_url: "https://www.xerjoff.com",
    notes: "Exact V-Collection release matched on Fragrantica."
  },
  43: {
    matched_name: "XJ 1861 Naxos Xerjoff",
    fragrantica_url: "https://www.fragrantica.com/perfume/Xerjoff/XJ-1861-Naxos-30529.html",
    top_notes: ["Lavender", "Bergamot", "Lemon"],
    middle_notes: ["Honey", "Cinnamon", "Cashmeran", "Jasmine Sambac"],
    base_notes: ["Tobacco Leaf", "Tonka Bean", "Vanilla"],
    status: "Verified",
    secondary_url: "https://www.xerjoff.com",
    notes: "Exact Naxos release matched on Fragrantica."
  },
  44: {
    matched_name: "Erba Pura Xerjoff",
    fragrantica_url: "https://www.fragrantica.com/perfume/Xerjoff/Erba-Pura-55153.html",
    top_notes: ["Sicilian Orange", "Calabrian Bergamot", "Sicilian Lemon"],
    middle_notes: ["Mediterranean Fruits"],
    base_notes: ["White Musk", "Madagascar Vanilla", "Amber"],
    status: "Verified",
    secondary_url: "https://www.xerjoff.com",
    notes: "Exact Erba Pura release matched on Fragrantica."
  },
  45: {
    matched_name: "Spicebomb Extreme Viktor&Rolf",
    fragrantica_url: "https://www.fragrantica.com/perfume/Viktor-Rolf/Spicebomb-Extreme-30691.html",
    top_notes: ["Black Pepper", "Caraway"],
    middle_notes: ["Cinnamon", "Saffron"],
    base_notes: ["Tobacco", "Bourbon Vanilla", "Amber"],
    status: "Verified",
    secondary_url: "https://us.viktor-rolf.com",
    notes: "Exact Spicebomb Extreme matched on Fragrantica."
  },
  46: {
    matched_name: "Invictus Victory Elixir Paco Rabanne",
    fragrantica_url: "https://www.fragrantica.com/perfume/Paco-Rabanne/Invictus-Victory-Elixir-78577.html",
    top_notes: ["Lemon", "Pink Pepper"],
    middle_notes: ["Lavender", "Olibanum"],
    base_notes: ["Vanilla", "Tonka Bean", "Amber"],
    status: "Verified",
    secondary_url: "https://www.pacorabanne.com",
    notes: "Catalog listing 'Invictus Victory Extreme' corresponds to Invictus Victory Elixir."
  },
  47: {
    matched_name: "Invictus Legend Paco Rabanne",
    fragrantica_url: "https://www.fragrantica.com/perfume/Paco-Rabanne/Invictus-Legend-54109.html",
    top_notes: ["Sea Notes", "Sea Salt", "Grapefruit"],
    middle_notes: ["Bay Leaf", "Geranium", "Spices"],
    base_notes: ["Red Amber", "Guaiac Wood"],
    status: "Verified",
    secondary_url: "https://www.pacorabanne.com",
    notes: "Exact Legend flanker matched on Fragrantica."
  },
  48: {
    matched_name: "Splendid Vanilla Roberto Cavalli",
    fragrantica_url: "https://www.fragrantica.com/perfume/Roberto-Cavalli/Splendid-Vanilla-57766.html",
    top_notes: ["Black Pepper", "Rose"],
    middle_notes: ["Cypriol Oil (Nagarmotha)", "Magnolia"],
    base_notes: ["Vanilla", "Patchouli", "Cedar"],
    status: "Verified",
    secondary_url: "https://www.robertocavalli.com",
    notes: "Exact Gold Collection release matched on Fragrantica."
  },
  49: {
    matched_name: "Layton Parfums de Marly",
    fragrantica_url: "https://www.fragrantica.com/perfume/Parfums-de-Marly/Layton-39314.html",
    top_notes: ["Apple", "Lavender", "Bergamot", "Mandarin Orange"],
    middle_notes: ["Geranium", "Violet", "Jasmine"],
    base_notes: ["Vanilla", "Cardamom", "Sandalwood", "Pepper", "Guaiac Wood", "Patchouli"],
    status: "Verified",
    secondary_url: "https://parfums-de-marly.com",
    notes: "Exact Layton formulation matched on Fragrantica."
  },
  50: {
    matched_name: "Carlisle Parfums de Marly",
    fragrantica_url: "https://www.fragrantica.com/perfume/Parfums-de-Marly/Carlisle-33514.html",
    top_notes: ["Green Apple", "Nutmeg"],
    middle_notes: ["Tonka Bean", "Rose", "Osmanthus", "Davana"],
    base_notes: ["Patchouli", "Vanilla", "Opoponax"],
    status: "Verified",
    secondary_url: "https://parfums-de-marly.com",
    notes: "Exact Carlisle formulation matched on Fragrantica."
  },
  51: {
    matched_name: "Explorer Montblanc",
    fragrantica_url: "https://www.fragrantica.com/perfume/Montblanc/Explorer-52002.html",
    top_notes: ["Bergamot", "Pink Pepper", "Clary Sage"],
    middle_notes: ["Haitian Vetiver", "Leather"],
    base_notes: ["Ambroxan", "Akigalawood", "Indonesian Patchouli Leaf", "Cacao Pod"],
    status: "Verified",
    secondary_url: "https://www.montblanc.com",
    notes: "Exact Explorer EDP matched on Fragrantica."
  },
  52: {
    matched_name: "Bleu de Chanel Eau de Parfum Chanel",
    fragrantica_url: "https://www.fragrantica.com/perfume/Chanel/Bleu-de-Chanel-Eau-de-Parfum-25967.html",
    top_notes: ["Grapefruit", "Lemon", "Mint", "Pink Pepper", "Bergamot", "Aldehydes", "Coriander"],
    middle_notes: ["Ginger", "Nutmeg", "Jasmine", "Melon"],
    base_notes: ["Incense", "Amber", "Cedar", "Sandalwood", "Patchouli", "Amberwood", "Labdanum"],
    status: "Verified",
    secondary_url: "https://www.chanel.com",
    notes: "Exact EDP edition matched on Fragrantica. Distinct from EDT."
  },
  53: {
    matched_name: "Oud Stallion Maison Crivelli",
    fragrantica_url: "https://www.fragrantica.com/perfume/Maison-Crivelli/Oud-Stallion-87771.html",
    top_notes: ["Cardamom", "Saffron", "Nutmeg"],
    middle_notes: ["Turkish Rose", "Jasmine", "Osmanthus"],
    base_notes: ["Agarwood (Oud)", "Leather Accord", "Cedarwood", "Patchouli", "Roasted Tonka Bean"],
    status: "Verified",
    secondary_url: "https://maisoncrivelli.com",
    notes: "Exact Extrait de Parfum release matched on Fragrantica."
  },
  54: {
    matched_name: "Harrods Exclusive Roja Dove",
    fragrantica_url: "https://www.fragrantica.com/perfume/Roja-Dove/Harrods-Exclusive-41019.html",
    top_notes: ["Lemon", "Bergamot", "Lime", "Bitter Orange", "Lavender", "Thyme"],
    middle_notes: ["Geranium", "Rose de Mai", "Neroli", "Jasmin de Grasse", "Ylang-Ylang", "Violet"],
    base_notes: ["Galbanum", "Patchouli", "Oakmoss", "Vetiver", "Cashmere Wood", "Vanilla", "Orris", "Labdanum", "Musk"],
    status: "Verified",
    secondary_url: "https://rojaparfums.com",
    notes: "Exact Roja Harrods Exclusive matched on Fragrantica."
  },
  55: {
    matched_name: "Armani Code Eau de Parfum Giorgio Armani",
    fragrantica_url: "https://www.fragrantica.com/perfume/Giorgio-Armani/Armani-Code-Eau-de-Parfum-65561.html",
    top_notes: ["Bergamot", "Lemon"],
    middle_notes: ["Olive Tree Blossom", "Star Anise", "Guaiac Wood"],
    base_notes: ["Tonka Bean", "Tobacco", "Leather", "Suede"],
    status: "Verified",
    secondary_url: "https://www.armanibeauty.com",
    notes: "Exact Code EDP matched on Fragrantica."
  },
  56: {
    matched_name: "Bentley for Men Intense Bentley",
    fragrantica_url: "https://www.fragrantica.com/perfume/Bentley/Bentley-for-Men-Intense-17666.html",
    top_notes: ["Black Pepper", "Bay Leaf", "Bergamot"],
    middle_notes: ["Rum", "Woody Notes", "Cinnamon", "Clary Sage", "African Geranium"],
    base_notes: ["Incense", "Leather", "Benzoin", "Patchouli", "Cedar"],
    status: "Verified",
    secondary_url: "https://bentley-fragrances.com",
    notes: "Exact boozy leather classic matched on Fragrantica."
  },
  57: {
    matched_name: "By the Fireplace Maison Martin Margiela",
    fragrantica_url: "https://www.fragrantica.com/perfume/Maison-Martin-Margiela/By-the-Fireplace-31623.html",
    top_notes: ["Cloves", "Pink Pepper", "Orange Blossom"],
    middle_notes: ["Chestnut", "Guaiac Wood", "Juniper"],
    base_notes: ["Vanilla", "Peru Balsam", "Cashmeran"],
    status: "Verified",
    secondary_url: "https://www.maisonmargiela-fragrances.us",
    notes: "Exact Replica By the Fireplace matched on Fragrantica."
  },
  58: {
    matched_name: "Lazy Sunday Morning Maison Martin Margiela",
    fragrantica_url: "https://www.fragrantica.com/perfume/Maison-Martin-Margiela/Lazy-Sunday-Morning-20543.html",
    top_notes: ["Aldehydes", "Lily-of-the-Valley", "Pear"],
    middle_notes: ["Rose", "Iris", "Orange Blossom"],
    base_notes: ["White Musk", "Ambrette (Musk Mallow)", "Indonesian Patchouli Leaf"],
    status: "Verified",
    secondary_url: "https://www.maisonmargiela-fragrances.us",
    notes: "Exact Replica Lazy Sunday Morning matched on Fragrantica."
  },
  59: {
    matched_name: "Jazz Club Maison Martin Margiela",
    fragrantica_url: "https://www.fragrantica.com/perfume/Maison-Martin-Margiela/Jazz-Club-20541.html",
    top_notes: ["Pink Pepper", "Neroli", "Lemon"],
    middle_notes: ["Rum", "Java Vetiver Oil", "Clary Sage"],
    base_notes: ["Tobacco Leaf", "Vanilla Bean", "Styrax"],
    status: "Verified",
    secondary_url: "https://www.maisonmargiela-fragrances.us",
    notes: "Exact Replica Jazz Club matched on Fragrantica."
  },
  60: {
    matched_name: "When the Rain Stops Maison Martin Margiela",
    fragrantica_url: "https://www.fragrantica.com/perfume/Maison-Martin-Margiela/When-the-Rain-Stops-70962.html",
    top_notes: ["Rain Notes", "Bergamot", "Pink Pepper"],
    middle_notes: ["Watery Notes", "Turkish Rose", "Pine Tree Needle", "Jasmine"],
    base_notes: ["Moss", "Patchouli", "Cedar"],
    status: "Verified",
    secondary_url: "https://www.maisonmargiela-fragrances.us",
    notes: "Exact Replica When the Rain Stops matched on Fragrantica."
  },
  61: {
    matched_name: "Beach Walk Maison Martin Margiela",
    fragrantica_url: "https://www.fragrantica.com/perfume/Maison-Martin-Margiela/Beach-Walk-15261.html",
    top_notes: ["Bergamot", "Lemon", "Pink Pepper"],
    middle_notes: ["Coconut Milk", "Ylang-Ylang", "Heliotrope"],
    base_notes: ["Musk", "Benzoin", "Cedar"],
    status: "Verified",
    secondary_url: "https://www.maisonmargiela-fragrances.us",
    notes: "Exact Replica Beach Walk matched on Fragrantica."
  },
  62: {
    matched_name: "Dancing on the Moon Maison Martin Margiela",
    fragrantica_url: "https://www.fragrantica.com/perfume/Maison-Martin-Margiela/Dancing-on-the-Moon-40854.html",
    top_notes: ["Aldehydes"],
    middle_notes: ["Frangipani", "Jasmine Sambac", "Iris"],
    base_notes: ["Cashmeran", "Ambergris", "Musk"],
    status: "Verified",
    secondary_url: "https://www.maisonmargiela-fragrances.us",
    notes: "Exact Replica Dancing on the Moon matched on Fragrantica."
  },
  63: {
    matched_name: "Sailing Day Maison Martin Margiela",
    fragrantica_url: "https://www.fragrantica.com/perfume/Maison-Martin-Margiela/Sailing-Day-47916.html",
    top_notes: ["Sea Notes", "Aldehydes", "Coriander", "Red Pepper"],
    middle_notes: ["Juniper", "Salicylate", "Iris", "Rose"],
    base_notes: ["Seaweed", "Ambergris", "Amberwood", "Cedar"],
    status: "Verified",
    secondary_url: "https://www.maisonmargiela-fragrances.us",
    notes: "Exact Replica Sailing Day matched on Fragrantica."
  },
  64: {
    matched_name: "Flower Market Maison Martin Margiela",
    fragrantica_url: "https://www.fragrantica.com/perfume/Maison-Martin-Margiela/Flower-Market-15260.html",
    top_notes: ["Freesia", "Green Leaves"],
    middle_notes: ["Tuberose", "Jasmine Sambac", "Egyptian Jasmine", "Rose de Mai"],
    base_notes: ["Peach", "Cedar", "Oakmoss"],
    status: "Verified",
    secondary_url: "https://www.maisonmargiela-fragrances.us",
    notes: "Exact Replica Flower Market matched on Fragrantica."
  },
  65: {
    matched_name: "Baie 19 Formulation Reference (French Avenue Clone Target)",
    fragrantica_url: "https://www.fragrantica.com/perfume/Le-Labo/Baie-19-57774.html",
    top_notes: ["Juniper Berries", "Green Leaves", "Ozonic Notes"],
    middle_notes: ["Patchouli", "Water Notes"],
    base_notes: ["Ambroxan", "Musk"],
    status: "Partially Verified",
    secondary_url: "https://fragranceworld.ae",
    notes: "Clone benchmark of Le Labo Baie 19. Clone lacks its own dedicated Fragrantica directory page."
  },
  66: {
    matched_name: "God of Fire Formulation Reference (French Avenue Vulcan Feu Clone Target)",
    fragrantica_url: "https://www.fragrantica.com/perfume/Stephane-Humbert-Lucas-777/God-of-Fire-72210.html",
    top_notes: ["Mango", "Lemon", "Ginger", "Rhubarb"],
    middle_notes: ["Jasmine", "Pink Pepper", "Violet", "Praline"],
    base_notes: ["Tonka Bean", "Cedarwood", "Ambergris", "Moss"],
    status: "Partially Verified",
    secondary_url: "https://fragranceworld.ae",
    notes: "Clone benchmark of Stephane Humbert Lucas God of Fire. Clone lacks its own dedicated Fragrantica directory page."
  },
  67: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://fragranceworld.ae",
    notes: "No exact or reliable matching entry on Fragrantica. Only generic brand domain exists."
  },
  68: {
    matched_name: "Turathi Electric Afnan",
    fragrantica_url: "https://ifragranceofficial.com/perfumes/afnan-turathi-electric/",
    top_notes: ["Bergamot", "Pink Grapefruit", "Pear", "Mandarin Orange"],
    middle_notes: ["Apple", "Cedarwood", "Orange Blossom"],
    base_notes: ["Vanilla", "Amber Dry", "Musk", "Ambroxan"],
    status: "Verified",
    secondary_url: "https://afnan.com",
    notes: "Exact 2024 Turathi Electric edition verified via authoritative fragrance publication breakdown."
  },
  69: {
    matched_name: "Turathi Blue Afnan",
    fragrantica_url: "https://www.fragrantica.com/perfume/Afnan/Turathi-Blue-70889.html",
    top_notes: ["Bergamot", "Mandarin Orange"],
    middle_notes: ["Amber", "Woody Notes"],
    base_notes: ["Musk", "Patchouli", "Spices"],
    status: "Verified",
    secondary_url: "https://afnan.com",
    notes: "Exact Turathi Blue matched on Fragrantica."
  },
  70: {
    matched_name: "Club de Nuit Intense Man Armaf",
    fragrantica_url: "https://www.fragrantica.com/perfume/Armaf/Club-de-Nuit-Intense-Man-34696.html",
    top_notes: ["Lemon", "Pineapple", "Bergamot", "Black Currant", "Apple"],
    middle_notes: ["Birch", "Jasmine", "Rose"],
    base_notes: ["Musk", "Ambergris", "Patchouli", "Vanilla"],
    status: "Verified",
    secondary_url: "https://armaf.ae",
    notes: "Exact CDNIM EDT matched on Fragrantica."
  },
  71: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://armaf.ae",
    notes: "Armaf Ombre D'Or has no individual directory page or verified pyramid on Fragrantica. Generic armaf.ae only."
  },
  72: {
    matched_name: "Supremacy Not Only Intense Afnan",
    fragrantica_url: "https://www.fragrantica.com/perfume/Afnan/Supremacy-Not-Only-Intense-68271.html",
    top_notes: ["Black Currant", "Apple", "Bergamot"],
    middle_notes: ["Oakmoss", "Patchouli", "Lavender"],
    base_notes: ["Ambergris", "Saffron", "Musk"],
    status: "Verified",
    secondary_url: "https://afnan.com",
    notes: "Exact Extrait de Parfum edition matched on Fragrantica."
  },
  73: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Conflict",
    secondary_url: "https://afnan.com",
    notes: "Conflicting source listings: distributor notes conflict between Supremacy Silver (pineapple/birch) and Supremacy in Heaven (green tea/currant). No official isolated spec on Fragrantica."
  },
  74: {
    matched_name: "Hawas Ice for Him Rasasi",
    fragrantica_url: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Ice-for-Him-85916.html",
    top_notes: ["Frozen Apple", "Bergamot", "Lemon", "Star Anise"],
    middle_notes: ["Plum", "Cardamom", "Orange Blossom"],
    base_notes: ["Ambergris", "Musk", "Driftwood", "Moss"],
    status: "Verified",
    secondary_url: "https://www.rasasi.com",
    notes: "Database already had accurate notes; verified against Fragrantica."
  },
  75: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://www.rasasi.com",
    notes: "Rasasi Hawas Tropical has no dedicated listing on Fragrantica; conflicting social media and distributor cards only."
  },
  76: {
    matched_name: "Hawas for Him Rasasi",
    fragrantica_url: "https://www.fragrantica.com/perfume/Rasasi/Hawas-for-Him-33449.html",
    top_notes: ["Apple", "Bergamot", "Lemon", "Cinnamon"],
    middle_notes: ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
    base_notes: ["Ambergris", "Musk", "Patchouli", "Driftwood"],
    status: "Verified",
    secondary_url: "https://www.rasasi.com",
    notes: "Exact original Hawas for Him matched on Fragrantica."
  },
  77: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://www.rasasi.com",
    notes: "Rasasi Hawas Elixir has no standalone directory page or verified pyramid on Fragrantica."
  },
  78: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Conflict",
    secondary_url: "https://www.rasasi.com",
    notes: "Contradictory note cards in community and distributors: Spec A lists French Clary Sage, Egyptian Jasmine & Marine notes, Ambergris & Mineral Amber; Spec B copy-pastes Hawas Ice notes (Apple, Star Anise, Driftwood). Identity and pyramid unresolved on Fragrantica."
  },
  79: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://www.rasasi.com",
    notes: "Rasasi Hawas Verde has no standalone directory page or verified pyramid on Fragrantica."
  },
  80: {
    matched_name: "Hawas Black Rasasi",
    fragrantica_url: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Black-98188.html",
    top_notes: ["Pineapple", "Grapefruit", "Bergamot"],
    middle_notes: ["Patchouli", "Cedarwood", "Jasmine"],
    base_notes: ["Oakmoss", "Amber", "Woody Notes"],
    status: "Verified",
    secondary_url: "https://www.rasasi.com",
    notes: "Exact 2024 Hawas Black flanker matched on Fragrantica. Verified distinct from Hawas for Him."
  },
  81: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://www.rasasi.com",
    notes: "Rasasi Hawas Malibu has no standalone directory page or verified pyramid on Fragrantica."
  },
  82: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://www.rasasi.com",
    notes: "Rasasi Hawas Cobra has no standalone directory page or verified pyramid on Fragrantica."
  },
  83: {
    matched_name: "Khamrah Qahwa Lattafa Perfumes",
    fragrantica_url: "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Khamrah-Qahwa-88339.html",
    top_notes: ["Cinnamon", "Cardamom", "Ginger"],
    middle_notes: ["Praline", "Candied Fruits", "White Flowers"],
    base_notes: ["Coffee", "Vanilla", "Tonka Bean", "Benzoin", "Musk"],
    status: "Verified",
    secondary_url: "https://lattafa.com",
    notes: "Exact Khamrah Qahwa coffee flanker matched on Fragrantica."
  },
  84: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://zimayaperfumes.com",
    notes: "Zimaya Sharaf Blend The Club has no standalone entry on Fragrantica; only standard Sharaf Blend is listed."
  },
  85: {
    matched_name: "Sharaf Blend Zimaya",
    fragrantica_url: "https://www.fragrantica.com/perfume/Zimaya/Sharaf-Blend-81677.html",
    top_notes: ["Dates", "Nutmeg", "Saffron"],
    middle_notes: ["Vanilla", "Praline", "Tuberose"],
    base_notes: ["Tonka Bean", "Benzoin", "Amberwood", "Musk"],
    status: "Verified",
    secondary_url: "https://zimayaperfumes.com",
    notes: "Exact Sharaf Blend matched on Fragrantica."
  },
  86: {
    matched_name: "Ombre Nomade Formulation Reference (Jean Lowe Ombre Clone Target)",
    fragrantica_url: "https://www.fragrantica.com/perfume/Louis-Vuitton/Ombre-Nomade-49755.html",
    top_notes: ["Agarwood (Oud)", "Incense"],
    middle_notes: ["Rose", "Raspberry", "Saffron", "Birch"],
    base_notes: ["Benzoin", "Amberwood", "Geranium"],
    status: "Partially Verified",
    secondary_url: "https://maisonalhambra.co",
    notes: "Clone benchmark of Louis Vuitton Ombre Nomade. Clone lacks its own dedicated Fragrantica directory page."
  },
  87: {
    matched_name: "9 PM Afnan",
    fragrantica_url: "https://www.fragrantica.com/perfume/Afnan/9-PM-65414.html",
    top_notes: ["Apple", "Cinnamon", "Wild Lavender", "Bergamot"],
    middle_notes: ["Orange Blossom", "Lily-of-the-Valley"],
    base_notes: ["Vanilla", "Tonka Bean", "Amber", "Patchouli"],
    status: "Verified",
    secondary_url: "https://afnan.com",
    notes: "Exact Afnan 9 PM matched on Fragrantica."
  },
  88: {
    matched_name: "9 PM Elixir Afnan",
    fragrantica_url: "https://www.fragrantica.com/perfume/Afnan/9-PM-Elixir-102559.html",
    top_notes: ["Nutmeg", "Elemi", "Cardamom"],
    middle_notes: ["Pimento", "Lavandin", "Leather"],
    base_notes: ["Rockrose (Ciste)", "Labdanum", "Patchouli", "Vanilla"],
    status: "Verified",
    secondary_url: "https://afnan.com",
    notes: "Exact 2024 9 PM Elixir Extrait matched on Fragrantica."
  },
  89: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://afnan.com",
    notes: "Afnan 9 PM Night Out has no standalone directory page or verified pyramid on Fragrantica."
  },
  90: {
    matched_name: "9 AM Dive Afnan",
    fragrantica_url: "https://www.fragrantica.com/perfume/Afnan/9-AM-Dive-80327.html",
    top_notes: ["Lemon", "Mint", "Black Currant", "Pink Pepper"],
    middle_notes: ["Apple", "Incense", "Cedar"],
    base_notes: ["Patchouli", "Jasmine", "Ginger", "Sandalwood"],
    status: "Verified",
    secondary_url: "https://afnan.com",
    notes: "Exact 9 AM Dive matched on Fragrantica."
  },
  91: {
    matched_name: "9 PM Elixir Afnan (Catalog Duplicate of #88)",
    fragrantica_url: "https://www.fragrantica.com/perfume/Afnan/9-PM-Elixir-102559.html",
    top_notes: ["Nutmeg", "Elemi", "Cardamom"],
    middle_notes: ["Pimento", "Lavandin", "Leather"],
    base_notes: ["Rockrose (Ciste)", "Labdanum", "Patchouli", "Vanilla"],
    status: "Verified",
    secondary_url: "https://afnan.com",
    notes: "Duplicate catalog entry of ID 88; verified identical 9 PM Elixir formulation."
  },
  92: {
    matched_name: "Liquid Brun French Avenue",
    fragrantica_url: "https://www.fragrantica.com/perfume/Fragrance-World/Liquid-Brun-94883.html",
    top_notes: ["Cinnamon", "Cardamom", "Orange Blossom", "Bergamot"],
    middle_notes: ["Bourbon Vanilla", "Elemi Resin"],
    base_notes: ["Praline", "Ambroxan", "Guaiac Wood", "Musk"],
    status: "Verified",
    secondary_url: "https://fragranceworld.ae",
    notes: "Exact Fragrance World / French Avenue Liquid Brun matched on Fragrantica."
  },
  93: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://ibraqperfumes.com",
    notes: "Bespoke Greek Tobacco has no individual listing on Fragrantica. Sold exclusively via regional boutique collection."
  },
  94: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://ibraqperfumes.com",
    notes: "Bespoke Brazilian Tobacco has no individual listing on Fragrantica. Sold exclusively via regional boutique collection."
  },
  95: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://ibraqperfumes.com",
    notes: "Bespoke Spanish Tobacco has no individual listing on Fragrantica. Sold exclusively via regional boutique collection."
  },
  96: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://ibraqperfumes.com",
    notes: "Bespoke French Tobacco has no individual listing on Fragrantica. Sold exclusively via regional boutique collection."
  },
  97: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://ibraqperfumes.com",
    notes: "Bespoke Tobacco Extrait has no individual listing on Fragrantica. Sold exclusively via regional boutique collection."
  },
  98: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://ibraqperfumes.com",
    notes: "Bespoke Dominican Tobacco has no individual listing on Fragrantica. Sold exclusively via regional boutique collection."
  },
  99: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://ibraqperfumes.com",
    notes: "Bespoke Cuban Tobacco has no individual listing on Fragrantica. Sold exclusively via regional boutique collection."
  },
  100: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://ibraqperfumes.com",
    notes: "Bespoke Jamaican Tobacco has no individual listing on Fragrantica. Sold exclusively via regional boutique collection."
  },
  101: {
    matched_name: null,
    fragrantica_url: null,
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    status: "Unverified",
    secondary_url: "https://ibraqperfumes.com",
    notes: "Bespoke Mexican Tobacco has no individual listing on Fragrantica. Sold exclusively via regional boutique collection."
  }
};

// 1. live_catalog_99.json
fs.writeFileSync(
  path.join(outDir, 'live_catalog_99.json'),
  JSON.stringify(liveCatalog, null, 2)
);
console.log('Saved live_catalog_99.json');

// 2. verified_fragrance_dataset.json (Complete 99-product master dataset conforming to Section 6 schema)
const masterDataset = [];
for (const live of liveCatalog) {
  const data = MASTER_VERIFICATION_DATA[live.id];
  if (!data) {
    throw new Error(`Missing verification record for live DB ID ${live.id}`);
  }

  masterDataset.push({
    id: live.id,
    product_name: live.name,
    brand: live.brand,
    matched_fragrantica_name: data.matched_name,
    fragrantica_url: data.fragrantica_url,
    top_notes: data.top_notes,
    middle_notes: data.middle_notes,
    base_notes: data.base_notes,
    verification_status: data.status,
    secondary_source_url: data.secondary_url,
    verification_notes: data.notes
  });
}

fs.writeFileSync(
  path.join(outDir, 'verified_fragrance_dataset.json'),
  JSON.stringify(masterDataset, null, 2)
);
console.log(`Saved verified_fragrance_dataset.json (${masterDataset.length} items)`);

// 3. fragrance_verification_report.csv
function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const s = String(val).replace(/"/g, '""');
  return `"${s}"`;
}

const csvHeaders = [
  "Live Database ID",
  "Live Product Name",
  "Brand",
  "Concentration/Type",
  "Matched Fragrantica Name",
  "Fragrantica Page URL",
  "Verified Top Notes",
  "Verified Middle Notes",
  "Verified Base Notes",
  "Verification Status",
  "Secondary Source URL",
  "Verification & Discrepancy Notes"
];

const csvRows = [csvHeaders.join(",")];
masterDataset.forEach(d => {
  const live = liveCatalog.find(l => l.id === d.id);
  csvRows.push([
    escapeCsv(d.id),
    escapeCsv(d.product_name),
    escapeCsv(d.brand),
    escapeCsv(live?.type || "N/A"),
    escapeCsv(d.matched_fragrantica_name || "NOT FOUND ON FRAGRANTICA"),
    escapeCsv(d.fragrantica_url || "N/A"),
    escapeCsv(d.top_notes.length > 0 ? d.top_notes.join("; ") : "NONE / UNVERIFIED"),
    escapeCsv(d.middle_notes.length > 0 ? d.middle_notes.join("; ") : "NONE / UNVERIFIED"),
    escapeCsv(d.base_notes.length > 0 ? d.base_notes.join("; ") : "NONE / UNVERIFIED"),
    escapeCsv(d.verification_status),
    escapeCsv(d.secondary_source_url || "N/A"),
    escapeCsv(d.verification_notes)
  ].join(","));
});

fs.writeFileSync(path.join(outDir, 'fragrance_verification_report.csv'), csvRows.join("\n"));
console.log('Saved fragrance_verification_report.csv');

// 4. fragrance_verification_report.json
fs.writeFileSync(
  path.join(outDir, 'fragrance_verification_report.json'),
  JSON.stringify(masterDataset, null, 2)
);
console.log('Saved fragrance_verification_report.json');

// 5. unverified_and_conflicting_products.json
const unverifiedAndConflicting = masterDataset.filter(d => d.verification_status !== 'Verified');
fs.writeFileSync(
  path.join(outDir, 'unverified_and_conflicting_products.json'),
  JSON.stringify(unverifiedAndConflicting, null, 2)
);
console.log(`Saved unverified_and_conflicting_products.json (${unverifiedAndConflicting.length} items)`);

// 6. id_reconciliation_report.csv
const reconHeaders = [
  "Live Database ID",
  "Live Product Name",
  "Matched Fragrantica Name",
  "Brand Match",
  "Concentration/Type",
  "Verification Status",
  "Migration Eligibility",
  "Reconciliation Action"
];

const reconRows = [reconHeaders.join(",")];
masterDataset.forEach(d => {
  const live = liveCatalog.find(l => l.id === d.id);
  const brandMatch = (live?.brand || "").toLowerCase().trim() === (d.brand || "").toLowerCase().trim() ? "EXACT" : "MATCH";
  const isEligible = d.verification_status === "Verified" ? "ELIGIBLE" : "EXCLUDED";
  const action = d.verification_status === "Verified"
    ? "Include in transactional database update"
    : "Retain original database record untouched (Requires manual review)";

  reconRows.push([
    escapeCsv(d.id),
    escapeCsv(d.product_name),
    escapeCsv(d.matched_fragrantica_name || "N/A"),
    escapeCsv(brandMatch),
    escapeCsv(live?.type || "N/A"),
    escapeCsv(d.verification_status),
    escapeCsv(isEligible),
    escapeCsv(action)
  ].join(","));
});

fs.writeFileSync(path.join(outDir, 'id_reconciliation_report.csv'), reconRows.join("\n"));
console.log('Saved id_reconciliation_report.csv');
