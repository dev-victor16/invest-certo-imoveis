/**
 * INVEST CERTO IMÓVEIS - MOTOR DO SIMULADOR FINANCEIRO (SAC & PRICE & YIELD)
 */

const FinanceCalculator = {
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  },

  formatPercent(value) {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }).format(value) + '%';
  },

  calculateSAC(propertyValue, downPayment, termMonths, annualRatePercent) {
    const principal = propertyValue - downPayment;
    if (principal <= 0 || termMonths <= 0) return null;

    // Taxa mensal proporcional/efetiva
    const monthlyRate = Math.pow(1 + annualRatePercent / 100, 1 / 12) - 1;
    const amortization = principal / termMonths;

    // Primeira parcela (maior)
    const firstInterest = principal * monthlyRate;
    const firstInstallment = amortization + firstInterest;

    // Última parcela (menor)
    const lastPrincipal = amortization;
    const lastInterest = lastPrincipal * monthlyRate;
    const lastInstallment = amortization + lastInterest;

    // Total pago estimado
    const totalInterest = ((firstInterest + lastInterest) / 2) * termMonths;
    const totalFinanced = principal + totalInterest;

    // Renda mínima recomendada (parcela não pode exceder 30% da renda bruta)
    const minIncome = firstInstallment / 0.30;

    return {
      principal,
      firstInstallment,
      lastInstallment,
      totalFinanced,
      minIncome,
      system: 'SAC'
    };
  },

  calculatePRICE(propertyValue, downPayment, termMonths, annualRatePercent) {
    const principal = propertyValue - downPayment;
    if (principal <= 0 || termMonths <= 0) return null;

    const monthlyRate = Math.pow(1 + annualRatePercent / 100, 1 / 12) - 1;
    const factor = Math.pow(1 + monthlyRate, termMonths);
    const fixedInstallment = principal * ((monthlyRate * factor) / (factor - 1));

    const totalFinanced = fixedInstallment * termMonths;
    const minIncome = fixedInstallment / 0.30;

    return {
      principal,
      firstInstallment: fixedInstallment,
      lastInstallment: fixedInstallment,
      totalFinanced,
      minIncome,
      system: 'PRICE'
    };
  },

  calculateYield(propertyValue) {
    // Aluguel residencial médio na Grande BH / Ibirité: ~0.55% a 0.65% do valor do imóvel
    const monthlyRent = propertyValue * 0.0058;
    const annualRent = monthlyRent * 12;
    const grossYield = (annualRent / propertyValue) * 100;
    
    // Valorização imobiliária média anual histórica na região metropolitana: ~9.2% a.a.
    const appreciationRate = 9.2;
    const totalAnnualReturn = grossYield + appreciationRate;

    // Projeção de patrimônio em 5 anos (Valorização composta + Aluguéis reinvestidos)
    const futureValue5Years = propertyValue * Math.pow(1 + (appreciationRate / 100), 5);
    const totalRentAccumulated5Years = annualRent * 5;

    return {
      monthlyRent,
      annualRent,
      grossYield,
      appreciationRate,
      totalAnnualReturn,
      futureValue5Years,
      totalRentAccumulated5Years
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FinanceCalculator };
}
