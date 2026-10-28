(() => {
    const logs = window.CLC_INVENTORY_LOGS.load();
    const searchInput = document.getElementById("inventory-search");
    const actionFilter = document.getElementById("inventory-action-filter");
    const dateSort = document.getElementById("inventory-date-sort");
    const stockSort = document.getElementById("inventory-stock-sort");
    const tableBody = document.getElementById("inventory-table-body");
    const emptyMessage = document.getElementById("inventory-empty");
    const detailsDialog = document.getElementById("inventory-details-dialog");
    const detailsContent = document.getElementById("inventory-details-content");

    function createCell(text) {
        const cell = document.createElement("td");
        cell.textContent = text;
        return cell;
    }

    function showDetails(log) {
        detailsContent.replaceChildren();
        [
            ["Log ID", log.id],
            ["Item", log.item],
            ["Action", log.action],
            ["Stock quantity", String(log.quantity)],
            ["Items sold", String(log.soldUnits)],
            ["Date", log.date],
            ["Details", log.details]
        ].forEach(([label, value]) => {
            const term = document.createElement("dt");
            term.textContent = label;
            const description = document.createElement("dd");
            description.textContent = value;
            detailsContent.append(term, description);
        });
        detailsDialog.showModal();
    }

    function renderLogs() {
        const query = searchInput.value.trim().toLocaleLowerCase();
        const selectedAction = actionFilter.value;
        const visibleLogs = logs
            .filter(log =>
                (selectedAction === "all" || log.action === selectedAction) &&
                `${log.id} ${log.item} ${log.action}`.toLocaleLowerCase().includes(query)
            )
            .sort((first, second) => {
                const dateDifference = Date.parse(`${first.date}T00:00:00`) - Date.parse(`${second.date}T00:00:00`);
                if (dateDifference !== 0) return dateSort.value === "desc" ? -dateDifference : dateDifference;
                if (first.quantity !== second.quantity) {
                    return stockSort.value === "desc"
                        ? second.quantity - first.quantity
                        : first.quantity - second.quantity;
                }
                return first.id.localeCompare(second.id, undefined, { numeric: true });
            });

        tableBody.replaceChildren(...visibleLogs.map(log => {
            const row = document.createElement("tr");
            row.append(
                createCell(log.id),
                createCell(log.item),
                createCell(log.action),
                createCell(String(log.quantity))
            );
            const actionCell = document.createElement("td");
            const viewButton = document.createElement("button");
            viewButton.type = "button";
            viewButton.className = "view-sale-button";
            viewButton.textContent = "VIEW";
            viewButton.setAttribute("aria-label", `View log ${log.id}`);
            viewButton.addEventListener("click", () => showDetails(log));
            actionCell.append(viewButton);
            row.append(actionCell);
            return row;
        }));
        emptyMessage.hidden = visibleLogs.length > 0;
    }

    document.getElementById("total-logs").textContent = String(logs.length);
    document.getElementById("products-added").textContent =
        String(logs.filter(log => log.action === "Added").length);
    document.getElementById("inventory-items-sold").textContent =
        String(logs.reduce((total, log) => total + log.soldUnits, 0));

    [searchInput, actionFilter, dateSort, stockSort].forEach(control => {
        control.addEventListener("input", renderLogs);
        control.addEventListener("change", renderLogs);
    });
    document.getElementById("inventory-dialog-close").addEventListener("click", () => detailsDialog.close());
    renderLogs();
})();
