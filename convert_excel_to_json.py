#!/usr/bin/env python3
import pandas as pd
import json
import os
import glob

# Dictionary to map file names to categories
file_category_mapping = {
    'fruits.xlsx': 'fruits',
    'cereals.xlsx': 'cereals',
    'flowers.xlsx': 'flowers',
    'spices.xlsx': 'spices',
    'herbs.xlsx': 'herbs',
    'nuts.xlsx': 'nuts',
    'vegetables.xlsx': 'vegetables',
    'medicinal_plants.xlsx': 'medicinal_plants'
}

def clean_data(value):
    """Clean and format data values"""
    if pd.isna(value):
        return ""
    # Keep the value exactly as it is, just convert to string
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
        'medicinal_plants.xlsx': 'Plant name'
    }
    
    return name_columns.get(filename, df.columns[0])

def convert_excel_to_json():
    all_data = {}
    
    # Get the current directory
    current_dir = '/home/naveen/Documents/pavi/plant-world/excel_sheets'
    
    for filename, category in file_category_mapping.items():
        file_path = os.path.join(current_dir, filename)
        
        if os.path.exists(file_path):
            print(f"Processing {filename} -> {category}")
            try:
                # Read Excel file, skipping empty rows and handling missing values
                df = pd.read_excel(file_path, keep_default_na=False, na_filter=False)
                # Remove completely empty rows and columns
                df = df.dropna(how='all').dropna(axis=1, how='all')
                
                # Find the name column
                name_column = find_name_column(df, filename)
                print(f"Using '{name_column}' as name column")
                
                # Keep all data for all files
                df.fillna('', inplace=True)  # Replace NaN with empty string
                
                # Convert to list of dictionaries
                category_data = []
                
                for index, row in df.iterrows():
                    # Create a plant entry
                    plant_entry = {}
                    
                    # First set the name from the identified name column
                    plant_name = clean_data(row[name_column])
                    biological_name = None
                    
                    # Try to find biological/scientific name
                    for col in df.columns:
                        if 'biological' in col.lower() or 'scientific' in col.lower():
                            biological_name = clean_data(row[col])
                            break
                    
                    # Use the most specific name available
                    if biological_name:
                        plant_entry['name'] = biological_name
                        if plant_name:
                            plant_entry['common_name'] = plant_name
                    elif plant_name:
                        plant_entry['name'] = plant_name
                    
                    # Map other columns
                    for col in df.columns:
                        col_lower = col.lower().strip()
                        value = clean_data(row[col])

                        # Map common field names
                        if 'crop name' in col_lower or 'name' in col_lower:
                            plant_entry['name'] = value
                        elif 'biological' in col_lower or 'scientific' in col_lower:
                            plant_entry['biological_name'] = value
                        elif 'season' in col_lower:
                            plant_entry['seasonal_time'] = value
                        elif 'soil' in col_lower:
                            plant_entry['soil_type'] = value
                        elif 'water' in col_lower:
                            plant_entry['water_requirement'] = value
                        elif 'fertilizer' in col_lower or 'bio fertilizer' in col_lower or 'biofertilizer' in col_lower:
                            plant_entry['bio_fertilizers'] = value
                        elif 'pesticide' in col_lower or 'bio pesticide' in col_lower or 'biopesticide' in col_lower:
                            plant_entry['bio_pesticides'] = value
                        elif 'medicinal' in col_lower:
                            plant_entry['medicinal_values'] = value
                        elif 'genomic' in col_lower or 'genetic' in col_lower:
                            plant_entry['genomic_sequence'] = value
                        elif 'ploidy' in col_lower:
                            plant_entry['ploidy_level'] = value
                        elif 'physiological' in col_lower:
                            plant_entry['physiological_properties'] = value
                        elif 'media' in col_lower:
                            plant_entry['media'] = value
                        elif 'hormones' in col_lower:
                            plant_entry['hormones'] = value
                        elif 'callus' in col_lower:
                            plant_entry['callus_induction_potential'] = value
                        elif 'totipotency' in col_lower:
                            plant_entry['totipotency_level'] = value
                        elif 'propagation' in col_lower:
                            plant_entry['propagation_method'] = value
                        elif 'mutations' in col_lower:
                            plant_entry['mutations'] = value
                        elif 'transcription' in col_lower:
                            plant_entry['transcription_data'] = value
                        elif 'dna barcoding' in col_lower or 'barcoding' in col_lower:
                            plant_entry['dna_barcoding_loci'] = value
                        elif 'url' in col_lower or 'link' in col_lower:
                            plant_entry['url'] = value
                        elif 'image' in col_lower and 'url' in col_lower:
                            plant_entry['image_url'] = value
                        elif 'approximate' in col_lower and 'amount' in col_lower:
                            plant_entry['approximate_amount'] = value
                        else:
                            # Keep original column name for other fields
                            plant_entry[col.lower().replace(' ', '_')] = value

                    # Debug: print first few entries to check
                    if index < 5:
                        print(f"Row {index}: name='{plant_entry.get('name', 'NO NAME')}', biological_name='{plant_entry.get('biological_name', 'NO BIO')}'")

                    # Keep all rows and all data
                    # Add the entry with all data preserved
                    category_data.append(plant_entry)
                    name_display = plant_entry.get('name', 'Unnamed')
                    if isinstance(name_display, str) and name_display.strip():
                        print(f"Added plant: {name_display}")
                    else:
                        print(f"Added row {index}")
                
                all_data[category] = category_data
                print(f"  - Added {len(category_data)} items")
                
            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")
                all_data[category] = []
    
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

if __name__ == "__main__":
    convert_excel_to_json()
