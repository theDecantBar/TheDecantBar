import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const { Workbook, SpreadsheetFile } = globalThis.artifact;
const root = "D:/thedecantbar website/TheDecantBar";
const outputDir = `${root}/outputs/2026-11-22-catalog-business-data`;
const outputPath = `${outputDir}/TheDecantBar_Catalog_Business_Data.xlsx`;
const tempDir = "C:/Users/laksh/AppData/Local/Temp";

const { KNOWN_PERFUMES } = await import(
  pathToFileURL(`${root}/src/data/perfumeNotes.js`).href
);
const catalog = JSON.parse(
  fs.readFileSync(`${root}/server/reports/final_fragrance_verification/live_catalog_99.json`, "utf8")
);
const localNotesMap = JSON.parse(
  fs.readFileSync(`${root}/src/data/localNotesMap.json`, "utf8")
);

function extractLiteral(filePath, marker, endMarker, endExtra = 0) {
  const source = fs.readFileSync(filePath, "utf8");
  const start = source.indexOf(marker) + marker.length;
  const end = source.indexOf(endMarker, start) + endExtra;
  if (start < marker.length || end < endExtra) {
    throw new Error(`Could not locate data literal in ${filePath}`);
  }
  return vm.runInNewContext(`(${source.slice(start, end).trim().replace(/;$/, "")})`);
}

const vm = await import("node:vm");
const seedProducts = extractLiteral(
  `${root}/server/scripts/seedProducts.js`,
  "const products = ",
  "\n];",
  2
);
const imageMap = extractLiteral(
  `${root}/server/scripts/updateProductImages.js`,
  "const imageMap = ",
  "\n};",
  2
);
const aliasMap = extractLiteral(
  `${root}/src/data/fragranceNotesData.jsx`,
  "const NOTE_IMAGE_ALIASES = ",
  "\n};",
  2
);

const compact = (value) => String(value ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]/g, "");
const profileByName = new Map(KNOWN_PERFUMES.map((profile) => [compact(profile.name), profile]));

// These exact aliases resolve catalog labels that differ from the profile's historical label.
const profileOverrides = {
  rojaparfumsharrodsexclusive: "ROJA Harrods",
  versaceerosflame: "versace flame",
  rasasihawasic: "Hawas Ice",
  rasasihawastropical: "Hawas tropical",
  rasasihawasforhim: "Hawas for him",
  rasasihawaselixir: "Hawas elixer",
  rasasihawasfire: "Hawas Fire",
  rasasihawasverde: "Rasasi Hawas Verde",
  rasasihawasblack: "Hawas black",
  rasasihawasmalibu: "Hawas Malibu",
  rasasihawascobra: "Hawas kobra",
  afnan9pm: "Afnan 9PM",
  afnan9pmelixir: "9PM ELIXER",
  afnan9pmnightout: "9PM night out",
  afnan9amdive: "9AM Dive",
  zimayasharafblendtheclub: "sharaf blend the club",
  zimayasharafblend: "sharaf blend",
  creedorijinalvetivar: "Creed Original Vetiver",
  creedaventusabsolu: "Creed Absolu Aventus",
  creedmountainsilver: "Creed Silver Mountain Water",
  tomfordebumefume: "Tom Ford Ébène Fumé",
};

function profileFor(name) {
  const key = compact(name);
  const override = profileOverrides[key];
  if (override) return profileByName.get(compact(override)) ?? null;

  const candidates = KNOWN_PERFUMES.map((profile) => ({
    profile,
    keys: [profile.name, `${profile.brand ?? ""} ${profile.name}`, ...(profile.matches ?? [])]
      .map(compact)
      .filter(Boolean),
  }));
  const exact = candidates.find(({ keys }) => keys.includes(key));
  if (exact) return exact.profile;

  const partial = candidates
    .map(({ profile, keys }) => ({
      profile,
      matchedLength: Math.max(
        0,
        ...keys.filter((candidate) => candidate.length >= 5 && (key.includes(candidate) || candidate.includes(key)))
          .map((candidate) => candidate.length)
      ),
    }))
    .filter((candidate) => candidate.matchedLength > 0)
    .sort((a, b) => b.matchedLength - a.matchedLength);
  return partial[0]?.profile ?? null;
}

