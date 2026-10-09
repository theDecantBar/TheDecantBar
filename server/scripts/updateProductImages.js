import pool from "../config/db.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");
const imageFolder = path.join(
  projectRoot,
  "public",
  "images",
  "perfumes"
);

// Only include matches identified from your contact sheets.
const imageMap = {
  "Hawas Ice": "IMG_9594.WEBP",
  "Hawas tropical": "IMG_9595.JPG.jpeg",
  "Hawas for him": "IMG_9596.JPG.jpeg",
  "Hawas elixer": "IMG_9597.JPG.jpeg",
  "Hawas Fire": "IMG_9598.JPG.jpeg",
  "Hawas Malibu": "IMG_9599.JPG.jpeg",
  "Hawas verde": "IMG_9600.JPG.jpeg",
  "Hawas black": "IMG_9601.JPG.jpeg",
  "Hawas kobra": "IMG_9602.WEBP",

  "Tomford ombre leather parfum": "IMG_9614.WEBP",
  "Creed aventus": "IMG_9615.JPG.jpeg",
  "Creed aventus absolu": "IMG_9616.WEBP",
  "Creed mountain silver": "IMG_9618.JPG.jpeg",

  "Versace eros": "IMG_9625.JPG.jpeg",
  "versace flame": "IMG_9626.JPG.jpeg",
  "Kilian angle share": "IMG_9628.JPG.jpeg",
  "Kilian blue moon": "IMG_9629.JPG.jpeg",
  "kilian roses on ice": "IMG_9630.JPG.jpeg",

  "Christian Dior Gris dior": "IMG_9632.WEBP",
  "Christian Dior oud isphan": "IMG_9633.JPG.jpeg",
  "Dior sauvage elixer": "IMG_9634.WEBP",
  "Dior homme intense parfum": "IMG_9635.JPG.jpeg",

  "Xerjoff Erba Pura": "IMG_9644.JPG.jpeg",
  "Xerjoff Naxos": "IMG_9645.PNG",
  "Xerjoff Accento": "IMG_9646.JPG.jpeg",

  "Oud Stallion": "IMG_9649.JPG.jpeg",
  "ROJA Harrods": "IMG_9650.WEBP",
  "Armani code": "IMG_9651.WEBP",
  "Blue de chanel edp": "IMG_9652.JPG.jpeg",
  "Mont blac explorar": "IMG_9653.JPG.jpeg",
  "Roberto canvalli splendid vanilla": "IMG_9654.JPG.jpeg",
  "Invictus legend": "IMG_9657.WEBP",
  "Baccarat rouge 540": "IMG_9658.WEBP",

  "Afnan 9PM": "IMG_9663.JPG.jpeg",
  "Armaf omb d'or": "IMG_9664.WEBP",
  "Jean Lowe ombre": "IMG_9669.WEBP",
  "lattafa khamrah qahwa": "IMG_9671.WEBP",
  "sharaf blend the club": "IMG_9673.JPG.jpeg",
  "sharaf blend": "IMG_9674.WEBP",

  "Valentino born in roma green stravaganza": "IMG_9677.JPG.jpeg",
  "YSL Homme cologne blue": "IMG_9680.JPG.jpeg",
  "YSL L Homme": "IMG_9681.WEBP",
  "YSL L Homme Le Parfum": "IMG_9682.JPG.jpeg",
  "YSL myself L'abslou parfum": "IMG_9684.JPG.jpeg",

  "9PM ELIXER": "IMG_9687.JPG (1).jpeg",
  "Afnan supermacy not only intense": "IMG_9695.JPG.jpeg",
  "Afnan supermacy collector edition": "IMG_9696.WEBP",
  "Armaf Club de nuit intense": "IMG_9697.WEBP",
  "1 Million": "IMG_9700.JPG.jpeg",

  "Azzaro most wanted Intense": "IMG_9643.AVIF",
  "Creed Irish": "IMG_9617.AVIF",
  "Creed orijinal vetivar": "IMG_9619.AVIF",
  "Dior sauvage Parfum": "IMG_9631.WEBP",
  "Maison Margiela REPLICA BEACH WALK": "IMG_9604.JPG.jpeg",
  "Maison Margiela REPLICA By the fire place": "IMG_9608.AVIF",
  "Maison Margiela REPLICA DANCING ON THE MOON": "IMG_9611.AVIF",
  "Maison Margiela REPLICA Flower Market": "IMG_9606.JPG.jpeg",
  "Maison Margiela REPLICA JazzClub": "IMG_9609.JPG.jpeg",
  "Maison Margiela REPLICA Lazy sunday morning": "IMG_9603.AVIF",
  "Maison Margiela REPLICA SAILING DAY": "IMG_9610.JPG.jpeg",
  "Maison Margiela REPLICA WHEN THE RAIN STOP": "IMG_9605.JPG.jpeg",
  "Spicebomb viktor rolf": "IMG_9642.AVIF",
  "Tom ford tuscan leather": "TomFordTuscan.webp",
  "Tomford Grey Vetiver": "greyVitever.jpg",
  "Valentino coral": "IMG_9676.PNG",
  "Valentino men Uomo": "IMG_9675.AVIF",
  "Versace pour homme": "IMG_9627.AVIF",
  // Additional image mappings
  "Azzaro most wanted night": "IMG_9622.JPG.jpeg",
  "Bentley intense": "IMG_9643.AVIF",
  "French avenue Baie EDP": "IMG_9612.WEBP",
  "french vulcan feu": "IMG_9613.WEBP",
  "french vulcan sable brown": "IMG_9693.WEBP",
  "Gentlemen givenchy boise": "IMG_9666.WEBP",
  "Gentlemen givenchy Paris": "GentlemanParis.avif",
  "Invictus victory exterme": "IMG_9655.PNG",
  "Marly layton": "IMG_9647.JPG.jpeg",
  "Marly castley" : "MarleyCastley.jpg",
  "Tomford ombre leather": "IMG_9614.WEBP",
  "Tomford white suede": "whiteSuede.jpg",
  "Turathi blue": "turathiBlue.webp",
  "Turathi Electric": "Turathi.webp",
  "Liquid Brun" : "liquidBrown.webp",
  "Valentino men born in roma": "IMG_9678.JPG.jpeg",
  "Mexican Tobacco" : "MexicanTobacco.jpg",
  "Cuban Tobacco" : "CubanTobacco.webp",
  "Jamaican Tobacco" : "JamaicanTobacco.webp",
  "Greek Tobacco" : "GreekTobacco.webp",
  "Brazilian Tobacco": "BrazillianTobacco.png",
  "Tobacco extrait de parfum": "ARABIANTOBACCO.webp",
  "Spanish Tobacco" : "spanishTobacco.webp",
  "French Tobacco" : "frenchTobacco.webp",
  "Dominican Tobacco" : "dominicanTobacco.webp",
  "Tomford ebume fume" : "TomFordEbene.avif",
  "9AM Dive" : "IMG_9668.JPG.jpeg"
};


