(() => {
    const storageKey = window.CLC_ADMIN_PRODUCT_STORAGE_KEY;
    const starterProducts = window.CLC_ADMIN_STARTER_PRODUCTS;
    const validCategories = new Set(["Kids", "Men", "Women", "Unisex"]);
    const form = document.getElementById("add-product-form");
    const imageInput = document.getElementById("product-image");
    const imagePreview = document.getElementById("image-preview");
    const errorMessage = document.getElementById("add-product-error");
    let selectedImage = "";
    let imageLoading = false;
    let imageLoadGeneration = 0;

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.hidden = false;
    }

    function isProduct(value) {
        return value &&
            typeof value.id === "string" &&
            typeof value.name === "string" &&
            Number.isFinite(value.price) && value.price >= 0 &&
            validCategories.has(value.category) &&
            Number.isInteger(value.stock) && value.stock >= 0 &&
            typeof value.image === "string";
    }

    function readProducts() {
        const savedProducts = localStorage.getItem(storageKey);
        if (savedProducts === null) return starterProducts.map(product => ({ ...product }));
        const parsedProducts = JSON.parse(savedProducts);
        if (!Array.isArray(parsedProducts) || !parsedProducts.every(isProduct)) {
            throw new TypeError("Saved admin product data is invalid.");
        }
        return parsedProducts;
    }

    imageInput.addEventListener("change", () => {
        imageLoadGeneration++;
        const loadGeneration = imageLoadGeneration;
        errorMessage.hidden = true;
        const file = imageInput.files[0];
        selectedImage = "";
        imageLoading = false;
        imagePreview.hidden = true;

        if (!file) return;
        if (!file.type.startsWith("image/")) {
            showError("Choose a valid image file.");
            imageInput.value = "";
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            showError("Choose an image smaller than 2 MB.");
            imageInput.value = "";
            return;
        }

        const reader = new FileReader();
        imageLoading = true;
        reader.addEventListener("load", () => {
            if (loadGeneration !== imageLoadGeneration) return;
            imageLoading = false;
            if (typeof reader.result !== "string") {
                showError("The selected image could not be read.");
                return;
            }
            selectedImage = reader.result;
            imagePreview.src = selectedImage;
            imagePreview.hidden = false;
        });
        reader.addEventListener("error", () => {
            if (loadGeneration !== imageLoadGeneration) return;
            imageLoading = false;
            showError("The selected image could not be read.");
        });
        reader.readAsDataURL(file);
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        errorMessage.hidden = true;

        if (!form.reportValidity()) return;
        if (imageLoading) {
            showError("Wait for the selected image to finish loading.");
            return;
        }

        const data = new FormData(form);
        const price = Number(data.get("price"));
        const retailPrice = Number(data.get("retailPrice"));
        const stock = Number(data.get("stock"));
        const reorderLevel = Number(data.get("reorderLevel"));
        const category = String(data.get("category"));

        if (!validCategories.has(category) ||
            !Number.isFinite(price) || price < 0 ||
            !Number.isFinite(retailPrice) || retailPrice < 0 ||
            !Number.isInteger(stock) || stock < 0 ||
            !Number.isInteger(reorderLevel) || reorderLevel < 0) {
            showError("Enter valid prices and whole-number stock values.");
            return;
        }

        const product = {
            id: `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: String(data.get("name")).trim(),
            price,
            retailPrice,
            category,
            stock,
            image: selectedImage || "CLC images/Home and Kids/HP Bottom Image 1.png",
            barcode: String(data.get("barcode")).trim(),
            brand: String(data.get("brand")).trim(),
            sku: String(data.get("sku")).trim(),
            supplier: String(data.get("supplier")).trim(),
            size: String(data.get("size")).trim(),
            fragrance: String(data.get("fragrance")).trim(),
            reorderLevel,
            description: String(data.get("description")).trim()
        };

        if (!product.name) {
            showError("Enter a product name.");
            return;
        }

        let products;
        try {
            products = readProducts();
            products.push(product);
            localStorage.setItem(storageKey, JSON.stringify(products));
        } catch (error) {
            console.error("Could not save the new admin product.", error);
            showError(error instanceof DOMException && error.name === "QuotaExceededError"
                ? "There is not enough browser storage for this product image. Choose a smaller image."
                : "The product could not be saved. Please try again.");
            return;
        }

        try {
            window.CLC_INVENTORY_LOGS.append({
                item: product.name,
                action: "Added",
                quantity: product.stock,
                details: `Product added to inventory${product.sku ? ` (SKU ${product.sku})` : ""}`
            });
        } catch (error) {
            console.error("Product saved, but its inventory log could not be recorded.", error);
            showError("Product saved, but its inventory log could not be recorded. Please check browser storage.");
            return;
        }

        window.location.href = "admin-products.html";
    });
})();
