(() => {
    const defaultProducts = [
        { name: "Helianthus de Soie", price: 20.15, category: "Women", image: "CLC images/Home and Kids/HP Bottom Image 1.png" },
        { name: "Jasmine Noire", price: 16.49, category: "Women", image: "CLC images/Home and Kids/HP Bottom Image 2.png" },
        { name: "Dahlia Eternelle", price: 18.98, category: "Men", image: "CLC images/Men/HP Bottom Image 6.png" },
        { name: "6PAX", price: 17.23, category: "Men", image: "CLC images/Men/HP Bottom Image 7.png" }
    ];

    const products = window.CLC_PRODUCTS || defaultProducts;
    const productSections = window.CLC_PRODUCT_SECTIONS || [{ targetId: "product-grid", products }];
    const categoryButtons = [...document.querySelectorAll(".category-btn[data-category]")];
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-btn");
    const searchBox = document.querySelector(".search-box");
    const noResults = document.getElementById("no-results");
    const cartCount = document.getElementById("cart-count");
    const cartDrawer = document.getElementById("cart-drawer");
    const cartBackdrop = document.getElementById("cart-backdrop");
    const cartItems = document.getElementById("cart-items");
    const cartItemCount = document.getElementById("cart-item-count");
    const cartSubtotal = document.getElementById("cart-subtotal");
    const cartItemsTotal = document.getElementById("cart-items-total");
    const cartShipping = document.getElementById("cart-shipping");
    const cartTax = document.getElementById("cart-tax");
    const cartTotal = document.getElementById("cart-total");
    const cartButton = document.getElementById("cart-btn");
    const cartCloseButton = document.getElementById("cart-close");
    const accountButton = document.getElementById("account-btn");
    const accountMenu = document.getElementById("account-menu");
    const cartStorageKey = "clc-cart-v1";

    function escapeHtml(value) {
        const element = document.createElement("span");
        element.textContent = String(value ?? "");
        return element.innerHTML;
    }

    function normalizeCartItem(item) {
        if (!item || typeof item.name !== "string" || !item.name.trim()) {
            return null;
        }

        const price = Number(item.price);
        const quantity = Number(item.quantity);

        if (!Number.isFinite(price) || price < 0) {
            return null;
        }

        return {
            name: item.name.trim(),
            price,
            image: typeof item.image === "string" ? item.image : "",
            quantity: Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1
        };
    }

    function loadCart() {
        try {
            const savedCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
            if (!Array.isArray(savedCart)) {
                throw new TypeError("Saved cart data must be an array.");
            }
            return savedCart.map(normalizeCartItem).filter(Boolean);
        } catch (error) {
            console.error("Could not load the saved cart.", error);
            return [];
        }
    }

    function setAccountMenuOpen(isOpen) {
        if (!accountMenu || !accountButton) return;
        accountMenu.hidden = !isOpen;
        accountButton.setAttribute("aria-expanded", String(isOpen));
    }

    function setCartOpen(isOpen) {
        if (!cartDrawer || !cartBackdrop) return;
        cartDrawer.hidden = !isOpen;
        cartBackdrop.hidden = !isOpen;
        cartDrawer.setAttribute("aria-hidden", String(!isOpen));
        cartButton?.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("cart-open", isOpen);
        if (isOpen) {
            cartCloseButton?.focus();
        } else {
            cartButton?.focus();
        }
    }

    let cart = loadCart();
    const requestedCategory = new URLSearchParams(window.location.search).get("category");
    let selectedCategory = ["Kids", "Men", "Women", "Unisex"].includes(requestedCategory)
        ? requestedCategory
        : null;

    function renderProducts() {
        productSections.forEach(section => {
            const grid = document.getElementById(section.targetId);
            if (!grid) return;

            grid.innerHTML = section.products.map(product => `
                <article class="product-card" data-category="${escapeHtml(product.category || "")}">
                    <img src="${escapeHtml(product.image || "")}" alt="${escapeHtml(product.imageAlt || `${product.name} perfume`)}" loading="lazy">
                    <div class="product-info">
                        <h3>${escapeHtml(product.name)}</h3>
                        <p class="price">$${Number(product.price).toFixed(2)}</p>
                        <p class="stars" aria-label="5 out of 5 stars">★★★★★</p>
                        <button class="add-to-cart" data-name="${escapeHtml(product.name)}" data-price="${Number(product.price)}" data-image="${escapeHtml(product.image || "")}">🛒 ADD TO CART</button>
                    </div>
                </article>
            `).join("");
        });
    }

    function renderCart() {
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (cartCount) cartCount.textContent = String(totalQuantity);
        if (cartItemCount) cartItemCount.textContent = `(${totalQuantity})`;

        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = cart.length === 0 ? 0 : subtotal >= 75 ? 0 : 8.50;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (cartItemsTotal) cartItemsTotal.textContent = `$${subtotal.toFixed(2)}`;
        if (cartShipping) cartShipping.textContent = `$${shipping.toFixed(2)}`;
        if (cartTax) cartTax.textContent = `$${tax.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;

        try {
            localStorage.setItem(cartStorageKey, JSON.stringify(cart));
        } catch (error) {
            console.error("Could not save the cart.", error);
        }

        if (!cartItems) return;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
            return;
        }

        cartItems.innerHTML = cart.map((item, index) => `
            <article class="cart-item">
                <div class="cart-item-main">
                    <img class="cart-item-image" src="${escapeHtml(item.image || "CLC images/Home and Kids/HP Bottom Image 1.png")}" alt="${escapeHtml(item.name)} perfume" loading="lazy">
                    <div class="cart-item-details">
                        <p class="cart-item-name">${escapeHtml(item.name)}</p>
                        <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control" aria-label="Quantity for ${escapeHtml(item.name)}">
                        <button type="button" class="qty-btn" data-action="decrease" data-cart-index="${index}" aria-label="Decrease quantity for ${escapeHtml(item.name)}">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button type="button" class="qty-btn" data-action="increase" data-cart-index="${index}" aria-label="Increase quantity for ${escapeHtml(item.name)}">+</button>
                    </div>
                    <button type="button" class="cart-item-remove" data-cart-index="${index}" aria-label="Remove ${escapeHtml(item.name)} from cart">Remove</button>
                </div>
            </article>
        `).join("");
    }

    function addItemToCart(name, price, image) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }
        renderCart();
    }

    function filterProducts() {
        const term = searchInput?.value.trim().toLowerCase() || "";
        let visibleCount = 0;

        document.querySelectorAll(".product-card").forEach(card => {
            const name = (card.querySelector("h3")?.textContent || card.dataset.name || "").toLowerCase();
            const category = card.dataset.category;
            const matchesCategory = !selectedCategory || category === selectedCategory;
            const matchesSearch = name.includes(term);
            const visible = matchesCategory && matchesSearch;

            card.hidden = !visible;
            if (visible) visibleCount++;
        });

        if (noResults) noResults.hidden = visibleCount !== 0;
    }

    function showAddButtonState(button) {
        const originalText = button.dataset.originalText || button.textContent;
        button.dataset.originalText = originalText;
        button.textContent = "✓ ADDED";
        window.setTimeout(() => {
            button.textContent = originalText;
        }, 1000);
    }

    renderProducts();
    renderCart();

    if (selectedCategory) {
        filterProducts();
    }

    categoryButtons.forEach(button => {
        button.classList.toggle("selected", button.dataset.category === selectedCategory);

        button.addEventListener("click", () => {
            const category = button.dataset.category;
            selectedCategory = selectedCategory === category ? null : category;

            categoryButtons.forEach(btn => {
                btn.classList.toggle("selected", btn.dataset.category === selectedCategory);
            });

            filterProducts();
            document.getElementById("best-sellers")?.scrollIntoView({ behavior: "smooth" });
        });
    });

    document.addEventListener("click", event => {
        const addButton = event.target.closest(".add-to-cart");
        if (addButton) {
            const name = addButton.dataset.name;
            const price = Number(addButton.dataset.price);
            const image = addButton.dataset.image || "";

            if (!name || !Number.isFinite(price) || price < 0) {
                console.error("Add-to-cart button requires a product name and non-negative price.");
                return;
            }

            addItemToCart(name, price, image);
            showAddButtonState(addButton);
            return;
        }

        const quantityButton = event.target.closest(".qty-btn");
        if (quantityButton) {
            const index = Number(quantityButton.dataset.cartIndex);
            const action = quantityButton.dataset.action;

            if (!Number.isInteger(index) || index < 0 || index >= cart.length) return;

            const item = cart[index];
            if (action === "increase") {
                item.quantity += 1;
            } else if (action === "decrease") {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    cart.splice(index, 1);
                }
            }

            renderCart();
            return;
        }

        const removeButton = event.target.closest(".cart-item-remove");
        if (removeButton) {
            const index = Number(removeButton.dataset.cartIndex);
            if (Number.isInteger(index) && index >= 0 && index < cart.length) {
                cart.splice(index, 1);
                renderCart();
            }
            return;
        }

        if (accountMenu && accountButton && !event.target.closest(".account-menu-wrapper")) {
            setAccountMenuOpen(false);
        }
    });

    if (searchButton && searchBox && searchInput) {
        let searchIdleTimeout;

        const closeSearch = () => {
            clearTimeout(searchIdleTimeout);
            searchBox.classList.remove("is-open");
            searchButton.setAttribute("aria-expanded", "false");
            searchButton.setAttribute("aria-label", "Open search");
            searchInput.blur();
        };

        const resetSearchIdleTimeout = () => {
            clearTimeout(searchIdleTimeout);
            if (searchBox.classList.contains("is-open")) {
                searchIdleTimeout = setTimeout(closeSearch, 10000);
            }
        };

        searchButton.addEventListener("click", () => {
            if (!searchBox.classList.contains("is-open")) {
                searchBox.classList.add("is-open");
                searchButton.setAttribute("aria-expanded", "true");
                searchButton.setAttribute("aria-label", "Search");
                searchInput.focus();
                resetSearchIdleTimeout();
                return;
            }

            filterProducts();
            resetSearchIdleTimeout();
        });

        searchBox.addEventListener("pointerdown", resetSearchIdleTimeout);
        searchInput.addEventListener("input", () => {
            filterProducts();
            resetSearchIdleTimeout();
        });

        searchInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                filterProducts();
            } else if (event.key === "Escape") {
                closeSearch();
                searchButton.focus();
                return;
            }
            resetSearchIdleTimeout();
        });
    }

    if (cartButton) {
        cartButton.addEventListener("click", () => setCartOpen(true));
    }

    if (cartCloseButton) {
        cartCloseButton.addEventListener("click", () => setCartOpen(false));
    }

    if (cartBackdrop) {
        cartBackdrop.addEventListener("click", () => setCartOpen(false));
    }

    if (accountButton && accountMenu) {
        accountButton.addEventListener("click", () => {
            const willOpen = accountMenu.hidden;
            setAccountMenuOpen(willOpen);
            if (willOpen) {
                accountMenu.querySelector('[role="menuitem"]')?.focus();
            }
        });

        accountMenu.addEventListener("click", event => {
            const menuItem = event.target.closest('[role="menuitem"]');
            if (!menuItem) return;

            const action = menuItem.dataset.action;
            if (action === "logout") {
                localStorage.removeItem("clc_remembered_email");
                window.location.href = "Login.html";
                return;
            }

            setAccountMenuOpen(false);
            accountButton.focus();
        });

        accountMenu.addEventListener("keydown", event => {
            const items = [...accountMenu.querySelectorAll('[role="menuitem"]')];
            if (items.length === 0) return;

            const currentIndex = items.indexOf(document.activeElement);
            let nextIndex;

            if (event.key === "ArrowDown") {
                nextIndex = (currentIndex + 1) % items.length;
            } else if (event.key === "ArrowUp") {
                nextIndex = (currentIndex - 1 + items.length) % items.length;
            } else if (event.key === "Home") {
                nextIndex = 0;
            } else if (event.key === "End") {
                nextIndex = items.length - 1;
            } else if (event.key === "Escape") {
                setAccountMenuOpen(false);
                accountButton.focus();
                return;
            }

            if (nextIndex !== undefined) {
                event.preventDefault();
                items[nextIndex].focus();
            }
        });
    }

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;

        if (accountMenu && !accountMenu.hidden && accountButton && !accountMenu.contains(event.target)) {
            setAccountMenuOpen(false);
            accountButton.focus();
            return;
        }

        if (cartDrawer && !cartDrawer.hidden) {
            setCartOpen(false);
        }
    });

    window.addEventListener("storage", event => {
        if (event.key !== cartStorageKey) return;
        cart = loadCart();
        renderCart();
    });
})();
