# QA Playwright Claude Template

Este repositório é um template enxuto de automação QA para Playwright, validação de contratos OpenAPI, verificações leves de performance e fluxos de trabalho assistidos pelo Claude.

## Sistema sob teste

A aplicação alvo incluída é um fluxo mínimo de pagamentos financeiros usado para demonstrar:

- login no browser e navegação protegida
- criação de pagamentos e mudanças de saldo
- validação de contratos baseada em OpenAPI
- verificações baseline de auth e segurança
- validação determinística de smoke de performance

O mock target existe apenas para tornar o repositório executável sem infraestrutura externa. Times podem substituí-lo por um sistema real preservando a arquitetura de testes.

## Estratégia de QA

- UI prova apenas comportamento crítico de tela.
- API prova regras de negócio e contratos primeiro.
- E2E prova apenas a jornada de negócio que cruza camadas.
- Security prova proteção baseline de auth, header e entrada insegura.
- Performance prova a saúde de threshold de endpoints críticos, não carga sintética em volume por padrão.

Este repositório é intencionalmente orientado para feedback rápido e baixa manutenção.

## Critérios de aceitação

- Suite direcionada relevante é executada.
- Testes permanecem independentes e determinísticos.
- Novo comportamento é coberto na camada correta, não duplicado em todas as camadas.
- OpenAPI permanece alinhado com o comportamento de endpoints protegidos.
- README e assets do Claude são atualizados quando o fluxo do time muda.
- Nenhum segredo ou valor específico de máquina é commitado.

## Toolchain

- Playwright 1.59.1
- TypeScript
- Mock target Express
- Validação de schema OpenAPI em tempo de execução
- Node performance runner leve
- GitHub Actions
- Claude Code: memória de projeto, rules, commands, skills, agents e hooks

## Mapa do repositório

- `tests/ui`: verificações mínimas de browser
- `tests/api`: validação de auth, contrato e regra
- `tests/e2e`: jornadas críticas de usuário
- `tests/security`: bypass de auth, headers, entrada insegura
- `tests/performance`: verificações de smoke/load/stress focadas em threshold
- `src/pages`: abstrações de browser
- `src/services`: camada de API orientada ao domínio
- `src/clients`: wrapper HTTP de baixo nível
- `src/builders`: builders de dados determinísticos
- `src/fixtures`: fixtures compartilhadas de teste
- `src/ai`: helpers de prompt conciso para o Claude
- `config/openapi`: fonte da verdade para contratos de resposta

## Acordos de trabalho

- Seguir Gitflow: criar branch a partir de `develop`, usar `feature/*`, fazer merge de volta para `develop` e manter `main` orientado a releases.
- Preferir atualizar fixtures, serviços e builders existentes a adicionar helpers duplicados.
- Não adicionar waits fixos, `.only` ou seletores frágeis.
- Usar `data-testid` ou locators semânticos robustos.
- Se o comportamento de API mudar, atualizar `config/openapi/finance-api.json` e os testes de API afetados juntos.
- Manter prompts concisos e determinísticos. Reutilizar `src/ai/prompt-builder.ts` em vez de embutir instruções longas em testes ou docs.

## Comandos de verificação

- `npm run typecheck`
- `npm run test:api`
- `npm run test:security`
- `npm run test:ui`
- `npm run test:e2e`
- `npm run perf:smoke`
- `npm run ci`

## Modelo de operação do Claude

- `CLAUDE.md`: memória do projeto e acordos de trabalho inegociáveis
- `.claude/rules/`: regras pequenas e com escopo carregadas apenas quando relevantes por caminho
- `.claude/commands/`: fluxos de trabalho reutilizáveis via slash commands
- `.claude/skills/`: playbooks aprofundados para trabalhos de API, segurança e performance
- `.claude/agents/`: subagentes especializados para revisão ou implementação direcionada
- `.claude/hooks/`: gates de qualidade automatizados leves e helpers de sincronização
- `.mcp.json`: config MCP com escopo de projeto, intencionalmente controlado pelo time

## Notas locais

- Copiar `CLAUDE.local.example.md` para `CLAUDE.local.md` para instruções pessoais.
- Copiar `.claude/settings.local.example.json` para `.claude/settings.local.json` para overrides pessoais.
- Ambos os arquivos são ignorados pelo git propositalmente.
