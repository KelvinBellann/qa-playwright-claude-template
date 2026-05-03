# Orientação de Thresholds de Performance

Use thresholds que os times consigam explicar e defender:

- p95 deve refletir responsividade percebida pelo usuário, não velocidade ideal de laboratório
- taxa de erro deve permanecer próxima de zero para verificações de smoke
- escolha de endpoint deve mapear para ações críticas de negócio

Altere thresholds apenas quando:

- o comportamento do sistema mudou intencionalmente
- o perfil do ambiente mudou materialmente
- o threshold antigo criava ruído sem proteger risco
