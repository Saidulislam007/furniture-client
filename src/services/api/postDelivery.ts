export const sendToDeliveriesBackend = async (payload: any): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/deliveries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ Failed to deploy asset node to delivery registry:", error);
    return false;
  }
};