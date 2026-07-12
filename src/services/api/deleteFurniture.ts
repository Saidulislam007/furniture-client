// src/services/api/deleteFurniture.ts
export const deleteFurnitureFromBackend = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/furniture/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ Failed to delete asset node", error);
    return false;
  }
};