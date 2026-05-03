# Taxonomia de Defeitos

Use esta taxonomia ao triar falhas, escrever relatórios de bugs ou propor novos testes.

- Controle de acesso: bypass de auth, isolamento de tenant, vazamento de role
- Drift de contrato: shape de resposta, status code, tipo de campo, mismatch de schema
- Integridade de dados: totais errados, estado desatualizado, comportamento não-idempotente, perda de precisão
- Regressão de fluxo: caminho crítico quebrado, transição de estado inválida, regra de bloqueio ausente
- Lacuna de observabilidade: falha com evidência fraca, trace ausente, mensagem de erro pobre
- Regressão de performance: drift de p95, aumento de taxa de erro, saturação de endpoint
- Problema de arquitetura de testes: seletor frágil, wait fixo, estado compartilhado oculto, fixture ruidosa

Ao relatar um defeito, sempre nomeie a categoria mais relevante primeiro e mantenha o relatório vinculado ao impacto de negócio.
