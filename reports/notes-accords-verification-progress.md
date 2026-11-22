# Perfume notes and accords verification

Date: 2026-11-22

This is a progress record for the 99 perfume profiles in `src/data/perfumeNotes.js`. The full item-by-item audit is still in progress. A status of “Verified against Fragrantica” means the note pyramid and accord ranking were checked against that specific source page; it does not mean performance, product photos, or the live database were checked.

## Corrections and source checks in this pass

| Product | Result | Source |
| --- | --- | --- |
| Bleu de Chanel Eau de Toilette | Separated from the EDP profile; restored its EDT pyramid and accord ranking. Generic “Bleu de Chanel” now resolves to EDT. | [Fragrantica EDT](https://www.fragrantica.com/perfume/Chanel/Bleu-de-Chanel-9099.html) |
| Bleu de Chanel Eau de Parfum | Corrected the EDP pyramid, including bergamot, aldehydes, coriander, amberwood, and the EDP accord order. | [Fragrantica EDP](https://www.fragrantica.com/perfume/Chanel/Bleu-de-Chanel-Eau-de-Parfum-25967.html) |
| Dior Sauvage Eau de Toilette | Added the omitted geranium and elemi heart notes, corrected the note labels and accord order, and made the EDT identity explicit. | [Fragrantica](https://www.fragrantica.com/perfume/Dior/Sauvage-31861.html) |
| Maison Alhambra Jean Lowe Ombre | Replaced the incorrect leather profile with oud, incense, rose, raspberry, saffron, birch, amber, benzoin, and geranium; removed aliases that pointed to unrelated leather scents. | [Fragrantica](https://www.fragrantica.com/perfume/Maison-Alhambra/Jean-Lowe-Ombre-91352.html) |
| Maison Crivelli Oud Stallion | Corrected the accords to Fragrantica’s ranked list. The pyramid matched the referenced page. | [Fragrantica](https://www.fragrantica.com/perfume/Maison-Crivelli/Oud-Stallion-83822.html) |
| French Avenue Vulcan Feu | Replaced the short, generic accord list with the source-ranked accords. Its note pyramid matched the source. | [Fragrantica](https://www.fragrantica.com/perfume/French-Avenue/Vulcan-Feu-105520.html) |
| French Avenue Vulcan Sable | Corrected the product name and note pyramid; removed the unsupported extra notes and aligned accords to the source ranking. | [Fragrantica](https://www.fragrantica.com/perfume/French-Avenue/Vulcan-Sable-105521.html) |
| Afnan Turathi Electric | Removed unsupported base notes and corrected the source-ranked accords. | [Fragrantica](https://www.fragrantica.com/perfume/Afnan/Turathi-Electric-108244.html) |
| Afnan Supremacy Collector’s Edition | Checked its exact 2024 product page; corrected “White Flowers” spelling and retained the published note pyramid and accord order. | [Fragrantica](https://www.fragrantica.com/perfume/Afnan/Supremacy-Collector-s-Edition-Pour-Homme-98689.html) |
| Rasasi Hawas Ice, Rasasi Hawas Elixir, Rasasi Hawas Fire, Rasasi Hawas Tropical, Rasasi Hawas Verde, and Rasasi Hawas Kobra | Checked the current note pyramids and accord order against their exact Fragrantica pages. Existing profile data matched those pages. | [Tropical](https://www.fragrantica.com/perfume/Rasasi/Hawas-Tropical-108054.html), [Elixir](https://www.fragrantica.com/perfume/Rasasi/Hawas-Elixir-110808.html), [Fire](https://www.fragrantica.com/perfume/Rasasi/Hawas-Fire-101665.html), [Verde](https://www.fragrantica.com/perfume/Rasasi/Hawas-Verde-117625.html), [Kobra](https://www.fragrantica.com/perfume/Rasasi/Kobra-112706.html) |
| Rasasi Hawas Verde | Reorganized the five Fragrantica-listed notes into the supplied storefront grouping (Lime/Green Apple; Rosemary; Patchouli/Amber), corrected the description/vibe, removed broad Hawas aliases, and made the page prefer this profile over stale database notes/accords. The database update script writes the same notes and Fragrantica accord order to the single matching product row. | [Fragrantica](https://www.fragrantica.com/perfume/Rasasi/Hawas-Verde-117625.html) |
| Maison Francis Kurkdjian Baccarat Rouge 540 Extrait de Parfum | Checked the product image label (Extrait de parfum) and aligned the accords to the exact Extrait page. The note pyramid matches that variant. | [Fragrantica Extrait](https://www.fragrantica.com/perfume/Maison-Francis-Kurkdjian/Baccarat-Rouge-540-Extrait-de-Parfum-46066.html) |
| YSL L'Homme | Kept the exact published note pyramid, corrected its accord ranking and replaced the unrelated generic description. | [Fragrantica](https://www.fragrantica.com/perfume/Yves-Saint-Laurent/L-Homme-734.html) |
| YSL L'Homme Le Parfum | Corrected the accord ranking and replaced unrelated description text; preserved the variant's published note pyramid. | [Fragrantica](https://www.fragrantica.com/perfume/Yves-Saint-Laurent/L-Homme-Le-Parfum-59731.html) |
| YSL MYSLF Le Parfum | Corrected its accord ranking and description, and removed incorrect broad aliases that could route a different YSL perfume to this profile. | [Fragrantica](https://www.fragrantica.com/perfume/Yves-Saint-Laurent/MYSLF-Le-Parfum-94983.html) |

## Records intentionally left unresolved

- **French Avenue Baie 19:** The saved catalogue name does not identify the current Fragrantica entry unambiguously. Search results identify separate products called French Avenue Baie and Vulcan Baie, while the old proposed match used Le Labo Baie 19. I removed the unsupported pyramid and accords until the bottle/photo or an exact supplier source confirms which product this listing represents.
- **Bespoke Collection tobacco profiles:** No attributable manufacturer or source page was found for Greek, Brazilian, Spanish, French, Dominican, Cuban, Jamaican, or Mexican Tobacco, or Tobacco Extrait de Parfum. Their duplicated guessed note pyramids and accord lists were cleared and marked unverified rather than presented as verified facts. A manufacturer note sheet or product specification is needed to restore them.
- **Armaf Ombre D’Or:** Its former description and aliases pointed to Ombré Leather despite being a different product. Unsupported notes and accords were cleared, and the profile is marked unverified pending a product-specific source.
- **Creed Absolu Aventus:** The name is ambiguous between the 2023 and 2025 releases. The existing code pyramid corresponds to the 2023 page; the product image is needed to confirm the bottle edition before changing the listing’s identity.

## Scope and safety

No production database records were changed. The working audit uses source pages and local code profiles. The project snapshot and prior verification report are not a substitute for checking the live database, and the remaining profiles still need the same source-by-source review before the full catalogue can be called verified.

## Current inventory status

The file contains 99 profiles. As of this pass, 32 are explicitly marked verified against a source, 11 profiles are explicitly marked unverified, and 56 have no verification status yet. A structural inventory also found 12 profiles with at least one empty top/middle/base note group and 11 with no accord list. Those empty fields are not automatically wrong, but they need a product-specific source check before they can be considered complete. This is a partial audit, not a claim that all 99 products are verified.

The source profile data is in `src/data/perfumeNotes.js`. Product detail pages also combine profile values with fields from the product database in `src/pages/ProductDetail.jsx`, so confirming the final live website data requires checking those database rows separately.

For Hawas Verde, `public/images/notes/rosemary.jpg` already exists and is mapped at `src/data/localNotesMap.json`. A new rosemary image was generated in this pass, but it was not installed over the existing asset. Direct database connectivity from this workspace failed with an access error, so `server/scripts/updateHawasVerdeNotes.js` is ready to run from an environment with the project's database access. The product detail page uses the corrected local profile in the meantime.
