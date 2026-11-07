import xml.etree.ElementTree as ET

tree = ET.parse('public/brand/vtracer_raw.svg')
root = tree.getroot()

for i, elem in enumerate(root):
    t = elem.attrib.get('transform', '')
    fill = elem.attrib.get('fill', '')
    d = elem.attrib.get('d', '')
    print(f"Path {i}: fill={fill}, t={t}, d_len={len(d)}")
