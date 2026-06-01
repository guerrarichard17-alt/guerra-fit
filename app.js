/* =================================================================
   GUERRA FIT — app.js (v5 Expandido)
   Master Schedule + Módulo Vegetariano + Exportação ICS
   ================================================================= */

/* ============================================================
   ENGINE 1 — NUTRIÇÃO
   ============================================================ */
const NutricaoEngine = {
  FATOR_ATIVIDADE: { 
    moderado: 1.55, 
    intenso: 1.725 
  },
  CALORIAS_POR_GRAMA: { 
    proteina: 4, 
    carboidrato: 4, 
    gordura: 9 
  },

  calcularPlanoDiario(peso, altura, nivelAtividade, objetivo, numRefeicoes = 4, idade = 42, tipoDieta = 'padrao') {
    const tmb = (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
    const fator = this.FATOR_ATIVIDADE[nivelAtividade] || this.FATOR_ATIVIDADE.intenso;
    const getd = tmb * fator;

    let caloriasAlvo = getd;
    if (objetivo === 'perda_gordura') {
      caloriasAlvo = getd - 500;
    } else if (objetivo === 'ganho_massa') {
      caloriasAlvo = getd + 400;
    }

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
      tipoDieta: tipoDieta,
      metricas: { 
        tmb: Math.round(tmb), 
        getd: Math.round(getd), 
        caloriasAlvo: Math.round(caloriasAlvo) 
      },
      macrosDiarios: {
        proteina:    Math.round(proteinaGrama),
        carboidrato: Math.round(carboidratoGrama),
        gordura:     Math.round(gorduraGrama),
        fibras:      Math.round(fibrasGrama)
      },
      refeicoes: { 
        quantidade: numRefeicoes, 
        porRefeicao: macrosPorRefeicao 
      }
    };
  }
};

/* ============================================================
   BASE DE ALIMENTOS
   ============================================================ */
const Alimentos = {
  // Proteínas Animais
  ovo_inteiro:   { nome: "Ovo inteiro",            emoji: "🥚", prot: 13, carb: 1,  gord: 11, fibra: 0,  un: "un", peso_un: 50 },
  frango:        { nome: "Peito de frango (cru)",  emoji: "🍗", prot: 22, carb: 0,  gord: 2,  fibra: 0  },
  patinho:       { nome: "Patinho moído (cru)",    emoji: "🥩", prot: 21, carb: 0,  gord: 6,  fibra: 0  },
  tilapia:       { nome: "Filé de tilápia",        emoji: "🐟", prot: 20, carb: 0,  gord: 2,  fibra: 0  },
  whey:          { nome: "Whey Protein",           emoji: "💪", prot: 80, carb: 8,  gord: 5,  fibra: 0  },
  iogurte:       { nome: "Iogurte natural desn.",  emoji: "🥛", prot: 10, carb: 4,  gord: 0,  fibra: 0  },
  
  // Proteínas Vegetais
  tofu:          { nome: "Tofu (Queijo de Soja)",  emoji: "🧊", prot: 15, carb: 3,  gord: 8,  fibra: 2  },
  pts:           { nome: "Prot. Texturizada Soja", emoji: "🌱", prot: 50, carb: 30, gord: 1,  fibra: 15 },

  // Carboidratos Limpos
  arroz:         { nome: "Arroz cozido",           emoji: "🍚", prot: 3,  carb: 28, gord: 0,  fibra: 0  },
  batata_doce:   { nome: "Batata-doce cozida",     emoji: "🍠", prot: 2,  carb: 20, gord: 0,  fibra: 3  },
  macarrao:      { nome: "Macarrão cozido",        emoji: "🍝", prot: 5,  carb: 25, gord: 1,  fibra: 1  },
  aveia:         { nome: "Aveia em flocos",        emoji: "🌾", prot: 14, carb: 67, gord: 8,  fibra: 9  },
  pao_integral:  { nome: "Pão integral",           emoji: "🍞", prot: 9,  carb: 43, gord: 4,  fibra: 6  },
  banana:        { nome: "Banana",                 emoji: "🍌", prot: 1,  carb: 23, gord: 0,  fibra: 3  },
  doce_leite:    { nome: "Doce de Leite",          emoji: "🍯", prot: 6,  carb: 60, gord: 6,  fibra: 0  },
  lentilha:      { nome: "Lentilha cozida",        emoji: "🍲", prot: 9,  carb: 20, gord: 0,  fibra: 8  },
  grao_de_bico:  { nome: "Grão-de-bico cozido",    emoji: "🧆", prot: 9,  carb: 27, gord: 2,  fibra: 7  },

  // Fibras e Vegetais
  brocolis:      { nome: "Brócolis cozido",        emoji: "🥦", prot: 3,  carb: 7,  gord: 0,  fibra: 3  },
  salada_verde:  { nome: "Salada verde (mix)",     emoji: "🥗", prot: 1,  carb: 3,  gord: 0,  fibra: 2  },
  legumes_mix:   { nome: "Legumes variados",       emoji: "🥕", prot: 1,  carb: 8,  gord: 0,  fibra: 3  },

  // Gorduras
  azeite:        { nome: "Azeite extra-virgem",    emoji: "🫒", prot: 0,  carb: 0,  gord: 100, fibra: 0  },
  pasta_amend:   { nome: "Pasta de amendoim",      emoji: "🥜", prot: 25, carb: 20, gord: 50, fibra: 6  }
};

