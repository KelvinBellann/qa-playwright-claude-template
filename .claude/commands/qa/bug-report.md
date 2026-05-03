---
description: Produzir um relatório de bug de QA conciso a partir de evidências de falha ou comportamento observado.
disable-model-invocation: true
argument-hint: "[failure-or-symptom]"
allowed-tools: Read Glob Grep Bash(git status *) Bash(git diff *) Bash(npm run test:api) Bash(npm run test:security) Bash(npm run test:ui) Bash(npm run test:e2e)
---

Crie um relatório de defeito profissional de QA para: $ARGUMENTS

Use `.claude/rules/defect-taxonomy.md` para classificar o problema.

Seções obrigatórias:

- Título
- Categoria
- Impacto de negócio
- Pré-condições
- Passos para reproduzir
- Resultado esperado
- Resultado atual
- Evidências
- Camada suspeita
- Acompanhamento recomendado

Mantenha o relatório factual, compacto e reproduzível.