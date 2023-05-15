import axios from 'axios'
let service = axios.create({
    baseURL: '',
    timeout: 20000
})
// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // config.url = 'http://192.168.0.8:10889' + config.url.substring(4)
        config.url = 'http://34.125.107.145:10889' + config.url.substring(4)
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)
//响应拦截器
service.interceptors.response.use(
    async (response) => {
        return response
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default service
