import { useState, useEffect } from 'react';

export default function Estado() {
  const [uptime, setUptime] = useState(99.99);
  const [version, setVersion] = useState("v0.2.0");

  const services = [
    { name: "Supabase Database", status: "operational" },
    { name: "Edge Function: create-checkout", status: "operational" },
    { name: "Edge Function: validate-download", status: "operational" },
    { name: "Edge Function: mercadopago-webhook", status: "operational" },
    { name: "Edge Function: activate-license", status: "operational" },
    { name: "VoxPub Registry API", status: "operational" }
  ];

  const incidents = [
    { date: "2026-03-25", title: "Mantenimiento programado de VoxPub", status: "Resolved" },
    { date: "2026-02-14", title: "Latencia en Edge functions (Vercel/Deno)", status: "Resolved" }
  ];

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", color: "white" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Estado del Sistema Vox</h1>
      <p style={{ color: "#a1a1aa", marginBottom: "32px" }}>Monitoreo en tiempo real de la infraestructura</p>
      
      <div style={{ background: "#064e3b", padding: "24px", borderRadius: "12px", border: "1px solid #10b981", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", color: "#34d399", margin: "0 0 16px 0" }}>Todos los sistemas operativos</h2>
        <p style={{ margin: 0 }}>Uptime global: <strong>{uptime}%</strong></p>
        <p style={{ margin: "8px 0" }}>Versión de Vox SDK actual: <strong>{version}</strong></p>
      </div>

      <h3 style={{ borderBottom: "1px solid #3f3f46", paddingBottom: "8px", marginBottom: "16px" }}>Servicios (Componentes Clave)</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
        {services.map((svc, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", background: "#18181b", padding: "16px", borderRadius: "8px" }}>
            <span>{svc.name}</span>
            <span style={{ color: "#34d399", fontWeight: "bold" }}>Operativo</span>
          </div>
        ))}
      </div>

      <h3 style={{ borderBottom: "1px solid #3f3f46", paddingBottom: "8px", marginBottom: "16px" }}>Historial de Incidentes</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {incidents.map((inc, i) => (
          <div key={i} style={{ background: "#18181b", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
            <div style={{ fontSize: "14px", color: "#a1a1aa", marginBottom: "4px" }}>{inc.date}</div>
            <div style={{ fontSize: "16px", fontWeight: "600" }}>{inc.title} - <span style={{ color: "#10b981", fontSize: "14px" }}>Resuelto</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
