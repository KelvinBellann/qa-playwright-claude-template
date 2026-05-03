---
description: Recomendar a menor suite de regressão que ainda protege o escopo alterado.
disable-model-invocation: true
argument-hint: "[optional-scope]"
allowed-tools: Read Glob Grep Bash(git status *) Bash(git diff --name-only *) Bash(git diff --name-only HEAD)
---

Monte uma recomendação de regressão para: $ARGUMENTS

Regras:

- Leia as mudanças atuais primeiro.
- Use o modelo de camadas do repositório: UI, API, E2E, segurança, performance.
- Recomende a menor suite executável que cobre o risco observado.
- Indique o que pode ficar fora da regressão e por quê.

Formato de saída:

- Escopo alterado
- Suites recomendadas
- Ordem de execução
- Risco se pulado
- Suite estendida opcional