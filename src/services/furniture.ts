// src/services/furniture.ts

export const sendFurnitureToBackend = async (payload: any): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/furniture/submit', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success) {
      alert("⚡ [Pipeline Success]: Asset successfully queued for review!");
      return true;
    } else {
      alert(`❌ [Server Error]: ${data.error || 'Submission rejected by node.'}`);
      return false;
    }
  } catch (error) {
    console.error("❌ [Network failure]: Pipeline breakdown", error);
    alert("সার্ভারের সাথে কানেক্ট করা যাচ্ছে না। আপনার এক্সপ্রেস সার্ভারটি চালু আছে তো?");
    return false;
  }
};