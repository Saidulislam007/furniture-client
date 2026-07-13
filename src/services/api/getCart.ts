// src/services/api/getCart.ts
export const getCartFromBackend = async (userId: string): Promise<any[] | null> => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/cart/${userId}`, {
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