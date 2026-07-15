// কন্টাক্ট পেলোড টাইপ ডেফিনিশন ভাই 
interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// 🎯 🚀 আপনার এক্সপ্রেস ব্যাকএন্ডের বেস ইউআরএল পোর্ট লক করুন এখানে ভাই
// (যদি পোর্ট ৫০0০ না হয়ে অন্য কিছু হয়, তবে শুধু সংখ্যাটা চেঞ্জ করে দিন)
const BACKEND_BASE_URL = process.env.BASE_URL ; 



export const sendContactMessageToBackend = async (payload: ContactPayload): Promise<boolean> => {
  try {
    // 🔗 এখানে ফুল পাথ সেট করে দেওয়া হলো যাতে Next.js নিজের ভেতর না খুঁজে সরাসরি এক্সপ্রেসে হিট করে
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // 🔍 সেফগার্ড: যদি ব্যাকএন্ড থেকে কোনো এরর এইচটিএমএল আসে, তবে ক্র্যাশ না করে টেক্সট প্রিন্ট করবে
    if (!response.ok) {
      const errorText = await response.text();
      console.error("🔴 ব্যাকএন্ড রেসপন্স এরর লগ ভাই:", errorText);
      return false;
    }

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("❌ Network anomalies in message dispatch pipeline:", error);
    return false;
  }
};

/**
 * 📡 🚀 🟢 এক্সপ্রেস ব্যাকএন্ড থেকে সব কন্টাক্ট মেসেজ তুলে আনার গেট এপিআই ফাংশন
 */
export const getAllContactMessages = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/contact`, { 
      method: 'GET', 
      cache: 'no-store' 
    });
    
    if (!response.ok) return [];

    const data = await response.json();
    if (data.success) return data.data;
    return [];
  } catch (error) {
    console.error("❌ Failed to resolve universal contact ledger logs:", error);
    return [];
  }
};