/* ============================================================
   TEMPLATES DE REFEIÇÃO (Sem Empilhamento)
   ============================================================ */
const TemplatesRefeicao = {
  4: [
    { 
      nome: "Pré-Treino (Madrugada)", hora: "03:30", icon: "⚡", 
      slots: [
        { tipo: "prot", alimentos: ["whey"] }, 
        { tipo: "carb", alimentos: ["banana"] }, 
        { tipo: "gord", alimentos: [] }, 
        { tipo: "fibra", alimentos: [] }
      ] 
    },
    { 
      nome: "Desjejum", hora: "06:30", icon: "☀️", 
      slots: [
        { tipo: "prot", alimentos: ["ovo_inteiro"] }, 
        { tipo: "carb", alimentos: ["pao_integral"] }, 
        { tipo: "gord", alimentos: [] }, 
        { tipo: "fibra", alimentos: ["banana"] }
      ] 
    },
    { 
      nome: "Almoço", hora: "12:30", icon: "🍽", 
      slots: [
        { tipo: "prot", alimentos: ["frango"] }, 
        { tipo: "carb", alimentos: ["arroz"] }, 
        { tipo: "gord", alimentos: ["azeite"] }, 
        { tipo: "fibra", alimentos: ["salada_verde"] }
      ] 
    },
    { 
      nome: "Jantar", hora: "20:00", icon: "🌙", 
      slots: [
        { tipo: "prot", alimentos: ["patinho"] }, 
        { tipo: "carb", alimentos: ["batata_doce"] }, 
        { tipo: "gord", alimentos: ["azeite"] }, 
        { tipo: "fibra", alimentos: ["brocolis"] }
      ] 
    }
  ],
  5: [
    { 
      nome: "Pré-Treino Expresso", hora: "03:30", icon: "⚡", 
      slots: [
        { tipo: "prot", alimentos: [] }, 
        { tipo: "carb", alimentos: ["doce_leite", "banana"] }, 
        { tipo: "gord", alimentos: [] }, 
        { tipo: "fibra", alimentos: [] }
      ] 
    },
    { 
      nome: "Desjejum (Pós-Fretado)", hora: "06:30", icon: "☀️", 
      slots: [
        { tipo: "prot", alimentos: ["ovo_inteiro"] }, 
        { tipo: "carb", alimentos: ["pao_integral"] }, 
        { tipo: "gord", alimentos: [] }, 
        { tipo: "fibra", alimentos: [] }
      ] 
    },
    { 
      nome: "Almoço", hora: "12:30", icon: "🍽", 
      slots: [
        { tipo: "prot", alimentos: ["frango"] }, 
        { tipo: "carb", alimentos: ["arroz"] }, 
        { tipo: "gord", alimentos: ["azeite"] }, 
        { tipo: "fibra", alimentos: ["salada_verde"] }
      ] 
    },
    { 
      nome: "Lanche (Estudos/Escritório)", hora: "16:30", icon: "🥪", 
      slots: [
        { tipo: "prot", alimentos: ["whey"] }, 
        { tipo: "carb", alimentos: ["aveia"] }, 
        { tipo: "gord", alimentos: ["pasta_amend"] }, 
        { tipo: "fibra", alimentos: [] }
      ] 
    },
    { 
      nome: "Jantar (Família)", hora: "20:00", icon: "🌙", 
      slots: [
        { tipo: "prot", alimentos: ["patinho"] }, 
        { tipo: "carb", alimentos: ["batata_doce"] }, 
        { tipo: "gord", alimentos: ["azeite"] }, 
        { tipo: "fibra", alimentos: ["legumes_mix"] }
      ] 
    }
  ]
};

