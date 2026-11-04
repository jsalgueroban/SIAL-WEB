// Rebuild utilities for copied product TSX, without Tailwind preflight.
// Reuses the existing product compiler; does not install or change dependencies.
const fs = require('fs');
const path = require('path');
const {createRequire} = require('module');
const productRoot = process.env.SIAL_PRODUCT_WEB || 'D:/SIAL/Repos/sial/fe-sial-web';
const req = createRequire(path.join(productRoot, 'package.json'));
const postcss = req('postcss');
const tailwind = req('@tailwindcss/postcss');
const root = path.resolve(__dirname, '..').replaceAll('\\', '/');
const theme = path.dirname(req.resolve('tailwindcss/package.json')).replaceAll('\\', '/');
const css = `@import "${theme}/theme.css";\n@import "${theme}/utilities.css" source(none);\n@source "${root}/src/web/security-product";`;
postcss([tailwind({base:root})]).process(css, {from:root+'/Trazabilidad/security-product-utilities.input.css'}).then(result => {
  const ast = postcss.parse(result.css);
  ast.walkAtRules('layer', node => node.nodes ? node.replaceWith(node.nodes) : node.remove());
  ast.walkRules(rule => {
    if (rule.parent.type === 'atrule' && rule.parent.name.includes('keyframes')) return;
    if (rule.selector.includes(':root') || rule.selector.includes(':host') || rule.selector.startsWith('&')) return;
    // The static core has a legacy 12-column .grid; Tailwind's .grid assumes none.
    if (rule.selector === '.grid') rule.append({prop:'grid-template-columns', value:'none'});
    rule.selector = rule.selectors.map(selector => 'body[data-security-product] '+selector).join(',');
  });
  fs.writeFileSync(root+'/Trazabilidad/security-product-utilities.css', ast.toString());
}).catch(error => { console.error(error); process.exitCode=1; });
