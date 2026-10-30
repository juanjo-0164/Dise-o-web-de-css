// Laboratorio de temas - cambia el tema con el atributo data-tema
const TEMAS = {
    claro:     { nombre: "Claro",     modo: "light" },
    oscuro:    { nombre: "Oscuro",    modo: "dark"  },
    oceano:    { nombre: "Océano",    modo: "light" },
    atardecer: { nombre: "Atardecer", modo: "light" },
    bosque:    { nombre: "Bosque",    modo: "dark"  },
    sena:      { nombre: "SENA",      modo: "light" }
};

const VARIABLES = [
    "--t-bg", "--t-surface", "--t-surface-2", "--t-text", "--t-muted",
    "--t-border", "--t-primary", "--t-primary-rgb", "--t-on-primary", "--t-accent"
];

const html = document.documentElement;
const toastEl = document.getElementById("toastDemo");
const toast = bootstrap.Toast.getOrCreateInstance(toastEl);

function mostrarToast(texto) {
    document.getElementById("toastTexto").textContent = texto;
    toast.show();
}

function actualizarCodigo(clave) {
    const estilos = getComputedStyle(html);
    const lineas = VARIABLES.map(v => `    ${v}: ${estilos.getPropertyValue(v).trim()};`);
    document.getElementById("codigoTema").textContent =
        `[data-tema="${clave}"] {\n${lineas.join("\n")}\n}`;
}

function aplicarTema(clave, avisar = false) {
    if (!TEMAS[clave]) clave = "claro";
    html.dataset.tema = clave;
    html.setAttribute("data-bs-theme", TEMAS[clave].modo);

    document.getElementById("nombreTemaActual").textContent = TEMAS[clave].nombre;
    document.querySelectorAll(".tema-btn").forEach(btn => {
        btn.setAttribute("aria-checked", String(btn.dataset.tema === clave));
    });
    document.querySelectorAll("#menuTemas .dropdown-item").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tema === clave);
    });

    actualizarCodigo(clave);

    try { localStorage.setItem("tema", clave); } catch (e) { /* sin almacenamiento */ }
    if (avisar) mostrarToast(`Tema aplicado: ${TEMAS[clave].nombre}`);
}

// Un solo listener para todos los botones con data-tema
document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tema]");
    if (!btn || btn === html) return;
    aplicarTema(btn.dataset.tema, true);
});

// Tema inicial: el guardado o, si no hay, el que prefiera el sistema
let inicial = "claro";
try {
    inicial = localStorage.getItem("tema") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro");
} catch (e) { /* usa claro */ }
aplicarTema(inicial);

// Botón de notificación
document.getElementById("btnToast").addEventListener("click", () => {
    mostrarToast("Esta notificación también cambia con el tema.");
});

// Formulario de ejemplo: no se envía, solo muestra un aviso
document.getElementById("formDemo").addEventListener("submit", (e) => {
    e.preventDefault();
    mostrarToast("Formulario de ejemplo enviado.");
});

// Tooltips y popovers
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));

// Copiar el CSS del tema activo
document.getElementById("btnCopiar").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(document.getElementById("codigoTema").textContent);
        mostrarToast("CSS copiado al portapapeles.");
    } catch (e) {
        mostrarToast("No se pudo copiar. Selecciona el texto y usa Ctrl + C.");
    }
});
