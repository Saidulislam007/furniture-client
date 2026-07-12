// src/services/furniture.ts

export const sendFurnitureToBackend = async (payload: any): Promise<boolean> => {
  try {
    // 🔒 ব্রাউজারের localStorage থেকে ম্যানেজারের অ্যাক্সেস টোকেন তুলে নেওয়া হচ্ছে
    const token = localStorage.getItem('token'); 

    const response = await fetch('http://localhost:5000/api/v1/furniture/submit', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // 🚀 হেডার্সে টোকেন পাঠানো হচ্ছে যাতে ব্যাকএন্ড আসল ম্যানেজার ট্র্যাক করতে পারে
        'Authorization': token ? `Bearer ${token}` : '' 
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // ⚡ এখানে এলার্ট রিমুভ করা হয়েছে, কিন্তু ডাটা সাকসেস স্টেট প্রপারলি রিটার্ন করা হচ্ছে
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