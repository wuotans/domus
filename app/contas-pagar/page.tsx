"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Modal } from "@/components/Modal";
import { Plus, Search, X } from "lucide-react";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [f, setF] = useState<any>({ description: "", supplier: "", amount: "", dueDate: "", categoryId: "", notes: "" });

  async function load() {
    const [payables, categories] = await Promise.all([
      fetch("/api/payables").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]);
    setItems(payables);
    setCats(categories.filter((c: any) => c.type === "EXPENSE"));
  }

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) =>
      [x.description, x.supplier, x.category?.name, x.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [items, search]);

  async function add(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/payables", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    setF({ description: "", supplier: "", amount: "", dueDate: "", categoryId: "", notes: "" });
    setOpen(false);
    await load();
  }

  return (
    <AppShell title="Contas a pagar" description="Acompanhe compromissos, fornecedores e vencimentos">
      <div className="page-toolbar">
        <div className="page-search">
          <Search size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar por descrição, fornecedor ou categoria..." />
          {search && <button onClick={() => setSearch("")} aria-label="Limpar pesquisa"><X size={16} /></button>}
        </div>
        <button className="btn page-primary-action" onClick={() => setOpen(true)}><Plus size={18} /> Nova conta</button>
      </div>

      <Modal open={open} title="Nova conta a pagar" onClose={() => setOpen(false)}>
        <form className="panel form" onSubmit={add}>
          <div className="field"><label>Descrição</label><input value={f.description} onChange={(e) => setF({...f,description:e.target.value})} required autoFocus /></div>
          <div className="field"><label>Fornecedor</label><input value={f.supplier} onChange={(e) => setF({...f,supplier:e.target.value})} /></div>
          <div className="field"><label>Valor</label><input type="number" step="0.01" value={f.amount} onChange={(e) => setF({...f,amount:e.target.value})} required /></div>
          <div className="field"><label>Vencimento</label><input type="date" value={f.dueDate} onChange={(e) => setF({...f,dueDate:e.target.value})} required /></div>
          <div className="field"><label>Categoria</label><select value={f.categoryId} onChange={(e) => setF({...f,categoryId:e.target.value})} required><option value="">Selecione</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="field"><label>Observações</label><input value={f.notes} onChange={(e) => setF({...f,notes:e.target.value})} /></div>
          <div className="full actions"><button type="button" className="btn secondary" onClick={() => setOpen(false)}>Cancelar</button><button className="btn">Cadastrar conta</button></div>
        </form>
      </Modal>

      <div className="panel data-panel">
        <div className="panel-heading">
          <div><span className="eyebrow">Financeiro</span><h2>Contas cadastradas</h2></div>
          <span className="badge">{filtered.length} {filtered.length === 1 ? "conta" : "contas"}</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Descrição</th><th>Fornecedor</th><th>Categoria</th><th>Vencimento</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((x) => <tr key={x.id}><td>{x.description}</td><td>{x.supplier || "-"}</td><td>{x.category?.name}</td><td>{new Date(x.dueDate).toLocaleDateString("pt-BR")}</td><td>{Number(x.amount).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td><td><span className="badge">{x.status}</span></td></tr>)}
              {!filtered.length && <tr><td colSpan={6}><div className="empty-state">{search ? "Nenhuma conta encontrada para esta pesquisa." : "Nenhuma conta a pagar cadastrada."}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