const productImageMap = new Map();
for (const [mappedName, fileName] of Object.entries(imageMap)) {
  const profile = profileFor(mappedName);
  if (!profile) continue;
  const filePath = `${root}/public/images/perfumes/${fileName}`;
  if (fs.existsSync(filePath)) productImageMap.set(profile.name, `/images/perfumes/${fileName}`);
}

const seedByProfile = new Map();
for (const entry of seedProducts) {
  const profile = profileFor(entry.name);
  if (!profile) continue;
  const list = seedByProfile.get(profile.name) ?? [];
  list.push(entry);
  seedByProfile.set(profile.name, list);
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function accordName(value) {
  return typeof value === "string" ? value : String(value?.name ?? "");
}

function sourceNotes(dbRow, profile, group) {
  const dbValues = arrayOrEmpty(dbRow[group]);
  const profileKey = { top_notes: "topNotes", middle_notes: "middleNotes", base_notes: "baseNotes" }[group];
  if (profile && /(baccarat\s+rouge\s+540|hawas\s+verde)/i.test(dbRow.name ?? "")) {
    return arrayOrEmpty(profile[profileKey]);
  }
  return dbValues.length ? dbValues : arrayOrEmpty(profile?.[profileKey]);
}

function bestEntry(scores, keys) {
  const list = keys.map((key) => [key, Number(scores?.[key] ?? 0)]);
  if (!list.some(([, value]) => value > 0)) return ["", ""];
  list.sort((a, b) => b[1] - a[1]);
  return [list[0][0], list[0][1]];
}

function rankedLines(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function localNoteImage(note) {
  const key = String(note ?? "").trim().toLowerCase();
  let imagePath;
  if (Object.prototype.hasOwnProperty.call(localNotesMap, key)) {
    imagePath = localNotesMap[key];
  } else if (Object.prototype.hasOwnProperty.call(aliasMap, key)) {
    imagePath = aliasMap[key];
  } else {
    const safeSlug = key.replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
    imagePath = localNotesMap[safeSlug] ?? null;
  }
  if (!imagePath) return "";
  const diskPath = path.join(root, "public", imagePath.replace(/^\//, ""));
  return fs.existsSync(diskPath) ? imagePath : "";
}

const sortedCatalog = [...catalog].sort((a, b) =>
  String(a.name ?? "").localeCompare(String(b.name ?? ""), "en", { sensitivity: "base" })
);

const recordRows = sortedCatalog.map((row, index) => {
  const profile = profileFor(row.name);
  const notes = {
    top: sourceNotes(row, profile, "top_notes"),
    middle: sourceNotes(row, profile, "middle_notes"),
    base: sourceNotes(row, profile, "base_notes"),
  };
  const dbAccords = arrayOrEmpty(row.accords);
  const useProfileAccords = /hawas\s+verde/i.test(row.name ?? "");
  const accords = (dbAccords.length && !useProfileAccords
    ? dbAccords
    : arrayOrEmpty(profile?.accords)).map(accordName).filter(Boolean);
  const description = String(row.description ?? "").trim() || String(profile?.description ?? "").trim();
  const seasonScores = row.when_to_wear && Object.keys(row.when_to_wear).length
    ? row.when_to_wear
    : profile?.whenToWear;
  const [bestSeason, seasonScore] = bestEntry(seasonScores, ["winter", "spring", "summer", "fall"]);
  const [bestTime, timeScore] = bestEntry(seasonScores, ["day", "night"]);
  const seedOptions = profile ? (seedByProfile.get(profile.name) ?? []) : [];
  const seed = seedOptions.find((entry) => entry.variants?.length) ?? seedOptions[0] ?? null;
  const variants = seed?.variants ?? [];
  const noteNames = [...notes.top, ...notes.middle, ...notes.base].map(String);
  const missingNotePhotos = [...new Set(noteNames.filter((note) => !localNoteImage(note)))];
  const imagePath = String(row.image_url ?? "").trim() || (profile ? productImageMap.get(profile.name) ?? "" : "");
  const localPhotoExists = imagePath.startsWith("/images/")
    ? fs.existsSync(path.join(root, "public", imagePath.replace(/^\//, "")))
    : Boolean(imagePath);
  const profileNotesPresent = noteNames.length > 0;
  const databaseNotesPresent = ["top_notes", "middle_notes", "base_notes"]
    .some((key) => arrayOrEmpty(row[key]).length > 0);
  const databaseAccordsPresent = dbAccords.length > 0;
  const databaseDescriptionPresent = Boolean(String(row.description ?? "").trim());
  const databaseSeasonPresent = Boolean(row.when_to_wear && Object.keys(row.when_to_wear).length);
  const databaseVariantsPresent = Array.isArray(row.variants) && row.variants.length > 0;
  const databasePhotoPresent = Boolean(String(row.image_url ?? "").trim());

  return {
    serial: index + 1,
    dbId: row.id ?? "",
    dbName: row.name ?? "",
    profileName: profile?.name ?? "",
    brand: row.brand ?? "",
    type: row.type ?? "",
    category: row.category ?? "",
    gender: row.gender ?? "",
    weatherInDb: row.weather ?? "",
    accords,
    topNotes: notes.top,
    middleNotes: notes.middle,
    baseNotes: notes.base,
    bestSeason,
    seasonScore,
    bestTime,
    timeScore,
    description,
    descriptionSource: databaseDescriptionPresent ? "Database snapshot" : profile?.description ? "Code profile fallback" : "",
    profileStatus: profile?.verificationStatus ?? "",
    profileSourceUrl: profile?.sourceUrl ?? "",
    variants,
    sizes: variants.map((variant) => Number(variant.size_ml)).filter(Number.isFinite).sort((a, b) => a - b),
    priceSource: variants.length ? "server/scripts/seedProducts.js (code snapshot)" : "",
    productPhotoPresent: localPhotoExists ? "Yes" : "",
    productPhotoPath: imagePath,
    notePhotosPresent: profileNotesPresent && missingNotePhotos.length === 0 ? "Yes" : "",
    missingNotePhotos: missingNotePhotos.join(", "),
    websiteDescriptionPresent: description ? "Yes" : "",
    websiteNotesPresent: profileNotesPresent ? "Yes" : "",
    websiteAccordsPresent: accords.length ? "Yes" : "",
    profileMatched: profile ? "Yes" : "",
    dbDescriptionPresent: databaseDescriptionPresent ? "Yes" : "",
    dbNotesPresent: databaseNotesPresent ? "Yes" : "",
    dbAccordsPresent: databaseAccordsPresent ? "Yes" : "",
    dbSeasonPresent: databaseSeasonPresent ? "Yes" : "",
    dbVariantsPresent: databaseVariantsPresent ? "Yes" : "",
    dbPhotoPresent: databasePhotoPresent ? "Yes" : "",
    notesSource: databaseNotesPresent ? "Database row, with profile fallback for empty tiers" : profileNotesPresent ? "Code profile fallback" : "",
    accordsSource: databaseAccordsPresent && !useProfileAccords ? "Database row" : accords.length ? "Code profile fallback" : "",
    seasonTimeSource: databaseSeasonPresent ? "Database when_to_wear" : seasonScores ? "Code profile whenToWear" : "",
    profile,
    row,
  };
});

const seedDetailRows = [];
for (const entry of seedProducts) {
  const profile = profileFor(entry.name);
  const catalogMatches = profile ? recordRows.filter((record) => record.profile?.name === profile.name) : [];
  const catalogName = catalogMatches.length === 1 ? catalogMatches[0].dbName : "";
  const catalogId = catalogMatches.length === 1 ? catalogMatches[0].dbId : "";
  for (const variant of entry.variants ?? []) {
    seedDetailRows.push({
      catalogName,
      catalogId,
      seedName: entry.name,
      matchedProfile: profile?.name ?? "",
      size: Number(variant.size_ml),
      price: Number(variant.price),
      matched: catalogName ? "Yes" : "",
    });
  }
}
seedDetailRows.sort((a, b) =>
  String(a.catalogName || a.seedName).localeCompare(String(b.catalogName || b.seedName), "en", { sensitivity: "base" }) || a.size - b.size
);

const noteUsers = new Map();
for (const record of recordRows) {
  for (const note of [...record.topNotes, ...record.middleNotes, ...record.baseNotes]) {
    const key = String(note).trim();
    if (!key) continue;
    const users = noteUsers.get(key) ?? new Set();
    users.add(record.dbName);
    noteUsers.set(key, users);
  }
}
const noteImageRows = [...noteUsers.entries()]
  .map(([note, users]) => ({ note, image: localNoteImage(note), users: [...users].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })) }))
  .sort((a, b) => a.note.localeCompare(b.note, "en", { sensitivity: "base" }));

const snapshotCounts = {
  catalogRecords: catalog.length,
  descriptionsInDb: recordRows.filter((record) => record.dbDescriptionPresent).length,
  notesInDb: recordRows.filter((record) => record.dbNotesPresent).length,
  accordsInDb: recordRows.filter((record) => record.dbAccordsPresent).length,
  seasonTimeInDb: recordRows.filter((record) => record.dbSeasonPresent).length,
  variantRowsInDb: recordRows.filter((record) => record.dbVariantsPresent).length,
  perfumePhotoUrlsInDb: recordRows.filter((record) => record.dbPhotoPresent).length,
  codeProductPhotos: recordRows.filter((record) => record.productPhotoPresent).length,
  codePrices: recordRows.filter((record) => record.variants.length).length,
  completeNotePhotoSets: recordRows.filter((record) => record.notePhotosPresent).length,
  uniqueNotes: noteImageRows.length,
  notesWithPhotos: noteImageRows.filter((item) => item.image).length,
};

const workbook = Workbook.create();
const catalogSheet = workbook.worksheets.add("Catalog");
const priceSheet = workbook.worksheets.add("Sizes & Prices");
const noteSheet = workbook.worksheets.add("Note Images");
const guideSheet = workbook.worksheets.add("Guide");

const brandDark = "#292722";
const brandGold = "#B69A62";
const paleGold = "#F4EFE4";
const textDark = "#2F2C27";
const muted = "#706A60";
const fontName = "Arial";

function setupSheet(sheet) {
  sheet.showGridLines = false;
  sheet.tabColor = brandGold;
}

function setTitle(sheet, title, subtitle, lastColumn) {
  sheet.getRange("A1").values = [[title]];
  sheet.getRange(`A1:${lastColumn}1`).format.font = { name: fontName, size: 15, bold: true, color: textDark };
  sheet.getRange("A1").format.rowHeight = 26;
  sheet.getRange("A2").values = [[subtitle]];
  sheet.getRange(`A2:${lastColumn}2`).format.font = { name: fontName, size: 9, italic: true, color: muted };
  sheet.getRange("A2").format.rowHeight = 28;
}

function columnLetter(number) {
  let n = number;
  let result = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    result = String.fromCharCode(65 + rem) + result;
    n = Math.floor((n - 1) / 26);
  }
  return result;
}

function formatTable(sheet, startRow, rowCount, headers, widths, tableName, freezeColumns = 2) {
  const lastRow = startRow + rowCount - 1;
  const lastCol = columnLetter(headers.length);
  const tableRange = `${columnLetter(1)}${startRow}:${lastCol}${lastRow}`;
  const table = sheet.tables.add(tableRange, true, tableName);
  table.style = "TableStyleLight1";
  sheet.getRange(`${columnLetter(1)}${startRow}:${lastCol}${startRow}`).format = {
    fill: brandDark,
    font: { name: fontName, size: 9, bold: true, color: "#FFFFFF" },
    wrapText: true,
    horizontalAlignment: "center",
    verticalAlignment: "center",
  };
  sheet.getRange(`${columnLetter(1)}${startRow}:${lastCol}${startRow}`).format.rowHeight = 42;
  if (rowCount > 1) {
    const body = sheet.getRange(`${columnLetter(1)}${startRow + 1}:${lastCol}${lastRow}`);
    body.format.font = { name: fontName, size: 9, color: textDark };
    body.format.fill = "#FFFFFF";
    body.format.verticalAlignment = "top";
    body.format.wrapText = true;
    body.format.borders = {
      insideHorizontal: { style: "thin", color: "#D7D2C8" },
      insideVertical: { style: "thin", color: "#D7D2C8" },
      top: { style: "thin", color: "#D7D2C8" },
      bottom: { style: "thin", color: "#D7D2C8" },
      left: { style: "thin", color: "#D7D2C8" },
      right: { style: "thin", color: "#D7D2C8" },
    };
  }
  for (let i = 0; i < widths.length; i++) {
    const col = columnLetter(i + 1);
    sheet.getRange(`${col}${startRow}:${col}${lastRow}`).format.columnWidth = widths[i];
  }
  sheet.freezePanes.freezeRows(startRow);
  if (freezeColumns > 0) sheet.freezePanes.freezeColumns(freezeColumns);
  return { lastRow, lastCol };
}

setupSheet(catalogSheet);
const priceSizes = [2, 5, 10, 20, 50];
const accordHeaders = Array.from({ length: 10 }, (_, index) => `Accord ${index + 1} (highest first)`);
const catalogHeaders = [
  "Serial",
  "DB ID",
  "Perfume Name (database snapshot)",
  "Profile Name (website fallback)",
  "Brand",
  "Type",
  "Category",
  "Gender",
  "Weather (database)",
  ...accordHeaders,
  "Top Notes (stored order)",
  "Middle Notes (stored order)",
  "Base Notes (stored order)",
  "Highest Season",
  "Season Score",
  "Highest Time",
  "Time Score",
  "Available Sizes (mL, seed code)",
  ...priceSizes.map((size) => `Price ${size} mL (₹)`),
  "Description (website/profile)",
  "Description in DB?",
  "Notes in DB?",
  "Accords in DB?",
  "Season/Time in DB?",
  "Sizes/Prices in DB snapshot?",
  "Perfume Photo URL in DB?",
  "Perfume Photo Present in Code?",
  "Perfume Photo File/URL",
  "All Note Photos Present?",
  "Missing Note Photos",
  "Description in Website Data?",
  "Notes in Website Data?",
  "Accords in Website Data?",
  "Notes Source",
  "Accords Source",
  "Season/Time Source",
  "Profile Verification Status",
  "Profile Source URL",
];
const catalogWidths = [7, 9, 35, 34, 18, 15, 17, 13, 18,
  ...Array(10).fill(19), 30, 27, 27, 22, 14, 20, 14, 23,
  ...Array(5).fill(16), 58, 16, 14, 14, 17, 20, 18, 21, 44, 21, 36,
  20, 20, 20, 43, 28, 28, 40, 56];
setupSheet(catalogSheet);
setTitle(
  catalogSheet,
  "The Decant Bar | Business Catalog",
  "Alphabetical catalog view. Database fields and website/code fallback values are shown separately. Blank presence cells mean the checked-in database snapshot did not contain that field.",
  columnLetter(catalogHeaders.length)
);
const catalogMatrix = [catalogHeaders];
for (const record of recordRows) {
  const priceBySize = new Map(record.variants.map((variant) => [Number(variant.size_ml), Number(variant.price)]));
  catalogMatrix.push([
    record.serial,
    record.dbId,
    record.dbName,
    record.profileName,
    record.brand,
    record.type,
    record.category,
    record.gender,
    record.weatherInDb,
    ...Array.from({ length: 10 }, (_, index) => record.accords[index] ? `${index + 1}. ${record.accords[index]}` : ""),
    rankedLines(record.topNotes),
    rankedLines(record.middleNotes),
    rankedLines(record.baseNotes),
    record.bestSeason,
    record.seasonScore,
    record.bestTime,
    record.timeScore,
    record.sizes.join(", "),
    ...priceSizes.map((size) => priceBySize.get(size) ?? null),
    record.description,
    record.dbDescriptionPresent,
    record.dbNotesPresent,
    record.dbAccordsPresent,
    record.dbSeasonPresent,
    record.dbVariantsPresent,
    record.dbPhotoPresent,
    record.productPhotoPresent,
    record.productPhotoPath,
    record.notePhotosPresent,
    record.missingNotePhotos,
    record.websiteDescriptionPresent,
    record.websiteNotesPresent,
    record.websiteAccordsPresent,
    record.notesSource,
    record.accordsSource,
    record.seasonTimeSource,
    record.profileStatus,
    record.profileSourceUrl,
  ]);
}
catalogSheet.getRangeByIndexes(3, 0, catalogMatrix.length, catalogHeaders.length).values = catalogMatrix;
const catalogTable = formatTable(catalogSheet, 4, catalogMatrix.length, catalogHeaders, catalogWidths, "CatalogTable", 3);
catalogSheet.getRange(`A5:B${catalogTable.lastRow}`).format.horizontalAlignment = "center";
catalogSheet.getRange(`J5:S${catalogTable.lastRow}`).format.verticalAlignment = "top";
catalogSheet.getRange(`T5:V${catalogTable.lastRow}`).format.wrapText = true;
catalogSheet.getRange(`X5:AB${catalogTable.lastRow}`).format.numberFormat = '"₹"#,##0';
catalogSheet.getRange(`W5:W${catalogTable.lastRow}`).format.horizontalAlignment = "center";
catalogSheet.getRange(`AC5:AZ${catalogTable.lastRow}`).format.wrapText = true;

setupSheet(priceSheet);
const priceHeaders = [
  "Catalog Name (matched)",
  "Catalog ID (matched)",
  "Seed Product Name",
  "Profile Name Matched",
  "Size (mL)",
  "Price (₹)",
  "Matched to Catalog?",
  "Live DB Variant Confirmed?",
  "Price Source",
];
setTitle(
  priceSheet,
  "Sizes and Prices",
  "Numeric prices copied from the current seed code. Live product_variants rows were not available in the checked-in database snapshot.",
  "I"
);
const priceMatrix = [priceHeaders, ...seedDetailRows.map((item) => [
  item.catalogName,
  item.catalogId,
  item.seedName,
  item.matchedProfile,
  item.size,
  item.price,
  item.matched,
  "",
  "server/scripts/seedProducts.js (code snapshot)",
])];
priceSheet.getRangeByIndexes(3, 0, priceMatrix.length, priceHeaders.length).values = priceMatrix;
const priceTable = formatTable(priceSheet, 4, priceMatrix.length, priceHeaders, [36, 12, 36, 32, 13, 16, 19, 23, 43], "PricesTable", 2);
priceSheet.getRange(`E5:E${priceTable.lastRow}`).format.numberFormat = "0 \"mL\"";
priceSheet.getRange(`F5:F${priceTable.lastRow}`).format.numberFormat = '"₹"#,##0';
priceSheet.getRange(`A5:B${priceTable.lastRow}`).format.wrapText = true;

setupSheet(noteSheet);
const noteHeaders = ["Serial", "Note Name", "Photo Present?", "Image Path", "Perfumes Using This Note", "Perfume Count"];
setTitle(
  noteSheet,
  "Note Photo Inventory",
  "Each unique note used by the website/profile note pyramids is listed once. A blank Photo Present cell means no mapped local file was found.",
  "F"
);
const noteMatrix = [noteHeaders, ...noteImageRows.map((item, index) => [
  index + 1,
  item.note,
  item.image ? "Yes" : "",
  item.image,
  item.users.join("; "),
  item.users.length,
])];
noteSheet.getRangeByIndexes(3, 0, noteMatrix.length, noteHeaders.length).values = noteMatrix;
const noteTable = formatTable(noteSheet, 4, noteMatrix.length, noteHeaders, [8, 28, 16, 44, 75, 15], "NoteImagesTable", 2);
noteSheet.getRange(`A5:A${noteTable.lastRow}`).format.horizontalAlignment = "center";
noteSheet.getRange(`C5:C${noteTable.lastRow}`).format.horizontalAlignment = "center";
noteSheet.getRange(`F5:F${noteTable.lastRow}`).format.horizontalAlignment = "center";

setupSheet(guideSheet);
setTitle(guideSheet, "Workbook Guide and Data Sources", "Read these notes before treating blanks or ranked values as verified live database values.", "B");
const guideRows = [
  ["Item", "Details"],
  ["Catalog records", snapshotCounts.catalogRecords],
  ["Descriptions present in DB snapshot", snapshotCounts.descriptionsInDb],
  ["Records with any note tiers in DB snapshot", snapshotCounts.notesInDb],
  ["Records with accords in DB snapshot", snapshotCounts.accordsInDb],
  ["Records with season/time scores in DB snapshot", snapshotCounts.seasonTimeInDb],
  ["Records with variant rows in DB snapshot", snapshotCounts.variantRowsInDb],
  ["Records with perfume image URLs in DB snapshot", snapshotCounts.perfumePhotoUrlsInDb],
  ["Perfume photos mapped to existing local files", snapshotCounts.codeProductPhotos],
  ["Products with seed-code prices matched", snapshotCounts.codePrices],
  ["Products with all note photos available", snapshotCounts.completeNotePhotoSets],
  ["Unique notes in website/profile pyramids", snapshotCounts.uniqueNotes],
  ["Unique notes with a local image file", snapshotCounts.notesWithPhotos],
  ["Database source", "server/reports/final_fragrance_verification/live_catalog_99.json (checked-in snapshot, created_at values show 2026-10-09). A live PostgreSQL read was unavailable during this workbook build."],
  ["Website/profile data", "src/data/perfumeNotes.js supplies the website fallback notes, accords, descriptions and whenToWear values when the database snapshot has no value."],
  ["Price source", "server/scripts/seedProducts.js. These are code-seed prices in INR, not confirmed current product_variants rows."],
  ["Perfume photo source", "server/scripts/updateProductImages.js plus local file existence under public/images/perfumes/. This verifies a local mapped asset, not the image currently served by production."],
  ["Note photo source", "src/data/localNotesMap.json and src/data/fragranceNotesData.jsx aliases, checked against files under public/images/notes/."],
  ["Accord order", "Accord 1 is the first/highest displayed rank, followed by the stored source order. The bar widths in the website are display styling, not measured percentages."],
  ["Note order", "The numbered notes preserve the stored order within each top/middle/base group. Fragrantica often lists the pyramid as a group and does not rank note strength within each group."],
  ["Best season and time", "Highest season and day/night are selected from the database when_to_wear values when present; otherwise from the code profile. Scores are app weighting inputs, not public consumer ratings."],
  ["Yes / blank markers", "Yes means the named source contained the field or a mapped local photo file was found. Blank means the checked-in source did not confirm it, so it needs review or filling."],
  ["Duplicates", "Every product row in the 99-row database snapshot is retained, including repeated names. Use DB ID to tell repeated rows apart."],
];
guideSheet.getRangeByIndexes(3, 0, guideRows.length, 2).values = guideRows;
guideSheet.getRange("A4:B4").format = {
  fill: brandDark,
  font: { name: fontName, size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
guideSheet.getRange(`A5:B${guideRows.length + 3}`).format.font = { name: fontName, size: 10, color: textDark };
guideSheet.getRange(`A5:A${guideRows.length + 3}`).format.columnWidth = 44;
guideSheet.getRange(`B5:B${guideRows.length + 3}`).format.columnWidth = 112;
guideSheet.getRange(`A5:B${guideRows.length + 3}`).format.wrapText = true;
guideSheet.getRange(`A5:B${guideRows.length + 3}`).format.verticalAlignment = "top";
guideSheet.getRange(`A5:B${guideRows.length + 3}`).format.borders = {
  insideHorizontal: { style: "thin", color: "#E6E1D8" },
  bottom: { style: "thin", color: "#E6E1D8" },
};
guideSheet.getRange(`A5:A${guideRows.length + 3}`).format.font = { name: fontName, size: 10, bold: true, color: textDark };
guideSheet.getRange("A4:B4").format.rowHeight = 28;
guideSheet.getRange(`A5:B${guideRows.length + 3}`).format.autofitRows();

workbook.recalculate();
const catalogInspect = await workbook.inspect({
  kind: "table",
  sheetId: "Catalog",
  range: "A1:K10",
  include: "values",
  tableMaxRows: 10,
  tableMaxCols: 11,
  maxChars: 2600,
});
const guideInspect = await workbook.inspect({
  kind: "region",
  sheetId: "Guide",
  range: "A1:B12",
  maxChars: 1800,
});
const catalogPreview = await workbook.render({ sheetName: "Catalog", range: "A1:Q9", scale: 1, format: "png" });
const pricesPreview = await workbook.render({ sheetName: "Sizes & Prices", range: "A1:I12", scale: 1, format: "png" });
const notesPreview = await workbook.render({ sheetName: "Note Images", range: "A1:F12", scale: 1, format: "png" });
const guidePreview = await workbook.render({ sheetName: "Guide", range: "A1:B15", scale: 1, format: "png" });
await fs.promises.writeFile(`${tempDir}/decantbar_catalog_preview.png`, new Uint8Array(await catalogPreview.arrayBuffer()));
await fs.promises.writeFile(`${tempDir}/decantbar_prices_preview.png`, new Uint8Array(await pricesPreview.arrayBuffer()));
await fs.promises.writeFile(`${tempDir}/decantbar_note_images_preview.png`, new Uint8Array(await notesPreview.arrayBuffer()));
await fs.promises.writeFile(`${tempDir}/decantbar_guide_preview.png`, new Uint8Array(await guidePreview.arrayBuffer()));
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(JSON.stringify({
  outputPath,
  summary: snapshotCounts,
  catalogRows: recordRows.length,
  priceRows: seedDetailRows.length,
  noteRows: noteImageRows.length,
  inspectCatalog: catalogInspect.ndjson,
  inspectGuide: guideInspect.ndjson,
}, null, 2));
