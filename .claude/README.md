# Estrutura do Claude Code

Esta pasta mantém o comportamento do Claude Code modular para que o assistente carregue apenas o menor contexto necessário.

## Estrutura

- `settings.json`: permissões compartilhadas e configuração de hooks
- `rules/`: regras curtas com escopo por caminho
- `commands/`: prompts de slash commands para tarefas QA repetíveis
- `skills/`: fluxos de trabalho mais aprofundados com checklists e padrões
- `agents/`: subagentes especializados para revisão e implementação
- `hooks/`: gates de qualidade leves e helpers de sincronização com ferramentas de gestão de testes

## Princípio de operação

Mantenha verdades permanentes no `CLAUDE.md`, regras com escopo em `rules/`, fluxos reutilizáveis em `commands/`, e know-how de domínio em `skills/`. Evite colocar instruções estáticas longas em arquivos de teste ou código de serviço.
