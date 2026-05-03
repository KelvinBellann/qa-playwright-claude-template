# Padrões de Controle de Acesso

## Melhores aplicações

- provar que endpoints protegidos rejeitam tokens ausentes e forjados
- provar verificações de role ou tenant em nível de API antes do nível de UI
- validar que páginas protegidas falham de forma segura quando o contexto de auth está ausente

## Erros comuns

- assegurar apenas redirecionamento de UI sem verificar proteção no backend
- tratar 401 e 403 como intercambiáveis sem intenção clara
- deixar de validar contratos de caminho negativo para respostas de erro
