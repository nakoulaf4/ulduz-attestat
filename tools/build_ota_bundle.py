#!/usr/bin/env python3
"""
Build & verify a deterministic SHA-256 signed Ulduz Web OTA bundle from `site/`.
Output:
  dist/Ulduz-v<VERSION>-web-ota.zip
  dist/Ulduz-v<VERSION>-web-ota.sha256

Every file path uses POSIX forward slashes relative to `site/`.
Verifies that `index.html` and `js/app/main.js` exist at archive root,
zero unsafe paths (`..` or `\\`), and checksum matches `.sha256` byte-for-byte.
"""

from __future__ import annotations

import hashlib
import json
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE_DIR = ROOT / "site"
DIST_DIR = ROOT / "dist"
PKG_JSON = ROOT / "package.json"

EXCLUDED_NAMES = {".DS_Store", "Thumbs.db", ".gitkeep"}


def main() -> int:
    pkg = json.loads(PKG_JSON.read_text(encoding="utf-8"))
    version = sys.argv[1].lstrip("vV") if len(sys.argv) > 1 else pkg["version"]

    if not (SITE_DIR / "index.html").is_file() or not (SITE_DIR / "js" / "app" / "main.js").is_file():
        raise SystemExit("ERROR: site/index.html or site/js/app/main.js missing!")

    DIST_DIR.mkdir(parents=True, exist_ok=True)
    zip_name = f"Ulduz-v{version}-web-ota.zip"
    sha_name = f"Ulduz-v{version}-web-ota.sha256"
    zip_path = DIST_DIR / zip_name
    sha_path = DIST_DIR / sha_name

    files = sorted(
        p for p in SITE_DIR.rglob("*")
        if p.is_file() and p.name not in EXCLUDED_NAMES
    )

    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for file_path in files:
            rel = file_path.relative_to(SITE_DIR).as_posix()
            if ".." in rel.split("/") or "\\" in rel or rel.startswith("/"):
                raise SystemExit(f"ERROR: unsafe path {rel}")
            zi = zipfile.ZipInfo(filename=rel, date_time=(2026, 1, 1, 0, 0, 0))
            zi.compress_type = zipfile.ZIP_DEFLATED
            zf.writestr(zi, file_path.read_bytes())

    raw = zip_path.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    sha_path.write_text(f"{digest}  {zip_name}\n", encoding="utf-8")

    # Self-verify archive structure and digest
    with zipfile.ZipFile(zip_path, "r") as zf:
        names = set(zf.namelist())
        assert "index.html" in names, "index.html missing from OTA zip"
        assert "js/app/main.js" in names, "js/app/main.js missing from OTA zip"
        bad = [n for n in names if "\\" in n or ".." in n.split("/") or n.startswith("/")]
        assert not bad, f"Unsafe paths in OTA zip: {bad}"
        bad_crc = zf.testzip()
        assert bad_crc is None, f"CRC mismatch in OTA zip: {bad_crc}"

    recorded = sha_path.read_text(encoding="utf-8").split()[0]
    assert recorded == digest, "SHA-256 verification mismatch!"

    print(f"[OK] Built {zip_path} ({len(raw):,} bytes, {len(files)} files)")
    print(f"[OK] SHA-256: {digest}")
    print(f"[OK] Wrote {sha_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
