# qa-playwright-claude-template

Template profissional de automação QA para cobertura enxuta de UI, API, E2E, performance e segurança com Playwright, contratos OpenAPI e helpers de prompt orientados a Claude com baixo consumo de contexto.

## Objetivo do repositório

Este repositório foi desenhado para times que precisam de:

- suítes pequenas e determinísticas
- validação contratual antes de crescer em volume
- separação clara entre UI, API, E2E, performance e segurança
- reaproveitamento de prompts com baixo custo de tokens
- uma base escalável sem virar ruído

## Arquitetura

| Área | Responsabilidade |
| --- | --- |
| `tests/ui` | validação visual/funcional mínima das telas críticas |
| `tests/api` | regras de negócio e contratos |
| `tests/e2e` | jornadas centrais sem duplicar o que já foi coberto em UI ou API |
| `tests/security` | baseline automatizado de autenticação e headers |
| `tests/performance` | thresholds leves para endpoints críticos |
| `src/pages` | abstrações estáveis do navegador |
| `src/services` | camada de API orientada ao domínio |
| `src/clients` | wrapper HTTP fino |
| `src/builders` | massa determinística |
| `src/fixtures` | fixtures reutilizáveis do Playwright |
| `src/ai` | templates e builders de prompt concisos |
| `config/openapi` | fonte contratual para validação de schema |
| `config/environments` | parâmetros por ambiente |
| `CLAUDE.md` + `.claude/` | camada operacional do Claude Code com memória de projeto, regras, comandos, skills, subagentes e hooks |

## Stack

| Tipo | Ferramentas |
| --- | --- |
| Runtime | Node.js 22, TypeScript |
| Automação funcional | Playwright 1.59.1 |
| Validação contratual | OpenAPI + validador leve |
| Performance | runner leve em Node |
| Alvo mockado | Express |
| CI | GitHub Actions |

## Decisões técnicas principais

| Decisão | Motivo |
| --- | --- |
| Alvo mockado dentro do próprio repositório | deixa o template executável sem dependência externa |
| Leitura de OpenAPI em runtime | habilita shift-left sem geração pesada |
| Client HTTP mínimo + services | reduz impacto de mudança e deixa os testes legíveis |
| Page Objects apenas para páginas críticas | evita abstração em excesso |
| Artefatos só em falha na CI | pipeline mais barato e objetivo |
| Artefatos do Claude Code versionados | compartilham prompts, regras e padrões operacionais sem poluir a suíte principal |

## Gitflow

Este template agora segue um modelo compatível com Gitflow:

| Branch | Objetivo |
| --- | --- |
| `main` | branch estável de release |
| `develop` | branch de integração contínua |
| `feature/*` | mudanças isoladas por funcionalidade ou workflow |
| `release/*` | branch opcional para endurecimento de release |
| `hotfix/*` | correção urgente em produção |

Fluxo recomendado:

1. criar a branch a partir de `develop`
2. implementar em `feature/*`
3. validar as suítes alvo
4. fazer merge de volta em `develop`
5. promover `develop` para `main` quando estiver pronto

## Otimização para Claude

O consumo de tokens foi reduzido de três formas:

1. Prompts vivem uma vez só em [prompt-templates.ts](./src/ai/prompt-templates.ts) e são montados por [prompt-builder.ts](./src/ai/prompt-builder.ts).
2. O contexto é ordenado, deduplicado e truncado antes de entrar no prompt.
3. A arquitetura separa o problema por camadas, então o contexto enviado pode apontar só para a área relevante.

## Camada Claude Code

O repositório inclui uma estrutura de Claude Code em nível de projeto, alinhada ao modelo oficial da Anthropic para memória, regras, skills, subagentes, hooks e MCP.

