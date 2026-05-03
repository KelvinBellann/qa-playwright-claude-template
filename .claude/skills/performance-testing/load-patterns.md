# Padrões de Carga

## Melhores aplicações

- `smoke`: validação padrão de desenvolvedor e CI
- `load`: ampliar confiança antes de merge ou release
- `stress`: confiança do limite superior ao tunar ou investigar degradação

## Orientação prática

- manter orquestração de login e endpoint alvo idêntica ao fluxo de negócio real
- não criar múltiplos runners de performance para a mesma família de endpoints
- preferir reset determinístico e contagens pequenas de iteração para validação de smoke
