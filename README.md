# 📊 Panel de KPIs Dinámico - Estilo Looker Studio con JavaScript Vanilla y ApexCharts

¡Bienvenido a este increíble proyecto de Dashboard de KPIs! 🚀 Este panel interactivo te permite visualizar y analizar el rendimiento clave de tu negocio de una manera elegante y dinámica, similar a la experiencia de Looker Studio. Todo construido con JavaScript puro, HTML, CSS y la potente biblioteca de gráficos ApexCharts.js.

![Captura de Pantalla del Dashboard](https://i.imgur.com/YOUR_SCREENSHOT_URL.png)  <!-- Reemplaza con una URL de una captura de tu dashboard -->

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

*   **Lenguajes Principales**:
    *   ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
    *   ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
    *   ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) (Vanilla ES6+)
*   **Bibliotecas de Gráficos**:
    *   **ApexCharts.js**: Para la creación de los 12 tipos de gráficos interactivos y atractivos. 📈
*   **Frameworks CSS (Auxiliar)**:
    *   **Bootstrap 5**: Utilizado para el sistema de rejilla base, algunos componentes y estilos responsivos. 🅱️
*   **Iconos**:
    *   **Font Awesome**: Para los iconos utilizados en toda la interfaz. fontawesome.com <i class="fab fa-font-awesome-flag"></i>
*   **Formato de Datos**:
    *   **JSON**: Para la carga externa de los datos del dashboard. `{}`

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
