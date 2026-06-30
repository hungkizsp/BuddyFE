import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Something went wrong. Please try again.'

    return Promise.reject({
      ...error,
      message,
      validationErrors: error.response?.data?.data,
    })
  },
)

export default axiosClient
