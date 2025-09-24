#!/usr/bin/env python3
import pandas as pd
import json
import os
import glob

# Dictionary to map file names to categories
file_category_mapping = {
    'bi fruit COMPLETED.xlsx': 'fruits',
    'BPL PULSE FINAL with url.xlsx': 'pulses', 
    'PBL CEREALS FINISH (1).xlsx': 'cereals',
    'PBL FINAL FLOWER (1).xlsx': 'flowers',
    'Indian_Vegetables_Dataset.xlsx': 'vegetables',
    'PBL FINAL SPICES.xlsx': 'spices',
    'PBL HERB FINAL.xlsx': 'herbs',
    'pbl nuts final.xlsx': 'nuts'
}

def clean_data(value):
    """Clean and format data values"""
    if pd.isna(value):
        return ""
    return str(value).strip()

def convert_excel_to_json():
    all_data = {}
    
    # Get the current directory
    current_dir = '/home/NaveenDon/Downloads/Pavithra'
    
    for filename, category in file_category_mapping.items():
        file_path = os.path.join(current_dir, filename)
        
        if os.path.exists(file_path):
            print(f"Processing {filename} -> {category}")
            try:
                # Read Excel file
                df = pd.read_excel(file_path)
                
                # Convert to list of dictionaries
                category_data = []
                
                for index, row in df.iterrows():
                    # Create a plant entry
                    plant_entry = {}
                    
                    # Map common column names (adjust based on actual column names)
                    for col in df.columns:
                        col_lower = col.lower().strip()
                        value = clean_data(row[col])
                        
                        # Map common field names
                        if 'name' in col_lower and 'biological' not in col_lower:
                            plant_entry['name'] = value
                        elif 'biological' in col_lower or 'scientific' in col_lower:
                            plant_entry['biological_name'] = value
                        elif 'season' in col_lower:
                            plant_entry['seasonal_time'] = value
                        elif 'soil' in col_lower:
                            plant_entry['soil_type'] = value
                        elif 'water' in col_lower:
                            plant_entry['water_requirement'] = value
                        elif 'fertilizer' in col_lower or 'bio fertilizer' in col_lower:
                            plant_entry['bio_fertilizers'] = value
                        elif 'pesticide' in col_lower or 'bio pesticide' in col_lower:
                            plant_entry['bio_pesticides'] = value
                        elif 'medicinal' in col_lower:
                            plant_entry['medicinal_values'] = value
                        elif 'url' in col_lower or 'link' in col_lower:
                            plant_entry['url'] = value
                        elif 'image' in col_lower and 'url' in col_lower:
                            plant_entry['image_url'] = value
                        else:
                            # Keep original column name for other fields
                            plant_entry[col.lower().replace(' ', '_')] = value
                    
                    # Only add if plant has a name
                    if plant_entry.get('name'):
                        category_data.append(plant_entry)
                
                all_data[category] = category_data
                print(f"  - Added {len(category_data)} items")
                
            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")
                all_data[category] = []
    
    # Save to JSON file
    output_file = os.path.join(current_dir, 'plant_data.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nData exported to {output_file}")
    
    # Print summary
    total_plants = sum(len(plants) for plants in all_data.values())
    print(f"\nSummary:")
    print(f"Total categories: {len(all_data)}")
    print(f"Total plants: {total_plants}")
    
    for category, plants in all_data.items():
        print(f"  {category}: {len(plants)} plants")

if __name__ == "__main__":
    convert_excel_to_json()