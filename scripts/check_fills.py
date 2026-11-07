import re
from collections import Counter

with open('public/brand/vtracer_raw.svg', 'r', encoding='utf-8') as f:
    text = f.read()

fills = re.findall(r'fill="([^"]+)"', text)
print('Fills found:', Counter(fills))
