
# Guerra Fit – Treinos, Análise e Comparação de Logs

Este repositório contém o web app **Guerra Fit**, com:

- `index.html` – App mobile de treinos (preenchimento diário: peso, cargas, RPE, concluído).
- `analise.html` – Dashboard de análise dos treinos salvos no navegador (KPIs, tabelas, export CSV).
- `analise_logs.html` – Tela para comparar um backup antigo (`guerra_fit_logs.json`) com o estado atual do navegador.
- `treinos_guerra_programa_com_videos.csv` – Arquivo de treinos com links de vídeos (YouTube).
- `guerra-fit-icon.svg` – Ícone do app (favicon/ícone para tela de início).
- `manifest.json` – Manifest PWA básico.

---

## Fluxo de uso diário

1. Acesse o app de treinos em:

   `https://guerrarichard17-alt.github.io/guerra-fit/`

2. Carregue o arquivo `treinos_guerra_programa_com_videos.csv`.
3. Selecione o dia e a data do treino.
4. Preencha:
   - Peso corporal
   - Cargas de cada série (S1–S4)
   - RPE percebido
   - Flag de exercício concluído
   - Observações
5. Os dados são salvos automaticamente em `localStorage` na chave:

   `treino_diario_guerra_v1_mobile`

---

## Acompanhamento da evolução (no próprio navegador)

A partir do próprio app de treinos (`index.html`), use o botão:

> **“Ver evolução (abrir dashboard)”**

Isso abre o dashboard em:

`https://guerrarichard17-alt.github.io/guerra-fit/analise.html`

O `analise.html`:

- Lê os dados da mesma chave (`treino_diario_guerra_v1_mobile`).
- Exibe KPIs: dias treinados, sessões, RPE médio, peso médio.
- Exibe:
  - Resumo por dia
  - Resumo por exercício
  - Registros detalhados
- Permite exportar a análise em CSV.

---

## Backup semanal no GitHub (versionar evolução)

Rotina sugerida de backup semanal:

1. Abra o app de treinos:

   `https://guerrarichard17-alt.github.io/guerra-fit/`

2. Clique em **“Exportar dados (.json) para salvar no GitHub”**.
3. Será baixado um arquivo:

   `guerra_fit_logs.json`

4. No GitHub, no repositório **guerra-fit** da conta `guerrarichard17-alt`:

   - Clique em **Add file → Upload files**.
   - Suba o `guerra_fit_logs.json` (por exemplo, dentro de uma pasta `logs/`).
   - Faça o commit com uma mensagem descritiva, ex.: `backup semanal 2025-11-17`.

Cada commit guarda um snapshot da evolução, com histórico completo e versionado.

---

## Comparar evolução entre um backup antigo e o estado atual

Use o arquivo `analise_logs.html` assim:

1. Certifique-se de que os dados atuais estão salvos no navegador (via app de treinos).
2. Acesse:

   `https://guerrarichard17-alt.github.io/guerra-fit/analise_logs.html`

3. Selecione um arquivo `guerra_fit_logs.json` ANTIGO (baixado do repositório no GitHub).
4. Clique em **“Carregar log atual + antigo”**.

A tela irá exibir:

- KPIs do log ANTIGO:
  - Dias treinados
  - Sessões concluídas
  - RPE médio percebido
  - Peso corporal médio
- KPIs do log ATUAL.
- As DIFERENÇAS (deltas) entre antigo e atual:
  - Dias e sessões: valores positivos indicam mais consistência/volume.
  - RPE médio: valores menores podem indicar percepção de esforço mais baixa.
  - Peso médio: permite acompanhar a tendência de peso.
- Uma tabela por exercício (ID técnico `ex_N`), mostrando:
  - Sessões concluídas no log antigo vs atual.
  - Última carga registrada (S1–S4) no log antigo vs atual.

---

## Publicação no GitHub Pages (usando `guerrarichard17-alt`)

1. No GitHub, crie um repositório chamado, por exemplo, **`guerra-fit`** na conta `guerrarichard17-alt`.
2. Faça upload de todos os arquivos deste pacote na **raiz** do repositório.
3. No GitHub, vá em **Settings → Pages**.
4. Em "Source", selecione **Deploy from a branch**, branch `main` e pasta `/ (root)`.
5. Após alguns minutos, os links serão:

   - App de treino: `https://guerrarichard17-alt.github.io/guerra-fit/`
   - Dashboard de análise: `https://guerrarichard17-alt.github.io/guerra-fit/analise.html`
   - Comparação de logs: `https://guerrarichard17-alt.github.io/guerra-fit/analise_logs.html`

No iPhone, abra o app em Safari e use **“Adicionar à Tela de Início”** para instalar como um pseudo-app Guerra Fit.
