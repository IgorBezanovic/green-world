import { client } from '@green-world/utils/api';
import type {
  ServiceListing,
  ServiceListingFiltersParams
} from '@green-world/utils/types';

const ENDPOINT = 'services';

export const getServices = async (params?: ServiceListingFiltersParams) => {
  const { data } = await client.get(ENDPOINT, { params });
  return data.data as ServiceListing[];
};

export const getServiceById = async (id: string) => {
  const { data } = await client.get(`${ENDPOINT}/${id}`);
  return data.data as ServiceListing;
};

export const createService = async (serviceData: Partial<ServiceListing>) => {
  const { data } = await client.post(ENDPOINT, { data: serviceData });
  return data.data as ServiceListing;
};

export const updateService = async (
  id: string,
  serviceData: Partial<ServiceListing>
) => {
  const { data } = await client.patch(`${ENDPOINT}/${id}`, {
    data: serviceData
  });
  return data.data as ServiceListing;
};

export const deleteService = async (id: string) => {
  const { data } = await client.delete(`${ENDPOINT}/${id}`);
  return data.data;
};

export const contactServiceProvider = async (
  id: string,
  contactData: { message: string; phone: string }
) => {
  const { data } = await client.post(`${ENDPOINT}/${id}/contact`, contactData);
  return data;
};
