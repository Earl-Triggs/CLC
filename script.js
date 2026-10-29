
(() => {
const defaultProducts = [
    { name: "Hollister SoCal", price: 15.50, category: "Kids", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
    { name: "Solitaire", price: 17.46, category: "Women", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" },
    { name: "Jasmine Noir", price: 13.25, category: "Women", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80" },
    { name: "Nocturne", price: 19.90, category: "Men", image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=500&q=80" },
    { name: "MissMo?", price: 60.55, category: "Women", image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=500&q=80" },
    { name: "One Man's Chance", price: 18.00, category: "Men", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" },
    { name: "Memories", price: 30.00, category: "Unisex", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80" },
    { name: "Lumière", price: 16.00, category: "Women", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80" },
    { name: "Solara", price: 20.99, category: "Women", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" },
    { name: "Aqualis", price: 19.25, category: "Men", image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=500&q=80" },
    { name: "Verité", price: 18.50, category: "Unisex", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
    { name: "Éclat", price: 20.99, category: "Women", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80" },
    { name: "Valora", price: 25.00, category: "Women", image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=500&q=80" },
    { name: "Talon", price: 17.50, category: "Men", image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=500&q=80" },
    { name: "Enmer", price: 21.00, category: "Unisex", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" },
    { name: "Ember", price: 21.00, category: "Men", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80" },
    { name: "Valora", price: 25.00, category: "Women", image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=500&q=80" },
    { name: "Talon", price: 17.50, category: "Men", image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=500&q=80" },
    { name: "Ember", price: 21.00, category: "Unisex", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" },
    { name: "Amber Oud", price: 21.00, category: "Men", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" }
];

const products = window.CLC_PRODUCTS || defaultProducts;
const productSections = window.CLC_PRODUCT_SECTIONS || [
    { targetId: "product-grid", products }
];
const categoryButtons = [...document.querySelectorAll(".category-btn[data-category]")];
const cartCount = document.getElementById("cart-count");
const noResults = document.getElementById("no-results");
const cartDrawer = document.getElementById("cart-drawer");
const cartBackdrop = document.getElementById("cart-backdrop");
const cartItems = document.getElementById("cart-items");
const cartItemCount = document.getElementById("cart-item-count");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartButton = document.getElementById("cart-btn");
const cartCloseButton = document.getElementById("cart-close");
const cartStorageKey = "clc-cart-v1";
const productDetailBackdrop = document.getElementById("product-detail-backdrop");
const productDetailDialog = document.getElementById("product-detail-dialog");
const productDetailCloseButton = document.getElementById("product-detail-close");
const productDetailImage = document.getElementById("product-detail-image");
const productDetailTitle = document.getElementById("product-detail-title");
const productDetailCategory = document.getElementById("product-detail-category");
const productDetailPrice = document.getElementById("product-detail-price");
const productDetailDescription = document.getElementById("product-detail-description");
const productQuantity = document.getElementById("product-quantity");
const productDetailAddButton = document.getElementById("product-detail-add");
const productDetailBuyButton = document.getElementById("product-detail-buy");
let activeProductTrigger = null;
let selectedProduct = null;

function loadCart() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");

        if (!Array.isArray(savedCart)) {
            throw new TypeError("Saved cart data must be an array.");
        }

        return savedCart.filter(item =>
            item &&
            typeof item.name === "string" &&
            Number.isFinite(item.price) &&
            item.price >= 0
        );
    } catch (error) {
        console.error("Could not load the saved cart.", error);
        return [];
    }
}

let cart = loadCart();
const requestedCategory = new URLSearchParams(window.location.search).get("category");
let selectedCategory = ["Kids", "Men", "Women", "Unisex"].includes(requestedCategory)
    ? requestedCategory
    : null;

function escapeHtml(value) {
    const element = document.createElement("span");
    element.textContent = value;
    return element.innerHTML;
}

function renderProducts() {
    productSections.forEach(section => {
        const grid = document.getElementById(section.targetId);
        if (!grid) return;

        grid.innerHTML = section.products.map(product => {
            const imageAlt = product.imageAlt || `${product.name} perfume`;
            const description = product.description ||
                `${product.name} is a ${String(product.category).toLowerCase()} fragrance with a balanced blend of fresh, inviting notes. Its smooth, long-lasting scent is made for everyday wear and special moments.`;
            const productInfo = `
                <h3>${escapeHtml(product.name)}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="stars" aria-label="5 out of 5 stars">★★★★★</p>
            `;
            const productContent = productDetailDialog
                ? `<button type="button" class="product-detail-trigger" data-name="${escapeHtml(product.name)}"
                    data-category="${escapeHtml(product.category)}" data-price="${product.price}"
                    data-image="${escapeHtml(product.image)}" data-image-alt="${escapeHtml(imageAlt)}"
                    data-description="${escapeHtml(description)}" aria-label="View details for ${escapeHtml(product.name)}">
                    <img src="${escapeHtml(product.image)}" alt="${escapeHtml(imageAlt)}" loading="lazy">
                    <span class="product-info">${productInfo}</span>
                </button>
                <button class="add-to-cart" data-name="${escapeHtml(product.name)}" data-price="${product.price}">🛒 ADD TO CART</button>`
                : `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(imageAlt)}" loading="lazy">
                <div class="product-info">${productInfo}
                    <button class="add-to-cart" data-name="${escapeHtml(product.name)}" data-price="${product.price}">🛒 ADD TO CART</button>
                </div>`;

            return `<article class="product-card" data-category="${escapeHtml(product.category)}">${productContent}</article>`;
        }).join("");
    });
}

renderProducts();

function renderCart() {
    if (cartCount) cartCount.textContent = cart.length;
    if (cartItemCount) cartItemCount.textContent = `(${cart.length})`;

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (cartSubtotal) cartSubtotal.textContent = `$${total.toFixed(2)}`;

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
            <div>
                <p class="cart-item-name">${escapeHtml(item.name)}</p>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <button type="button" class="cart-item-remove" data-cart-index="${index}"
                aria-label="Remove ${escapeHtml(item.name)} from cart">Remove</button>
        </article>
    `).join("");
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

renderCart();

function setProductDetailOpen(isOpen, restoreFocus = true) {
    if (!productDetailBackdrop || !productDetailDialog) return;

    productDetailBackdrop.hidden = !isOpen;
    document.body.classList.toggle("product-detail-open", isOpen);

    if (isOpen) {
        productDetailCloseButton?.focus();
    } else if (restoreFocus) {
        activeProductTrigger?.focus();
    }
}

function openProductDetails(trigger) {
    if (!productDetailDialog || !productDetailBackdrop) return;

    const product = {
        name: trigger.dataset.name,
        category: trigger.dataset.category,
        price: Number(trigger.dataset.price),
        image: trigger.dataset.image,
        imageAlt: trigger.dataset.imageAlt,
        description: trigger.dataset.description
    };

    if (!product.name || !Number.isFinite(product.price) || product.price < 0) {
        console.error("Product details require a name and non-negative price.");
        return;
    }

    activeProductTrigger = trigger;
    selectedProduct = product;
    productDetailTitle.textContent = product.name;
    productDetailCategory.textContent = product.category;
    productDetailPrice.textContent = `$${product.price.toFixed(2)}`;
    productDetailDescription.textContent = product.description;
    productDetailImage.src = product.image;
    productDetailImage.alt = product.imageAlt;
    productQuantity.value = "1";
    productQuantity.textContent = "1";
    setProductDetailOpen(true);
}

document.addEventListener("click", event => {
    const trigger = event.target.closest(".product-detail-trigger");
    if (trigger) openProductDetails(trigger);
});

productDetailCloseButton?.addEventListener("click", () => setProductDetailOpen(false));
productDetailBackdrop?.addEventListener("click", event => {
    if (event.target === productDetailBackdrop) setProductDetailOpen(false);
});

document.getElementById("product-quantity-decrease")?.addEventListener("click", () => {
    const quantity = Number(productQuantity.value) || 1;
    productQuantity.value = String(Math.max(1, quantity - 1));
    productQuantity.textContent = productQuantity.value;
});

document.getElementById("product-quantity-increase")?.addEventListener("click", () => {
    const quantity = Number(productQuantity.value) || 1;
    productQuantity.value = String(quantity + 1);
    productQuantity.textContent = productQuantity.value;
});

// FILTER PRODUCTS BY CATEGORY
categoryButtons.forEach(button => {
    button.classList.toggle("selected", button.dataset.category === selectedCategory);

    button.addEventListener("click", () => {
        const category = button.dataset.category;

        selectedCategory =
            selectedCategory === category ? null : category;

        categoryButtons.forEach(btn => {
            btn.classList.toggle(
                "selected",
                btn.dataset.category === selectedCategory
            );
        });

        filterProducts();
        document.getElementById("best-sellers")
            ?.scrollIntoView({ behavior: "smooth" });
    });
});

if (selectedCategory) filterProducts();

// FILTER PRODUCTS BY CATEGORY AND SEARCH
function filterProducts() {
    const searchInput = document.getElementById("search-input");
    const searchTerm = searchInput?.value.trim().toLowerCase() || "";

    let visibleCount = 0;

    document.querySelectorAll(".product-card").forEach(card => {
        const name = (
            card.querySelector("h3")?.textContent ||
            card.dataset.name ||
            ""
        ).toLowerCase();

        const category = card.dataset.category;

        const matchesCategory =
            !selectedCategory || category === selectedCategory;

        const matchesSearch = name.includes(searchTerm);

        const visible = matchesCategory && matchesSearch;

        card.hidden = !visible;

        if (visible) visibleCount++;
    });

    if (noResults) noResults.hidden = visibleCount !== 0;
}

// ADD PRODUCTS TO CART
document.addEventListener("click", event => {
    const button = event.target.closest(".add-to-cart");
    if (!button) return;

    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const quantity = Number(button.dataset.quantity) || 1;

    if (!name || !Number.isFinite(price) || price < 0 || !Number.isInteger(quantity) || quantity < 1) {
        console.error("Add-to-cart button requires a product name, non-negative price, and positive whole-number quantity.");
        return;
    }

    for (let count = 0; count < quantity; count++) {
        cart.push({ name, price });
    }
    renderCart();

    const originalText = button.textContent;
    button.textContent = "✓ ADDED";

    setTimeout(() => {
        button.textContent = originalText;
    }, 1000);
});

productDetailAddButton?.addEventListener("click", () => {
    if (!selectedProduct) return;

    const quantity = Number(productQuantity.value);
    if (!Number.isInteger(quantity) || quantity < 1) {
        console.error("Product quantity must be a positive whole number.");
        return;
    }

    for (let count = 0; count < quantity; count++) {
        cart.push({ name: selectedProduct.name, price: selectedProduct.price });
    }
    renderCart();
    productDetailAddButton.textContent = "✓ Added to cart";
    window.setTimeout(() => {
        productDetailAddButton.textContent = "🛒 Add to cart";
    }, 1000);
});

productDetailBuyButton?.addEventListener("click", () => {
    if (!selectedProduct) return;

    const quantity = Number(productQuantity.value);
    if (!Number.isInteger(quantity) || quantity < 1) {
        console.error("Product quantity must be a positive whole number.");
        return;
    }

    for (let count = 0; count < quantity; count++) {
        cart.push({ name: selectedProduct.name, price: selectedProduct.price });
    }
    renderCart();
    setProductDetailOpen(false, false);
    setCartOpen(true);
});

// SEARCH
const searchBox = document.querySelector(".search-box");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");

if (searchButton && searchBox && searchInput) {
    searchButton.addEventListener("click", () => {
        if (!searchBox.classList.contains("is-open")) {
            searchBox.classList.add("is-open");
            searchButton.setAttribute("aria-expanded", "true");
            searchButton.setAttribute("aria-label", "Search");
            searchInput.focus();
            return;
        }

        filterProducts();
    });
}

// SEARCH WHILE TYPING
searchInput?.addEventListener("input", filterProducts);

// PRESS ENTER TO SEARCH
searchInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        filterProducts();
    } else if (event.key === "Escape" && searchBox && searchButton) {
        searchBox.classList.remove("is-open");
        searchButton.setAttribute("aria-expanded", "false");
        searchButton.setAttribute("aria-label", "Open search");
        searchButton.focus();
    }
});

// CART DRAWER
cartButton?.addEventListener("click", () => setCartOpen(true));
cartCloseButton?.addEventListener("click", () => setCartOpen(false));
cartBackdrop?.addEventListener("click", () => setCartOpen(false));

cartItems?.addEventListener("click", event => {
    const removeButton = event.target.closest("[data-cart-index]");
    if (!removeButton) return;

    cart.splice(Number(removeButton.dataset.cartIndex), 1);
    renderCart();
});

document.addEventListener("keydown", event => {
    if (productDetailBackdrop && !productDetailBackdrop.hidden) {
        if (event.key === "Escape") {
            setProductDetailOpen(false);
        } else if (event.key === "Tab") {
            const focusableElements = [...productDetailDialog.querySelectorAll("button:not(:disabled)")];
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
        return;
    }

    if (!cartDrawer || cartDrawer.hidden) return;

    if (event.key === "Escape") {
        setCartOpen(false);
    } else if (event.key === "Tab") {
        const focusableElements = [...cartDrawer.querySelectorAll("button:not(:disabled)")];
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }
});

// ACCOUNT MENU
const accountButton = document.getElementById("account-btn");
const accountMenu = document.getElementById("account-menu");

function setAccountMenuOpen(isOpen) {
    if (!accountMenu || !accountButton) return;

    accountMenu.hidden = !isOpen;
    accountButton.setAttribute("aria-expanded", String(isOpen));
}

if (accountButton && accountMenu) {
    accountButton.addEventListener("click", () => {
        const isOpening = accountMenu.hidden;
        setAccountMenuOpen(isOpening);

        if (isOpening) {
            accountMenu.querySelector('[role="menuitem"]')?.focus();
        }
    });
}

accountMenu?.addEventListener("click", event => {
    if (event.target.closest('[role="menuitem"]')) {
        setAccountMenuOpen(false);
        accountButton?.focus();
    }
});

accountMenu?.addEventListener("keydown", event => {
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
    }

    if (nextIndex !== undefined) {
        event.preventDefault();
        items[nextIndex].focus();
    }
});

document.addEventListener("click", event => {
    if (accountMenu && !event.target.closest(".account-menu-wrapper")) {
        setAccountMenuOpen(false);
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && accountMenu && !accountMenu.hidden && !accountMenu.contains(event.target)) {
        setAccountMenuOpen(false);
        accountButton?.focus();
    }
});

window.addEventListener("storage", event => {
    if (event.key !== cartStorageKey) return;
    cart = loadCart();
    renderCart();
});
})();
