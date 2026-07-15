// src/services/api/getFurniture.ts

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ; 
export const getAllFurniture = async (): Promise<any[] | null> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/furniture`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("❌ [Network failure]: Failed to fetch inventory metrics", error);
    return null;
  }
};