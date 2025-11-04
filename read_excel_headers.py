
import pandas as pd
import os
import sys

def read_excel_headers():
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        try:
            df = pd.read_excel(file_path, nrows=1)
            print(f"File: {os.path.basename(file_path)}")
            print(f"Columns: {df.columns.tolist()}")
            print("-" * 20)
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
    else:
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
