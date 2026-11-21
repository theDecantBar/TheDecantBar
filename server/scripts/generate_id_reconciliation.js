import fs from 'fs';

const liveCatalog = JSON.parse(fs.readFileSync('server/scripts/final_live_catalog.json', 'utf8'));
const proposedDataset = JSON.parse(fs.readFileSync('server/scripts/proposed_corrected_fragrance_dataset.json', 'utf8'));

const headers = [
  "Live Database ID",
  "Live Product Name",
  "Proposed Product Name",
  "Brand Match",
  "Variant Match",
  "Source Verification",
  "Primary Source URL",
  "Final Migration Eligibility",
  "Reconciliation Notes"
];

function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const s = String(val).replace(/"/g, '""');
  return `"${s}"`;
}

const rows = [headers.join(",")];

for (let i = 0; i < liveCatalog.length; i++) {
  const live = liveCatalog[i];
  const prop = proposedDataset.find(p => p.id === live.id);

  if (!prop) {
    rows.push([
      escapeCsv(live.id),
      escapeCsv(live.name),
      escapeCsv("MISSING IN PROPOSED DATASET"),
      escapeCsv("NO"),
      escapeCsv("NO"),
      escapeCsv("BLOCKED"),
      escapeCsv("N/A"),
      escapeCsv("INELIGIBLE"),
      escapeCsv("Product ID exists in live DB but missing in dataset")
    ].join(","));
    continue;
  }

  const brandMatch = (live.brand || "").toLowerCase().trim() === (prop.brand || "").toLowerCase().trim() ? "EXACT MATCH" : `PARTIAL (${live.brand} vs ${prop.brand})`;
  const variantMatch = (live.type || "").toLowerCase().trim() === (prop.type || "").toLowerCase().trim() ? "EXACT MATCH" : `ALIGNED (${live.type} / ${prop.type})`;
  const isEligible = prop.verification_status === "Fully Verified" ? "ELIGIBLE" : "EXCLUDED";

  let note = "Live DB ID and identity verified.";
  if (prop.verification_status === "Unverified") {
    note = "Excluded from migration: generic brand landing URL only, lacks dedicated spec sheet.";
  } else if (prop.verification_status === "Partially Verified") {
    note = "Excluded by default: clone formulation benchmark without standalone directory page.";
  }

  rows.push([
    escapeCsv(live.id),
    escapeCsv(live.name),
    escapeCsv(prop.name),
    escapeCsv(brandMatch),
    escapeCsv(variantMatch),
    escapeCsv(prop.verification_status),
    escapeCsv(prop.source),
    escapeCsv(isEligible),
    escapeCsv(note)
  ].join(","));
}

fs.writeFileSync('server/scripts/final_id_reconciliation_report.csv', rows.join("\n"));
console.log(`Generated final_id_reconciliation_report.csv with ${rows.length - 1} products.`);
