/* =================================================================
   GUERRA FIT — app.js
   Integra: NutricaoEngine, ComprasEngine, BibliotecaExercicios,
            TreinoEngine, StorageEngine + Controlador da UI.
   ================================================================= */

/* ============================================================
   ENGINE 1 — NUTRIÇÃO (arquitetura fornecida pelo Gemini)
   ============================================================ */
const NutricaoEngine = {
  FATOR_ATIVIDADE: { moderado: 1.55, intenso: 1.725 },
  CALORIAS_POR_GRAMA: { proteina: 4, carboidrato: 4, gordura: 9 },

  calcularPlanoDiario(peso, altura, nivelAtividade, objetivo, numRefeicoes = 4, idade = 42) {
    const tmb = (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
    const fator = this.FATOR_ATIVIDADE[nivelAtividade] || this.FATOR_ATIVIDADE.intenso;
    const getd = tmb * fator;

    let caloriasAlvo = getd;
    if (objetivo === 'perda_gordura')    caloriasAlvo = getd - 500;
    else if (objetivo === 'ganho_massa') caloriasAlvo = getd + 400;

    const proteinaGrama = peso * 2.2;
    const gorduraGrama  = peso * 1.0;
    const proteinaKcal  = proteinaGrama * this.CALORIAS_POR_GRAMA.proteina;
    const gorduraKcal   = gorduraGrama  * this.CALORIAS_POR_GRAMA.gordura;
    const carboidratoKcal  = caloriasAlvo - (proteinaKcal + gorduraKcal);
    const carboidratoGrama = carboidratoKcal / this.CALORIAS_POR_GRAMA.carboidrato;
    const fibrasGrama = (caloriasAlvo / 1000) * 14;

    const macrosPorRefeicao = {
      calorias:    Math.round(caloriasAlvo    / numRefeicoes),
      proteina:    Math.round(proteinaGrama   / numRefeicoes),
      carboidrato: Math.round(carboidratoGrama/ numRefeicoes),
      gordura:     Math.round(gorduraGrama    / numRefeicoes),
      fibras:      Math.round(fibrasGrama     / numRefeicoes)
    };

    return {
      metricas: { tmb: Math.round(tmb), getd: Math.round(getd), caloriasAlvo: Math.round(caloriasAlvo) },
      macrosDiarios: {
        proteina:    Math.round(proteinaGrama),
        carboidrato: Math.round(carboidratoGrama),
        gordura:     Math.round(gorduraGrama),
        fibras:      Math.round(fibrasGrama)
      },
      refeicoes: { quantidade: numRefeicoes, porRefeicao: macrosPorRefeicao }
    };
  }
};

/* ============================================================
   ENGINE 2 — COMPRAS SEMANAIS
   ============================================================ */
const ComprasEngine = {
  CONVERSAO: {
    proteina_animal:   4.5,   // g de carne crua p/ obter 1g de proteína
    carboidrato_limpo: 3.5,   // g de alimento cru p/ obter 1g de carboidrato
    fibra_fonte:      10      // g de fonte p/ obter 1g de fibra
  },

  gerarListaSemanal(macrosDiarios) {
    const protSemana  = macrosDiarios.proteina    * 7;
    const carboSemana = macrosDiarios.carboidrato * 7;
    const fibraSemana = macrosDiarios.fibras      * 7;

    const protComida     = protSemana * 0.7;
    const protSuplemento = protSemana * 0.3;

    return {
      carnes_aves:   Math.round((protComida  * this.CONVERSAO.proteina_animal)   / 1000) + " kg (Frango / Patinho)",
      carboidratos:  Math.round((carboSemana * this.CONVERSAO.carboidrato_limpo) / 1000) + " kg (Arroz / Batata / Macarrão)",
      vegetais_aveia:Math.round((fibraSemana * this.CONVERSAO.fibra_fonte)       / 1000) + " kg (Mix Vegetais / Frutas / Aveia)",
      suplementos: [
        "Whey Protein: " + Math.round(protSuplemento / 0.8) + " g na semana",
        "Creatina: 42 g (6 g/dia)"
      ],
      outros: "Azeite, ovos, temperos (contabilizar na gordura diária)"
    };
  }
};

/* ============================================================
   ENGINE 3 — BIBLIOTECA DE EXERCÍCIOS
   ============================================================ */
const BibliotecaExercicios = [
  {
    id: "back_squat",
    nome: "Agachamento Costas (Back Squat)",
    modalidade: "Musculação",
    video_url: "https://www.youtube.com/embed/bEv6CCg2BC8",
    dicas: "Calcanhar apoiado, core travado, quebra da paralela.",
    alerta_critico: "Evite o valgo dinâmico (joelhos para dentro) na fase concêntrica."
  },
  {
    id: "sled_push",
    nome: "Sled Push (Empurre de Trólei)",
    modalidade: "Hyrox",
    video_url: "https://www.youtube.com/embed/7X8mG-J9XDM",
    dicas: "Passadas curtas e explosivas, braços travados perto do corpo.",
    alerta_critico: "Não curve a lombar. Mantenha o quadril em linha com o tronco."
  },
  {
    id: "wall_balls",
    nome: "Wall Balls",
    modalidade: "CrossFit / Hyrox",
    video_url: "https://www.youtube.com/embed/EqjGCJkvxTU",
    dicas: "Aproveite o impulso do agachamento para lançar a bola.",
    alerta_critico: "Não deixe a bola 'esmagar' você na descida; receba absorvendo o impacto."
  }
];

/* ============================================================
   ENGINE 4 — PERIODIZAÇÃO SEMANAL
   ============================================================ */
const TreinoEngine = {
  gerarSemana(rpeSabado) {
    let semanaPlano = {
      domingo: "Descanso Ativo / Mobilidade e Alongamento",
      segunda: "",
      terca: "",
      quarta: "Musculação: Pernas / Core",
      quinta: "CrossFit: Condicionamento (WOD de média duração)",
      sexta: "Mobilidade Pré-Prova / Descanso Ativo",
      sabado: "Hyrox"
    };
    if (rpeSabado >= 9) {
      semanaPlano.segunda = "Recuperação Ativa / Natação / Remo leve";
      semanaPlano.terca   = "Musculação: Membros Superiores (Cargas moderadas)";
    } else {
      semanaPlano.segunda = "Musculação: Força Máxima (Peito / Costas)";
      semanaPlano.terca   = "CrossFit: LPO e Ginásticos";
    }
    return semanaPlano;
  }
};

/* ============================================================
   ENGINE 5 — STORAGE (LocalStorage)
   ============================================================ */
const StorageEngine = {
  CHAVE_TREINOS: 'guerra_fit_treinos',
  CHAVE_PERFIL:  'guerra_fit_perfil',
  CHAVE_PLANO:   'guerra_fit_plano',

  salvarTreinoConcluido(dataISO, exercicioId, cargaKg, reps) {
    let historico = JSON.parse(localStorage.getItem(this.CHAVE_TREINOS)) || [];
    historico.push({ data: dataISO, exercicioId, cargaMaxima: cargaKg, repeticoes: reps });
    localStorage.setItem(this.CHAVE_TREINOS, JSON.stringify(historico));
  },
  obterHistoricoCompleto() {
    return JSON.parse(localStorage.getItem(this.CHAVE_TREINOS)) || [];
  },
  obterProgressoExercicio(exercicioId) {
    return this.obterHistoricoCompleto()
      .filter(t => t.exercicioId === exercicioId)
      .sort((a, b) => new Date(a.data) - new Date(b.data));
  },
  salvarPerfil(perfil)  { localStorage.setItem(this.CHAVE_PERFIL, JSON.stringify(perfil)); },
  obterPerfil()         { return JSON.parse(localStorage.getItem(this.CHAVE_PERFIL)) || null; },
  salvarPlano(plano)    { localStorage.setItem(this.CHAVE_PLANO,  JSON.stringify(plano));  },
  obterPlano()          { return JSON.parse(localStorage.getItem(this.CHAVE_PLANO))  || null; }
};

/* ============================================================
   UI CONTROLLER
   ============================================================ */
const UI = {
  $:  (s, c = document) => c.querySelector(s),
  $$: (s, c = document) => Array.from(c.querySelectorAll(s)),

  init() {
    this.bindTabs();
    this.bindFormPerfil();
    this.bindFormRpe();
    this.bindFormCarga();
    this.bindBuscaExercicios();
    this.bindModal();
    this.renderExercicios();
    this.renderSelectCargas();
    this.renderHistorico();
    this.restaurarSessao();
  },

  /* ---------- TABS ---------- */
  bindTabs() {
    this.$$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.tab;
        this.$$('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
        this.$$('.tab-content').forEach(s => s.classList.toggle('active', s.id === id));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  },

  /* ---------- PERFIL & DIETA ---------- */
  bindFormPerfil() {
    this.$('#formPerfil').addEventListener('submit', e => {
      e.preventDefault();
      const perfil = {
        peso:            parseFloat(this.$('#peso').value),
        altura:          parseFloat(this.$('#altura').value),
        idade:           parseInt(this.$('#idade').value, 10),
        numRefeicoes:    parseInt(this.$('#numRefeicoes').value, 10),
        nivelAtividade:  this.$('#nivelAtividade').value,
        objetivo:        this.$('#objetivo').value
      };
      if (!perfil.peso || !perfil.altura) return;

      const plano = NutricaoEngine.calcularPlanoDiario(
        perfil.peso, perfil.altura, perfil.nivelAtividade,
        perfil.objetivo, perfil.numRefeicoes, perfil.idade
      );

      StorageEngine.salvarPerfil(perfil);
      StorageEngine.salvarPlano(plano);
      this.renderPlano(plano);
      this.renderCompras(plano.macrosDiarios);
      this.atualizarBrandTag(perfil);
    });
  },

  renderPlano(plano) {
    const wrap = this.$('#planoResultado');
    wrap.classList.remove('hidden');

    this.$('#mTmb').textContent  = plano.metricas.tmb.toLocaleString('pt-BR');
    this.$('#mGetd').textContent = plano.metricas.getd.toLocaleString('pt-BR');
    this.$('#mAlvo').textContent = plano.metricas.caloriasAlvo.toLocaleString('pt-BR');

    this.$('#dProt').textContent = plano.macrosDiarios.proteina;
    this.$('#dCarb').textContent = plano.macrosDiarios.carboidrato;
    this.$('#dGord').textContent = plano.macrosDiarios.gordura;
    this.$('#dFib').textContent  = plano.macrosDiarios.fibras;

    this.$('#qtdRefLabel').textContent = `· ${plano.refeicoes.quantidade} REFEIÇÕES`;

    const por = plano.refeicoes.porRefeicao;
    const grid = this.$('#refeicoesGrid');
    grid.innerHTML = '';
    for (let i = 1; i <= plano.refeicoes.quantidade; i++) {
      const card = document.createElement('div');
      card.className = 'ref-card';
      card.style.animationDelay = `${i * 60}ms`;
      card.innerHTML = `
        <h4>Refeição ${String(i).padStart(2,'0')} <small>${por.calorias} kcal</small></h4>
        <div class="ref-list">
          <div class="ref-item"><span>Prot</span><span>${por.proteina} g</span></div>
          <div class="ref-item"><span>Carb</span><span>${por.carboidrato} g</span></div>
          <div class="ref-item"><span>Gord</span><span>${por.gordura} g</span></div>
          <div class="ref-item"><span>Fibra</span><span>${por.fibras} g</span></div>
        </div>`;
      grid.appendChild(card);
    }
  },

  atualizarBrandTag(perfil) {
    const objLabel = {
      perda_gordura: 'CUTTING',
      ganho_massa:   'BULKING',
      manutencao:    'MANUTENÇÃO'
    }[perfil.objetivo] || '';
    this.$('#brandTag').textContent = `${perfil.peso}kg · ${objLabel}`;
  },

  /* ---------- COMPRAS ---------- */
  renderCompras(macrosDiarios) {
    const lista = ComprasEngine.gerarListaSemanal(macrosDiarios);
    this.$('#comprasVazio').classList.add('hidden');
    this.$('#comprasResultado').classList.remove('hidden');

    this.$('#cCarnes').textContent  = lista.carnes_aves;
    this.$('#cCarbo').textContent   = lista.carboidratos;
    this.$('#cVeg').textContent     = lista.vegetais_aveia;
    this.$('#cExtras').textContent  = lista.outros;

    const sup = this.$('#cSupCard');
    sup.innerHTML = lista.suplementos.map(s => {
      const [nome, valor] = s.split(':');
      return `
        <div class="list-row">
          <span class="list-icon">💊</span>
          <div>
            <span class="list-label">${nome.trim()}</span>
            <span class="list-value">${(valor || '').trim()}</span>
          </div>
        </div>`;
    }).join('');
  },

  /* ---------- TREINO / SEMANA ---------- */
  bindFormRpe() {
    const range = this.$('#rpeRange');
    const valor = this.$('#rpeValor');
    range.addEventListener('input', () => valor.textContent = range.value);

    this.$('#formRpe').addEventListener('submit', e => {
      e.preventDefault();
      const rpe = parseInt(range.value, 10);
      this.renderSemana(TreinoEngine.gerarSemana(rpe));
    });
  },

  renderSemana(semana) {
    const wrap = this.$('#semanaResultado');
    wrap.classList.remove('hidden');
    wrap.innerHTML = '';

    const ordem = ['domingo','segunda','terca','quarta','quinta','sexta','sabado'];
    const labels = {
      domingo:'DOM', segunda:'SEG', terca:'TER',
      quarta:'QUA', quinta:'QUI', sexta:'SEX', sabado:'SÁB'
    };
    const hojeIdx = new Date().getDay(); // 0 = domingo

    ordem.forEach((dia, i) => {
      const card = document.createElement('div');
      card.className = 'dia-card' + (i === hojeIdx ? ' dia-hoje' : '');
      card.style.animationDelay = `${i * 50}ms`;
      card.innerHTML = `
        <span class="dia-tag">${labels[dia]}</span>
        <span class="dia-plano">${semana[dia]}</span>`;
      wrap.appendChild(card);
    });
  },

  /* ---------- EXERCÍCIOS ---------- */
  renderExercicios(filtroModalidade = 'TODOS', textoBusca = '') {
    const grid = this.$('#exGrid');
    grid.innerHTML = '';
    const termo = textoBusca.toLowerCase().trim();

    const lista = BibliotecaExercicios.filter(ex => {
      const passaModalidade = filtroModalidade === 'TODOS' || ex.modalidade.toUpperCase().includes(filtroModalidade);
      const passaBusca = !termo || ex.nome.toLowerCase().includes(termo);
      return passaModalidade && passaBusca;
    });

    if (!lista.length) {
      grid.innerHTML = `<div class="empty-state small" style="grid-column:1/-1"><p>Nenhum movimento encontrado.</p></div>`;
      return;
    }

    lista.forEach((ex, i) => {
      const card = document.createElement('div');
      card.className = 'ex-card';
      card.style.animationDelay = `${i * 40}ms`;
      card.innerHTML = `
        <span class="badge">${ex.modalidade}</span>
        <h4>${ex.nome}</h4>`;
      card.addEventListener('click', () => this.abrirModal(ex));
      grid.appendChild(card);
    });

    this.renderChips(filtroModalidade);
  },

  renderChips(ativa) {
    const modalidades = ['TODOS', ...new Set(
      BibliotecaExercicios.flatMap(e => e.modalidade.split('/').map(m => m.trim().toUpperCase()))
    )];
    const wrap = this.$('#exChips');
    wrap.innerHTML = '';
    modalidades.forEach(m => {
      const c = document.createElement('button');
      c.className = 'chip' + (m === ativa ? ' active' : '');
      c.textContent = m;
      c.addEventListener('click', () => this.renderExercicios(m, this.$('#exBusca').value));
      wrap.appendChild(c);
    });
  },

  bindBuscaExercicios() {
    this.$('#exBusca').addEventListener('input', e => {
      const chipAtivo = this.$('.chip.active')?.textContent || 'TODOS';
      this.renderExercicios(chipAtivo, e.target.value);
    });
  },

  /* ---------- MODAL ---------- */
  bindModal() {
    this.$$('[data-close]').forEach(el =>
      el.addEventListener('click', () => this.fecharModal())
    );
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.fecharModal();
    });
  },
  abrirModal(ex) {
    this.$('#modalNome').textContent  = ex.nome;
    this.$('#modalMod').textContent   = ex.modalidade;
    this.$('#modalDicas').textContent = ex.dicas;
    this.$('#modalAlerta').textContent= ex.alerta_critico;
    this.$('#modalVideo').src         = ex.video_url;
    this.$('#exModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  },
  fecharModal() {
    this.$('#exModal').classList.remove('open');
    this.$('#modalVideo').src = ''; // mata o player
    document.body.style.overflow = '';
  },

  /* ---------- HISTÓRICO / CARGAS ---------- */
  renderSelectCargas() {
    const sel = this.$('#cargaEx');
    sel.innerHTML = BibliotecaExercicios.map(ex =>
      `<option value="${ex.id}">${ex.nome}</option>`
    ).join('');
  },

  bindFormCarga() {
    this.$('#formCarga').addEventListener('submit', e => {
      e.preventDefault();
      const exId = this.$('#cargaEx').value;
      const kg   = parseFloat(this.$('#cargaKg').value);
      const reps = parseInt(this.$('#cargaReps').value, 10);
      if (!exId || isNaN(kg) || isNaN(reps)) return;

      StorageEngine.salvarTreinoConcluido(new Date().toISOString(), exId, kg, reps);
      this.$('#cargaKg').value = '';
      this.$('#cargaReps').value = '';
      this.renderHistorico();
    });
  },

  renderHistorico() {
    const lista = this.$('#historicoLista');
    const historico = StorageEngine.obterHistoricoCompleto()
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 20);

    if (!historico.length) {
      lista.innerHTML = `<div class="empty-state small"><p>Nenhum registro ainda.</p></div>`;
      return;
    }

    const mapaNomes = Object.fromEntries(BibliotecaExercicios.map(e => [e.id, e.nome]));
    lista.innerHTML = historico.map(h => {
      const data = new Date(h.data);
      const dataFmt = data.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' }) +
                      ' · ' + data.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
      return `
        <div class="hist-item">
          <div class="hist-info">
            <span class="hist-nome">${mapaNomes[h.exercicioId] || h.exercicioId}</span>
            <span class="hist-data">${dataFmt} · ${h.repeticoes} reps</span>
          </div>
          <span class="hist-carga">${h.cargaMaxima}<small>kg</small></span>
        </div>`;
    }).join('');
  },

  /* ---------- SESSÃO ---------- */
  restaurarSessao() {
    const perfil = StorageEngine.obterPerfil();
    const plano  = StorageEngine.obterPlano();
    if (perfil) {
      this.$('#peso').value           = perfil.peso ?? '';
      this.$('#altura').value         = perfil.altura ?? '';
      this.$('#idade').value          = perfil.idade ?? 42;
      this.$('#numRefeicoes').value   = perfil.numRefeicoes ?? 4;
      this.$('#nivelAtividade').value = perfil.nivelAtividade ?? 'intenso';
      this.$('#objetivo').value       = perfil.objetivo ?? 'manutencao';
      this.atualizarBrandTag(perfil);
    }
    if (plano) {
      this.renderPlano(plano);
      this.renderCompras(plano.macrosDiarios);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => UI.init());
