"""Snapshot only the recovered master's contours used by the 401 composition."""
import hashlib, json, re, sys
from pathlib import Path

source = Path(sys.argv[1]) / 'src/components/Mascot'
art = (source / 'mascot_artwork.tsx').read_text(encoding='utf-8')
limbs = (source / 'mascot_master_limbs.tsx').read_text(encoding='utf-8')

def svg(text):
    text = re.sub(r'fill=\{`url\(#\$\{id\}-front\)`\}', 'fill="url(#MASTER-front)"', text)
    text = re.sub(r'fill=\{`url\(#\$\{id\}-peel\)`\}', 'fill="url(#MASTER-peel)"', text)
    for jsx, attr in [('className','class'), ('strokeWidth','stroke-width'), ('strokeLinecap','stroke-linecap'), ('strokeLinejoin','stroke-linejoin'), ('textAnchor','text-anchor'), ('fontFamily','font-family'), ('fontWeight','font-weight'), ('fontSize','font-size')]:
        text = text.replace(jsx+'=', attr+'=')
    return text.strip()

def limb(name):
    return svg(limbs.split('export function '+name)[1].split('return <>')[1].split('</>;')[0])

parts = {
    'arm': limb('MasterPresentationArm'),
    'grip': limb('MasterGrip'),
    'palm': svg('<path'+art.split('<path className="bui-mascot__support-palm"')[1].split('/>')[0]+'/>'),
    'body': svg('<path d="M351 154'+art.split('<path d="M351 154')[1].split('{!forbidden')[0]),
    'leftFoot': svg(art.split('<g className="bui-mascot__foot-left">')[1].split('</g>')[0]),
    'rightFoot': svg(art.split('<g className="bui-mascot__foot-right">')[1].split('</g>')[0]),
    'shield': svg('<path d="M482 315'+art.split('<path d="M482 315')[1].split('</g></g>}')[0]),
    'sign': svg(art.split('<g className="bui-mascot__stop-sign">')[1].split('</g>')[0]),
    'source': 'christmas-isotype / recovered audiovisual master / forbidden',
    'sha256': hashlib.sha256((art+limbs).encode()).hexdigest(),
}
dest = Path(__file__).resolve().parents[1] / 'src/web/session-master.json'
import xml.etree.ElementTree as ET
for key in ['arm','grip','palm','body','leftFoot','rightFoot','shield','sign']:
    ET.fromstring('<svg>'+parts[key]+'</svg>')
    assert '{' not in parts[key], 'Unresolved JSX in '+key
dest.write_text(json.dumps(parts, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(dest)
