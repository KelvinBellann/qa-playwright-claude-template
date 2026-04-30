# Agentes

Use subagentes quando a tarefa é delimitada e o resultado pode ser revisado de forma independente.

## Melhor roteamento

- `security-auditor`: auth, controle de acesso, entrada insegura, exposição de segredos
- `performance-analyst`: thresholds, estabilidade do runner, risco de desempenho por endpoint
- `automation-engineer`: implementação em testes, fixtures, serviços e page objects

Subagentes devem responder com achados ou patches direcionados, não com redesigns amplos.
