import React, { useState, useEffect } from 'react';
import { ShieldCheck, History, BarChart3, Clock } from 'lucide-react';
import { MOCK_AUDIT } from '../../utils/mockData';

const AuditPanel = () => {
  const [auditData, setAuditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/audit/metrics', {
      headers: { 'X-API-Key': import.meta.env.VITE_NEXUS_API_KEY || 'nexus_dev_2026' }
    })
      .then(res => res.json())
      .then(data => {
        setAuditData(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("⚠️ Usando auditoria mockada");
        setAuditData(MOCK_AUDIT);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: '#636366' }}>Carregando trilha de auditoria...</div>;

  return (
    <div className="audit-panel">
      <div className="audit-grid">
        {/* Métricas de Acurácia */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="nexus-icon-framed active">
              <ShieldCheck size={18} className="nexus-icon nexus-icon-bicolor nexus-icon-active" />
            </div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Acurácia dos Modelos</h3>
          </div>

          <div className="eval-list">
            {auditData?.evaluations?.length > 0 ? (
              auditData.evaluations.map((ev: any) => (
                <div key={ev.id} className="eval-item">
                  <div className="eval-info">
                    <span className="uf-label">UF {ev.uf}</span>
                    <span className="ncm-label">NCM {ev.ncm}</span>
                  </div>
                  <div className="eval-metrics">
                    <div className="metric">
                      <label>RMSE</label>
                      <span>{ev.rmse.toFixed(4)}</span>
                    </div>
                    <div className="metric">
                      <label>MAE</label>
                      <span>{ev.mae.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-msg">Nenhuma avaliação registrada ainda.</p>
            )}
          </div>
        </div>

        {/* Estatísticas Gerais */}
        <div className="card">
          <div className="card-header">
            <h3><BarChart3 size={18} /> Estatísticas Nexus</h3>
          </div>
          <div className="stats-row">
            <div className="stat-box">
              <label>Total de Inferências</label>
              <div className="value">{auditData?.total_inferences || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Recentes */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="nexus-icon-framed">
            <History size={18} className="nexus-icon nexus-icon-bicolor" />
          </div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Logs de Inferência Recentes</h3>
        </div>
        <div className="logs-table-wrapper">
          <table className="logs-table">
            <thead>
              <tr>
                <th><Clock size={14} /> Timestamp</th>
                <th>UF</th>
                <th>NCM</th>
                <th>Vol. Mult</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {auditData?.recent_logs?.map((log: any) => (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.uf}</td>
                  <td>{log.ncm}</td>
                  <td>{log.vol_mult}x</td>
                  <td><span className="status-badge">Sucesso</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .audit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .eval-list { display: flex; flex-direction: column; gap: 1rem; }
        .eval-item { background: #1C1C1E; padding: 1rem; border-radius: 12px; border: 1px solid #3A3A3C; }
        .eval-info { display: flex; gap: 0.8rem; margin-bottom: 0.8rem; }
        .uf-label { background: var(--azul-nexus); color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
        .ncm-label { color: var(--muted); font-size: 0.7rem; font-weight: 700; }
        .eval-metrics { display: flex; gap: 2rem; }
        .metric label { display: block; font-size: 0.6rem; color: var(--muted); text-transform: uppercase; margin-bottom: 0.2rem; }
        .metric span { font-family: monospace; font-weight: 700; color: var(--verde-soja); }
        .stat-box label { font-size: 0.8rem; color: var(--muted); }
        .stat-box .value { font-size: 2.5rem; font-weight: 800; color: var(--verde-soja); }
        .empty-msg { color: var(--muted); font-size: 0.9rem; text-align: center; padding: 2rem; }
        .logs-table-wrapper { overflow-x: auto; }
        .logs-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .logs-table th { text-align: left; padding: 1rem; color: var(--muted); border-bottom: 1px solid #3A3A3C; text-transform: uppercase; font-size: 0.7rem; }
        .logs-table td { padding: 1rem; border-bottom: 1px solid #2C2C2E; color: var(--warm-white); }
        .status-badge { background: rgba(52, 168, 83, 0.1); color: var(--verde-soja); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
      `}</style>
    </div>
  );
};

export default AuditPanel;
