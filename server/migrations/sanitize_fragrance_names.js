import pool from "../config/db.js";

/**
 * Normalizes and corrects luxury fragrance house titles and spelling errors in the database.
 * Transforms typos (e.g. "Kilian angle share", "Creed mountain silver") into verified titles.
 */
export const NAME_CORRECTIONS = {
  "Tomford ombre leather": "Tom Ford Ombré Leather",
  "Tomford ombre leather parfum": "Tom Ford Ombré Leather Parfum",
  "Tomford ebume fume": "Tom Ford Ébène Fumé",
  "Tom ford tuscan leather": "Tom Ford Tuscan Leather",
  "Tomford white suede": "Tom Ford White Suede",
  "Tomford Grey Vetiver": "Tom Ford Grey Vetiver",
  "Creed aventus": "Creed Aventus",
  "Creed aventus absolu": "Creed Absolu Aventus",
  "Creed Irish": "Creed Green Irish Tweed",
  "Creed mountain silver": "Creed Silver Mountain Water",
  "Creed orijinal vetivar": "Creed Original Vetiver",
  "Azzaro most wanted Parfum": "Azzaro The Most Wanted Parfum",
  "Azzaro most wanted Intense": "Azzaro The Most Wanted Intense",
  "Azzaro most wanted night": "Azzaro Wanted by Night",
  "Valentino born in roma green stravaganza": "Valentino Born in Roma Green Stravaganza",
  "Valentino men Uomo": "Valentino Uomo",
  "Valentino coral": "Valentino Born in Roma Coral Fantasy",
  "Valentino men born in roma": "Valentino Uomo Born in Roma",
  "Baccarat rouge 540": "Maison Francis Kurkdjian Baccarat Rouge 540",
  "YSL L Homme": "YSL L'Homme",
  "YSL L Homme Le Parfum": "YSL L'Homme Le Parfum",
  "YSL Homme cologne blue": "YSL L'Homme Cologne Bleue",
  "YSL Y": "YSL Y Eau de Parfum",
  "YSL myself L'abslou parfum": "YSL MYSLF Le Parfum",
  "Versace eros": "Versace Eros",
  "versace flame": "Versace Eros Flame",
  "Versace pour homme": "Versace Pour Homme",
  "Kilian blue moon": "Kilian Blue Moon Ginger Dash",
  "Kilian angle share": "Kilian Angels' Share",
  "kilian roses on ice": "Kilian Roses on Ice",
  "Gentlemen givenchy boise": "Givenchy Gentleman Boisée",
  "Gentlemen givenchy paris": "Givenchy Gentleman Reserve Privée",
  "1 Million": "Paco Rabanne 1 Million",
  "Christian Dior oud isphan": "Christian Dior Oud Ispahan",
  "Christian Dior Gris dior": "Christian Dior Gris Dior",
  "Dior sauvage Parfum": "Dior Sauvage Parfum",
  "Dior homme intense parfum": "Dior Homme Intense",
  "Dior sauvage elixer": "Dior Sauvage Elixir",
  "Xerjoff Accento": "Xerjoff Accento",
  "Xerjoff Naxos": "Xerjoff Naxos",
  "Xerjoff Erba Pura": "Xerjoff Erba Pura",
  "Spicebomb viktor rolf": "Viktor&Rolf Spicebomb Extreme",
  "Invictus victory exterme": "Paco Rabanne Invictus Victory Extreme",
  "Invictus legend": "Paco Rabanne Invictus Legend",
  "Roberto canvalli splendid vanilla": "Roberto Cavalli Splendid Vanilla",
  "Marly layton": "Parfums de Marly Layton",
  "Marly castley": "Parfums de Marly Carlisle",
  "Mont blac explorar": "Montblanc Explorer",
  "Blue de chanel edp": "Bleu de Chanel Eau de Parfum",
  "Oud Stallion": "Maison Crivelli Oud Stallion",
  "ROJA Harrods": "Roja Parfums Harrods Exclusive",
  "Armani code": "Armani Code Parfum",
  "Bentley intense": "Bentley for Men Intense",
  "Maison Margiela REPLICA By the fire place": "Maison Margiela Replica By the Fireplace",
  "Maison Margiela REPLICA Lazy sunday morning": "Maison Margiela Replica Lazy Sunday Morning",
  "Maison Margiela REPLICA JazzClub": "Maison Margiela Replica Jazz Club",
  "Maison Margiela REPLICA WHEN THE RAIN STOP": "Maison Margiela Replica When the Rain Stops",
  "Maison Margiela REPLICA BEACH WALK": "Maison Margiela Replica Beach Walk",
  "Maison Margiela REPLICA DANCING ON THE MOON": "Maison Margiela Replica Dancing on the Moon",
  "Maison Margiela REPLICA SAILING DAY": "Maison Margiela Replica Sailing Day",
  "Maison Margiela REPLICA Flower Market": "Maison Margiela Replica Flower Market",
  "French avenue Baie EDP": "French Avenue Baie 19",
  "french vulcan feu": "French Avenue Vulcan Feu",
  "french vulcan sable brown": "French Avenue Vulcan Sable Brun",
  "turathi electric": "Afnan Turathi Electric",
  "Turathi blue": "Afnan Turathi Blue",
  "Armaf Club de nuit intense": "Armaf Club de Nuit Intense Man",
  "Armaf omb d'or": "Armaf Ombre D'Or",
  "Afnan supermacy not only intense": "Afnan Supremacy Not Only Intense",
  "Afnan supermacy collector edition": "Afnan Supremacy Collector's Edition",
  "Hawas Ice": "Rasasi Hawas Ice",
  "Hawas tropical": "Rasasi Hawas Tropical",
  "Hawas for him": "Rasasi Hawas for Him",
  "Hawas elixer": "Rasasi Hawas Elixir",
  "Hawas Fire": "Rasasi Hawas Fire",
  "Hawas verde": "Rasasi Hawas Verde",
  "Hawas black": "Rasasi Hawas Black",
  "Hawas Malibu": "Rasasi Hawas Malibu",
  "Hawas kobra": "Rasasi Hawas Cobra",
  "lattafa khamrah qahwa": "Lattafa Khamrah Qahwa",
  "sharaf blend the club": "Zimaya Sharaf Blend The Club",
  "sharaf blend": "Zimaya Sharaf Blend",
  "Jean Lowe ombre": "Maison Alhambra Jean Lowe Ombre",
  "Afnan 9PM": "Afnan 9 PM",
  "9PM ELIXER": "Afnan 9 PM Elixir",
  "9PM night out": "Afnan 9 PM Night Out",
  "9PM Dive": "Afnan 9 PM Dive",
  "9PM REBEL": "Afnan 9 PM Rebel",
  "Liquid Brun": "French Avenue Liquid Brun",
  "Greek Tabacco": "Bespoke Greek Tobacco",
  "Brazilan Tabacco": "Bespoke Brazilian Tobacco",
  "Spanish Tabacco": "Bespoke Spanish Tobacco",
  "French Tabacco": "Bespoke French Tobacco",
  "Tabacco extrait de parfum": "Bespoke Tobacco Extrait de Parfum",
  "Dominican Tabacco": "Bespoke Dominican Tobacco",
  "Cuban Tabacco": "Bespoke Cuban Tobacco",
  "Jamacian Tabacco": "Bespoke Jamaican Tobacco",
  "Mexican Tabacco": "Bespoke Mexican Tobacco",
};

export async function runSanitization() {
  const client = await pool.connect();
  let updatedCount = 0;
  try {
    await client.query("BEGIN");

    for (const [oldName, newName] of Object.entries(NAME_CORRECTIONS)) {
      const res = await client.query(
        "UPDATE products SET name = $1 WHERE LOWER(TRIM(name)) = LOWER(TRIM($2))",
        [newName, oldName]
      );
      if (res.rowCount > 0) {
        updatedCount += res.rowCount;
      }
    }

    await client.query("COMMIT");
    console.log(`[Sanitize] Successfully updated ${updatedCount} fragrance title(s) to official luxury standards.`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[Sanitize] Error sanitizing fragrance names:", err.message);
  } finally {
    client.release();
  }
}

// Allow standalone CLI execution: node server/migrations/sanitize_fragrance_names.js
if (process.argv[1]?.endsWith("sanitize_fragrance_names.js")) {
  runSanitization().then(() => process.exit(0)).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

