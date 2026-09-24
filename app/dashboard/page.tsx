import { AppShell } from "@/components/AppShell";
import { prisma } from "@/lib/prisma";
import { AccountStatus, TransactionType } from "@prisma/client";
import { addDays } from "date-fns";

export default async function Dashboard(){
  const [incomes,expenses,pendingPayables,pendingReceivables,nextPayables]=await Promise.all([
    prisma.movement.aggregate({where:{type:TransactionType.INCOME},_sum:{amount:true}}),
    prisma.movement.aggregate({where:{type:TransactionType.EXPENSE},_sum:{amount:true}}),
    prisma.accountPayable.aggregate({where:{status:AccountStatus.PENDING},_sum:{amount:true}}),
    prisma.accountReceivable.aggregate({where:{status:AccountStatus.PENDING},_sum:{amount:true}}),
    prisma.accountPayable.findMany({where:{status:AccountStatus.PENDING,dueDate:{lte:addDays(new Date(),10)}},include:{category:true},orderBy:{dueDate:"asc"},take:8})
  ]);
  const inc=Number(incomes._sum.amount||0), exp=Number(expenses._sum.amount||0), saldo=inc-exp;
  const money=(v:number)=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  return <AppShell title="Dashboard" description="Visão geral financeira do condomínio">
    <div className="cards">
      <div className="card"><div className="label">Saldo</div><div className="value">{money(saldo)}</div></div>
      <div className="card"><div className="label">Receitas</div><div className="value">{money(inc)}</div></div>
      <div className="card"><div className="label">Despesas</div><div className="value">{money(exp)}</div></div>
      <div className="card"><div className="label">A pagar / A receber</div><div className="value" style={{fontSize:20}}>{money(Number(pendingPayables._sum.amount||0))} / {money(Number(pendingReceivables._sum.amount||0))}</div></div>
    </div>
    <div className="panel" style={{marginTop:16}}>
      <h2 className="section-title">Próximas contas a vencer</h2>
      <div className="table-wrap"><table className="table"><thead><tr><th>Descrição</th><th>Categoria</th><th>Vencimento</th><th>Valor</th></tr></thead><tbody>
        {nextPayables.map(x=><tr key={x.id}><td>{x.description}</td><td>{x.category.name}</td><td>{x.dueDate.toLocaleDateString("pt-BR")}</td><td>{money(Number(x.amount))}</td></tr>)}
        {!nextPayables.length&&<tr><td colSpan={4} className="muted">Nenhuma conta próxima do vencimento.</td></tr>}
      </tbody></table></div>
    </div>
  </AppShell>
}