const TemplatesRefeicaoVeg = {
  4: [
    { 
      nome: "Pré-Treino (Madrugada)", hora: "03:30", icon: "⚡", 
      slots: [
        { tipo: "prot", alimentos: ["whey"] }, 
        { tipo: "carb", alimentos: ["banana"] }, 
        { tipo: "gord", alimentos: [] }, 
        { tipo: "fibra", alimentos: [] }
      ] 
    },
    { 
      nome: "Desjejum", hora: "06:30", icon: "☀️", 
      slots: [
        { tipo: "prot", alimentos: ["ovo_inteiro"] }, 
        { tipo: "carb", alimentos: ["pao_integral"] }, 
        { tipo: "gord", alimentos: [] }, 
        { tipo: "fibra", alimentos: ["banana"] }
      ] 
    },
    { 
      nome: "Almoço", hora: "12:30", icon: "🍽", 
      slots: [
        { tipo: "prot", alimentos: ["pts"] }, 
        { tipo: "carb", alimentos: ["lentilha"] }, 
        { tipo: "gord", alimentos: ["azeite"] }, 
        { tipo: "fibra", alimentos: ["salada_verde"] }
      ] 
    },
    { 
      nome: "Jantar", hora: "20:00", icon: "🌙", 
      slots: [
        { tipo: "prot", alimentos: ["tofu", "ovo_inteiro"] }, 
        { tipo: "carb", alimentos: ["grao_de_bico"] }, 
        { tipo: "gord", alimentos: ["azeite"] }, 
        { tipo: "fibra", alimentos: ["brocolis"] }
      ] 
    }
  ],
  5: [
    { 
      nome: "Pré-Treino Expresso", hora: "03:30", icon: "⚡", 
      slots: [
        { tipo: "prot", alimentos: [] }, 
        { tipo: "carb", alimentos: ["doce_leite", "banana"] }, 
        { tipo: "gord", alimentos: [] }, 
        { tipo: "fibra", alimentos: [] }
      ] 
    },
    { 
      nome: "Desjejum (Pós-Fretado)", hora: "06:30", icon: "☀️", 
      slots: [
        { tipo: "prot", alimentos: ["ovo_inteiro"] }, 
        { tipo: "carb", alimentos: ["pao_integral"] }, 
        { tipo: "gord", alimentos: [] }, 
        { tipo: "fibra", alimentos: [] }
      ] 
    },
    { 
      nome: "Almoço", hora: "12:30", icon: "🍽", 
      slots: [
        { tipo: "prot", alimentos: ["pts"] }, 
        { tipo: "carb", alimentos: ["lentilha"] }, 
        { tipo: "gord", alimentos: ["azeite"] }, 
        { tipo: "fibra", alimentos: ["salada_verde"] }
      ] 
    },
    { 
      nome: "Lanche (Estudos/Escritório)", hora: "16:30", icon: "🥪", 
      slots: [
        { tipo: "prot", alimentos: ["whey"] }, 
        { tipo: "carb", alimentos: ["aveia"] }, 
        { tipo: "gord", alimentos: ["pasta_amend"] }, 
        { tipo: "fibra", alimentos: [] }
      ] 
    },
    { 
      nome: "Jantar (Família)", hora: "20:00", icon: "🌙", 
      slots: [
        { tipo: "prot", alimentos: ["tofu"] }, 
        { tipo: "carb", alimentos: ["batata_doce"] }, 
        { tipo: "gord", alimentos: ["azeite"] }, 
        { tipo: "fibra", alimentos: ["legumes_mix"] }
      ] 
    }
  ]
};

// Fallbacks de Templates
TemplatesRefeicao[3] = TemplatesRefeicao[4]; 
TemplatesRefeicao[6] = TemplatesRefeicao[5];
TemplatesRefeicaoVeg[3] = TemplatesRefeicaoVeg[4]; 
TemplatesRefeicaoVeg[6] = TemplatesRefeicaoVeg[5];

/* ============================================================
   MONTADOR DE REFEIÇÃO
   ============================================================ */
const MontadorRefeicao = {
  macroPrincipal: { 
    prot: "proteina", 
    carb: "carboidrato", 
    gord: "gordura", 
    fibra: "fibra" 
  },
  macroKey: { 
    proteina: "prot", 
    carboidrato: "carb", 
    gordura: "gord", 
    fibra: "fibra" 
  },

  distribuirSlot(alimentosIds, gramasMacroAlvo, macroAlvoNome) {
    if (!alimentosIds.length || gramasMacroAlvo <= 0) return [];
    
    const result = [];
    const cota = gramasMacroAlvo / alimentosIds.length;
    const chaveAlim = this.macroKey[macroAlvoNome];

    const PORCAO_MAX = {
      ovo_inteiro:200, frango:300, patinho:250, tilapia:250, whey:60, iogurte:300, tofu:300, pts:80,
      arroz:300, batata_doce:300, macarrao:200, aveia:80, pao_integral:100, banana:150, doce_leite: 40,
      lentilha: 250, grao_de_bico: 250,
      brocolis:200, salada_verde:150, legumes_mix:200, azeite:20, pasta_amend:40
    };

    alimentosIds.forEach(id => {
      const al = Alimentos[id];
      if (!al) return;
      
      const macroPor100 = al[chaveAlim] || 0.01; 
      let gramasAlim = (cota / macroPor100) * 100;
      
      if (PORCAO_MAX[id]) {
        gramasAlim = Math.min(gramasAlim, PORCAO_MAX[id]);
      }

      let gramasFinal;
      let qtdLabel;

      if (al.un === "un" && al.peso_un) {
        const unidades = Math.max(1, Math.round(gramasAlim / al.peso_un));
        gramasFinal = unidades * al.peso_un;
        qtdLabel = `${unidades} ${al.un} (~${gramasFinal}g)`;
      } else {
        gramasFinal = Math.max(5, Math.round(gramasAlim / 5) * 5);
        qtdLabel = `${gramasFinal} g`;
      }

      const fator = gramasFinal / 100;
      
      result.push({
        id, 
        nome: al.nome, 
        emoji: al.emoji, 
        qtdLabel, 
        gramas: gramasFinal,
        contribuicao: {
          proteina:    +(al.prot  * fator).toFixed(1),
          carboidrato: +(al.carb  * fator).toFixed(1),
          gordura:     +(al.gord  * fator).toFixed(1),
          fibra:       +(al.fibra * fator).toFixed(1),
          kcal:        Math.round((al.prot*4 + al.carb*4 + al.gord*9) * fator)
        }
      });
    });
    return result;
  },

  montar(template, cotaMacros) {
    const alimentosFinal = [];
    
    template.slots.forEach(slot => {
      const macroNome = this.macroPrincipal[slot.tipo];
      const cotaMacro = cotaMacros[macroNome] || 0;
      const itens = this.distribuirSlot(slot.alimentos, cotaMacro, macroNome);
      
      itens.forEach(it => alimentosFinal.push(it));
    });

    const totais = alimentosFinal.reduce((acc, it) => ({
      proteina: acc.proteina + it.contribuicao.proteina, 
      carboidrato: acc.carboidrato + it.contribuicao.carboidrato,
      gordura: acc.gordura + it.contribuicao.gordura, 
      fibra: acc.fibra + it.contribuicao.fibra, 
      kcal: acc.kcal + it.contribuicao.kcal
    }), { proteina:0, carboidrato:0, gordura:0, fibra:0, kcal:0 });

    return {
      nome: template.nome, 
      hora: template.hora, 
      icon: template.icon, 
      alimentos: alimentosFinal,
      totais: {
        proteina: Math.round(totais.proteina), 
        carboidrato: Math.round(totais.carboidrato),
        gordura: Math.round(totais.gordura), 
        fibra: Math.round(totais.fibra), 
        kcal: Math.round(totais.kcal)
      }
    };
  },

  montarDia(plano) {
    const n = plano.refeicoes.quantidade;
    const isVeg = plano.tipoDieta === 'vegetariana';
    const templatesList = isVeg ? TemplatesRefeicaoVeg : TemplatesRefeicao;
    const templates = templatesList[n] || templatesList[4];
    
    const cota = { 
      proteina: plano.macrosDiarios.proteina / n, 
      carboidrato: plano.macrosDiarios.carboidrato / n, 
      gordura: plano.macrosDiarios.gordura / n, 
      fibra: plano.macrosDiarios.fibras / n 
    };
    
    return templates.map(t => this.montar(t, cota));
  }
};

