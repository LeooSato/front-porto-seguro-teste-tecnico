# PortoSeguros Front

Frontend em Angular 19 para o teste tecnico Porto Seguro. Traz dashboard, gestao de cursos/matriculas e registro de tarefas de estudo, integrado a uma API REST com autenticacao JWT.

## Demo em producao
- App: https://front-porto-seguro-teste-tecnico.vercel.app/
- API usada na build de prod: https://porto-seguro-teste-tecnico.onrender.com

## Visao geral
- Autenticacao JWT com login e cadastro; guard + interceptor protegem as rotas privadas.
- Dashboard com estatisticas, progresso semanal, tarefas recentes e destaques de cursos.
- Cursos: listar, criar/editar/remover (ADMIN) e matricular.
- Tarefas: registrar tempo de estudo por data/categoria, editar e excluir.
- UI responsiva com Angular Material/CDK.

## Stack
- Angular 19 (standalone) + Angular Material/CDK
- RxJS e TypeScript
- Ferramentas: Angular CLI 19.2.x, Karma/Jasmine para testes

## Requisitos
- Node.js >= 20 (18.19+ funciona), npm 10+

## Como rodar local
```bash
npm install
npm start
# abrir http://localhost:4200/
```
API padrao em dev: http://localhost:8080. Para apontar para outro backend, edite `src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

## Scripts disponiveis
- `npm start` - dev server com live reload.
- `npm run build` - build de producao em `dist/`.
- `npm test` - testes unitarios (Karma/Jasmine).
- `npm run watch` - build incremental em dev.

## Build de producao
```bash
npm run build -- --configuration production
```
Usa `src/environments/environment.prod.ts`, que aponta para a API em `https://porto-seguro-teste-tecnico.onrender.com`. O deploy atual esta na Vercel (link em Demo).

## Estrutura principal
```
src/
  app/
    core/        # auth (guard, interceptor), servicos base
    features/
      auth/      # login e cadastro
      home/      # dashboard
      courses/   # cursos e matriculas
      tasks/     # registro e edicao de tarefas
    shared/      # componentes e modelos comuns
  environments/  # apiUrl para dev e prod
```

## Fluxos chave
- Login e cadastro guardam o JWT em `localStorage` (chave `auth_token`) e o interceptor anexa `Authorization: Bearer <token>` automaticamente.
- Rotas publicas: login e cadastro; demais telas sao protegidas pelo guard.
- Admins podem criar/editar/excluir cursos; todos os usuarios podem se matricular e registrar tarefas.
