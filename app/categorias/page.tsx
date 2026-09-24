"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Modal } from "@/components/Modal";

type Category = { id: string; name: string; type: "INCOME" | "EXPENSE" };

export default function Page() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  async function load() {
    const response = await fetch("/api/categories");
    setItems(await response.json());
  }

  useEffect(() => { void load(); }, []);

  async function add(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type }),
    });
    setName("");
    setOpen(false);
    await load();
  }

  return (
    <AppShell title="Categorias" description="Organize receitas e despesas por categoria">
      <div className="page-actions">
        <button className="btn" onClick={() => setOpen(true)}>+ Nova categoria</button>
      </div>

      <Modal open={open} title="Nova categoria" onClose={() => setOpen(false)}>
        <form className="panel form" onSubmit={add}>
          <div className="field">
            <label>Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          </div>
          <div className="field">
            <label>Tipo</label>
            <select value={type} onChange={(e) => setType(e.target.value as "INCOME" | "EXPENSE")}>
              <option value="EXPENSE">Despesa</option>
              <option value="INCOME">Receita</option>
            </select>
          </div>
          <div className="full actions">
            <button type="button" className="btn secondary" onClick={() => setOpen(false)}>Cancelar</button>
            <button className="btn">Cadastrar</button>
          </div>
        </form>
      </Modal>

      <div className="panel">
        <div className="panel-heading">
          <div><span className="eyebrow">Financeiro</span><h2>Categorias cadastradas</h2></div>
          <span className="badge">{items.length} categorias</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Nome</th><th>Tipo</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td><span className="badge">{item.type === "INCOME" ? "Receita" : "Despesa"}</span></td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={2} className="muted">Nenhuma categoria cadastrada.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
