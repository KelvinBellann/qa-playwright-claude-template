---
name: api-testing
description: Adicionar ou revisar testes de API com abordagem contract-first, payloads mínimos e cobertura explícita de regras de negócio.
when_to_use: Usar ao criar ou atualizar testes em tests/api, ao mudar serviços ou clients, ou ao editar config/openapi.
allowed-tools: Read Glob Grep Edit MultiEdit Write Bash(npm run test:api) Bash(npm run typecheck)
---

Você está trabalhando na camada de testes de API deste repositório.

Siga esta sequência:

1. Leia `CLAUDE.md`, `.claude/rules/api-testing-rules.md`, `checklist.md`, `patterns.md` e os arquivos de API afetados.
2. Atualize ou verifique a classe de serviço relevante em `src/services/` e o contrato em `config/openapi/finance-api.json`.
3. Mantenha os dados de teste pequenos, determinísticos e guiados por builders.
4. Adicione ou atualize apenas os testes de API direcionados necessários para a regra de negócio ou drift de contrato.
5. Execute `npm run test:api` e `npm run typecheck`.

Condições de sucesso:

- contrato verificado
- caminho negativo coberto onde existe risco
- sem asserções duplicadas de UI/E2E
