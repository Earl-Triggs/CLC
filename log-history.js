(() => {
    const loginHistory = [
        ["2026001", "Chen", "2026-10-28T14:42:00"],
        ["2026002", "Triggs", "2026-10-28T14:25:00"],
        ["2026003", "Zhini", "2026-10-28T14:03:00"],
        ["2026004", "Vegh", "2026-10-28T13:51:00"],
        ["2026005", "Kyle", "2026-10-28T13:34:00"],
        ["2026006", "Zukiny", "2026-10-28T13:12:00"],
        ["2026007", "Inume", "2026-10-28T12:56:00"],
        ["2026008", "AJ", "2026-10-28T12:31:00"],
        ["2026009", "Ashiru", "2026-10-28T12:15:00"],
        ["2026010", "Zephyr", "2026-10-28T11:48:00"],
        ["2026011", "Illoai", "2026-10-28T11:20:00"],
        ["2026012", "Mercy", "2026-10-28T10:52:00"],
        ["2026013", "Sigma", "2026-10-28T10:26:00"],
        ["2026014", "Calichen", "2026-10-28T09:58:00"],
        ["2026015", "Yeheno", "2026-10-28T09:24:00"],
        ["2026016", "Thragg", "2026-10-28T08:47:00"],
        ["2026017", "Nyx", "2026-10-28T08:15:00"],
        ["2026018", "Elowen", "2026-10-28T07:50:00"],
        ["2026019", "Amari", "2026-10-28T07:25:00"],
        ["2026020", "Noor", "2026-10-28T07:05:00"]
    ].map(([id, username, loginTime]) => ({ id, username, loginTime }));

    const searchInput = document.getElementById("login-search");
    const timeSort = document.getElementById("login-time-sort");
    const usernameSort = document.getElementById("login-username-sort");
    const tableBody = document.getElementById("login-history-body");
    const emptyMessage = document.getElementById("login-history-empty");
    const timeFormatter = new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short"
    });

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

    [searchInput, timeSort, usernameSort].forEach(control => {
        control.addEventListener("input", renderHistory);
        control.addEventListener("change", renderHistory);
    });
    renderHistory();
})();
