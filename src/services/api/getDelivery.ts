export const getDeliveriesFromBackend = async (userId: string): Promise<any[] | null> => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/deliveries/${userId}`);
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("❌ Failed to fetch user operational delivery matrices:", error);
    return null;
  }
};