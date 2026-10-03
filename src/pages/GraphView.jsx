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
    reuniao: true,
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
            },
            {
              selector: 'edge[tipo="reuniao"]',
              style: {
                'line-color': '#d97706',
                'target-arrow-color': '#d97706',
                'width': 4,
                'line-style': 'solid'
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
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)' }}>Grafo Interativo de Conexões &amp; Indicações</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
          Visualização multidimensional de nós: KeyCore (Hub), Verticais, Membros, Indicações de Reuniões 1-2-1 e Públicos-Alvo.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedNode ? '1fr 300px' : '1fr', gap: '20px' }}>
        <div>
          {/* Controls Bar */}
          <div className="card" style={{ padding: '12px 16px', marginBottom: '16px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <strong>Camadas:</strong>
              <label><input type="checkbox" checked={layers.l0} onChange={(e) => setLayers({ ...layers, l0: e.target.checked })} /> KeyCore</label>
              <label><input type="checkbox" checked={layers.l1} onChange={(e) => setLayers({ ...layers, l1: e.target.checked })} /> Verticais</label>
              <label><input type="checkbox" checked={layers.l2} onChange={(e) => setLayers({ ...layers, l2: e.target.checked })} /> Membros</label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <strong>Arestas:</strong>
              <label><input type="checkbox" checked={edgeTypes.oferta} onChange={(e) => setEdgeTypes({ ...edgeTypes, oferta: e.target.checked })} /> Automações</label>
              <label><input type="checkbox" checked={edgeTypes.sinergia} onChange={(e) => setEdgeTypes({ ...edgeTypes, sinergia: e.target.checked })} /> Sinergias</label>
              <label><input type="checkbox" checked={edgeTypes.reuniao} onChange={(e) => setEdgeTypes({ ...edgeTypes, reuniao: e.target.checked })} /> Reuniões/Indicações</label>
            </div>
          </div>

          <div id="cy-container" ref={containerRef}></div>
        </div>

        {/* Node Detail Drawer */}
        {selectedNode && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="badge badge-blue">{selectedNode.type}</span>
              <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>{selectedNode.label}</h3>
            {selectedNode.fit && (
              <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--emerald-600)', fontWeight: 700 }}>
                Fit BNI: {selectedNode.fit}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
