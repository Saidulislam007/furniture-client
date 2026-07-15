/**
 * 🚀 🟢 নির্দিষ্ট একটি প্রোডাক্টের সমস্ত রিভিউ ব্যাকএন্ড থেকে কুয়েরি করার ফাংশন
 * @param {string} productId - টার্গেট প্রোডাক্ট অবজেক্ট আইডি
 * @returns {Promise<any[] | null>} ডাটাবেজের রিভিউ অবজেক্টের অ্যারে অথবা ফেইলুর নোটিফিকেশন
 */
/**
 * 🚀 🟢 আপডেট করা রিভিউ ফেচ ফাংশন
 */

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ; 
export const getProductReviewsFromBackend = async (productId: string): Promise<any[] | null> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/reviews/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // কনসোলে চেক করে দেখুন ডাটা ঠিকঠাক আছে কি না
    console.log("Backend Raw Response:", result);

    // ফিক্স: যদি result.success ট্রু হয়, তবে সরাসরি result.data রিটার্ন করুন
    if (result && result.success && Array.isArray(result.data)) {
      return result.data;
    } 

    return []; // ডাটা না থাকলে খালি অ্যারে রিটার্ন করুন যাতে পেজ ক্র্যাশ না করে
  } catch (error) {
    console.error(`❌ Critical failure:`, error);
    return []; // এরর হলেও খালি অ্যারে রিটার্ন করুন
  }
};