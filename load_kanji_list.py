import json

with open('kanji_list.json', 'r') as json_file:
  data = json.load(json_file)

cnt = 0
for i in range(1, 30):
  key = str(i)
  if key in data:
    character_data = data[key]
    cnt += len(character_data)

print(f"Count: {cnt}")