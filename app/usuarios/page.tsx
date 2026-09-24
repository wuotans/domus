"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";

export default function Page(){
  const [items,setItems]=useState<any[]>([]);
  const [f,setF]=useState({name:"",email:"",password:"",role:"CONSULTA"});
  const load=()=>fetch("/api/users").then(r=>r.json()).then(setItems);
  useEffect(()=>{ void load(); },[]);
  async function add(e:React.FormEvent){
    e.preventDefault();
    await fetch("/api/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});
    setF({name:"",email:"",password:"",role:"CONSULTA"});
    load();
  }
  return <AppShell title="Usuários" description="Controle de acesso e perfis">
    <form className="panel form" onSubmit={add}>
      <div className="field"><label>Nome</label><input value={f.name} onChange={e=>setF({...f,name:e.target.value})} required/></div>
      <div className="field"><label>E-mail</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/></div>
      <div className="field"><label>Senha inicial</label><input type="password" value={f.password} onChange={e=>setF({...f,password:e.target.value})} required/></div>
      <div className="field"><label>Perfil</label><select value={f.role} onChange={e=>setF({...f,role:e.target.value})}><option value="ADMIN">Administrador</option><option value="SINDICO">Síndico</option><option value="FINANCEIRO">Financeiro</option><option value="CONSULTA">Consulta</option></select></div>
      <div><button className="btn">Criar usuário</button></div>
    </form>
    <div className="panel" style={{marginTop:16}}>
      <div className="table-wrap"><table className="table"><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Status</th></tr></thead><tbody>
      {items.map(x=><tr key={x.id}><td>{x.name}</td><td>{x.email}</td><td>{x.role}</td><td>{x.active?"Ativo":"Inativo"}</td></tr>)}
      </tbody></table></div>
    </div>
  </AppShell>
}
