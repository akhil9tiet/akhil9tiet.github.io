#!/usr/bin/env python3
"""
Image optimization script - compress large PNG/JPG images
"""
import os
from PIL import Image
import sys

# Images to optimize with target quality/compression
images_to_optimize = {
    'otherFileFolder/images/arrow.png': {'quality': 80, 'resize_factor': 0.6},
    'otherFileFolder/images/visualization.png': {'quality': 80, 'resize_factor': 0.7},
    'otherFileFolder/images/chritopherNolan.png': {'quality': 80, 'resize_factor': 0.7},
    'otherFileFolder/images/ClaudeLoader.png': {'quality': 85, 'resize_factor': 0.8},
}

def optimize_image(image_path, quality=80, resize_factor=1.0):
    """Optimize a single image"""
    try:
        if not os.path.exists(image_path):
            print(f"❌ File not found: {image_path}")
            return False
            
        original_size = os.path.getsize(image_path) / (1024 * 1024)
        print(f"\n📸 Processing: {image_path}")
        print(f"   Original size: {original_size:.2f} MB")
        
        # Open image
        img = Image.open(image_path)
        
        # Resize if needed
        if resize_factor < 1.0:
            new_width = int(img.width * resize_factor)
            new_height = int(img.height * resize_factor)
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            print(f"   Resized to {resize_factor*100}%: {img.width}x{img.height}")
        
        # Convert RGBA to RGB for better compression if saving as JPG
        if image_path.lower().endswith('.png'):
            # Keep as PNG but compress
            img.save(image_path, 'PNG', optimize=True, quality=quality)
        else:
            img.save(image_path, 'JPEG', quality=quality, optimize=True)
        
        new_size = os.path.getsize(image_path) / (1024 * 1024)
        reduction = ((original_size - new_size) / original_size) * 100
        print(f"   ✅ Optimized size: {new_size:.2f} MB")
        print(f"   📊 Reduction: {reduction:.1f}%")
        return True
        
    except Exception as e:
        print(f"❌ Error processing {image_path}: {e}")
        return False

def main():
    print("🖼️  Image Optimization Tool")
    print("=" * 50)
    
    success_count = 0
    for image_path, settings in images_to_optimize.items():
        if optimize_image(image_path, **settings):
            success_count += 1
    
    print("\n" + "=" * 50)
    print(f"✅ Successfully optimized {success_count}/{len(images_to_optimize)} images")
    
    # Print final summary
    total_size = 0
    for image_path in images_to_optimize.keys():
        if os.path.exists(image_path):
            total_size += os.path.getsize(image_path) / (1024 * 1024)
    
    print(f"📊 Total images size: {total_size:.2f} MB")

if __name__ == '__main__':
    main()
