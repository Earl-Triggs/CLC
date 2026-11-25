(() => {
    const chart = document.getElementById("performance-chart");
    const plot = document.getElementById("chart-plot");
    const grid = document.getElementById("chart-grid");
    const yLabels = document.getElementById("chart-y-labels");
    const xLabels = document.getElementById("chart-x-labels");
    const pointLayer = document.getElementById("chart-points");
    const revenueArea = document.getElementById("revenue-area");
    const revenueLine = document.getElementById("revenue-line");
    const profitLine = document.getElementById("profit-line");
    const purchasesLine = document.getElementById("purchases-line");
    const chartTitle = document.getElementById("chart-title");
    const chartDescription = document.getElementById("chart-description");
    const chartTooltip = document.getElementById("chart-tooltip");
    const chartNote = document.getElementById("chart-note");
    const rangeButtons = [...document.querySelectorAll("[data-chart-range]")];

    if (!chart || !plot || !grid || !yLabels || !xLabels || !pointLayer ||
        !revenueArea || !revenueLine || !profitLine || !purchasesLine ||
        !chartTitle || !chartDescription || !chartTooltip || !chartNote ||
        rangeButtons.length === 0) {
        return;
    }

    const svgNamespace = "http://www.w3.org/2000/svg";
    const chartBounds = { left: 64, right: 704, top: 28, bottom: 308 };
    const chartWidth = 720;
    const chartHeight = 380;
    const rangeSettings = {
        "7d": { label: "Last 7 days", count: 7, base: 35960, swing: 14500, phase: 0.4 },
        "30d": { label: "Last 30 days", count: 30, base: 41760, swing: 20300, phase: 1.2 },
        "12m": { label: "Last 12 months", count: 12, base: 730800, swing: 313200, phase: 2.1 }
    };
    const currencyFormat = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0
    });
    const compactCurrencyFormat = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        notation: "compact",
        maximumFractionDigits: 1
    });
    const shortDateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
    const monthFormat = new Intl.DateTimeFormat("en-US", { month: "short" });
    const fullDateFormat = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    let activeRange = "30d";
    let activeData = [];
    let activeMaximum = 1;
    let pinnedTooltip = false;
    let tooltipTimer = 0;

    function createSvgElement(tagName, attributes = {}) {
        const element = document.createElementNS(svgNamespace, tagName);
        Object.entries(attributes).forEach(([name, value]) => {
            element.setAttribute(name, String(value));
        });
        return element;
    }

    function getDateForPoint(range, index, count) {
        const today = new Date();
        if (range === "12m") {
            return new Date(today.getFullYear(), today.getMonth() - (count - index - 1), 1);
        }
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() - (count - index - 1));
    }

    function createDemoData(range) {
        const settings = rangeSettings[range];
        return Array.from({ length: settings.count }, (_, index) => {
            const date = getDateForPoint(range, index, settings.count);
            const wave = Math.sin(index * 1.37 + settings.phase) * 0.58 +
                Math.cos(index * 0.61 + settings.phase) * 0.32;
            const trend = (index / Math.max(1, settings.count - 1) - 0.5) * 0.2;
            const revenue = Math.max(1, Math.round(settings.base + settings.swing * (wave + trend)));
            const purchaseRatio = 0.24 + 0.06 * (0.5 + Math.sin(index * 0.91 + 0.8));
            const purchases = Math.round(revenue * purchaseRatio);
            const profit = Math.round(revenue * (0.34 + 0.05 * (0.5 + Math.cos(index * 0.73))));

            return {
                date,
                label: range === "12m" ? monthFormat.format(date) : shortDateFormat.format(date),
                revenue,
                profit,
                purchases,
                sales: Math.max(1, Math.round(revenue / 1276))
            };
        });
    }

    function getNiceStep(maximum) {
        const roughStep = maximum / 4;
        const magnitude = 10 ** Math.floor(Math.log10(roughStep));
        const normalized = roughStep / magnitude;
        const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;
        return factor * magnitude;
    }

    function formatAxisCurrency(value) {
        return compactCurrencyFormat.format(value);
    }

    function getX(index) {
        const fraction = index / Math.max(1, activeData.length - 1);
        return chartBounds.left + fraction * (chartBounds.right - chartBounds.left);
    }

    function getY(value) {
        const fraction = value / activeMaximum;
        return chartBounds.bottom - fraction * (chartBounds.bottom - chartBounds.top);
    }

    function createLinePath(seriesName) {
        return activeData.map((point, index) =>
            `${index === 0 ? "M" : "L"}${getX(index).toFixed(1)} ${getY(point[seriesName]).toFixed(1)}`
        ).join(" ");
    }

    function renderGridAndLabels(step) {
        const tickCount = 4;
        grid.replaceChildren();
        yLabels.replaceChildren();

        for (let tick = 0; tick <= tickCount; tick += 1) {
            const value = step * (tickCount - tick);
            const y = chartBounds.top + (chartBounds.bottom - chartBounds.top) * tick / tickCount;
            grid.append(createSvgElement("path", { d: `M${chartBounds.left} ${y}H${chartBounds.right}` }));

            const label = createSvgElement("text", { x: 56, y: y + 3 });
            label.textContent = formatAxisCurrency(value);
            yLabels.append(label);
        }

        xLabels.replaceChildren();
        const labelCount = activeRange === "12m" ? activeData.length : Math.min(7, activeData.length);
        for (let labelIndex = 0; labelIndex < labelCount; labelIndex += 1) {
            const dataIndex = Math.round(labelIndex * (activeData.length - 1) / Math.max(1, labelCount - 1));
            const label = createSvgElement("text", { x: getX(dataIndex), y: 330 });
            label.textContent = activeData[dataIndex].label;
            xLabels.append(label);
        }
    }

    function renderPoints() {
        const series = [
            { name: "revenue", className: "revenue-points", radius: 3.5 },
            { name: "profit", className: "profit-points", radius: 3 },
            { name: "purchases", className: "purchase-points", radius: 3 }
        ];
        pointLayer.replaceChildren();

        series.forEach(item => {
            const group = createSvgElement("g", { class: item.className, "data-series": item.name });
            activeData.forEach((point, index) => {
                group.append(createSvgElement("circle", {
                    cx: getX(index),
                    cy: getY(point[item.name]),
                    r: item.radius,
                    "data-index": index
                }));
            });
            pointLayer.append(group);
        });
    }

    function renderChart(range) {
        activeRange = range;
        pinnedTooltip = false;
        window.clearTimeout(tooltipTimer);
        activeData = createDemoData(range);
        const dailyDemoData = createDemoData("7d")[rangeSettings["7d"].count - 1];
        window.CLC_DASHBOARD_DAILY_METRICS = {
            revenue: dailyDemoData.revenue,
            cogs: Math.max(0, dailyDemoData.revenue - dailyDemoData.profit),
            purchases: dailyDemoData.purchases,
            sales: dailyDemoData.sales
        };
        const rawMaximum = Math.max(...activeData.flatMap(point => [point.revenue, point.profit, point.purchases]));
        const step = getNiceStep(rawMaximum);
        activeMaximum = step * 4;

        renderGridAndLabels(step);
        revenueLine.setAttribute("d", createLinePath("revenue"));
        profitLine.setAttribute("d", createLinePath("profit"));
        purchasesLine.setAttribute("d", createLinePath("purchases"));
        revenueArea.setAttribute(
            "d",
            `${createLinePath("revenue")} L${getX(activeData.length - 1).toFixed(1)} ${chartBounds.bottom} ` +
                `L${chartBounds.left} ${chartBounds.bottom} Z`
        );
        renderPoints();

        const rangeLabel = rangeSettings[range].label;
        chartTitle.textContent = `Store performance demo data - ${rangeLabel}`;
        chartDescription.textContent =
            `Demo revenue, net profit, and inventory purchases for the ${rangeLabel.toLowerCase()}.`;
        chartNote.textContent = `Demo data only - ${rangeLabel.toLowerCase()}; not live store performance.`;
        rangeButtons.forEach(button => {
            button.setAttribute("aria-pressed", String(button.dataset.chartRange === range));
        });
        hideTooltip();
    }

    function addTooltipRow(seriesName, label, value) {
        const row = document.createElement("div");
        row.className = "chart-tooltip-row";

        const dot = document.createElement("i");
        dot.className = "chart-tooltip-dot";
        dot.dataset.series = seriesName;

        const seriesLabel = document.createElement("span");
        seriesLabel.textContent = label;

        const amount = document.createElement("strong");
        amount.textContent = currencyFormat.format(value);

        row.append(dot, seriesLabel, amount);
        chartTooltip.append(row);
    }

    function showTooltip(index) {
        const point = activeData[index];
        if (!point) return;

        chartTooltip.replaceChildren();
        const dateLabel = document.createElement("strong");
        dateLabel.className = "chart-tooltip-date";
        dateLabel.textContent = fullDateFormat.format(point.date);
        chartTooltip.append(dateLabel);
        addTooltipRow("revenue", "Revenue", point.revenue);
        addTooltipRow("profit", "Net profit", point.profit);
        addTooltipRow("purchases", "Inventory purchases", point.purchases);
        chartTooltip.hidden = false;

        const chartRect = chart.getBoundingClientRect();
        const plotRect = plot.getBoundingClientRect();
        const pointX = chartRect.left - plotRect.left + getX(index) * chartRect.width / chartWidth;
        const highestValue = Math.max(point.revenue, point.profit, point.purchases);
        const pointY = chartRect.top - plotRect.top + getY(highestValue) * chartRect.height / chartHeight;
        const left = pointX - chartTooltip.offsetWidth / 2;
        const top = pointY - chartTooltip.offsetHeight - 10;

        chartTooltip.style.left = `${Math.max(4, Math.min(plot.clientWidth - chartTooltip.offsetWidth - 4, left))}px`;
        chartTooltip.style.top = `${Math.max(4, Math.min(plot.clientHeight - chartTooltip.offsetHeight - 4, top))}px`;
        pointLayer.querySelectorAll("circle[data-index]").forEach(circle => {
            circle.classList.toggle("chart-active-point", Number(circle.dataset.index) === index);
        });
    }

    function hideTooltip() {
        chartTooltip.hidden = true;
        pointLayer.querySelectorAll(".chart-active-point").forEach(point => {
            point.classList.remove("chart-active-point");
        });
    }

    function getPointIndexFromEvent(event) {
        const rect = chart.getBoundingClientRect();
        const x = (event.clientX - rect.left) * chartWidth / rect.width;
        if (x < chartBounds.left - 10 || x > chartBounds.right + 10) return -1;
        const fraction = Math.max(0, Math.min(1, (x - chartBounds.left) / (chartBounds.right - chartBounds.left)));
        return Math.round(fraction * (activeData.length - 1));
    }

    rangeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const range = button.dataset.chartRange;
            if (range in rangeSettings) {
                renderChart(range);
            }
        });
    });

    chart.addEventListener("pointermove", event => {
        if (event.pointerType === "touch" || pinnedTooltip) return;
        const index = getPointIndexFromEvent(event);
        if (index >= 0) showTooltip(index);
        else hideTooltip();
    });

    chart.addEventListener("pointerdown", event => {
        const index = getPointIndexFromEvent(event);
        if (index < 0) return;
        showTooltip(index);

        if (event.pointerType === "touch") {
            pinnedTooltip = true;
            window.clearTimeout(tooltipTimer);
            tooltipTimer = window.setTimeout(() => {
                pinnedTooltip = false;
                hideTooltip();
            }, 2500);
        }
    });

    chart.addEventListener("pointerleave", () => {
        if (!pinnedTooltip) hideTooltip();
    });

    window.addEventListener("resize", hideTooltip);
    renderChart(activeRange);
})();
