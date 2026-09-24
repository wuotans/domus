"use client";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";

export default function Page(){
  const [result,setResult]=useState<any>(null);
  const [sending,setSending]=useState(false);
  async function upload(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form=new FormData(e.currentTarget);
    setSending(true);
    const r=await fetch("/api/upload",{method:"POST",body:form});
    setResult(await r.json());
    setSending(false);
    e.currentTarget.reset();
  }
  return <AppShell title="Comprovantes e notas" description="Envio de documentos financeiros">
    <form className="panel" onSubmit={upload}>
      <div className="field"><label>Arquivo</label><input name="file" type="file" accept=".pdf,image/*" required/></div>
      <button className="btn" style={{marginTop:14}} disabled={sending}>{sending?"Enviando...":"Enviar arquivo"}</button>
      {result?.filename&&<p>Arquivo salvo: <strong>{result.originalName}</strong></p>}
    </form>
  </AppShell>
}
