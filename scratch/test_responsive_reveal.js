const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('=== TESTE DE CORREÇÃO RESPONSIVA - VITRINE DE CASAS & SCROLL REVEAL ===');

// 1. Verificação do index.html
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

assert(
  !/<section\s+id="vitrine-imoveis"[^>]*data-reveal/i.test(indexHtml),
  'A section#vitrine-imoveis NÃO deve ter data-reveal para evitar que o container de 8000px permaneça em opacity:0'
);

assert(
  /<div\s+class="section-header"[^>]*data-reveal="fade-up"/i.test(indexHtml),
  'O cabeçalho .section-header deve ter data-reveal="fade-up" para animar ao scroll'
);

assert(
  indexHtml.includes('id="properties-grid"') && indexHtml.includes('data-stagger="true"'),
  'O grid de imóveis deve manter data-stagger="true"'
);
console.log('✅ index.html: Container de vitrine livre de bloqueio de opacidade, com cabeçalho animado.');

// 2. Verificação de js/scroll-effects.js
const scrollEffectsJs = fs.readFileSync(path.join(ROOT, 'js', 'scroll-effects.js'), 'utf8');

assert(
  scrollEffectsJs.includes('threshold: 0'),
  'threshold deve ser 0 para que elementos longos/responsivos disparem o reveal imediatamente'
);

assert(
  scrollEffectsJs.includes('window.innerWidth <= 768') || scrollEffectsJs.includes('isMobile'),
  'scroll-effects.js deve tratar dispositivos móveis com delays ágeis'
);

assert(
  scrollEffectsJs.includes('rect.top < windowHeight && rect.bottom > 0'),
  'observeElements deve detectar elementos já visíveis na tela e revelá-los sem espera'
);
console.log('✅ js/scroll-effects.js: threshold 0, detecção imediata de viewport e suporte ágil mobile.');

// 3. Verificação de css/animations.css
const animationsCss = fs.readFileSync(path.join(ROOT, 'css', 'animations.css'), 'utf8');

assert(
  animationsCss.includes('.property-card.is-revealed') || animationsCss.includes('[data-stagger="true"] > *.is-revealed'),
  'animations.css deve garantir opacidade 1 para cards revelados'
);

assert(
  animationsCss.includes('@media (max-width: 768px)'),
  'animations.css deve ter regras responsivas para 768px'
);
console.log('✅ css/animations.css: Regras de segurança de opacidade e transições responsivas ativas.');

console.log('\n🎉 TODOS OS TESTES RESPONSIVOS PASSARAM COM 100% DE SUCESSO!');
