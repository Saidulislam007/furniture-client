const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ;
export const updateRoleInBackend = async (id: string, role: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: "dummy", // আপনার ডাটাবেসে নাম রিকোয়ার্ড হলে পাঠাতে হবে
        email: "dummy@email.com", // ইমেইল রিকোয়ার্ড হলে পাঠাতে হবে
        role: role 
      }),
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ Role update failed:", error);
    return false;
  }
};