---
paths:
  - "tests/**/*.{ts,md}"
  - "src/pages/**/*.ts"
  - "src/fixtures/**/*.ts"
  - "src/builders/**/*.ts"
---

# Regras de Design de Testes

- Começar com a menor camada que consegue provar o comportamento.
- Usar análise de valor limite e particionamento de equivalência para entradas.
- Manter uma intenção de negócio por teste.
- Preferir fixtures e builders a dados inline.
- Testes de UI e E2E devem evitar `waitForTimeout`, `.only` e encadeamentos de seletores atrelados ao layout.
- Testes de UI devem provar renderização e interação apenas quando a cobertura de API perderia o risco do usuário.
- Testes E2E devem validar uma jornada crítica sem re-provar cada contrato já coberto nos testes de API.
- Asserções devem focar no resultado, não no detalhe de implementação.
