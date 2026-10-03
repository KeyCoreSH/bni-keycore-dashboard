/* ============================================================
   Shell compartilhado: sidebar navegável (multi-página),
   topbar mobile, overlay. Mobile-first.
   ============================================================ */

const NAV_ITEMS = [
  { href: "index.html",      icon: "fa-compass",          label: "Visão Geral",        crumb: "Panorama do grupo e da tese" },
  { href: "grupo.html",      icon: "fa-people-group",     label: "O Grupo BNI Juntos", crumb: "Método, filosofia e estrutura" },
  { href: "membros.html",    icon: "fa-users-viewfinder", label: "Membros & Perfis",   crumb: "16 cadeiras mapeadas" },
  { href: "grafo.html",      icon: "fa-diagram-project",  label: "Grafo de Relações",  crumb: "Rede interativa de conexões" },
  { href: "fit.html",        icon: "fa-list-check",       label: "Matriz de Fit",      crumb: "Gargalos e ofertas por empresa" },
  { href: "oportunidades.html", icon: "fa-bullseye",      label: "Oportunidades",      crumb: "Go-to-market e próximos passos" }
];

function currentPage() {
  const p = location.pathname.split("/").pop();
  return p && p.length ? p : "index.html";
}

function renderShell() {
  const page = currentPage();
  const navLinks = NAV_ITEMS.map(it => {
    const active = it.href === page ? " active" : "";
    return `<a href="${it.href}" class="nav-link${active}">
      <i class="fa-solid ${it.icon}"></i><span>${it.label}</span>
    </a>`;
  }).join("");

  const active = NAV_ITEMS.find(i => i.href === page) || NAV_ITEMS[0];

  const sidebar = `
  <aside class="sidebar" id="sidebar" aria-label="Menu principal">
    <div class="sidebar-brand">
      <div class="brand-mark">K</div>
      <div>
        <div class="brand-name">KeyCore Tech Hub</div>
        <div class="brand-sub">bni.keycore.com.br</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-label">Navegação</div>
      ${navLinks}
      <div class="nav-label">Grupo</div>
      <a href="grupo.html#metodo" class="nav-link"><i class="fa-solid fa-seedling"></i><span>Givers Gain</span></a>
      <a href="grupo.html#estrutura" class="nav-link"><i class="fa-solid fa-sitemap"></i><span>Estrutura &amp; cargos</span></a>
      <a href="grafo.html" class="nav-link"><i class="fa-solid fa-share-nodes"></i><span>Rede de conexões</span></a>
    </nav>
    <div class="sidebar-foot">
      <strong>BNI JUNTOS · Recife/PE</strong>
      Grupo em formação — 12ª reunião<br>
      KeyCore Tech Hub · CNPJ 42.231.277/0001-75
    </div>
  </aside>`;

  const topbar = `
  <header class="topbar">
    <button class="hamburger" id="menuBtn" aria-label="Abrir menu" aria-expanded="false">
      <i class="fa-solid fa-bars"></i>
    </button>
    <div>
      <h1>${active.label}</h1>
      <span class="crumb">${active.crumb}</span>
    </div>
  </header>`;

  const overlay = `<div class="overlay" id="overlay"></div>`;
  const mount = document.getElementById("shell");
  mount.insertAdjacentHTML("afterbegin", sidebar + overlay + topbar);

  // interações do menu
  const sb = document.getElementById("sidebar");
  const ov = document.getElementById("overlay");
  const btn = document.getElementById("menuBtn");
  const close = () => { sb.classList.remove("open"); ov.classList.remove("show"); btn && btn.setAttribute("aria-expanded","false"); };
  const open  = () => { sb.classList.add("open");    ov.classList.add("show");    btn && btn.setAttribute("aria-expanded","true"); };
  btn && btn.addEventListener("click", () => sb.classList.contains("open") ? close() : open());
  ov.addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  window.addEventListener("resize", () => { if (window.innerWidth >= 1024) close(); });

  // botão imprimir
  const printBtn = document.getElementById("printBtn");
  printBtn && printBtn.addEventListener("click", () => window.print());
}

document.addEventListener("DOMContentLoaded", renderShell);
