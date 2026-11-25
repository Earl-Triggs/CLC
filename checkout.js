(() => {
    const cartKey = "clc-cart-v1";
    const form = document.getElementById("checkout-form");
    const voucherInput = document.getElementById("voucher");
    const applyVoucherButton = document.getElementById("apply-voucher");
    const error = document.getElementById("checkout-error");
    let discount = 0;

    function readCart() {
        try {
            const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
            return Array.isArray(cart) ? cart : [];
        } catch (loadError) {
            console.error("Could not load the checkout cart.", loadError);
            return [];
        }
    }

    const cart = readCart();
    const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const shipping = cart.length === 0 ? 0 : subtotal >= 75 ? 0 : 8.5;
    const tax = subtotal * 0.08;

    function formatCurrency(value) {
        return `$${value.toFixed(2)}`;
    }

    function renderSummary() {
        const discountRow = document.getElementById("discount-row");
        document.getElementById("checkout-subtotal").textContent = formatCurrency(subtotal);
        document.getElementById("checkout-shipping").textContent = formatCurrency(shipping);
        document.getElementById("checkout-tax").textContent = formatCurrency(tax);
        document.getElementById("checkout-discount").textContent = `-${formatCurrency(discount)}`;
        document.getElementById("checkout-total").textContent = formatCurrency(subtotal + shipping + tax - discount);
        discountRow.hidden = discount === 0;
    }

    renderSummary();

    if (cart.length === 0) {
        error.textContent = "Your cart is empty. Add items before placing an order.";
        form.querySelector(".place-order-btn").disabled = true;
    }

    applyVoucherButton.addEventListener("click", () => {
        if (voucherInput.value.trim().toUpperCase() === "CLC10") {
            discount = subtotal * 0.10;
            error.textContent = "";
            applyVoucherButton.textContent = "Applied";
        } else {
            discount = 0;
            error.textContent = "That voucher is not valid.";
            applyVoucherButton.textContent = "Apply";
        }
        renderSummary();
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!form.checkValidity()) {
            error.textContent = "Please complete all required delivery fields.";
            form.reportValidity();
            return;
        }
        if (cart.length === 0) {
            error.textContent = "Your cart is empty.";
            return;
        }

        const data = new FormData(form);
        const order = {
            id: `CLC-${Date.now().toString().slice(-8)}`,
            createdAt: new Date().toISOString(),
            customer: {
                firstName: data.get("firstName"),
                lastName: data.get("lastName"),
                unit: data.get("unit"),
                province: data.get("province"),
                district: data.get("district"),
                street: data.get("street"),
                notes: data.get("notes")
            },
            payment: data.get("payment"),
            items: cart,
            subtotal,
            shipping,
            tax,
            discount,
            total: subtotal + shipping + tax - discount
        };

        let savedOrders = [];
        try {
            savedOrders = JSON.parse(localStorage.getItem("clc-orders-v1") || "[]");
            if (!Array.isArray(savedOrders)) savedOrders = [];
        } catch (loadError) {
            console.error("Could not load previous orders.", loadError);
        }
        savedOrders.push(order);
        localStorage.setItem("clc-orders-v1", JSON.stringify(savedOrders));
        localStorage.removeItem(cartKey);

        document.getElementById("order-success-message").textContent = `Order ${order.id} was placed successfully.`;
        document.getElementById("order-success-backdrop").hidden = false;
    });
})();
