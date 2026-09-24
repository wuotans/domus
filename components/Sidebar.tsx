import Link from "next/link";
import { LayoutDashboard, WalletCards, ReceiptText, ArrowLeftRight, Tags, Wrench, CalendarDays, Users, ScrollText, FileBarChart2, UserCog, Paperclip } from "lucide-react";

const items = [
  ["/dashboard","Dashboard",LayoutDashboard],
  ["/contas-pagar","Contas a pagar",WalletCards],
  ["/contas-receber","Contas a receber",ReceiptText],
  ["/movimentacoes","Movimentações",ArrowLeftRight],
  ["/categorias","Categorias",Tags],
  ["/comprovantes","Comprovantes",Paperclip],
  ["/manutencoes","Manutenções",Wrench],
  ["/calendario","Calendário",CalendarDays],
  ["/assembleias","Assembleias",Users],
  ["/usuarios","Usuários",UserCog],
  ["/historico","Histórico",ScrollText],
  ["/relatorios","Relatórios",FileBarChart2],
];

export function Sidebar(){
  return <aside className="sidebar">
    <div className="brand">Domus</div>
    <nav className="nav">{items.map(([href,label,Icon]:any)=><Link key={href} href={href}><Icon size={18} style={{verticalAlign:"middle",marginRight:8}}/>{label}</Link>)}</nav>
  </aside>
}