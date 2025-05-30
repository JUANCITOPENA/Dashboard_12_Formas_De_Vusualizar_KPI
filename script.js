document.addEventListener('DOMContentLoaded', function () {

    // --- LÓGICA DE LA VENTANA MODAL DE PERFIL ---
    const profileModal = document.getElementById('profileModal');
    const profileImageHeader = document.getElementById('profileImageHeader');
    const juancitoFooterName = document.getElementById('juancitoFooterName');
    const profileImageFooter = document.getElementById('profileImageFooter');
    const closeModalButton = document.querySelector('.profile-modal-close');

    function openProfileModal() {
        if (profileModal) {
            profileModal.style.display = 'block';
        }
    }

    function closeProfileModal() {
        if (profileModal) {
            profileModal.style.display = 'none';
        }
    }

    if (profileImageHeader) {
        profileImageHeader.addEventListener('click', openProfileModal);
    }
    if (juancitoFooterName) {
        juancitoFooterName.addEventListener('click', openProfileModal);
    }
    if (profileImageFooter) {
        profileImageFooter.addEventListener('click', openProfileModal);
    }
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeProfileModal);
    }
    window.addEventListener('click', function(event) {
        if (event.target === profileModal) {
            closeProfileModal();
        }
    });
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && profileModal && profileModal.style.display === 'block') {
            closeProfileModal();
        }
    });
    // --- FIN DE LÓGICA DE LA VENTANA MODAL DE PERFIL ---


    let originalData = null;

    function formatCurrency(value, currencySymbol = '$') {
        if (typeof value !== 'number' || isNaN(value)) value = 0;
        return currencySymbol + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
                    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
                    if (val >= 1000) return (val / 1000).toFixed(0) + 'k';
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
            element.innerHTML = '';
            try {
                const chart = new ApexCharts(element, options);
                chart.render();
                return chart;
            } catch (err) { console.error(`Error rendering chart ${elementId}:`, err, "Options:", options); }
        } else { console.warn(`Element with ID ${elementId} not found for chart rendering.`); }
        return null;
    }

    function updateKpiText(cardElement, revenueText, changeText, isPositiveOrNull) {
        const revenueEl = cardElement.querySelector('h2');
        const changeEl = cardElement.querySelector('p.change');
        if (revenueEl) revenueEl.textContent = revenueText;
        if (changeEl) {
            if (changeText === null || changeText === undefined || changeText === '') {
                changeEl.innerHTML = ''; changeEl.className = 'change';
            } else {
                let iconHtml = ''; let textContent = changeText; let changeClass = 'change';
                if (isPositiveOrNull === true) { iconHtml = '<i class="fas fa-arrow-up"></i> '; changeClass += ' positive'; }
                else if (isPositiveOrNull === false) { iconHtml = '<i class="fas fa-arrow-down"></i> '; changeClass += ' negative'; }
                changeEl.innerHTML = iconHtml + textContent; changeEl.className = changeClass;
            }
        }
    }

    // NUEVA FUNCIÓN para generar el resumen ejecutivo
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

        const { kpiSummary = {}, timeSeriesData = [], channelData = [], productCategoryRevenue = {} } = data;
        const mainCurrency = (kpiSummary && kpiSummary.currency) || '$';

        let summaryHTML = '';
        let tipsHTML = '';

        const totalRevenue = (kpiSummary && kpiSummary.totalRevenue !== undefined) ? kpiSummary.totalRevenue : 0;

        summaryHTML += `<p><i class="fas fa-dollar-sign text-success"></i> Los <strong>ingresos totales</strong> para el período seleccionado ascienden a 
                        <strong class="metric-value highlight-positive">${formatCurrency(totalRevenue, mainCurrency)}</strong>. `;

        if (timeSeriesData && timeSeriesData.length > 0) {
            const firstDayRevenue = timeSeriesData[0].value;
            const lastDayRevenue = timeSeriesData[timeSeriesData.length - 1].value;
            const avgDailyRevenue = totalRevenue / timeSeriesData.length;

            summaryHTML += `El promedio diario de ingresos fue de <strong class="metric-value">${formatCurrency(avgDailyRevenue, mainCurrency)}</strong>. `;
            
            if (lastDayRevenue > firstDayRevenue) {
                summaryHTML += `Se observa una <span class="highlight-positive"><i class="fas fa-arrow-trend-up"></i> tendencia de crecimiento</span> durante este período. `;
                tipsHTML += `<li><span class="tip-icon">📈</span> ¡Excelente! Parece que las estrategias implementadas están dando frutos. Analiza los picos para replicar el éxito.</li>`;
            } else if (lastDayRevenue < firstDayRevenue) {
                summaryHTML += `La tendencia general de ingresos muestra una <span class="highlight-negative"><i class="fas fa-arrow-trend-down"></i> ligera disminución</span> hacia el final del período. `;
                tipsHTML += `<li><span class="tip-icon">📉</span> Es momento de investigar las causas de la disminución en los ingresos. ¿Hubo cambios en el mercado o en la competencia?</li>`;
            } else {
                summaryHTML += `Los ingresos se mantuvieron relativamente estables. `;
            }
        } else {
            summaryHTML += `No hay datos de series temporales para analizar la tendencia. `;
        }
        summaryHTML += `</p>`;

        if (kpiSummary && kpiSummary.targetValue && kpiSummary.targetValue > 0) {
            const targetAchievedPercent = (totalRevenue / kpiSummary.targetValue) * 100;
            summaryHTML += `<p><i class="fas fa-bullseye text-info"></i> Respecto al objetivo de <strong class="metric-value">${formatCurrency(kpiSummary.targetValue, mainCurrency)}</strong>, 
                            se ha alcanzado un <strong class="metric-value ${targetAchievedPercent >= 100 ? 'highlight-positive' : 'highlight-negative'}">${targetAchievedPercent.toFixed(1)}%</strong>. `;
            if (targetAchievedPercent >= 100) {
                summaryHTML += `¡Felicitaciones por superar la meta! 🎉`;
                tipsHTML += `<li><span class="tip-icon">🏆</span> ¡Meta de ingresos superada! Considera establecer objetivos más ambiciosos para el próximo período.</li>`;
            } else if (targetAchievedPercent >= 80) {
                summaryHTML += `Estás cerca de alcanzar el objetivo. ¡Sigue así! 👍`;
                tipsHTML += `<li><span class="tip-icon">🎯</span> Muy cerca del objetivo de ingresos. Un pequeño empujón adicional podría ser suficiente.</li>`;
            } else {
                summaryHTML += `Hay una oportunidad de mejora para alcanzar el objetivo. 🧐`;
                tipsHTML += `<li><span class="tip-icon">🛠️</span> El objetivo de ingresos no se alcanzó. Revisa las estrategias y ajusta el plan de acción.</li>`;
            }
            summaryHTML += `</p>`;
        }

        if (kpiSummary && kpiSummary.hasOwnProperty('changeFromLastMonth')) {
            const changeLM = kpiSummary.changeFromLastMonth;
            summaryHTML += `<p><i class="fas fa-calendar-alt ${changeLM >= 0 ? 'text-success' : 'text-danger'}"></i> Comparado con el mes anterior, hubo un 
                            <span class="${changeLM >= 0 ? 'highlight-positive' : 'highlight-negative'}">
                            ${changeLM >= 0 ? '<i class="fas fa-caret-up"></i> aumento' : '<i class="fas fa-caret-down"></i> descenso'} 
                            del ${Math.abs(changeLM).toFixed(1)}%</span>. `;
            if (changeLM > 5) {
                 summaryHTML += `¡Un crecimiento notable! 🚀`;
                 tipsHTML += `<li><span class="tip-icon">🌟</span> El crecimiento respecto al mes anterior es significativo. Identifica los factores clave.</li>`;
            } else if (changeLM < -5) {
                summaryHTML += `Es importante analizar esta variación. 📉`;
                tipsHTML += `<li><span class="tip-icon">⚠️</span> El descenso comparado con el mes anterior requiere atención. ¿Qué cambió este mes?</li>`;
            }
            summaryHTML += `</p>`;
        }

        if (channelData && channelData.length > 0) {
            const sortedChannels = [...channelData].sort((a, b) => b.value - a.value);
            const topChannel = sortedChannels[0];
            let worstChannel = sortedChannels[sortedChannels.length - 1];

            summaryHTML += `<p><i class="fas fa-network-wired text-info"></i> En cuanto a canales, 
                            <strong class="metric-value highlight-neutral">${topChannel.name}</strong> 
                            lidera con un <strong class="metric-value">${topChannel.value.toFixed(1)}%</strong> de contribución. `;
            
            if (channelData.length > 1 && topChannel.name !== worstChannel.name) {
                 summaryHTML += `Mientras que <strong class="metric-value highlight-negative">${worstChannel.name}</strong> 
                                 presenta el menor rendimiento (<strong class="metric-value">${worstChannel.value.toFixed(1)}%</strong>). `;
                tipsHTML += `<li><span class="tip-icon">📢</span> Potencia el canal <strong class="highlight-neutral">${topChannel.name}</strong> y analiza estrategias para mejorar <strong class="highlight-negative">${worstChannel.name}</strong>.</li>`;
            } else if (channelData.length === 1){
                summaryHTML += `Este es el único canal activo/seleccionado en este momento.`;
            }
            summaryHTML += `</p>`;
        }

        if (productCategoryRevenue && productCategoryRevenue.categories && productCategoryRevenue.categories.length > 0 && productCategoryRevenue.series) {
            const currentPeriodSeries = productCategoryRevenue.series.find(s => s.name === "Current Period");
            if (currentPeriodSeries && currentPeriodSeries.data) {
                const categoryPerformance = productCategoryRevenue.categories.map((cat, index) => ({
                    name: cat,
                    revenue: currentPeriodSeries.data[index] || 0
                })).sort((a, b) => b.revenue - a.revenue);

                if (categoryPerformance.length > 0) {
                    const topCategory = categoryPerformance[0];
                    summaryHTML += `<p><i class="fas fa-tags text-purple"></i> La categoría de productos estrella es 
                                    <strong class="metric-value highlight-positive">${topCategory.name}</strong>, generando 
                                    <strong class="metric-value">${formatCurrency(topCategory.revenue, mainCurrency)}</strong>. `;
                    if (categoryPerformance.length > 1) {
                        const bottomCategory = categoryPerformance[categoryPerformance.length -1];
                         summaryHTML += `Por otro lado, <strong class="metric-value highlight-negative">${bottomCategory.name}</strong> 
                                         es la categoría con menores ingresos (<strong class="metric-value">${formatCurrency(bottomCategory.revenue, mainCurrency)}</strong>). `;
                        tipsHTML += `<li><span class="tip-icon">🛍️</span> Considera promociones para <strong class="highlight-negative">${bottomCategory.name}</strong> y asegura stock suficiente de <strong class="highlight-positive">${topCategory.name}</strong>.</li>`;
                    }
                    summaryHTML += `</p>`;
                }
            }
        }
        
        if (summaryHTML === '') {
            summaryHTML = '<p>No hay suficientes datos filtrados para generar un resumen detallado en este momento. Ajusta los filtros para ver más información.</p>';
        }

        summaryContainer.innerHTML = summaryHTML;
        tipsContainer.innerHTML = tipsHTML || '<li><span class="tip-icon">🧐</span> Explora los diferentes filtros para obtener insights más específicos.</li>';
    }
    // FIN NUEVA FUNCIÓN

    function processAndDisplayData(dataToDisplay) {
        console.log("Processing data for display (again):", JSON.parse(JSON.stringify(dataToDisplay)));

        const {
            kpiSummary = {}, timeSeriesData = [], stackedComboData = { series: [], categories: [] },
            channelData = [], boxplotData = [], trendlineTargetRangeData = [],
            progressLineTrendValue = null,
            stackedBar100Data = { series: [], categories: [] },
            stackedArea100Data = { seriesFactors: [], numPoints: 0, startDate: '' },
            productCategoryRevenue = { categories: [], series: [], totalCurrentPeriod: 0, totalPreviousPeriod: 0 }
        } = dataToDisplay;

        const mainCurrency = (kpiSummary && kpiSummary.currency) || '$';
        const displayTotalRevenue = (kpiSummary && kpiSummary.totalRevenue !== undefined) ? kpiSummary.totalRevenue : 0;
        const totalRevenueFormatted = formatCurrency(displayTotalRevenue, mainCurrency);

        const generalChangeText = (kpiSummary && kpiSummary.hasOwnProperty('changeFromLastMonth')) ?
            `${Math.abs(kpiSummary.changeFromLastMonth).toFixed(1)}% From Last Month` : null;
        const isGeneralChangePositive = (kpiSummary && kpiSummary.hasOwnProperty('changeFromLastMonth')) ?
            kpiSummary.changeFromLastMonth >= 0 : null;

        document.querySelectorAll('.kpi-card').forEach(card => {
            const chartDiv = card.querySelector('div[id^="chart"]');
            if (!chartDiv) return;
            const chartId = chartDiv.id;

            updateKpiText(card, totalRevenueFormatted, generalChangeText, isGeneralChangePositive);

            switch (chartId) {
                case 'chartTargetLine':
                    const targetVal = (kpiSummary && kpiSummary.targetValue) || 0;
                    const targetPercent = targetVal > 0 ? (displayTotalRevenue / targetVal) * 100 : 0;
                    const targetText = ` ${targetPercent.toFixed(1)}% of target value ${formatCurrency(targetVal, mainCurrency)}`;
                    updateKpiText(card, totalRevenueFormatted, targetText, targetPercent >= 100);
                    const targetValueLabelEl = card.querySelector('.target-value-label');
                    if(targetValueLabelEl) targetValueLabelEl.textContent = formatCurrency(targetVal, mainCurrency);
                    const progressFillEl = card.querySelector('.progress-fill');
                    if(progressFillEl) progressFillEl.style.width = Math.min(targetPercent, 100) + '%';
                    break;

                case 'chartProgressLine':
                    const overallTargetVal = (kpiSummary && kpiSummary.overallTarget) || 0;
                    const progressToOverall = (kpiSummary && kpiSummary.progressToOverallTarget) || 0;
                    const overallTargetPercent = progressToOverall;
                    const progressText = `${overallTargetPercent.toFixed(1)}% <small>of overall target</small>`;
                    updateKpiText(card, totalRevenueFormatted, progressText, overallTargetPercent >= 100);
                    const progressBar = card.querySelector('.progress-bar');
                    const targetLabelRight = card.querySelector('.target-value-label-right');
                    if (progressBar) {
                        progressBar.style.width = Math.min(overallTargetPercent, 100) + '%';
                        progressBar.textContent = Math.round(overallTargetPercent) + '%';
                        progressBar.className = 'progress-bar';
                        if (overallTargetPercent >= 100) progressBar.classList.add('bg-success');
                        else if (overallTargetPercent >= 75) progressBar.classList.add('bg-info');
                        else if (overallTargetPercent >= 50) progressBar.classList.add('bg-primary');
                        else if (overallTargetPercent >= 25) progressBar.classList.add('bg-warning');
                        else progressBar.classList.add('bg-danger');
                    }
                    if (targetLabelRight) targetLabelRight.textContent = formatCurrency(overallTargetVal, mainCurrency);
                    break;

                case 'chartCategoryHorizontalBar':
                    const catCurrent = (productCategoryRevenue && productCategoryRevenue.totalCurrentPeriod) || 0;
                    const catPrevious = (productCategoryRevenue && productCategoryRevenue.totalPreviousPeriod) || 0;
                    const categoryRevenueFormatted = formatCurrency(catCurrent, mainCurrency);
                    let categoryChangeText = null;
                    let isCategoryChangePositive = null;
                    if (catCurrent > 0 && catPrevious > 0) {
                        const categoryChange = ((catCurrent - catPrevious) / catPrevious) * 100;
                        categoryChangeText = `${Math.abs(categoryChange).toFixed(1)}% vs período anterior`;
                        isCategoryChangePositive = categoryChange >=0;
                    }
                    updateKpiText(card, categoryRevenueFormatted, categoryChangeText, isCategoryChangePositive);
                    break;
            }
        });

        // --- RENDER CHARTS ---
        if (timeSeriesData && timeSeriesData.length > 0) {
            renderChart('chartTimeSeries', {
                ...commonChartOptions,
                chart: { ...commonChartOptions.chart, height: 200, id: 'chartTimeSeries' },
                series: [{ name: 'Ingresos', data: timeSeriesData.map(item => ({x: new Date(item.date).getTime(), y: item.value })) }],
                colors: ['#007bff']
            });
        } else {
            renderChart('chartTimeSeries', { ...commonChartOptions, series: [], chart: { ...commonChartOptions.chart, height: 200, id: 'chartTimeSeries' }});
        }

        if (timeSeriesData && timeSeriesData.length > 0 && kpiSummary && kpiSummary.targetValue) {
            const displayTimeSeries = timeSeriesData.slice(0, Math.min(25, timeSeriesData.length));
            renderChart('chartTargetLine', {
                ...commonChartOptions,
                chart: { ...commonChartOptions.chart, height: 180, id: 'chartTargetLine' },
                series: [{ name: 'Ingresos', data: displayTimeSeries.map(item => ({x: new Date(item.date).getTime(), y: item.value })) }],
                colors: ['#007bff'],
                annotations: { yaxis: [{ y: kpiSummary.targetValue, borderColor: '#dc3545', label: { text: 'Meta', style: { color: '#fff', background: '#dc3545', fontSize: '9px'}, offsetY: -3 }}]},
                yaxis: { ...commonChartOptions.yaxis, max: Math.max(...displayTimeSeries.map(d=>d.value), kpiSummary.targetValue) * 1.2 }
            });
        } else {
            renderChart('chartTargetLine', { ...commonChartOptions, series: [], chart: { ...commonChartOptions.chart, height: 180, id: 'chartTargetLine' }});
        }

        if (timeSeriesData && timeSeriesData.length > 0) {
            const trendlineDisplayData = timeSeriesData.slice(0, Math.min(25, timeSeriesData.length));
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
            const targetRangeSeriesData = (trendlineTargetRangeData && trendlineTargetRangeData.length > 0) ?
                trendlineTargetRangeData.map(d => ({ x: new Date(d.date).getTime(), y: d.value })) : [];
            const seriesForTrendline = [{ name: 'Ingresos', data: trendlineDisplayData.map(d => ({ x: new Date(d.date).getTime(), y: d.value })), type: 'line' }];
            if (trendData.length > 0) seriesForTrendline.push({ name: 'Tendencia', data: trendData, type: 'line'});
            if (targetRangeSeriesData.length > 0) seriesForTrendline.push({ name: 'Target Range', data: targetRangeSeriesData, type: 'area' });
            renderChart('chartTimeSeriesTrendline', {
                ...commonChartOptions, chart: { ...commonChartOptions.chart, height: 200, id: 'chartTimeSeriesTrendline' },
                series: seriesForTrendline, colors: ['#007bff', '#28a745', '#adb5bd'],
                stroke: { width: [2, 2, 1], dashArray: [0, 5, 0], curve: ['smooth', 'straight', 'straight'] },
                fill: { type: ['solid', 'solid', 'gradient'], gradient: { shadeIntensity: 0.5, opacityFrom: 0.3, opacityTo: 0.1, stops: [0, 90, 100]}},
                markers: { size: [0,0,0] }, legend: { show: false }
            });
        } else {
            renderChart('chartTimeSeriesTrendline', { ...commonChartOptions, series: [], chart: { ...commonChartOptions.chart, height: 200, id: 'chartTimeSeriesTrendline' }});
        }

        if (timeSeriesData && timeSeriesData.length > 0) {
            const displayProgressData = timeSeriesData.slice(0, Math.min(25, timeSeriesData.length));
            renderChart('chartProgressLine', {
                ...commonChartOptions, chart: { ...commonChartOptions.chart, height: 180, id: 'chartProgressLine' },
                series: [{ name: 'Actual', data: displayProgressData.map(d => ({ x: new Date(d.date).getTime(), y: d.value })) }],
                colors: ['#0d6efd'], stroke: { width: [2, 2], curve: ['smooth', 'straight'], dashArray: [0, 0]},
                annotations: { yaxis: progressLineTrendValue ? [{ y: progressLineTrendValue, borderColor: '#dc3545', strokeDashArray: 4, label: { text: 'Prev. Trend', style: { color: '#fff', background: '#dc3545', fontSize: '9px'}, offsetY: -3}}] : [] },
                markers: { size: [2,0] }
            });
        } else {
            renderChart('chartProgressLine', { ...commonChartOptions, series: [], chart: { ...commonChartOptions.chart, height: 180, id: 'chartProgressLine' }});
        }

        if (stackedComboData && stackedComboData.series && stackedComboData.series.length > 0) {
            renderChart('chartStackedCombo', {
                chart: { height: 220, type: 'line', stacked: false, toolbar: { show: false }, id: 'chartStackedCombo' },
                series: stackedComboData.series, xaxis: { ...commonChartOptions.xaxis, type: 'category', categories: stackedComboData.categories, labels:{style:{fontSize:'9px'}} },
                yaxis: { ...commonChartOptions.yaxis }, colors: ['#007bff', '#dc3545', '#28a745'], stroke: { width: [0, 0, 3], curve: ['smooth','smooth','straight']},
                plotOptions: { bar: { horizontal: false, columnWidth: '60%', borderRadius: 4, dataLabels: { position: 'top'}, stacked: true } },
                legend: { show: true, position: 'top', horizontalAlign: 'right', fontSize: '10px', offsetY: -5, markers: {width:10, height:10}}, dataLabels: { enabled: false }
            });
        } else {
             const el = document.getElementById('chartStackedCombo'); if (el) el.innerHTML = '<p class="text-center text-muted small p-3">No data.</p>';
        }

        if (timeSeriesData && timeSeriesData.length > 0) {
            const verticalData = timeSeriesData.slice(Math.max(0, timeSeriesData.length - 6));
            renderChart('chartVerticalBar', {
                ...commonChartOptions, chart: { ...commonChartOptions.chart, type: 'bar', height: 200, id: 'chartVerticalBar' },
                series: [{ name: 'Revenue', data: verticalData.map(d=>d.value) }], colors: ['#007bff'],
                plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 2 }},
                xaxis: { ...commonChartOptions.xaxis, type: 'category', categories: verticalData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) },
                yaxis: { ...commonChartOptions.yaxis, tickAmount: 3 }
            });
        } else {
            renderChart('chartVerticalBar', { ...commonChartOptions, series: [], chart: { ...commonChartOptions.chart, type: 'bar', height: 200, id: 'chartVerticalBar' }});
        }

        if (boxplotData && boxplotData.length > 0) {
            renderChart('chartBoxplot', {
                ...commonChartOptions, chart: { ...commonChartOptions.chart, type: 'boxPlot', height: 220, id: 'chartBoxplot' },
                series: [{ name: 'Ingresos por Región', type: 'boxPlot', data: boxplotData.map(item => ({ x: item.x, y: item.y })) }],
                xaxis: { ...commonChartOptions.xaxis, type: 'category', categories: boxplotData.map(d => d.x) }, colors: ['#007bff'],
                plotOptions: { boxPlot: { colors: { upper: '#007bff', lower: '#6cb2eb' }}},
                tooltip: { shared: false, intersect: true, custom: function({series, seriesIndex, dataPointIndex, w}) {
                        const dataVal = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y; const category = w.globals.labels[dataPointIndex];
                        return `<div class="arrow_box"><span><b>${category}</b></span><br>Max: ${formatCurrency(dataVal[4])}<br>Q3: ${formatCurrency(dataVal[3])}<br>Median: ${formatCurrency(dataVal[2])}<br>Q1: ${formatCurrency(dataVal[1])}<br>Min: ${formatCurrency(dataVal[0])}</div>`;
                }}
            });
        } else {
             const el = document.getElementById('chartBoxplot'); if (el) el.innerHTML = '<p class="text-center text-muted small p-3">No data.</p>';
        }

        if (channelData && channelData.length > 0) {
            const top3Channels = [...channelData].sort((a,b) => b.value - a.value).slice(0, 3);
            renderChart('chartTopChannelsVertical', {
                ...commonChartOptions, chart: { type: 'bar', height: 190, id: 'chartTopChannelsVertical', toolbar: {show: false} },
                series: [{ name: 'Top Canales', data: top3Channels.map(item => item.value) }],
                xaxis: { categories: top3Channels.map(item => item.name), labels: {show: true, rotate: -30, trim: true, style: { fontSize: '10px', colors: '#6c757d' }}},
                yaxis: { ...commonChartOptions.yaxis, labels: { formatter: function (val) { return val.toFixed(1) + '%'; } }},
                colors: ['#28a745', '#208b3a', '#1a7431'], plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 3, distributed: true }},
                dataLabels: { enabled: false }, legend: {show: false}
            });
        } else {
            renderChart('chartTopChannelsVertical', { ...commonChartOptions, series: [], chart: { type: 'bar', height: 190, id: 'chartTopChannelsVertical'}});
            const el = document.getElementById('chartTopChannelsVertical'); if(el) el.innerHTML = '<p class="text-center text-muted small p-3">No data.</p>';
        }

        if (channelData && channelData.length > 0) {
            renderChart('chartDonut', {
                chart: { type: 'donut', height: 250, parentHeightOffset: 0, id: 'chartDonut' },
                series: channelData.map(item => item.value), labels: channelData.map(item => item.name),
                colors: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'],
                plotOptions: { pie: { donut: { size: '70%', labels: { show: true, name: { show: false }, value: { show: false },
                    total: { show: true, showAlways: true, label: '', fontSize: '22px', fontWeight: 600, color: '#373d3f', formatter: () => totalRevenueFormatted }
                }}}},
                legend: { show: true, position: 'right', horizontalAlign: 'center', fontSize: '11px', itemMargin: { horizontal: 5, vertical: 3}, markers: {width:10, height:10, radius: 5} },
                dataLabels: { enabled: false }, tooltip: { y: { formatter: (val) => val.toFixed(1) + "%", title: { formatter: (seriesName) => seriesName } }, fillSeriesColor: false },
                states: { hover: { filter: { type: 'lighten', value: 0.05 }}},
                responsive: [{ breakpoint: 480, options: { chart: { width: '100%' }, legend: { position: 'bottom' } }}]
            });
        } else {
            renderChart('chartDonut', { chart: { type: 'donut', height: 250, id: 'chartDonut' }, series: [], labels: [] });
            const el = document.getElementById('chartDonut'); if(el) el.innerHTML = '<p class="text-center text-muted small p-3">No data.</p>';
        }

        if (stackedBar100Data && stackedBar100Data.series && stackedBar100Data.series.length > 0) {
            renderChart('chartStackedBar100', {
                ...commonChartOptions, chart: { ...commonChartOptions.chart, type: 'bar', stacked: true, stackType: '100%', height: 220, id: 'chartStackedBar100' },
                series: stackedBar100Data.series, xaxis: { ...commonChartOptions.xaxis, type: 'category', categories: stackedBar100Data.categories },
                yaxis: { labels: { formatter: function (val) { return val.toFixed(0) + '%'; } }}, colors: ['#007bff', '#28a745', '#ffc107', '#6f42c1'],
                plotOptions: { bar: { horizontal: false, borderRadius: 2 } },
                legend: { show: true, position: 'top', horizontalAlign: 'left', fontSize: '10px', offsetY: -5, markers: {width:10, height:10}},
                tooltip: { y: { formatter: (val) => val.toFixed(1) + "%" } }
            });
        } else {
             const el = document.getElementById('chartStackedBar100'); if (el) el.innerHTML = '<p class="text-center text-muted small p-3">No data.</p>';
        }

        if (stackedArea100Data && stackedArea100Data.seriesFactors && stackedArea100Data.seriesFactors.length > 0) {
            const areaCategories = Array.from({length: stackedArea100Data.numPoints || 20}, (_, i) => {
                let date = new Date(stackedArea100Data.startDate || '2024-01-01'); date.setDate(date.getDate() + (i*3)); return date.getTime();
            });
            const areaSeries = stackedArea100Data.seriesFactors.map(factor => ({
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
             const el = document.getElementById('chartStackedArea100'); if (el) el.innerHTML = '<p class="text-center text-muted small p-3">No data.</p>';
        }

        if (productCategoryRevenue && productCategoryRevenue.series && productCategoryRevenue.series.length > 0) {
            renderChart('chartCategoryHorizontalBar', {
                ...commonChartOptions, chart: { type: 'bar', height: 230, id: 'chartCategoryHorizontalBar', stacked: true, toolbar:{show: false}},
                series: productCategoryRevenue.series, colors: ['#007bff', '#6c757d'],
                plotOptions: { bar: { horizontal: true, borderRadius: 3, barHeight: '65%', dataLabels: {
                    total: { enabled: true, formatter: (val) => (val > 0 ? formatCurrency(val/1000, '').slice(0,-1) + 'k' : ''), style: { fontSize: '9px', fontWeight: 600, colors: ['#444']}, offsetX: 5 }
                }}},
                xaxis: { categories: productCategoryRevenue.categories, title: { text: 'Revenue', style: {fontSize: '10px', color: '#6c757d'}}, labels: { formatter: (val) => (val/1000).toFixed(0) + 'k' } },
                yaxis: { labels: { show: true, style: { fontSize: '10px', colors: '#495057', fontWeight: 400 }, minWidth: 80, maxWidth: 150 }},
                legend: { position: 'top', horizontalAlign: 'right', fontSize: '10px', offsetY: -5, markers: {width:10, height:10}},
                dataLabels: { enabled: false }, tooltip: { y: { formatter: (val) => formatCurrency(val, mainCurrency) } }
            });
        } else {
            const el = document.getElementById('chartCategoryHorizontalBar'); if (el) el.innerHTML = '<p class="text-center text-muted small p-3">No data.</p>';
        }
        
        // LLAMADA A LA FUNCIÓN DE RESUMEN EJECUTIVO
        generateExecutiveSummary(dataToDisplay);
    }

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

        let dataForProcessing = JSON.parse(JSON.stringify(originalData));
        let currentFilteredTimeSeries = JSON.parse(JSON.stringify(originalData.timeSeriesData || []));

        if (startDateValue && endDateValue) {
            try {
                const startDt = new Date(startDateValue + "T00:00:00");
                const endDt = new Date(endDateValue + "T23:59:59");
                if (!isNaN(startDt.getTime()) && !isNaN(endDt.getTime()) && startDt <= endDt) {
                    currentFilteredTimeSeries = currentFilteredTimeSeries.filter(item => {
                        const itemDate = new Date(item.date);
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
        
        const newTotalRevenue = (dataForProcessing.timeSeriesData || []).reduce((sum, item) => sum + (item.value || 0), 0);
        dataForProcessing.kpiSummary = {
            ...(originalData.kpiSummary || {}),
            totalRevenue: newTotalRevenue
        };

        if (originalData.channelData && Array.isArray(originalData.channelData)) {
            if (selectedChannel === 'all') {
                dataForProcessing.channelData = JSON.parse(JSON.stringify(originalData.channelData));
            } else {
                const channelNameMap = { 'directo': 'Directo', 'organico': 'Búsqueda Orgánica', 'pagado': 'Búsqueda Pagada', 'referencia': 'Referencia', 'others': 'Others' };
                const targetChannelDisplayName = channelNameMap[selectedChannel];
                dataForProcessing.channelData = targetChannelDisplayName ? originalData.channelData.filter(item => item.name === targetChannelDisplayName) : [];
            }
        } else { dataForProcessing.channelData = []; }

        if (originalData.boxplotData && Array.isArray(originalData.boxplotData)) {
            if (selectedRegion === 'all') {
                dataForProcessing.boxplotData = JSON.parse(JSON.stringify(originalData.boxplotData));
            } else {
                const regionMap = { 'na': 'NA', 'eu': 'EU', 'asia': 'ASIA' };
                const regionKey = regionMap[selectedRegion];
                dataForProcessing.boxplotData = regionKey ? originalData.boxplotData.filter(item => item.x === regionKey) : [];
            }
        } else { dataForProcessing.boxplotData = []; }

        dataForProcessing.stackedComboData = JSON.parse(JSON.stringify(originalData.stackedComboData || { series: [], categories: [] }));
        dataForProcessing.trendlineTargetRangeData = JSON.parse(JSON.stringify(originalData.trendlineTargetRangeData || []));
        dataForProcessing.progressLineTrendValue = originalData.progressLineTrendValue === undefined ? null : originalData.progressLineTrendValue;
        dataForProcessing.stackedBar100Data = JSON.parse(JSON.stringify(originalData.stackedBar100Data || { series: [], categories: [] }));
        dataForProcessing.stackedArea100Data = JSON.parse(JSON.stringify(originalData.stackedArea100Data || { seriesFactors: [], numPoints: 0, startDate: '' }));
        dataForProcessing.productCategoryRevenue = JSON.parse(JSON.stringify(originalData.productCategoryRevenue || { categories: [], series: [], totalCurrentPeriod: 0, totalPreviousPeriod: 0 }));

        console.log('Data prepared for display (final):', JSON.parse(JSON.stringify(dataForProcessing)));
        processAndDisplayData(dataForProcessing);
    }

    document.getElementById('applyFilters').addEventListener('click', applyFiltersImmediate);
    document.getElementById('startDate').addEventListener('change', applyAllFiltersWithDebounce);
    document.getElementById('endDate').addEventListener('change', applyAllFiltersWithDebounce);
    document.getElementById('channelFilter').addEventListener('change', applyAllFiltersWithDebounce);
    document.getElementById('regionFilter').addEventListener('change', applyAllFiltersWithDebounce);

    async function fetchAndInitializeApp() {
        console.log('Initializing dashboard by fetching data...');
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}.`);
            
            let loadedData = await response.json();
            
            if (loadedData && loadedData.timeSeriesData && Array.isArray(loadedData.timeSeriesData)) {
                const initialCalculatedTotalRevenue = loadedData.timeSeriesData.reduce((sum, item) => sum + (item.value || 0), 0);
                if (loadedData.kpiSummary) {
                    loadedData.kpiSummary.totalRevenue = initialCalculatedTotalRevenue;
                } else {
                    loadedData.kpiSummary = { totalRevenue: initialCalculatedTotalRevenue, currency: '$' };
                }
            } else {
                console.warn("timeSeriesData missing/invalid. Initial totalRevenue might be incorrect.");
                if (!loadedData.kpiSummary) loadedData.kpiSummary = { totalRevenue: 0, currency: '$' };
                else if (loadedData.kpiSummary.totalRevenue === undefined) loadedData.kpiSummary.totalRevenue = 0;
            }
            
            originalData = loadedData;

            const startDateInput = document.getElementById('startDate');
            const endDateInput = document.getElementById('endDate');
            if (originalData.timeSeriesData && originalData.timeSeriesData.length > 0) {
                const firstDateEntry = originalData.timeSeriesData[0];
                const lastDateEntry = originalData.timeSeriesData[originalData.timeSeriesData.length - 1];
                if (firstDateEntry && firstDateEntry.date && lastDateEntry && lastDateEntry.date) {
                    startDateInput.value = firstDateEntry.date;
                    endDateInput.value = lastDateEntry.date;
                } else {
                    startDateInput.value = "2024-01-01"; endDateInput.value = "2025-05-31";
                }
            } else {
                startDateInput.value = "2024-01-01"; endDateInput.value = "2025-05-31";
            }
            
            processAndDisplayData(JSON.parse(JSON.stringify(originalData)));
            console.log('Dashboard initialized.');

        } catch (error) {
            console.error("Failed to fetch or initialize dashboard:", error);
            const mainGrid = document.querySelector('.kpi-grid');
            if(mainGrid) mainGrid.innerHTML = `<p class="text-danger p-3 text-center">Error loading dashboard data. Details: ${error.message}</p>`;
            
            originalData = { kpiSummary:{totalRevenue:0, currency: '$'}, timeSeriesData:[], channelData:[], boxplotData:[], stackedComboData:{series:[], categories:[]}, productCategoryRevenue:{categories:[], series:[], totalCurrentPeriod:0, totalPreviousPeriod:0}};
            generateExecutiveSummary(null); 
            processAndDisplayData(JSON.parse(JSON.stringify(originalData)));
        }
    }
    fetchAndInitializeApp();
    
}); // Fin del DOMContentLoaded