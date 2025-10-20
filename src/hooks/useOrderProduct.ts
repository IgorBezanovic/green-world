import { request } from '@green-world/utils/api';
import { OrderFormData } from '@green-world/views';
import { useMutation } from '@tanstack/react-query';

export const useOrderProduct = () => {
  return useMutation({
    mutationFn: ({
      name,
      lastName,
      email,
      phone,
      address,
      city,
      postalCode,
      message,
      productName,
      productPrice,
      productQuantity,
      productId
    }: OrderFormData) =>
      request({
        url: `/product/order`,
        method: 'post',
        data: {
          name,
          lastName,
          email,
          phone,
          address,
          city,
          postalCode,
          message,
          productName,
          productPrice,
          productQuantity,
          productId
        }
      })
  });
};