/* ============================================================
   ENGINE 2 — COMPRAS SEMANAIS
   ============================================================ */
const ComprasEngine = {
  CONVERSAO: { 
    proteina_animal: 4.5, 
    carboidrato_limpo: 3.5, 
    fibra_fonte: 10 
  },
  
  gerarListaSemanal(macrosDiarios, tipoDieta) {
    const protSemana = macrosDiarios.proteina * 7;
    const carboSemana = macrosDiarios.carboidrato * 7;
    const fibraSemana = macrosDiarios.fibras * 7;
    
    const protComida = protSemana * 0.7;
    const protSuplemento = protSemana * 0.3;

    const strCarnes = tipoDieta === 'vegetariana' 
      ? Math.round((protComida * this.CONVERSAO.proteina_animal) / 1000) + " kg (Tofu / PTS / Ovos)"
      : Math.round((protComida * this.CONVERSAO.proteina_animal) / 1000) + " kg (Frango/Patinho/Ovos)";

    const strCarbos = tipoDieta === 'vegetariana'
      ? Math.round((carboSemana * this.CONVERSAO.carboidrato_limpo) / 1000) + " kg (Lentilha/Grão-de-Bico/Batata)"
      : Math.round((carboSemana * this.CONVERSAO.carboidrato_limpo) / 1000) + " kg (Arroz/Batata/Pão)";

    return {
      carnes_aves: strCarnes,
      carboidratos: strCarbos,
      vegetais_aveia: Math.round((fibraSemana * this.CONVERSAO.fibra_fonte) / 1000) + " kg (Mix Vegetais/Frutas)",
      suplementos: [
        "Whey Protein: " + Math.round(protSuplemento / 0.8) + " g na semana", 
        "Pré-Treino: Banana e Doce de Leite garantidos"
      ],
      outros: "Azeite extra-virgem"
    };
  }
};

/* ============================================================
   ENGINE 3 — BIBLIOTECA DE EXERCÍCIOS
   ============================================================ */
const BibliotecaExercicios = [
  { 
    id: "leg_press", 
    nome: "Leg Press 45°", 
    modalidade: "Musculação", 
    video_url: "https://www.youtube.com/embed/IZxyjW7MPJQ", 
    dicas: "Pés na largura do quadril. Descer sem tirar a lombar do banco.", 
    alerta_critico: "Não trave os joelhos no topo." 
  },
  { 
    id: "extensora", 
    nome: "Cadeira Extensora", 
    modalidade: "Musculação", 
    video_url: "https://www.youtube.com/embed/IZxyjW7MPJQ", 
    dicas: "Segure 2s no pico de contração.", 
    alerta_critico: "Mantenha o quadril colado no banco." 
  },
  { 
    id: "hammer_chest", 
    nome: "Supino Articulado (Hammer)", 
    modalidade: "Musculação", 
    video_url: "https://www.youtube.com/embed/rT7DgCr-3pg", 
    dicas: "Ajuste o banco para a pegada ficar na linha média do peito.", 
    alerta_critico: "Cotovelos levemente para dentro, nunca em 90 graus." 
  },
  { 
    id: "high_row", 
    nome: "Puxada Alta (Articulada)", 
    modalidade: "Musculação", 
    video_url: "https://www.youtube.com/embed/9efgcAjQe7E", 
    dicas: "Puxe com os cotovelos em direção à cintura.", 
    alerta_critico: "Não jogue o tronco para trás para roubar." 
  },
  { 
    id: "thruster", 
    nome: "Thruster", 
    modalidade: "CrossFit", 
    video_url: "https://www.youtube.com/embed/L219ltL15zk", 
    dicas: "Fluidez entre a perna e o braço.", 
    alerta_critico: "Cotovelos altos no clean." 
  },
  { 
    id: "burpee", 
    nome: "Burpee", 
    modalidade: "CrossFit / Hyrox", 
    video_url: "https://www.youtube.com/embed/auBLPXO8Fww", 
    dicas: "Ritmo constante, respire no topo.", 
    alerta_critico: "Controle a descida." 
  },
  { 
    id: "sled_push", 
    nome: "Sled Push", 
    modalidade: "Hyrox", 
    video_url: "https://www.youtube.com/embed/7X8mG-J9XDM", 
    dicas: "Passadas curtas e explosivas.", 
    alerta_critico: "Mantenha a coluna neutra." 
  },
  { 
    id: "row_erg", 
    nome: "Remo", 
    modalidade: "Hyrox / CrossFit", 
    video_url: "https://www.youtube.com/embed/H0r_ZPXJLtg", 
    dicas: "Perna, quadril, braço.", 
    alerta_critico: "Não puxe com o braço primeiro." 
  }
];

