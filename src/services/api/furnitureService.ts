/**
 * 🚀 🟢 এক্সপ্রেস ব্যাকএন্ডে নির্দিষ্ট ফার্নিচারের স্ট্যাটাস আপডেট করার PATCH মেথড ভাই
 * @param {string} id - ফার্নিচার অবজেক্ট আইডি
 * @param {object} updateData - যে ডাটাটি আপডেট করতে চান (e.g., { status: 'Published' })
 * @returns {Promise<boolean>} সফল হলে true, ব্যর্থ হলে false
 * 
 * 
 */

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ; 
export const updateFurnitureInBackend = async (id: string, updateData: Record<string, any>): Promise<boolean> => {
  try {
    // 🎯 🚀 মেথড পরিবর্তন করে PATCH করা হলো যাতে ব্যাকএন্ডের ডাইনামিক আপডেটের সাথে সিঙ্ক হয় ভাই
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/furniture/${id}`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    // 🔒 সেফগার্ড: রেসপন্স যদি JSON না হয়ে কোনো HTML এরর পেজ দেয়, তবে ক্যাচ করে প্রটেক্ট করবে
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      console.warn("⚠️ Target furniture node endpoint returned non-JSON response.");
      return false;
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error(`❌ Critical failure while updating furniture ledger node [ID: ${id}]:`, error);
    return false;
  }
};