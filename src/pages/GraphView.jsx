import React, { useEffect, useRef, useState } from 'react';

export const GraphView = () => {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const [layers, setLayers] = useState({
    l0: true,
    l1: true,
    l2: true,
    l3: true
  });

  const [edgeTypes, setEdgeTypes] = useState({
    oferta: true,
    sinergia: true,
    mercado: true
  });

  useEffect(() => {
    fetch('/api/graph')
      .then((res) => res.json())
      .then((data) => {
        if (!containerRef.current || !window.cytoscape) return;

        const cy = window.cytoscape({
          container: containerRef.current,
          elements: [...data.nodes, ...data.edges],
          style: [
            {
              selector: 'node',
              style: {
                'label': 'data(label)',
                'font-family': 'Plus Jakarta Sans',
                'font-size': '11px',
                'font-weight': '600',
                'text-valign': 'bottom',
                'text-margin-y': 4,
                'color': '#1e293b'
              }
            },
            {
              selector: 'node[type="root"]',
              style: {
                'background-color': '#2563eb',
                'width': 54,
                'height': 54,
                'font-size': '13px',
                'font-weight': '800',
                'color': '#1d4ed8'
              }
            },
            {
              selector: 'node[type="vertical"]',
              style: {
                'background-color': 'data(color)',
                'width': 36,
                'height': 36,
                'shape': 'hexagon',
                'font-weight': '700'
              }
            },
            {
              selector: 'node[type="member"]',
              style: {
                'background-color': '#059669',
                'width': 26,
                'height': 26,
                'shape': 'ellipse'
              }
            },
            {
              selector: 'node[type="publico"]',
              style: {
                'background-color': '#7c3aed',
                'width': 30,
                'height': 30,
                'shape': 'round-rectangle'
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 2,
                'label': 'data(label)',
                'font-size': '9px',
                'color': '#64748b',
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'arrow-scale': 0.8
              }
            },
            {
              selector: 'edge[tipo="oferta"]',
              style: {
                'line-color': '#2563eb',
                'target-arrow-color': '#2563eb',
                'line-style': 'dashed'
              }
            },
            {
              selector: 'edge[tipo="sinergia"]',
              style: {
                'line-color': '#059669',
                'target-arrow-color': '#059669'
              }
            }
          ],
          layout: {
            name: 'cose',
            animate: false,
            padding: 30
          }
        });

        cy.on('tap', 'node', (evt) => {
          setSelectedNode(evt.target.data());
        });

        cyRef.current = cy;
      })
      .catch((err) => console.error('Erro ao carregar grafo:', err));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)' }}>Grafo de Conexões &amp; Sinergias</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
          Visualização interativa das verticais, membros do BNI PE JUNTOS, públicos compartilhados e ofertas de automação da KeyCore.
        </p>
      </div>

      <div className="grid g-2" style={{ gridTemplateColumns: selectedNode ? '1fr 300px' : '1fr' }}>
        <div className="card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap', fontSize: '0.8rem', fontWeight: 700 }}>
            <div>
              <i className="fa-solid fa-circle" style={{ color: '#2563eb', marginRight: '4px' }}></i> L0 KeyCore Hub
            </div>
            <div>
              <i className="fa-solid fa-hexagon" style={{ color: '#059669', marginRight: '4px' }}></i> L1 Verticais
            </div>
            <div>
              <i className="fa-solid fa-circle" style={{ color: '#059669', marginRight: '4px' }}></i> L2 Membros BNI
            </div>
            <div>
              <i className="fa-solid fa-square" style={{ color: '#7c3aed', marginRight: '4px' }}></i> L3 Públicos Alvo
            </div>
            <div style={{ marginLeft: 'auto', fontStyle: 'italic', color: 'var(--slate-400)', fontWeight: 500 }}>
              Clique em qualquer nó para ver detalhes.
            </div>
          </div>

          <div ref={containerRef} id="cy-container"></div>
        </div>

        {selectedNode && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="pill" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  {selectedNode.type || 'Nó'}
                </span>
                <button className="menu-toggle" onClick={() => setSelectedNode(null)}><i className="fa-solid fa-xmark"></i></button>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
                {selectedNode.label}
              </h3>

              {selectedNode.fit && (
                <div style={{ marginBottom: '12px' }}>
                  <span className="badge badge-emerald">Fit KeyCore: {selectedNode.fit}</span>
                </div>
              )}

              {selectedNode.parent && (
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '8px' }}>
                  <strong>Vertical:</strong> {selectedNode.parent}
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', borderTop: '1px solid var(--slate-100)', paddingTop: '8px' }}>
              Conexão ativa no grafo do BNI PE JUNTOS.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
