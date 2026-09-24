"use client";
import {useEffect,useMemo,useState} from "react";
import {AppShell} from "@/components/AppShell";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const money=(v:number)=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const monthLabel=(value:string)=>{const [y,m]=value.split("-").map(Number);return new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(new Date(y,m-1,1))};

export default function Page(){
 const[items,setItems]=useState<any[]>([]);
 const[month,setMonth]=useState(new Date().toISOString().slice(0,7));
 useEffect(()=>{void fetch("/api/movements").then(r=>r.json()).then(setItems)},[]);
 const filtered=useMemo(()=>items.filter(x=>String(x.date).slice(0,7)===month),[items,month]);
 const income=filtered.filter(x=>x.type==="INCOME").reduce((s,x)=>s+Number(x.amount),0);
 const expense=filtered.filter(x=>x.type==="EXPENSE").reduce((s,x)=>s+Number(x.amount),0);
 const result=income-expense;

 function excel(){
  const rows=filtered.map(x=>({Data:new Date(x.date).toLocaleDateString("pt-BR"),Tipo:x.type==="INCOME"?"Receita":"Despesa",Descricao:x.description,Categoria:x.category?.name||"-",Valor:Number(x.amount)}));
  const ws=XLSX.utils.json_to_sheet(rows,{origin:"A4"});
  XLSX.utils.sheet_add_aoa(ws,[["DOMUS - RELATÓRIO FINANCEIRO"],[monthLabel(month).toUpperCase()],["Receitas",income,"Despesas",expense,"Resultado",result]],{origin:"A1"});
  ws["!cols"]=[{wch:14},{wch:14},{wch:36},{wch:24},{wch:16},{wch:16}];
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Financeiro");XLSX.writeFile(wb,`domus-relatorio-${month}.xlsx`);
 }
 function pdf(){
  const doc=new jsPDF();
  doc.setFillColor(17,24,39);doc.rect(0,0,210,42,"F");
  doc.setTextColor(255,255,255);doc.setFontSize(22);doc.setFont("helvetica","bold");doc.text("DOMUS",14,17);
  doc.setFontSize(10);doc.setFont("helvetica","normal");doc.text("Relatorio financeiro do condominio",14,25);doc.text(monthLabel(month),14,32);
  doc.setTextColor(30,41,59);doc.setFontSize(11);doc.setFont("helvetica","bold");
  doc.text(`Receitas: ${money(income)}`,14,53);doc.text(`Despesas: ${money(expense)}`,78,53);doc.text(`Resultado: ${money(result)}`,143,53);
  autoTable(doc,{startY:62,head:[["Data","Tipo","Descricao","Categoria","Valor"]],body:filtered.map(x=>[new Date(x.date).toLocaleDateString("pt-BR"),x.type==="INCOME"?"Receita":"Despesa",x.description,x.category?.name||"-",money(Number(x.amount))]),theme:"striped",headStyles:{fillColor:[17,24,39]},styles:{fontSize:9,cellPadding:3},columnStyles:{4:{halign:"right"}}});
  const pages=doc.getNumberOfPages();for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(120);doc.text(`Domus • Pagina ${i} de ${pages}`,14,291)}
  doc.save(`domus-relatorio-${month}.pdf`);
 }
 return <AppShell title="Relatórios mensais" description="Prestação de contas e desempenho financeiro">
  <div className="panel">
   <div className="report-header"><h2>Relatório financeiro</h2><p>{monthLabel(month)}</p><div className="report-summary"><div><small>Receitas</small><strong>{money(income)}</strong></div><div><small>Despesas</small><strong>{money(expense)}</strong></div><div><small>Resultado</small><strong>{money(result)}</strong></div></div></div>
   <div className="actions"><input type="month" value={month} onChange={e=>setMonth(e.target.value)}/><button className="btn" onClick={pdf}>Exportar PDF</button><button className="btn secondary" onClick={excel}>Exportar Excel</button></div>
  </div>
  <div className="panel" style={{marginTop:16}}><div className="table-wrap"><table className="table"><thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Categoria</th><th>Valor</th></tr></thead><tbody>{filtered.map(x=><tr key={x.id}><td>{new Date(x.date).toLocaleDateString("pt-BR")}</td><td><span className="badge">{x.type==="INCOME"?"Receita":"Despesa"}</span></td><td>{x.description}</td><td>{x.category?.name}</td><td>{money(Number(x.amount))}</td></tr>)}{!filtered.length&&<tr><td colSpan={5} className="muted">Nenhuma movimentação neste mês.</td></tr>}</tbody></table></div></div>
 </AppShell>
}