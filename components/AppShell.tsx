import { Sidebar } from "./Sidebar";
import Link from "next/link";

export function AppShell({children,title,description}:{children:React.ReactNode,title:string,description?:string}){
  return <div className="layout">
    <Sidebar/>
    <main className="content">
      <div className="mobile-top"><strong>Domus</strong><Link href="/dashboard">Menu</Link></div>
      <div className="topbar"><div><h1 className="page-title">{title}</h1>{description&&<div className="muted">{description}</div>}</div></div>
      {children}
    </main>
  </div>
}