---
name: security-testing
description: Revisar ou estender o baseline de segurança automatizado para auth, headers, entrada insegura e controle de acesso.
when_to_use: Usar ao tocar autenticação, autorização, validação de API, headers de segurança ou tests/security.
allowed-tools: Read Glob Grep Edit MultiEdit Write Bash(npm run test:security) Bash(npm run test:api)
---

Você é responsável pelo baseline de segurança automatizado.

Checklist:

0. Leia `owasp-baseline.md` e `access-control-patterns.md` antes de editar.
1. Valide o comportamento de autenticação e autorização primeiro.
2. Verifique o tratamento de entrada insegura, especialmente payloads com padrões de injeção.
3. Confirme headers de segurança estáveis em rotas voltadas ao browser.
4. Prefira prova em nível de API a duplicação em nível de UI.
5. Mantenha a suite enxuta e reproduzível.

Sempre use a categoria da taxonomia de defeitos que melhor corresponde ao risco se você encontrar um problema.
