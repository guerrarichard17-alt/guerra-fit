/* =================================================================
   GUERRA FIT — app.js (v2)
   Engines: Nutrição, Compras, Biblioteca, Treino, Storage
   + Montador de Refeições reais (alimentos com gramatura)
   + Montador de Treino do Dia (exercícios com séries × reps)
   ================================================================= */

/* ============================================================
   ENGINE 1 — NUTRIÇÃO
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
   BASE DE ALIMENTOS (valores por 100g de alimento cru/pronto)
   ============================================================ */
const Alimentos = {
  ovo_inteiro:   { nome: "Ovo inteiro",            emoji: "🥚", prot: 13, carb: 1,  gord: 11, fibra: 0,  un: "un", peso_un: 50 },
  clara:         { nome: "Clara de ovo",           emoji: "🥚", prot: 11, carb: 1,  gord: 0,  fibra: 0,  un: "un", peso_un: 35 },
  frango:        { nome: "Peito de frango (cru)",  emoji: "🍗", prot: 22, carb: 0,  gord: 2,  fibra: 0  },
  patinho:       { nome: "Patinho moído (cru)",    emoji: "🥩", prot: 21, carb: 0,  gord: 6,  fibra: 0  },
  tilapia:       { nome: "Filé de tilápia",        emoji: "🐟", prot: 20, carb: 0,  gord: 2,  fibra: 0  },
  whey:          { nome: "Whey Protein",           emoji: "💪", prot: 80, carb: 8,  gord: 5,  fibra: 0  },
  iogurte:       { nome: "Iogurte natural desn.",  emoji: "🥛", prot: 10, carb: 4,  gord: 0,  fibra: 0  },

  arroz:         { nome: "Arroz cozido",           emoji: "🍚", prot: 3,  carb: 28, gord: 0,  fibra: 0  },
  batata_doce:   { nome: "Batata-doce cozida",     emoji: "🍠", prot: 2,  carb: 20, gord: 0,  fibra: 3  },
  macarrao:      { nome: "Macarrão cozido",        emoji: "🍝", prot: 5,  carb: 25, gord: 1,  fibra: 1  },
  aveia:         { nome: "Aveia em flocos",        emoji: "🌾", prot: 14, carb: 67, gord: 8,  fibra: 9  },
  pao_integral:  { nome: "Pão integral",           emoji: "🍞", prot: 9,  carb: 43, gord: 4,  fibra: 6  },
  banana:        { nome: "Banana",                 emoji: "🍌", prot: 1,  carb: 23, gord: 0,  fibra: 3  },
  fruta_geral:   { nome: "Fruta da época (maçã/morango)", emoji: "🍎", prot: 0, carb: 12, gord: 0, fibra: 2 },
  tapioca:       { nome: "Tapioca (goma)",         emoji: "🥞", prot: 0,  carb: 88, gord: 0,  fibra: 1  },

  brocolis:      { nome: "Brócolis cozido",        emoji: "🥦", prot: 3,  carb: 7,  gord: 0,  fibra: 3  },
  salada_verde:  { nome: "Salada verde (mix)",     emoji: "🥗", prot: 1,  carb: 3,  gord: 0,  fibra: 2  },
  legumes_mix:   { nome: "Legumes (cenoura/abobr.)",emoji: "🥕", prot: 1, carb: 8,  gord: 0,  fibra: 3  },

  azeite:        { nome: "Azeite extra-virgem",    emoji: "🫒", prot: 0,  carb: 0,  gord: 100, fibra: 0  },
  abacate:       { nome: "Abacate",                emoji: "🥑", prot: 2,  carb: 9,  gord: 15, fibra: 7  },
  castanhas:     { nome: "Mix de castanhas",       emoji: "🌰", prot: 15, carb: 16, gord: 54, fibra: 8  },
  pasta_amend:   { nome: "Pasta de amendoim",      emoji: "🥜", prot: 25, carb: 20, gord: 50, fibra: 6  }
};

/* ============================================================
   TEMPLATES DE REFEIÇÃO (estrutura: o que vai em cada uma)
   gera por nº de refeições/dia (3 a 6)
   ============================================================ */
