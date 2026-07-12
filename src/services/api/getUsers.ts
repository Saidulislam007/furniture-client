// src/services/api/getUsers.ts

// 🚀 🟢 ব্যাকএন্ড থেকে সমস্ত ইউজার ডাটা তুলে আনার জন্য ডেডিকেটেড টাইপস্ক্রিপ্ট ফাংশন
export const getAllUsers = async (): Promise<any[] | null> => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.success) {
      return data.data; // ⚡ সাকসেস হলে ইউজার লিস্ট অ্যারে রিটার্ন করবে
    } else {
      console.error(`❌ [Server Error]: ${data.error}`);
      return null;
    }
  } catch (error) {
    console.error("❌ [Network failure]: Failed to fetch user governance metrics", error);
    return null;
  }
};