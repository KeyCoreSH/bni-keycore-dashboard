/* ============================================================
   Grafo de relações — Cytoscape.js
   Camadas:
     L0 KeyCore (root)
     L1 Verticais (nós compostos / clusters)
     L2 Membros BNI (16)
     L3 Públicos & Ofertas conjuntas (mercado)
   Arestas: oferta, sinergia, referência, atende, mercado
   ============================================================ */

const CYTOSCAPE_CDN = "https://cdn.jsdelivr.net/npm/cytoscape@3.30.2/dist/cytoscape.min.js";

/* Paleta por vertical */
const V_COR = {
  juridico:   { bg: "#2563eb", bd: "#1d4ed8", soft: "#eff6ff", txt: "#1e3a8a" },
  contabil:   { bg: "#059669", bd: "#047857", soft: "#ecfdf5", txt: "#065f46" },
  marketing:  { bg: "#7c3aed", bd: "#6d28d9", soft: "#f5f3ff", txt: "#5b21b6" },
  saude_sst:  { bg: "#d97706", bd: "#b45309", soft: "#fffbeb", txt: "#92400e" },
  engenharia: { bg: "#0891b2", bd: "#0e7490", soft: "#ecfeff", txt: "#155e75" }
};

/* Públicos-alvo compartilhados (L3) — inferidos dos pitches da reunião */
const PUBLICOS = [
  { id: "P1", nome: "PMEs e empresas locais",            desc: "Público comum de contábil, BPO e consultoria de gestão." },
  { id: "P2", nome: "Famílias e pessoas físicas",         desc: "Seguro de vida, plano de saúde e previdenciário." },
  { id: "P3", nome: "Empresas com risco ocupacional",     desc: "SST, NR-1, ergonomia e riscos psicossociais." },
  { id: "P4", nome: "Construtoras e reformas",            desc: "Arquitetura, obra e energia solar em conjunto." },
  { id: "P5", nome: "Empresas com demanda digital",       desc: "Tráfego pago, posicionamento e conversão comercial." },
  { id: "P6", nome: "Consumidores com relação de consumo",desc: "Saúde, bancário e revisão contratual." }
];

/* Mapa membro → público(s) atendido(s) */
const MEMBRO_PUBLICO = {
  "01": ["P2"], "02": ["P2"], "03": ["P6"], "04": ["P6", "P2"],
  "05": ["P3"], "06": ["P3"], "07": ["P1"], "08": ["P1"],
  "09": ["P1"], "10": ["P5"], "11": ["P5"], "12": ["P1", "P3"],
  "13": ["P4"], "14": ["P4"], "15": ["P2"], "16": ["P3"]
};

function buildElements() {
  const els = [];

  /* L0 — KeyCore */
  els.push({ data: {
    id: "KEYCORE", label: "KeyCore Tech Hub", camada: 0,
    tipo: "keycore", subtitle: BNI_DATA.keycore.titulo,
    detalhe: BNI_DATA.keycore.especialidade,
    cnpj: BNI_DATA.keycore.cnpj
  }});

  /* L1 — Verticais (compostos) */
  BNI_DATA.verticais.forEach(v => {
    els.push({ data: { id: "V_" + v.id, label: v.nome, camada: 1, tipo: "vertical", verticalId: v.id, cor: v.cor } });
  });

  /* L2 — Membros */
  BNI_DATA.membros.forEach(m => {
    els.push({
      data: {
        id: m.id, label: m.nome, camada: 2, tipo: "membro",
        parent: "V_" + m.vertical, verticalId: m.vertical,
        empresa: m.empresa, especialidade: m.especialidade,
        fit: m.fit, detalhe: m.dores, oferta: m.oferta_keycore,
        papel: m.papel_bni, whatsapp: m.whatsapp, telefone: m.telefone
      }
    });
  });

  /* L3 — Públicos */
  PUBLICOS.forEach(p => {
    els.push({ data: { id: p.id, label: p.nome, camada: 3, tipo: "publico", detalhe: p.desc } });
  });

  /* Arestas: KeyCore → membro (oferta) */
  BNI_DATA.conexoes.filter(c => c.from === "KEYCORE").forEach(c => {
    els.push({ data: { id: "e_" + c.from + "_" + c.to, source: c.from, target: c.to, tipo: "oferta", label: c.label } });
  });

  /* Arestas: membro ↔ membro (sinergia / referência) */
  BNI_DATA.conexoes.filter(c => c.from !== "KEYCORE").forEach(c => {
    els.push({ data: { id: "e_" + c.from + "_" + c.to + "_" + c.tipo, source: c.from, target: c.to, tipo: c.tipo, label: c.label } });
  });

  /* Arestas: membro → público */
  Object.entries(MEMBRO_PUBLICO).forEach(([mid, pubs]) => {
    pubs.forEach(pid => {
      els.push({ data: { id: "e_" + mid + "_" + pid, source: mid, target: pid, tipo: "atende", label: "" } });
    });
  });

  /* Arestas: vertical → público (mercado) */
  const vpMap = { P1: ["contabil"], P2: ["saude_sst", "juridico"], P3: ["saude_sst"], P4: ["engenharia"], P5: ["marketing"], P6: ["juridico"] };
  Object.entries(vpMap).forEach(([pid, vids]) => {
    vids.forEach(vid => {
      els.push({ data: { id: "ev_" + vid + "_" + pid, source: "V_" + vid, target: pid, tipo: "mercado", label: "" } });
    });
  });

  return els;
}