const TemplatesRefeicao = {
  3: [
    { nome: "Café da Manhã", hora: "07:00", icon: "☀️",
      slots: [
        { tipo: "prot", alimentos: ["ovo_inteiro", "clara", "whey"] },
        { tipo: "carb", alimentos: ["aveia", "banana", "pao_integral"] },
        { tipo: "gord", alimentos: ["pasta_amend"] },
        { tipo: "fibra",alimentos: ["fruta_geral"] }
      ]
    },
    { nome: "Almoço", hora: "13:00", icon: "🍽",
      slots: [
        { tipo: "prot", alimentos: ["frango", "patinho"] },
        { tipo: "carb", alimentos: ["arroz", "batata_doce"] },
        { tipo: "gord", alimentos: ["azeite"] },
        { tipo: "fibra",alimentos: ["brocolis", "salada_verde"] }
      ]
    },
    { nome: "Jantar", hora: "20:00", icon: "🌙",
      slots: [
        { tipo: "prot", alimentos: ["tilapia", "frango"] },
        { tipo: "carb", alimentos: ["batata_doce"] },
        { tipo: "gord", alimentos: ["abacate"] },
        { tipo: "fibra",alimentos: ["legumes_mix", "salada_verde"] }
      ]
    }
  ],
  4: [
    { nome: "Café da Manhã", hora: "07:00", icon: "☀️",
      slots: [
        { tipo: "prot", alimentos: ["ovo_inteiro", "clara"] },
        { tipo: "carb", alimentos: ["aveia", "banana"] },
        { tipo: "gord", alimentos: ["pasta_amend"] },
        { tipo: "fibra",alimentos: ["fruta_geral"] }
      ]
    },
    { nome: "Almoço", hora: "12:30", icon: "🍽",
      slots: [
        { tipo: "prot", alimentos: ["frango", "patinho"] },
        { tipo: "carb", alimentos: ["arroz", "batata_doce"] },
        { tipo: "gord", alimentos: ["azeite"] },
        { tipo: "fibra",alimentos: ["brocolis", "salada_verde"] }
      ]
    },
    { nome: "Pré-Treino", hora: "16:30", icon: "⚡",
      slots: [
        { tipo: "prot", alimentos: ["whey", "iogurte"] },
        { tipo: "carb", alimentos: ["banana", "tapioca"] },
        { tipo: "gord", alimentos: ["pasta_amend"] },
        { tipo: "fibra",alimentos: ["fruta_geral"] }
      ]
    },
    { nome: "Jantar", hora: "20:30", icon: "🌙",
      slots: [
        { tipo: "prot", alimentos: ["tilapia", "frango"] },
        { tipo: "carb", alimentos: ["batata_doce", "macarrao"] },
        { tipo: "gord", alimentos: ["abacate"] },
        { tipo: "fibra",alimentos: ["legumes_mix", "salada_verde"] }
      ]
    }
  ],
  5: [
    { nome: "Café da Manhã", hora: "07:00", icon: "☀️",
      slots: [
        { tipo: "prot", alimentos: ["ovo_inteiro", "clara"] },
        { tipo: "carb", alimentos: ["aveia"] },
        { tipo: "gord", alimentos: ["pasta_amend"] },
        { tipo: "fibra",alimentos: ["banana"] }
      ]
    },
    { nome: "Lanche da Manhã", hora: "10:00", icon: "🥪",
      slots: [
        { tipo: "prot", alimentos: ["whey", "iogurte"] },
        { tipo: "carb", alimentos: ["fruta_geral"] },
        { tipo: "gord", alimentos: ["castanhas"] },
        { tipo: "fibra",alimentos: ["fruta_geral"] }
      ]
    },
    { nome: "Almoço", hora: "13:00", icon: "🍽",
      slots: [
        { tipo: "prot", alimentos: ["frango", "patinho"] },
        { tipo: "carb", alimentos: ["arroz"] },
        { tipo: "gord", alimentos: ["azeite"] },
        { tipo: "fibra",alimentos: ["brocolis", "salada_verde"] }
      ]
    },
    { nome: "Pré-Treino", hora: "16:30", icon: "⚡",
      slots: [
        { tipo: "prot", alimentos: ["whey"] },
        { tipo: "carb", alimentos: ["banana", "tapioca"] },
        { tipo: "gord", alimentos: [] },
        { tipo: "fibra",alimentos: ["fruta_geral"] }
      ]
    },
    { nome: "Jantar", hora: "20:30", icon: "🌙",
      slots: [
        { tipo: "prot", alimentos: ["tilapia", "frango"] },
        { tipo: "carb", alimentos: ["batata_doce"] },
        { tipo: "gord", alimentos: ["abacate"] },
        { tipo: "fibra",alimentos: ["legumes_mix", "salada_verde"] }
      ]
    }
  ],
  6: [
    { nome: "Café da Manhã", hora: "06:30", icon: "☀️",
      slots: [
        { tipo: "prot", alimentos: ["ovo_inteiro", "clara"] },
        { tipo: "carb", alimentos: ["aveia"] },
        { tipo: "gord", alimentos: ["pasta_amend"] },
        { tipo: "fibra",alimentos: ["banana"] }
      ]
    },
    { nome: "Lanche da Manhã", hora: "09:30", icon: "🥪",
      slots: [
        { tipo: "prot", alimentos: ["iogurte"] },
        { tipo: "carb", alimentos: ["fruta_geral"] },
        { tipo: "gord", alimentos: ["castanhas"] },
        { tipo: "fibra",alimentos: ["fruta_geral"] }
      ]
    },
    { nome: "Almoço", hora: "12:30", icon: "🍽",
      slots: [
        { tipo: "prot", alimentos: ["frango"] },
        { tipo: "carb", alimentos: ["arroz"] },
        { tipo: "gord", alimentos: ["azeite"] },
        { tipo: "fibra",alimentos: ["brocolis", "salada_verde"] }
      ]
    },
    { nome: "Pré-Treino", hora: "16:00", icon: "⚡",
      slots: [
        { tipo: "prot", alimentos: ["whey"] },
        { tipo: "carb", alimentos: ["banana", "tapioca"] },
        { tipo: "gord", alimentos: [] },
        { tipo: "fibra",alimentos: ["fruta_geral"] }
      ]
    },
    { nome: "Pós-Treino / Jantar", hora: "19:30", icon: "🌙",
      slots: [
        { tipo: "prot", alimentos: ["patinho", "tilapia"] },
        { tipo: "carb", alimentos: ["batata_doce", "macarrao"] },
        { tipo: "gord", alimentos: ["azeite"] },
        { tipo: "fibra",alimentos: ["legumes_mix"] }
      ]
    },
    { nome: "Ceia", hora: "22:30", icon: "🌌",
      slots: [
        { tipo: "prot", alimentos: ["iogurte", "clara"] },
        { tipo: "carb", alimentos: [] },
        { tipo: "gord", alimentos: ["pasta_amend"] },
        { tipo: "fibra",alimentos: ["fruta_geral"] }
      ]
    }
  ]
};

