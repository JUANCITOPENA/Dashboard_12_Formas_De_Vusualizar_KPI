document.addEventListener('DOMContentLoaded', function () {

    // ========================================================================== //
    // LÓGICA DE LA VENTANA MODAL DE PERFIL
    // ========================================================================== //
    const profileModal = document.getElementById('profileModal');
    const profileImageHeader = document.getElementById('profileImageHeader');
    const juancitoFooterName = document.getElementById('juancitoFooterName');
    const profileImageFooter = document.getElementById('profileImageFooter');
    const closeModalButton = document.querySelector('.profile-modal-close');

    function openProfileModal() { if (profileModal) profileModal.style.display = 'block'; }
    function closeProfileModal() { if (profileModal) profileModal.style.display = 'none'; }

    if (profileImageHeader) profileImageHeader.addEventListener('click', openProfileModal);
    if (juancitoFooterName) juancitoFooterName.addEventListener('click', openProfileModal);
    if (profileImageFooter) profileImageFooter.addEventListener('click', openProfileModal);
    if (closeModalButton) closeModalButton.addEventListener('click', closeProfileModal);
    window.addEventListener('click', (event) => { if (event.target === profileModal) closeProfileModal(); });
    window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && profileModal && profileModal.style.display === 'block') closeProfileModal(); });
    // --- FIN DE LÓGICA DE LA VENTANA MODAL ---

    // ========================================================================== //
    // VARIABLES GLOBALES Y FUNCIONES DE UTILIDAD
    // ========================================================================== //
    let originalData = null; 

    function formatCurrency(value, currencySymbol = '$') {
        if (typeof value !== 'number' || isNaN(value)) value = 0;
        return currencySymbol + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString + "T00:00:00"); // Asegurar que se interprete como local
            return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) {
            return dateString; // fallback
        }
    }

    const commonChartOptions = {
        chart: {
            height: 'auto', type: 'line',
            animations: { enabled: true, easing: 'easeinout', speed: 800, animateGradually: { enabled: true, delay: 150 }, dynamicAnimation: { enabled: true, speed: 350 }},
            toolbar: { show: false }, zoom: { enabled: false }, parentHeightOffset: 0,
        },
        stroke: { curve: 'smooth', width: 2 }, markers: { size: 0 },
        xaxis: {
            type: 'datetime', labels: { datetimeUTC: false, format: 'MMM dd', style: { fontSize: '10px', colors: '#6c757d' }},
            tooltip: { enabled: false }, axisBorder: { show: false }, axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                show: true,
                formatter: function (val) {
                    if (val === undefined || val === null) return '';
                    if (Math.abs(val) >= 1000000) return (val / 1000000).toFixed(1) + 'M';
                    if (Math.abs(val) >= 1000) return (val / 1000).toFixed(0) + 'k';
                    return Math.round(val);
                },
                style: { fontSize: '10px', colors: '#6c757d' }
            }
        },
        grid: { show: true, borderColor: '#e9ecef', strokeDashArray: 4, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } }, padding: { top: 5, right: 15, bottom: 0, left: 10 }},
        tooltip: { x: { format: 'dd MMM yyyy' }, theme: 'light', style: { fontSize: '12px' }},
        dataLabels: { enabled: false }
    };

    function renderChart(elementId, options) {
        const element = document.getElementById(elementId);
        if (element) {
            const existingChart = ApexCharts.getChartByID(elementId);
            if (existingChart) { existingChart.destroy(); }
            element.innerHTML = ''; // Clear previous chart or "no data" message
            try {
                const chart = new ApexCharts(element, options);
                chart.render();
                return chart;
            } catch (err) { console.error(`Error rendering chart ${elementId}:`, err, "Options:", options); }
        } else { console.warn(`Element with ID ${elementId} not found for chart rendering.`); }
        return null;
    }

    // ========================================================================== //
    // GENERACIÓN DE NARRATIVAS POR KPI CARD
    // ========================================================================== //
    function generateKpiCardNarrative(cardElement, chartId, data, originalFullData) {
        const revenueEl = cardElement.querySelector('h2');
        const narrativeEl = cardElement.querySelector('p.change');
        if (!revenueEl || !narrativeEl) return;

        let mainValueText = formatCurrency(0);
        let narrativeHTML = '<span class="text-muted">No hay datos suficientes para esta vista.</span>';
        
        const filteredTotalRevenue = data.kpiSummary.totalRevenue;
        const currency = data.kpiSummary.currency || '$';
        const baseKpiSummary = originalFullData.kpiSummary || {};

        switch (chartId) {
            case 'chartTimeSeries':
                mainValueText = formatCurrency(filteredTotalRevenue, currency);
                if (data.timeSeriesData && data.timeSeriesData.length > 0) {
                    const N = data.timeSeriesData.length;
                    const firstVal = data.timeSeriesData[0].value;
                    const lastVal = data.timeSeriesData[N - 1].value;
                    let trendIcon = ''; // Rocket for neutral/up
                    let trendText = "estable";
                    let trendClass = "neutral";
                    if (lastVal > firstVal * 1.05) { trendText = "ascendente"; trendClass = "positive"; trendIcon = '📈';}
                    else if (lastVal < firstVal * 0.95) { trendText = "descendente"; trendClass = "negative"; trendIcon = '📉';}
                    
                    narrativeHTML = `${trendIcon} Ingresos de <strong class="${trendClass}">${formatCurrency(filteredTotalRevenue, currency)}</strong>. 
                                     Período del ${formatDate(data.timeSeriesData[0].date)} al ${formatDate(data.timeSeriesData[N-1].date)}. 
                                     Tendencia general: <strong class="${trendClass}">${trendText}</strong>.`;
                } else {
                    narrativeHTML = `📊 Sin datos de series de tiempo para el filtro actual.`;
                }
                break;

            case 'chartTargetLine':
                mainValueText = formatCurrency(filteredTotalRevenue, currency);
                const targetVal = baseKpiSummary.targetValue || 0;
                const targetPercent = targetVal > 0 ? (filteredTotalRevenue / targetVal) * 100 : 0;
                let targetNarration, targetIcon, targetClass;
                if (targetPercent >= 100) { targetNarration = "¡Meta Superada!"; targetIcon = "🎉"; targetClass = "positive"; }
                else if (targetPercent >= 80) { targetNarration = "Casi allí"; targetIcon = "👍"; targetClass = "neutral"; }
                else { targetNarration = "A mejorar"; targetIcon = "🛠️"; targetClass = "negative"; }
                narrativeHTML = `${targetIcon} <strong class="${targetClass}">${formatCurrency(filteredTotalRevenue, currency)}</strong> vs Meta de ${formatCurrency(targetVal, currency)} 
                                 (<strong class="${targetClass}">${targetPercent.toFixed(1)}%</strong> alcanzado). ${targetNarration}`;
                break;

            case 'chartTimeSeriesTrendline':
                 mainValueText = formatCurrency(filteredTotalRevenue, currency);
                 if (data.timeSeriesData && data.timeSeriesData.length >= 2) {
                    const trendlineDisplayData = data.timeSeriesData.slice(0, Math.min(25, data.timeSeriesData.length));
                    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0; const nTrend = trendlineDisplayData.length;
                    for(let i=0; i<nTrend; i++) { sumX += i; sumY += trendlineDisplayData[i].value; sumXY += i * trendlineDisplayData[i].value; sumXX += i * i; }
                    const slope = (nTrend * sumXX - sumX * sumX) === 0 ? 0 : (nTrend * sumXY - sumX * sumY) / (nTrend * sumXX - sumX * sumX);
                    let trendDesc = "estable"; let trendIcon = "➡️"; let trendClass = "neutral";
                    if (slope > 10) { trendDesc = "positiva"; trendIcon = "↗️"; trendClass = "positive"; } // Ajustar umbral según datos
                    else if (slope < -10) { trendDesc = "negativa"; trendIcon = "↘️"; trendClass = "negative"; }
                    narrativeHTML = `📊 Ingresos: <strong class="${trendClass}">${formatCurrency(filteredTotalRevenue, currency)}</strong>. 
                                     La línea de tendencia calculada es <strong class="${trendClass}">${trendDesc}</strong> ${trendIcon}.`;
                 } else {
                    narrativeHTML = `📊 <strong class="neutral">${formatCurrency(filteredTotalRevenue, currency)}</strong>. Se necesitan más datos para una tendencia detallada.`;
                 }
                break;

            case 'chartProgressLine':
                mainValueText = formatCurrency(filteredTotalRevenue, currency);
                const overallTargetVal = baseKpiSummary.overallTarget || 0;
                const progressToOverall = (overallTargetVal > 0 ? (filteredTotalRevenue / overallTargetVal) * 100 : 0); // Recalculate based on filtered revenue
                
                const progressLineVal = originalFullData.progressLineTrendValue || 0;
                let comparisonText = "";
                if (progressLineVal > 0) {
                    if (filteredTotalRevenue > progressLineVal) comparisonText = `Superando la tendencia previa de <strong class="positive">${formatCurrency(progressLineVal, currency)}</strong>.`;
                    else comparisonText = `Debajo de la tendencia previa de <strong class="negative">${formatCurrency(progressLineVal, currency)}</strong>.`;
                }
                narrativeHTML = `🚀 Progreso a Objetivo General (<strong class="${progressToOverall >=100 ? 'positive' : (progressToOverall >=75 ? 'neutral' : 'negative')}">${progressToOverall.toFixed(1)}%</strong> de ${formatCurrency(overallTargetVal, currency)}). ${comparisonText}`;
                // Update progress bar display as well
                const progressBar = cardElement.querySelector('.progress-bar');
                const targetLabelRight = cardElement.querySelector('.target-value-label-right');
                if (progressBar) {
                    progressBar.style.width = Math.min(progressToOverall, 100) + '%';
                    progressBar.textContent = Math.round(progressToOverall) + '%';
                    progressBar.className = 'progress-bar'; // Reset classes
                    if (progressToOverall >= 100) progressBar.classList.add('bg-success');
                    else if (progressToOverall >= 75) progressBar.classList.add('bg-info');
                    else if (progressToOverall >= 50) progressBar.classList.add('bg-primary');
                    else if (progressToOverall >= 25) progressBar.classList.add('bg-warning');
                    else progressBar.classList.add('bg-danger');
                }
                if (targetLabelRight) targetLabelRight.textContent = formatCurrency(overallTargetVal, currency);
                break;

            case 'chartStackedCombo': // Uses global data from originalFullData
                const comboData = originalFullData.stackedComboData;
                if (comboData && comboData.series && comboData.series.length > 0) {
                    const ventasSeries = comboData.series.find(s => s.name === "Ventas");
                    const beneficioSeries = comboData.series.find(s => s.name === "Beneficio");
                    const totalVentasCombo = ventasSeries ? ventasSeries.data.reduce((a,b) => a+b, 0) : 0;
                    const totalBeneficioCombo = beneficioSeries ? beneficioSeries.data.reduce((a,b) => a+b, 0) : 0;
                    mainValueText = formatCurrency(totalVentasCombo, currency);
                    
                    let maxVentasTrim = 0; let bestTrim = "N/A";
                    if (ventasSeries) {
                        ventasSeries.data.forEach((val, idx) => {
                            if (val > maxVentasTrim) { maxVentasTrim = val; bestTrim = comboData.categories[idx]; }
                        });
                    }
                    narrativeHTML = `📦 Ventas Globales Trimestrales: <strong class="neutral">${formatCurrency(totalVentasCombo, currency)}</strong>. 
                                     Trimestre pico: <strong class="positive">${bestTrim}</strong> (${formatCurrency(maxVentasTrim, currency)}). 
                                     Beneficio total estimado: <strong class="positive">${formatCurrency(totalBeneficioCombo, currency)}</strong>.`;
                } else {
                     mainValueText = formatCurrency(0, currency);
                     narrativeHTML = `📦 Sin datos trimestrales globales.`;
                }
                break;

            case 'chartVerticalBar':
                mainValueText = formatCurrency(filteredTotalRevenue, currency);
                const verticalData = data.timeSeriesData.slice(Math.max(0, data.timeSeriesData.length - 6));
                if (verticalData.length > 0) {
                    const sumBars = verticalData.reduce((s, item) => s + item.value, 0);
                    const maxBar = Math.max(...verticalData.map(d => d.value));
                    const minBar = Math.min(...verticalData.map(d => d.value));
                    narrativeHTML = `📊 Ingresos (últimos ${verticalData.length} períodos): <strong class="neutral">${formatCurrency(sumBars, currency)}</strong>. 
                                     Pico: <strong class="positive">${formatCurrency(maxBar, currency)}</strong>. Mínimo: <strong class="negative">${formatCurrency(minBar, currency)}</strong>.`;
                } else {
                    narrativeHTML = `📊 Sin datos suficientes para barras verticales.`;
                }
                break;

            case 'chartBoxplot': // Uses filtered data.boxplotData
                if (data.boxplotData && data.boxplotData.length > 0) {
                    if (data.boxplotData.length === 1) { // Single region selected
                        const regionStats = data.boxplotData[0].y;
                        mainValueText = formatCurrency(regionStats[2], currency); // Median
                        narrativeHTML = `🌍 ${data.boxplotData[0].x}: Mediana <strong class="neutral">${formatCurrency(regionStats[2], currency)}</strong>. 
                                         Rango (<strong class="negative">${formatCurrency(regionStats[0], currency)}</strong> - <strong class="positive">${formatCurrency(regionStats[4], currency)}</strong>).`;
                    } else { // All regions
                        let maxMedian = 0; let regionMaxMedian = "N/A";
                        data.boxplotData.forEach(r => { if(r.y[2] > maxMedian) { maxMedian = r.y[2]; regionMaxMedian = r.x; }});
                        mainValueText = formatCurrency(maxMedian, currency); // Max Median
                        narrativeHTML = `🌍 Distribución Regional: <strong class="positive">${regionMaxMedian}</strong> lidera en mediana con <strong class="positive">${formatCurrency(maxMedian, currency)}</strong>. 
                                         Total de <strong class="neutral">${data.boxplotData.length}</strong> regiones analizadas.`;
                    }
                } else {
                    mainValueText = formatCurrency(0, currency);
                    narrativeHTML = `🌍 Sin datos de distribución regional para el filtro actual.`;
                }
                break;

            case 'chartTopChannelsVertical':
                 if (data.channelData && data.channelData.length > 0) {
                    const sortedChannels = [...data.channelData].sort((a,b) => b.value - a.value);
                    const topChannel = sortedChannels[0];
                    mainValueText = `${topChannel.value.toFixed(1)}%`;
                    narrativeHTML = `📢 Top Canal: <strong class="positive">${topChannel.name}</strong> (<strong class="positive">${topChannel.value.toFixed(1)}%</strong>).`;
                    if (sortedChannels.length > 1) narrativeHTML += ` Sigue <strong class="neutral">${sortedChannels[1].name}</strong> (${sortedChannels[1].value.toFixed(1)}%).`;
                    if (sortedChannels.length > 2) narrativeHTML += ` Luego <strong class="neutral">${sortedChannels[2].name}</strong> (${sortedChannels[2].value.toFixed(1)}%).`;
                 } else {
                    mainValueText = `0%`;
                    narrativeHTML = `📢 Sin datos de canales para el filtro actual.`;
                 }
                break;
            
            case 'chartDonut':
                mainValueText = formatCurrency(filteredTotalRevenue, currency);
                if (data.channelData && data.channelData.length > 0) {
                    const sortedChannelsDonut = [...data.channelData].sort((a,b) => b.value - a.value);
                    const topChannelDonut = sortedChannelsDonut[0];
                    narrativeHTML = `🍩 Mix de Canales: <strong class="positive">${topChannelDonut.name}</strong> lidera con <strong class="positive">${topChannelDonut.value.toFixed(1)}%</strong> del total de ${formatCurrency(filteredTotalRevenue, currency)}. 
                                    Total <strong class="neutral">${data.channelData.filter(c => c.value > 0).length}</strong> canales activos.`;
                } else {
                     narrativeHTML = `🍩 Sin datos de canales para el filtro actual.`;
                }
                break;

            case 'chartStackedBar100': // Uses global data from originalFullData
                const stackedBarData = originalFullData.stackedBar100Data;
                if (stackedBarData && stackedBarData.series && stackedBarData.series.length > 0) {
                    const productA_Q1 = stackedBarData.series.find(s => s.name === "Producto A")?.data[0] || 0;
                    mainValueText = `${productA_Q1.toFixed(0)}% (Prod.A Q1)`;
                    narrativeHTML = `⚖️ Composición Productos Trimestral (simulada): 
                                    <strong class="neutral">Producto A</strong> tiene <strong class="neutral">${productA_Q1}%</strong> en Q1. 
                                    <strong class="neutral">Q4</strong> muestra <strong class="neutral">${stackedBarData.series[0].data[3]}% (A)</strong>, <strong class="neutral">${stackedBarData.series[1].data[3]}% (B)</strong>, <strong class="neutral">${stackedBarData.series[2].data[3]}% (C)</strong>.`;
                } else {
                    mainValueText = `N/A`;
                    narrativeHTML = `⚖️ Sin datos de composición de productos.`;
                }
                break;

            case 'chartStackedArea100': // Uses global data from originalFullData
                const stackedAreaData = originalFullData.stackedArea100Data;
                if (stackedAreaData && stackedAreaData.seriesFactors && stackedAreaData.seriesFactors.length > 0) {
                    const topFactor = stackedAreaData.seriesFactors.reduce((max, item) => item.factor > max.factor ? item : max, stackedAreaData.seriesFactors[0]);
                    mainValueText = `${(topFactor.factor * 100).toFixed(0)}% (Mayoristas)`; // Example, assumes 'Mayoristas' is top or a key factor
                    narrativeHTML = `🌊 Cuota de Mercado (simulada): <strong class="neutral">${topFactor.name}</strong> tiene una participación base de <strong class="neutral">${(topFactor.factor * 100).toFixed(0)}%</strong>. 
                                     Visualización de <strong class="neutral">${stackedAreaData.numPoints}</strong> puntos de datos.`;
                } else {
                    mainValueText = `N/A`;
                    narrativeHTML = `🌊 Sin datos de cuota de mercado simulada.`;
                }
                break;
            
            case 'chartCategoryHorizontalBar': // Uses global data from originalFullData.productCategoryRevenue
                const catRevenue = originalFullData.productCategoryRevenue;
                if (catRevenue && catRevenue.categories && catRevenue.categories.length > 0 && catRevenue.series) {
                    const actualSeries = catRevenue.series.find(s => s.name === "Actual" || s.name === "Current Period"); // Python has "Actual"
                    const anteriorSeries = catRevenue.series.find(s => s.name === "Anterior" || s.name === "Previous Period");

                    if (actualSeries && actualSeries.data.length > 0) {
                        let topCatIndex = 0;
                        actualSeries.data.forEach((val, idx) => { if (val > (actualSeries.data[topCatIndex] || 0) ) topCatIndex = idx; });
                        const topCatName = catRevenue.categories[topCatIndex];
                        const topCatActual = actualSeries.data[topCatIndex];
                        mainValueText = formatCurrency(topCatActual, currency);

                        let changeText = "";
                        if (anteriorSeries && anteriorSeries.data[topCatIndex] !== undefined) {
                            const topCatAnterior = anteriorSeries.data[topCatIndex];
                            const changePerc = topCatAnterior > 0 ? ((topCatActual - topCatAnterior) / topCatAnterior) * 100 : (topCatActual > 0 ? 100 : 0);
                            const changeClass = changePerc >= 0 ? "positive" : "negative";
                            changeText = ` (<strong class="${changeClass}">${changePerc >= 0 ? '+' : ''}${changePerc.toFixed(1)}%</strong> vs anterior).`;
                        }
                        
                        const totalActual = catRevenue.totalCurrentPeriod || actualSeries.data.reduce((a,b) => a+b, 0);
                        const totalAnterior = catRevenue.totalPreviousPeriod || (anteriorSeries ? anteriorSeries.data.reduce((a,b) => a+b, 0) : 0);
                        const totalChangePerc = totalAnterior > 0 ? ((totalActual - totalAnterior) / totalAnterior) * 100 : (totalActual > 0 ? 100 : 0);
                        const totalChangeClass = totalChangePerc >= 0 ? "positive" : "negative";

                        narrativeHTML = `🛍️ Cat. Principal: <strong class="positive">${topCatName}</strong> con <strong class="positive">${formatCurrency(topCatActual, currency)}</strong>${changeText} 
                                         Total Actual: <strong class="${totalChangeClass}">${formatCurrency(totalActual, currency)}</strong> (<strong class="${totalChangeClass}">${totalChangePerc >=0 ? '+' : ''}${totalChangePerc.toFixed(1)}%</strong> vs <strong class="neutral">${formatCurrency(totalAnterior, currency)}</strong> anterior).`;
                    } else {
                        mainValueText = formatCurrency(0, currency);
                        narrativeHTML = `🛍️ Sin datos de rendimiento de categorías.`;
                    }
                } else {
                    mainValueText = formatCurrency(0, currency);
                    narrativeHTML = `🛍️ Sin datos de categorías de producto.`;
                }
                break;

            default:
                mainValueText = formatCurrency(filteredTotalRevenue, currency);
                const baseChange = baseKpiSummary.changeFromLastMonth;
                if (baseChange !== undefined) {
                    const changeClass = baseChange >= 0 ? 'positive' : 'negative';
                    narrativeHTML = `📈 Variación base del mes anterior: <strong class="${changeClass}">${baseChange >= 0 ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>'} ${Math.abs(baseChange).toFixed(1)}%</strong>.`;
                } else {
                    narrativeHTML = `ℹ️ Información general del KPI.`;
                }
        }
        revenueEl.textContent = mainValueText;
        narrativeEl.innerHTML = narrativeHTML;
        narrativeEl.className = 'change'; // Reset class, specific styles are inline
    }


    // ========================================================================== //
    // GENERACIÓN DEL RESUMEN EJECUTIVO GLOBAL
    // ========================================================================== //
    function generateExecutiveSummary(data) {
        const summaryContainer = document.getElementById('dynamicSummaryContent');
        const tipsContainer = document.getElementById('tipsAndNextSteps');

        if (!summaryContainer || !tipsContainer) {
            console.warn("Summary or tips container not found in HTML.");
            return;
        }
        
        if (!data || !originalData) { 
            summaryContainer.innerHTML = '<p class="text-danger">Error al generar el resumen: datos no disponibles.</p>';
            tipsContainer.innerHTML = '';
            return;
        }

        summaryContainer.innerHTML = ''; 
        tipsContainer.innerHTML = ''; 

        const { kpiSummary = {}, timeSeriesData = [], channelData = [] } = data; // Use filtered data here
        const originalKpiSummary = originalData.kpiSummary || {}; // For base targets, original changes
        const productCategoryRevenue = originalData.productCategoryRevenue || {}; // Use global for product categories
        const mainCurrency = kpiSummary.currency || originalKpiSummary.currency || '$';

        let summaryHTML = '';
        let tipsHTML = '';

        const totalRevenue = kpiSummary.totalRevenue !== undefined ? kpiSummary.totalRevenue : 0;

        summaryHTML += `<p><i class="fas fa-dollar-sign text-success"></i> Los <strong>ingresos totales</strong> para el período/filtros seleccionados ascienden a 
                        <strong class="metric-value highlight-positive">${formatCurrency(totalRevenue, mainCurrency)}</strong>. `;

        if (timeSeriesData && timeSeriesData.length > 1) { 
            const firstDayRevenue = timeSeriesData[0].value;
            const lastDayRevenue = timeSeriesData[timeSeriesData.length - 1].value;
            const avgDailyRevenue = totalRevenue / timeSeriesData.length;

            summaryHTML += `El promedio diario de ingresos fue de <strong class="metric-value">${formatCurrency(avgDailyRevenue, mainCurrency)}</strong>. `;
            
            if (lastDayRevenue > firstDayRevenue * 1.02) { // Added a small threshold
                summaryHTML += `Se observa una <span class="highlight-positive"><i class="fas fa-arrow-trend-up"></i> tendencia de crecimiento</span> durante este período. `;
                tipsHTML += `<li><span class="tip-icon">📈</span> ¡Excelente! Parece que las estrategias implementadas están dando frutos. Analiza los picos para replicar el éxito.</li>`;
            } else if (lastDayRevenue < firstDayRevenue * 0.98) { // Added a small threshold
                summaryHTML += `La tendencia general de ingresos muestra una <span class="highlight-negative"><i class="fas fa-arrow-trend-down"></i> ligera disminución</span> hacia el final del período. `;
                tipsHTML += `<li><span class="tip-icon">📉</span> Es momento de investigar las causas de la disminución en los ingresos. ¿Hubo cambios en el mercado o en la competencia?</li>`;
            } else {
                summaryHTML += `Los ingresos se mantuvieron relativamente estables. `;
            }
        } else if (timeSeriesData && timeSeriesData.length === 1) {
             summaryHTML += ` Solo hay datos para un día en el período seleccionado. `;
        } else {
            summaryHTML += `No hay datos de series temporales para analizar la tendencia con los filtros actuales. `;
        }
        summaryHTML += `</p>`;

        if (originalKpiSummary && originalKpiSummary.targetValue && originalKpiSummary.targetValue > 0) {
            const targetAchievedPercent = (totalRevenue / originalKpiSummary.targetValue) * 100;
            summaryHTML += `<p><i class="fas fa-bullseye text-info"></i> Respecto al objetivo base de <strong class="metric-value">${formatCurrency(originalKpiSummary.targetValue, mainCurrency)}</strong>, 
                            con los ingresos filtrados se ha alcanzado un <strong class="metric-value ${targetAchievedPercent >= 100 ? 'highlight-positive' : 'highlight-negative'}">${targetAchievedPercent.toFixed(1)}%</strong>. `;
            if (targetAchievedPercent >= 100) {
                summaryHTML += `¡Felicitaciones por superar la meta! 🎉`;
                tipsHTML += `<li><span class="tip-icon">🏆</span> ¡Meta de ingresos superada (vs objetivo base)! Considera establecer objetivos más ambiciosos para el próximo período.</li>`;
            } else if (targetAchievedPercent >= 80) {
                summaryHTML += `Estás cerca de alcanzar el objetivo base. ¡Sigue así! 👍`;
                tipsHTML += `<li><span class="tip-icon">🎯</span> Muy cerca del objetivo de ingresos base. Un pequeño empujón adicional podría ser suficiente.</li>`;
            } else {
                summaryHTML += `Hay una oportunidad de mejora para alcanzar el objetivo base. 🧐`;
                tipsHTML += `<li><span class="tip-icon">🛠️</span> El objetivo de ingresos base no se alcanzó con los filtros actuales. Revisa las estrategias y ajusta el plan de acción.</li>`;
            }
            summaryHTML += `</p>`;
        }

        if (originalKpiSummary && originalKpiSummary.hasOwnProperty('changeFromLastMonth')) {
            const changeLM = originalKpiSummary.changeFromLastMonth;
            summaryHTML += `<p><i class="fas fa-calendar-alt ${changeLM >= 0 ? 'text-success' : 'text-danger'}"></i> Comparado con el mes anterior (según datos globales), hubo un 
                            <span class="${changeLM >= 0 ? 'highlight-positive' : 'highlight-negative'}">
                            ${changeLM >= 0 ? '<i class="fas fa-caret-up"></i> aumento' : '<i class="fas fa-caret-down"></i> descenso'} 
                            del ${Math.abs(changeLM).toFixed(1)}%</span>. `;
            if (changeLM > 5) {
                 summaryHTML += `¡Un crecimiento notable! 🚀`;
                 tipsHTML += `<li><span class="tip-icon">🌟</span> El crecimiento base respecto al mes anterior fue significativo. Mantén esas estrategias.</li>`;
            } else if (changeLM < -5) {
                summaryHTML += `Es importante analizar esta variación base. 📉`;
                tipsHTML += `<li><span class="tip-icon">⚠️</span> El descenso base comparado con el mes anterior requiere atención.</li>`;
            }
            summaryHTML += `</p>`;
        }

        if (channelData && channelData.length > 0) {
            const sortedChannels = [...channelData].sort((a, b) => b.value - a.value).filter(c => c.value > 0);
            if (sortedChannels.length > 0) { 
                const topChannel = sortedChannels[0];
                summaryHTML += `<p><i class="fas fa-network-wired text-info"></i> En cuanto a canales (para el período/selección actual), 
                                <strong class="metric-value highlight-neutral">${topChannel.name}</strong> 
                                ${sortedChannels.length > 1 ? 'lidera' : 'es el único activo/seleccionado'} con un <strong class="metric-value">${topChannel.value.toFixed(1)}%</strong> de contribución. `;
                
                if (sortedChannels.length > 1) {
                    const worstChannel = sortedChannels[sortedChannels.length - 1];
                     if (topChannel.name !== worstChannel.name && worstChannel.value < topChannel.value && worstChannel.value < (topChannel.value / 2) ) { 
                        summaryHTML += `Mientras que <strong class="metric-value highlight-negative">${worstChannel.name}</strong> 
                                        presenta el menor rendimiento (<strong class="metric-value">${worstChannel.value.toFixed(1)}%</strong>). `;
                        tipsHTML += `<li><span class="tip-icon">📢</span> Potencia el canal <strong class="highlight-neutral">${topChannel.name}</strong> y analiza estrategias para mejorar <strong class="highlight-negative">${worstChannel.name}</strong>.</li>`;
                    }
                }
                summaryHTML += `</p>`;
            }
        }

        if (productCategoryRevenue && productCategoryRevenue.categories && productCategoryRevenue.categories.length > 0 && productCategoryRevenue.series) {
            const currentPeriodSeries = productCategoryRevenue.series.find(s => s.name === "Actual" || s.name === "Current Period"); 
            if (currentPeriodSeries && currentPeriodSeries.data) {
                const categoryPerformance = productCategoryRevenue.categories.map((cat, index) => ({
                    name: cat,
                    revenue: currentPeriodSeries.data[index] || 0
                })).sort((a, b) => b.revenue - a.revenue);

                if (categoryPerformance.length > 0 && categoryPerformance[0].revenue > 0) { 
                    const topCategory = categoryPerformance[0];
                    summaryHTML += `<p><i class="fas fa-tags text-purple"></i> En el rendimiento general por categoría de producto (datos globales), 
                                    <strong class="metric-value highlight-positive">${topCategory.name}</strong> es la principal, generando 
                                    <strong class="metric-value">${formatCurrency(topCategory.revenue, mainCurrency)}</strong>. `;
                    if (categoryPerformance.length > 1) {
                        const bottomCategory = categoryPerformance[categoryPerformance.length -1];
                        if (topCategory.name !== bottomCategory.name && bottomCategory.revenue < topCategory.revenue) {
                            summaryHTML += `Por otro lado, <strong class="metric-value highlight-negative">${bottomCategory.name}</strong> 
                                            es la categoría con menores ingresos globales (<strong class="metric-value">${formatCurrency(bottomCategory.revenue, mainCurrency)}</strong>). `;
                            tipsHTML += `<li><span class="tip-icon">🛍️</span> A nivel global, considera promociones para <strong class="highlight-negative">${bottomCategory.name}</strong> y asegura stock de <strong class="highlight-positive">${topCategory.name}</strong>.</li>`;
                        }
                    }
                    summaryHTML += `</p>`;
                } else { 
                    summaryHTML += `<p><i class="fas fa-tags text-muted"></i> No hay datos de ingresos significativos en las categorías de productos globales. </p>`;
                }
            }
        }
        
        if (summaryHTML.trim() === '' || ( (timeSeriesData && timeSeriesData.length === 0) && summaryHTML.includes('No hay datos de series temporales para analizar la tendencia con los filtros actuales.')) ) {
            summaryContainer.innerHTML = '<p class="loading-summary">No hay suficientes datos para los filtros seleccionados. Por favor, ajuste los filtros.</p>';
        } else {
            summaryContainer.innerHTML = summaryHTML;
        }
        tipsContainer.innerHTML = tipsHTML || '<li><span class="tip-icon">🧐</span> Explora los diferentes filtros para obtener insights más específicos.</li>';
    }
    
    // ========================================================================== //
    // PROCESAMIENTO DE DATOS Y RENDERIZADO DE GRÁFICOS
    // ========================================================================== //
    function processAndDisplayData(dataToDisplay) {
        console.log("Processing data for display (processAndDisplayData):", JSON.parse(JSON.stringify(dataToDisplay)));

        document.querySelectorAll('.kpi-card').forEach(card => {
            const chartDiv = card.querySelector('div[id^="chart"]');
            if (!chartDiv) return;
            const chartId = chartDiv.id;
            // Call the narrative generator for each card
            generateKpiCardNarrative(card, chartId, dataToDisplay, originalData);

            // Specific updates for elements not handled by generateKpiCardNarrative (like progress bars that need explicit values)
            switch (chartId) {
                 case 'chartTargetLine': // Also has a target bar to update
                    const baseKpiSum = originalData.kpiSummary || {};
                    const targetVal = baseKpiSum.targetValue || 0;
                    const currentFilteredRev = dataToDisplay.kpiSummary.totalRevenue || 0;
                    const targetPercent = targetVal > 0 ? (currentFilteredRev / targetVal) * 100 : 0;
                    
                    const targetValueLabelEl = card.querySelector('.target-value-label');
                    if(targetValueLabelEl) targetValueLabelEl.textContent = formatCurrency(targetVal, baseKpiSum.currency || '$');
                    const progressFillEl = card.querySelector('.progress-fill');
                    if(progressFillEl) progressFillEl.style.width = Math.min(targetPercent, 100) + '%';
                    break;
                // chartProgressLine's progress bar is now updated within generateKpiCardNarrative
            }
        });

        // --- RENDER CHARTS ---
        if (dataToDisplay.timeSeriesData && dataToDisplay.timeSeriesData.length > 0) {
            let trendDataMain = [];
            if (dataToDisplay.timeSeriesData.length >= 2) {
                 const xValues = dataToDisplay.timeSeriesData.map((_, i) => i);
                 const yValues = dataToDisplay.timeSeriesData.map(d => d.value);
                 let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0; const n = xValues.length;
                 for(let i=0; i<n; i++) { sumX += xValues[i]; sumY += yValues[i]; sumXY += xValues[i] * yValues[i]; sumXX += xValues[i] * xValues[i]; }
                 const slope = (n * sumXX - sumX * sumX) === 0 ? 0 : (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
                 const intercept = n === 0 ? 0 : (sumY - slope * sumX) / n;
                 trendDataMain = dataToDisplay.timeSeriesData.map((d,i) => ({ x: new Date(d.date).getTime(), y: intercept + slope * i }));
            }
            const seriesForMainTS = [{ name: 'Ingresos', data: dataToDisplay.timeSeriesData.map(item => ({x: new Date(item.date).getTime(), y: item.value })), type: 'area' }];
            if (trendDataMain.length > 0) seriesForMainTS.push({ name: 'Tendencia', data: trendDataMain, type: 'line'});

            renderChart('chartTimeSeries', {
                ...commonChartOptions,
                chart: { ...commonChartOptions.chart, height: 200, id: 'chartTimeSeries' },
                series: seriesForMainTS,
                colors: ['#007bff', '#28a745'],
                stroke: { width: [2, 2], dashArray: [0, 5], curve: ['smooth', 'straight'] },
                fill: { type: ['gradient', 'solid'], gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100]}},
                legend: { show: false }
            });
        } else {
            renderChart('chartTimeSeries', { ...commonChartOptions, series: [], chart: { ...commonChartOptions.chart, height: 200, id: 'chartTimeSeries', type:'area' }});
        }

        if (dataToDisplay.timeSeriesData && dataToDisplay.timeSeriesData.length > 0 && originalData.kpiSummary && originalData.kpiSummary.targetValue) {
            const displayTimeSeries = dataToDisplay.timeSeriesData.slice(0, Math.min(25, dataToDisplay.timeSeriesData.length));
            renderChart('chartTargetLine', {
                ...commonChartOptions,
                chart: { ...commonChartOptions.chart, height: 180, id: 'chartTargetLine', type:'area'},
                series: [{ name: 'Ingresos', data: displayTimeSeries.map(item => ({x: new Date(item.date).getTime(), y: item.value })) }],
                colors: ['#007bff'],
                fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100]}},
                annotations: { yaxis: [{ y: originalData.kpiSummary.targetValue, borderColor: '#dc3545', label: { text: 'Meta', style: { color: '#fff', background: '#dc3545', fontSize: '9px'}, offsetY: -3 }}]},
                yaxis: { ...commonChartOptions.yaxis, max: Math.max(...displayTimeSeries.map(d=>d.value), originalData.kpiSummary.targetValue) * 1.2 }
            });
        } else {
            renderChart('chartTargetLine', { ...commonChartOptions, series: [], chart: { ...commonChartOptions.chart, height: 180, id: 'chartTargetLine', type:'area' }});
        }

        if (dataToDisplay.timeSeriesData && dataToDisplay.timeSeriesData.length > 0) {
            const trendlineDisplayData = dataToDisplay.timeSeriesData.slice(0, Math.min(25, dataToDisplay.timeSeriesData.length));
            let trendData = [];
            if (trendlineDisplayData.length >= 2) {
                 const xValues = trendlineDisplayData.map((_, i) => i);
                 const yValues = trendlineDisplayData.map(d => d.value);
                 let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0; const n = xValues.length;
                 for(let i=0; i<n; i++) { sumX += xValues[i]; sumY += yValues[i]; sumXY += xValues[i] * yValues[i]; sumXX += xValues[i] * xValues[i]; }
                 const slope = (n * sumXX - sumX * sumX) === 0 ? 0 : (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
                 const intercept = n === 0 ? 0 : (sumY - slope * sumX) / n;
                 trendData = trendlineDisplayData.map((d,i) => ({ x: new Date(d.date).getTime(), y: intercept + slope * i }));
            }
            // Assuming trendlineTargetRangeData is global and not filtered
            const targetRangeSeriesData = (originalData.trendlineTargetRangeData && originalData.trendlineTargetRangeData.length > 0) ?
                originalData.trendlineTargetRangeData.map(d => ({ x: new Date(d.date).getTime(), y: d.value })) : [];
            
            const seriesForTrendline = [{ name: 'Ingresos', data: trendlineDisplayData.map(d => ({ x: new Date(d.date).getTime(), y: d.value })), type: 'line' }];
            if (trendData.length > 0) seriesForTrendline.push({ name: 'Tendencia', data: trendData, type: 'line'});
            if (targetRangeSeriesData.length > 0) seriesForTrendline.push({ name: 'Rango Objetivo', data: targetRangeSeriesData, type: 'area' });
            
            renderChart('chartTimeSeriesTrendline', {
                ...commonChartOptions, chart: { ...commonChartOptions.chart, height: 200, id: 'chartTimeSeriesTrendline' },
                series: seriesForTrendline, colors: ['#007bff', '#28a745', '#adb5bd'],
                stroke: { width: [2, 2, 1], dashArray: [0, 5, 0], curve: ['smooth', 'straight', 'straight'] },
                fill: { type: ['solid', 'solid', 'gradient'], gradient: { shadeIntensity: 0.5, opacityFrom: 0.3, opacityTo: 0.1, stops: [0, 90, 100]}},
                markers: { size: [0,0,0] }, legend: { show: targetRangeSeriesData.length > 0 }
            });
        } else {
            renderChart('chartTimeSeriesTrendline', { ...commonChartOptions, series: [], chart: { ...commonChartOptions.chart, height: 200, id: 'chartTimeSeriesTrendline' }});
        }

        if (dataToDisplay.timeSeriesData && dataToDisplay.timeSeriesData.length > 0) {
            const displayProgressData = dataToDisplay.timeSeriesData.slice(0, Math.min(25, dataToDisplay.timeSeriesData.length));
            renderChart('chartProgressLine', {
                ...commonChartOptions, chart: { ...commonChartOptions.chart, height: 180, id: 'chartProgressLine', type:'area' },
                series: [{ name: 'Actual', data: displayProgressData.map(d => ({ x: new Date(d.date).getTime(), y: d.value })) }],
                colors: ['#0d6efd'], stroke: { width: [2], curve: ['smooth']},
                fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100]}},
                annotations: { yaxis: (originalData.progressLineTrendValue !== null && originalData.progressLineTrendValue !== undefined) ? [{ y: originalData.progressLineTrendValue, borderColor: '#dc3545', strokeDashArray: 4, label: { text: 'Tend. Previa', style: { color: '#fff', background: '#dc3545', fontSize: '9px'}, offsetY: -3}}] : [] },
                markers: { size: [0] }
            });
        } else {
            renderChart('chartProgressLine', { ...commonChartOptions, series: [], chart: { ...commonChartOptions.chart, height: 180, id: 'chartProgressLine', type:'area' }});
        }

        // Uses global data from originalData
        const stackedComboDt = originalData.stackedComboData;
        if (stackedComboDt && stackedComboDt.series && stackedComboDt.series.length > 0) {
            renderChart('chartStackedCombo', {
                chart: { height: 220, type: 'line', stacked: false, toolbar: { show: false }, id: 'chartStackedCombo' },
                series: stackedComboDt.series, xaxis: { ...commonChartOptions.xaxis, type: 'category', categories: stackedComboDt.categories, labels:{style:{fontSize:'9px'}} },
                yaxis: { ...commonChartOptions.yaxis }, colors: ['#007bff', '#dc3545', '#28a745'], stroke: { width: [0, 0, 3], curve: ['smooth','smooth','straight']},
                plotOptions: { bar: { horizontal: false, columnWidth: '60%', borderRadius: 4, dataLabels: { position: 'top'}, stacked: true } },
                legend: { show: true, position: 'top', horizontalAlign: 'right', fontSize: '10px', offsetY: -5, markers: {width:10, height:10}}, dataLabels: { enabled: false }
            });
        } else {
             const el = document.getElementById('chartStackedCombo'); if (el) el.innerHTML = '<p class="text-center text-muted small p-3">No hay datos globales para este gráfico.</p>';
        }

        if (dataToDisplay.timeSeriesData && dataToDisplay.timeSeriesData.length > 0) {
            const verticalDt = dataToDisplay.timeSeriesData.slice(Math.max(0, dataToDisplay.timeSeriesData.length - 6));
            renderChart('chartVerticalBar', {
                ...commonChartOptions, chart: { ...commonChartOptions.chart, type: 'bar', height: 200, id: 'chartVerticalBar' },
                series: [{ name: 'Ingresos', data: verticalDt.map(d=>d.value) }], colors: ['#007bff'],
                plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 2 }},
                xaxis: { ...commonChartOptions.xaxis, type: 'category', categories: verticalDt.map(d => new Date(d.date + "T00:00:00").toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })) },
                yaxis: { ...commonChartOptions.yaxis, tickAmount: 3 }
            });
        } else {
            renderChart('chartVerticalBar', { ...commonChartOptions, series: [], chart: { ...commonChartOptions.chart, type: 'bar', height: 200, id: 'chartVerticalBar' }});
        }

        // Uses filtered data.boxplotData
        if (dataToDisplay.boxplotData && dataToDisplay.boxplotData.length > 0) {
            renderChart('chartBoxplot', {
                ...commonChartOptions, chart: { ...commonChartOptions.chart, type: 'boxPlot', height: 220, id: 'chartBoxplot' },
                series: [{ name: 'Ingresos por Región', type: 'boxPlot', data: dataToDisplay.boxplotData.map(item => ({ x: item.x, y: item.y })) }],
                xaxis: { ...commonChartOptions.xaxis, type: 'category', categories: dataToDisplay.boxplotData.map(d => d.x) }, colors: ['#007bff'],
                plotOptions: { boxPlot: { colors: { upper: '#007bff', lower: '#6cb2eb' }}},
                tooltip: { shared: false, intersect: true, custom: function({series, seriesIndex, dataPointIndex, w}) {
                        const dataVal = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y; const category = w.globals.labels[dataPointIndex];
                        return `<div class="arrow_box"><span><b>${category}</b></span><br>Max: ${formatCurrency(dataVal[4])}<br>Q3: ${formatCurrency(dataVal[3])}<br>Mediana: ${formatCurrency(dataVal[2])}<br>Q1: ${formatCurrency(dataVal[1])}<br>Min: ${formatCurrency(dataVal[0])}</div>`;
                }}
            });
        } else {
             const el = document.getElementById('chartBoxplot'); if (el) el.innerHTML = '<p class="text-center text-muted small p-3">No hay datos de boxplot para el filtro actual.</p>';
        }

        // Uses filtered data.channelData
        if (dataToDisplay.channelData && dataToDisplay.channelData.length > 0) {
            const top3Channels = [...dataToDisplay.channelData].sort((a,b) => b.value - a.value).slice(0, 3).filter(c => c.value > 0);
            if (top3Channels.length > 0) {
                renderChart('chartTopChannelsVertical', {
                    ...commonChartOptions, chart: { type: 'bar', height: 190, id: 'chartTopChannelsVertical', toolbar: {show: false} },
                    series: [{ name: 'Top Canales', data: top3Channels.map(item => item.value) }],
                    xaxis: { categories: top3Channels.map(item => item.name), labels: {show: true, rotate: -30, trim: true, style: { fontSize: '10px', colors: '#6c757d' }}},
                    yaxis: { ...commonChartOptions.yaxis, labels: { formatter: function (val) { return val.toFixed(1) + '%'; } }},
                    colors: ['#28a745', '#208b3a', '#1a7431'], plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 3, distributed: true }},
                    dataLabels: { enabled: false }, legend: {show: false}
                });
            } else {
                 const el = document.getElementById('chartTopChannelsVertical'); if(el) el.innerHTML = '<p class="text-center text-muted small p-3">No hay datos de canales.</p>';
            }
        } else {
            const el = document.getElementById('chartTopChannelsVertical'); if(el) el.innerHTML = '<p class="text-center text-muted small p-3">No hay datos de canales para el filtro actual.</p>';
        }

        // Uses filtered data.channelData
        if (dataToDisplay.channelData && dataToDisplay.channelData.filter(c=>c.value > 0).length > 0) {
            const activeChannels = dataToDisplay.channelData.filter(c=>c.value > 0);
            renderChart('chartDonut', {
                chart: { type: 'donut', height: 250, parentHeightOffset: 0, id: 'chartDonut' },
                series: activeChannels.map(item => item.value), 
                labels: activeChannels.map(item => item.name),
                colors: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'], // Add more if more channels
                plotOptions: { pie: { donut: { size: '70%', labels: { show: true, name: { show: false }, value: { show: false },
                    total: { show: true, showAlways: true, label: 'Total', fontSize: '14px', fontWeight: 500, color: '#373d3f',
                             formatter: () => formatCurrency(dataToDisplay.kpiSummary.totalRevenue, dataToDisplay.kpiSummary.currency || '$') }
                }}}},
                legend: { show: true, position: 'right', horizontalAlign: 'center', fontSize: '11px', itemMargin: { horizontal: 5, vertical: 3}, markers: {width:10, height:10, radius: 5} },
                dataLabels: { 
                    enabled: true, 
                    formatter: (val, opts) => { return val.toFixed(1) + "%"; },
                    style: { fontSize: '9px', colors: ['#fff'], },
                    dropShadow: { enabled: true, top: 1, left: 1, blur: 1, opacity: 0.45 }
                }, 
                tooltip: { y: { formatter: (val) => val.toFixed(1) + "%", title: { formatter: (seriesName) => seriesName } }, fillSeriesColor: false },
                states: { hover: { filter: { type: 'lighten', value: 0.05 }}},
                responsive: [{ breakpoint: 480, options: { chart: { width: '100%' }, legend: { position: 'bottom' } }}]
            });
        } else {
            renderChart('chartDonut', { chart: { type: 'donut', height: 250, id: 'chartDonut' }, series: [], labels: [] });
            const el = document.getElementById('chartDonut'); if(el) el.innerHTML = '<p class="text-center text-muted small p-3">No hay datos de canales para el filtro actual.</p>';
        }

        // Uses global data from originalData
        const stackedBarDt = originalData.stackedBar100Data;
        if (stackedBarDt && stackedBarDt.series && stackedBarDt.series.length > 0) {
            renderChart('chartStackedBar100', {
                ...commonChartOptions, chart: { ...commonChartOptions.chart, type: 'bar', stacked: true, stackType: '100%', height: 220, id: 'chartStackedBar100' },
                series: stackedBarDt.series, xaxis: { ...commonChartOptions.xaxis, type: 'category', categories: stackedBarDt.categories },
                yaxis: { labels: { formatter: function (val) { return val.toFixed(0) + '%'; } }}, colors: ['#007bff', '#28a745', '#ffc107', '#6f42c1'],
                plotOptions: { bar: { horizontal: false, borderRadius: 2 } },
                legend: { show: true, position: 'top', horizontalAlign: 'left', fontSize: '10px', offsetY: -5, markers: {width:10, height:10}},
                tooltip: { y: { formatter: (val) => val.toFixed(1) + "%" } }
            });
        } else {
             const el = document.getElementById('chartStackedBar100'); if (el) el.innerHTML = '<p class="text-center text-muted small p-3">No hay datos globales para este gráfico.</p>';
        }

        // Uses global data from originalData
        const stackedAreaDt = originalData.stackedArea100Data;
        if (stackedAreaDt && stackedAreaDt.seriesFactors && stackedAreaDt.seriesFactors.length > 0) {
            const areaCategories = Array.from({length: stackedAreaDt.numPoints || 20}, (_, i) => {
                let date = new Date(stackedAreaDt.startDate || '2024-01-01'); date.setDate(date.getDate() + (i*3)); return date.getTime();
            });
            const areaSeries = stackedAreaDt.seriesFactors.map(factor => ({
                name: factor.name, data: areaCategories.map(() => Math.random() * (factor.factor || 0.1) * 100 + (factor.base || 5))
            }));
            renderChart('chartStackedArea100', {
                ...commonChartOptions, chart: { ...commonChartOptions.chart, type: 'area', stacked: true, stackType: '100%', height: 220, id: 'chartStackedArea100' },
                series: areaSeries, xaxis: { ...commonChartOptions.xaxis, type: 'datetime', categories: areaCategories, labels: { format: 'MMM dd'}},
                yaxis: { labels: { formatter: function (val) { return val.toFixed(0) + '%'; } }}, colors: ['#007bff', '#28a745', '#ffc107', '#6f42c1', '#fd7e14'],
                stroke: { width: 1, curve: 'smooth' }, fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.2 } },
                legend: { show: true, position: 'top', horizontalAlign: 'left', fontSize: '10px', offsetY: -5, markers: {width:10, height:10}},
                tooltip: { y: { formatter: (val) => val.toFixed(1) + "%" } }
            });
        } else {
             const el = document.getElementById('chartStackedArea100'); if (el) el.innerHTML = '<p class="text-center text-muted small p-3">No hay datos globales para este gráfico.</p>';
        }

        // Uses global data from originalData.productCategoryRevenue
        const productCatRev = originalData.productCategoryRevenue;
        if (productCatRev && productCatRev.series && productCatRev.categories && productCatRev.categories.length > 0) {
            renderChart('chartCategoryHorizontalBar', {
                ...commonChartOptions, chart: { type: 'bar', height: 230, id: 'chartCategoryHorizontalBar', stacked: true, toolbar:{show: false}},
                series: productCatRev.series, 
                colors: ['#007bff', '#6c757d'], 
                plotOptions: { bar: { horizontal: true, borderRadius: 3, barHeight: '65%', dataLabels: {
                    total: { enabled: true, formatter: (val) => (val > 0 ? formatCurrency(val/1000, productCatRev.currency || '$').slice(0,-1) + 'k' : ''), style: { fontSize: '9px', fontWeight: 600, colors: ['#444']}, offsetX: 5 }
                }}},
                xaxis: { categories: productCatRev.categories, title: { text: 'Ingresos', style: {fontSize: '10px', color: '#6c757d'}}, labels: { formatter: (val) => (val/1000).toFixed(0) + 'k' } },
                yaxis: { labels: { show: true, style: { fontSize: '10px', colors: '#495057', fontWeight: 400 }, minWidth: 80, maxWidth: 150 }},
                legend: { position: 'top', horizontalAlign: 'right', fontSize: '10px', offsetY: -5, markers: {width:10, height:10}},
                dataLabels: { enabled: false }, tooltip: { y: { formatter: (val) => formatCurrency(val, productCatRev.currency || '$') } }
            });
        } else {
            const el = document.getElementById('chartCategoryHorizontalBar'); if (el) el.innerHTML = '<p class="text-center text-muted small p-3">No hay datos globales de categoría de producto.</p>';
        }
        
        generateExecutiveSummary(dataToDisplay); // Global summary
    }

    // ========================================================================== //
    // LÓGICA DE FILTROS
    // ========================================================================== //
    let filterTimeout = null;

    function applyAllFiltersWithDebounce() {
        if (!originalData) {
            console.warn("Original data not loaded. Cannot apply filters yet.");
            return;
        }
        if (filterTimeout) {
            clearTimeout(filterTimeout);
        }
        filterTimeout = setTimeout(() => {
            applyFiltersImmediate();
        }, 300);
    }

    function applyFiltersImmediate() {
        if (!originalData) {
            console.warn("Original data not loaded. Cannot apply filters.");
            return;
        }
        if (filterTimeout) {
            clearTimeout(filterTimeout);
            filterTimeout = null;
        }

        const startDateValue = document.getElementById('startDate').value;
        const endDateValue = document.getElementById('endDate').value;
        const selectedChannel = document.getElementById('channelFilter').value;
        const selectedRegion = document.getElementById('regionFilter').value;

        console.log('Applying filters:', { startDateValue, endDateValue, selectedChannel, selectedRegion });

        // Start with a deep copy of originalData for sections that are NOT filtered or calculated dynamically
        let dataForProcessing = JSON.parse(JSON.stringify(originalData));
        
        // Filter timeSeriesData (this is the primary data source for many dynamic calculations)
        let currentFilteredTimeSeries = JSON.parse(JSON.stringify(originalData.timeSeriesData || []));

        if (startDateValue && endDateValue) {
            try {
                const startDt = new Date(startDateValue + "T00:00:00");
                const endDt = new Date(endDateValue + "T23:59:59");
                if (!isNaN(startDt.getTime()) && !isNaN(endDt.getTime()) && startDt <= endDt) {
                    currentFilteredTimeSeries = currentFilteredTimeSeries.filter(item => {
                        const itemDate = new Date(item.date); // Assuming item.date is 'YYYY-MM-DD'
                        return itemDate >= startDt && itemDate <= endDt;
                    });
                } else if (startDt > endDt) { console.warn("Start date is after end date."); }
                  else { console.warn("Invalid start or end date."); }
            } catch (e) { console.warn("Error parsing dates.", e); }
        }

        if (selectedChannel !== 'all') {
            currentFilteredTimeSeries = currentFilteredTimeSeries.filter(item => item.channel === selectedChannel);
        }
        if (selectedRegion !== 'all') {
            currentFilteredTimeSeries = currentFilteredTimeSeries.filter(item => item.region === selectedRegion);
        }
        dataForProcessing.timeSeriesData = currentFilteredTimeSeries;
        
        // Recalculate totalRevenue for kpiSummary based on filtered timeSeriesData
        const newTotalRevenue = (dataForProcessing.timeSeriesData || []).reduce((sum, item) => sum + (item.value || 0), 0);
        
        // Update kpiSummary: keep original base values, only update totalRevenue
        dataForProcessing.kpiSummary = {
            ...(originalData.kpiSummary || {}), 
            totalRevenue: newTotalRevenue,
            currency: (originalData.kpiSummary && originalData.kpiSummary.currency) || '$'
        };

        // Recalculate channelData percentages based on filtered timeSeriesData
        if (originalData.channelData && Array.isArray(originalData.channelData)) {
            const revenueByChannelForDonut = {};
            (originalData.channelData.map(c => c.channel) || []).forEach(chKey => {
                if (chKey) revenueByChannelForDonut[chKey] = 0;
            });
            
            dataForProcessing.timeSeriesData.forEach(item => { // Use the ALREADY filtered time series
                if (item.channel && revenueByChannelForDonut.hasOwnProperty(item.channel)) {
                    revenueByChannelForDonut[item.channel] += (item.value || 0);
                }
            });

            const totalRevenueForDonutCalc = Object.values(revenueByChannelForDonut).reduce((s,v) => s+v, 0);
            
            if (selectedChannel === 'all') {
                dataForProcessing.channelData = originalData.channelData.map(cd => ({
                    ...cd, // name, channel key
                    value: totalRevenueForDonutCalc > 0 ? ((revenueByChannelForDonut[cd.channel] || 0) / totalRevenueForDonutCalc) * 100 : 0
                }));
            } else { // Single channel selected
                 const targetChannelInfo = originalData.channelData.find(item => item.channel === selectedChannel);
                 dataForProcessing.channelData = targetChannelInfo ? [{...targetChannelInfo, value: 100}] : [];
            }
        } else { dataForProcessing.channelData = []; }


        // Filter boxplotData based on selectedRegion
        if (originalData.boxplotData && Array.isArray(originalData.boxplotData)) {
            if (selectedRegion === 'all') {
                dataForProcessing.boxplotData = JSON.parse(JSON.stringify(originalData.boxplotData));
            } else {
                const regionMap = { 
                    'africa': 'AFRICA', 'america_norte': 'AMERICA NORTE', 'america_sur': 'AMERICA SUR', 
                    'latinoamerica': 'LATINOAMÉRICA', 'asia': 'ASIA', 'europa': 'EUROPA', 'oceania': 'OCEANIA' 
                };
                const regionKey = regionMap[selectedRegion];
                dataForProcessing.boxplotData = regionKey ? originalData.boxplotData.filter(item => item.x === regionKey) : [];
            }
        } else { dataForProcessing.boxplotData = []; }

        // Sections that use GLOBAL data from originalData are already set by the initial deep copy
        // e.g., productCategoryRevenue, stackedComboData, trendlineTargetRangeData, progressLineTrendValue, 
        // stackedBar100Data, stackedArea100Data. No specific action needed here for them.

        console.log('Data prepared for display (final):', JSON.parse(JSON.stringify(dataForProcessing)));
        processAndDisplayData(dataForProcessing);
    }

    // ========================================================================== //
    // INICIALIZACIÓN Y CARGA DE DATOS
    // ========================================================================== //
    document.getElementById('applyFilters').addEventListener('click', applyFiltersImmediate);
    document.getElementById('startDate').addEventListener('change', applyAllFiltersWithDebounce);
    document.getElementById('endDate').addEventListener('change', applyAllFiltersWithDebounce);
    document.getElementById('channelFilter').addEventListener('change', applyAllFiltersWithDebounce);
    document.getElementById('regionFilter').addEventListener('change', applyAllFiltersWithDebounce);

    async function fetchAndInitializeApp() {
        console.log('Initializing dashboard by fetching data...');
        try {
            const response = await fetch('data1.json'); 
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}.`);
            
            let loadedData = await response.json();
            
            // Ensure kpiSummary exists and has a totalRevenue, even if timeSeriesData is empty
            if (!loadedData.kpiSummary) loadedData.kpiSummary = { currency: '$' }; // Default currency
            if (loadedData.kpiSummary.totalRevenue === undefined) {
                 // Calculate initial totalRevenue from all timeSeriesData if not present in kpiSummary
                 const initialTotalRevenue = (loadedData.timeSeriesData && Array.isArray(loadedData.timeSeriesData)) ?
                                           loadedData.timeSeriesData.reduce((sum, item) => sum + (item.value || 0), 0) : 0;
                 loadedData.kpiSummary.totalRevenue = initialTotalRevenue;
            }
            
            originalData = loadedData; // Store the fully loaded and potentially augmented data

            const startDateInput = document.getElementById('startDate');
            const endDateInput = document.getElementById('endDate');
            if (originalData.timeSeriesData && originalData.timeSeriesData.length > 0) {
                // Sort by date to be sure
                originalData.timeSeriesData.sort((a, b) => new Date(a.date) - new Date(b.date));
                const firstDateEntry = originalData.timeSeriesData[0];
                const lastDateEntry = originalData.timeSeriesData[originalData.timeSeriesData.length - 1];
                
                if (firstDateEntry && firstDateEntry.date && lastDateEntry && lastDateEntry.date) {
                    // Make sure date format is YYYY-MM-DD for input fields
                    const formatDateForInput = (dateStr) => {
                        try { return new Date(dateStr).toISOString().split('T')[0]; }
                        catch { return dateStr; } // Fallback
                    }
                    startDateInput.value = formatDateForInput(firstDateEntry.date);
                    endDateInput.value = formatDateForInput(lastDateEntry.date);
                } else {
                    console.warn("Dates in timeSeriesData are invalid or missing. Using HTML default dates.");
                }
            } else {
                 console.warn("timeSeriesData is empty or missing. Using HTML default dates.");
            }
            
            applyFiltersImmediate(); 
            console.log('Dashboard initialized.');

        } catch (error) {
            console.error("Failed to fetch or initialize dashboard:", error);
            const mainGrid = document.querySelector('.kpi-grid');
            if(mainGrid) mainGrid.innerHTML = `<p class="text-danger p-3 text-center">Error loading dashboard data. Details: ${error.message}</p>`;
            
            // Fallback originalData structure for graceful failure of charts/summaries
            originalData = { 
                kpiSummary:{totalRevenue:0, currency: '$', targetValue:0, overallTarget:0, changeFromLastMonth:0}, 
                timeSeriesData:[], channelData:[], boxplotData:[], 
                stackedComboData:{series:[], categories:[]}, 
                productCategoryRevenue:{categories:[], series:[], totalCurrentPeriod:0, totalPreviousPeriod:0},
                trendlineTargetRangeData: [], progressLineTrendValue: null,
                stackedBar100Data: {series:[], categories:[]},
                stackedArea100Data: {seriesFactors:[], numPoints:0, startDate: new Date().toISOString().split('T')[0]}
            };
            generateExecutiveSummary(null); 
            processAndDisplayData(JSON.parse(JSON.stringify(originalData))); // Attempt to render with empty/default data
        }
    }
    fetchAndInitializeApp();
    
});