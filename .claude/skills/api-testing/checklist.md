# Checklist de Testes de API

- confirmar ownership do endpoint e regra de negócio em mudança
- atualizar classe de serviço se o fluxo de requisição mudou
- atualizar OpenAPI se o status code ou corpo de resposta mudou
- adicionar teste de caminho feliz apenas se prova novo comportamento
- adicionar caminho negativo de alto valor quando o risco é auth, validação ou drift de contrato
- manter payloads mínimos
- validar contrato via `ContractService`
- executar `npm run test:api`
