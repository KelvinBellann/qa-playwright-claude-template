# qa-playwright-claude-template

Template de automação QA pronto para produção, combinando Playwright, validação de contratos OpenAPI, verificações leves de performance e fluxos de trabalho assistidos pelo Claude. Projetado para suites de testes enxutas, determinísticas e de fácil manutenção em escala.

## Por que este repositório existe

Times que querem automatizar qualidade sem acumular ruído precisam de um framework que:

- mantém suites pequenas e determinísticas
- valida contratos antes que eles driftem
- separa claramente as responsabilidades de UI, API, E2E, segurança e performance
- distribui padrões compartilhados de QA via assets versionados do Claude Code
- permanece executável sem dependências de infraestrutura externa

Este template oferece tudo isso pronto para uso, apoiado por um mock server embutido para que todos os testes funcionem a partir de um clone limpo.

---

## Arquitetura

```
tests/
  ui/           — validação de telas críticas somente
  api/          — verificações de contrato + regra de negócio + valores limite
  e2e/          — jornadas críticas em passagem única
  security/     — bypass de auth, baseline de headers, detecção de injeção
  performance/  — verificações de threshold p95 em smoke e load

src/
  pages/        — page objects estáveis (apenas data-testid)
  services/     — camada de API orientada ao negócio
  clients/      — wrapper HTTP fino
  builders/     — builders de dados de teste determinísticos e fluentes
  fixtures/     — fixtures Playwright reutilizáveis
  ai/           — templates de prompt e builder conciso
  utils/        — mock server, schema validator, logger, feature flags

config/
  openapi/      — fonte da verdade para contratos OpenAPI
  environments/ — valores de ambiente em tempo de execução
  test-config/  — defaults, orçamentos de token, carregamento de env

.claude/
  rules/        — instruções modulares de QA carregadas por caminho
  commands/qa/  — prompts de slash commands para tarefas QA repetíveis
  skills/       — playbooks procedurais para API, segurança e performance
  agents/       — subagentes customizados para revisão e implementação
  hooks/        — gates de qualidade automatizados (formato + cobertura)
```

---

## Responsabilidades por camada de teste

| Camada | O que prova | O que não repete |
| --- | --- | --- |
| `tests/ui` | Telas críticas renderizam e interagem corretamente | Regras de negócio já cobertas na camada API |
| `tests/api` | Contratos, regras de negócio, valores limite, caminhos negativos | Detalhes de renderização UI |
| `tests/e2e` | Jornada crítica end-to-end funciona da UI até os dados | Cada regra de API (confia na suite API) |
| `tests/security` | Auth, validação de token, headers de segurança, rejeição de injeção | Lógica de negócio |
| `tests/performance` | Thresholds p95 e taxas de erro em endpoints críticos | Correção funcional |

---

## Sistema de tags

Os testes são anotados com tags semânticas para execução seletiva:

| Tag | Significado |
| --- | --- |
| `@smoke` | gate pré-deploy rápido — executar em cada push |
| `@critical` | caminho de negócio central — nunca pode regredir |
| `@regression` | cobertura de regressão completa — executar antes do release |
| `@boundary` | testes de valor limite e partição de equivalência |
| `@contract` | validação de shape e status de contrato OpenAPI |
| `@security` | verificações de auth, token, header e injeção |

---

## Stack

| Área | Ferramenta |
| --- | --- |
| Runtime | Node.js 22, TypeScript (strict, ESM) |
| Automação funcional | Playwright 1.59.1 |
| Validação de contrato | OpenAPI JSON + schema validator leve |
| Performance | Node runner com thresholds de p95 e taxa de erro |
| Mock server | Express 5 com estado em memória e headers de segurança |
| CI | GitHub Actions (jobs paralelos, artefatos somente em falha) |
| Assistente QA | Claude Code com rules, skills e subagentes versionados |

---

## Decisões de design

| Decisão | Razão |
| --- | --- |
| Mock server dentro do repositório | Executável a partir de um clone limpo, sem dependências externas |
| OpenAPI carregado em tempo de execução | Verificações de contrato shift-left sem overhead de geração de código |
| Reset de estado antes de cada teste | Determinístico — sem poluição entre testes |
| Builders no lugar de dados inline | Legível, reutilizável, resiliente a mudanças |
| Page objects apenas para páginas críticas | Evita ruído de abstração em telas de baixo risco |
| Artefatos de falha somente no CI | Pipelines baratos, diagnósticos focados |
| Assets do Claude versionados com o código | Prompts, rules e padrões de QA compartilhados para todo o time |