/* ============================================================
   MONTADOR DE REFEIÇÃO REAL
   Distribui macros entre alimentos respeitando tipos
   ============================================================ */
const MontadorRefeicao = {
  // Macro "dominante" de cada alimento — define em qual slot ele entra
  macroPrincipal: {
    prot:  "proteina",
    carb:  "carboidrato",
    gord:  "gordura",
    fibra: "fibra"
  },

  // mapeia tipo do slot -> chave no objeto Alimentos
  macroKey: {
    proteina:    "prot",
    carboidrato: "carb",
    gordura:     "gord",
    fibra:       "fibra"
  },

  /**
   * Para um slot (ex: proteína precisa de 50g),
   * distribui em N alimentos do slot (proporção igual).
   * Retorna lista de { alimento, gramas, contribuicao{prot,carb,gord,fibra,kcal} }
   */
  distribuirSlot(alimentosIds, gramasMacroAlvo, macroAlvoNome) {
    if (!alimentosIds.length || gramasMacroAlvo <= 0) return [];
    const result = [];
    const cota = gramasMacroAlvo / alimentosIds.length;

    // chave curta no objeto Alimentos (prot/carb/gord/fibra)
    const chaveAlim = this.macroKey[macroAlvoNome];

    // Caps de porção realistas (g) — evita números absurdos quando
    // o alimento tem baixa densidade do macro alvo
    const PORCAO_MAX = {
      ovo_inteiro:200, clara:300, frango:300, patinho:250, tilapia:250,
      whey:60, iogurte:300,
      arroz:250, batata_doce:300, macarrao:200, aveia:80,
      pao_integral:80, banana:150, fruta_geral:200, tapioca:60,
      brocolis:200, salada_verde:150, legumes_mix:200,
      azeite:20, abacate:100, castanhas:30, pasta_amend:40
    };

    alimentosIds.forEach(id => {
      const al = Alimentos[id];
      if (!al) return;
      const macroPor100 = al[chaveAlim] || 0.01; // evita /0
      let gramasAlim = (cota / macroPor100) * 100;
      // Aplica o cap para manter porções realistas
      if (PORCAO_MAX[id]) gramasAlim = Math.min(gramasAlim, PORCAO_MAX[id]);

      // arredonda: alimentos unitários -> múltiplos da unidade
      let gramasFinal;
      let qtdLabel;
      if (al.un === "un" && al.peso_un) {
        const unidades = Math.max(1, Math.round(gramasAlim / al.peso_un));
        gramasFinal = unidades * al.peso_un;
        qtdLabel = `${unidades} ${al.un} (~${gramasFinal}g)`;
      } else {
        // arredonda para múltiplo de 5
        gramasFinal = Math.max(5, Math.round(gramasAlim / 5) * 5);
        qtdLabel = `${gramasFinal} g`;
      }

      const fator = gramasFinal / 100;
      result.push({
        id, nome: al.nome, emoji: al.emoji,
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

  /**
   * Monta UMA refeição completa baseada no template + cota de macros.
   */
  montar(template, cotaMacros) {
    const alimentosFinal = [];

    template.slots.forEach(slot => {
      const macroNome = this.macroPrincipal[slot.tipo]; // 'proteina'
      const cotaMacro = cotaMacros[macroNome] || 0;
      const itens = this.distribuirSlot(slot.alimentos, cotaMacro, macroNome);
      itens.forEach(it => alimentosFinal.push(it));
    });

    // Totais reais
    const totais = alimentosFinal.reduce((acc, it) => ({
      proteina:    acc.proteina    + it.contribuicao.proteina,
      carboidrato: acc.carboidrato + it.contribuicao.carboidrato,
      gordura:     acc.gordura     + it.contribuicao.gordura,
      fibra:       acc.fibra       + it.contribuicao.fibra,
      kcal:        acc.kcal        + it.contribuicao.kcal
    }), { proteina:0, carboidrato:0, gordura:0, fibra:0, kcal:0 });

    return {
      nome: template.nome,
      hora: template.hora,
      icon: template.icon,
      alimentos: alimentosFinal,
      totais: {
        proteina:    Math.round(totais.proteina),
        carboidrato: Math.round(totais.carboidrato),
        gordura:     Math.round(totais.gordura),
        fibra:       Math.round(totais.fibra),
        kcal:        Math.round(totais.kcal)
      }
    };
  },

  /**
   * Monta o dia inteiro de refeições.
   */
  montarDia(plano) {
    const n = plano.refeicoes.quantidade;
    const templates = TemplatesRefeicao[n] || TemplatesRefeicao[4];
    const cota = {
      proteina:    plano.macrosDiarios.proteina    / n,
      carboidrato: plano.macrosDiarios.carboidrato / n,
      gordura:     plano.macrosDiarios.gordura     / n,
      fibra:       plano.macrosDiarios.fibras      / n
    };
    return templates.map(t => this.montar(t, cota));
  }
};

/* ============================================================
   ENGINE 2 — COMPRAS SEMANAIS
   ============================================================ */
const ComprasEngine = {
  CONVERSAO: { proteina_animal: 4.5, carboidrato_limpo: 3.5, fibra_fonte: 10 },

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
   ENGINE 3 — BIBLIOTECA DE EXERCÍCIOS (expandida)
   ============================================================ */
const BibliotecaExercicios = [
  // MUSCULAÇÃO - Pernas
  { id: "back_squat", nome: "Agachamento Costas (Back Squat)", modalidade: "Musculação",
    video_url: "https://www.youtube.com/embed/bEv6CCg2BC8",
    dicas: "Calcanhar apoiado, core travado, quebra da paralela.",
    alerta_critico: "Evite o valgo dinâmico (joelhos para dentro) na fase concêntrica." },
  { id: "front_squat", nome: "Agachamento Frontal", modalidade: "Musculação",
    video_url: "https://www.youtube.com/embed/uYumuL_G_V0",
    dicas: "Cotovelos altos, tronco ereto, peso no meio do pé.",
    alerta_critico: "Não deixe os cotovelos caírem — risco de perder a barra para frente." },
  { id: "deadlift", nome: "Levantamento Terra (Deadlift)", modalidade: "Musculação",
    video_url: "https://www.youtube.com/embed/op9kVnSso6Q",
    dicas: "Barra colada ao corpo, escápulas retraídas, quadril e joelho sobem juntos.",
    alerta_critico: "JAMAIS arredonde a lombar. Pare a série se perder a neutralidade." },
  { id: "rdl", nome: "Stiff (RDL)", modalidade: "Musculação",
    video_url: "https://www.youtube.com/embed/7AcS9TnoNQk",
    dicas: "Joelhos levemente flexionados, quadril vai para trás, sentir o posterior.",
    alerta_critico: "Não é agachamento. Se sentir no quadríceps, está fazendo errado." },
  { id: "lunge", nome: "Afundo (Lunge)", modalidade: "Musculação",
    video_url: "https://www.youtube.com/embed/QOVaHwm-Q6U",
    dicas: "Joelho da frente alinhado ao pé, tronco vertical.",
    alerta_critico: "Joelho de trás não toca o chão com impacto." },
  { id: "leg_press", nome: "Leg Press 45°", modalidade: "Musculação",
    video_url: "https://www.youtube.com/embed/IZxyjW7MPJQ",
    dicas: "Pés na largura do quadril, descer controlado até 90°.",
    alerta_critico: "Não trave os joelhos no topo." },

  // MUSCULAÇÃO - Superiores
  { id: "bench_press", nome: "Supino Reto", modalidade: "Musculação",
    video_url: "https://www.youtube.com/embed/rT7DgCr-3pg",
    dicas: "Escápulas retraídas, pés firmes no chão, barra desce no peitoral baixo.",
    alerta_critico: "Sempre use observador em cargas máximas." },
  { id: "ohp", nome: "Desenvolvimento Militar (OHP)", modalidade: "Musculação",
    video_url: "https://www.youtube.com/embed/2yjwXTZQDDI",
    dicas: "Glúteo contraído, core travado, barra passa rente ao queixo.",
    alerta_critico: "Não hiperextenda a lombar para empurrar a carga." },
  { id: "pullup", nome: "Barra Fixa (Pull-up)", modalidade: "Musculação",
    video_url: "https://www.youtube.com/embed/eGo4IYlbE5g",
    dicas: "Pegada um pouco mais aberta que os ombros, peitoral em direção à barra.",
    alerta_critico: "Não use balanço excessivo — controle a fase excêntrica." },
  { id: "row_barbell", nome: "Remada Curvada", modalidade: "Musculação",
    video_url: "https://www.youtube.com/embed/9efgcAjQe7E",
    dicas: "Tronco a 45°, cotovelos próximos ao corpo, puxe até o abdômen.",
    alerta_critico: "Não use o impulso de pernas/lombar para subir a carga." },
  { id: "dip", nome: "Paralelas (Dip)", modalidade: "Musculação",
    video_url: "https://www.youtube.com/embed/2z8JmcrW-As",
    dicas: "Ombros para trás, descer até cotovelo a 90°.",
    alerta_critico: "Não force a articulação do ombro descendo demais." },

  // CROSSFIT
  { id: "wall_balls", nome: "Wall Balls", modalidade: "CrossFit / Hyrox",
    video_url: "https://www.youtube.com/embed/EqjGCJkvxTU",
    dicas: "Aproveite o impulso do agachamento para lançar a bola.",
    alerta_critico: "Não deixe a bola 'esmagar' você na descida; receba absorvendo o impacto." },
  { id: "thruster", nome: "Thruster", modalidade: "CrossFit",
    video_url: "https://www.youtube.com/embed/L219ltL15zk",
    dicas: "Front squat + push press em um movimento fluido.",
    alerta_critico: "Cotovelos altos no clean — barra trava nos ombros, não nos braços." },
  { id: "clean", nome: "Clean (Power Clean)", modalidade: "CrossFit / LPO",
    video_url: "https://www.youtube.com/embed/EKRiW9Yt3Ps",
    dicas: "Triple extension explosiva, puxar embaixo da barra rapidamente.",
    alerta_critico: "Não 'rebola' a barra. Trajetória vertical e próxima ao corpo." },
  { id: "snatch", nome: "Snatch (Arranco)", modalidade: "LPO",
    video_url: "https://www.youtube.com/embed/9xQp2sldyts",
    dicas: "Pegada larga, barra sobe colada ao corpo, recepção no agachamento.",
    alerta_critico: "Movimento técnico — comece com PVC ou barra leve." },
  { id: "kettlebell_swing", nome: "Kettlebell Swing", modalidade: "CrossFit",
    video_url: "https://www.youtube.com/embed/cKx8xE8jJZs",
    dicas: "Movimento de quadril (hip hinge), não agachamento. Glúteos explodem.",
    alerta_critico: "Não use os ombros para levantar — quadril é o motor." },
  { id: "burpee", nome: "Burpee", modalidade: "CrossFit / Hyrox",
    video_url: "https://www.youtube.com/embed/auBLPXO8Fww",
    dicas: "Peito ao chão, salto com palmas, ritmo constante.",
    alerta_critico: "Em altas reps, controle a descida para não machucar punho/peito." },
  { id: "double_under", nome: "Double Under (Corda Dupla)", modalidade: "CrossFit",
    video_url: "https://www.youtube.com/embed/82jNjDS19lg",
    dicas: "Pulso gira a corda, salto pequeno e vertical, cotovelos colados.",
    alerta_critico: "Não saltar 'alto demais' — perde ritmo e desgasta panturrilhas." },
  { id: "toes_to_bar", nome: "Toes-to-Bar", modalidade: "CrossFit",
    video_url: "https://www.youtube.com/embed/_-S_8ezNDdg",
    dicas: "Use o kipping de ombro, comprima o core, traga os pés ao ferro.",
    alerta_critico: "Sem técnica de kipping, faça hanging leg raise." },

  // HYROX
  { id: "sled_push", nome: "Sled Push (Empurre)", modalidade: "Hyrox",
    video_url: "https://www.youtube.com/embed/7X8mG-J9XDM",
    dicas: "Passadas curtas e explosivas, braços travados perto do corpo.",
    alerta_critico: "Não curve a lombar. Mantenha o quadril em linha com o tronco." },
  { id: "sled_pull", nome: "Sled Pull (Puxada)", modalidade: "Hyrox",
    video_url: "https://www.youtube.com/embed/lUYGzwbB3iA",
    dicas: "Tronco inclinado para trás, mãos por mãos, passos firmes.",
    alerta_critico: "Não puxe só com os braços — recrute pernas e core." },
  { id: "ski_erg", nome: "Ski Erg", modalidade: "Hyrox",
    video_url: "https://www.youtube.com/embed/qNRcrqdzr30",
    dicas: "Quadril faz a maior parte do trabalho, puxa pelo core, não pelos braços.",
    alerta_critico: "Não trave os joelhos no final da puxada." },
  { id: "row_erg", nome: "Rowing Erg (Remo)", modalidade: "Hyrox",
    video_url: "https://www.youtube.com/embed/H0r_ZPXJLtg",
    dicas: "Sequência: pernas → quadril → braços. Recuperação inversa.",
    alerta_critico: "Não puxe primeiro com os braços — você perde potência." },
  { id: "farmer_carry", nome: "Farmer Carry", modalidade: "Hyrox",
    video_url: "https://www.youtube.com/embed/Fkzk_RqlYig",
    dicas: "Postura ereta, escápulas retraídas, passadas curtas e rápidas.",
    alerta_critico: "Não deixe os ombros caírem — proteja a coluna." },
  { id: "sandbag_lunge", nome: "Sandbag Lunge", modalidade: "Hyrox",
    video_url: "https://www.youtube.com/embed/wUEl8KrMz14",
    dicas: "Sandbag nos ombros, tronco vertical, passada longa.",
    alerta_critico: "Joelho não passa muito da ponta do pé." },

  // MOBILIDADE
  { id: "couch_stretch", nome: "Couch Stretch", modalidade: "Mobilidade",
    video_url: "https://www.youtube.com/embed/aJyEsk71x8c",
    dicas: "2 min por perna, contrair glúteo para abrir o quadril.",
    alerta_critico: "Não force a lombar — quem alonga é o psoas/quadríceps." }
];

/* ============================================================
   ENGINE 4 — PERIODIZAÇÃO + MONTADOR DE TREINO DO DIA
   ============================================================ */
const TreinoEngine = {
  gerarSemana(rpeSabado) {
    let semanaPlano = {
      domingo: { tipo: "Descanso Ativo", foco: "Mobilidade e Alongamento" },
      segunda: {},
      terca:   {},
      quarta:  { tipo: "Musculação", foco: "Pernas / Core" },
      quinta:  { tipo: "CrossFit",   foco: "WOD condicionamento" },
      sexta:   { tipo: "Descanso Ativo", foco: "Mobilidade Pré-Prova" },
      sabado:  { tipo: "Hyrox",      foco: "Treino ancorado" }
    };

    if (rpeSabado >= 9) {
      semanaPlano.segunda = { tipo: "Recuperação", foco: "Natação / Remo leve" };
      semanaPlano.terca   = { tipo: "Musculação",  foco: "Superiores (cargas moderadas)" };
    } else {
      semanaPlano.segunda = { tipo: "Musculação",  foco: "Força Máxima (Peito/Costas)" };
      semanaPlano.terca   = { tipo: "CrossFit",    foco: "LPO e Ginásticos" };
    }

    return semanaPlano;
  },

  /* ============================================================
     TREINOS DO DIA (lista de exercícios com prescrição)
     ============================================================ */
  treinosDetalhados: {
    'Pernas / Core': [
      { exId: "back_squat",  prescricao: "5×5",  descanso: "2-3min", obs: "Força máxima — escolha 80% 1RM" },
      { exId: "rdl",         prescricao: "4×8",  descanso: "90s",    obs: "Foco em posterior" },
      { exId: "lunge",       prescricao: "3×12", descanso: "60s",    obs: "Cada perna, alternado" },
      { exId: "leg_press",   prescricao: "3×15", descanso: "60s",    obs: "Bomba de sangue" },
      { exId: "toes_to_bar", prescricao: "4×10", descanso: "60s",    obs: "Core finisher" }
    ],
    'Superiores (cargas moderadas)': [
      { exId: "bench_press", prescricao: "4×8",  descanso: "90s",   obs: "70% 1RM" },
      { exId: "row_barbell", prescricao: "4×8",  descanso: "90s",   obs: "Pegada pronada" },
      { exId: "ohp",         prescricao: "3×10", descanso: "60s",   obs: "Cargas leves/médias" },
      { exId: "pullup",      prescricao: "4×máx",descanso: "90s",   obs: "Até falha técnica" },
      { exId: "dip",         prescricao: "3×12", descanso: "60s",   obs: "" }
    ],
    'Força Máxima (Peito/Costas)': [
      { exId: "bench_press", prescricao: "5×5",  descanso: "3min",  obs: "85% 1RM — descanso longo" },
      { exId: "pullup",      prescricao: "5×5",  descanso: "2min",  obs: "Lastreado se sobrar força" },
      { exId: "row_barbell", prescricao: "4×6",  descanso: "2min",  obs: "Carga pesada" },
      { exId: "ohp",         prescricao: "3×8",  descanso: "90s",   obs: "Trabalho acessório" },
      { exId: "dip",         prescricao: "3×10", descanso: "60s",   obs: "Finalizador" }
    ],
    'WOD condicionamento': [
      { exId: "thruster",         prescricao: "21-15-9", descanso: "—", obs: "Para tempo (Fran-style) — 40kg" },
      { exId: "pullup",           prescricao: "21-15-9", descanso: "—", obs: "Acompanha o thruster" },
      { exId: "kettlebell_swing", prescricao: "5×15",    descanso: "60s", obs: "Cash-out — 24kg" }
    ],
    'LPO e Ginásticos': [
      { exId: "snatch",        prescricao: "5×3", descanso: "2min", obs: "Técnica — 60% 1RM" },
      { exId: "clean",         prescricao: "5×3", descanso: "2min", obs: "Power clean — 70% 1RM" },
      { exId: "toes_to_bar",   prescricao: "5×8", descanso: "90s",  obs: "Kipping" },
      { exId: "double_under",  prescricao: "5×30",descanso: "60s",  obs: "Ritmo constante" }
    ],
    'Treino ancorado': [
      { exId: "ski_erg",        prescricao: "1000m", descanso: "—", obs: "Estação 1 — ritmo de prova" },
      { exId: "sled_push",      prescricao: "50m",   descanso: "—", obs: "Estação 2 — peso de competição" },
      { exId: "sled_pull",      prescricao: "50m",   descanso: "—", obs: "Estação 3" },
      { exId: "burpee",         prescricao: "80m",   descanso: "—", obs: "Estação 4 — broad jump burpees" },
      { exId: "row_erg",        prescricao: "1000m", descanso: "—", obs: "Estação 5" },
      { exId: "farmer_carry",   prescricao: "200m",  descanso: "—", obs: "Estação 6 — 2×24kg" },
      { exId: "sandbag_lunge",  prescricao: "100m",  descanso: "—", obs: "Estação 7 — 20kg" },
      { exId: "wall_balls",     prescricao: "100 reps",descanso:"—",obs: "Estação 8 final — 9kg" }
    ],
    'Natação / Remo leve': [
      { exId: "row_erg", prescricao: "20min", descanso: "—", obs: "Ritmo conversacional (RPE 4-5)" }
    ],
    'Mobilidade e Alongamento': [
      { exId: "couch_stretch", prescricao: "2×2min", descanso: "—", obs: "Cada perna" }
    ],
    'Mobilidade Pré-Prova': [
      { exId: "couch_stretch", prescricao: "1×90s",  descanso: "—", obs: "Cada perna — sem intensidade" }
    ]
  },

  obterTreinoDoDia(foco) {
    return this.treinosDetalhados[foco] || [];
  }
};

/* ============================================================
   ENGINE 5 — STORAGE
   ============================================================ */
const StorageEngine = {
  CHAVE_TREINOS: 'guerra_fit_treinos',
  CHAVE_PERFIL:  'guerra_fit_perfil',
  CHAVE_PLANO:   'guerra_fit_plano',

  salvarTreinoConcluido(dataISO, exercicioId, cargaKg, reps) {
    let h = JSON.parse(localStorage.getItem(this.CHAVE_TREINOS)) || [];
    h.push({ data: dataISO, exercicioId, cargaMaxima: cargaKg, repeticoes: reps });
    localStorage.setItem(this.CHAVE_TREINOS, JSON.stringify(h));
  },
  obterHistoricoCompleto() { return JSON.parse(localStorage.getItem(this.CHAVE_TREINOS)) || []; },
  obterProgressoExercicio(exId) {
    return this.obterHistoricoCompleto()
      .filter(t => t.exercicioId === exId)
      .sort((a, b) => new Date(a.data) - new Date(b.data));
  },
  salvarPerfil(p)  { localStorage.setItem(this.CHAVE_PERFIL, JSON.stringify(p)); },
  obterPerfil()    { return JSON.parse(localStorage.getItem(this.CHAVE_PERFIL)) || null; },
  salvarPlano(p)   { localStorage.setItem(this.CHAVE_PLANO,  JSON.stringify(p)); },
  obterPlano()     { return JSON.parse(localStorage.getItem(this.CHAVE_PLANO))  || null; }
};

/* ============================================================
   UI CONTROLLER
   ============================================================ */
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

  /* ---------- PERFIL ---------- */
  bindFormPerfil() {
    this.$('#formPerfil').addEventListener('submit', e => {
      e.preventDefault();
      const perfil = {
        peso:           parseFloat(this.$('#peso').value),
        altura:         parseFloat(this.$('#altura').value),
        idade:          parseInt(this.$('#idade').value, 10),
        numRefeicoes:   parseInt(this.$('#numRefeicoes').value, 10),
        nivelAtividade: this.$('#nivelAtividade').value,
        objetivo:       this.$('#objetivo').value
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
    this.$('#planoResultado').classList.remove('hidden');

    this.$('#mTmb').textContent  = plano.metricas.tmb.toLocaleString('pt-BR');
    this.$('#mGetd').textContent = plano.metricas.getd.toLocaleString('pt-BR');
    this.$('#mAlvo').textContent = plano.metricas.caloriasAlvo.toLocaleString('pt-BR');

    this.$('#dProt').textContent = plano.macrosDiarios.proteina;
    this.$('#dCarb').textContent = plano.macrosDiarios.carboidrato;
    this.$('#dGord').textContent = plano.macrosDiarios.gordura;
    this.$('#dFib').textContent  = plano.macrosDiarios.fibras;

    this.$('#qtdRefLabel').textContent = `· ${plano.refeicoes.quantidade} REFEIÇÕES`;

    // === MONTA REFEIÇÕES REAIS ===
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
          <div class="ref-macro m-p"><span class="ref-macro-lbl">PROT</span><span class="ref-macro-val">${ref.totais.proteina}g</span></div>
          <div class="ref-macro m-c"><span class="ref-macro-lbl">CARB</span><span class="ref-macro-val">${ref.totais.carboidrato}g</span></div>
          <div class="ref-macro m-g"><span class="ref-macro-lbl">GORD</span><span class="ref-macro-val">${ref.totais.gordura}g</span></div>
          <div class="ref-macro m-f"><span class="ref-macro-lbl">FIBRA</span><span class="ref-macro-val">${ref.totais.fibra}g</span></div>
        </div>`;
      grid.appendChild(card);
    });
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

  /* ---------- SEMANA / TREINO DO DIA ---------- */
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
              </li>`;
          }).join('')}
        </ul>
      ` : `<div class="dia-vazio">Sem prescrição detalhada para este dia.</div>`;

      card.innerHTML = `
        <div class="dia-header">
          <span class="dia-tag">${labels[dia]}</span>
          <span class="dia-tipo">${planoDia.tipo} <small style="display:block;font-size:11px;color:var(--txt-3);letter-spacing:0.5px;margin-top:2px;font-family:var(--font-body);">${planoDia.foco}</small></span>
          <span class="dia-badge ${ehHoje ? 'hoje-tag' : ''}">${ehHoje ? 'HOJE' : ''}</span>
        </div>
        ${exercHtml}`;

      // bind clique em cada exercício do dia → abre modal
      card.querySelectorAll('.dia-ex').forEach(li => {
        li.addEventListener('click', () => {
          const ex = this.mapaExercicios[li.dataset.exId];
          if (ex) this.abrirModal(ex);
        });
      });

      wrap.appendChild(card);
    });
  },

  /* ---------- BIBLIOTECA ---------- */
  renderExercicios(filtroModalidade = 'TODOS', textoBusca = '') {
    const grid = this.$('#exGrid');
    grid.innerHTML = '';
    const termo = textoBusca.toLowerCase().trim();

    const lista = BibliotecaExercicios.filter(ex => {
      const passaModalidade = filtroModalidade === 'TODOS' ||
        ex.modalidade.toUpperCase().includes(filtroModalidade);
      const passaBusca = !termo || ex.nome.toLowerCase().includes(termo);
      return passaModalidade && passaBusca;
    });

    if (!lista.length) {
      grid.innerHTML = `<div class="empty-state small" style="grid-column:1/-1"><p>Nenhum movimento encontrado.</p></div>`;
    } else {
      lista.forEach((ex, i) => {
        const card = document.createElement('div');
        card.className = 'ex-card';
        card.style.animationDelay = `${i * 30}ms`;
        card.innerHTML = `
          <span class="badge">${ex.modalidade}</span>
          <h4>${ex.nome}</h4>`;
        card.addEventListener('click', () => this.abrirModal(ex));
        grid.appendChild(card);
      });
    }
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
    this.$('#modalVideo').src = '';
    document.body.style.overflow = '';
  },

  /* ---------- HISTÓRICO ---------- */
  renderSelectCargas() {
    this.$('#cargaEx').innerHTML = BibliotecaExercicios
      .map(ex => `<option value="${ex.id}">${ex.nome}</option>`).join('');
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

    lista.innerHTML = historico.map(h => {
      const data = new Date(h.data);
      const dataFmt = data.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' }) +
                      ' · ' + data.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
      const nome = this.mapaExercicios[h.exercicioId]?.nome || h.exercicioId;
      return `
        <div class="hist-item">
          <div class="hist-info">
            <span class="hist-nome">${nome}</span>
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
