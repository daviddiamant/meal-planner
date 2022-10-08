import axios, { Method } from "axios";
import { User } from "firebase/auth";

import { API_URL } from "../appConfig";

export const getJWTInterceptor = (user: User | null | undefined): number =>
  axios.interceptors.request.use(async (config) => {
    const isOwnAPI = config.url?.includes(API_URL);
    if (!isOwnAPI) {
      return config;
    }

    const JWT = await user?.getIdToken();

    return {
      ...config,
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
      cancelToken: !JWT
        ? new axios.CancelToken((cancel) => cancel("Have no JWT"))
        : undefined,
    };
  });

export const axiosDataGetter =
  <ReturnType>(method: Method, url: string) =>
  async (): Promise<ReturnType> => {
    const { data } = await axios({
      method,
      url,
    });

    return data;
  };
