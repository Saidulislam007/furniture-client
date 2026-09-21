import type { Product } from "@/types/product";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export const getCategoryProductById = async (
  id: string,
): Promise<Product | null> => {
  if (!id) return null;

  try {
    const response = await fetch(
      `${BACKEND_BASE_URL}/api/v1/categories/product/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      },
    );

    if (!response.ok) return null;

    const result = await response.json();
    return result.success && result.data ? result.data : null;
  } catch (error) {
    console.error(`Failed to fetch category product [${id}]:`, error);
    return null;
  }
};
