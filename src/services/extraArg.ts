import { getFeedsApi, getOrdersApi } from '@api';

export interface ApiClients {
  getFeedsApi: typeof getFeedsApi;
  getOrdersApi: typeof getOrdersApi;
}

const extraArgument: ApiClients = {
  getFeedsApi,
  getOrdersApi
};

export default extraArgument;
