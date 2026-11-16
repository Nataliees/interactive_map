#!/usr/bin/env python3
"""Verify the static release pins CSS/JS filenames to their actual contents."""
import hashlib
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent


class AssetLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and attrs.get('rel') == 'stylesheet':
            self.paths.append(attrs['href'])
        if tag == 'script' and 'src' in attrs:
            self.paths.append(attrs['src'])


def check():
    parser = AssetLinks()
    parser.feed((ROOT / 'index.html').read_text())
    if len(parser.paths) != 3:
        raise ValueError('Expected a stylesheet and two vanilla JavaScript files')
    for name in parser.paths:
        match = re.fullmatch(r'(style|menu|app)\.([0-9a-f]{12})\.(css|js)', name)
        if not match:
            raise ValueError(f'Unversioned or invalid asset: {name}')
        path = ROOT / name
        digest = hashlib.sha256(path.read_bytes()).hexdigest()[:12]
        source = ROOT / f'{match[1]}.{match[3]}'
        if source.read_bytes() != path.read_bytes():
            raise ValueError(f'Source and linked asset differ: run python3 scripts/refresh-assets.py ({name})')
        if match[2] != digest:
            raise ValueError(f'Content changed: run python3 scripts/refresh-assets.py ({name})')
    print('Release assets exist and match the CSS/JS content hashes.')


if __name__ == '__main__':
    check()
