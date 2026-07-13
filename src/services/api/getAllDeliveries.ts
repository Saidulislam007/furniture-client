/**
 * 🚀 ম্যানেজার/অ্যাডমিন প্যানেলের জন্য ডাটাবেজ থেকে সমস্ত ইউজারের ডেলিভারি ডাটা কুয়েরি করার গ্লোবাল ফাংশন
 * @returns {Promise<any[] | null>} ডাটাবেজের সব ডেলিভারি অবজেক্টের অ্যারে অথবা ফেইলুর নোটিফিকেশন
 */
export const getAllDeliveriesFromBackend = async (): Promise<any[] | null> => {
  try {
    // ব্যাকএন্ডের গ্লোবাল GET এন্ডপয়েন্টে হিট করা হচ্ছে
    const response = await fetch('http://localhost:5000/api/v1/deliveries', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // প্রপার ক্যাশিং পলিসি মেইনটেইন করার জন্য (অপশনাল)
      cache: 'no-store' 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // ব্যাকএন্ড যদি success: true পাঠায়, তবে ডাটা রিটার্ন করবে
    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error("❌ Critical failure while fetching universal logistics registry from backend:", error);
    return null;
  }
};