/* ============================================================
   ENGINE 4 — PERIODIZAÇÃO
   ============================================================ */
const TreinoEngine = {
  gerarSemana(rpeSabado) {
    return {
      domingo: { tipo: "RECOVERY", foco: "Descanso Total" },
      segunda: { tipo: "Gaviões 03:45", foco: "Peito e Costas (Máquinas)" },
      terca:   { tipo: "Gaviões 03:45", foco: "Pernas (Foco Quadríceps)" },
      quarta:  { tipo: "HÍBRIDO (Two-a-days)", foco: "Ombros (Manhã) + Cross Metabólico (Noite)" },
      quinta:  { tipo: "Gaviões 03:45", foco: "Braços (Bíceps/Tríceps)" },
      sexta:   { tipo: "CrossFit", foco: "WOD Geral" },
      sabado:  { tipo: "COMPETIÇÃO", foco: "Treino Hyrox Ancorado" }
    };
  },

  treinosDetalhados: {
    'Descanso Total': [],
    'Peito e Costas (Máquinas)': [
      { exId: "hammer_chest", prescricao: "4×10-12", descanso: "60s", obs: "Falha concêntrica" }, 
      { exId: "high_row", prescricao: "4×10-12", descanso: "60s", obs: "Segure 1s contraído" }
    ],
    'Pernas (Foco Quadríceps)': [
      { exId: "leg_press", prescricao: "4×12", descanso: "90s", obs: "Carga Alta" }, 
      { exId: "extensora", prescricao: "4×15", descanso: "60s", obs: "Queimação total" }
    ],
    'Ombros (Manhã) + Cross Metabólico (Noite)': [
      { exId: "row_erg", prescricao: "WOD Noturno", descanso: "—", obs: "Suor e cardio" }
    ],
    'Braços (Bíceps/Tríceps)': [
      { exId: "hammer_chest", prescricao: "3x15", descanso: "45s", obs: "Tríceps Máquina" }
    ],
    'WOD Geral': [
      { exId: "thruster", prescricao: "WOD do Box", descanso: "—", obs: "Sem cargas máximas hoje" }
    ],
    'Treino Hyrox Ancorado': [
      { exId: "sled_push", prescricao: "Pista Total", descanso: "—", obs: "Estação Hyrox" }, 
      { exId: "burpee", prescricao: "80m", descanso: "—", obs: "Broad Jumps" }
    ]
  },

  obterTreinoDoDia(foco) { 
    return this.treinosDetalhados[foco] || []; 
  }
};

/* ============================================================
   ENGINE 5 — CALENDÁRIO (Exportação ICS)
   ============================================================ */