/* ---------- Estilos ---------- */
function cytoscapeStyle() {
  return [
    { selector: "node", style: {
      "background-color": "#ffffff",
      "border-width": 2,
      "border-color": "#cbd5e1",
      "label": "data(label)",
      "font-size": 10,
      "font-family": "'Plus Jakarta Sans', sans-serif",
      "font-weight": 700,
      "color": "#334155",
      "text-valign": "bottom",
      "text-margin-y": 5,
      "text-wrap": "wrap",
      "text-max-width": "96px",
      "width": 34, "height": 34,
      "transition-property": "background-color, border-color, width, height",
      "transition-duration": "160ms"
    }},

    /* L1 — verticais (compostos) */
    { selector: ":parent", style: {
      "background-color": "#f8fafc",
      "background-opacity": .85,
      "border-width": 1.5,
      "border-style": "dashed",
      "border-color": "#cbd5e1",
      "label": "data(label)",
      "text-valign": "top",
      "text-halign": "center",
      "font-size": 11,
      "font-weight": 800,
      "color": "#475569",
      "text-margin-y": -8,
      "padding": 16,
      "shape": "round-rectangle",
      "corner-radius": 14
    }},

    { selector: "node[camada = 0]", style: {
      "background-color": "#1e3a8a", "border-color": "#0f172a", "border-width": 3,
      "color": "#0f172a", "font-size": 13, "font-weight": 800, "width": 62, "height": 62,
      "text-valign": "bottom", "text-margin-y": 8
    }},
    { selector: "node[tipo = 'publico']", style: {
      "background-color": "#ffffff", "border-color": "#94a3b8", "border-style": "dashed",
      "border-width": 2, "shape": "diamond", "width": 44, "height": 44,
      "color": "#64748b", "font-size": 9.5, "font-weight": 600,
      "text-valign": "bottom", "text-margin-y": 4
    }},
    { selector: "node[tipo = 'membro']", style: {
      "background-color": "#ffffff", "border-width": 2.5, "width": 36, "height": 36
    }},

    /* cor por vertical */
    ...Object.values(V_COR).map(() => ({ selector: "node.__noop", style: {} })),
    ...BNI_DATA.verticais.flatMap(v => {
      const c = V_COR[v.id];
      return [
        { selector: `node[tipo = 'membro'][verticalId = '${v.id}']`, style: { "background-color": c.soft, "border-color": c.bg, "color": c.txt } },
        { selector: `node[tipo = 'vertical'][verticalId = '${v.id}']`, style: { "background-color": c.soft, "border-color": c.bg, "color": c.txt } }
      ];
    }),

    /* fit */
    { selector: "node[fit = 'Alto']", style: { "border-width": 3.5, "background-color": "#ecfdf5" } },
    { selector: "node[fit = 'Médio']", style: { "border-width": 2.5 } },

    /* arestas */
    { selector: "edge", style: {
      "width": 1.3, "curve-style": "bezier",
      "line-color": "#cbd5e1", "target-arrow-color": "#cbd5e1",
      "target-arrow-shape": "triangle", "arrow-scale": .8, "opacity": .85
    }},
    { selector: "edge[tipo = 'oferta']", style: { "line-color": "#2563eb", "target-arrow-color": "#2563eb", "width": 1.7, "line-style": "solid" } },
    { selector: "edge[tipo = 'sinergia']", style: { "line-color": "#7c3aed", "target-arrow-color": "#7c3aed", "width": 1.9, "line-style": "dashed", "curve-style": "bezier" } },
    { selector: "edge[tipo = 'referencia']", style: { "line-color": "#059669", "target-arrow-color": "#059669", "width": 3, "line-style": "solid" } },
    { selector: "edge[tipo = 'atende']", style: { "line-color": "#e2e8f0", "target-arrow-color": "#e2e8f0", "width": 1, "opacity": .7, "target-arrow-shape": "none" } },
    { selector: "edge[tipo = 'mercado']", style: { "line-color": "#f1f5f9", "width": 1, "opacity": .0, "target-arrow-shape": "none" } },

    /* estados */
    { selector: "node.dim", style: { "opacity": .18 } },
    { selector: "edge.dim", style: { "opacity": .06 } },
    { selector: "node.hl", style: { "border-color": "#0f172a", "border-width": 4, "width": 50, "height": 50, "z-index": 99 } },
    { selector: "edge.hl", style: { "width": 3.4, "opacity": 1, "z-index": 99 } },
    { selector: "node.sel", style: { "border-color": "#f59e0b", "border-width": 4 } }
  ];
}

