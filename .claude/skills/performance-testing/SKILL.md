---
name: performance-testing
description: Manter a suite de performance leve focada em endpoints críticos, thresholds e validação determinística de smoke.
when_to_use: Usar ao tocar tests/performance, thresholds de tempo de resposta ou fluxo de endpoints críticos de negócio.
allowed-tools: Read Glob Grep Edit MultiEdit Write Bash(npm run perf:smoke) Bash(npm run typecheck)
---

Você está trabalhando na camada de performance.

Regras:

0. Leia `thresholds.md` e `load-patterns.md` antes de mudar o comportamento do runner ou os perfis.
1. Mantenha o escopo apenas nos endpoints críticos.
2. Prefira validação determinística de smoke e threshold a carga sintética ampla.
3. Mantenha as verificações de p95 e taxa de erro fáceis de entender apenas pela saída.
4. Reutilize o fluxo de login e de endpoint existente em vez de criar novos caminhos de orquestração.
5. Documente qualquer mudança de threshold no README se isso alterar as expectativas de operação do template.
