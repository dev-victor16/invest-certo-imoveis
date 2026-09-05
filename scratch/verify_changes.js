const fs = require('fs');
const path = require('path');
const http = require('http');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('--- VERIFICAÇÃO 1: Presença de Arquivos ---');
assert(fs.existsSync(path.join(ROOT, 'css', 'animations.css')), 'css/animations.css deve existir');
assert(fs.existsSync(path.join(ROOT, 'js', 'scroll-effects.js')), 'js/scroll-effects.js deve existir');
console.log('✅ css/animations.css e js/scroll-effects.js criados com sucesso.');

console.log('--- VERIFICAÇÃO 2: Verificação do index.html ---');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// 1. Google Fonts e animations.css vinculados
assert(indexHtml.includes('css/animations.css'), 'index.html deve incluir animations.css');
assert(indexHtml.includes('js/scroll-effects.js'), 'index.html deve incluir scroll-effects.js');
assert(indexHtml.includes('Plus+Jakarta+Sans'), 'index.html deve incluir Google Fonts Plus Jakarta Sans');

// 2. Identidade visual na navbar
assert(indexHtml.includes('brand-name-main'), 'index.html deve ter nome da marca estilizado na navbar');
assert(indexHtml.includes('INVEST <span class="brand-name-accent">CERTO</span>'), 'index.html deve ter INVEST CERTO em destaque');
assert(indexHtml.includes('INTELIGÊNCIA IMOBILIÁRIA'), 'index.html deve ter subtítulo Inteligência Imobiliária');

// 3. Remoção do hero-badge
assert(!indexHtml.includes('<div class="hero-badge">'), 'index.html NÃO deve conter hero-badge com CRECI-PJ envolto em caixa');

// 4. Remoção da tag Catálogo Exclusivo
assert(!indexHtml.includes('Catálogo Exclusivo'), 'index.html NÃO deve conter a tag Catálogo Exclusivo');

// 5. Scroll reveal e contadores na Hero
assert(indexHtml.includes('data-counter="180"'), 'Hero deve ter contador animado para R$ 180M');
assert(indexHtml.includes('data-counter="950"'), 'Hero deve ter contador animado para 950');
assert(indexHtml.includes('data-counter="100"'), 'Hero deve ter contador animado para 100%');
assert(indexHtml.includes('data-counter="24"'), 'Hero deve ter contador animado para 24h');
assert(indexHtml.includes('hero-load-anim'), 'Hero deve ter classe de animação inicial');

// 6. Vitrine com data-stagger e data-reveal
assert(indexHtml.includes('data-stagger="true"'), 'Vitrine de imóveis deve ter data-stagger="true"');
console.log('✅ index.html validado em todos os requisitos.');

console.log('--- VERIFICAÇÃO 3: Verificação de js/app.js ---');
const appJs = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');

// Não deve ter tags no topo das fotos nem o código pill
assert(!appJs.includes('<div class="property-badge-top-left">'), 'Cards não devem gerar badge no topo esquerdo');
assert(!appJs.includes('<span class="property-code-pill">'), 'Cards não devem gerar código pill flutuante no topo');
assert(appJs.includes('window.refreshScrollObserver()'), 'app.js deve chamar refreshScrollObserver após renderização');
assert(appJs.includes('data-reveal="fade-up"'), 'Cards de imóveis devem ter data-reveal="fade-up"');
console.log('✅ js/app.js validado: fotos limpas sem tags superiores e scroll reveal integrado.');

console.log('--- VERIFICAÇÃO 4: Verificação de css/components.css ---');
const compCss = fs.readFileSync(path.join(ROOT, 'css', 'components.css'), 'utf8');
assert(compCss.includes('opacity: 0.72'), 'property-purpose-pill deve ter opacidade reduzida');
assert(compCss.includes('background: transparent !important'), 'property-purpose-pill não deve ter fundo de botão');
console.log('✅ css/components.css validado: indicador de Venda sem aspecto de botão e com opacidade reduzida.');

console.log('--- VERIFICAÇÃO 5: Teste de Resposta HTTP do Servidor Local ---');
const urls = [
  'http://localhost:3000/',
  'http://localhost:3000/css/animations.css',
  'http://localhost:3000/js/scroll-effects.js',
  'http://localhost:3000/css/main.css',
  'http://localhost:3000/css/components.css'
];

let checked = 0;
urls.forEach(u => {
  http.get(u, res => {
    assert.strictEqual(res.statusCode, 200, `URL ${u} deve responder 200 OK`);
    checked++;
    if (checked === urls.length) {
      console.log('✅ Todas as URLs responderam com status 200 OK pelo servidor.');
      console.log('\n🎉 TODOS OS 5 PONTOS DO PEDIDO DO USUÁRIO FORAM 100% VALIDADOS!');
      process.exit(0);
    }
  }).on('error', err => {
    console.error('Erro na requisição:', err);
    process.exit(1);
  });
});
