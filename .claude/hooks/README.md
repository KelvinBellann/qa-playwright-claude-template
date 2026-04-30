# Hooks

Os hooks atuam como gates de qualidade leves.

## Hooks ativos

- `validate-test-format`: bloqueia `.only`, waits fixos e anti-padrões com sleep em `tests/`
- `check-coverage`: avisa quando o comportamento do código-fonte muda sem nenhuma alteração de teste
- `sync-zephyr`: escreve um payload dry-run para integração opcional com ferramentas de gestão de testes

## Implementação

A lógica executável fica em arquivos `.mjs` por portabilidade. Os hooks são invocados diretamente pelo Claude Code conforme configurado em `settings.json`.
