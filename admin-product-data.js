(() => {
    window.CLC_ADMIN_PRODUCT_STORAGE_KEY = "clc-admin-products-v1";
    const categoryCatalogs = window.CLC_PRODUCT_CATALOGS;
    const kidsProducts = window.CLC_PRODUCTS;
    const catalogCategories = ["Men", "Women", "Unisex"];

    if (!Array.isArray(kidsProducts) || !categoryCatalogs ||
        catalogCategories.some(category => !Array.isArray(categoryCatalogs[category]))) {
        throw new Error("Storefront product catalogs must load before admin product data.");
    }

    function createProductSlug(name) {
        return name.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    const storefrontProducts = [
        ...kidsProducts,
        ...catalogCategories.flatMap(category => categoryCatalogs[category])
    ];
    const productIdCounts = new Map();

    window.CLC_ADMIN_STARTER_PRODUCTS = storefrontProducts.map(product => {
        const categorySlug = product.category.toLowerCase();
        const nameSlug = createProductSlug(product.name);
        const baseId = product.category === "Kids" ? nameSlug : `${categorySlug}-${nameSlug}`;
        const occurrence = (productIdCounts.get(baseId) || 0) + 1;
        productIdCounts.set(baseId, occurrence);

        return {
            id: occurrence === 1 ? baseId : `${baseId}-${occurrence}`,
            name: product.name,
            price: product.price,
            category: product.category,
            stock: 10000,
            image: product.image || ""
        };
    });

    window.CLC_ADMIN_MERGE_STOREFRONT_PRODUCTS = savedProducts => {
        const savedById = new Map(savedProducts.map(product => [product.id, product]));
        const starterIds = new Set(window.CLC_ADMIN_STARTER_PRODUCTS.map(product => product.id));
        const storefrontProductsWithSavedValues = window.CLC_ADMIN_STARTER_PRODUCTS.map(product => {
            const savedProduct = savedById.get(product.id);
            return savedProduct
                ? { ...savedProduct, category: product.category }
                : { ...product };
        });
        const customProducts = savedProducts.filter(product => !starterIds.has(product.id));

        return [...storefrontProductsWithSavedValues, ...customProducts];
    };
})();
