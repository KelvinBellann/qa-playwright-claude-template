---
description: Gerar casos de teste QA enxutos para uma feature, história ou conjunto de arquivos alterados.
disable-model-invocation: true
argument-hint: "[feature-or-story]"
allowed-tools: Read Glob Grep Bash(git status *) Bash(git diff --name-only *)
---

Projete um conjunto de testes compacto e de alto sinal para: $ARGUMENTS

Fluxo de trabalho:

1. Leia `CLAUDE.md` e os arquivos relevantes.
2. Aplique `.claude/rules/test-design.md` e `.claude/rules/api-testing-rules.md` quando aplicável.
3. Evite cobertura duplicada entre UI, API, E2E, segurança e performance.
4. Prefira o conjunto mínimo que prova os principais riscos de negócio.

Formato de saída:

- Premissas
- Tabela de riscos com colunas: `Risco`, `Camada`, `Por que esta camada`, `Prioridade`
- Lista final de testes com títulos curtos e notas de cobertura
- Exclusões explícitas para mostrar o que intencionalmente não está sendo testado