/* ---------- Render ---------- */
let cy = null;

function initGraph() {
  const container = document.getElementById("cy");
  if (!container || typeof cytoscape === "undefined") return;

  cy = cytoscape({
    container,
    elements: buildElements(),
    style: cytoscapeStyle(),
    wheelSensitivity: .18,
    minZoom: .25,
    maxZoom: 3,
    layout: layoutOpts("cose"),
    boxSelectionEnabled: false
  });

  wireControls();
  wireSelection();
  setTimeout(() => cy.fit(undefined, 40), 350);
}

function layoutOpts(name) {
  if (name === "concentric") {
    return {
      name: "concentric", animate: true, animationDuration: 420, padding: 42,
      concentric: n => 3 - (n.data("camada") ?? 2),
      levelWidth: () => 1.15
    };
  }
  if (name === "breadthfirst") {
    return { name: "breadthfirst", animate: true, animationDuration: 420, padding: 40, directed: true, spacingFactor: 1.25 };
  }
  return {
    name: "cose", animate: true, animationDuration: 480, padding: 46,
    nodeRepulsion: 9000, idealEdgeLength: 95, edgeElasticity: 120,
    gravity: 0.32, numIter: 1200, randomize: true
  };
}

function wireControls() {
  document.querySelectorAll("[data-layout]").forEach(b => {
    b.addEventListener("click", () => {
      document.querySelectorAll("[data-layout]").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      cy.layout(layoutOpts(b.dataset.layout)).run();
    });
  });

  document.querySelectorAll("[data-filter]").forEach(b => {
    b.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      applyFilter(b.dataset.filter);
    });
  });

  const search = document.getElementById("graphSearch");
  search && search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    if (!q) { clearStates(); return; }
    cy.batch(() => {
      cy.elements().removeClass("dim hl");
      const hits = cy.nodes().filter(n =>
        (n.data("label") || "").toLowerCase().includes(q) ||
        (n.data("empresa") || "").toLowerCase().includes(q) ||
        (n.data("especialidade") || "").toLowerCase().includes(q)
      );
      if (!hits.length) { cy.elements().addClass("dim"); return; }
      cy.elements().addClass("dim");
      hits.removeClass("dim").addClass("hl");
      hits.connectedEdges().removeClass("dim").addClass("hl");
    });
  });

  document.getElementById("btnFit")?.addEventListener("click", () => cy.fit(undefined, 40));
}

function applyFilter(f) {
  cy.batch(() => {
    cy.elements().removeClass("dim hl");
    if (f === "all") return;
    if (f === "alto") {
      const keep = cy.nodes("[fit = 'Alto']");
      cy.elements().addClass("dim");
      keep.removeClass("dim").addClass("hl");
      keep.connectedEdges().removeClass("dim").addClass("hl");
      return;
    }
    if (f === "conexoes") {
      const keep = cy.edges("[tipo = 'sinergia'], [tipo = 'referencia']");
      cy.elements().addClass("dim");
      keep.removeClass("dim").addClass("hl");
      keep.connectedNodes().removeClass("dim").addClass("hl");
      return;
    }
    // filtro por vertical
    const keep = cy.nodes(`[verticalId = '${f}']`);
    cy.elements().addClass("dim");
    keep.removeClass("dim").addClass("hl");
    keep.connectedEdges().removeClass("dim").addClass("hl");
  });
}

