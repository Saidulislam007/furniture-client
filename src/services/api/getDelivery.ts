const BACKEND_BASE_URL = process.env.BASE_URL ; 
export const getDeliveriesFromBackend = async (userId: string): Promise<any[] | null> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/deliveries/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("❌ Failed to fetch user operational delivery matrices:", error);
    return null;
  }
  
};