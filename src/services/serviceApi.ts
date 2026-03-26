import { client } from '@green-world/utils/api';
import type {
  PaginatedResponse,
  ServiceListing,
  ServiceListingFiltersParams
} from '@green-world/utils/types';

const ENDPOINT = 'services';

export type ServicesPaginatedResponse = PaginatedResponse<ServiceListing>;

export const getServices = async (params?: ServiceListingFiltersParams) => {
  const { data } = await client.get(ENDPOINT, { params });
  return data.data as ServiceListing[];
};

export const getServicesPaginated = async (
  params?: ServiceListingFiltersParams
) => {
  const { data } = await client.get(ENDPOINT, { params });

  return data as ServicesPaginatedResponse;
};

export const getServiceById = async (id: string) => {
  const { data } = await client.get(`${ENDPOINT}/${id}`);
  return data.data as ServiceListing;
};

export const createService = async (serviceData: Partial<ServiceListing>) => {
  const { data } = await client.post(ENDPOINT, serviceData);
  return data.data as ServiceListing;
};

export const updateService = async (
  id: string,
  serviceData: Partial<ServiceListing>
) => {
  const { data } = await client.patch(`${ENDPOINT}/${id}`, serviceData);
  return data.data as ServiceListing;
};

export const deleteService = async (id: string) => {
  const { data } = await client.delete(`${ENDPOINT}/${id}`);
  return data.data;
};

export const sendDirectEmailToServiceProvider = async (
  id: string,
  emailData: { name: string; phone: string; message: string }
) => {
  const { data } = await client.post(
    `${ENDPOINT}/${id}/direct-email`,
    emailData
  );
  return data;
};
