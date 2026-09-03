/**
 * INVEST CERTO IMÓVEIS - MOTOR DE BUSCA & FILTRAGEM REATIVA 2026
 */

class PropertySearchEngine {
  constructor(properties) {
    this.allProperties = properties;
    this.currentFilters = {
      purpose: 'venda',
      type: '',
      neighborhood: '',
      city: '',
      bedrooms: '',
      maxPrice: null,
      codeOrKeyword: ''
    };
  }

  setFilter(key, value) {
    this.currentFilters[key] = value;
  }

  resetFilters() {
    this.currentFilters = {
      purpose: 'venda',
      type: '',
      neighborhood: '',
      city: '',
      bedrooms: '',
      maxPrice: null,
      codeOrKeyword: ''
    };
  }

  filter() {
    return this.allProperties.filter(item => {
      // 1. Finalidade (Venda ou Locação)
      if (this.currentFilters.purpose && item.purpose !== this.currentFilters.purpose) {
        return false;
      }

      // 2. Tipo do Imóvel (casa, apartamento, cobertura, lote, comercial)
      if (this.currentFilters.type && this.currentFilters.type !== 'todos') {
        if (item.type !== this.currentFilters.type) {
          return false;
        }
      }

      // 3. Cidade / Bairro
      if (this.currentFilters.neighborhood) {
        const query = this.currentFilters.neighborhood.toLowerCase().trim();
        const inNeighborhood = item.neighborhood.toLowerCase().includes(query);
        const inCity = item.city.toLowerCase().includes(query);
        if (!inNeighborhood && !inCity) {
          return false;
        }
      }

      // 4. Quartos Mínimos
      if (this.currentFilters.bedrooms) {
        const minDorms = parseInt(this.currentFilters.bedrooms, 10);
        if (minDorms > 0 && item.bedrooms < minDorms) {
          return false;
        }
      }

      // 5. Preço Máximo
      if (this.currentFilters.maxPrice) {
        const max = parseFloat(this.currentFilters.maxPrice);
        if (max > 0 && item.price > max) {
          return false;
        }
      }

      // 6. Código ou Palavra-Chave
      if (this.currentFilters.codeOrKeyword) {
        const term = this.currentFilters.codeOrKeyword.toLowerCase().replace('#', '').trim();
        const matchCode = item.code.toLowerCase().includes(term);
        const matchTitle = item.title.toLowerCase().includes(term);
        const matchDesc = item.description.toLowerCase().includes(term);
        const matchNeigh = item.neighborhood.toLowerCase().includes(term);
        if (!matchCode && !matchTitle && !matchDesc && !matchNeigh) {
          return false;
        }
      }

      return true;
    });
  }

  getCities() {
    const cities = new Set(this.allProperties.map(p => p.city));
    return Array.from(cities).sort();
  }

  getNeighborhoods() {
    const hoods = new Set(this.allProperties.map(p => `${p.neighborhood} (${p.city})`));
    return Array.from(hoods).sort();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PropertySearchEngine };
}
