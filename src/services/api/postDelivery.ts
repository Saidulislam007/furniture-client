const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ; 

export const sendToDeliveriesBackend = async (payload: any): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/deliveries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // ১. রেসপন্সটি আগে টেক্সট হিসেবে নিন
    const responseText = await response.text();

    console.log("BACKEND_BASE_URL:", BACKEND_BASE_URL);
console.log("Payload:", payload);
    
    // ২. সার্ভার ওকে কি না তা চেক করুন
    if (!response.ok) {
      console.error("❌ Server responded with error:", responseText);
      return false;
    }

    // ৩. এখন নিরাপদে JSON পার্স করুন
    const data = JSON.parse(responseText);
    return data.success === true;

  } catch (error) {
    console.error("❌ Failed to deploy asset node to delivery registry:", error);
    return false;
  }
};


// 🚀 স্ট্যাটাস মডিফাই করে ডাটাবেজে রাইট করার সার্ভিস ফাংশন
export const updateDeliveryStatusInBackend = async (id: string, newStatus: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/deliveries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ Failed to patch logistics status node:", error);
    return false;
  }
};