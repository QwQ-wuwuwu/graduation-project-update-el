import axios from 'axios'

axios.defaults.baseURL = '/api'
axios.interceptors.request.use(
  (req) => {
    const auth = sessionStorage.getItem('token')
    // 判断,用于避免header包含authorization属性但数据值为空
    if (auth && req.headers) {
      req.headers.token = auth
    }
    return req
  },
  (error) => {
    console.log(error.message)
    return Promise.reject()
  }
)
axios.interceptors.response.use(
  (res) => {
    if(res.config.responseType == 'blob') { // 二进制流响应数据通过
      return res
    }
    if(res.data.code == 205) {
      alert('后台服务器错误')
      return Promise.reject(res.data)
    }
    if(res.status >= 400) {
      alert(res.data.message)
      return Promise.reject(res.data)
    }
    return res
  },
  err => {
    console.log(err.message)
    return Promise.reject(err)
  }
)
export default axios