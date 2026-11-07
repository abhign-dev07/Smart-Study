# CP sheet source and refresh

Source: https://github.com/arnavsharma2711/CP-Striver-Sheet
Pinned import: 99396aa0b31089c40a8946e0fa56fd902a285c8d

The bundled catalogue contains all 219 C++ file entries in 19 topic folders. It stores metadata and links, not copied solution code. Exactly 17 files contain implementation code; other files are labeled Source reference. Progress is local to this browser in scc_cp_sheet_progress_v1; DSA keeps scc_dsa_sheet_progress_v1. Progress is manual and is not inferred from Codeforces submissions.

To refresh, download the repository ZIP and recursive GitHub tree for the same commit, plus https://codeforces.com/api/problemset.problems. Run:

    python scripts/import_cp_sheet.py <archive.zip> <tree.json> <codeforces.json>
    npm run build

The importer verifies complete source coverage and unique IDs. scripts/cp_metadata_overrides.json supplies names missing from the API, verified from each keyed official practice URL (2026-11-05). Source-path IDs preserve progress across metadata refreshes; a source rename needs an explicit progress migration. Source links are pinned to the imported commit.

Validation completed: source coverage, IDs, resolved titles, URL hosts and encoding, special filenames, solution availability, separate storage round-trip, and production build. Browser UI testing was blocked by the local-origin permission gate. The build retains an existing large-chunk warning.
