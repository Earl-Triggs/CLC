(() => {
    const starterProducts = window.CLC_ADMIN_STARTER_PRODUCTS;
    const mergeProducts = window.CLC_ADMIN_MERGE_STOREFRONT_PRODUCTS;
    const numberFormat = new Intl.NumberFormat("en-US");
    const currencyFormat = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const metricElements = {
        totalProducts: document.getElementById("summary-total-products"),
        totalUnits: document.getElementById("summary-total-units"),
        lowStock: document.getElementById("summary-low-stock"),
        outOfStock: document.getElementById("summary-out-of-stock"),
        revenue: document.getElementById("daily-revenue"),
        cogs: document.getElementById("daily-cogs"),
        purchases: document.getElementById("daily-purchases"),
        sales: document.getElementById("daily-sales")
    };

    if (!Array.isArray(starterProducts) || typeof mergeProducts !== "function" ||
        Object.values(metricElements).some(element => !element)) {
        throw new Error("Dashboard metric data or elements are missing.");
    }

    function isProduct(product) {
        return product &&
            typeof product.id === "string" &&
            typeof product.name === "string" &&
            Number.isFinite(product.price) && product.price >= 0 &&
            ["Kids", "Men", "Women", "Unisex"].includes(product.category) &&
            Number.isInteger(product.stock) && product.stock >= 0 &&
            typeof product.image === "string";
    }

    function loadProducts() {
        try {
            const savedProducts = localStorage.getItem(window.CLC_ADMIN_PRODUCT_STORAGE_KEY);
            if (savedProducts === null) return starterProducts;

            const parsedProducts = JSON.parse(savedProducts);
            if (!Array.isArray(parsedProducts) || !parsedProducts.every(isProduct)) {
                throw new TypeError("Saved admin product data is invalid.");
            }
            return mergeProducts(parsedProducts);
        } catch (error) {
            console.error("Could not load dashboard product data.", error);
            return starterProducts;
        }
    }

    function updateInventoryMetrics() {
        const products = loadProducts();
        const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
        const lowStock = products.filter(product => {
            const threshold = Number.isInteger(product.reorderLevel) && product.reorderLevel >= 0
                ? product.reorderLevel
                : 10;
            return product.stock > 0 && product.stock <= threshold;
        }).length;
        const outOfStock = products.filter(product => product.stock === 0).length;

        metricElements.totalProducts.textContent = numberFormat.format(products.length);
        metricElements.totalUnits.textContent = numberFormat.format(totalUnits);
        metricElements.lowStock.textContent = numberFormat.format(lowStock);
        metricElements.outOfStock.textContent = numberFormat.format(outOfStock);
    }

    function updateDailyMetrics() {
        const metrics = window.CLC_DASHBOARD_DAILY_METRICS;
        if (!metrics || !["revenue", "cogs", "purchases", "sales"].every(key => Number.isFinite(metrics[key]))) {
            throw new Error("Dashboard daily demo metrics are unavailable.");
        }

        metricElements.revenue.textContent = currencyFormat.format(metrics.revenue);
        metricElements.cogs.textContent = currencyFormat.format(metrics.cogs);
        metricElements.purchases.textContent = currencyFormat.format(metrics.purchases);
        metricElements.sales.textContent = numberFormat.format(metrics.sales);
    }

    updateInventoryMetrics();
    updateDailyMetrics();
})();
