import cv2
import numpy as np
import os

img = cv2.imread('public/brand/logo-exact.jpg')
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# Accurate mask boundaries
# Gold:
gold_mask = cv2.inRange(hsv, np.array([12, 70, 70]), np.array([38, 255, 255]))
# Dark (Navy/Black):
dark_mask = cv2.inRange(hsv, np.array([0, 0, 0]), np.array([180, 255, 120]))

def contours_to_svg_paths(mask, epsilon=0.6):
    # Upscale 2x and smooth for beautiful anti-aliased curves
    h, w = mask.shape
    scaled = cv2.resize(mask, (w * 2, h * 2), interpolation=cv2.INTER_CUBIC)
    blurred = cv2.GaussianBlur(scaled, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY)
    contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_TC89_KCOS)
    
    path_strings = []
    for c in contours:
        area = cv2.contourArea(c)
        if area < 50:
            continue
        approx = cv2.approxPolyDP(c, epsilon, True)
        if len(approx) < 3:
            continue
        # Scale back coordinates by / 2.0 with 2 decimal precision
        coords = [f"{pt[0][0]/2.0:.1f} {pt[0][1]/2.0:.1f}" for pt in approx]
        d = f"M {coords[0]} " + " ".join(f"L {pt}" for pt in coords[1:]) + " Z"
        path_strings.append(d)
    return " ".join(path_strings)

gold_path = contours_to_svg_paths(gold_mask, epsilon=0.5)
dark_path = contours_to_svg_paths(dark_mask, epsilon=0.5)

# Bounding box of all elements:
# From x=90 to x=910 (width ~820), y=75 to y=260 (height ~185)
# Normalized viewBox="90 75 820 185"

# Dark header variant (white "Aero" + gold "Book" & airplane)
svg_dark_bg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="90 75 820 185" width="100%" height="100%" fill="none">
  <!-- Wordmark "Aero" in Crisp White for dark backgrounds -->
  <path d="{dark_path}" fill="#FFFFFF" fill-rule="evenodd" />
  <!-- Airplane & "Book" in Official Brand Gold -->
  <path d="{gold_path}" fill="#D4A017" fill-rule="evenodd" />
</svg>'''

# Light header/footer variant (navy "Aero" + gold "Book" & airplane)
svg_light_bg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="90 75 820 185" width="100%" height="100%" fill="none">
  <!-- Wordmark "Aero" in Official Midnight Navy -->
  <path d="{dark_path}" fill="#0B1F2D" fill-rule="evenodd" />
  <!-- Airplane & "Book" in Official Brand Gold -->
  <path d="{gold_path}" fill="#D4A017" fill-rule="evenodd" />
</svg>'''

os.makedirs('public/brand', exist_ok=True)
with open('public/brand/logo-dark-bg.svg', 'w', encoding='utf-8') as f:
    f.write(svg_dark_bg)

with open('public/brand/logo-light-bg.svg', 'w', encoding='utf-8') as f:
    f.write(svg_light_bg)

print("SVG files generated successfully!")
