import xml.etree.ElementTree as ET

tree = ET.parse('public/brand/vtracer_raw.svg')
root = tree.getroot()

print("SVG tag:", root.tag, "attrib:", root.attrib)

paths = root.findall('.//{http://www.w3.org/2000/svg}path')
if not paths:
    # without namespace
    paths = root.findall('.//path')

print(f"Total paths: {len(paths)}")
for i, p in enumerate(paths):
    fill = p.attrib.get('fill', 'none')
    d = p.attrib.get('d', '')
    print(f"Path {i}: fill={fill}, d_len={len(d)}, preview={d[:50]}")
