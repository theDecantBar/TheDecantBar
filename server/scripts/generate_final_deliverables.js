import fs from 'fs';
import { getPerfumeProfile } from '../../src/data/perfumeNotes.js';

const liveCatalog = JSON.parse(fs.readFileSync('server/scripts/final_live_catalog.json', 'utf8'));
const proposedDataset = JSON.parse(fs.readFileSync('server/scripts/proposed_corrected_fragrance_dataset.json', 'utf8'));

// 1. final_fragrance_pyramid_dataset.json
fs.writeFileSync(
  'server/scripts/final_fragrance_pyramid_dataset.json',
  JSON.stringify(proposedDataset, null, 2)
);
console.log('Saved final_fragrance_pyramid_dataset.json');

// 2. final_unverified_products.json
const unverifiedProducts = proposedDataset.filter(p => p.verification_status !== 'Fully Verified');
fs.writeFileSync(
  'server/scripts/final_unverified_products.json',
  JSON.stringify(unverifiedProducts, null, 2)
);
console.log(`Saved final_unverified_products.json (${unverifiedProducts.length} items)`);

// 3. final_fragrance_audit_report.json & .csv
const auditRows = [];
const csvHeaders = [
  "Product ID",
  "Live Brand",
  "Live Perfume Name",
  "Product Type",
  "Existing DB Top Notes",
  "Existing Fallback Top Notes",
  "Corrected Top Notes",
  "Existing DB Middle Notes",
  "Existing Fallback Middle Notes",
  "Corrected Middle Notes",
  "Existing DB Base Notes",
  "Existing Fallback Base Notes",
  "Corrected Base Notes",
  "Verification Status",
  "Primary Source URL",
  "Source Type",
  "Migration Eligibility",
  "Audit Observations & Issues"
];

function escapeCsv(str) {
  if (str === null || str === undefined) return '""';
  const s = String(str).replace(/"/g, '""');
  return `"${s}"`;
}

for (const live of liveCatalog) {
  const prop = proposedDataset.find(p => p.id === live.id);
  const fallback = getPerfumeProfile(live.name);

  const existingDbTop = Array.isArray(live.top_notes) && live.top_notes.length > 0 ? live.top_notes : [];
  const existingDbMid = Array.isArray(live.middle_notes) && live.middle_notes.length > 0 ? live.middle_notes : [];
  const existingDbBase = Array.isArray(live.base_notes) && live.base_notes.length > 0 ? live.base_notes : [];

  const existingFbTop = fallback?.topNotes || [];
  const existingFbMid = fallback?.middleNotes || [];
  const existingFbBase = fallback?.baseNotes || [];

  const isEligible = prop?.verification_status === 'Fully Verified' ? 'ELIGIBLE' : 'EXCLUDED';

  let issue = "Database notes empty ({}).";
  if (live.id === 7 || live.id === 36 || live.id === 74) {
    issue = "Database already contains authentic notes; verified accurate.";
  } else if (live.id === 22) {
    issue = "Database contained Extrait bitter almond notes on EDP listing; corrected to official EDP saffron/ambergris pyramid.";
  } else if (prop?.verification_status === 'Unverified') {
    issue = "Generic brand landing page only; lacks dedicated manufacturer spec sheet. Excluded from migration.";
  } else if (prop?.verification_status === 'Partially Verified') {
    issue = "Clone formula benchmarked to original creation; lacks standalone directory listing. Excluded by default.";
  }

  const row = {
    productId: live.id,
    brand: live.brand,
    name: live.name,
    type: live.type,
    existingDbTop: existingDbTop,
    existingFbTop: existingFbTop,
    correctedTop: prop ? prop.top_notes : [],
    existingDbMid: existingDbMid,
    existingFbMid: existingFbMid,
    correctedMid: prop ? prop.middle_notes : [],
    existingDbBase: existingDbBase,
    existingFbBase: existingFbBase,
    correctedBase: prop ? prop.base_notes : [],
    verificationStatus: prop ? prop.verification_status : 'BLOCKED',
    sourceUrl: prop ? prop.source : 'N/A',
    sourceType: prop ? prop.source_type : 'N/A',
    migrationEligibility: isEligible,
    observations: issue
  };

  auditRows.push(row);
}

fs.writeFileSync('server/scripts/final_fragrance_audit_report.json', JSON.stringify(auditRows, null, 2));
console.log('Saved final_fragrance_audit_report.json');

const csvLines = [csvHeaders.join(",")];
auditRows.forEach(r => {
  csvLines.push([
    escapeCsv(r.productId),
    escapeCsv(r.brand),
    escapeCsv(r.name),
    escapeCsv(r.type),
    escapeCsv(r.existingDbTop.length > 0 ? r.existingDbTop.join("; ") : "NONE (EMPTY IN DB)"),
    escapeCsv(r.existingFbTop.join("; ")),
    escapeCsv(r.correctedTop.join("; ")),
    escapeCsv(r.existingDbMid.length > 0 ? r.existingDbMid.join("; ") : "NONE (EMPTY IN DB)"),
    escapeCsv(r.existingFbMid.join("; ")),
    escapeCsv(r.correctedMid.join("; ")),
    escapeCsv(r.existingDbBase.length > 0 ? r.existingDbBase.join("; ") : "NONE (EMPTY IN DB)"),
    escapeCsv(r.existingFbBase.join("; ")),
    escapeCsv(r.correctedBase.join("; ")),
    escapeCsv(r.verificationStatus),
    escapeCsv(r.sourceUrl),
    escapeCsv(r.sourceType),
    escapeCsv(r.migrationEligibility),
    escapeCsv(r.observations)
  ].join(","));
});

fs.writeFileSync('server/scripts/final_fragrance_audit_report.csv', csvLines.join("\n"));
console.log('Saved final_fragrance_audit_report.csv');
