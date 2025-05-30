# 📊 Panel de KPIs Dinámico - Estilo Looker Studio con JavaScript Vanilla y ApexCharts

¡Bienvenido a este increíble proyecto de Dashboard de KPIs! 🚀 Este panel interactivo te permite visualizar y analizar el rendimiento clave de tu negocio de una manera elegante y dinámica, similar a la experiencia de Looker Studio. Todo construido con JavaScript puro, HTML, CSS y la potente biblioteca de gráficos ApexCharts.js.

![Captura de Pantalla del Dashboard](h# 📊 Dashboard de KPIs Dinámico con JavaScript y ApexCharts 🚀

Este proyecto presenta un **Dashboard Interactivo y Dinámico para el Análisis de Indicadores Clave de Rendimiento (KPIs)**. Ha sido desarrollado para visualizar métricas cruciales de negocio, identificar tendencias de ingresos, analizar el rendimiento de canales de adquisición, desglosar datos por regiones y categorías de productos, permitiendo una toma de decisiones más informada y ágil.

El dashboard ofrece una visión completa del desempeño, utilizando más de 12 tipos de gráficos diferentes, filtros interactivos y un resumen ejecutivo dinámico, todo presentado en una interfaz de usuario moderna, intuitiva y totalmente responsiva, inspirada en la claridad de herramientas como Looker Studio.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![ApexCharts.js](https://img.shields.io/badge/ApexCharts.js-008FFB?style=for-the-badge&logo=apexcharts&logoColor=white)](https://apexcharts.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=for-the-badge&logo=font-awesome&logoColor=white)](https://fontawesome.com/)
[![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)](https://www.json.org/)

---

![Captura de Pantalla del Dashboard](https://i.imgur.com/YOUR_SCREENSHOT_URL.png)  <!-- 📸 REEMPLAZA ESTA URL con una captura de tu dashboard -->

## ✨ Características Clave

*   **📈 12 Formas de Visualizar KPIs**: Un conjunto diverso de gráficos que incluye:
    *   Series de Tiempo (con y sin línea de tendencia/rango objetivo)
    *   Barras de Progreso con Metas
    *   Gráficos Combinados Apilados (Columnas + Línea)
    *   Barras Verticales y Horizontales Apiladas
    *   Gráficos de Dona
    *   Boxplots (Diagramas de Caja)
    *   Barras y Áreas Apiladas al 100%
*   **🔍 Filtros Dinámicos e Interactivos**:
    *   📅 **Rango de Fechas**: Analiza el rendimiento en períodos específicos.
    *   📢 **Canal de Adquisición**: Compara el rendimiento de canales (Directo, Orgánico, Pagado, Referencia).
    *   🌍 **Región Geográfica**: Desglosa los datos por región (Norteamérica, Europa, Asia).
*   **📝 Resumen Ejecutivo Dinámico**:
    *   Una sección con narrativa inteligente generada automáticamente que destaca:
        *   💰 Ingresos totales y promedio diario del período seleccionado.
        *   📈 Tendencias generales de crecimiento o disminución.
        *   🎯 Progreso hacia los objetivos de ingresos.
        *   🆚 Comparación con el rendimiento del mes anterior (si aplica).
        *   🏆 Canales principales y categorías de productos con mejor rendimiento.
    *   Uso de formatos condicionales, iconos y emojis para una fácil comprensión.
    *   Sugerencias y próximos pasos basados en los datos analizados.
*   **🎨 Diseño Moderno y Responsivo**: Interfaz de usuario limpia y profesional, inspirada en Looker Studio, que se adapta fluidamente a diferentes dispositivos (escritorio, tablet, móvil).
*   **👤 Modal de Perfil del Creador**:
    *   Ventana modal con información sobre "Juancito Peña", incluyendo una breve biografía, servicios ofrecidos y enlaces a redes sociales.
*   **⚙️ Carga de Datos Centralizada**: Toda la información para los KPIs y gráficos se carga desde un archivo `data.json` externo, facilitando la actualización y el mantenimiento de los datos.
*   **💡 JavaScript Puro (Vanilla JS)**: Toda la lógica del frontend, incluyendo el manejo de filtros, cálculos de KPIs, renderizado de gráficos y actualizaciones del DOM, está implementada con JavaScript nativo (ES6+), promoviendo un código claro y eficiente sin dependencias de frameworks pesados.

## 🛠️ Tecnologías y Bibliotecas

*   **Lenguajes Fundamentales**:
    *   **HTML5**: Para la estructura semántica y el contenido del dashboard.
    *   **CSS3**: Para los estilos personalizados, la apariencia visual y el diseño responsivo.
    *   **JavaScript (ES6+)**: Para toda la lógica interactiva, manipulación de datos y del DOM.
*   **Visualización de Datos**:
    *   **ApexCharts.js**: Biblioteca principal utilizada para generar los 12 tipos de gráficos dinámicos, interactivos y estéticamente agradables.
*   **Frameworks CSS (Soporte)**:
    *   **Bootstrap 5**: Se utiliza principalmente para su sistema de rejilla robusto (`.kpi-grid`) y algunas utilidades de estilo y componentes básicos.
*   **Iconografía**:
    *   **Font Awesome 6**: Provee el conjunto de iconos utilizados a lo largo de la interfaz para mejorar la usabilidad y el atractivo visual.
*   **Formato de Datos**:
    *   **JSON (JavaScript Object Notation)**: Formato estándar utilizado para el archivo `data.json`, que actúa como la fuente de datos para el dashboard.

## 🚀 Cómo Empezar

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1.  **Clonar el Repositorio**:
    ```bash
    git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
    cd TU_REPOSITORIO 
    ```
    *(Reemplaza `TU_USUARIO/TU_REPOSITORIO` con la URL real de tu proyecto).*

2.  **Estructura de Archivos Esperada**:
    ```
    .
    ├── index.html         # La página principal del dashboard
    ├── style.css          # Todos los estilos CSS
    ├── script.js          # Toda la lógica JavaScript
    └── data.json          # Archivo con los datos para los KPIs y gráficos
    ```

3.  **Abrir en el Navegador**:
    *   Puedes abrir `index.html` directamente en tu navegador web.
    *   **Recomendado**: Para una mejor experiencia de desarrollo y para evitar problemas con la política de CORS al cargar `data.json` mediante `fetch`, utiliza un servidor de desarrollo local. Si usas VS Code, la extensión "Live Server" es una excelente opción.

4.  **Interactuar con el Dashboard**:
    *   📊 Explora los 12 KPIs y gráficos visualizados.
    *   🖱️ Utiliza los filtros de Fecha, Canal y Región. Observa cómo los KPIs, gráficos y el Resumen Ejecutivo se actualizan dinámicamente.
    *   👤 Haz clic en la imagen de perfil en la cabecera, o en el nombre "Juancito Peña" o la imagen de perfil en el pie de página, para abrir la modal con la información del creador.

## 📄 Archivo `data.json`

Este archivo es la columna vertebral de la información del dashboard. Su estructura es clave:

*   `kpiSummary`: Contiene valores base para los KPIs principales (ej. `changeFromLastMonth`, `targetValue`, `overallTarget`). El valor de `totalRevenue` en este objeto se **recalcula dinámicamente** por el script basándose en la suma del `timeSeriesData` (completo o filtrado).
*   `timeSeriesData`: Un array de objetos, donde cada objeto representa un punto de datos diario y **debe incluir** `date` (YYYY-MM-DD), `value` (numérico), `channel` (ej. "directo", "organico"), y `region` (ej. "na", "eu", "asia") para el correcto funcionamiento de los filtros.
*   `channelData`: Datos agregados por canal, utilizados para el gráfico de dona y el de top canales. Debe incluir `name` (ej. "Directo") y `value`.
*   `productCategoryRevenue`: Datos para el gráfico de rendimiento por categoría de producto.
*   Otras secciones (`stackedComboData`, `boxplotData`, `trendlineTargetRangeData`, `progressLineTrendValue`, `stackedBar100Data`, `stackedArea100Data`) contienen datos predefinidos para sus respectivos gráficos y, en la implementación actual, no se filtran dinámicamente por los selectores de canal/región (aunque `boxplotData` podría adaptarse si sus categorías `x` coincidieran con los valores del filtro de región).

**Para usar tus propios datos**: Modifica `data.json` manteniendo la estructura. El `script.js` está diseñado para calcular y mostrar los datos correctamente siempre que la estructura se respete.

## 💡 Posibles Mejoras y Próximos Pasos

*   **Análisis Detallado por Gráfico**: Implementar modales individuales que se abran al hacer clic en cada gráfico, ofreciendo desgloses más profundos y visualizaciones secundarias específicas.
*   **Comparativas Avanzadas**: Añadir opciones para comparar con períodos anteriores directamente en los gráficos o en el resumen.
*   **Exportación de Datos/Gráficos**: Permitir a los usuarios descargar los datos filtrados (CSV) o los gráficos (PNG/SVG).
*   **Temas Visuales**: Opción para alternar entre un tema claro y uno oscuro.
*   **Optimización**: Para conjuntos de datos extremadamente grandes, considerar la carga progresiva o virtualización de datos.
*   **Internacionalización (i18n)**: Adaptar el dashboard para soportar múltiples idiomas.

## 🤝 Contribuciones

¡Las ideas y contribuciones son siempre bienvenidas! Si deseas mejorar este proyecto:

1.  Realiza un **Fork** del repositorio.
2.  Crea una nueva **Rama** (`git checkout -b mi-mejora-increible`).
3.  Implementa tus cambios y realiza **Commit** (`git commit -m 'Añadida nueva funcionalidad X'`).
4.  Haz **Push** a tu rama (`git push origin mi-mejora-increible`).
5.  Abre un **Pull Request**.

## 📜 Licencia

Distribuido bajo la Licencia MIT. Ver el archivo `LICENSE` (si existe en tu repositorio) para más información.

## 📬 Contacto

**Juancito Peña**

*   <img src="https://avatars.githubusercontent.com/u/38921558?s=20&v=4" width="20" height="20" alt="GitHub"/> GitHub: [@juancitopena](https://github.com/TU_USUARIO_GITHUB) <!-- Reemplaza con tu GitHub -->
*   <img src="URL_ICONO_LINKEDIN_PEQUEÑO" width="20" height="20" alt="LinkedIn"/> LinkedIn: [Tu Perfil de LinkedIn](https://linkedin.com/in/TU_PERFIL_LINKEDIN) <!-- Reemplaza con tu LinkedIn -->
*   📧 Email: `tu_email@example.com` <!-- Reemplaza con tu email -->

Enlace al Proyecto: [https://github.com/TU_USUARIO/TU_REPOSITORIO](https://github.com/TU_USUARIO/TU_REPOSITORIO) <!-- Reemplaza -->

---

¡Gracias por darle un vistazo a este Dashboard de KPIs! Esperamos que te sirva de inspiración y como una herramienta útil. ¡Feliz codificación! 👨‍💻✨ttps://i.imgur.com/YOUR_SCREENSHOT_URL.png)  <!-- Reemplaza con una URL de una captura de tu dashboard -->

## ✨ Características Principales

*   **Visualizaciones Variadas (12+ Tipos)**: Desde series de tiempo y barras de progreso hasta gráficos de dona y boxplots. ¡Todo lo que necesitas para entender tus datos!
*   **Filtros Dinámicos**: Filtra los datos por rango de fechas 📅, canal de adquisición 📢 y región geográfica 🌍. Los KPIs y gráficos se actualizan al instante.
*   **Resumen Ejecutivo Inteligente**: Una sección narrativa que te ofrece insights rápidos sobre el rendimiento actual, destacando tendencias, logros y áreas de mejora, ¡con iconos y emojis! 💡
*   **Diseño Moderno y Responsivo**: Inspirado en Looker Studio, con una interfaz limpia y adaptable a diferentes tamaños de pantalla.
*   **Interactividad**:
    *   Modal de perfil del creador con información de contacto y redes sociales.
    *   (Futuro) Modales detalladas por gráfico para un análisis más profundo.
*   **Carga de Datos Externa**: Los datos se cargan desde un archivo `data.json`, facilitando la actualización y manejo de la información.
*   **Construido con Tecnologías Web Estándar**: HTML5, CSS3 y JavaScript (Vanilla), sin frameworks complejos para la lógica principal.

## 🛠️ Tecnologías y Módulos Utilizados

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-339AF0?style=for-the-badge&logo=font-awesome&logoColor=white)](https://fontawesome.com/)
[![jsPDF](https://img.shields.io/badge/jsPDF-FF4444?style=for-the-badge)](https://github.com/parallax/jsPDF)
[![html2canvas](https://img.shields.io/badge/html2canvas-F44336?style=for-the-badge)](https://html2canvas.hertzen.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)](https://www.json.org/)
[![Excel](https://img.shields.io/badge/Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)](https://www.microsoft.com/en-us/microsoft-365/excel)
---
## 🚀 Empezando

Para ejecutar este proyecto localmente, sigue estos sencillos pasos:

1.  **Clona el Repositorio**:
    ```bash
    git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
    cd TU_REPOSITORIO
    ```
2.  **Estructura de Archivos**: Asegúrate de tener la siguiente estructura básica:
    ```
    .
    ├── index.html
    ├── style.css
    ├── script.js
    └── data.json
    ```
3.  **Abre `index.html` en tu Navegador**:
    *   Puedes simplemente hacer doble clic en el archivo `index.html`.
    *   O, para una mejor experiencia (especialmente si realizas cambios), utiliza una extensión de servidor en vivo como "Live Server" para VS Code. Esto ayuda a evitar problemas con las políticas CORS al cargar `data.json` mediante `fetch`.

4.  **¡Explora y Filtra!** 🕵️‍♀️
    *   Utiliza los selectores de fecha, canal y región.
    *   Haz clic en el botón "Aplicar" o espera a que los cambios se apliquen automáticamente (con debounce) al modificar los selectores.
    *   Haz clic en la imagen de perfil en el encabezado o en el nombre "Juancito Peña" en el pie de página para ver la modal de perfil.

## 📁 Estructura del Proyecto

*   **`index.html`**: La estructura principal de la página del dashboard, incluyendo los contenedores para los KPIs, gráficos y filtros.
*   **`style.css`**: Contiene todos los estilos CSS personalizados para dar al dashboard su apariencia estilo Looker Studio, incluyendo los estilos para la modal de perfil y el resumen ejecutivo.
*   **`script.js`**: El corazón del proyecto. Aquí reside toda la lógica de JavaScript:
    *   Carga y procesamiento de datos desde `data.json`.
    *   Manejo de los filtros (fecha, canal, región).
    *   Actualización dinámica de los valores de los KPIs.
    *   Renderizado de los 12 gráficos utilizando ApexCharts.
    *   Generación del contenido del resumen ejecutivo.
    *   Manejo de la interactividad de la modal de perfil.
*   **`data.json`**: Un archivo JSON que contiene todos los datos necesarios para el dashboard:
    *   `kpiSummary`: Resumen de KPIs principales.
    *   `timeSeriesData`: Datos diarios para gráficos de series temporales, con información de canal y región.
    *   `channelData`: Datos agregados por canal para gráficos de dona/barras.
    *   `stackedComboData`, `boxplotData`, etc.: Datos específicos para otros tipos de gráficos.

## 🎯 ¿Qué puedes hacer con `data.json`?

El archivo `data.json` es la fuente de toda la información. Puedes modificarlo para:

*   **Actualizar los valores de los KPIs**: Cambia `totalRevenue`, `changeFromLastMonth`, etc.
*   **Añadir más datos históricos**: Extiende el array `timeSeriesData` con más entradas. ¡Asegúrate de que el `script.js` (en `fetchAndInitializeApp`) ajuste correctamente las fechas de inicio/fin por defecto!
*   **Modificar datos de canales o regiones**: Ajusta los valores en `channelData` o los desgloses en `timeSeriesData`.
*   **Personalizar los datos de los gráficos especializados**: Cambia los valores para `stackedComboData`, `boxplotData`, etc., para reflejar tus propios escenarios.

**Importante**: El script actualmente espera que `timeSeriesData` contenga los campos `date`, `value`, `channel`, y `region` para que los filtros funcionen al 100%.

## 💡 Consejos y Próximos Pasos para el Proyecto

*   **Mejorar la Narrativa del Resumen**: Haz que el resumen ejecutivo sea aún más inteligente. Podría detectar patrones más complejos o comparar con períodos anteriores de forma más detallada.
*   **Modales de Análisis por Gráfico**: Implementa la idea original de tener modales detalladas que se abran al hacer clic en cada gráfico, ofreciendo un desglose más profundo y visualizaciones relacionadas específicas para ese KPI.
*   **Persistencia de Filtros**: Considera guardar los filtros seleccionados por el usuario en `localStorage` para que se mantengan entre sesiones.
*   **Temas (Claro/Oscuro)**: Añade una opción para cambiar el tema visual del dashboard.
*   **Exportar Datos/Gráficos**: Permite a los usuarios exportar los datos filtrados (CSV) o los gráficos (PNG/SVG).
*   **Internacionalización (i18n)**: Prepara el dashboard para múltiples idiomas.
*   **Pruebas**: Añade pruebas unitarias o de integración para asegurar la robustez de la lógica de filtrado y cálculo.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar este dashboard, no dudes en:

1.  Hacer un Fork del repositorio.
2.  Crear una nueva rama (`git checkout -b feature/AmazingFeature`).
3.  Realizar tus cambios.
4.  Hacer Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
5.  Hacer Push a la rama (`git push origin feature/AmazingFeature`).
6.  Abrir un Pull Request.

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

## 📧 Contacto

Juancito Peña - [@tu_twitter](https://twitter.com/tu_twitter) - tu_email@example.com

Enlace al Proyecto: [https://github.com/TU_USUARIO/TU_REPOSITORIO](https://github.com/TU_USUARIO/TU_REPOSITORIO)

---

¡Gracias por revisar este proyecto! Espero que te sea útil y te inspire. ¡A codificar! 🎉
