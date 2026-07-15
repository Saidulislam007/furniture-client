// src/services/api/editFurniture.ts
const BACKEND_BASE_URL = process.env.BASE_URL ; 
export const updateFurnitureInBackend = async (id: string, payload: any): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/furniture/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ Failed to update asset node blueprint", error);
    return false;
  }
};