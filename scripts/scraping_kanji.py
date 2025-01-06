import requests
from bs4 import BeautifulSoup
import json
import argparse
import os

DOMAIN = 'https://kanji.jitenon.jp'
URL = f'{DOMAIN}/cat/namae.html'

print(URL)

def scrape_kanji(output_path):
  response = requests.get(URL)

  soup = BeautifulSoup(response.text, 'html.parser')
  kanji_list = []

  for i in range(1, 30):
    div_id = f'parts{i:02d}'
    div = soup.find('div', {'class': 'parts_box', 'id': div_id})

    if div:
      ul = div.find('ul', {'class': 'search_parts'})
      lis = ul.find_all('li')
      for li in lis:
        a = li.find('a')
        character = a.text
        link = a['href']
        linkpath = link[len(DOMAIN)+1:] if link.startswith(DOMAIN) else link
        kanji_list.append({
            'character': character,
            'stroke': i,
            'linkpath': linkpath
        })

  with open(output_path, 'w', encoding='utf-8') as json_file:
    json.dump({
        'domain': DOMAIN,
        'kanji': kanji_list
    }, json_file, ensure_ascii=False, indent=2)


def main():
  parser = argparse.ArgumentParser(description='漢字データをスクレイピングしてJSONファイルを生成します')
  parser.add_argument('--outdir', default='', help='出力するJSONファイルのパィレクトリパス')
  args = parser.parse_args()

  outdir = args.outdir or ""
  output_path = os.path.join(outdir, 'kanji.json')
  os.makedirs(outdir, exist_ok=True)

  scrape_kanji(output_path)


if __name__ == '__main__':
  main()
