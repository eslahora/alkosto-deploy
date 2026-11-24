/* ============================================================
   Panel administrador — lógica (reproducción de estudio)
   - Login (admin / alkosto2026).
   - Dashboard con WhatsApp (300 781 2632) y llave Bre-B (301 781 4702).
   - Pedidos guardados en localStorage (mismo navegador).
   ============================================================ */
(function () {
  "use strict";

  const CREDS = { user: "admin", pass: "alkosto2026" };
  const WHATSAPP_NUMBER = "573007812632";
  const BREVE_B_NUMBER = "301 781 4702";

  const cop = new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", minimumFractionDigits: 0,
  });

  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.from((r || document).querySelectorAll(s)); }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function waLink(phone) {
    let d = String(phone || "").replace(/\D/g, "");
    if (!d.startsWith("57")) d = "57" + d;
    return "https://wa.me/" + d;
  }

  function loadOrders() {
    try { return JSON.parse(localStorage.getItem("alkosto_orders") || "[]"); }
    catch (e) { return []; }
  }

  function renderOrders() {
    const list = $("#ordersList");
    if (!list) return;
    const orders = loadOrders();
    if (!orders.length) {
      list.innerHTML = '<div class="orders__empty">Aún no hay pedidos registrados en este navegador.<br/>Cuando un cliente complete la compra en este equipo, aparecerán aquí.</div>';
      return;
    }
    list.innerHTML = orders.map((o) => `
      <div class="order">
        <div class="order__head">
          <span class="order__id">${esc(o.id)}</span>
          <span class="order__date">${new Date(o.date).toLocaleString("es-CO")}</span>
        </div>
        <div class="order__body">
          <div class="order__main">
            <p class="order__product">${esc(o.product)}</p>
            <p class="order__meta">Cantidad ${o.qty} · ${cop.format(o.total)} · Billetera: ${esc(o.wallet || "Bre-B")}</p>
          </div>
          <div class="order__customer">
            <p><strong>${esc(o.name)}</strong></p>
            <p>${esc(o.phone)} · ${esc(o.email)}</p>
            <p>${esc(o.address)}, ${esc(o.city)} (${esc(o.dept)})${o.barrio && o.barrio !== "-" ? " · Barrio " + esc(o.barrio) : ""}</p>
            ${o.notas && o.notas !== "-" ? "<p>Notas: " + esc(o.notas) + "</p>" : ""}
          </div>
        </div>
        <div class="order__actions">
          <a class="btn-primary btn-sm" href="${waLink(o.phone)}" target="_blank" rel="noopener">Contactar cliente</a>
          <a class="btn-ghost btn-sm" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener">Abrir ventas</a>
        </div>
      </div>
    `).join("");
  }

  function showDashboard() {
    const login = $("#loginScreen");
    const dash = $("#dashboard");
    if (login) login.hidden = true;
    if (dash) dash.hidden = false;
    renderOrders();
  }

  function initLogin() {
    const form = $("#loginForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const u = $("#loginUser").value.trim();
      const p = $("#loginPass").value;
      if (u === CREDS.user && p === CREDS.pass) {
        sessionStorage.setItem("alkosto_admin", "1");
        showDashboard();
      } else {
        $("#loginError").hidden = false;
      }
    });
  }

  function initLogout() {
    $("#logoutBtn")?.addEventListener("click", () => {
      sessionStorage.removeItem("alkosto_admin");
      location.reload();
    });
  }

  function initCopy() {
    $("#copyKey")?.addEventListener("click", async () => {
      const b = $("#copyKey");
      try { await navigator.clipboard.writeText(BREVE_B_NUMBER); b.textContent = "¡Copiado!"; }
      catch (e) { b.textContent = BREVE_B_NUMBER; }
      setTimeout(() => { b.textContent = "Copiar llave"; }, 1500);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLogin();
    initLogout();
    initCopy();
    $("#refreshBtn")?.addEventListener("click", renderOrders);
    if (sessionStorage.getItem("alkosto_admin") === "1") showDashboard();
  });
})();
