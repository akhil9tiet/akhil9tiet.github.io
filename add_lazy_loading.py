#!/usr/bin/env python3
"""
Add loading="lazy" to all img tags that don't already have it
"""
import re

html_file = 'index.html'

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all <img tags that don't have loading attribute
pattern = r'<img([^>]*?)(?<!loading=")>'
# Match: <img with opening bracket
# ([^>]*?) - capture any attributes
# (?<!loading=") - negative lookbehind to ensure loading= is not present
# > - closing bracket

def add_loading_lazy(match):
    attrs = match.group(1)
    # Check if loading already exists
    if 'loading=' in attrs:
        return f'<img{attrs}>'
    # Add loading="lazy" before the closing >
    return f'<img{attrs} loading="lazy">'

new_content = re.sub(r'<img([^>]*?)>', add_loading_lazy, content)

# Count changes
old_count = content.count('<img ')
new_count = new_content.count('loading="lazy"')

print(f"Found {old_count} img tags")
print(f"Added/kept loading=\"lazy\" on {new_count} tags")

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Updated index.html with loading=\"lazy\" attributes")
