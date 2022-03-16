import axios from 'axios';

const TAG = 'utils/ajax';

const ajax = axios.create();
ajax.interceptors.request.use(request => {
    console.log(`${TAG} axios interceptors request start`);
    console.info(`${TAG} 请求地址: ${request?.url}`);
    console.info(`${TAG} 请求参数: ${JSON.stringify(request?.params)}`);
    console.log(`${TAG} axios interceptors request end`);
    return request;
})
ajax.interceptors.response.use((response) => {
    console.log(`${TAG} axios interceptors response start`);
    console.info(`${TAG} 请求返回数据: ${response?.data && JSON.stringify(response?.data)}`);
    console.log(`${TAG} axios interceptors response end`);

    return response;
}, (error) => {
    console.log(`${TAG} axios interceptors error handler start`);
    console.error(`${TAG} 请求地址: ${error?.config?.url}`);
    console.error(`${TAG} 错误信息: ${error?.message}`);
    console.log(`${TAG} axios interceptors error handler end`);

    if (error.code === 'ECONNABORTED') {
        return Promise.reject(Object.assign(error, {
            message: '请求超时，请稍后再试！'
        }))
    } else if (error.message === 'Network Error') {
        return Promise.reject(Object.assign(error, {
            message: '网络错误！'
        }))
    }
    return Promise.reject(error);
})

export default ajax;