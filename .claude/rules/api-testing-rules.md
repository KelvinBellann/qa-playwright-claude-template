---
paths:
  - "tests/api/**/*.ts"
  - "src/services/**/*.ts"
  - "src/clients/**/*.ts"
  - "config/openapi/**/*.json"
---

# Regras de Testes de API

- Atualizar o arquivo OpenAPI quando o shape da resposta ou o comportamento de status mudar.
- Validar contratos de caminho feliz e de caminhos negativos de alto valor via `ContractService`.
- Manter payloads mínimos e determinísticos.
- Reutilizar classes de serviço em vez de chamar `request.fetch` diretamente nos specs, a menos que seja para testar a camada de client.
- Verificações de auth e autorização são obrigatórias ao mudar endpoints protegidos.
- Testes negativos devem verificar tanto o status code quanto a mensagem de erro estável ou o contrato.
- Se uma regra pode ser provada na API, não duplicá-la na UI.