const client = await pool.connect();

try {
  await client.query("BEGIN");

  let updated = 0;
  let missingFiles = 0;
  let unmatchedProducts = 0;

  for (const [productName, filename] of Object.entries(imageMap)) {
    const fullPath = path.join(imageFolder, filename);

    if (!fs.existsSync(fullPath)) {
      console.log(`IMAGE FILE NOT FOUND: ${filename}`);
      missingFiles++;
      continue;
    }

    const imageUrl = `/images/perfumes/${filename}`;

    const result = await client.query(
      `UPDATE public.products
       SET image_url = $1
       WHERE LOWER(TRIM(name)) = LOWER(TRIM($2))
       RETURNING id, name`,
      [imageUrl, productName]
    );

    if (result.rowCount === 0) {
      console.log(`PRODUCT NOT FOUND: ${productName}`);
      unmatchedProducts++;
      continue;
    }

    updated += result.rowCount;
    console.log(`Updated ${result.rowCount}: ${productName}`);
  }

  await client.query("COMMIT");

  console.log("\nImage update finished.");
  console.log(`Product rows updated: ${updated}`);
  console.log(`Missing image files: ${missingFiles}`);
  console.log(`Unmatched product names: ${unmatchedProducts}`);
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Update failed; changes rolled back:", error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
