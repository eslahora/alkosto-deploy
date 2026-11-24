/* ============================================================
   Checkout — lógica (reproducción de estudio)
   - Lee el carrito de localStorage (o usa el producto por defecto).
   - Valida el formulario de envío.
   - Arma el mensaje y abre WhatsApp (compras por 300 781 2632).
   - Forma de pago Breve B: 301 781 4702.
   ============================================================ */
(function () {
  "use strict";

  const PRODUCT_DEFAULT = {
    id: "7705946477086",
    name: 'TV KALLEY 65" Pulgadas 164 cm 65G315 4K-UHD MAX LED Smart TV Google',
    price: 1229970,
    basePrice: 4099900,
    discount: 70,
    image: "https://i.ibb.co/BKPTZ8j0/w-1200-h-1200-fit-pad.webp",
    maxQty: 3,
  };

  const BREVE_B_NUMBER = "301 781 4702";
  const WHATSAPP_NUMBER = "573007812632"; // 300 781 2632
  const WHATSAPP_DISPLAY = "300 781 2632";

  const cop = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  /* ---------- Cargar item del carrito ---------- */
  function loadItem() {
    try {
      const raw = localStorage.getItem("alkosto_cart");
      if (raw) {
        const cart = JSON.parse(raw);
        const it = cart.items && cart.items[0];
        if (it && it.id) return Object.assign({}, PRODUCT_DEFAULT, it);
      }
    } catch (e) { /* ignora y usa default */ }
    return Object.assign({}, PRODUCT_DEFAULT, { qty: 1 });
  }

  let item = loadItem();
  let selectedWallet = null;

  /* ---------- Render del resumen ---------- */
  function renderSummary() {
    const img = $("#osImg");
    const name = $("#osName");
    const unit = $("#osUnit");
    const qtyInput = $("#osQty");
    if (img) img.src = item.image;
    if (name) name.textContent = item.name;
    if (unit) unit.textContent = cop.format(item.price);
    if (qtyInput) { qtyInput.value = item.qty; qtyInput.max = item.maxQty; }
    updateTotals();
  }

  function currentQty() {
    const q = parseInt($("#osQty")?.value || "1", 10);
    return Math.max(1, Math.min(item.maxQty, q));
  }

  function updateTotals() {
    const qty = currentQty();
    const sub = item.price * qty;
    const subEl = $("#osSubtotal");
    const totalEl = $("#osTotal");
    const qtyEl = $("#osQty");
    if (subEl) subEl.textContent = cop.format(sub);
    if (totalEl) totalEl.textContent = cop.format(sub); // envío gratis
    if (qtyEl) qtyEl.value = qty;
  }

  function initQty() {
    const minus = $("#osMinus");
    const plus = $("#osPlus");
    const input = $("#osQty");
    if (!input) return;
    const set = (v) => { input.value = Math.max(1, Math.min(item.maxQty, parseInt(v, 10) || 1)); updateTotals(); };
    minus.addEventListener("click", () => set(parseInt(input.value, 10) - 1));
    plus.addEventListener("click", () => set(parseInt(input.value, 10) + 1));
    input.addEventListener("change", () => set(input.value));
  }

  /* ---------- Billeteras digitales (pago con Bre-B) ---------- */
  function initWallets() {
    const copyBtn = $("#payCopy");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        let copied = false;
        try { await navigator.clipboard.writeText(BREVE_B_NUMBER); copied = true; } catch (e) {}
        copyBtn.textContent = copied ? "¡Copiado!" : BREVE_B_NUMBER;
        setTimeout(() => { copyBtn.textContent = "Copiar"; }, 1600);
      });
    }

    $all(".wallet").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedWallet = btn.dataset.wallet;
        $all(".wallet").forEach((w) => w.classList.remove("active"));
        btn.classList.add("active");

        const inst = $("#walletInstruction");
        if (inst) inst.hidden = false;
        const nameEl = $("#walletName");
        if (nameEl) nameEl.textContent = selectedWallet;

        const link = $("#walletLink");
        const linkName = $("#walletLinkName");
        if (link) link.href = btn.dataset.url || "#";
        if (linkName) linkName.textContent = selectedWallet;
      });
    });
  }

  /* ---------- Mensaje de WhatsApp ---------- */
  function buildMessage() {
    const f = (id) => ($("#" + id)?.value || "").trim();
    const payLabel = "Bre-B" + (selectedWallet ? " · Billetera " + selectedWallet : "") + " — Llave " + BREVE_B_NUMBER;
    const qty = currentQty();
    const total = item.price * qty;

    const lines = [
      "🛒 *NUEVO PEDIDO — Black Friday*",
      "",
      "*Producto:* " + item.name,
      "*Cantidad:* " + qty,
      "*Precio unitario:* " + cop.format(item.price),
      "*Total:* " + cop.format(total) + " (envío gratis)",
      "",
      "*Datos de envío*",
      "• Nombre: " + f("fNombre") + " " + f("fApellido"),
      "• Email: " + f("fEmail"),
      "• Teléfono: " + f("fTelefono"),
      "• Departamento: " + f("fDepartamento"),
      "• Ciudad: " + f("fCiudad"),
      "• Dirección: " + f("fDireccion"),
      "• Barrio: " + (f("fBarrio") || "-"),
      "• Notas: " + (f("fNotas") || "-"),
      "",
      "*Forma de pago:* " + payLabel,
      "",
      "Gracias por tu compra ✅",
    ];
    return lines.join("\n");
  }

  /* ---------- Validación ---------- */
  function validate() {
    const required = ["fNombre", "fApellido", "fEmail", "fTelefono", "fDepartamento", "fCiudad", "fDireccion"];
    let ok = true;
    required.forEach((id) => {
      const el = $("#" + id);
      if (!el) return;
      const bad = !el.value.trim();
      el.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    const email = $("#fEmail");
    if (email && email.value.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
      email.classList.add("invalid");
      ok = false;
    }
    return ok;
  }

  function onSubmit(e) {
    e.preventDefault();
    const err = $("#formError");
    if (!validate()) {
      if (err) { err.hidden = false; err.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }
    if (err) err.hidden = true;
    const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(buildMessage());
    window.location.href = url;
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderSummary();
    initQty();
    const form = $("#checkoutForm");
    if (form) form.addEventListener("submit", onSubmit);

    // limpia el estado de error al corregir
    $all("#checkoutForm input, #checkoutForm select, #checkoutForm textarea").forEach((el) => {
      el.addEventListener("input", () => el.classList.remove("invalid"));
    });

    // forma de pago: Bre-B con billeteras digitales
    initWallets();
  });
})();
