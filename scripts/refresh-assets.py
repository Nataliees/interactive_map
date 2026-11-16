#!/usr/bin/env python3
"""Copy editable source assets to versioned static files and update HTML links."""
import hashlib
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
html_path = ROOT / 'index.html'
html = html_path.read_text()
for name in ['style.css', 'menu.js', 'app.js']:
    source = ROOT / name
    digest = hashlib.sha256(source.read_bytes()).hexdigest()[:12]
    target = source.with_name(f'{source.stem}.{digest}{source.suffix}')
    target.write_bytes(source.read_bytes())
    pattern = rf'((?:href|src)="){source.stem}(?:\.[0-9a-f]{{12}})?\.{source.suffix[1:]}(")'
    html, count = re.subn(pattern, lambda m: m[1] + target.name + m[2], html)
    if count != 1:
        raise ValueError(f'Expected exactly one link to {name}')
html_path.write_text(html)
print('Updated static asset copies and HTML links. No build required.')
