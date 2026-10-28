(() => {
    const storageKey = window.CLC_ADMIN_PRODUCT_STORAGE_KEY;
    const starterProducts = window.CLC_ADMIN_STARTER_PRODUCTS;
    const validCategories = new Set(["Kids", "Men", "Women", "Unisex"]);
    const grid = document.getElementById("admin-product-grid");
    const searchInput = document.getElementById("product-search");
    const categoryFilter = document.getElementById("category-filter");
    const stockSort = document.getElementById("stock-sort");
    const priceSort = document.getElementById("price-sort");
    const noResults = document.getElementById("admin-no-results");
    const dialog = document.getElementById("product-editor");
    const form = document.getElementById("product-form");
    const errorMessage = document.getElementById("editor-error");
    const editorTitle = document.getElementById("product-editor-title");
    let activeProductId = null;
    let products = loadProducts();

    function isProduct(value) {
        return value &&
            typeof value.id === "string" &&
            typeof value.name === "string" &&
            Number.isFinite(value.price) && value.price >= 0 &&
            validCategories.has(value.category) &&
            Number.isInteger(value.stock) && value.stock >= 0 &&
            typeof value.image === "string";
    }

    function loadProducts() {
        try {
            const savedProducts = localStorage.getItem(storageKey);
            if (savedProducts === null) return starterProducts.map(product => ({ ...product }));
            const parsedProducts = JSON.parse(savedProducts);
            if (!Array.isArray(parsedProducts) || !parsedProducts.every(isProduct)) {
                throw new TypeError("Saved product data is invalid.");
            }
            return parsedProducts;
        } catch (error) {
            console.error("Could not load admin products.", error);
            return starterProducts.map(product => ({ ...product }));
        }
    }

    function saveProducts() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(products));
            return true;
        } catch (error) {
            console.error("Could not save admin products.", error);
            showError("Changes could not be saved in this browser.");
            return false;
        }
    }

    function createProductCard(product) {
        const article = document.createElement("article");
        article.className = "admin-product-card";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = `${product.name} perfume`;
        image.loading = "lazy";
        image.addEventListener("error", () => {
            image.alt = `${product.name} image unavailable`;
            image.classList.add("image-unavailable");
        }, { once: true });

        const info = document.createElement("div");
        info.className = "admin-product-info";

        const name = document.createElement("h2");
        name.textContent = product.name;
        const price = document.createElement("p");
        price.className = "admin-product-price";
        price.textContent = `$${(product.retailPrice ?? product.price).toFixed(2)}`;
        const rating = document.createElement("p");
        rating.className = "admin-product-rating";
        rating.setAttribute("aria-label", "4 out of 5 stars");
        rating.textContent = "★★★★";
        const stock = document.createElement("p");
        stock.className = "admin-product-stock";
        stock.textContent = `Stock: ${product.stock >= 1000 ? `${Math.floor(product.stock / 1000)}k` : product.stock}`;

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-product-button";
        editButton.setAttribute("aria-label", `Edit ${product.name}`);
        editButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16.5-.8 4.3 4.3-.8L20 7.5 16.5 4 4 16.5Z"></path><path d="m14.8 5.7 3.5 3.5"></path></svg>';
        editButton.addEventListener("click", () => openEditor(product));

        info.append(name, price, rating, stock, editButton);
        article.append(image, info);
        article.dataset.category = product.category;
        return article;
    }

    function renderProducts() {
        const query = searchInput.value.trim().toLocaleLowerCase();
        const selectedCategory = categoryFilter.value;
        const stockDirection = stockSort.value === "desc" ? -1 : 1;
        const priceDirection = priceSort.value === "desc" ? -1 : 1;

        const visibleProducts = products
            .filter(product =>
                (selectedCategory === "all" || product.category === selectedCategory) &&
                product.name.toLocaleLowerCase().includes(query)
            )
            .sort((first, second) => {
                const firstPrice = first.retailPrice ?? first.price;
                const secondPrice = second.retailPrice ?? second.price;
                if (priceSort.value !== "none" && firstPrice !== secondPrice) {
                    return (firstPrice - secondPrice) * priceDirection;
                }
                if (first.stock !== second.stock) return (first.stock - second.stock) * stockDirection;
                return products.indexOf(first) - products.indexOf(second);
            });

        grid.replaceChildren(...visibleProducts.map(createProductCard));
        noResults.hidden = visibleProducts.length > 0;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.hidden = false;
    }

    function openEditor(product = null) {
        activeProductId = product?.id || null;
        editorTitle.textContent = product ? "Edit product" : "Add product";
        errorMessage.hidden = true;
        form.elements.name.value = product?.name || "";
        form.elements.price.value = product?.price ?? "";
        form.elements.retailPrice.value = product?.retailPrice ?? product?.price ?? "";
        form.elements.category.value = product?.category || "Women";
        form.elements.stock.value = product?.stock ?? 0;
        form.elements.image.value = product?.image || "";
        dialog.showModal();
        form.elements.name.focus();
    }

    [searchInput, categoryFilter, stockSort, priceSort].forEach(control => {
        control.addEventListener("input", renderProducts);
        control.addEventListener("change", renderProducts);
    });

    document.getElementById("editor-close").addEventListener("click", () => dialog.close());
    document.getElementById("editor-cancel").addEventListener("click", () => dialog.close());

    form.addEventListener("submit", event => {
        event.preventDefault();
        const data = new FormData(form);
        const product = {
            id: activeProductId || `product-${Date.now()}`,
            name: String(data.get("name")).trim(),
            price: Number(data.get("price")),
            retailPrice: Number(data.get("retailPrice")),
            category: String(data.get("category")),
            stock: Number(data.get("stock")),
            image: String(data.get("image")).trim()
        };

        if (!product.name || !Number.isFinite(product.price) || product.price < 0 ||
            !Number.isFinite(product.retailPrice) || product.retailPrice < 0 ||
            !validCategories.has(product.category) || !Number.isInteger(product.stock) || product.stock < 0) {
            showError("Enter a product name, valid price, category, and whole-number stock.");
            return;
        }

        const previousProducts = products;
        products = activeProductId
            ? products.map(item => item.id === activeProductId ? product : item)
            : [...products, product];
        if (!saveProducts()) {
            products = previousProducts;
            return;
        }

        dialog.close();
        renderProducts();
    });

    renderProducts();
})();
