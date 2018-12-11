import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

Vue.prototype.$http = axios

// 应用数据 地址不同
let baseUrl = 'http://';
let baseTestUrl = 'http://';


const ajaxURL = {
  // 课程

  // 积分商城
  mall: baseUrl + "mall",                             //积分商城
  orderList: baseUrl + "orderList",                   //订单列表

}

export var fetch = async (type = 'POST', url = '', data = {}) => {
  let result
  type = type.toUpperCase()
  url = ajaxURL[url]
  if (type === 'GET') {
    await axios.get(url, {params: data})
      .then(res => {
        result = res.data
      })
  } else if (type === 'POST') {
    await axios.post(url, qs.stringify(data))
      .then(res => {
        result = res.data
      })
  }
  return result
}