---

## Implementação shift-left

| Capacidade | Implementação |
| --- | --- |
| Contract testing | [contract.service.ts](./src/services/contract.service.ts) valida respostas em tempo de execução contra [finance-api.json](./config/openapi/finance-api.json) |
| Validação de schema | [schema-validator.ts](./src/utils/schema-validator.ts) — validação recursiva de propriedades e arrays |
| Validação pré-teste | [preflight.ts](./src/utils/preflight.ts) — verifica BASE_URL e arquivo OpenAPI antes de qualquer teste |
| Dados determinísticos | Builders + endpoint `/test/reset` reseta o estado em memória antes de cada teste |
| Validação de entrada | Mock server rejeita injeção SQL/script na fronteira da API |

---

## Implementação shift-right

| Capacidade | Implementação |
| --- | --- |
| Logging estruturado | [logger.ts](./src/utils/logger.ts) — eventos JSON com nível, nome do evento e duração |
| Trace somente em falha | [playwright.config.ts](./playwright.config.ts) — `retain-on-failure` |
| Feature flags | [feature-flags.ts](./src/utils/feature-flags.ts) + [environments/](./config/environments/) |
| Execução por ambiente | [env.ts](./config/test-config/env.ts) — carregamento de env em tempo de execução com defaults |
| Thresholds de performance | [critical-endpoints.perf.ts](./tests/performance/critical-endpoints.perf.ts) — p95, taxa de erro, 3 perfis |

---

## Gitflow

| Branch | Propósito |
| --- | --- |
| `main` | branch de release estável |
| `develop` | branch de integração para trabalho em andamento |
| `feature/*` | mudanças isoladas de feature ou fluxo |
| `release/*` | branch opcional de endurecimento de release |
| `hotfix/*` | branch de correção urgente de produção |

**Fluxo recomendado:**

```bash
git checkout develop
git checkout -b feature/minha-mudanca
# implementar + validar suite direcionada
git push origin feature/minha-mudanca
# abrir PR → develop
# promover develop → main quando estiver pronto
```

---

## Camada de operação do Claude Code

| Caminho | Propósito |
| --- | --- |
| [CLAUDE.md](./CLAUDE.md) | Memória compartilhada do projeto e expectativas de operação |
| [CLAUDE.local.example.md](./CLAUDE.local.example.md) | Modelo para instruções pessoais (git-ignored) |
| [.mcp.json](./.mcp.json) | Definição MCP com escopo de projeto (intencionalmente vazio até aprovação do time) |
| [.claude/settings.json](./.claude/settings.json) | Permissões do projeto e configuração de hooks |
| [.claude/rules/](./.claude/rules/) | Instruções modulares carregadas por caminho para reduzir ruído de contexto |
| [.claude/commands/qa/](./.claude/commands/qa/) | Prompts de slash commands para design de testes, relatos de bugs e decisões de regressão |
| [.claude/skills/](./.claude/skills/) | Playbooks procedurais para trabalhos de API, segurança e performance |
| [.claude/agents/](./.claude/agents/) | Subagentes customizados para tarefas de revisão e implementação |
| [.claude/hooks/](./.claude/hooks/) | Gates de qualidade automatizados: validação de formato e verificação de cobertura |

O uso de tokens dos prompts Claude é reduzido de três formas:

1. Prompts são armazenados uma vez em [prompt-templates.ts](./src/ai/prompt-templates.ts) e reutilizados via [prompt-builder.ts](./src/ai/prompt-builder.ts).
2. O contexto é compactado, ordenado, deduplicado e truncado antes da montagem.
3. Rules e skills são carregados apenas quando o caminho coincide, então o Claude vê somente o que importa.

---

## Instalação

```bash
npm ci
npx playwright install chromium firefox
```

---

## Execução

### Por camada

```bash
npm run test:ui          # validação de telas críticas
npm run test:api         # contratos + regras de negócio + valores limite
npm run test:e2e         # jornada crítica end-to-end
npm run test:security    # auth, headers, baseline de injeção
npm run perf:smoke       # verificação rápida de threshold p95
```

