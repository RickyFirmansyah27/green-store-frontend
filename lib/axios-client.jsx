import axios from "axios";

const BASE_URL = 'https://sales-reps-service-backend.vercel.app';
// const BASE_URL = 'http://localhost:8000';

const makeCallApi = ({
  url = "",
  method = "GET",
  params = {},
  data = {},
  headers = {},
}) => {
  const callApi = axios.create({
    baseURL: BASE_URL,
  });

  callApi.interceptors.request.use(
    (config) => {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set("Content-Type", "application/json");

        for (const [key, value] of Object.entries(headers)) {
          config.headers.set(key, value);
        }
      } else {
        // fallback, jika config.headers belum berbentuk AxiosHeaders
        config.headers = {
          ...config.headers,
          "Content-Type": "application/json",
          ...headers,
        };
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  return callApi({
    url,
    method,
    params,
    data,
  });
};

// CALL METHOD
export const apiGet = (url = "", query = {}, headers = {}) =>
  makeCallApi({
    method: "GET",
    url,
    params: query,
    headers,
  });

export const apiPost = (url = "", body = {}, headers = {}) =>
  makeCallApi({
    method: "POST",
    url,
    data: body,
    headers,
  });

export const apiPut = (url = "", body = {}, headers = {}) =>
  makeCallApi({
    method: "PUT",
    url,
    data: body,
    headers,
  });

export const apiDelete = (url = "", headers = {}) =>
  makeCallApi({
    method: "DELETE",
    url,
    headers,
  });

export default makeCallApi;