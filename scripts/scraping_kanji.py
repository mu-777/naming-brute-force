import requests
from bs4 import BeautifulSoup
import json

url = 'https://kanji.jitenon.jp/cat/namae.html'
response = requests.get(url)

soup = BeautifulSoup(response.text, 'html.parser')

# parts01からparts29までのdivを取得
divs = soup.find_all('div', {'class': 'parts_box'})
data = {}

for i in range(1, 30):
  div_id = f'parts{i:02d}'  # id属性の値を生成 (parts01, parts02, ..., parts29)
  div = soup.find('div', {'class': 'parts_box', 'id': div_id})

  if div:
    character_data = []
    ul = div.find('ul', {'class': 'search_parts'})
    lis = ul.find_all('li')
    for li in lis:
      a = li.find('a')
      character = a.text
      link = a['href']
      character_data.append({'character': character, 'link': link})
    data[str(i)] = character_data

with open('kanji_list.json', 'w') as json_file:
  json.dump(data, json_file, ensure_ascii=False, indent=2) 