### Por tag

```bash
npm run test:smoke       # @smoke — gate pré-deploy rápido entre todas as camadas
npm run test:regression  # @regression — regressão completa antes do release
```

Ou passe qualquer tag diretamente:

```bash
npx playwright test --grep @boundary
npx playwright test --grep @contract
npx playwright test --grep @security
```

### Tudo de uma vez

```bash
npm run ci               # clean → typecheck → todos os testes → perf:smoke
```

---

## Scripts principais

| Script | Propósito |
| --- | --- |
| `npm run test:ui` | Validação crítica somente de UI |
| `npm run test:api` | Contratos de API + regras + valores limite |
| `npm run test:e2e` | Jornada de negócio central |
| `npm run test:security` | Verificações de segurança baseline |
| `npm run test:smoke` | Todos os testes com tag `@smoke` entre camadas |
| `npm run test:regression` | Todos os testes com tag `@regression` entre camadas |
| `npm run perf:smoke` | Execução rápida de threshold p95 (5–10 iterações) |
| `npm run perf:load` | Execução de threshold com mais iterações (20+) |
| `npm run perf:stress` | Execução de confiança do limite superior (30+) |
| `npm run ci` | Comando CI local completo equivalente |

---

## CI

Dois workflows estão incluídos:

- [ci.yml](./.github/workflows/ci.yml) — jobs de qualidade paralelos (typecheck, api+security, ui+e2e) com upload de artefatos somente em falha
- [performance.yml](./.github/workflows/performance.yml) — execução smoke/load/stress sob demanda

---

## Cobertura de testes

| Camada | Arquivo | Tags |
| --- | --- | --- |
| UI | [login.ui.spec.ts](./tests/ui/login.ui.spec.ts) | `@smoke` `@critical` `@regression` |
| UI | [payments.ui.spec.ts](./tests/ui/payments.ui.spec.ts) | `@smoke` `@critical` `@regression` `@boundary` |
| API | [transactions.api.spec.ts](./tests/api/transactions.api.spec.ts) | `@smoke` `@critical` `@contract` `@regression` `@security` |
| API | [auth.api.spec.ts](./tests/api/auth.api.spec.ts) | `@smoke` `@contract` `@regression` `@security` |
| API | [business-rules.api.spec.ts](./tests/api/business-rules.api.spec.ts) | `@smoke` `@regression` `@boundary` `@contract` |
| E2E | [critical-payment-journey.e2e.spec.ts](./tests/e2e/critical-payment-journey.e2e.spec.ts) | `@smoke` `@critical` `@regression` `@boundary` |
| Segurança | [api-security.spec.ts](./tests/security/api-security.spec.ts) | `@smoke` `@security` `@contract` `@regression` |
| Performance | [critical-endpoints.perf.ts](./tests/performance/critical-endpoints.perf.ts) | — |

---

## Contribuição

1. Crie uma branch a partir de `develop` usando o prefixo `feature/*`.
2. Execute a suite direcionada relevante antes de abrir um PR:
   - Mudança de API → `npm run test:api`
   - Mudança de UI → `npm run test:ui`
   - Mudança relevante para segurança → `npm run test:security`
   - Caminho crítico → `npm run test:smoke`
3. Se mudar um serviço, página, builder ou contrato OpenAPI, atualize o teste correspondente.
4. Não introduza `waitForTimeout`, `.only` ou encadeamentos de seletores atrelados ao layout.
5. Mantenha uma intenção de negócio por teste. Casos limite pertencem a [business-rules.api.spec.ts](./tests/api/business-rules.api.spec.ts).
6. Para configuração local, copie `CLAUDE.local.example.md` → `CLAUDE.local.md` e `.claude/settings.local.example.json` → `.claude/settings.local.json`. Ambos são ignorados pelo git.

---

## Próximas extensões

- Conectar um serviço real sob os mesmos contratos OpenAPI substituindo o mock server
- Substituir o mock store por fixtures de banco de dados semeado para execuções em modo integração
- Conectar a saída de `prompt-builder.ts` a um fluxo de revisão assistida por IA
- Adicionar tags de feature (ex.: `@payments`, `@auth`) para filtragem mais granular no CI
