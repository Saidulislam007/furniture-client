/**
 * 🚀 ইউজারের প্রোফাইল মেটাডাটা ব্যাকএন্ডে আপডেট করার সার্ভিস ফাংশন
 * @param {string} id - কারেন্ট ইউজারের আইডি
 * @param {any} payload - প্রোফাইল অবজেক্ট (name, email, image)
 * @returns {Promise<boolean>} ডাটাবেজ সাকসেসফুলি আপডেট হলে true, নতুবা false
 */

const BACKEND_BASE_URL = process.env.BASE_URL ; 
export const updateProfileInBackend = async (id: string, payload: any): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ Failed to commit profile updates to matrix:", error);
    return false;
  }
};