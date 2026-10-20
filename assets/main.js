/* Safe Handover — site config + behaviour. Edit CONFIG and PRICING before going live. */
const CONFIG = {
  // TODO: set before launch
  whatsapp: "971500000000",          // international format, digits only
  phone: "+971 50 000 0000",         // shown on site
  email: "info@safehandover.ae",
  formspreeId: "",                   // e.g. "xykaygyq" — leave empty to send leads via WhatsApp instead
};

// Indicative pricing (AED). TODO: confirm rates with inspection partner before launch.
const PRICING = {
  handover: { apartment: { rate: 1.0, min: 750 },  townhouse: { rate: 0.85, min: 1800 }, villa: { rate: 0.8, min: 2500 } },
  tenancy:  { apartment: { rate: 0.6, min: 500 },  townhouse: { rate: 0.5, min: 1100 },  villa: { rate: 0.45, min: 1500 } },
  dlp:      { apartment: { rate: 0.9, min: 700 },  townhouse: { rate: 0.75, min: 1600 }, villa: { rate: 0.7, min: 2200 } },
};

/* ---------- Analytics (GA4 tag is in each page's <head>) ---------- */
function track(name, params) { if (typeof gtag === "function") gtag("event", name, params || {}); }

/* ---------- Contact links ---------- */
const waLink = (text) => "https://wa.me/" + CONFIG.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");

document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = waLink(a.dataset.wa || "Hi Safe Handover, I'd like to book a property inspection.");
  a.target = "_blank";
  a.rel = "noopener";
  a.addEventListener("click", () => track("whatsapp_click", { location: a.dataset.where || "page" }));
});
document.querySelectorAll("[data-phone]").forEach((a) => {
  a.href = "tel:" + CONFIG.phone.replace(/\s/g, "");
  const val = a.querySelector(".val");
  if (val) val.textContent = CONFIG.phone;
  a.addEventListener("click", () => track("phone_click"));
});
document.querySelectorAll("[data-email]").forEach((a) => {
  a.href = "mailto:" + CONFIG.email;
  const val = a.querySelector(".val");
  if (val) val.textContent = CONFIG.email;
});
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------- Price calculator ---------- */
const calc = document.getElementById("calc");
if (calc) {
  const size = calc.querySelector("#size");
  const sizeOut = calc.querySelector("#size-out");
  const priceOut = document.getElementById("price-out");
  const summary = document.getElementById("price-summary");
  const book = document.getElementById("price-book");
  const serviceNames = { handover: "New-home handover snagging", tenancy: "Move-in / move-out inspection", dlp: "End-of-warranty (DLP) inspection" };
  let tracked = false;

  const fmt = (n) => n.toLocaleString("en-US");
  function update() {
    const service = calc.querySelector("input[name=service]:checked").value;
    const type = calc.querySelector("input[name=ptype]:checked").value;
    const sqft = Number(size.value);
    const p = PRICING[service][type];
    const price = Math.max(p.min, Math.round((sqft * p.rate) / 50) * 50);
    sizeOut.textContent = fmt(sqft) + " sq ft";
    priceOut.textContent = fmt(price);
    summary.textContent = serviceNames[service] + " · " + type + " · " + fmt(sqft) + " sq ft";
    book.href = waLink(`Hi Safe Handover, I'd like to book: ${serviceNames[service]} for a ${type} of about ${fmt(sqft)} sq ft (quoted AED ${fmt(price)}).`);
  }
  // Villas are bigger — move the slider into a sensible range when type changes
  calc.querySelectorAll("input[name=ptype]").forEach((r) => r.addEventListener("change", () => {
    const defaults = { apartment: 1100, townhouse: 2400, villa: 4000 };
    size.value = defaults[r.value];
    update();
  }));
  calc.addEventListener("input", () => {
    update();
    if (!tracked) { track("price_calculated"); tracked = true; }
  });
  book.addEventListener("click", () => track("whatsapp_click", { location: "calculator" }));
  update();
}

/* ---------- Lead form ---------- */
const form = document.getElementById("lead-form");
if (form) {
  const msg = form.querySelector(".form-msg");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.name || !data.phone) {
      msg.className = "form-msg err";
      msg.textContent = "Please add your name and phone number.";
      return;
    }
    track("generate_lead", { service: data.service });

    if (!CONFIG.formspreeId) {
      const text = `Hi Safe Handover,\nName: ${data.name}\nService: ${data.service}\nProperty: ${data.property}\nCommunity: ${data.community || "-"}\nHandover / move date: ${data.date || "-"}\n${data.message || ""}`;
      window.open(waLink(text), "_blank", "noopener");
      return;
    }
    const btn = form.querySelector("button");
    btn.disabled = true;
    try {
      const res = await fetch("https://formspree.io/f/" + CONFIG.formspreeId, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error();
      form.reset();
      msg.className = "form-msg ok";
      msg.textContent = "Thanks — we'll call or WhatsApp you within working hours.";
    } catch {
      msg.className = "form-msg err";
      msg.textContent = "Something went wrong. Please message us on WhatsApp instead.";
    } finally {
      btn.disabled = false;
    }
  });
}
