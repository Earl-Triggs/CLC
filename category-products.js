const categoryCatalogs = {
    Men: [
        { name: "Nocturne", price: 19.90, category: "Men", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
        { name: "Aqualis", price: 19.25, category: "Men", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
        { name: "Talon", price: 17.50, category: "Men", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" },
        { name: "Ember", price: 21.00, category: "Men", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80" },
        { name: "Amber Oud", price: 21.00, category: "Men", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
        { name: "One Man's Chance", price: 18.00, category: "Men", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" },
        { name: "Cedar Trail", price: 22.50, category: "Men", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
        { name: "Midnight Coast", price: 24.00, category: "Men", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80" },
        { name: "Urban Woods", price: 20.25, category: "Men", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
        { name: "Blue Current", price: 18.75, category: "Men", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" },
        { name: "Dark Cedar", price: 23.50, category: "Men", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
        { name: "Silver Coast", price: 20.00, category: "Men", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80" }
    ],
    Women: [
        { name: "Solitaire", price: 17.46, category: "Women", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" },
        { name: "Jasmine Noir", price: 13.25, category: "Women", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80" },
        { name: "Lumière", price: 16.00, category: "Women", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
        { name: "Éclat", price: 20.99, category: "Women", image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=500&q=80" },
        { name: "Valora", price: 25.00, category: "Women", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" },
        { name: "Solara", price: 20.99, category: "Women", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80" },
        { name: "Rose Petal", price: 18.50, category: "Women", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=80" },
        { name: "Velvet Bloom", price: 22.00, category: "Women", image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=500&q=80" },
        { name: "Golden Hour", price: 21.25, category: "Women", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
        { name: "Petal Muse", price: 19.75, category: "Women", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=80" },
        { name: "Blush Aura", price: 23.00, category: "Women", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" },
        { name: "Flora Dream", price: 18.95, category: "Women", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80" }
    ],
    Unisex: [
        { name: "Memories", price: 30.00, category: "Unisex", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80" },
        { name: "Verité", price: 18.50, category: "Unisex", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
        { name: "Enmer", price: 21.00, category: "Unisex", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" },
        { name: "Open Sky", price: 22.50, category: "Unisex", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80" },
        { name: "Soft Horizon", price: 20.00, category: "Unisex", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=80" },
        { name: "Amber Mist", price: 24.25, category: "Unisex", image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=500&q=80" },
        { name: "Quiet Hours", price: 19.50, category: "Unisex", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80" },
        { name: "Sandalwood Air", price: 25.00, category: "Unisex", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
        { name: "Sunday Kind", price: 17.95, category: "Unisex", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" },
        { name: "Cloud No. 8", price: 21.75, category: "Unisex", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80" },
        { name: "Wild Fig", price: 23.50, category: "Unisex", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=80" },
        { name: "Daybreak", price: 20.50, category: "Unisex", image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=500&q=80" }
    ]
};

const category = document.body.dataset.category;
const catalog = categoryCatalogs[category];

if (!catalog) {
    throw new Error(`Unknown perfume category: ${category}`);
}

window.CLC_PRODUCTS = catalog;
window.CLC_PRODUCT_SECTIONS = [
    { targetId: "category-featured-products", products: catalog.slice(0, 8) },
    { targetId: "product-grid", products: catalog.slice(8) }
];
