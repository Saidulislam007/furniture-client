import type { Product } from "@/types/product";

const getBackendBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000";
  }

  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:5000"
  );
};

export const getCategoryProducts = async (
  category: string,
): Promise<Product[]> => {
  if (!category) return [];

  const BACKEND_BASE_URL = getBackendBaseUrl();
  const url = `${BACKEND_BASE_URL}/api/v1/categories/${encodeURIComponent(category)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Category API failed [${category}]: ${response.status} ${response.statusText} -> ${url}`,
      );
      return [];
    }

    const result = await response.json();
    return result.success && Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error(`Failed to fetch category products [${category}] -> ${url}:`, error);
    return [];
  }
};
