import xml.etree.ElementTree as ET
import os

tree = ET.parse('public/brand/vtracer_raw.svg')
root = tree.getroot()

# Tight viewBox with subtle breathing room
VIEWBOX = "160 148 1660 380"

def create_svg(variant="dark"):
    # variant="dark" means intended for dark backgrounds: "Aero" is White #FFFFFF
    # variant="light" means intended for light backgrounds: "Aero" is Navy #0B1F2D
    
    svg = ET.Element('svg', {
        'xmlns': 'http://www.w3.org/2000/svg',
        'viewBox': VIEWBOX,
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
        
        # Skip full canvas background (Path 0)
        if '2048' in d and '700' in d:
            continue
            
        attribs = {'d': d}
        if transform:
            attribs['transform'] = transform
            
        if fill == '#0B1F2D':
            # Dark navy wordmark "Aero"
            attribs['fill'] = '#FFFFFF' if variant == 'dark' else '#0B1F2D'
        elif fill == '#FFFFFF':
            # Cutouts/negative space
            attribs['fill'] = '#0B1F2D' if variant == 'dark' else '#FFFFFF'
        elif fill == '#D4A017':
            # Official Brand Gold for "Book", plane, and contrail
            attribs['fill'] = '#D4A017'
        else:
            attribs['fill'] = fill

        ET.SubElement(svg, 'path', attribs)

    return ET.tostring(svg, encoding='utf-8').decode('utf-8')

svg_dark = create_svg("dark")
svg_light = create_svg("light")

os.makedirs('public/brand', exist_ok=True)
os.makedirs('public/images', exist_ok=True)

with open('public/brand/aerobook-logo-dark.svg', 'w', encoding='utf-8') as f:
    f.write(svg_dark)

with open('public/brand/aerobook-logo-light.svg', 'w', encoding='utf-8') as f:
    f.write(svg_light)

with open('public/brand/aerobook-logo.svg', 'w', encoding='utf-8') as f:
    f.write(svg_light)

print("Generated vector SVGs: aerobook-logo-dark.svg, aerobook-logo-light.svg, aerobook-logo.svg")
