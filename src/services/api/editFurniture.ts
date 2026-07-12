// src/services/api/editFurniture.ts
export const updateFurnitureInBackend = async (id: string, payload: any): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/furniture/${id}`, {
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