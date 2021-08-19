'use strict';

import axios from 'axios';
import Vue from 'vue';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://8.135.115.58:8001/'
      : 'http://osamodule.com',
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response.data;
  },
  function(error) {
    // Do something with response error
    Vue.prototype.$Message.error('网络错误');
    return Promise.reject(error);
  }
);

export default _axios;
