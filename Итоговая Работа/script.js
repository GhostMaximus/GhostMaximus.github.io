(function() {
    // ---------- ДАННЫЕ (2010-2025 факт + 2026-2030 прогноз) ----------
    const years = Array.from({length: 2030-2010+1}, (_,i) => 2010+i); // 2010..2030

    const fact = {
        students: {2010:7050,2011:6490,2012:6074,2013:5647,2014:5209,2015:4766,2016:4399,2017:4246,2018:4152,2019:4068,2020:4049,2021:4044,2022:4130,2023:4325,2024:4435,2025:4658},
        budget: {2010:498,2011:484,2012:490,2013:491,2014:502,2015:576,2016:507,2017:575,2018:528,2019:523,2020:550,2021:542,2022:588,2023:590,2024:621,2025:592},
        foreign: {2010:154,2011:158,2012:163,2013:169,2014:175,2015:182,2016:189,2017:196,2018:203,2019:298,2020:315,2021:324,2022:312,2023:330,2024:376,2025:410},
        unemployment: {2010:16.6,2011:15.9,2012:15.1,2013:14.7,2014:13.8,2015:15.4,2016:16.3,2017:16.2,2018:15.9,2019:14.8,2020:17.5,2021:14.9,2022:13.8,2023:11.5,2024:9.8,2025:8.5},
        investments: {2010:164,2011:198,2012:213,2013:229,2014:243,2015:241,2016:211,2017:225,2018:269,2019:383,2020:457,2021:480,2022:580,2023:691,2024:772,2025:887},
        incomes: {2010:105.9,2011:100.8,2012:104.2,2013:103.3,2014:98.8,2015:97.6,2016:95.5,2017:99.5,2018:100.7,2019:101.2,2020:98,2021:103.3,2022:104.5,2023:106.1,2024:108.2,2025:107.5},
        graduates: {2010:950,2011:700,2012:690,2013:753,2014:702,2015:651,2016:750,2017:716,2018:729,2019:647,2020:786,2021:680,2022:697,2023:681,2024:664,2025:641}
    };

    const forecast = {
        students: {2026:4609,2027:4812,2028:5002,2029:5197,2030:5392},
        budget: {2026:605,2027:618,2028:630,2029:642,2030:655},
        foreign: {2026:435,2027:462,2028:490,2029:518,2030:545},
        unemployment: {2026:8.7,2027:7.9,2028:7.3,2029:6.5,2030:5.9},
        investments: {2026:960,2027:1045,2028:1130,2029:1210,2030:1295},
        incomes: {2026:108.1,2027:108.7,2028:109.3,2029:109.8,2030:110.4},
        graduates: {2026:692,2027:696,2028:700,2029:704,2030:708}
    };

    function getFullSeries(metric) {
        return years.map(y => {
            if (y <= 2025) return fact[metric]?.[y] ?? null;
            else return forecast[metric]?.[y] ?? null;
        });
    }

    function getFactSeries(metric) {
        return years.map(y => (y <= 2025 && fact[metric]?.[y] !== undefined) ? fact[metric][y] : null);
    }

    function getForecastSeries(metric) {
        return years.map(y => (y >= 2026 && forecast[metric]?.[y] !== undefined) ? forecast[metric][y] : null);
    }

    const meta = {
        students: { label: 'Численность студентов', unit: 'тыс. чел.', color: '#2c6e9e', yAxisID: 'y' },
        budget: { label: 'Бюджетные места', unit: 'тыс. мест', color: '#2b7a4b', yAxisID: 'y' },
        foreign: { label: 'Иностранные студенты', unit: 'тыс. чел.', color: '#d97706', yAxisID: 'y' },
        unemployment: { label: 'Уровень безработицы молодёжи', unit: '%', color: '#c2410c', yAxisID: 'y1' },
        investments: { label: 'Инвестиции в образование', unit: 'млрд руб.', color: '#7c3aed', yAxisID: 'y1' },
        incomes: { label: 'Реальные доходы населения', unit: '% (к prev)', color: '#0e7c7c', yAxisID: 'y1' }
    };

    let currentChart = null;
    let mainMetric = 'students';
    let compareMetric = 'none';

    function renderChart() {
        const ctx = document.getElementById('mainChart').getContext('2d');
        if (currentChart) currentChart.destroy();

        const mainFact = getFactSeries(mainMetric);
        const mainFore = getForecastSeries(mainMetric);
        const mainMeta = meta[mainMetric];

        let datasets = [
            { label: `${mainMeta.label} (факт)`, data: mainFact, borderColor: mainMeta.color, backgroundColor: 'transparent', borderWidth: 2.8, tension: 0.2, pointRadius: 4, pointHoverRadius: 6, pointBackgroundColor: mainMeta.color, yAxisID: mainMeta.yAxisID, fill: false },
            { label: `${mainMeta.label} (прогноз)`, data: mainFore, borderColor: mainMeta.color, backgroundColor: 'transparent', borderWidth: 2.8, borderDash: [8, 6], tension: 0.2, pointRadius: 4, pointBackgroundColor: mainMeta.color, yAxisID: mainMeta.yAxisID, fill: false }
        ];

        if (compareMetric !== 'none' && compareMetric !== mainMetric) {
            const compMeta = meta[compareMetric];
            const compFact = getFactSeries(compareMetric);
            const compFore = getForecastSeries(compareMetric);
            datasets.push({ label: `${compMeta.label} (факт) сравнение`, data: compFact, borderColor: compMeta.color, backgroundColor: 'transparent', borderWidth: 2.2, tension: 0.2, pointRadius: 3, pointBackgroundColor: compMeta.color, yAxisID: compMeta.yAxisID, fill: false });
            datasets.push({ label: `${compMeta.label} (прогноз) сравнение`, data: compFore, borderColor: compMeta.color, backgroundColor: 'transparent', borderWidth: 2.2, borderDash: [6, 5], tension: 0.2, pointRadius: 3, yAxisID: compMeta.yAxisID, fill: false });
        }

        currentChart = new Chart(ctx, {
            type: 'line',
            data: { labels: years, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw?.toFixed(1)} ${meta[ctx.dataset.label.includes('факт') ? mainMetric : (compareMetric !== 'none' && ctx.dataset.label.includes(meta[compareMetric]?.label || '') ? compareMetric : mainMetric)]?.unit || ''}` } },
                    legend: { position: 'top' }
                },
                scales: {
                    y: { title: { display: true, text: `Основной показатель (${mainMeta.unit})`, color: mainMeta.color }, position: 'left', grid: { drawOnChartArea: true } },
                    y1: { title: { display: compareMetric !== 'none' && meta[compareMetric]?.yAxisID === 'y1', text: compareMetric !== 'none' ? `${meta[compareMetric]?.unit} (сравнение)` : '', color: '#c2410c' }, position: 'right', grid: { drawOnChartArea: false } }
                }
            }
        });
        updateStatsPanel();
    }

    function updateStatsPanel() {
        const panel = document.getElementById('statsPanel');
        const mainSeriesFull = getFullSeries(mainMetric);
        const mainVals = mainSeriesFull.filter(v => v !== null);
        if (mainVals.length < 3) { panel.innerHTML = `<span>📊 Недостаточно данных для статистики</span>`; return; }
        const lastVal = mainVals[mainVals.length-1];
        const firstVal = mainVals[0];
        const growth = ((lastVal - firstVal)/firstVal*100).toFixed(1);
        let corrHtml = '';
        if (compareMetric !== 'none' && compareMetric !== mainMetric) {
            const compFull = getFullSeries(compareMetric);
            const validPairs = [];
            for (let i=0; i<years.length; i++) {
                if (mainSeriesFull[i] !== null && compFull[i] !== null) validPairs.push([mainSeriesFull[i], compFull[i]]);
            }
            if (validPairs.length > 2) {
                let sumX=0,sumY=0,sumXY=0,sumX2=0,sumY2=0;
                for (let [x,y] of validPairs) { sumX+=x; sumY+=y; sumXY+=x*y; sumX2+=x*x; sumY2+=y*y; }
                const corr = (validPairs.length*sumXY - sumX*sumY) / Math.sqrt((validPairs.length*sumX2 - sumX*sumX)*(validPairs.length*sumY2 - sumY*sumY));
                corrHtml = `<span>📈 Корреляция Пирсона: ${corr.toFixed(3)} (${Math.abs(corr)>0.7?'сильная':Math.abs(corr)>0.4?'средняя':'слабая'})</span>`;
            }
        }
        panel.innerHTML = `<span>📅 Динамика ${meta[mainMetric].label}: ${growth}% за период 2010-2030 (прогноз)</span> ${corrHtml} <span>🎯 Значение 2030: ${lastVal?.toFixed(1)} ${meta[mainMetric].unit}</span>`;
    }

    function renderFullTable() {
        const tbody = document.getElementById('tableDynamicBody');
        tbody.innerHTML = '';
        for (let y of years) {
            const isFore = y >= 2026;
            const rowClass = isFore ? 'forecast-row' : '';
            const students = getFullSeries('students')[years.indexOf(y)] ?? '—';
            const budget = getFullSeries('budget')[years.indexOf(y)] ?? '—';
            const foreign = getFullSeries('foreign')[years.indexOf(y)] ?? '—';
            const unempl = getFullSeries('unemployment')[years.indexOf(y)] ?? '—';
            const invest = getFullSeries('investments')[years.indexOf(y)] ?? '—';
            const incomes = getFullSeries('incomes')[years.indexOf(y)] ?? '—';
            const graduates = getFullSeries('graduates')[years.indexOf(y)] ?? '—';
            tbody.insertAdjacentHTML('beforeend', `<tr class="${rowClass}">
                <td><strong>${y}</strong>${isFore ? '📘' : ''}</td>
                <td>${students !== '—' ? students.toFixed(0) : '—'}</td>
                <td>${budget !== '—' ? budget.toFixed(0) : '—'}</td>
                <td>${foreign !== '—' ? foreign.toFixed(0) : '—'}</td>
                <td>${unempl !== '—' ? unempl.toFixed(1) : '—'}</td>
                <td>${invest !== '—' ? invest.toFixed(0) : '—'}</td>
                <td>${incomes !== '—' ? incomes.toFixed(1) : '—'}</td>
                <td>${graduates !== '—' ? graduates.toFixed(0) : '—'}</td>
            </tr>`);
        }
    }

    function exportToCSV() {
        const headers = ['Год','Студенты_тыс','Бюджетные_места_тыс','Иностранные_тыс','Безработица_%','Инвестиции_млрд','Доходы_%','Выпускники_11_тыс'];
        const rows = years.map(y => {
            return [y, getFullSeries('students')[years.indexOf(y)], getFullSeries('budget')[years.indexOf(y)], getFullSeries('foreign')[years.indexOf(y)], 
                    getFullSeries('unemployment')[years.indexOf(y)], getFullSeries('investments')[years.indexOf(y)], getFullSeries('incomes')[years.indexOf(y)], getFullSeries('graduates')[years.indexOf(y)]];
        });
        const csvContent = [headers, ...rows.map(r => r.map(cell => (cell !== null && cell !== undefined) ? cell : '').join(','))].join('\n');
        const blob = new Blob([csvContent], {type: 'text/csv'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'student_forecast_russia.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function updateKPI() {
        const kpiGrid = document.getElementById('kpiGrid');
        const getVal = (metric, year) => (year <= 2025 ? fact[metric]?.[year] : forecast[metric]?.[year]) ?? null;
        const students2030 = getVal('students',2030);
        const students2025 = getVal('students',2025);
        const foreign2030 = getVal('foreign',2030);
        const budget2030 = getVal('budget',2030);
        const unempl2030 = getVal('unemployment',2030);
        const invest2030 = getVal('investments',2030);
        kpiGrid.innerHTML = `
            <div class="kpi-card"><div class="kpi-label">👨‍🎓 Студенты 2030 (прогноз)</div><div class="kpi-value">${students2030?.toFixed(0)} <span class="kpi-unit">тыс.</span></div><div class="trend-badge">+${((students2030-students2025)/students2025*100).toFixed(1)}% к 2025</div></div>
            <div class="kpi-card"><div class="kpi-label">🌍 Иностр. студенты 2030</div><div class="kpi-value">${foreign2030?.toFixed(0)} <span class="kpi-unit">тыс.</span></div><div class="trend-badge">рост 2.6x с 2015</div></div>
            <div class="kpi-card"><div class="kpi-label">🎓 Бюджетные места 2030</div><div class="kpi-value">${budget2030?.toFixed(0)} <span class="kpi-unit">тыс.</span></div><div class="trend-badge">+10,6% к 2025</div></div>
            <div class="kpi-card"><div class="kpi-label">📉 Безработица молодёжи 2030</div><div class="kpi-value">${unempl2030?.toFixed(1)}%</div><div class="trend-badge">исторический минимум</div></div>
            <div class="kpi-card"><div class="kpi-label">💰 Инвестиции в обр. 2030</div><div class="kpi-value">${invest2030?.toFixed(0)} <span class="kpi-unit">млрд руб.</span></div><div class="trend-badge">+440% c 2010</div></div>
        `;
    }

    // Обработчики событий
    document.getElementById('mainMetric').addEventListener('change', (e) => { mainMetric = e.target.value; renderChart(); });
    document.getElementById('compareMetric').addEventListener('change', (e) => { compareMetric = e.target.value; renderChart(); });
    document.getElementById('resetCompare').addEventListener('click', () => { document.getElementById('compareMetric').value = 'none'; compareMetric = 'none'; renderChart(); });
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);

    function init() {
        renderFullTable();
        updateKPI();
        renderChart();
    }
    init();
})();