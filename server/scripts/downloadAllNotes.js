import fs from "fs";
import path from "path";
import { KNOWN_PERFUMES } from "../../src/data/perfumeNotes.js";

// Master Fragrantica ID mapping for all fragrance notes
const NOTE_ID_MAP = {
  // Citrus & Fruits
  "bergamot": 12,
  "calabrian bergamot": 12,
  "lemon": 77,
  "lemon zest": 77,
  "grapefruit": 108,
  "mandarin": 107,
  "orange": 107,
  "pineapple": 170,
  "apple": 111,
  "crisp apple": 111,
  "blackcurrant": 132,
  "black currant": 132,
  "raspberry": 174,
  "dates": 453,
  "dried fruits": 453,
  "juniper": 171,
  "juniper berries": 171,
  "pear": 242,
  "peach": 175,
  "coconut": 204,
  "coconut milk": 204,

  // Spices & Herbs
  "cardamom": 63,
  "cinnamon": 64,
  "pink pepper": 85,
  "black pepper": 85,
  "sichuan pepper": 85,
  "pepper": 85,
  "red pepper": 85,
  "pimento": 85,
  "nutmeg": 62,
  "clove": 65,
  "ginger": 68,
  "saffron": 350,
  "thyme": 427,
  "sage": 134,
  "clary sage": 134,
  "mint": 159,
  "fresh mint": 159,
  "peppermint": 159,
  "tea": 131,
  "paprika": 85,
  "coriander": 71,
  "bay leaf": 135,
  "elemi": 106,
  "licorice": 64,
  "cypriol": 315,
  "cypriol oil": 315,

  // Florals
  "lavender": 13,
  "jasmine": 14,
  "moroccan jasmine": 14,
  "jasmine sambac": 14,
  "rose": 105,
  "rose damascena": 105,
  "rose de mai": 105,
  "turkish rose": 105,
  "neroli": 17,
  "orange blossom": 16,
  "geranium": 27,
  "iris": 11,
  "florentine iris": 11,
  "orris root": 11,
  "orris": 11,
  "violet": 22,
  "violet leaf": 22,
  "tuberose": 14,
  "lily-of-the-valley": 14,
  "freesia": 14,
  "magnolia": 14,
  "frangipani": 14,
  "ylang-ylang": 14,
  "heliotrope": 14,
  "osmanthus": 14,
  "hyacinth": 14,

  // Woods, Mosses & Greens
  "birch": 53,
  "cedar": 32,
  "cedarwood": 32,
  "sandalwood": 33,
  "mysore sandalwood": 33,
  "vetiver": 2,
  "haitian vetiver": 2,
  "oakmoss": 38,
  "moss": 38,
  "patchouli": 34,
  "woody notes": 315,
  "warm woods": 315,
  "oud": 114,
  "oud accord": 114,
  "agarwood": 114,
  "pine tree": 315,
  "wet pine": 315,
  "guaiac wood": 315,
  "ebony wood": 315,
  "akigalawood": 315,
  "amberwood": 315,
  "cashmeran": 315,
  "papyrus": 315,
  "green leaves": 34,
  "aloe": 34,

  // Resins, Leathers, Balsams & Animalic
  "leather": 93,
  "black leather": 93,
  "suede": 196,
  "amber": 39,
  "red amber": 39,
  "ambergris": 117,
  "ambroxan": 117,
  "musk": 4,
  "white musk": 4,
  "ambrette": 4,
  "olibanum": 95,
  "olibanum (frankincense)": 95,
  "frankincense": 95,
  "incense": 106,
  "palo santo smoke": 106,
  "labdanum": 95,
  "myrrh": 95,
  "benzoin": 95,
  "resins": 95,
  "cade oil": 106,

  // Sweet, Gourmand & Marine
  "vanilla": 74,
  "bourbon vanilla": 74,
  "tonka bean": 73,
  "tonka": 73,
  "toffee": 186,
  "toffee (caramel)": 186,
  "caramel": 186,
  "praline": 361,
  "honey": 155,
  "golden honey": 155,
  "coffee": 154,
  "cacao": 157,
  "tobacco": 96,
  "spiced tobacco leaf": 96,
  "sea notes": 340,
  "sea salt": 340,
  "seaweed": 340,
  "salicylate": 340,
  "aldehydes": 4,
  "rain notes": 340,
  "water notes": 340
};

async function downloadAll() {
  const notesDir = path.resolve("public/images/notes");
  if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true });
  }

  // Collect all distinct notes from all 99 perfumes
  const allNotes = new Set();
  for (const p of KNOWN_PERFUMES) {
    (p.topNotes || []).forEach(n => allNotes.add(n));
    (p.middleNotes || p.heartNotes || []).forEach(n => allNotes.add(n));
    (p.baseNotes || []).forEach(n => allNotes.add(n));
  }

  console.log(`Found ${allNotes.size} distinct notes across all catalog perfumes.`);

  const downloadedMap = {};

  for (const noteName of allNotes) {
    const clean = noteName.toLowerCase().trim();
    let noteId = NOTE_ID_MAP[clean];

    if (!noteId) {
      // Substring match
      for (const [key, id] of Object.entries(NOTE_ID_MAP)) {
        if (clean.includes(key) || key.includes(clean)) {
          noteId = id;
          break;
        }
      }
    }

    if (!noteId) {
      noteId = 315; // default to woody/amber notes
    }

    const safeFilename = clean.replace(/[^a-z0-9]/g, "_") + ".jpg";
    const destPath = path.join(notesDir, safeFilename);

    // Download if not already saved
    if (!fs.existsSync(destPath)) {
      try {
        const url = `https://fimgs.net/images/sastojci/m.${noteId}.jpg`;
        const res = await fetch(url);
        if (res.ok) {
          const buf = await res.arrayBuffer();
          fs.writeFileSync(destPath, Buffer.from(buf));
          console.log(`✓ Downloaded ${noteName} -> ${safeFilename} (ID: ${noteId})`);
        } else {
          console.warn(`Failed downloading ${noteName} (HTTP ${res.status})`);
        }
      } catch (err) {
        console.error(`Error downloading ${noteName}:`, err.message);
      }
    }

    downloadedMap[clean] = `/images/notes/${safeFilename}`;
  }

  // Also write out the local map into src/data/localNotesMap.json
  fs.writeFileSync("src/data/localNotesMap.json", JSON.stringify(downloadedMap, null, 2), "utf8");
  console.log("Wrote src/data/localNotesMap.json successfully!");
}

downloadAll().catch(console.error);