function clearStates() {
  cy.batch(() => cy.elements().removeClass("dim hl sel"));
}

function wireSelection() {
  const panel = document.getElementById("detailPanel");

  cy.on("tap", "node", evt => {
    const n = evt.target;
    clearStates();
    n.addClass("sel");
    n.neighborhood().removeClass("dim").addClass("hl");
    cy.elements().not(n).not(n.neighborhood()).addClass("dim");
    renderDetail(panel, n);
    n.select();
  });

  cy.on("tap", "edge", evt => {
    const e = evt.target;
    clearStates();
    e.addClass("hl");
    e.connectedNodes().removeClass("dim");
    const label = e.data("label") || "Conexão direta";
    panel.innerHTML = `
      <h4><i class="fa-solid fa-link"></i> ${label}</h4>
      <div class="dp-sub">${e.source().data("label")} → ${e.target().data("label")}
      · <span class="badge badge-neutral">${e.data("tipo")}</span></div>`;
  });

  cy.on("tap", evt => {
    if (evt.target === cy) {
      clearStates();
      panel.innerHTML = `<h4>Rede interativa</h4>
        <div class="dp-sub">Clique em um nó para ver o perfil, as conexões e a oferta KeyCore sugerida.</div>`;
    }
  });
}

function renderDetail(panel, n) {
  const d = n.data();

  if (d.tipo === "keycore") {
    panel.innerHTML = `
      <h4><i class="fa-solid fa-building"></i> ${d.label}</h4>
      <div class="dp-sub">${d.subtitle} · CNPJ ${d.cnpj}</div>
      <dl>
        <dt>Atuação</dt><dd>${d.detalhe}</dd>
        <dt>Frentes</dt><dd>${BNI_DATA.keycore.frentes.join(" · ")}</dd>
      </dl>`;
    return;
  }

  if (d.tipo === "vertical") {
    const v = BNI_DATA.verticais.find(x => x.id === d.verticalId);
    const membros = BNI_DATA.membros.filter(m => m.vertical === d.verticalId);
    panel.innerHTML = `
      <h4><i class="fa-solid fa-layer-group"></i> ${v.nome}</h4>
      <div class="dp-sub">${membros.length} cadeira(s) nesta vertical</div>
      <dl><dt>Cadeiras ocupadas</dt><dd>${membros.map(m => m.nome).join(" · ")}</dd></dl>`;
    return;
  }

  if (d.tipo === "publico") {
    panel.innerHTML = `
      <h4><i class="fa-solid fa-bullseye"></i> ${d.label}</h4>
      <div class="dp-sub">${d.detalhe}</div>`;
    return;
  }

  // membro
  const sinergias = BNI_DATA.conexoes.filter(c =>
    (c.from === d.id || c.to === d.id) && c.to !== "KEYCORE" && c.from !== "KEYCORE"
  );
  const oferta = BNI_DATA.conexoes.find(c => c.from === "KEYCORE" && c.to === d.id);

  panel.innerHTML = `
    <h4>${d.label} <span class="badge ${d.fit === 'Alto' ? 'badge-alto' : d.fit === 'Médio' ? 'badge-medio' : 'badge-explor'}">Fit ${d.fit}</span></h4>
    <div class="dp-sub">${d.empresa} · ${d.especialidade}${d.papel ? ' · ' + d.papel : ''}</div>
    <dl>
      <dt>Gargalo identificado</dt><dd>${d.detalhe}</dd>
      ${oferta ? `<dt>Oferta de entrada KeyCore</dt><dd>${oferta.label}</dd>` : ""}
      ${sinergias.length ? `<dt>Conexões na rede</dt><dd>${sinergias.map(s => {
        const outroId = s.from === d.id ? s.to : s.from;
        const outro = BNI_DATA.membros.find(m => m.id === outroId);
        return `${outro ? outro.nome : outroId} (${s.tipo})`;
      }).join(" · ")}</dd>` : ""}
      ${d.whatsapp ? `<dt>Contato</dt><dd>${d.telefone}</dd>` : ""}
    </dl>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const y = document.createElement("script");
  y.src = CYTOSCAPE_CDN;
  y.onload = initGraph;
  y.onerror = () => {
    document.getElementById("cy").innerHTML =
      '<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><br>Não foi possível carregar a biblioteca do grafo.</div>';
  };
  document.head.appendChild(y);
});
