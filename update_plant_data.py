import json
from bs4 import BeautifulSoup

# Load my data
with open('plant_data.json') as f:
    my_data = json.load(f)

# Parse BSI HTML
with open('bsi_medicinal.html') as f:
    soup = BeautifulSoup(f, 'html.parser')

table = soup.find('table')
bsi_data = {}
if table:
    rows = table.find_all('tr')
    for row in rows[1:]:  # Skip header
        tds = row.find_all('td')
        if len(tds) >= 5:
            num = tds[0].text.strip()
            em = tds[1].find('em')
            if em:
                sci_name = em.text.strip()
                family = tds[2].text.strip()
                common = tds[3].text.strip()
                link = tds[4].find('a')['href'] if tds[4].find('a') else ''
                bsi_data[sci_name] = {'family': family, 'common_name': common, 'link': link}

# Update my data
for cat in my_data:
    for plant in my_data[cat]:
        bio_name = plant.get('biological_name', '').strip()
        if bio_name in bsi_data:
            plant['bsi_family'] = bsi_data[bio_name]['family']
            plant['bsi_common_name'] = bsi_data[bio_name]['common_name']
            plant['bsi_link'] = bsi_data[bio_name]['link']

# Add all BSI plants to medicinal_plants
existing_names = set()
for cat in my_data:
    for plant in my_data[cat]:
        bio_name = plant.get('biological_name', '').strip()
        if bio_name:
            existing_names.add(bio_name)

for sci_name, data in bsi_data.items():
    if sci_name not in existing_names:
        my_data['medicinal_plants'].append({
            'name': data['common_name'],
            'biological_name': sci_name,
            'bsi_family': data['family'],
            'bsi_common_name': data['common_name'],
            'bsi_link': data['link']
        })

# Save updated data
with open('plant_data.json', 'w') as f:
    json.dump(my_data, f, indent=2)

print('Updated plant_data.json with BSI data.')