(() => {
    const storageKey = "clc-inventory-logs-v1";
    const actions = [
        ["Edited", 0], ["Restocked", 0], ["Restocked", 0], ["Restocked", 0],
        ["Sold", 4], ["Added", 0], ["Edited", 0], ["Edited", 0],
        ["Sold", 5], ["Restocked", 0], ["Sold", 7], ["Returned", 0],
        ["Added", 0], ["Added", 0], ["Added", 0], ["Edited", 0], ["Restocked", 0]
    ];
    const starterLogs = actions.map(([action, soldUnits], index) => ({
        id: String(2026001 + index),
        item: "Perfume",
        action,
        quantity: 100,
        soldUnits,
        date: "2026-10-27",
        details: `${action} inventory record`
    }));

    function isLog(log) {
        return log &&
            typeof log.id === "string" &&
            typeof log.item === "string" &&
            ["Added", "Edited", "Restocked", "Sold", "Returned"].includes(log.action) &&
            Number.isInteger(log.quantity) && log.quantity >= 0 &&
            Number.isInteger(log.soldUnits) && log.soldUnits >= 0 &&
            typeof log.date === "string" &&
            !Number.isNaN(Date.parse(`${log.date}T00:00:00`)) &&
            typeof log.details === "string";
    }

    function load() {
        try {
            const savedLogs = localStorage.getItem(storageKey);
            if (savedLogs === null) return starterLogs.map(log => ({ ...log }));
            const parsedLogs = JSON.parse(savedLogs);
            if (!Array.isArray(parsedLogs) || !parsedLogs.every(isLog)) {
                throw new TypeError("Saved inventory log data is invalid.");
            }
            return parsedLogs;
        } catch (error) {
            console.error("Could not load inventory logs.", error);
            return starterLogs.map(log => ({ ...log }));
        }
    }

    function append({ item, action, quantity, soldUnits = 0, details }) {
        const logs = load();
        const log = {
            id: `LOG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            item,
            action,
            quantity,
            soldUnits,
            date: new Date().toISOString().slice(0, 10),
            details
        };
        if (!isLog(log)) throw new TypeError("Inventory log entry is invalid.");
        logs.push(log);
        localStorage.setItem(storageKey, JSON.stringify(logs));
        return log;
    }

    window.CLC_INVENTORY_LOGS = { load, append };
})();
