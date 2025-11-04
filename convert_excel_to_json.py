#!/usr/bin/env python3
import pandas as pd
import json
import os

# Dictionary to map file names to categories
file_category_mapping = {
    'fruits.xlsx': 'fruits',
    'cereals.xlsx': 'cereals',
    'flowers.xlsx': 'flowers',
    'spices.xlsx': 'spices',
    'herbs.xlsx': 'herbs',
    'nuts.xlsx': 'nuts',
    'vegetables.xlsx': 'vegetables',
    'medicinal_plants.xlsx': 'medicinal_plants',
    'BSI_Herbarium_300_Data.xlsx': 'bsi_herbarium'
}

def clean_data(value):
    """Clean and format data values"""
    if pd.isna(value):
        return ""
    return str(value)

def find_name_column(df, filename):
    """Find the column containing plant names based on file type"""
    name_columns = {
        'fruits.xlsx': 'FRUIT NAMES',
        'cereals.xlsx': 'Crop Name',
        'flowers.xlsx': 'Crop Name',
        'spices.xlsx': 'Spice Name',
        'herbs.xlsx': 'Herb Name',
        'nuts.xlsx': 'Nut Name',
        'vegetables.xlsx': 'Crop Name',
        'medicinal_plants.xlsx': 'Plant name',
        'BSI_Herbarium_300_Data.xlsx': 'Plant name'
    }
    
    return name_columns.get(filename, df.columns[0])

def convert_excel_to_json():
    all_data = {}
    
    # Process files from excel_sheets directory
    excel_sheets_dir = '/home/naveen/Documents/pavi/plant-world/excel_sheets'
    for filename, category in file_category_mapping.items():
        if 'BSI_Herbarium' in filename:
            continue
        file_path = os.path.join(excel_sheets_dir, filename)
        if os.path.exists(file_path):
            process_file(file_path, category, all_data, filename)

    # Process the BSI Herbarium file from the root directory
    bsi_file_path = '/home/naveen/Documents/pavi/plant-world/BSI_Herbarium_300_Data.xlsx'
    if os.path.exists(bsi_file_path):
        process_file(bsi_file_path, 'bsi_herbarium', all_data, 'BSI_Herbarium_300_Data.xlsx')

    # Save to JSON file
    output_file = os.path.join('/home/naveen/Documents/pavi/plant-world', 'plant_data.json')
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

def process_file(file_path, category, all_data, filename):
    print(f"Processing {filename} -> {category}")
    try:
        df = pd.read_excel(file_path, keep_default_na=False, na_filter=False)
        df = df.dropna(how='all').dropna(axis=1, how='all')
        name_column = find_name_column(df, filename)
        print(f"Using '{name_column}' as name column")
        df.fillna('', inplace=True)
        category_data = []
        
        for index, row in df.iterrows():
            plant_entry = {}
            plant_name = clean_data(row[name_column])
            biological_name = None
            
            for col in df.columns:
                if 'biological' in col.lower() or 'scientific' in col.lower():
                    biological_name = clean_data(row[col])
                    break
            
            if biological_name:
                plant_entry['name'] = biological_name
                if plant_name:
                    plant_entry['common_name'] = plant_name
            elif plant_name:
                plant_entry['name'] = plant_name
            
            for col in df.columns:
                col_lower = col.lower().strip()
                value = clean_data(row[col])
                if 'crop name' in col_lower or 'name' in col_lower:
                    plant_entry['name'] = value
                elif 'biological' in col_lower or 'scientific' in col_lower:
                    plant_entry['biological_name'] = value
                else:
                    plant_entry[col.lower().replace(' ', '_')] = value

            category_data.append(plant_entry)
        
        all_data[category] = category_data
        print(f"  - Added {len(category_data)} items")
        
    except Exception as e:
        print(f"Error processing {filename}: {str(e)}")
        all_data[category] = []

if __name__ == "__main__":
    convert_excel_to_json()

