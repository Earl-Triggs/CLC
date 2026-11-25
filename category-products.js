const categoryCatalogs = {
    Men: [
        { name: "Dahlia Eternelle", price: 1100.84, category: "Men", image: "CLC images/Men/HP Bottom Image 6.png", description: "A refined, modern fragrance with a composed presence for evenings that call for quiet confidence." },
        { name: "Assas Sin", price: 1012.68, category: "Men", image: "CLC images/Men/HP Bottom Image 4.png", description: "A sharp, mysterious mood for those who prefer their style understated yet unforgettable." },
        { name: "Artificial", price: 768.50, category: "Men", image: "CLC images/Men/HP Bottom Image 5.png", description: "A contemporary, unconventional scent for creative minds and a look that resists the expected." },
        { name: "Dorian Black", price: 1043.42, category: "Men", image: "CLC images/Men/HP Bottom Image 11.png", description: "A dark, polished character designed to bring a measured edge to formal looks and late-night plans." },
        { name: "Versace on the Floor", price: 869.42, category: "Men", image: "CLC images/Men/HP Bottom Image 9.png", description: "An expressive evening fragrance with a confident, dressed-up mood for memorable nights." },
        { name: "6PAX", price: 999.34, category: "Men", image: "CLC images/Men/HP Bottom Image 7.png", description: "A bold, energetic fragrance with an easy confidence that moves from daytime plans to a night out." },
        { name: "Always Right", price: 910.60, category: "Men", image: "CLC images/Men/HP Bottom Image 8.png", description: "A crisp, self-assured scent for everyday routines when you want a clean, put-together finish." },
        { name: "Weston", price: 1174.50, category: "Men", image: "CLC images/Men/HP Bottom Image 14.png", description: "A smooth, classic-leaning fragrance with relaxed polish for workdays, dinners, and everything between." },
        { name: "Valen Noir", price: 957.00, category: "Men", image: "CLC images/Men/HP Bottom Image 12.png", description: "A sleek, shadowy mood for cool evenings and sharp, minimal style." },
        { name: "Aureon", price: 1087.50, category: "Men", image: "CLC images/Men/HP Bottom Image 10.png", description: "A bright, elevated fragrance that adds a composed finish to your daily rotation." },
        { name: "Stervan", price: 1029.50, category: "Men", image: "CLC images/Men/HP Bottom Image 18.png", description: "A confident, grounded scent designed for simple routines and quietly distinctive style." },
        { name: "Montaire", price: 1305.00, category: "Men", image: "CLC images/Men/HP Bottom Image 16.png", description: "A sophisticated, tailored fragrance for occasions that call for a little extra presence." },
        { name: "Cavell", price: 869.42, category: "Men", image: "CLC images/Men/HP Bottom Image 19.png", description: "A fresh, understated scent that pairs easily with a laid-back look and a full calendar." },
        { name: "Montrell Vale", price: 1159.42, category: "Men", image: "CLC images/Men/HP Bottom Image 13.png", description: "A smooth, assured fragrance with a refined feel for the moments worth dressing up for." },
        { name: "Ravelle Homme", price: 1537.00, category: "Men", image: "CLC images/Men/HP Bottom Image 19.png", description: "A polished, modern scent with a bold silhouette, made for evenings that start with intention." },
        { name: "Acqua Di Gio", price: 1305.00, category: "Men", image: "CLC images/Men/HP BOTTOM IMAGE 26.png", description: "An aquatic-inspired, refreshing fragrance that brings a relaxed, open-air mood to everyday wear." },
        { name: "Azule", price: 869.42, category: "Men", image: "CLC images/Men/HP BOTTOM IMAGE 26 (1).png", description: "A cool, tranquil fragrance with a clean, contemporary mood for effortless daily wear." },
        { name: "Calvin Klein", price: 1159.42, category: "Men", image: "CLC images/Men/HP BOTTOM IMAGE 27.png", description: "A minimalist, versatile scent with a modern everyday feel, easy to reach for from morning onward." },
        { name: "PS After Shave", price: 1537.00, category: "Men", image: "CLC images/Men/HP BOTTOM IMAGE 29.png", description: "A fresh, barbershop-inspired finish for a well-groomed routine and a composed start to the day." },
        { name: "Sauvage", price: 1305.00, category: "Men", image: "CLC images/Men/HP Bottom Image 13.png", description: "A bold, outdoors-inspired fragrance with a confident edge for evenings and everyday wear." }
    ],
    Women: [
        { name: "Helianthus de Soie", price: 1100.84, category: "Women", image: "CLC images/Home and Kids/HP Bottom Image 1.png", description: "A luminous, elegant fragrance with a soft golden mood for mornings that deserve a little ceremony." },
        { name: "Solaire", price: 1012.68, category: "Women", image: "CLC images/Women/HP Bottom Image 4.png", description: "A radiant, easygoing scent that brings a sunlit lift to weekend plans and everyday moments." },
        { name: "Jasmine Noire", price: 768.50, category: "Women", image: "CLC images/Home and Kids/HP Bottom Image 2.png", description: "A graceful, mysterious fragrance with a poised evening mood and a softly dramatic finish." },
        { name: "Nocturne", price: 922.20, category: "Women", image: "CLC images/Women/HP Bottom Image 11.png", description: "A deep, romantic mood for after-dark plans, with a refined presence that never needs to shout." },
        { name: "Chanel 5", price: 2931.90, category: "Women", image: "CLC images/Women/HP Bottom Image 9.png", description: "A timeless, polished fragrance with an elegant presence for dressing up or elevating an ordinary day." },
        { name: "One More Chance?", price: 0.00, category: "Women", image: "CLC images/Women/HP Bottom Image 7.png", description: "A hopeful, playful scent for fresh starts, spontaneous plans, and giving the day another chance." },
        { name: "Memories", price: 4686.40, category: "Women", image: "CLC images/Women/HP Bottom Image 8.png", description: "A warm, personal fragrance designed to make everyday rituals feel a little more memorable." },
        { name: "Lumière", price: 928.00, category: "Women", image: "CLC images/Women/HP Bottom Image 14.png", description: "A bright, luminous scent with a graceful presence that carries easily from morning to evening." },
        { name: "Solara", price: 1217.42, category: "Women", image: "CLC images/Women/HP Bottom Image 12.png", description: "A sun-warmed, confident fragrance for days when you want your style to feel effortless and alive." },
        { name: "Aquilís", price: 1116.50, category: "Women", image: "CLC images/Women/HP Bottom Image 10.png", description: "A fluid, modern scent with a calm, refined mood for a balanced everyday signature." },
        { name: "Vérité", price: 1073.00, category: "Women", image: "CLC images/Unisex/HP Bottom Image 12.png", description: "A clear, self-assured fragrance with a polished feel for days that call for understated elegance." },
        { name: "Éclat", price: 1217.42, category: "Women", image: "CLC images/Women/HP Bottom Image 17.png", description: "A sparkling, sophisticated mood that brings a little brightness to celebrations and everyday wear." },
        { name: "Velora", price: 1507.42, category: "Women", image: "CLC images/Women/HP Bottom Image 19 (1).png", description: "A soft, elegant fragrance with a smooth, composed character for graceful daily wear." },
        { name: "Talon", price: 1015.00, category: "Women", image: "CLC images/Women/HP Bottom Image 13.png", description: "A confident, contemporary scent with a distinctive edge for statement-making moments." },
        { name: "Ember", price: 1218.00, category: "Women", image: "CLC images/Women/HP Bottom Image 18.png", description: "A warm, intimate fragrance mood for relaxed evenings and meaningful conversations." },
        { name: "Ember", price: 1218.00, category: "Women", image: "CLC images/Women/HP Bottom Image 19.png", description: "A softly glowing, modern scent for cooler nights and cozy, unhurried moments." },
        { name: "Velora", price: 1507.42, category: "Women", image: "CLC images/Women/HP Bottom Image 15.png", description: "A graceful, polished fragrance that adds a refined finish to a favorite everyday look." },
        { name: "Talon", price: 1015.00, category: "Women", image: "CLC images/Women/HP Bottom Image 13 (1).png", description: "A bold, expressive scent for days when you want a more assured, memorable impression." },
        { name: "Ember", price: 1218.00, category: "Women", image: "CLC images/Women/HP Bottom Image 18 (1).png", description: "A comforting evening fragrance with a rich, enveloping mood that stays quietly elegant." },
        { name: "Ember", price: 1218.00, category: "Women", image: "CLC images/Women/HP Bottom Image 19 (1).png", description: "A smooth, radiant scent with a warm character for special occasions and intimate gatherings." }
    ],
    Unisex: [
        { name: "ck she's electric", price: 291.16, category: "Unisex", image: "CLC images/Unisex/image 2.png", description: "A lively, contemporary fragrance with a bright, expressive mood for days that need a little extra energy." },
        { name: "Milly Rock", price: 768.50, category: "Unisex", image: "CLC images/Unisex/image 3.png", description: "A playful, high-spirited scent for making an entrance, moving freely, and keeping your style personal." },
        { name: "David On", price: 926.84, category: "Unisex", image: "CLC images/Unisex/image 4.png", description: "A clean, easygoing fragrance with a versatile character for shared routines and everyday wear." },
        { name: "Velate", price: 1377.50, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 11.png", description: "A smooth, balanced scent with quiet sophistication, designed to suit any mood or moment." },
        { name: "calbin klein 1st born", price: 291.16, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 9.png", description: "A youthful, modern fragrance with a relaxed edge for casual days and spontaneous plans." },
        { name: "Kots", price: 956.42, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 7.png", description: "A distinctive, confident scent that keeps things simple while giving your everyday style a point of view." },
        { name: "Paolo Pasqual", price: 1100.84, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 8.png", description: "A crisp, polished fragrance with a fresh-start feel for work, travel, and evenings out." },
        { name: "Lumora", price: 1507.42, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 18.png", description: "A luminous, contemporary scent with an easy elegance for any wardrobe and any time of day." },
        { name: "Aurion", price: 1217.42, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 12.png", description: "A bright, composed fragrance that brings a confident finish to both laid-back and dressed-up looks." },
        { name: "Oceanus", price: 1275.42, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 10.png", description: "A breezy, open-air scent with a calm, refreshing mood for everyday escapes." },
        { name: "Rosea", price: 1116.50, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 19.png", description: "A soft, expressive fragrance with a gentle warmth that feels equally at home on any style." },
        { name: "Embera", price: 971.50, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 17.png", description: "A warm, inviting scent with a modern, balanced mood for relaxed evenings and close company." },
        { name: "Viren", price: 1043.42, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 24.png", description: "A crisp, versatile fragrance with a clean presence for mornings, meetings, and everything between." },
        { name: "Solstice", price: 1217.42, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 22.png", description: "A vivid, atmospheric fragrance that feels bold and balanced through changing moods and seasons." },
        { name: "Seraph", price: 1058.50, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 23.png", description: "A graceful, airy scent with a calm, luminous character for understated everyday wear." },
        { name: "Pure Bliss", price: 971.50, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 25.png", description: "A gentle, comfort-forward fragrance that creates an easy, peaceful mood whenever you reach for it." },
        { name: "Aqua", price: 1043.42, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 30.png", description: "A fresh, fluid scent with a light, relaxed feel for warm afternoons and everyday routines." },
        { name: "Noir", price: 1058.50, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 28.png", description: "A sleek, moody fragrance with a quietly bold presence for nights out and minimal looks." },
        { name: "Solstice", price: 1058.50, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 29.png", description: "A serene, season-spanning scent with a smooth, adaptable mood for shared daily wear." },
        { name: "Eclipse", price: 971.50, category: "Unisex", image: "CLC images/Unisex/HP Bottom Image 31.png", description: "A striking, modern fragrance with a little mystery, made for people who like subtle statement pieces." }
    ]
};

window.CLC_PRODUCT_CATALOGS = categoryCatalogs;

const category = document.body.dataset.category;
if (category !== undefined) {
    const catalog = categoryCatalogs[category];

    if (!catalog) {
        throw new Error(`Unknown perfume category: ${category}`);
    }

    window.CLC_PRODUCTS = catalog;
    window.CLC_PRODUCT_SECTIONS = [
        { targetId: "category-featured-products", products: catalog.slice(0, 8) },
        { targetId: "product-grid", products: catalog.slice(8) }
    ];
}
