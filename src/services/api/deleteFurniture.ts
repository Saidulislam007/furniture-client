// src/services/api/deleteFurniture.ts
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ; 
export const deleteFurnitureFromBackend = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/furniture/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ Failed to delete asset node", error);
    return false;
  }
};