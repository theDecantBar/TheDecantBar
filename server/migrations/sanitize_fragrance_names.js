import pool from "../config/db.js";

/**
 * Normalizes and corrects luxury fragrance house titles and brands in the database.
 * Transforms typos (e.g. "Kilian angle share", "Creed mountain silver") into verified titles
 * and populates the official brand column matching Fragrantica perfume houses.
 */
export const PRODUCT_UPDATES = [
  { match: "Sauvage", name: "Sauvage Eau de Toilette", brand: "Dior" },
  { match: "Bleu de Chanel", name: "Bleu de Chanel Eau de Toilette", brand: "Chanel" },
  { match: "Tomford ombre leather", name: "Tom Ford Ombré Leather", brand: "Tom Ford" },
  { match: "Tomford ombre leather parfum", name: "Tom Ford Ombré Leather Parfum", brand: "Tom Ford" },
  { match: "Tomford ebume fume", name: "Tom Ford Ébène Fumé", brand: "Tom Ford" },
  { match: "Tom ford tuscan leather", name: "Tom Ford Tuscan Leather", brand: "Tom Ford" },
  { match: "Tomford white suede", name: "Tom Ford White Suede", brand: "Tom Ford" },
  { match: "Tomford Grey Vetiver", name: "Tom Ford Grey Vetiver", brand: "Tom Ford" },
  { match: "Creed aventus", name: "Creed Aventus", brand: "Creed" },
  { match: "Creed aventus absolu", name: "Creed Absolu Aventus", brand: "Creed" },
  { match: "Creed Irish", name: "Creed Green Irish Tweed", brand: "Creed" },
  { match: "Creed mountain silver", name: "Creed Silver Mountain Water", brand: "Creed" },
  { match: "Creed orijinal vetivar", name: "Creed Original Vetiver", brand: "Creed" },
  { match: "Azzaro most wanted Parfum", name: "Azzaro The Most Wanted Parfum", brand: "Azzaro" },
  { match: "Azzaro most wanted Intense", name: "Azzaro The Most Wanted Intense", brand: "Azzaro" },
  { match: "Azzaro most wanted night", name: "Azzaro Wanted by Night", brand: "Azzaro" },
  { match: "Valentino born in roma green stravaganza", name: "Valentino Born in Roma Green Stravaganza", brand: "Valentino" },
  { match: "Valentino men Uomo", name: "Valentino Uomo", brand: "Valentino" },
  { match: "Valentino coral", name: "Valentino Born in Roma Coral Fantasy", brand: "Valentino" },
  { match: "Valentino men born in roma", name: "Valentino Uomo Born in Roma", brand: "Valentino" },
  { match: "Baccarat rouge 540", name: "Maison Francis Kurkdjian Baccarat Rouge 540", brand: "Maison Francis Kurkdjian" },
  { match: "YSL L Homme", name: "YSL L'Homme", brand: "Yves Saint Laurent" },
  { match: "YSL L Homme Le Parfum", name: "YSL L'Homme Le Parfum", brand: "Yves Saint Laurent" },
  { match: "YSL Homme cologne blue", name: "YSL L'Homme Cologne Bleue", brand: "Yves Saint Laurent" },
  { match: "YSL Y", name: "YSL Y Eau de Parfum", brand: "Yves Saint Laurent" },
  { match: "YSL myself L'abslou parfum", name: "YSL MYSLF Le Parfum", brand: "Yves Saint Laurent" },
  { match: "Versace eros", name: "Versace Eros", brand: "Versace" },
  { match: "versace flame", name: "Versace Eros Flame", brand: "Versace" },
  { match: "Versace pour homme", name: "Versace Pour Homme", brand: "Versace" },
  { match: "Kilian blue moon", name: "Kilian Blue Moon Ginger Dash", brand: "Kilian" },
  { match: "Kilian angle share", name: "Kilian Angels' Share", brand: "Kilian" },
  { match: "kilian roses on ice", name: "Kilian Roses on Ice", brand: "Kilian" },
  { match: "Gentlemen givenchy boise", name: "Givenchy Gentleman Boisée", brand: "Givenchy" },
  { match: "Gentlemen givenchy paris", name: "Givenchy Gentleman Reserve Privée", brand: "Givenchy" },
  { match: "1 Million", name: "Paco Rabanne 1 Million", brand: "Paco Rabanne" },
  { match: "Christian Dior oud isphan", name: "Christian Dior Oud Ispahan", brand: "Dior" },
  { match: "Christian Dior OUD ISAPHAN", name: "Christian Dior Oud Ispahan", brand: "Dior" },
  { match: "Christian Dior Gris dior", name: "Christian Dior Gris Dior", brand: "Dior" },
  { match: "Dior sauvage Parfum", name: "Dior Sauvage Parfum", brand: "Dior" },
  { match: "Dior homme intense parfum", name: "Dior Homme Intense", brand: "Dior" },
  { match: "Dior sauvage elixer", name: "Dior Sauvage Elixir", brand: "Dior" },
  { match: "Xerjoff Accento", name: "Xerjoff Accento", brand: "Xerjoff" },
  { match: "Xerjoff Naxos", name: "Xerjoff Naxos", brand: "Xerjoff" },
  { match: "Xerjoff Erba Pura", name: "Xerjoff Erba Pura", brand: "Xerjoff" },
  { match: "Spicebomb viktor rolf", name: "Viktor&Rolf Spicebomb Extreme", brand: "Viktor&Rolf" },
  { match: "Invictus victory exterme", name: "Paco Rabanne Invictus Victory Extreme", brand: "Paco Rabanne" },
  { match: "Invictus legend", name: "Paco Rabanne Invictus Legend", brand: "Paco Rabanne" },
  { match: "Roberto canvalli splendid vanilla", name: "Roberto Cavalli Splendid Vanilla", brand: "Roberto Cavalli" },
  { match: "Marly layton", name: "Parfums de Marly Layton", brand: "Parfums de Marly" },
  { match: "Marly castley", name: "Parfums de Marly Carlisle", brand: "Parfums de Marly" },
  { match: "Mont blac explorar", name: "Montblanc Explorer", brand: "Montblanc" },
  { match: "Blue de chanel edp", name: "Bleu de Chanel Eau de Parfum", brand: "Chanel" },
  { match: "Oud Stallion", name: "Maison Crivelli Oud Stallion", brand: "Maison Crivelli" },
  { match: "ROJA Harrods", name: "Roja Parfums Harrods Exclusive", brand: "Roja Parfums" },
  { match: "Armani code", name: "Armani Code Eau de Parfum", brand: "Giorgio Armani" },
  { match: "Bentley intense", name: "Bentley for Men Intense", brand: "Bentley" },
  { match: "Maison Margiela REPLICA By the fire place", name: "Maison Margiela Replica By the Fireplace", brand: "Maison Margiela" },
  { match: "Maison Margiela REPLICA Lazy sunday morning", name: "Maison Margiela Replica Lazy Sunday Morning", brand: "Maison Margiela" },
  { match: "Maison Margiela REPLICA JazzClub", name: "Maison Margiela Replica Jazz Club", brand: "Maison Margiela" },
  { match: "Maison Margiela REPLICA WHEN THE RAIN STOP", name: "Maison Margiela Replica When the Rain Stops", brand: "Maison Margiela" },
  { match: "Maison Margiela REPLICA BEACH WALK", name: "Maison Margiela Replica Beach Walk", brand: "Maison Margiela" },
  { match: "Maison Margiela REPLICA DANCING ON THE MOON", name: "Maison Margiela Replica Dancing on the Moon", brand: "Maison Margiela" },
  { match: "Maison Margiela REPLICA SAILING DAY", name: "Maison Margiela Replica Sailing Day", brand: "Maison Margiela" },
  { match: "Maison Margiela REPLICA Flower Market", name: "Maison Margiela Replica Flower Market", brand: "Maison Margiela" },
  { match: "French avenue Baie EDP", name: "French Avenue Baie 19", brand: "French Avenue" },
  { match: "french vulcan feu", name: "French Avenue Vulcan Feu", brand: "French Avenue" },
  { match: "french vulcan sable brown", name: "French Avenue Vulcan Sable Brun", brand: "French Avenue" },
  { match: "turathi electric", name: "Afnan Turathi Electric", brand: "Afnan" },
  { match: "Turathi blue", name: "Afnan Turathi Blue", brand: "Afnan" },
  { match: "Armaf Club de nuit intense", name: "Armaf Club de Nuit Intense Man", brand: "Armaf" },
  { match: "Armaf omb d'or", name: "Armaf Ombre D'Or", brand: "Armaf" },
  { match: "Afnan supermacy not only intense", name: "Afnan Supremacy Not Only Intense", brand: "Afnan" },
  { match: "Afnan supermacy collector edition", name: "Afnan Supremacy Collector's Edition", brand: "Afnan" },
  { match: "Hawas Ice", name: "Rasasi Hawas Ice", brand: "Rasasi" },
  { match: "Hawas tropical", name: "Rasasi Hawas Tropical", brand: "Rasasi" },
  { match: "Hawas for him", name: "Rasasi Hawas for Him", brand: "Rasasi" },
  { match: "Hawas elixer", name: "Rasasi Hawas Elixir", brand: "Rasasi" },
  { match: "Hawas Fire", name: "Rasasi Hawas Fire", brand: "Rasasi" },
  { match: "Hawas verde", name: "Rasasi Hawas Verde", brand: "Rasasi" },
  { match: "Hawas black", name: "Rasasi Hawas Black", brand: "Rasasi" },
  { match: "Hawas Malibu", name: "Rasasi Hawas Malibu", brand: "Rasasi" },
  { match: "Hawas kobra", name: "Rasasi Hawas Cobra", brand: "Rasasi" },
  { match: "lattafa khamrah qahwa", name: "Lattafa Khamrah Qahwa", brand: "Lattafa Perfumes" },
  { match: "sharaf blend the club", name: "Zimaya Sharaf Blend The Club", brand: "Zimaya" },
  { match: "sharaf blend", name: "Zimaya Sharaf Blend", brand: "Zimaya" },
  { match: "Jean Lowe ombre", name: "Maison Alhambra Jean Lowe Ombre", brand: "Maison Alhambra" },
  { match: "Afnan 9PM", name: "Afnan 9 PM", brand: "Afnan" },
  { match: "9PM ELIXER", name: "Afnan 9 PM Elixir", brand: "Afnan" },
  { match: "9PM night out", name: "Afnan 9 PM Night Out", brand: "Afnan" },
  { match: "9AM Dive", name: "Afnan 9 AM Dive", brand: "Afnan" },
  { match: "9PM REBEL", name: "Afnan 9 PM Rebel", brand: "Afnan" },
  { match: "Liquid Brun", name: "French Avenue Liquid Brun", brand: "French Avenue" },
  { match: "Greek Tobacco", name: "Bespoke Greek Tobacco", brand: "Bespoke Collection" },
  { match: "Brazilian Tobacco", name: "Bespoke Brazilian Tobacco", brand: "Bespoke Collection" },
  { match: "Spanish Tobacco", name: "Bespoke Spanish Tobacco", brand: "Bespoke Collection" },
  { match: "French Tobacco", name: "Bespoke French Tobacco", brand: "Bespoke Collection" },
  { match: "Tobacco Extrait de Parfum", name: "Bespoke Tobacco Extrait de Parfum", brand: "Bespoke Collection" },
  { match: "Dominican Tobacco", name: "Bespoke Dominican Tobacco", brand: "Bespoke Collection" },
  { match: "Cuban Tobacco", name: "Bespoke Cuban Tobacco", brand: "Bespoke Collection" },
  { match: "Jamaican Tobacco", name: "Bespoke Jamaican Tobacco", brand: "Bespoke Collection" },
  { match: "Mexican Tobacco", name: "Bespoke Mexican Tobacco", brand: "Bespoke Collection" }
];

export async function runSanitization() {
  const client = await pool.connect();
  let updatedCount = 0;
  try {
    await client.query("BEGIN");

    for (const item of PRODUCT_UPDATES) {
      const res = await client.query(
        `UPDATE products 
         SET name = $1, brand = $2 
         WHERE LOWER(TRIM(name)) = LOWER(TRIM($3)) 
            OR LOWER(TRIM(name)) = LOWER(TRIM($1))`,
        [item.name, item.brand, item.match]
      );
      if (res.rowCount > 0) {
        updatedCount += res.rowCount;
      }
    }

    await client.query("COMMIT");
    console.log(`[Sanitize] Successfully updated ${updatedCount} products with authentic luxury names & brands.`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[Sanitize] Error sanitizing fragrance names:", err.message);
  } finally {
    client.release();
    try {
      await pool.end();
    } catch {}
  }
}

runSanitization()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
