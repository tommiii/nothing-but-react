import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL_API}/v2/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject token on request
axiosInstance.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Acquire new token when 403 is detected, refreshToken is not supported for client_credentials
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL_API}/oauth`,
          {
            grant_type: "client_credentials",
            client_id: import.meta.env.VITE_CLIENT_ID,
            client_secret: import.meta.env.VITE_CLIENT_SECRET,
          }
        );
        const { access_token: accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (acquireNewTokenError) {
        console.error("Acquire new token failed:", acquireNewTokenError);
        localStorage.removeItem("accessToken");
        return Promise.reject(acquireNewTokenError);
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
