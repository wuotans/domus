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
npx prisma db push
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

## Produção

Para produção, altere o provider do Prisma para PostgreSQL e configure a variável `DATABASE_URL`.
