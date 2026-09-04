#!/usr/bin/env python3
"""
Playgama Ready ZIP Generator
Packages the production Vite build in 'dist/' into a deployable Playgama ZIP:
  - index.html at root of ZIP
  - assets/ at root of ZIP
  - NO parent folder (no dist/, no project folder)
  - Relative asset paths only
"""
import os
import sys
import zipfile
import shutil

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dist'))
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC_DIR = os.path.join(ROOT_DIR, 'public')

if not os.path.isdir(DIST_DIR):
    print(f"Error: {DIST_DIR} does not exist. Run 'npm run build' first.")
    sys.exit(1)

# Check index.html exists in dist
dist_index = os.path.join(DIST_DIR, 'index.html')
if not os.path.isfile(dist_index):
    print("Error: dist/index.html not found.")
    sys.exit(1)

# Verify no /src/main.tsx or absolute paths
with open(dist_index, 'r', encoding='utf-8') as f:
    html_content = f.read()
    if '/src/main.tsx' in html_content or '.tsx' in html_content:
        print("Error: dist/index.html contains .tsx source references!")
        sys.exit(1)
    if 'bridge.playgama.com' not in html_content:
        print("Warning: Playgama bridge script tag not detected in dist/index.html")

zip_targets = [
    os.path.join(ROOT_DIR, 'playgama-ready.zip'),
    os.path.join(ROOT_DIR, 'halloween-survivor-playgama.zip'),
    os.path.join(PUBLIC_DIR, 'playgama-ready.zip'),
    os.path.join(DIST_DIR, 'playgama-ready.zip')
]

os.makedirs(PUBLIC_DIR, exist_ok=True)

primary_zip = zip_targets[0]
print(f"Creating Playgama ZIP archive: {primary_zip}")

with zipfile.ZipFile(primary_zip, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(DIST_DIR):
        for file in files:
            # Do not include the zip file itself if placed in dist
            if file.endswith('.zip'):
                continue
            full_path = os.path.join(root, file)
            # arcname must be relative to DIST_DIR so index.html and assets/ are at root of zip
            arcname = os.path.relpath(full_path, DIST_DIR)
            # Skip hidden files
            if os.path.basename(file).startswith('.'):
                continue
            z.write(full_path, arcname)

# Copy to other target locations for convenience
for target in zip_targets[1:]:
    shutil.copyfile(primary_zip, target)
    print(f"Created copy: {target}")

print("\n--- FINAL PLAYGAMA ZIP VERIFICATION ---")
with zipfile.ZipFile(primary_zip, 'r') as z:
    for info in z.infolist():
        print(f"  {info.filename} ({info.file_size} bytes)")
print("---------------------------------------")
print("SUCCESS: Playgama ready ZIP generated successfully.")
