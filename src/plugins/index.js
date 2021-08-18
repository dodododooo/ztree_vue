import axios from './axios';
import * as tools from './utils';
export default {
  install: (Vue) => {
    Vue.prototype.$http = axios;
    Vue.prototype.$tools = tools;
  }
}