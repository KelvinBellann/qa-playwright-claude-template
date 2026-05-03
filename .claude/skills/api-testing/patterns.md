# Padrões de Testes de API

## Melhores aplicações

- Drift de contrato: atualizar OpenAPI e assegurar resposta via `ContractService`
- Validação de negócio: usar um builder para montar o menor payload que prova a regra
- Cobertura de auth: validar fluxos não-autorizados e autorizados com verificações explícitas de status
- Evolução de serviço: estender `src/services/` antes de adicionar lógica de requisição direta dentro dos specs

## Anti-padrões

- duplicar asserções de UI em testes de API
- hardcodar payloads grandes inline
- testar cada campo em cada teste quando o contrato já prova o shape
