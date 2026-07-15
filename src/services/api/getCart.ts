// src/services/api/getCart.ts
const BACKEND_BASE_URL = process.env.BASE_URL ; 
export const getCartFromBackend = async (userId: string): Promise<any[] | null> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/cart/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("❌ Failed to resolve cart ledger pipeline:", error);
    return null;
  }
};