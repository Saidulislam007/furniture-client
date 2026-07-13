// src/services/api/postCart.ts
export const sendToCartBackend = async (payload: any): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/cart', {
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