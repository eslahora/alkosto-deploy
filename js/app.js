/* ============================================================
   Interacciones de la reproducción de estudio (PDP estilo Alkosto)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Datos del producto (tomados de la página original) ---------- */
  const PRODUCT = {
    name: 'TV KALLEY 65" Pulgadas 164 cm 65G315 4K-UHD MAX LED Smart TV Google',
    sku: "7705946477086",
    price: 1229970,
    basePrice: 4099900,
    addiPrice: 1109970,
    discount: 70,
    maxQty: 3,
  };

  const IMAGES = [
    "https://i.ibb.co/BKPTZ8j0/w-1200-h-1200-fit-pad.webp",
    "https://i.ibb.co/5X4t7ZSf/w-1200-h-1200-fit-pad-6.webp",
    "https://i.ibb.co/gMz1FHjP/w-1200-h-1200-fit-pad-7.webp",
    "https://i.ibb.co/DgSVgPdk/w-1200-h-1200-fit-pad-10.webp",
    "https://i.ibb.co/Qjf4W3hn/w-1200-h-1200-fit-pad-11.webp",
  ];

  /* ---------- Helpers de formato de moneda (COP) ---------- */
  const cop = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  /* ---------- Galería ---------- */
  function initGallery() {
    const main = $("#galleryMain");
    const thumbs = $all(".gallery-thumbs button");
    if (!main) return;
    thumbs.forEach((btn) => {
      btn.addEventListener("click", () => {
        main.querySelector("img").src = btn.dataset.src;
        main.querySelector("img").alt = btn.dataset.alt || PRODUCT.name;
        thumbs.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  /* ---------- Selector de cantidad ---------- */
  function initQuantity() {
    const minus = $("#qtyMinus");
    const plus = $("#qtyPlus");
    const input = $("#qtyInput");
    if (!input) return;

    const set = (v) => {
      let n = parseInt(v, 10) || 1;
      n = Math.max(1, Math.min(PRODUCT.maxQty, n));
      input.value = n;
      minus.disabled = n <= 1;
      plus.disabled = n >= PRODUCT.maxQty;
    };

    minus.addEventListener("click", () => set(parseInt(input.value, 10) - 1));
    plus.addEventListener("click", () => set(parseInt(input.value, 10) + 1));
    input.addEventListener("change", () => set(input.value));
    set(1);
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(message) {
    let el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.innerHTML = '<span class="ok">✓</span><span class="msg"></span>';
      document.body.appendChild(el);
    }
    $(".msg", el).textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---------- Carrito (localStorage) ---------- */
  function currentQty() {
    const q = parseInt($("#qtyInput")?.value || "1", 10);
    return Math.max(1, Math.min(PRODUCT.maxQty, q));
  }

  function saveCart(qty) {
    const cart = {
      items: [
        {
          id: PRODUCT.sku,
          name: PRODUCT.name,
          price: PRODUCT.price,
          basePrice: PRODUCT.basePrice,
          discount: PRODUCT.discount,
          image: IMAGES[0],
          qty: qty,
        },
      ],
    };
    localStorage.setItem("alkosto_cart", JSON.stringify(cart));
  }

  function initCart() {
    const badge = $("#cartBadge");
    const addButtons = $all(".js-add-to-cart");
    const addBtn = $("#addToCartButton");

    function addToCart() {
      const qty = currentQty();
      saveCart(qty);
      badge.textContent = qty;
      badge.hidden = qty === 0;
      toast("Se agregó a tu carrito");
      badge.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.5)" },
          { transform: "scale(1)" },
        ],
        { duration: 320, easing: "ease" }
      );
    }

    addButtons.forEach((b) => b.addEventListener("click", addToCart));
    if (addBtn && !addButtons.includes(addBtn)) addBtn.addEventListener("click", addToCart);
  }

  /* ---------- Comprar ahora ---------- */
  function initBuyNow() {
    const btn = $("#buyNowBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      saveCart(currentQty());
      window.location.href = "checkout.html";
    });
  }

  /* ---------- Modal Black Friday ---------- */
  function initBlackFriday() {
    const overlay = $("#bfOverlay");
    if (!overlay) return;

    function open() { overlay.hidden = false; document.body.style.overflow = "hidden"; }
    function close() { overlay.hidden = true; document.body.style.overflow = ""; }

    $("#bfClose").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !overlay.hidden) close(); });

    // reabrir desde la barra flotante
    $("#bfBarBtn")?.addEventListener("click", open);

    // CTA → ir al checkout
    $("#bfCta")?.addEventListener("click", () => {
      close();
      window.location.href = "checkout.html";
    });

    // copiar la llave Bre-B
    $("#bfCopy")?.addEventListener("click", async () => {
      const key = $("#bfKey")?.textContent.trim() || "301 781 4702";
      try { await navigator.clipboard.writeText(key); toast("Llave Bre-B copiada"); }
      catch (e) { toast("Llave Bre-B: " + key); }
    });

    // mostrar al cargar (una vez por sesión)
    if (!sessionStorage.getItem("bf_seen")) {
      setTimeout(open, 900);
      sessionStorage.setItem("bf_seen", "1");
    }
  }

  /* ---------- Favoritos ---------- */
  function initFavorites() {
    $all(".js-favorite").forEach((btn) => {
      btn.addEventListener("click", () => {
        const active = btn.classList.toggle("active");
        btn.setAttribute("aria-pressed", String(active));
        toast(active ? "Producto agregado a tu lista" : "Producto quitado de tu lista");
      });
    });
  }

  /* ---------- Compartir ---------- */
  function initShare() {
    const btn = $("#shareBtn");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      const url = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({ title: PRODUCT.name, url });
          return;
        } catch (e) {
          /* usuario canceló */
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        toast("Enlace copiado al portapapeles");
      } catch (e) {
        toast("Copia la URL de la página para compartir");
      }
    });
  }

  /* ---------- Sticky bar (aparece al hacer scroll) ---------- */
  function initStickyBar() {
    const bar = $("#stickyBar");
    if (!bar) return;
    let lastY = window.scrollY;
    let ticking = false;
    function update() {
      const y = window.scrollY;
      const show = y > 420;
      bar.classList.toggle("show", show);
      lastY = y;
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    });
    // el botón flotante también agrega al carrito
    const btn = $("#stickyAddBtn");
    if (btn) btn.addEventListener("click", () => $("#addToCartButton")?.click());
  }

  /* ---------- Menú móvil ---------- */
  function initMobileMenu() {
    const toggle = $("#menuToggle");
    const nav = $("#navCats");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- Acordeón de especificaciones (móvil) ---------- */
  function initSpecsAccordion() {
    // En pantallas pequeñas las especificaciones se muestran completas;
    // aquí solo damos feedback táctil en los encabezados.
    $all(".specs-group h3").forEach((h) => {
      h.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          const group = h.parentElement;
          group.classList.toggle("collapsed");
        }
      });
    });
  }

  /* ---------- Rellenar datos dinámicos (formato COP) ---------- */
  function fillPrices() {
    const set = (sel, text) => { const el = $(sel); if (el) el.textContent = text; };
    set("#priceNow", cop.format(PRODUCT.price));
    set("#priceBefore", cop.format(PRODUCT.basePrice));
    set("#discountBadge", `-${PRODUCT.discount}%`);
    set("#addiPrice", cop.format(PRODUCT.addiPrice));
    set("#stickyPrice", cop.format(PRODUCT.price));
    set("#stickyTitle", PRODUCT.name);
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initGallery();
    initQuantity();
    initCart();
    initBuyNow();
    initBlackFriday();
    initFavorites();
    initShare();
    initStickyBar();
    initMobileMenu();
    initSpecsAccordion();
    fillPrices();
  });
})();
