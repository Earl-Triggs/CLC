(() => {
    const storageKey = "clc-sales-history-v1";
    const ordersStorageKey = "clc-orders-v1";
    const demoProducts = [
        { name: "Morning Joy", price: 502.86 },
        { name: "Blue Dragon", price: 362.50 },
        { name: "Dahlia Eternelle", price: 1100.84 },
        { name: "6PAX", price: 999.34 },
        { name: "One More Chance?", price: 869.42 },
        { name: "Solaire", price: 1012.68 },
        { name: "Paolo Pasqual", price: 1100.84 },
        { name: "Milly Rock", price: 768.50 },
        { name: "Versace on the Floor", price: 869.42 },
        { name: "Always Right", price: 910.60 },
        { name: "Oceanus", price: 1275.42 },
        { name: "Jasmine Noire", price: 768.50 }
    ];
    const searchInput = document.getElementById("sales-search");
    const paymentFilter = document.getElementById("payment-filter");
    const dateSort = document.getElementById("date-sort");
    const amountSort = document.getElementById("amount-sort");
    const tableBody = document.getElementById("sales-table-body");
    const emptyMessage = document.getElementById("sales-empty");
    const revenueTotal = document.getElementById("total-revenue");
    const transactionTotal = document.getElementById("total-transactions");
    const itemsTotal = document.getElementById("total-items");
    const detailsDialog = document.getElementById("sale-details-dialog");
    const detailsContent = document.getElementById("sale-details-content");
    const formatter = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 2
    });
    let sales = [];

    function isValidSale(sale) {
        return sale &&
            typeof sale.orderNumber === "string" &&
            typeof sale.item === "string" &&
            ["GCash", "Cash", "Card"].includes(sale.paymentMethod) &&
            Number.isFinite(sale.totalAmount) && sale.totalAmount >= 0 &&
            Number.isInteger(sale.itemCount) && sale.itemCount >= 0 &&
            typeof sale.date === "string" &&
            !Number.isNaN(Date.parse(`${sale.date}T00:00:00`));
    }

    function createDemoSales() {
        const today = new Date();
        const paymentMethods = ["Cash", "Card", "GCash", "Cash"];

        return Array.from({ length: 16 }, (_, index) => {
            const firstProduct = demoProducts[(index * 5) % demoProducts.length];
            const firstQuantity = (index % 3) + 1;
            const orderItems = [`${firstProduct.name} x ${firstQuantity}`];
            let itemCount = firstQuantity;
            let subtotal = firstProduct.price * firstQuantity;

            if (index % 3 !== 1) {
                const secondProduct = demoProducts[(index * 5 + 7) % demoProducts.length];
                const secondQuantity = (index % 2) + 1;
                orderItems.push(`${secondProduct.name} x ${secondQuantity}`);
                itemCount += secondQuantity;
                subtotal += secondProduct.price * secondQuantity;
            }

            const shipping = subtotal >= window.CLC_CURRENCY.freeShippingThreshold
                ? 0
                : window.CLC_CURRENCY.standardShippingFee;
            const tax = subtotal * 0.08;
            const saleDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((index * 7) % 27));

            return {
                orderNumber: `DEMO-${today.getFullYear()}-${String(index + 1).padStart(4, "0")}`,
                item: orderItems.join(", "),
                paymentMethod: paymentMethods[index % paymentMethods.length],
                totalAmount: Math.round((subtotal + shipping + tax) * 100) / 100,
                itemCount,
                date: `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, "0")}-${String(saleDate.getDate()).padStart(2, "0")}`
            };
        });
    }

    function loadSavedSales() {
        try {
            const savedSales = localStorage.getItem(storageKey);
            if (savedSales === null) return [];
            const parsedSales = JSON.parse(savedSales);
            if (!Array.isArray(parsedSales) || !parsedSales.every(isValidSale)) {
                throw new TypeError("Saved sales data is invalid.");
            }
            return parsedSales;
        } catch (error) {
            console.error("Could not load sales history.", error);
            return [];
        }
    }

    function loadCheckoutOrders() {
        try {
            const savedOrders = localStorage.getItem(ordersStorageKey);
            if (savedOrders === null) return [];

            const parsedOrders = JSON.parse(savedOrders);
            if (!Array.isArray(parsedOrders)) {
                throw new TypeError("Saved checkout orders must be an array.");
            }

            return parsedOrders.map(order => {
                if (!order || typeof order.id !== "string" || typeof order.createdAt !== "string" ||
                    !Array.isArray(order.items) || !Number.isFinite(order.total) || order.total < 0) {
                    throw new TypeError("A saved checkout order is invalid.");
                }

                const items = order.items.map(item => {
                    if (!item || typeof item.name !== "string" || !item.name.trim() ||
                        !Number.isFinite(Number(item.quantity)) || Number(item.quantity) < 1) {
                        throw new TypeError("A saved checkout item is invalid.");
                    }
                    return `${item.name.trim()} x ${Math.floor(Number(item.quantity))}`;
                });
                const itemCount = order.items.reduce((total, item) => total + Math.floor(Number(item.quantity)), 0);
                const date = new Date(order.createdAt);
                if (!Number.isFinite(date.getTime())) {
                    throw new TypeError("A saved checkout order date is invalid.");
                }
                const paymentMethod = order.payment === "Cash on Delivery"
                    ? "Cash"
                    : order.payment === "Card / E-Wallet" ? "Card" : "";
                if (!paymentMethod) {
                    throw new TypeError("A saved checkout payment method is invalid.");
                }

                return {
                    orderNumber: order.id,
                    item: items.join(", "),
                    paymentMethod,
                    totalAmount: order.total,
                    itemCount,
                    date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                };
            });
        } catch (error) {
            console.error("Could not load completed checkout orders.", error);
            return [];
        }
    }

    function loadSales() {
        const uniqueSales = new Map();
        [...createDemoSales(), ...loadSavedSales(), ...loadCheckoutOrders()].forEach(sale => {
            uniqueSales.set(sale.orderNumber, sale);
        });
        return [...uniqueSales.values()];
    }

    function createCell(text) {
        const cell = document.createElement("td");
        cell.textContent = text;
        return cell;
    }

    function showSaleDetails(sale) {
        detailsContent.replaceChildren();
        const details = [
            ["Order number", sale.orderNumber],
            ["Item", sale.item],
            ["Payment method", sale.paymentMethod],
            ["Total amount", formatter.format(sale.totalAmount)],
            ["Items sold", String(sale.itemCount)],
            ["Date", sale.date]
        ];

        details.forEach(([label, value]) => {
            const term = document.createElement("dt");
            term.textContent = label;
            const description = document.createElement("dd");
            description.textContent = value;
            detailsContent.append(term, description);
        });
        detailsDialog.showModal();
    }

    function renderSales() {
        const query = searchInput.value.trim().toLocaleLowerCase();
        const selectedPayment = paymentFilter.value;
        const visibleSales = sales
            .filter(sale =>
                (selectedPayment === "all" || sale.paymentMethod === selectedPayment) &&
                `${sale.orderNumber} ${sale.item} ${sale.paymentMethod}`.toLocaleLowerCase().includes(query)
            )
            .sort((first, second) => {
                const dateDifference = Date.parse(`${first.date}T00:00:00`) - Date.parse(`${second.date}T00:00:00`);
                if (dateDifference !== 0) return dateSort.value === "desc" ? -dateDifference : dateDifference;
                const amountDifference = first.totalAmount - second.totalAmount;
                if (amountDifference !== 0) return amountSort.value === "desc" ? -amountDifference : amountDifference;
                return first.orderNumber.localeCompare(second.orderNumber);
            });

        tableBody.replaceChildren(...visibleSales.map(sale => {
            const row = document.createElement("tr");
            row.append(
                createCell(sale.orderNumber),
                createCell(sale.item),
                createCell(sale.paymentMethod),
                createCell(formatter.format(sale.totalAmount)),
                createCell(sale.date)
            );
            const actionCell = document.createElement("td");
            const viewButton = document.createElement("button");
            viewButton.type = "button";
            viewButton.className = "view-sale-button";
            viewButton.textContent = "VIEW";
            viewButton.setAttribute("aria-label", `View order ${sale.orderNumber}`);
            viewButton.addEventListener("click", () => showSaleDetails(sale));
            actionCell.append(viewButton);
            row.append(actionCell);
            return row;
        }));

        emptyMessage.hidden = visibleSales.length > 0;
    }

    function updateSummary() {
        const totalRevenue = sales.reduce((total, sale) => total + sale.totalAmount, 0);
        const totalItems = sales.reduce((total, sale) => total + sale.itemCount, 0);
        revenueTotal.textContent = formatter.format(totalRevenue);
        transactionTotal.textContent = String(sales.length);
        itemsTotal.textContent = String(totalItems);
    }

    function refreshSales() {
        sales = loadSales();
        updateSummary();
        renderSales();
    }

    [searchInput, paymentFilter, dateSort, amountSort].forEach(control => {
        control.addEventListener("input", renderSales);
        control.addEventListener("change", renderSales);
    });
    document.getElementById("sale-dialog-close").addEventListener("click", () => detailsDialog.close());

    window.addEventListener("storage", event => {
        if (event.key === storageKey || event.key === ordersStorageKey || event.key === null) {
            refreshSales();
        }
    });

    refreshSales();
})();
