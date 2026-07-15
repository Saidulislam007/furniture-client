// src/services/furniture.ts
const BACKEND_BASE_URL = process.env.BASE_URL ; 
export const sendFurnitureToBackend = async (payload: any): Promise<boolean> => {
  try {
    // 🔒 ব্রাউজারের localStorage থেকে ম্যানেজারের অ্যাক্সেস টোকেন তুলে নেওয়া হচ্ছে
    const token = localStorage.getItem('token'); 

    // 🚀 🟢 ফিক্স: ব্যাকএন্ডের সাথে পাথ পুরোপুরি ম্যাচ করা হলো (অতিরিক্ত /submit রিমুভড)
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/furniture`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // 🚀 হেডার্সে টোকেন পাঠানো হচ্ছে
        'Authorization': token ? `Bearer ${token}` : '' 
      },
      body: JSON.stringify(payload),
    });

    // 🔒 স্ট্রিক্ট সেফগার্ড: রেসপন্স যদি ২০০/২০১ সাকসেস না হয় (যেমন ভুল পাথের জন্য ৪0৪ হলে) তবে আগেই ব্রেক করবে
    if (!response.ok) {
      console.error(`❌ API handshake failed. Server returned status: ${response.status}`);
      return false;
    }

    // রেসপন্স ওকে থাকলেই কেবল JSON পার্স সফলভাবে রান করবে ভাই
    const data = await response.json();

    if (data.success) {
      return true;
    } else {
      console.error(`❌ [Server Error]: ${data.error}`);
      return false;
    }
  } catch (error) {
    console.error("❌ [Network failure]: Pipeline breakdown", error);
    return false;
  }
};