
import pandas as pd
import os

def read_excel_headers():
    excel_dir = '/home/naveen/Documents/pavi/plant-world/excel_sheets'
    excel_files = [f for f in os.listdir(excel_dir) if f.endswith('.xlsx')]
    
    for excel_file in excel_files:
        file_path = os.path.join(excel_dir, excel_file)
        try:
            df = pd.read_excel(file_path, nrows=1)
            print(f"File: {excel_file}")
            print(f"Columns: {df.columns.tolist()}")
            print("-" * 20)
        except Exception as e:
            print(f"Error reading {excel_file}: {e}")

if __name__ == "__main__":
    read_excel_headers()
