import xml.etree.ElementTree as ET
import re

tree = ET.parse('public/brand/vtracer_raw.svg')
root = tree.getroot()

# Let's extract all (x, y) coordinates from path transforms and d strings
min_x, min_y = float('inf'), float('inf')
max_x, max_y = float('-inf'), float('-inf')

for elem in root:
    d = elem.attrib.get('d', '')
    t = elem.attrib.get('transform', '')
    if '2048' in d and '700' in d: # canvas background
        continue
    tx, ty = 0.0, 0.0
    if t.startswith('translate('):
        parts = t[10:-1].split(',')
        tx, ty = float(parts[0]), float(parts[1])
        
    # Find all coordinates in d
    nums = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', d)]
    for i in range(0, len(nums)-1, 2):
        x = tx + nums[i]
        y = ty + nums[i+1]
        if x < min_x: min_x = x
        if x > max_x: max_x = x
        if y < min_y: min_y = y
        if y > max_y: max_y = y

print(f"Tight bounding box: min_x={min_x:.1f}, min_y={min_y:.1f}, max_x={max_x:.1f}, max_y={max_y:.1f}")
width = max_x - min_x
height = max_y - min_y
print(f"Dimensions: width={width:.1f}, height={height:.1f}, aspect_ratio={width/height:.2f}")