const CalendarEngine = {
  init() {
    const tabTreino = document.getElementById('tab-treino');
    if (!tabTreino || document.getElementById('btnExportarCal')) return;

    const btnHtml = `
      <div style="margin-top: 30px;">
        <button id="btnExportarCal" class="btn-primary" style="background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%); border:none;">
          <span class="btn-arrow" style="transform:none; margin-right: 8px;">📅</span>
          <span>EXPORTAR ROTINA PARA AGENDA</span>
        </button>
        <p style="text-align:center; font-size:11px; color:#666; margin-top:8px;">Baixa um arquivo .ics para o seu celular.</p>
      </div>
    `;
    
    tabTreino.insertAdjacentHTML('beforeend', btnHtml);
    document.getElementById('btnExportarCal').addEventListener('click', this.gerarIcs.bind(this));
  },

  gerarIcs() {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DevFit Coach//Guerra Express//PT
CALSCALE:GREGORIAN

BEGIN:VEVENT
SUMMARY:Treino Gaviões (Hipertrofia)
DTSTART;TZID=America/Sao_Paulo:20260601T034500
DTEND;TZID=America/Sao_Paulo:20260601T043000
RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR
DESCRIPTION:Foco nas máquinas articuladas. Bater ponto 03:45.
END:VEVENT

BEGIN:VEVENT
SUMMARY:Sono Anabólico (Fretado)
DTSTART;TZID=America/Sao_Paulo:20260601T050500
DTEND;TZID=America/Sao_Paulo:20260601T062500
RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR
DESCRIPTION:Máscara de dormir e protetor auricular. Recuperação do treino.
END:VEVENT

BEGIN:VEVENT
SUMMARY:Deep Work: Estudos e Pós-graduação
DTSTART;TZID=America/Sao_Paulo:20260601T070000
DTEND;TZID=America/Sao_Paulo:20260601T083000
RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR
DESCRIPTION:Foco total. Celular no modo avião.
END:VEVENT

BEGIN:VEVENT
SUMMARY:Sono Regenerativo (Fretado Volta)
DTSTART;TZID=America/Sao_Paulo:20260601T173000
DTEND;TZID=America/Sao_Paulo:20260601T190000
RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR
DESCRIPTION:Isolamento do estresse do escritório. Preparação para chegar bem em casa.
END:VEVENT

BEGIN:VEVENT
SUMMARY:Janela Familiar (Desconexão)
DTSTART;TZID=America/Sao_Paulo:20260601T190000
DTEND;TZID=America/Sao_Paulo:20260601T220000
RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR
DESCRIPTION:Tempo de qualidade em casa. Jantar e foco na família.
END:VEVENT

END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', 'Guerra_Master_Schedule.ics');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/* ============================================================
   ENGINE 6 — STORAGE & UI
   ============================================================ */
const StorageEngine = {
  CHAVE_TREINOS: 'guerra_fit_treinos', 
  CHAVE_PERFIL: 'guerra_fit_perfil', 
  CHAVE_PLANO: 'guerra_fit_plano',

  salvarTreinoConcluido(dataISO, exercicioId, cargaKg, reps) {
    let h = JSON.parse(localStorage.getItem(this.CHAVE_TREINOS)) || [];
    h.push({ data: dataISO, exercicioId, cargaMaxima: cargaKg, repeticoes: reps });
    localStorage.setItem(this.CHAVE_TREINOS, JSON.stringify(h));
  },
  
  obterHistoricoCompleto() { 
    return JSON.parse(localStorage.getItem(this.CHAVE_TREINOS)) || []; 
  },
  
  salvarPerfil(p) { 
    localStorage.setItem(this.CHAVE_PERFIL, JSON.stringify(p)); 
  },
  
  obterPerfil() { 
    return JSON.parse(localStorage.getItem(this.CHAVE_PERFIL)) || null; 
  },
  
  salvarPlano(p) { 
    localStorage.setItem(this.CHAVE_PLANO, JSON.stringify(p)); 
  },
  
  obterPlano() { 
    return JSON.parse(localStorage.getItem(this.CHAVE_PLANO)) || null; 
  }
};

const UI = {
  $:  (s, c = document) => c.querySelector(s),
  $$: (s, c = document) => Array.from(c.querySelectorAll(s)),
  mapaExercicios: Object.fromEntries(BibliotecaExercicios.map(e => [e.id, e])),

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
    
    // Inicia a Engine de Calendário
    CalendarEngine.init();
  },

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

  bindFormPerfil() {
    this.$('#formPerfil').addEventListener('submit', e => {
      e.preventDefault();
      
      const objTipoDieta = this.$('#tipoDieta') ? this.$('#tipoDieta').value : 'padrao';
      
      const perfil = {
        peso: parseFloat(this.$('#peso').value), 
        altura: parseFloat(this.$('#altura').value),
        idade: parseInt(this.$('#idade').value, 10), 
        numRefeicoes: parseInt(this.$('#numRefeicoes').value, 10),
        nivelAtividade: this.$('#nivelAtividade').value, 
        objetivo: this.$('#objetivo').value,
        tipoDieta: objTipoDieta
      };
      
      if (!perfil.peso || !perfil.altura) return;
      
      const plano = NutricaoEngine.calcularPlanoDiario(
        perfil.peso, 
        perfil.altura, 
        perfil.nivelAtividade, 
        perfil.objetivo, 
        perfil.numRefeicoes, 
        perfil.idade, 
        perfil.tipoDieta
      );
      
      StorageEngine.salvarPerfil(perfil); 
      StorageEngine.salvarPlano(plano);
      
      this.renderPlano(plano); 
      this.renderCompras(plano.macrosDiarios, plano.tipoDieta); 
      this.atualizarBrandTag(perfil);
    });
  },

  renderPlano(plano) {
    this.$('#planoResultado').classList.remove('hidden');
    this.$('#mTmb').textContent  = plano.metricas.tmb.toLocaleString('pt-BR');
    this.$('#mGetd').textContent = plano.metricas.getd.toLocaleString('pt-BR');
    this.$('#mAlvo').textContent = plano.metricas.caloriasAlvo.toLocaleString('pt-BR');
    this.$('#dProt').textContent = plano.macrosDiarios.proteina;
    this.$('#dCarb').textContent = plano.macrosDiarios.carboidrato;
    this.$('#dGord').textContent = plano.macrosDiarios.gordura;
    this.$('#dFib').textContent  = plano.macrosDiarios.fibras;
    this.$('#qtdRefLabel').textContent = `· ${plano.refeicoes.quantidade} REFEIÇÕES`;

    const refeicoes = MontadorRefeicao.montarDia(plano);
    const grid = this.$('#refeicoesGrid');
    grid.innerHTML = '';

    refeicoes.forEach((ref, idx) => {
      const card = document.createElement('div');
      card.className = 'ref-card';
      card.style.animationDelay = `${idx * 70}ms`;

      const alimentosHtml = ref.alimentos.map(a => `
        <li class="ref-alimento">
          <span class="ref-alimento-emoji">${a.emoji}</span>
          <span class="ref-alimento-nome">${a.nome}</span>
          <span class="ref-alimento-qtd">${a.qtdLabel}</span>
        </li>
      `).join('');

      card.innerHTML = `
        <div class="ref-head">
          <div class="ref-head-left">
            <div class="ref-titulo">
              <span class="ref-icon">${ref.icon}</span>
              <span class="ref-nome">${ref.nome}</span>
              <span class="ref-hora">${ref.hora}</span>
            </div>
            <div class="ref-kcal"><strong>${ref.totais.kcal}</strong> kcal</div>
          </div>
        </div>
        <ul class="ref-alimentos">${alimentosHtml}</ul>
        <div class="ref-macros">
          <div class="ref-macro m-p">
            <span class="ref-macro-lbl">PROT</span>
            <span class="ref-macro-val">${ref.totais.proteina}g</span>
          </div>
          <div class="ref-macro m-c">
            <span class="ref-macro-lbl">CARB</span>
            <span class="ref-macro-val">${ref.totais.carboidrato}g</span>
          </div>
          <div class="ref-macro m-g">
            <span class="ref-macro-lbl">GORD</span>
            <span class="ref-macro-val">${ref.totais.gordura}g</span>
          </div>
          <div class="ref-macro m-f">
            <span class="ref-macro-lbl">FIBRA</span>
            <span class="ref-macro-val">${ref.totais.fibra}g</span>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  },

  atualizarBrandTag(perfil) {
    const objLabel = { 
      perda_gordura: 'CUTTING', 
      ganho_massa: 'BULKING', 
      manutencao: 'MANUTENÇÃO' 
    }[perfil.objetivo] || '';
    
    const tagVeg = perfil.tipoDieta === 'vegetariana' ? ' · VEG' : '';
    this.$('#brandTag').textContent = `${perfil.peso}kg · ${objLabel}${tagVeg}`;
  },

  renderCompras(macrosDiarios, tipoDieta) {
    const lista = ComprasEngine.gerarListaSemanal(macrosDiarios, tipoDieta);
    
    this.$('#comprasVazio').classList.add('hidden');
    this.$('#comprasResultado').classList.remove('hidden');
    
    this.$('#cCarnes').textContent  = lista.carnes_aves;
    this.$('#cCarbo').textContent   = lista.carboidratos;
    this.$('#cVeg').textContent     = lista.vegetais_aveia;
    this.$('#cExtras').textContent  = lista.outros;
    
    this.$('#cSupCard').innerHTML = lista.suplementos.map(s => {
      const [nome, valor] = s.split(':');
      return `
        <div class="list-row">
          <span class="list-icon">💊</span>
          <div>
            <span class="list-label">${nome.trim()}</span>
            <span class="list-value">${(valor || '').trim()}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  bindFormRpe() {
    const range = this.$('#rpeRange'); 
    const valor = this.$('#rpeValor');
    
    range.addEventListener('input', () => {
      valor.textContent = range.value;
    });
    
    this.$('#formRpe').addEventListener('submit', e => {
      e.preventDefault();
      this.renderSemana(TreinoEngine.gerarSemana(parseInt(range.value, 10)));
    });
  },

  renderSemana(semana) {
    const wrap = this.$('#semanaResultado');
    wrap.classList.remove('hidden'); 
    wrap.innerHTML = '';
    
    const ordem = ['domingo','segunda','terca','quarta','quinta','sexta','sabado'];
    const labels = { domingo:'DOM', segunda:'SEG', terca:'TER', quarta:'QUA', quinta:'QUI', sexta:'SEX', sabado:'SÁB' };
    const hojeIdx = new Date().getDay();

    ordem.forEach((dia, i) => {
      const planoDia = semana[dia]; 
      const ehHoje = i === hojeIdx;
      const exercicios = TreinoEngine.obterTreinoDoDia(planoDia.foco);
      
      const card = document.createElement('div');
      card.className = 'dia-card' + (ehHoje ? ' dia-hoje' : '');
      card.style.animationDelay = `${i * 60}ms`;

      const exercHtml = exercicios.length ? `
        <ul class="dia-exercicios">
          ${exercicios.map(ex => {
            const meta = this.mapaExercicios[ex.exId]; 
            const nome = meta ? meta.nome : ex.exId;
            return `
              <li class="dia-ex" data-ex-id="${ex.exId}">
                <div class="dia-ex-info">
                  <span class="dia-ex-nome">${nome}</span>
                  ${ex.obs ? `<span class="dia-ex-obs">${ex.obs}</span>` : ''}
                </div>
                <div class="dia-ex-prescricao">
                  ${ex.prescricao}
                  ${ex.descanso && ex.descanso !== '—' ? `<small>desc. ${ex.descanso}</small>` : ''}
                </div>
              </li>
            `;
          }).join('')}
        </ul>
      ` : `<div class="dia-vazio">Sem prescrição detalhada para este dia.</div>`;

      card.innerHTML = `
        <div class="dia-header">
          <span class="dia-tag">${labels[dia]}</span>
          <span class="dia-tipo">
            ${planoDia.tipo} 
            <small style="display:block;font-size:11px;color:var(--txt-3);letter-spacing:0.5px;margin-top:2px;font-family:var(--font-body);">
              ${planoDia.foco}
            </small>
          </span>
          <span class="dia-badge ${ehHoje ? 'hoje-tag' : ''}">${ehHoje ? 'HOJE' : ''}</span>
        </div>
        ${exercHtml}
      `;
      
      card.querySelectorAll('.dia-ex').forEach(li => { 
        li.addEventListener('click', () => { 
          const ex = this.mapaExercicios[li.dataset.exId]; 
          if (ex) this.abrirModal(ex); 
        }); 
      });
      
      wrap.appendChild(card);
    });
  },

  renderExercicios(filtroModalidade = 'TODOS', textoBusca = '') {
    const grid = this.$('#exGrid'); 
    grid.innerHTML = ''; 
    const termo = textoBusca.toLowerCase().trim();
    
    const lista = BibliotecaExercicios.filter(ex => { 
      return (filtroModalidade === 'TODOS' || ex.modalidade.toUpperCase().includes(filtroModalidade)) 
             && (!termo || ex.nome.toLowerCase().includes(termo)); 
    });
    
    if (!lista.length) { 
      grid.innerHTML = `
        <div class="empty-state small" style="grid-column:1/-1">
          <p>Nenhum movimento encontrado.</p>
        </div>
      `; 
    } else { 
      lista.forEach((ex, i) => { 
        const card = document.createElement('div'); 
        card.className = 'ex-card'; 
        card.style.animationDelay = `${i * 30}ms`; 
        
        card.innerHTML = `
          <span class="badge">${ex.modalidade}</span>
          <h4>${ex.nome}</h4>
        `; 
        
        card.addEventListener('click', () => this.abrirModal(ex)); 
        grid.appendChild(card); 
      }); 
    }
    
    this.renderChips(filtroModalidade);
  },

  renderChips(ativa) {
    const modalidades = ['TODOS', ...new Set(BibliotecaExercicios.flatMap(e => e.modalidade.split('/').map(m => m.trim().toUpperCase())))];
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

  bindModal() { 
    this.$$('[data-close]').forEach(el => el.addEventListener('click', () => this.fecharModal())); 
    
    document.addEventListener('keydown', e => { 
      if (e.key === 'Escape') this.fecharModal(); 
    }); 
  },

  abrirModal(ex) { 
    this.$('#modalNome').textContent = ex.nome; 
    this.$('#modalMod').textContent = ex.modalidade; 
    this.$('#modalDicas').textContent = ex.dicas; 
    this.$('#modalAlerta').textContent= ex.alerta_critico; 
    this.$('#modalVideo').src = ex.video_url; 
    this.$('#exModal').classList.add('open'); 
    document.body.style.overflow = 'hidden'; 
  },

  fecharModal() { 
    this.$('#exModal').classList.remove('open'); 
    this.$('#modalVideo').src = ''; 
    document.body.style.overflow = ''; 
  },

  renderSelectCargas() { 
    this.$('#cargaEx').innerHTML = BibliotecaExercicios.map(ex => `<option value="${ex.id}">${ex.nome}</option>`).join(''); 
  },
  
  bindFormCarga() {
    this.$('#formCarga').addEventListener('submit', e => {
      e.preventDefault(); 
      const exId = this.$('#cargaEx').value; 
      const kg = parseFloat(this.$('#cargaKg').value); 
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
      lista.innerHTML = `
        <div class="empty-state small">
          <p>Nenhum registro ainda.</p>
        </div>
      `; 
      return; 
    }
    
    lista.innerHTML = historico.map(h => {
      const data = new Date(h.data);
      const dataFmt = data.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' }) + ' · ' + data.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
      const nome = this.mapaExercicios[h.exercicioId]?.nome || h.exercicioId;
      
      return `
        <div class="hist-item">
          <div class="hist-info">
            <span class="hist-nome">${nome}</span>
            <span class="hist-data">${dataFmt} · ${h.repeticoes} reps</span>
          </div>
          <span class="hist-carga">${h.cargaMaxima}<small>kg</small></span>
        </div>
      `;
    }).join('');
  },

  restaurarSessao() {
    const perfil = StorageEngine.obterPerfil(); 
    const plano = StorageEngine.obterPlano();
    
    if (perfil) {
      this.$('#peso').value = perfil.peso ?? ''; 
      this.$('#altura').value = perfil.altura ?? ''; 
      this.$('#idade').value = perfil.idade ?? 42;
      this.$('#numRefeicoes').value = perfil.numRefeicoes ?? 4; 
      this.$('#nivelAtividade').value = perfil.nivelAtividade ?? 'intenso';
      this.$('#objetivo').value = perfil.objetivo ?? 'manutencao'; 
      
      if (this.$('#tipoDieta') && perfil.tipoDieta) {
        this.$('#tipoDieta').value = perfil.tipoDieta;
      }
      
      this.atualizarBrandTag(perfil);
    }
    
    if (plano) { 
      this.renderPlano(plano); 
      this.renderCompras(plano.macrosDiarios, plano.tipoDieta); 
    }
  }
};

document.addEventListener('DOMContentLoaded', () => UI.init());
