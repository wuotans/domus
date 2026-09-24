"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login(){
  const router=useRouter();
  const [email,setEmail]=useState("admin@domus.local");
  const [password,setPassword]=useState("admin123");
  const [error,setError]=useState("");
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setError("");
    const r=await signIn("credentials",{email,password,redirect:false});
    if(r?.ok) router.push("/dashboard"); else setError("E-mail ou senha inválidos.");
  };
  return <div className="login-wrap"><form className="login-card" onSubmit={submit}>
    <h1>Domus</h1><p className="muted">Gestão completa do condomínio</p>
    <div className="field"><label>E-mail</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email"/></div>
    <div className="field" style={{marginTop:12}}><label>Senha</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password"/></div>
    {error&&<p style={{color:"#b91c1c"}}>{error}</p>}
    <button className="btn" style={{width:"100%",marginTop:18}}>Entrar</button>
  </form></div>
}