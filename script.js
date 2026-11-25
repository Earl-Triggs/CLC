﻿(() => {
    const conversionRate = 58;
    const currencyFormatter = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    window.CLC_CURRENCY = {
        conversionRate,
        freeShippingThreshold: 4350,
        standardShippingFee: 493,
        toPHP: value => Math.round(Number(value) * conversionRate * 100) / 100,
        format: value => currencyFormatter.format(Number(value))
    };

    function migrateStoredCurrency(key, convert) {
        const markerKey = `clc-currency-v${conversionRate}-${key}`;
        try {
            if (localStorage.getItem(markerKey) === "complete") return;
            const storedValue = localStorage.getItem(key);
            if (storedValue !== null) {
                const records = JSON.parse(storedValue);
                if (!Array.isArray(records)) {
                    throw new TypeError(`Saved ${key} data must be an array.`);
                }
                localStorage.setItem(key, JSON.stringify(records.map(convert)));
            }
            localStorage.setItem(markerKey, "complete");
        } catch (error) {
            console.error(`Could not convert saved ${key} amounts to PHP.`, error);
        }
    }

    const convertStoredAmount = value =>
        Number.isFinite(value) ? window.CLC_CURRENCY.toPHP(value) : value;
    migrateStoredCurrency("clc-cart-v1", item =>
        item && typeof item === "object" ? { ...item, price: convertStoredAmount(item.price) } : item
    );
    migrateStoredCurrency("clc-admin-products-v1", product => {
        if (!product || typeof product !== "object") return product;
        const convertedProduct = { ...product, price: convertStoredAmount(product.price) };
        if (Object.prototype.hasOwnProperty.call(product, "retailPrice")) {
            convertedProduct.retailPrice = convertStoredAmount(product.retailPrice);
        }
        return convertedProduct;
    });
    migrateStoredCurrency("clc-orders-v1", order => {
        if (!order || typeof order !== "object") return order;
        const convertedOrder = { ...order };
        ["subtotal", "shipping", "tax", "discount", "total"].forEach(key => {
            if (Object.prototype.hasOwnProperty.call(order, key)) {
                convertedOrder[key] = convertStoredAmount(order[key]);
            }
        });
        if (Array.isArray(order.items)) {
            convertedOrder.items = order.items.map(item =>
                item && typeof item === "object"
                    ? { ...item, price: convertStoredAmount(item.price) }
                    : item
            );
        }
        return convertedOrder;
    });

    const defaultProducts = [
        { name: "Helianthus de Soie", price: 1168.70, category: "Women", image: "CLC images/Home and Kids/HP Bottom Image 1.png", description: "A luminous, elegant fragrance with a soft golden mood for mornings that deserve a little ceremony." },
        { name: "Jasmine Noire", price: 956.42, category: "Women", image: "CLC images/Home and Kids/HP Bottom Image 2.png", description: "A graceful, mysterious fragrance with a poised evening mood and a softly dramatic finish." },
        { name: "Dahlia Eternelle", price: 1100.84, category: "Men", image: "CLC images/Men/HP Bottom Image 6.png", description: "A refined, modern fragrance with a composed presence for evenings that call for quiet confidence." },
        { name: "6PAX", price: 999.34, category: "Men", image: "CLC images/Men/HP Bottom Image 7.png", description: "A bold, energetic fragrance with an easy confidence that moves from daytime plans to a night out." }
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
    const siteHeader = document.querySelector(".navbar");
    const productDetailBackdrop = document.getElementById("product-detail-backdrop");
    const productDetailDialog = document.getElementById("product-detail-dialog");
    const productDetailCloseButton = document.getElementById("product-detail-close");
    const productDetailImage = document.getElementById("product-detail-image");
    const productDetailCategory = document.getElementById("product-detail-category");
    const productDetailTitle = document.getElementById("product-detail-title");
    const productDetailPrice = document.getElementById("product-detail-price");
    const productDetailDescription = document.getElementById("product-detail-description");
    const productDetailQuantity = document.getElementById("product-quantity");
    const productDetailDecreaseButton = document.getElementById("product-quantity-decrease");
    const productDetailIncreaseButton = document.getElementById("product-quantity-increase");
    const productDetailAddButton = document.getElementById("product-detail-add");
    const productDetailBuyButton = document.getElementById("product-detail-buy");
    let activeProduct = null;
    let activeProductTrigger = null;

    if (siteHeader) {
        let lastScrollY = window.scrollY;
        let scrollFramePending = false;

        const updateHeaderVisibility = () => {
            const currentScrollY = window.scrollY;
            const headerHasFocus = siteHeader.contains(document.activeElement);

            if (currentScrollY <= siteHeader.offsetHeight || currentScrollY < lastScrollY || headerHasFocus) {
                siteHeader.classList.remove("navbar-scroll-hidden");
            } else if (currentScrollY > lastScrollY) {
                siteHeader.classList.add("navbar-scroll-hidden");
            }

            lastScrollY = currentScrollY;
            scrollFramePending = false;
        };

        window.addEventListener("scroll", () => {
            if (scrollFramePending) return;
            scrollFramePending = true;
            window.requestAnimationFrame(updateHeaderVisibility);
        }, { passive: true });

        siteHeader.addEventListener("focusin", () => {
            siteHeader.classList.remove("navbar-scroll-hidden");
        });
    }

    function escapeHtml(value) {
        const element = document.createElement("span");
        element.textContent = String(value ?? "");
        return element.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    function formatCurrency(value) {
        return window.CLC_CURRENCY.format(value);
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

            grid.innerHTML = section.products.map(product => {
                const price = Number(product.price);
                const description = product.description ||
                    `A fragrance from CLC's ${product.category || "signature"} collection.`;
                return `
                <article class="product-card" data-category="${escapeHtml(product.category || "")}">
                    <button type="button" class="product-detail-trigger" aria-haspopup="dialog" aria-expanded="false"
                        aria-label="View details for ${escapeHtml(product.name)}"
                        data-name="${escapeHtml(product.name)}"
                        data-price="${price}"
                        data-image="${escapeHtml(product.image || "")}"
                        data-category="${escapeHtml(product.category || "")}"
                        data-description="${escapeHtml(description)}">
                        <img src="${escapeHtml(product.image || "")}" alt="${escapeHtml(product.imageAlt || `${product.name} perfume`)}" loading="lazy">
                        <div class="product-info">
                            <h3>${escapeHtml(product.name)}</h3>
                            <p class="price">${formatCurrency(price)}</p>
                            <p class="stars" aria-label="5 out of 5 stars">★★★★★</p>
                        </div>
                    </button>
                    <button class="add-to-cart" data-name="${escapeHtml(product.name)}" data-price="${price}" data-image="${escapeHtml(product.image || "")}">🛒 ADD TO CART</button>
                </article>
            `;
            }).join("");
        });
    }

    function renderCart() {
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (cartCount) cartCount.textContent = String(totalQuantity);
        if (cartItemCount) cartItemCount.textContent = `(${totalQuantity})`;

        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = cart.length === 0
            ? 0
            : subtotal >= window.CLC_CURRENCY.freeShippingThreshold
                ? 0
                : window.CLC_CURRENCY.standardShippingFee;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        if (cartSubtotal) cartSubtotal.textContent = formatCurrency(subtotal);
        if (cartItemsTotal) cartItemsTotal.textContent = formatCurrency(subtotal);
        if (cartShipping) cartShipping.textContent = formatCurrency(shipping);
        if (cartTax) cartTax.textContent = formatCurrency(tax);
        if (cartTotal) cartTotal.textContent = formatCurrency(total);

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
                        <p class="cart-item-price">${formatCurrency(item.price)} each</p>
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

    function addItemToCart(name, price, image, quantity = 1) {
        const quantityToAdd = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += quantityToAdd;
        } else {
            cart.push({ name, price, image, quantity: quantityToAdd });
        }
        renderCart();
    }

    function setProductDetailOpen(isOpen) {
        if (!productDetailBackdrop || !productDetailDialog) return;
        productDetailBackdrop.hidden = !isOpen;
        productDetailDialog.setAttribute("aria-hidden", String(!isOpen));
        document.body.classList.toggle("product-detail-open", isOpen);

        if (isOpen) {
            productDetailCloseButton?.focus();
        } else {
            activeProductTrigger?.setAttribute("aria-expanded", "false");
            activeProductTrigger?.focus();
            activeProductTrigger = null;
            activeProduct = null;
        }
    }

    function openProductDetails(trigger) {
        if (!productDetailBackdrop || !productDetailDialog ||
            !productDetailImage || !productDetailTitle || !productDetailPrice ||
            !productDetailDescription || !productDetailQuantity) {
            return;
        }

        const name = trigger.dataset.name;
        const price = Number(trigger.dataset.price);
        if (!name || !Number.isFinite(price) || price < 0) {
            console.error("Product detail button requires a name and non-negative price.");
            return;
        }

        const category = trigger.dataset.category || "Fragrance";
        const image = trigger.dataset.image || "";
        activeProduct = {
            name,
            price,
            image,
            quantity: 1
        };
        activeProductTrigger = trigger;
        trigger.setAttribute("aria-expanded", "true");

        productDetailImage.src = image;
        productDetailImage.alt = `${name} perfume`;
        if (productDetailCategory) {
            productDetailCategory.textContent = `${category} collection`;
        }
        productDetailTitle.textContent = name;
        productDetailPrice.textContent = formatCurrency(price);
        productDetailDescription.textContent = trigger.dataset.description ||
            `A fragrance from CLC's ${category} collection.`;
        productDetailQuantity.textContent = "1";
        setProductDetailOpen(true);
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

        const detailTrigger = event.target.closest(".product-detail-trigger");
        if (detailTrigger) {
            openProductDetails(detailTrigger);
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

    productDetailCloseButton?.addEventListener("click", () => setProductDetailOpen(false));
    productDetailBackdrop?.addEventListener("click", event => {
        if (event.target === productDetailBackdrop) {
            setProductDetailOpen(false);
        }
    });

    productDetailDecreaseButton?.addEventListener("click", () => {
        if (!activeProduct || !productDetailQuantity) return;
        activeProduct.quantity = Math.max(1, activeProduct.quantity - 1);
        productDetailQuantity.textContent = String(activeProduct.quantity);
    });

    productDetailIncreaseButton?.addEventListener("click", () => {
        if (!activeProduct || !productDetailQuantity) return;
        activeProduct.quantity += 1;
        productDetailQuantity.textContent = String(activeProduct.quantity);
    });

    productDetailAddButton?.addEventListener("click", () => {
        if (!activeProduct) return;
        addItemToCart(activeProduct.name, activeProduct.price, activeProduct.image, activeProduct.quantity);
        setProductDetailOpen(false);
    });

    productDetailBuyButton?.addEventListener("click", () => {
        if (!activeProduct) return;
        addItemToCart(activeProduct.name, activeProduct.price, activeProduct.image, activeProduct.quantity);
        window.location.href = "checkout.html";
    });

    const cartCheckoutButton = document.getElementById("cart-checkout-btn");
    if (cartCheckoutButton) {
        cartCheckoutButton.addEventListener("click", () => {
            if (cart.length === 0) return;
            window.location.href = "checkout.html";
        });
    }

    document.addEventListener("click", event => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const logoutControl = target.closest('[data-action="logout"]');
        if (!logoutControl) return;

        event.preventDefault();
        try {
            localStorage.removeItem("clc_remembered_email");
        } catch (error) {
            console.error("Could not clear the remembered email during logout.", error);
        } finally {
            window.location.href = "Login.html";
        }
    });

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

            if (menuItem.dataset.action === "logout") return;

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
        if (productDetailBackdrop && !productDetailBackdrop.hidden) {
            if (event.key === "Escape") {
                setProductDetailOpen(false);
                return;
            }

            if (event.key === "Tab" && productDetailDialog) {
                const focusableElements = [...productDetailDialog.querySelectorAll(
                    'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )];
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (!firstElement || !lastElement) {
                    event.preventDefault();
                    productDetailDialog.focus();
                } else if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
                return;
            }
        }

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