| Caminho | Objetivo |
| --- | --- |
| [CLAUDE.md](./CLAUDE.md) | memória compartilhada do projeto e expectativas operacionais |
| [CLAUDE.local.example.md](./CLAUDE.local.example.md) | ponto de partida para instruções locais |
| [.mcp.json](./.mcp.json) | definição MCP do projeto, vazia até o time aprovar servidores compartilhados |
| [.claude/settings.json](./.claude/settings.json) | permissões e configuração de hooks do projeto |
| [.claude/rules](./.claude/rules) | instruções modulares carregadas por caminho para reduzir ruído de contexto |
| [.claude/commands/qa](./.claude/commands/qa) | prompts de slash command para desenho de testes, bug report e regressão |
| [.claude/skills](./.claude/skills) | playbooks sob demanda com checklists e patterns para API, segurança e performance |
| [.claude/agents](./.claude/agents) | subagentes customizados para revisão e implementação |
| [.claude/hooks](./.claude/hooks) | quality gates automatizados, wrappers shell e sync opcional com gestão de testes |

Nota para Windows:

- O estilo `qa:nome-do-comando` foi adaptado aqui para `.claude/commands/qa/*.md`, porque `:` não é válido em nomes de arquivo no Windows.
- Para configuração local, copie `CLAUDE.local.example.md` para `CLAUDE.local.md` e `.claude/settings.local.example.json` para `.claude/settings.local.json`.

## Shift-left

| Capacidade | Implementação |
| --- | --- |
| Contract testing | [contract.service.ts](./src/services/contract.service.ts) consome [finance-api.json](./config/openapi/finance-api.json) e valida respostas |
| Schema validation | [schema-validator.ts](./src/utils/schema-validator.ts) |
| Pre-test validation | [preflight.ts](./src/utils/preflight.ts) executado via fixture automática |
| Dados determinísticos | builders + reset de estado por `/test/reset` antes de cada teste |

## Shift-right

| Capacidade | Implementação |
| --- | --- |
| Logging estruturado | [logger.ts](./src/utils/logger.ts) |
| Trace só em falha | [playwright.config.ts](./playwright.config.ts) |
| Feature flags | [feature-flags.ts](./src/utils/feature-flags.ts) + configs de ambiente |
| Execução sensível ao ambiente | [env.ts](./config/test-config/env.ts) |

## Instalação

```bash
npm ci
npx playwright install chromium firefox
```

## Execução

```bash
npm run test:ui
npm run test:api
npm run test:e2e
npm run test:security
npm run perf:smoke
```

## Scripts principais

| Script | Objetivo |
| --- | --- |
| `npm run test:ui` | validação crítica de UI |
| `npm run test:api` | regras de negócio + contratos |
| `npm run test:e2e` | jornada central do negócio |
| `npm run test:security` | baseline automatizado de segurança |
| `npm run perf:smoke` | verificação rápida de thresholds |
| `npm run perf:load` | execução com mais iterações |
| `npm run perf:stress` | confiança em limite superior |
| `npm run ci` | execução local equivalente à CI |

## CI

Dois workflows acompanham o template:

- [ci.yml](./.github/workflows/ci.yml): jobs paralelos de qualidade com fail-fast e artefatos só em falha
- [performance.yml](./.github/workflows/performance.yml): execução sob demanda para smoke/load/stress

## Cobertura de exemplo

| Camada | Exemplo |
| --- | --- |
| UI | [login.ui.spec.ts](./tests/ui/login.ui.spec.ts) |
| API | [transactions.api.spec.ts](./tests/api/transactions.api.spec.ts) |
| E2E | [critical-payment-journey.e2e.spec.ts](./tests/e2e/critical-payment-journey.e2e.spec.ts) |
| Security | [api-security.spec.ts](./tests/security/api-security.spec.ts) |
| Performance | [critical-endpoints.perf.ts](./tests/performance/critical-endpoints.perf.ts) |

## Próximos passos

- conectar um serviço real sob os mesmos contratos
- trocar o store em memória por fixtures persistidas
- adicionar tags por feature para seleção de pipeline
- acoplar a saída de prompts a um fluxo controlado de revisão
