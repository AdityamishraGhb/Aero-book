import xml.etree.ElementTree as ET

tree = ET.parse('public/brand/vtracer_raw.svg')
root = tree.getroot()

def build_svg(variant="dark_bg"):
    new_root = ET.Element('svg', {
        'xmlns': 'http://www.w3.org/2000/svg',
        'viewBox': '170 150 1700 370',
        'width': '100%',
        'height': '100%',
        'fill': 'none'
    })
    
    for elem in list(root):
        tag = elem.tag.split('}')[-1]
        if tag != 'path':
            continue
        fill = elem.attrib.get('fill', '').upper()
        d = elem.attrib.get('d', '')
        transform = elem.attrib.get('transform', '')
        
        # Path 0 is full canvas background M0 0 ... 2048
        if '2048' in d and '700' in d:
            continue
            
        attribs = {'d': d}
        if transform:
            attribs['transform'] = transform
            
        if fill == '#0B1F2D':
            # Dark navy in original image
            attribs['fill'] = '#FFFFFF' if variant == 'dark_bg' else '#0B1F2D'
        elif fill == '#FFFFFF':
            # Negative space cutouts
            attribs['fill'] = '#0B1F2D' if variant == 'dark_bg' else '#FFFFFF'
        elif fill == '#D4A017':
            # Brand Gold
            attribs['fill'] = '#D4A017'
        else:
            attribs['fill'] = fill

        new_path = ET.SubElement(new_root, 'path', attribs)

    return ET.tostring(new_root, encoding='utf-8').decode('utf-8')

svg_dark = build_svg("dark_bg")
svg_light = build_svg("light_bg")

with open('public/brand/aerobook-logo-dark-bg.svg', 'w', encoding='utf-8') as f:
    f.write(svg_dark)

with open('public/brand/aerobook-logo-light-bg.svg', 'w', encoding='utf-8') as f:
    f.write(svg_light)

print("Generated aerobook-logo-dark-bg.svg and aerobook-logo-light-bg.svg with transforms!")
