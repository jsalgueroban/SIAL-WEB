"""Fetch selected open workshop art; keep licensing and provenance."""
from pathlib import Path
import hashlib, io, json, urllib.request, zipfile

root=Path(__file__).resolve().parents[1]
dest=root/'assets'/'workshop'
dest.mkdir(parents=True,exist_ok=True)
sources={
 'anvil.svg':('https://raw.githubusercontent.com/game-icons/icons/master/lorc/anvil.svg','https://game-icons.net/1x1/lorc/anvil.html','Lorc / Game-icons.net','CC BY 3.0'),
 'goggles.svg':('https://raw.githubusercontent.com/game-icons/icons/master/delapouite/steampunk-goggles.svg','https://game-icons.net/1x1/delapouite/steampunk-goggles.html','Delapouite / Game-icons.net','CC BY 3.0'),
}
def get(url):
 req=urllib.request.Request(url,headers={'User-Agent':'SIAL-workshop-prototype/1.0'})
 with urllib.request.urlopen(req,timeout=25) as response:return response.read(12_000_000)
records=[]
for name,(url,page,author,license) in sources.items():
 data=get(url)
 if b'<svg' not in data[:10000]:raise ValueError(f'Not SVG: {name}')
 (dest/name).write_bytes(data)
 records.append(dict(file=name,source=page,download=url,author=author,license=license,sha256=hashlib.sha256(data).hexdigest()))
 print(name,len(data))
url='https://kenney.nl/media/pages/assets/particle-pack/f8fe0f8cb8-1677578741/kenney_particle-pack.zip'
data=get(url)
if not zipfile.is_zipfile(io.BytesIO(data)):
 url='https://codeload.github.com/Calinou/kenney-particle-pack/zip/refs/heads/master'
 data=get(url)
with zipfile.ZipFile(io.BytesIO(data)) as pack:
 names=pack.namelist()
 print('Particle PNGs:',len([n for n in names if n.lower().endswith('.png')]))
 for stem in ['smoke_01.png','smoke_04.png','flame_01.png','spark_05.png','star_06.png','light_01.png']:
  found=next((n for n in names if n.endswith('/'+stem)),None)
  if found:
   raw=pack.read(found);(dest/stem).write_bytes(raw)
   records.append(dict(file=stem,source='https://kenney.nl/assets/particle-pack',download=url,author='Kenney',license='CC0 1.0',sha256=hashlib.sha256(raw).hexdigest()))
 for name in names:
  if name.lower().endswith('license.txt'):(dest/'KENNEY-LICENSE.txt').write_bytes(pack.read(name));break
if (dest/'anvil.glb').exists():
 raw=(dest/'anvil.glb').read_bytes()
 records.append(dict(file='anvil.glb',source='https://www.innerscene.com/tools/library/3d-parts/low-poly-medieval-anvil-5fd39d9e',author='Innerscene',license='CC0 1.0',sha256=hashlib.sha256(raw).hexdigest(),adaptation='project-workshop-model.mjs: orthographic SVG and SIAL material'))
for record in records:
 record['used']=record['file'] in ['goggles.svg','anvil.glb','smoke_04.png','flame_01.png','spark_05.png']
 record['licenseUrl']='https://creativecommons.org/licenses/by/3.0/' if record['license']=='CC BY 3.0' else 'https://creativecommons.org/publicdomain/zero/1.0/'
(dest/'sources.json').write_text(json.dumps(records,indent=2)+'\n',encoding='utf8')
