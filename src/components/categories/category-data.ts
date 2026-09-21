export type ShopCategory = {
  name: string;
  slug: string;
  image: string;
  keywords: string[];
};

export const shopCategories: ShopCategory[] = [
  { name: "Sofas", slug: "sofas", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=85", keywords: ["sofa", "couch", "living room"] },
  { name: "Chairs", slug: "chairs", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=85", keywords: ["chair", "seating"] },
  { name: "Tables", slug: "tables", image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=600&q=85", keywords: ["table", "desk"] },
  { name: "Storage", slug: "storage", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=85", keywords: ["storage", "cabinet", "shelf", "wardrobe", "credenza"] },
  { name: "Office", slug: "office", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=85", keywords: ["office", "workspace", "desk"] },
  { name: "Bedroom", slug: "bedroom", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=85", keywords: ["bed", "bedroom", "nightstand"] },
  { name: "Lighting", slug: "lighting", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=85", keywords: ["light", "lamp", "lighting"] },
  { name: "Study", slug: "study", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=600&q=85", keywords: ["study", "desk", "bookcase"] },
  { name: "Textiles", slug: "textiles", image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=600&q=85", keywords: ["textile", "rug", "bedding", "cushion"] },
  { name: "Decor", slug: "decor", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=85", keywords: ["decor", "accessory", "vase", "art"] },
  { name: "Kitchen", slug: "kitchen", image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=600&q=85", keywords: ["kitchen", "dining", "utility"] },
  { name: "Kids", slug: "kids", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=85", keywords: ["kids", "children", "crib"] },
  { name: "Outdoor", slug: "outdoor", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=85", keywords: ["outdoor", "patio", "garden"] },
  { name: "Smart Series", slug: "smart-series", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=85", keywords: ["smart", "series", "modular"] },
  { name: "Artists Club", slug: "artists-club", image: "https://images.unsplash.com/photo-1577083552431-6e5fd01988f7?auto=format&fit=crop&w=600&q=85", keywords: ["artist", "art", "gallery"] },
];

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
