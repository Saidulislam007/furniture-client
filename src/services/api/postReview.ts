/**
 * 🚀 কাস্টমারের ভেরিফাইড রিভিউ/টেস্টাইমোনিয়াল ডাটাবেজে স্টোর করার জন্য এক্সপ্রেস ব্যাকএন্ডে পাঠানোর ফাংশন
 * @param {any} payload - রিভিউ অবজেক্ট (userId, userEmail, userName, productId, productName, rating, comment)
 * @returns {Promise<boolean>} ডাটাবেজে সাকসেসফুলি ইনসার্ট হলে true, নতুবা false
 */
export const sendToReviewsBackend = async (payload: any): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ Failed to commit testimonial node to reviews matrix:", error);
    return false;
  }
};