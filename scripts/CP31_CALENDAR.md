# CP-31 and contest calendar

CP-31 source: https://www.tle-eliminators.com/cp-sheet, read from its rendered public page on 2026-11-05. The 372 names and official order are preserved in cp31-tle-names.txt. Codeforces public catalogue supplies problem IDs/links; capitalization differences and duplicate names are resolved by rating and contest identity. Two omitted metadata entries are resolved from official problem pages.

To regenerate, save https://codeforces.com/api/problemset.problems as cf-problem-metadata.json in the project root and run python scripts/import_cp31.py. Existing cpSheetData.json supplies previously verified API omissions. All 12 groups must contain 31 problems, and unresolved matches abort the importer.

Run node scripts/verify-coding.mjs and npm run build after edits.

CP-31 completion uses scc_cp31_progress_v1 independently of the existing CP/DSA keys. No upstream login or progress writes occur.

Calendar source: official Codeforces contest.list and LeetCode GraphQL topTwoContests/pastContests. Bundled contestSnapshot.json is an official response snapshot from 2026-11-05. Refresh merges successful platforms independently and preserves failed-platform data. The local Vite LC proxy currently receives an upstream CSRF 403; the visible failure state and saved dates are intentional. At the user's request, the visible month also includes expected LeetCode weekly contests (Sunday 08:00 IST) and biweekly contests (alternate Saturday 20:00 IST), anchored to official Weekly 527 and Biweekly 195. Expected entries are labeled and link to the contest directory. Published contests override recurring estimates, including rescheduled dates. Codeforces dates remain published dates only.

GFG matching: DSA Master Sheet.xlsx / DSA Sheet Final supplies 147 GFG hyperlink rows. Reviewed exact and semantic matches map 96 existing questions to workbook links; 103 existing questions now have GFG links, including 24 with both LC and GFG. All 495 question identities and existing LC links are preserved. gfg-source-rows.json records the source rows; gfg-import-audit.json records accepted mappings and excluded source mismatches. Similar titles with different problem requirements are not automatically matched.
