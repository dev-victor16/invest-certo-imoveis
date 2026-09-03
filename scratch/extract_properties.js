const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'live_invest_certo.html'), 'latin1');

const cardRegex = /<a[^>]*href=["'](\/imovel\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
const properties = [];
let m;
while ((m = cardRegex.exec(html)) !== null) {
  const url = m[1];
  const inner = m[2];
  
  const price = inner.match(/R\$\s*[\d\.,]+/);
  const code = inner.match(/#(\d+)/);
  const title = inner.match(/class=["'].*?(titulo|title).*?["'][^>]*>([\s\S]*?)<\//i) || inner.match(/(Casa|Apartamento|Lote|Comercial|Cobertura)[^<]+/i);
  const location = inner.match(/Ibirit[eé]|Sarzedo|Belo Horizonte[^<]+/i);
  const desc = inner.match(/(Casa|Apartamento|Lote|Comercial) para Venda[^<]+/i);
  
  const dorms = inner.match(/Dormit[óo]rios\s*(\d+)/i);
  const baths = inner.match(/Banheiros\s*(\d+)/i);
  const vagas = inner.match(/Vagas\s*(\d+)/i);
  const suites = inner.match(/Su[íi]tes\s*(\d+)/i);
  const area = inner.match(/(Privativa|Constru[íi]do|Total)\s*(\d+)/i);
  
  const img = inner.match(/src=["']([^"']+)["']/i) || inner.match(/data-src=["']([^"']+)["']/i);

  if (price && code) {
    properties.push({
      url,
      code: code[1],
      price: price[0],
      title: title ? title[0].replace(/<[^>]+>/g, '').trim() : 'Imóvel',
      location: location ? location[0].trim() : '',
      desc: desc ? desc[0].trim() : '',
      dorms: dorms ? dorms[1] : 0,
      baths: baths ? baths[1] : 0,
      vagas: vagas ? vagas[1] : 0,
      suites: suites ? suites[1] : 0,
      area: area ? area[2] : 0,
      img: img ? img[1] : ''
    });
  }
}

console.log('Total properties extracted from home:', properties.length);
console.log(JSON.stringify(properties, null, 2));
