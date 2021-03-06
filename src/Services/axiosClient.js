import axios from "axios";
import queryString from "query-string";
import refreshToken from "Redux/Sagas/refreshToken";
import { BASE_URL } from "./ServiceURL";
import _ from "lodash";
import moment from "moment";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  paramsSerializer: (params) => queryString.stringify(params, { sort: false }),
});

axiosClient.interceptors.request.use(
  async (config) => {
    config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
    const expiresAt = localStorage.getItem("expiresAt");
    let token = localStorage.getItem("token");
    if (token && !_.isEmpty(token)) {
      if (moment().unix() > expiresAt - 15 * 60) {
        const data = refreshToken();
        token = typeof data === "string" ? data : await data;
      }
    }
    // setting updated token
    localStorage.setItem("token", token);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const axiosClientPdf = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClientPdf.interceptors.request.use(
  async (config) => {
    config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
    const expiresAt = localStorage.getItem("expiresAt");
    let token = localStorage.getItem("token");
    if (token && !_.isEmpty(token)) {
      if (moment().unix() > expiresAt - 15 * 60) {
        const data = refreshToken();
        token = typeof data === "string" ? data : await data;
      }
    }
    // setting updated token
    localStorage.setItem("token", token);
    config.responseType = "blob";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// export default {axiosClient, axiosClientPdf};
export { axiosClient, axiosClientPdf };
