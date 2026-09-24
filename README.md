# Domus

Sistema completo para gestão de condomínios.

## Recursos

- Login e controle de usuários
- Dashboard financeiro
- Contas a pagar e receber
- Entradas e saídas
- Categorias financeiras
- Anexos e comprovantes
- Manutenções programadas
- Calendário
- Assembleias e pautas
- Histórico de movimentações
- Relatórios mensais
- Exportação PDF e Excel
- Interface responsiva

## Stack

- Next.js 15
- TypeScript
- Prisma
- SQLite em desenvolvimento
- NextAuth
- CSS responsivo

## Como executar

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Acesse:

```
http://localhost:3000
```

Usuário inicial criado pelo seed:

```
admin@domus.local
admin123
```

> Troque a senha após o primeiro acesso.

## Se você já tinha instalado antes desta correção

Atualize a branch e reinstale as dependências:

```bash
git pull
rm -rf node_modules package-lock.json
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Produção

Para produção, altere o provider do Prisma para PostgreSQL e configure a variável `DATABASE_URL`.
