/**
 * INVEST CERTO IMÓVEIS - APLICAÇÃO PRINCIPAL 2026
 * Gerenciamento de UI, Eventos, Modais, Filtros e Simulador
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização do Motor de Busca
  const searchEngine = new PropertySearchEngine(PROPERTIES_DATA);

  // Elementos do DOM
  const propertiesGrid = document.getElementById('properties-grid');
  const propertiesCount = document.getElementById('properties-count');
  const activeCategoryTitle = document.getElementById('active-category-title');
  const mainSearchForm = document.getElementById('main-search-form');

  // Modal Elements
  const modalBackdrop = document.getElementById('property-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalMainImg = document.getElementById('modal-main-img');
  const modalThumbRow = document.getElementById('modal-thumb-row');
  const modalCodeBadge = document.getElementById('modal-code-badge');
  const modalPropTitle = document.getElementById('modal-prop-title');
  const modalPropLocation = document.getElementById('modal-prop-location');
  const modalPropPrice = document.getElementById('modal-prop-price');
  const modalPropTaxInfo = document.getElementById('modal-prop-tax-info');
  const modalSpecsBar = document.getElementById('modal-specs-bar');
  const modalDescriptionText = document.getElementById('modal-description-text');
  const modalFeaturesList = document.getElementById('modal-features-list');
  const modalWhatsappBtn = document.getElementById('modal-whatsapp-btn');
  const modalSimulateBtn = document.getElementById('modal-simulate-btn');

  // Modal Anuncie / Proprietário
  const ownerModalBackdrop = document.getElementById('owner-modal-backdrop');
  const ownerModalClose = document.getElementById('owner-modal-close');
  const ownerForm = document.getElementById('owner-property-form');

  // Mobile Drawer
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');

  // Header Scroll Effect
  const mainHeader = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  // Mobile Drawer Toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
      drawerBackdrop.classList.toggle('active');
      document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    });

    drawerBackdrop.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('open');
        drawerBackdrop.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // =========================================================================
  // RENDERIZAÇÃO DOS CARDS DE IMÓVEIS
  // =========================================================================
  function renderProperties(list) {
    if (!propertiesGrid) return;

    if (list.length === 0) {
      propertiesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
          <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--color-navy-900); margin-bottom: 8px;">Nenhum imóvel encontrado para estes filtros</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 20px;">Tente ajustar os critérios de busca, como bairro ou faixa de preço, ou fale com nossos consultores para encontrarmos o imóvel ideal.</p>
          <button id="btn-reset-search" class="btn btn-primary btn-sm">Limpar Todos os Filtros</button>
        </div>
      `;
      const resetBtn = document.getElementById('btn-reset-search');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          searchEngine.resetFilters();
          resetSearchFormInputs();
          renderProperties(searchEngine.filter());
        });
      }
      if (propertiesCount) propertiesCount.textContent = '0 imóveis encontrados';
      return;
    }

    if (propertiesCount) {
      propertiesCount.textContent = `${list.length} ${list.length === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}`;
    }

    propertiesGrid.innerHTML = list.map(item => {
      const formattedPrice = FinanceCalculator.formatCurrency(item.price);
      const isRental = item.purpose === 'locacao';
      const installmentCalc = FinanceCalculator.calculateSAC(item.price, item.price * 0.2, 360, 9.8);
      const installmentText = (!isRental && installmentCalc) 
        ? `ou parcela a partir de ${FinanceCalculator.formatCurrency(installmentCalc.firstInstallment)}`
        : 'Locação rápida sem burocracia';

      return `
        <article class="property-card" data-id="${item.id}" data-reveal="fade-up">
          <div class="property-card-media">
            <img class="property-card-img" src="${item.coverImage}" alt="${item.title}" loading="lazy">
            <span class="property-purpose-pill">${item.purpose === 'venda' ? 'Venda' : 'Locação'}</span>
          </div>

          <div class="property-card-body">
            <div class="property-location">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${item.neighborhood}, ${item.city}</span>
            </div>

            <h3 class="property-title">${item.title}</h3>

            <div class="property-price-wrap">
              <div class="property-price">${formattedPrice}${isRental ? '<span style="font-size: 0.95rem; font-weight: 500; color: var(--text-muted);">/mês</span>' : ''}</div>
              <div class="property-installment">${installmentText}</div>
            </div>

            <div class="property-specs-grid">
              <div class="property-spec-item" title="Dormitórios">
                <div class="property-spec-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"></path>
                  </svg>
                </div>
                <div class="property-spec-value">${item.bedrooms}</div>
                <div class="property-spec-label">${item.bedrooms === 1 ? 'Quarto' : 'Quartos'}</div>
              </div>

              <div class="property-spec-item" title="Banheiros">
                <div class="property-spec-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 6h6M7 10h10M4 14h16M4 18h16"></path>
                  </svg>
                </div>
                <div class="property-spec-value">${item.bathrooms}</div>
                <div class="property-spec-label">${item.bathrooms === 1 ? 'Banheiro' : 'Banhos'}</div>
              </div>

              <div class="property-spec-item" title="Vagas de Garagem">
                <div class="property-spec-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                    <circle cx="7" cy="18" r="2"></circle>
                    <circle cx="17" cy="18" r="2"></circle>
                  </svg>
                </div>
                <div class="property-spec-value">${item.garageSlots}</div>
                <div class="property-spec-label">${item.garageSlots === 1 ? 'Vaga' : 'Vagas'}</div>
              </div>

              <div class="property-spec-item" title="Área Privativa">
                <div class="property-spec-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    <path d="M3 9h18M9 21V9"></path>
                  </svg>
                </div>
                <div class="property-spec-value">${item.privateArea}m²</div>
                <div class="property-spec-label">Privativo</div>
              </div>
            </div>

            <div class="property-card-footer">
              <button class="btn btn-outline btn-sm btn-card-details" data-open-modal="${item.id}">
                Ver Detalhes
              </button>
              <a href="${buildWhatsAppLink(item)}" target="_blank" rel="noopener" class="btn-card-whatsapp" title="Falar com Corretor no WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.67-1.39 1.25-1.92 1.32-.49.07-1.13.1-3.29-.79-2.76-1.15-4.54-3.95-4.68-4.14-.14-.19-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.27.25-.27.55-.34.73-.34.19 0 .37 0 .53.01.17.01.4.06.61.53.24.58.82 2 .89 2.15.07.15.12.33.02.53-.1.19-.15.31-.3.48-.15.17-.31.38-.45.51-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.79-.92 1-1.23.21-.31.43-.26.73-.15.3.11 1.91.9 2.24 1.06.33.17.55.25.63.39.08.14.08.82-.16 1.49z"/>
                </svg>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Adiciona listener nos botões de modal
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-open-modal');
        openPropertyModal(id);
      });
    });

    // Reativa observer de scroll nos novos cards renderizados
    if (typeof window.refreshScrollObserver === 'function') {
      window.refreshScrollObserver();
    }
  }

  function buildWhatsAppLink(item) {
    const isRental = item.purpose === 'locacao';
    const text = `Olá, Davidson! Gostei muito do imóvel *${item.code} - ${item.title}* (${FinanceCalculator.formatCurrency(item.price)}${isRental ? '/mês' : ''}) no bairro ${item.neighborhood}, anunciado no site da Invest Certo Imóveis. Poderia me enviar mais fotos e informações sobre as condições?`;
    return `https://wa.me/${INVEST_CERTO_INFO.phoneRaw}?text=${encodeURIComponent(text)}`;
  }

  function resetSearchFormInputs() {
    if (!mainSearchForm) return;
    mainSearchForm.reset();
    document.querySelectorAll('.purpose-tab-btn').forEach(b => b.classList.remove('active'));
    const defaultBtn = document.querySelector('.purpose-tab-btn[data-purpose="venda"]');
    if (defaultBtn) defaultBtn.classList.add('active');
  }

  // =========================================================================
  // ABAS DE CATEGORIA RÁPIDA (TODOS, CASAS, APARTAMENTOS, LOTES, LOCAÇÃO)
  // =========================================================================
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const cat = e.currentTarget.getAttribute('data-category');
      if (cat === 'todos') {
        searchEngine.setFilter('type', '');
        searchEngine.setFilter('purpose', 'venda');
        if (activeCategoryTitle) activeCategoryTitle.textContent = 'Todos os Imóveis para Venda';
      } else if (cat === 'locacao') {
        searchEngine.setFilter('type', '');
        searchEngine.setFilter('purpose', 'locacao');
        if (activeCategoryTitle) activeCategoryTitle.textContent = 'Imóveis para Locação em Ibirité e Região';
      } else {
        searchEngine.setFilter('type', cat);
        searchEngine.setFilter('purpose', 'venda');
        const nameMap = { casa: 'Casas à Venda', apartamento: 'Apartamentos à Venda', cobertura: 'Coberturas à Venda', lote: 'Lotes e Terrenos à Venda', comercial: 'Imóveis Comerciais' };
        if (activeCategoryTitle) activeCategoryTitle.textContent = nameMap[cat] || 'Imóveis em Destaque';
      }

      renderProperties(searchEngine.filter());
    });
  });

  // Purpose tabs na barra de busca (Comprar / Alugar)
  document.querySelectorAll('.purpose-tab-btn').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.purpose-tab-btn').forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const purpose = e.currentTarget.getAttribute('data-purpose');
      searchEngine.setFilter('purpose', purpose);
      renderProperties(searchEngine.filter());
    });
  });

  // Formulário de busca submit e input em tempo real
  if (mainSearchForm) {
    mainSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFormFilters();
      const target = document.getElementById('vitrine-imoveis');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Filtros dinâmicos com delay
    const inputs = mainSearchForm.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('change', applyFormFilters);
      if (input.tagName === 'INPUT') {
        input.addEventListener('input', applyFormFilters);
      }
    });
  }

  function applyFormFilters() {
    const type = document.getElementById('search-type')?.value || '';
    const neighborhood = document.getElementById('search-neighborhood')?.value || '';
    const bedrooms = document.getElementById('search-bedrooms')?.value || '';
    const maxPrice = document.getElementById('search-maxprice')?.value || '';
    const codeOrKeyword = document.getElementById('search-keyword')?.value || '';

    searchEngine.setFilter('type', type);
    searchEngine.setFilter('neighborhood', neighborhood);
    searchEngine.setFilter('bedrooms', bedrooms);
    searchEngine.setFilter('maxPrice', maxPrice);
    searchEngine.setFilter('codeOrKeyword', codeOrKeyword);

    renderProperties(searchEngine.filter());
  }

  // =========================================================================
  // MODAL IMERSIVO DE DETALHES DO IMÓVEL
  // =========================================================================
  function openPropertyModal(id) {
    const item = PROPERTIES_DATA.find(p => p.id === id);
    if (!item || !modalBackdrop) return;

    modalCodeBadge.textContent = item.code;
    modalPropTitle.textContent = item.title;
    modalPropLocation.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      <span>${item.neighborhood}, ${item.city} - ${item.state}</span>
    `;
    modalPropPrice.textContent = FinanceCalculator.formatCurrency(item.price) + (item.purpose === 'locacao' ? ' /mês' : '');
    
    modalPropTaxInfo.textContent = item.condoFee > 0 
      ? `Condomínio: R$ ${item.condoFee}/mês | IPTU Anual: R$ ${item.iptuYear}`
      : `IPTU Anual: R$ ${item.iptuYear} | Sem taxa de condomínio`;

    // Galeria
    modalMainImg.src = item.gallery[0] || item.coverImage;
    modalThumbRow.innerHTML = item.gallery.map((imgUrl, idx) => `
      <img src="${imgUrl}" class="modal-thumb-img ${idx === 0 ? 'active' : ''}" data-idx="${idx}" alt="Foto ${idx+1}">
    `).join('');

    modalThumbRow.querySelectorAll('.modal-thumb-img').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        modalThumbRow.querySelectorAll('.modal-thumb-img').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const idx = e.currentTarget.getAttribute('data-idx');
        modalMainImg.src = item.gallery[idx];
      });
    });

    // Ficha Técnica
    modalSpecsBar.innerHTML = `
      <div class="modal-spec-card">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"></path>
        </svg>
        <div class="modal-spec-val">${item.bedrooms}</div>
        <div class="modal-spec-lbl">${item.bedrooms === 1 ? 'Dormitório' : 'Dormitórios'}</div>
      </div>

      <div class="modal-spec-card">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
        <div class="modal-spec-val">${item.suites}</div>
        <div class="modal-spec-lbl">${item.suites === 1 ? 'Suíte' : 'Suítes'}</div>
      </div>

      <div class="modal-spec-card">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 6h6M7 10h10M4 14h16M4 18h16"></path>
        </svg>
        <div class="modal-spec-val">${item.bathrooms}</div>
        <div class="modal-spec-lbl">${item.bathrooms === 1 ? 'Banheiro' : 'Banheiros'}</div>
      </div>

      <div class="modal-spec-card">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
          <circle cx="7" cy="18" r="2"></circle>
          <circle cx="17" cy="18" r="2"></circle>
        </svg>
        <div class="modal-spec-val">${item.garageSlots}</div>
        <div class="modal-spec-lbl">${item.garageSlots === 1 ? 'Vaga Coberta' : 'Vagas'}</div>
      </div>

      <div class="modal-spec-card">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"></rect>
          <path d="M3 9h18M9 21V9"></path>
        </svg>
        <div class="modal-spec-val">${item.privateArea}m²</div>
        <div class="modal-spec-lbl">Área Privativa</div>
      </div>
    `;

    // Descrição e Características
    modalDescriptionText.textContent = item.description;
    modalFeaturesList.innerHTML = (item.features || []).map(f => `
      <div class="modal-feature-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${f}</span>
      </div>
    `).join('');

    // Botões de Ação
    modalWhatsappBtn.href = buildWhatsAppLink(item);
    
    if (modalSimulateBtn) {
      if (item.purpose === 'venda') {
        modalSimulateBtn.style.display = 'inline-flex';
        modalSimulateBtn.onclick = () => {
          closePropertyModal();
          const simSec = document.getElementById('simulador-financiamento');
          if (simSec) {
            simSec.scrollIntoView({ behavior: 'smooth' });
            prefillSimulator(item.price);
          }
        };
      } else {
        modalSimulateBtn.style.display = 'none';
      }
    }

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePropertyModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePropertyModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closePropertyModal();
    });
  }

  // =========================================================================
  // MODAL ANUNCIE SEU IMÓVEL / SEU IMÓVEL AQUI
  // =========================================================================
  window.openOwnerModal = function() {
    if (!ownerModalBackdrop) return;
    ownerModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeOwnerModal = function() {
    if (!ownerModalBackdrop) return;
    ownerModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (ownerModalClose) ownerModalClose.addEventListener('click', window.closeOwnerModal);
  if (ownerModalBackdrop) {
    ownerModalBackdrop.addEventListener('click', (e) => {
      if (e.target === ownerModalBackdrop) window.closeOwnerModal();
    });
  }

  if (ownerForm) {
    ownerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('owner-name')?.value || '';
      const phone = document.getElementById('owner-phone')?.value || '';
      const tipo = document.getElementById('owner-type')?.value || '';
      const finalidade = document.getElementById('owner-purpose')?.value || '';
      const bairro = document.getElementById('owner-neighborhood')?.value || '';
      const valor = document.getElementById('owner-value')?.value || '';

      const msg = `Olá, Davidson! Gostaria de cadastrar meu imóvel para *${finalidade}* com a Invest Certo Imóveis.%0A%0A*Proprietário:* ${nome}%0A*Telefone:* ${phone}%0A*Tipo de Imóvel:* ${tipo}%0A*Bairro/Cidade:* ${bairro}%0A*Valor Pretendido:* R$ ${valor}`;
      
      window.open(`https://wa.me/${INVEST_CERTO_INFO.phoneRaw}?text=${msg}`, '_blank');
      window.closeOwnerModal();
    });
  }

  // =========================================================================
  // SIMULADOR DE FINANCIAMENTO INTERATIVO
  // =========================================================================
  const simValSlider = document.getElementById('sim-val-slider');
  const simValText = document.getElementById('sim-val-text');
  const simEntrySlider = document.getElementById('sim-entry-slider');
  const simEntryText = document.getElementById('sim-entry-text');
  const simTermSlider = document.getElementById('sim-term-slider');
  const simTermText = document.getElementById('sim-term-text');

  const simResultInstallment = document.getElementById('sim-result-installment');
  const simResultFinanced = document.getElementById('sim-result-financed');
  const simResultIncome = document.getElementById('sim-result-income');
  const simResultLast = document.getElementById('sim-result-last');
  const simBtnWhatsApp = document.getElementById('sim-btn-whatsapp');

  let currentAmortization = 'SAC';

  function updateSimulator() {
    if (!simValSlider) return;

    const propVal = parseFloat(simValSlider.value);
    const entryPercent = parseFloat(simEntrySlider.value);
    const entryVal = propVal * (entryPercent / 100);
    const termMonths = parseInt(simTermSlider.value, 10);

    if (simValText) simValText.textContent = FinanceCalculator.formatCurrency(propVal);
    if (simEntryText) simEntryText.textContent = `${FinanceCalculator.formatCurrency(entryVal)} (${entryPercent}%)`;
    if (simTermText) simTermText.textContent = `${termMonths} meses (${Math.round(termMonths / 12)} anos)`;

    const result = currentAmortization === 'SAC'
      ? FinanceCalculator.calculateSAC(propVal, entryVal, termMonths, 9.8)
      : FinanceCalculator.calculatePRICE(propVal, entryVal, termMonths, 9.8);

    if (result) {
      if (simResultInstallment) simResultInstallment.textContent = FinanceCalculator.formatCurrency(result.firstInstallment);
      if (simResultFinanced) simResultFinanced.textContent = FinanceCalculator.formatCurrency(result.principal);
      if (simResultIncome) simResultIncome.textContent = FinanceCalculator.formatCurrency(result.minIncome);
      if (simResultLast) simResultLast.textContent = FinanceCalculator.formatCurrency(result.lastInstallment);

      if (simBtnWhatsApp) {
        const text = `Olá, Davidson! Fiz uma simulação no site da Invest Certo Imóveis:%0A- Valor do Imóvel: ${FinanceCalculator.formatCurrency(propVal)}%0A- Entrada: ${FinanceCalculator.formatCurrency(entryVal)} (${entryPercent}%)%0A- Prazo: ${termMonths} meses%0A- Sistema: ${currentAmortization}%0A- Parcela Estimada: ${FinanceCalculator.formatCurrency(result.firstInstallment)}%0A%0APoderia aprovar minha carta de crédito com a Caixa ou banco parceiro?`;
        simBtnWhatsApp.href = `https://wa.me/${INVEST_CERTO_INFO.phoneRaw}?text=${text}`;
      }
    }
  }

  function prefillSimulator(price) {
    if (!simValSlider) return;
    simValSlider.value = price;
    updateSimulator();
  }

  if (simValSlider && simEntrySlider && simTermSlider) {
    simValSlider.addEventListener('input', updateSimulator);
    simEntrySlider.addEventListener('input', updateSimulator);
    simTermSlider.addEventListener('input', updateSimulator);

    document.querySelectorAll('.amortization-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.amortization-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentAmortization = e.currentTarget.getAttribute('data-system');
        updateSimulator();
      });
    });

    updateSimulator();
  }

  // Render inicial dos imóveis
  renderProperties(searchEngine.filter());
});
