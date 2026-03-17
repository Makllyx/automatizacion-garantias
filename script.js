// Portal de consulta de garantía (simulado)
// - Sin backend: todo es mock en este archivo
// - Importante: normalizamos el Service Tag para aceptar minúsculas/mayúsculas

/**
 * Dispositivos de ejemplo (mock)
 * Nota: en un portal real estos datos vendrían de un backend.
 */
const DEVICES = [
  {
    serviceTag: "ABC1234",
    modelo: "Dell XPS 13 9310",
    estadoGarantia: "Activa",
    fechaInicio: "2025-05-12",
    fechaFin: "2027-05-12",
    tipoSoporte: "ProSupport",
  },
  {
    serviceTag: "DELL007",
    modelo: "Dell Inspiron 15 3520",
    estadoGarantia: "Expirada",
    fechaInicio: "2022-03-18",
    fechaFin: "2024-03-18",
    tipoSoporte: "Basic",
  },
  {
    serviceTag: "F4K9Z2Q",
    modelo: "Dell Latitude 5440",
    estadoGarantia: "Activa",
    fechaInicio: "2024-11-01",
    fechaFin: "2026-11-01",
    tipoSoporte: "Premium",
  },
  {
    serviceTag: "M5N8P1R",
    modelo: "Dell Precision 3581",
    estadoGarantia: "Activa",
    fechaInicio: "2023-08-20",
    fechaFin: "2026-08-20",
    tipoSoporte: "ProSupport",
  },
  {
    serviceTag: "ZX90QWE",
    modelo: "Dell OptiPlex 7010",
    estadoGarantia: "Expirada",
    fechaInicio: "2021-01-10",
    fechaFin: "2024-01-10",
    tipoSoporte: "Basic",
  },
];

// ---------- Helpers ----------

function $(selector) {
  return document.querySelector(selector);
}

function normalizeServiceTag(value) {
  return (value ?? "").trim().toUpperCase();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setLoading(isLoading) {
  const loader = $("#loader");
  const btn = $("#btnSubmit");
  const input = $("#serviceTagInput");

  loader.hidden = !isLoading;
  btn.disabled = isLoading;
  input.disabled = isLoading;
}

function setFieldError(message) {
  const input = $("#serviceTagInput");
  const errorText = $("#errorText");

  if (message) {
    input.classList.add("is-error");
    errorText.textContent = message;
    input.setAttribute("aria-invalid", "true");
    return;
  }

  input.classList.remove("is-error");
  errorText.textContent = "";
  input.removeAttribute("aria-invalid");
}

function findDeviceByServiceTag(serviceTag) {
  return DEVICES.find((d) => d.serviceTag === serviceTag) ?? null;
}

function formatDate(iso) {
  // Formato simple (es-ES) para hacerlo más “portal corporativo”
  try {
    const d = new Date(iso + "T00:00:00");
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}

function setView(activeId) {
  const form = $("#viewForm");
  const result = $("#viewResult");

  const show = (el) => {
    el.hidden = false;
    // Fuerza reflow para que la transición aplique al entrar
    void el.offsetWidth;
    el.classList.add("is-active");
  };

  const hide = (el) => {
    el.classList.remove("is-active");
    // Espera el fin de la transición antes de ocultar
    window.setTimeout(() => {
      if (!el.classList.contains("is-active")) el.hidden = true;
    }, 220);
  };

  if (activeId === "form") {
    hide(result);
    show(form);
    return;
  }

  hide(form);
  show(result);
}

function renderResult(device, requestedTag) {
  const badge = $("#badgeStatus");
  const body = $("#resultBody");

  if (!device) {
    badge.textContent = "No encontrado";
    badge.classList.remove("badge--success");
    badge.classList.add("badge--danger");

    body.innerHTML = `
      <div class="empty">
        No se encontró información para este dispositivo.<br />
        Verifica el Service Tag e inténtalo nuevamente.
        <div style="margin-top:10px; font-family: var(--mono); opacity:.85;">Ingresado: ${escapeHtml(
          requestedTag
        )}</div>
      </div>
    `;
    return;
  }

  const isActive = device.estadoGarantia === "Activa";
  badge.textContent = isActive ? "Garantía activa" : "Garantía expirada";
  badge.classList.toggle("badge--success", isActive);
  badge.classList.toggle("badge--danger", !isActive);

  body.innerHTML = `
    <div class="row">
      <div class="row__label">Modelo</div>
      <div class="row__value">${escapeHtml(device.modelo)}</div>
    </div>
    <div class="row">
      <div class="row__label">Service Tag</div>
      <div class="row__value mono">${escapeHtml(device.serviceTag)}</div>
    </div>
    <div class="row">
      <div class="row__label">Estado de garantía</div>
      <div class="row__value">${escapeHtml(device.estadoGarantia)}</div>
    </div>
    <div class="row">
      <div class="row__label">Inicio</div>
      <div class="row__value">${escapeHtml(formatDate(device.fechaInicio))}</div>
    </div>
    <div class="row">
      <div class="row__label">Fin</div>
      <div class="row__value">${escapeHtml(formatDate(device.fechaFin))}</div>
    </div>
    <div class="row">
      <div class="row__label">Tipo de soporte</div>
      <div class="row__value">${escapeHtml(device.tipoSoporte)}</div>
    </div>
  `;
}

function escapeHtml(value) {
  // Evita inyectar HTML al renderizar valores del input/mock
  const s = String(value ?? "");
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ---------- App ----------

async function handleSubmit(e) {
  e.preventDefault();

  setFieldError("");

  const input = $("#serviceTagInput");
  const requested = normalizeServiceTag(input.value);

  if (!requested) {
    setFieldError("Ingresa un Service Tag / número de serie para continuar.");
    input.focus();
    return;
  }

  setLoading(true);

  // Simula tiempo de consulta (1–2 segundos)
  await wait(1400 + Math.floor(Math.random() * 600));

  const device = findDeviceByServiceTag(requested);
  renderResult(device, requested);

  setLoading(false);
  setView("result");
}

function handleNewQuery() {
  setFieldError("");
  $("#serviceTagInput").value = "";
  setView("form");
  window.setTimeout(() => $("#serviceTagInput").focus(), 80);
}

function handleTyping() {
  // UX: al empezar a escribir, limpia error visual
  if ($("#serviceTagInput").classList.contains("is-error")) {
    setFieldError("");
  }
}

function init() {
  $("#warrantyForm").addEventListener("submit", handleSubmit);
  $("#btnNewQuery").addEventListener("click", handleNewQuery);
  $("#serviceTagInput").addEventListener("input", handleTyping);

  // Accesibilidad: foco inicial
  $("#serviceTagInput").focus();
}

document.addEventListener("DOMContentLoaded", init);

