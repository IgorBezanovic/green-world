export interface CreatePayPalOrderParams {
  referenceId: string;
  currency?: string;
}

export interface CreatePayPalOrderResponse {
  id: string;
  approveUrl: string;
}

export async function createPayPalOrder(
  params: CreatePayPalOrderParams
): Promise<CreatePayPalOrderResponse> {
  const res = await fetch('/api/paypal/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      referenceId: params.referenceId,
      currency: params.currency ?? 'EUR'
    }),
    credentials: 'include'
  });

  const data = (await res.json()) as CreatePayPalOrderResponse & {
    error?: string;
  };

  if (!res.ok) {
    throw new Error(data.error || 'Create PayPal order failed');
  }

  return data;
}
