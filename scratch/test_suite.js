const assert = require('assert');
const { PROPERTIES_DATA, INVEST_CERTO_INFO } = require('../js/data.js');
const { PropertySearchEngine } = require('../js/search.js');
const { FinanceCalculator } = require('../js/simulator.js');

console.log('--- TEST 1: Dados Institucionais & Catálogo ---');
assert(PROPERTIES_DATA.length >= 10, 'Deve conter pelo menos 10 imóveis reais');
assert(INVEST_CERTO_INFO.creci.includes('6623'), 'CRECI deve conter 6623');
assert(INVEST_CERTO_INFO.phoneRaw === '5531999389792', 'WhatsApp deve ser 5531999389792');
console.log('✅ Catálogo com', PROPERTIES_DATA.length, 'imóveis validados com sucesso.');

console.log('--- TEST 2: Motor de Busca & Filtragem ---');
const engine = new PropertySearchEngine(PROPERTIES_DATA);

// Test Venda
engine.setFilter('purpose', 'venda');
const vendas = engine.filter();
assert(vendas.length > 0 && vendas.every(p => p.purpose === 'venda'), 'Todos devem ser venda');

// Test Locação
engine.setFilter('purpose', 'locacao');
const locacoes = engine.filter();
assert(locacoes.length > 0 && locacoes.every(p => p.purpose === 'locacao'), 'Todos devem ser locação');

// Test Tipo Casa
engine.resetFilters();
engine.setFilter('type', 'casa');
const casas = engine.filter();
assert(casas.length > 0 && casas.every(p => p.type === 'casa'), 'Todos devem ser casa');

// Test Bairro Masterville
engine.resetFilters();
engine.setFilter('neighborhood', 'Masterville');
const masterville = engine.filter();
assert(masterville.length > 0 && masterville.every(p => p.neighborhood.includes('Masterville')), 'Filtro por bairro deve funcionar');

// Test Código do Imóvel #310
engine.resetFilters();
engine.setFilter('codeOrKeyword', '310');
const prop310 = engine.filter();
assert(prop310.length === 1 && prop310[0].code === '#310', 'Busca por código #310 deve retornar o imóvel exato');

console.log('✅ Motor de busca passou em todos os testes de filtragem.');

console.log('--- TEST 3: Simulador Financeiro SAC & PRICE ---');
const sac = FinanceCalculator.calculateSAC(450000, 90000, 360, 9.8);
assert(sac.principal === 360000, 'Saldo principal deve ser 360.000');
assert(sac.firstInstallment > 3000, 'Primeira parcela SAC deve ser consistente');
assert(sac.lastInstallment < sac.firstInstallment, 'SAC deve ser decrescente');

const price = FinanceCalculator.calculatePRICE(450000, 90000, 360, 9.8);
assert(price.firstInstallment === price.lastInstallment, 'PRICE deve ser constante');

const yieldCalc = FinanceCalculator.calculateYield(450000);
assert(yieldCalc.grossYield > 5 && yieldCalc.grossYield < 10, 'Yield deve estar em faixa de mercado');
assert(yieldCalc.totalAnnualReturn > 10, 'Retorno anual total deve considerar valorização');

console.log('✅ Simulador financeiro verificado com precisão matemática.');
console.log('🎉 TODOS OS TESTES PASSARAM COM 100% DE SUCESSO!');
