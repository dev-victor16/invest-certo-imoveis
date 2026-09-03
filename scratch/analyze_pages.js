const fs = require('fs');
const path = require('path');

const sobre = fs.readFileSync(path.join(__dirname, 'sobre.html'), 'latin1');
const imovel = fs.readFileSync(path.join(__dirname, 'imovel.html'), 'latin1');

console.log('=== SOBRE A EMPRESA ===');
const sobreText = sobre.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
const sobreMatches = sobreText.match(/<article[\s\S]*?<\/article>/i) || sobreText.match(/<main[\s\S]*?<\/main>/i) || sobreText.match(/class=["'].*?(sobre|conteudo|texto).*?["'][\s\S]*?<\/div>/i);
if (sobreMatches) {
  console.log(sobreMatches[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1000));
} else {
  // Extract paragraphs
  const ps = sobreText.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
  console.log('Paragraphs:', ps.map(p => p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).filter(t => t.length > 30));
}

console.log('\n=== DETALHES DO IMÓVEL ===');
const imovelTitle = imovel.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
console.log('Título do Imóvel:', imovelTitle ? imovelTitle[1].replace(/<[^>]+>/g, '').trim() : 'N/A');

const preco = imovel.match(/R\$\s*[\d\.,]+/gi) || [];
console.log('Preços encontrados:', [...new Set(preco)]);

const specs = imovel.match(/(Dormit[óo]rios|Quartos|Banheiros|Vagas|Su[íi]tes|[ÁA]rea)[^<]{1,30}/gi) || [];
console.log('Especificações:', [...new Set(specs)]);

const fotos = [];
const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
let m;
while ((m = imgRegex.exec(imovel)) !== null) {
  if (m[1].includes('imobibrasil') || m[1].includes('imoveis') || m[1].includes('fotos')) {
    fotos.push(m[1]);
  }
}
console.log('Fotos encontradas:', fotos.slice(0, 5));
