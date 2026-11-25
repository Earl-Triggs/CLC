(() => {
    const storageKey = "clc-login-history-v1";
    const sampleUsers = [
        "Chen", "Triggs", "Zhini", "Vegh", "Kyle", "Zukiny", "Inume", "AJ",
        "Ashiru", "Zephyr", "Illoai", "Mercy", "Sigma", "Calichen", "Yeheno",
        "Thragg", "Nyx", "Elowen", "Amari", "Noor"
    ];
    const searchInput = document.getElementById("login-search");
    const timeSort = document.getElementById("login-time-sort");
    const usernameSort = document.getElementById("login-username-sort");
    const tableBody = document.getElementById("login-history-body");
    const emptyMessage = document.getElementById("login-history-empty");
    const timeFormatter = new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short"
    });
    let loginHistory = [];

    function createDemoHistory() {
        const now = new Date();
        return sampleUsers.map((username, index) => {
            const loginTime = new Date(now.getTime() - (index * 97 + 12) * 60 * 1000);
            return {
                id: `DEMO-LOGIN-${now.getFullYear()}-${String(index + 1).padStart(4, "0")}`,
                username,
                loginTime: loginTime.toISOString()
            };
        });
    }

    function isValidEntry(entry) {
        return entry &&
            typeof entry.id === "string" &&
            typeof entry.username === "string" &&
            entry.username.trim().length > 0 &&
            typeof entry.loginTime === "string" &&
            Number.isFinite(Date.parse(entry.loginTime));
    }

    function loadSavedHistory() {
        try {
            const savedHistory = localStorage.getItem(storageKey);
            if (savedHistory === null) return [];
            const parsedHistory = JSON.parse(savedHistory);
            if (!Array.isArray(parsedHistory) || !parsedHistory.every(isValidEntry)) {
                throw new TypeError("Saved login history data is invalid.");
            }
            return parsedHistory;
        } catch (error) {
            console.error("Could not load login history.", error);
            return [];
        }
    }

    function loadHistory() {
        const entriesById = new Map();
        [...createDemoHistory(), ...loadSavedHistory()].forEach(entry => {
            entriesById.set(entry.id, entry);
        });
        return [...entriesById.values()];
    }

    function createCell(text) {
        const cell = document.createElement("td");
        cell.textContent = text;
        return cell;
    }

    function renderHistory() {
        const query = searchInput.value.trim().toLocaleLowerCase();
        const visibleEntries = loginHistory
            .filter(entry => `${entry.id} ${entry.username}`.toLocaleLowerCase().includes(query))
            .sort((first, second) => {
                const usernameDifference = first.username.localeCompare(second.username, undefined, {
                    sensitivity: "base"
                });
                if (usernameDifference !== 0) {
                    return usernameSort.value === "desc" ? -usernameDifference : usernameDifference;
                }
                const timeDifference = Date.parse(first.loginTime) - Date.parse(second.loginTime);
                return timeSort.value === "desc" ? -timeDifference : timeDifference;
            });

        tableBody.replaceChildren(...visibleEntries.map(entry => {
            const row = document.createElement("tr");
            row.append(
                createCell(entry.id),
                createCell(entry.username),
                createCell(timeFormatter.format(new Date(entry.loginTime)))
            );
            return row;
        }));
        emptyMessage.hidden = visibleEntries.length > 0;
    }

    function refreshHistory() {
        loginHistory = loadHistory();
        renderHistory();
    }

    [searchInput, timeSort, usernameSort].forEach(control => {
        control.addEventListener("input", renderHistory);
        control.addEventListener("change", renderHistory);
    });

    window.addEventListener("storage", event => {
        if (event.key === storageKey || event.key === null) {
            refreshHistory();
        }
    });

    refreshHistory();
})();
