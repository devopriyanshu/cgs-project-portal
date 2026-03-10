// src/hooks/payments/useRazorpayCheckout.ts
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';

export function useRazorpayCheckout() {
  const initiate = async (params: {
    projectId: string;
    amount: number; // in paise (₹15,000 = 1500000)
    purpose: string;
    onSuccess: (paymentId: string) => void;
    onError: (error: unknown) => void;
  }) => {
    // 1. Create Razorpay order via NestJS
    const { data } = await apiClient.post(API_ENDPOINTS.PAYMENTS.CREATE_ORDER, {
      projectId: params.projectId,
      amount: params.amount,
    });

    // 2. Open Razorpay checkout
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: params.amount,
      currency: 'INR',
      order_id: data.data.gatewayOrderId,
      name: 'Common Ground Solutions',
      description: params.purpose,
      theme: { color: '#52B788' },
      handler: (response: { razorpay_payment_id: string }) => {
        params.onSuccess(response.razorpay_payment_id);
      },
    });

    rzp.on('payment.failed', params.onError);
    rzp.open();
  };

  return { initiate };
}
