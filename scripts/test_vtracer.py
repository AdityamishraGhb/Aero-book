import cv2
import numpy as np
import vtracer

# Load the exact client uploaded logo
img = cv2.imread('public/brand/logo-exact.jpg')
h, w, c = img.shape

# Upscale 2x with lanczos
upscaled = cv2.resize(img, (w * 2, h * 2), interpolation=cv2.INTER_LANCZOS4)

# Color segmentation in HSV
hsv = cv2.cvtColor(upscaled, cv2.COLOR_BGR2HSV)

# Mask for gold elements
gold_mask = cv2.inRange(hsv, np.array([12, 70, 70]), np.array([38, 255, 255]))

# Mask for dark navy elements
dark_mask = cv2.inRange(hsv, np.array([0, 0, 0]), np.array([180, 255, 120]))

# Clean up noise: remove tiny speckles
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
gold_clean = cv2.morphologyEx(gold_mask, cv2.MORPH_OPEN, kernel)
dark_clean = cv2.morphologyEx(dark_mask, cv2.MORPH_OPEN, kernel)

# Close minor pinholes
gold_clean = cv2.morphologyEx(gold_clean, cv2.MORPH_CLOSE, kernel)
dark_clean = cv2.morphologyEx(dark_clean, cv2.MORPH_CLOSE, kernel)

# Create a pristine 3-color raster on pure white canvas:
# 1. White background: (255, 255, 255)
# 2. Navy: #0B1F2D -> BGR (45, 31, 11)
# 3. Gold: #D4A017 -> BGR (23, 160, 212)
pristine = np.full_like(upscaled, 255)
pristine[dark_clean > 0] = [45, 31, 11]
pristine[gold_clean > 0] = [23, 160, 212]

cv2.imwrite('public/brand/pristine_for_vtracer.png', pristine)

# Run vtracer with spline mode
vtracer.convert_image_to_svg_py(
    'public/brand/pristine_for_vtracer.png',
    'public/brand/vtracer_raw.svg',
    colormode='color',
    hierarchical='stacked',
    mode='spline',
    filter_speckle=8,
    color_precision=6,
    layer_difference=16,
    corner_threshold=60,
    length_threshold=4.0,
    max_iterations=10,
    splice_threshold=45,
    path_precision=2
)

print('Vtracer conversion complete!')
