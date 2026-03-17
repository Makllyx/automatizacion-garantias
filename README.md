# 💻 Simulador de Garantías Dell

Este proyecto es una página web que simula la consulta de garantía de dispositivos, similar a los portales de soporte técnico de Dell.

Está desarrollada únicamente con **HTML, CSS y JavaScript**, sin uso de backend ni base de datos, utilizando datos simulados (mock).

---

## 🚀 Características

- Consulta de garantía mediante **Service Tag / Número de serie**
- Validación de campo obligatorio
- Simulación de carga con spinner
- Resultados dinámicos con datos simulados
- Indicador visual de estado de garantía:
  - 🟢 Activa
  - 🔴 Expirada
- Diseño moderno y responsivo
- Animaciones suaves (fade-in)
- Botón para realizar nuevas consultas

---

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla JS)

---

## 📂 Estructura del proyecto
/proyecto
│── index.html
│── styles.css
│── script.js

---

## ⚙️ Funcionamiento

1. El usuario ingresa un **Service Tag**.
2. Se valida que el campo no esté vacío.
3. Se simula una carga de 1–2 segundos.
4. El sistema busca el Service Tag en un arreglo de datos en JavaScript.
5. Se muestran los resultados:
   - Modelo del dispositivo
   - Estado de garantía
   - Fechas
   - Tipo de soporte
6. Si no existe, se muestra un mensaje de error.

---

## 🧪 Datos simulados

Los datos se encuentran en el archivo `script.js` en un arreglo de objetos como:

```js
{
  serviceTag: "ABC123",
  modelo: "Dell XPS 13",
  estadoGarantia: "Activa",
  fechaInicio: "2024-01-01",
  fechaFin: "2026-01-01",
  tipoSoporte: "ProSupport"
}
