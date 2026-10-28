(() => {
    const storageKey = "clc-sales-history-v1";
    const defaultSales = Array.from({ length: 16 }, (_, index) => {
        const orderNumber = 2026001 + index;
        const paymentMethods = ["GCash", "Cash", "GCash", "Cash", "Cash", "GCash"];
        return {
            orderNumber: String(orderNumber),
            item: "Perfume",
            paymentMethod: paymentMethods[index % paymentMethods.length],
            totalAmount: 100,
            itemCount: 1,
            date: "2026-10-27"
        };
    });
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

    function loadSales() {
        try {
            const savedSales = localStorage.getItem(storageKey);
            if (savedSales === null) return defaultSales.map(sale => ({ ...sale }));
            const parsedSales = JSON.parse(savedSales);
            if (!Array.isArray(parsedSales) || !parsedSales.every(isValidSale)) {
                throw new TypeError("Saved sales data is invalid.");
            }
            return parsedSales;
        } catch (error) {
            console.error("Could not load sales history.", error);
            return defaultSales.map(sale => ({ ...sale }));
        }
    }

    const sales = loadSales();

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

    const totalRevenue = sales.reduce((total, sale) => total + sale.totalAmount, 0);
    const totalItems = sales.reduce((total, sale) => total + sale.itemCount, 0);
    revenueTotal.textContent = formatter.format(totalRevenue).replace(/\.00$/, "");
    transactionTotal.textContent = String(sales.length);
    itemsTotal.textContent = String(totalItems);

    [searchInput, paymentFilter, dateSort, amountSort].forEach(control => {
        control.addEventListener("input", renderSales);
        control.addEventListener("change", renderSales);
    });
    document.getElementById("sale-dialog-close").addEventListener("click", () => detailsDialog.close());

    renderSales();
})();
