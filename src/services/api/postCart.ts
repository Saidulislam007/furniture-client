// src/services/api/postCart.ts
const BACKEND_BASE_URL = process.env.BASE_URL ; 
export const sendToCartBackend = async (payload: any): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ Failed to commit product node to cart matrix:", error);
    return false;
  }
};