(() => {
    const storageKey = "clc-inventory-logs-v1";
    const activity = [
        ["Morning Joy", "Added", 140, 0, 0, "New kids fragrance added to the catalog"],
        ["6PAX", "Sold", 72, 3, 1, "Three units included in a completed sample order"],
        ["Dahlia Eternelle", "Restocked", 118, 0, 2, "Stock replenished"],
        ["Solaire", "Edited", 54, 0, 3, "Product details updated"],
        ["Blue Dragon", "Sold", 91, 2, 4, "Two units included in a completed sample order"],
        ["Paolo Pasqual", "Added", 63, 0, 5, "New unisex fragrance added to the catalog"],
        ["One More Chance?", "Returned", 39, 1, 6, "One unit returned to available stock"],
        ["Always Right", "Restocked", 126, 0, 8, "Stock replenished"],
        ["Jasmine Noire", "Edited", 47, 0, 9, "Product image and description updated"],
        ["Milly Rock", "Sold", 83, 4, 10, "Four units included in a completed sample order"],
        ["Versace on the Floor", "Added", 58, 0, 12, "New fragrance added to the catalog"],
        ["Oceanus", "Sold", 96, 1, 13, "One unit included in a completed sample order"],
        ["Pink Snitch", "Restocked", 112, 0, 15, "Stock replenished"],
        ["Weston", "Edited", 44, 0, 17, "Retail price updated"],
        ["Little Bear", "Sold", 67, 2, 19, "Two units included in a completed sample order"],
        ["Memories", "Added", 35, 0, 22, "New fragrance added to the catalog"],
        ["Nocturne", "Returned", 52, 1, 25, "One unit returned to available stock"]
    ];

    function formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }

    const starterLogs = activity.map(([item, action, quantity, soldUnits, daysAgo, details], index) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return {
            id: `DEMO-INV-${date.getFullYear()}-${String(index + 1).padStart(4, "0")}`,
            item,
            action,
            quantity,
            soldUnits,
            date: formatDate(date),
            details: `Sample activity: ${details}`
        };
    });

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

    function isLegacySampleLog(log) {
        return /^202600[1-9]$|^20260(1[0-7])$/.test(log.id) &&
            log.item === "Perfume" &&
            log.date === "2026-10-27" &&
            log.details === `${log.action} inventory record`;
    }

    function load() {
        try {
            const savedLogs = localStorage.getItem(storageKey);
            if (savedLogs === null) return starterLogs.map(log => ({ ...log }));
            const parsedLogs = JSON.parse(savedLogs);
            if (!Array.isArray(parsedLogs) || !parsedLogs.every(isLog)) {
                throw new TypeError("Saved inventory log data is invalid.");
            }
            if (parsedLogs.some(isLegacySampleLog)) {
                return [
                    ...starterLogs.map(log => ({ ...log })),
                    ...parsedLogs.filter(log => !isLegacySampleLog(log))
                ];
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

    window.CLC_INVENTORY_LOGS = { load, append, storageKey };
})();
