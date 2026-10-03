import React, { useEffect, useRef, useState } from 'react';

export const GraphView = () => {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

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
    recomendacao: true,
    vertical: true
  });

  const [rawGraphData, setRawGraphData] = useState(null);

  const renderGraph = (data) => {
    if (!containerRef.current || !window.cytoscape) return;

    // Filter edges based on edgeTypes state
    const filteredEdges = data.edges.filter((e) => {
      const tipo = e.data.tipo;
      if (tipo === 'reuniao' && !edgeTypes.reuniao) return false;
      if (tipo === 'oferta' && !edgeTypes.oferta) return false;
      if (tipo === 'sinergia' && !edgeTypes.sinergia) return false;
      if (tipo === 'vertical' && !edgeTypes.vertical) return false;
      return true;
    });

    const cy = window.cytoscape({
      container: containerRef.current,
      elements: [...data.nodes, ...filteredEdges],
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'font-family': 'Plus Jakarta Sans, sans-serif',
            'font-size': '11px',
            'font-weight': '600',
            'text-valign': 'bottom',
            'text-margin-y': 5,
            'color': '#0f172a',
            'text-outline-color': '#ffffff',
            'text-outline-width': 2
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
            'background-color': '#f8fafc',
            'border-color': 'data(color)',
            'border-width': 2,
            'shape': 'round-rectangle',
            'font-weight': '700'
          }
        },
        {
          selector: 'node[type="member"]',
          style: {
            'background-color': '#059669',
            'width': 28,
            'height': 28,
            'shape': 'ellipse'
          }
        },
        {
          selector: 'node[type="publico"]',
          style: {
            'background-color': '#7c3aed',
            'width': 28,
            'height': 28,
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'label': 'data(label)',
            'font-family': 'Plus Jakarta Sans, sans-serif',
            'font-size': '9px',
            'color': '#475569',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 0.8,
            'text-background-color': '#ffffff',
            'text-background-opacity': 0.85,
            'text-background-padding': '2px'
          }
        },
        {
          selector: 'edge[tipo="oferta"]',
          style: {
            'line-color': '#93c5fd',
            'target-arrow-color': '#3b82f6',
            'line-style': 'dashed',
            'opacity': 0.6
          }
        },
        {
          selector: 'edge[tipo="sinergia"]',
          style: {
            'line-color': '#10b981',
            'target-arrow-color': '#059669',
            'width': 2.5
          }
        },
        {
          selector: 'edge[tipo="recomendacao"]',
          style: {
            'line-color': '#7c3aed',
            'target-arrow-color': '#7c3aed',
            'width': 3.5,
            'line-style': 'dashed',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 1.3,
            'font-size': '10px',
            'font-weight': '700',
            'color': '#6d28d9',
            'text-background-color': '#f5f3ff',
            'text-background-opacity': 1,
            'text-background-padding': '3px',
            'z-index': 990
          }
        },
        {
          selector: 'edge[tipo="reuniao"]',
          style: {
            'line-color': '#d97706',
            'target-arrow-color': '#d97706',
            'width': 5,
            'line-style': 'solid',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 1.4,
            'font-size': '11px',
            'font-weight': '800',
            'color': '#b45309',
            'text-background-color': '#fef3c7',
            'text-background-opacity': 1,
            'text-background-padding': '4px',
            'z-index': 999
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: false,
        padding: 40,
        nodeRepulsion: 8000
      }
    });

    cy.on('tap', 'node', (evt) => {
      setSelectedNode(evt.target.data());
      setSelectedEdge(null);
    });

    cy.on('tap', 'edge', (evt) => {
      setSelectedEdge(evt.target.data());
      setSelectedNode(null);
    });

    cyRef.current = cy;
  };

  useEffect(() => {
    fetch('/api/graph')
      .then((res) => res.json())
      .then((data) => {
        setRawGraphData(data);
        renderGraph(data);
      })
      .catch((err) => console.error('Erro ao carregar grafo:', err));
  }, []);

  useEffect(() => {
    if (rawGraphData) {
      renderGraph(rawGraphData);
    }
  }, [edgeTypes, layers]);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <span className="pill" style={{ background: 'var(--amber-50)', color: 'var(--amber-700)', marginBottom: '6px' }}>
          <i className="fa-solid fa-diagram-project"></i> Mapeamento de Relacionamentos
        </span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '4px' }}>
          Grafo Interativo de Conexões &amp; Indicações
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
          Visualize o fluxo de indicações, reuniões 1-2-1 marcadas (linha destacada em dourado), sinergias e automações KeyCore.
        </p>
      </div>

      {/* Responsive layout container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Controls Bar */}
        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <strong style={{ color: 'var(--slate-900)' }}>Filtro de Arestas:</strong>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: 'var(--amber-50)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--amber-200)', fontWeight: 700, color: 'var(--amber-800)' }}>
                <input
                  type="checkbox"
                  checked={edgeTypes.reuniao}
                  onChange={(e) => setEdgeTypes({ ...edgeTypes, reuniao: e.target.checked })}
                />
                📅 Reuniões &amp; Indicações (Dourado)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={edgeTypes.sinergia}
                  onChange={(e) => setEdgeTypes({ ...edgeTypes, sinergia: e.target.checked })}
                />
                🤝 Sinergias (Verde)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={edgeTypes.oferta}
                  onChange={(e) => setEdgeTypes({ ...edgeTypes, oferta: e.target.checked })}
                />
                ⚡ Automações KeyCore (Azul)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: 'var(--violet-50)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--violet-200)', fontWeight: 700, color: 'var(--violet-800)' }}>
                <input
                  type="checkbox"
                  checked={edgeTypes.recomendacao}
                  onChange={(e) => setEdgeTypes({ ...edgeTypes, recomendacao: e.target.checked })}
                />
                💡 Recomendações KeyCore (Roxo)
              </label>
            </div>

            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => {
                if (cyRef.current) cyRef.current.fit();
              }}
            >
              <i className="fa-solid fa-expand"></i> Centralizar Grafo
            </button>
          </div>
        </div>

        {/* Main Graph Canvas and Sidebar Inspector */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedNode || selectedEdge ? '1fr minmax(280px, 320px)' : '1fr', gap: '16px' }}>
          <div id="cy-container" ref={containerRef} style={{ width: '100%', height: '520px', borderRadius: '14px' }}></div>

          {/* Inspector Panel */}
          {(selectedNode || selectedEdge) && (
            <div className="card" style={{ height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-amber">
                  {selectedNode ? 'Detalhes do Nó' : 'Detalhes da Conexão'}
                </span>
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    setSelectedEdge(null);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {selectedNode && (
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>{selectedNode.label}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '4px' }}>
                    Tipo: <strong>{selectedNode.type}</strong>
                  </div>
                  {selectedNode.fit && (
                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--emerald-600)', fontWeight: 700 }}>
                      Fit BNI: {selectedNode.fit}
                    </div>
                  )}
                </div>
              )}

              {selectedEdge && (
                <div>
                  <span className="pill" style={{ marginBottom: '8px', fontSize: '0.75rem' }}>
                    {selectedEdge.tipo.toUpperCase()}
                  </span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {selectedEdge.label}
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '8px' }}>
                    Origem: <strong>{selectedEdge.source}</strong> &rarr; Destino: <strong>{selectedEdge.target}</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
