import json
import xlsxwriter
import os

def create_excel_from_json():
    # Read the JSON data
    with open('plant_data.json', 'r') as f:
        data = json.load(f)

    # Create 'excel_sheets' directory if it doesn't exist
    if not os.path.exists('excel_sheets'):
        os.makedirs('excel_sheets')

    # Convert each category to Excel
    for category, items in data.items():
        if not items:  # Skip empty categories
            continue

        # Create a new Excel file
        excel_path = f'excel_sheets/{category}.xlsx'
        workbook = xlsxwriter.Workbook(excel_path)
        worksheet = workbook.add_worksheet()

        # Add header formatting
        header_format = workbook.add_format({
            'bold': True,
            'bg_color': '#4CAF50',
            'font_color': 'white',
            'align': 'center',
            'border': 1
        })

        # Write headers
        headers = list(items[0].keys())
        for col, header in enumerate(headers):
            worksheet.write(0, col, header.replace('_', ' ').title(), header_format)
            worksheet.set_column(col, col, max(len(header) * 1.2, 15))

        # Write data
        for row, item in enumerate(items, start=1):
            for col, header in enumerate(headers):
                value = item.get(header, '')
                worksheet.write(row, col, value)

        workbook.close()
        print(f'Created {excel_path}')

if __name__ == '__main__':
    create_excel_from_json()