import service from '@/utils/request.js'

const objToUrl = (obj) => {
    const tempArray = []
    for (const item in obj) {
        if (item) {
            tempArray.push(`${item}=${obj[item]}`)
        }
    }
    return `?${tempArray.join('&')}`
}
// 添加项目
export const createProjectAdd = (data) => {
    return service({
        url: `/api/createProject/add`,
        method: 'post',
        data
    })
}
// 获取列表
export const createProjectList = (data) => {
    return service({
        url: `/api/createProject/list${objToUrl(data)}`,
        method: 'get'
    })
}
// 修改更新项目
export const createProjectUpdate = (data) => {
    return service({
        url: `/api/createProject/update`,
        method: 'post',
        data
    })
}
// 查询单位列表
export const danweiList = (data) => {
    return service({
        url: `/api/danwei/list${objToUrl(data)}`,
        method: 'get'
    })
}

// 添加专业 ==============
export const zhuanyeAdd = (data) => {
    return service({
        url: `/api/zhuanye/add`,
        method: 'post',
        data
    })
}
// 删除专业 ==============
export const zhuanyeDelete = (data) => {
    return service({
        url: `/api/zhuanye/delete`,
        method: 'post',
        data
    })
}
// 专业列表 查询 proid
export const zhuanyeGetlist = (data) => {
    return service({
        url: `/api/zhuanye/getlist${objToUrl(data)}`,
        method: 'get'
    })
}
// 添加评委 ==============
export const zhaobiaorenpingweiAdd = (data) => {
    return service({
        url: `/api/zhaobiaorenpingwei/add`,
        method: 'post',
        data
    })
}
// 根据 proid 查询招标人评委
export const zhaobiaorenpingweiGetlist = (data) => {
    return service({
        url: `/api/zhaobiaorenpingwei/getlist${objToUrl(data)}`,
        method: 'get'
    })
}
// 删除招标人评委
export const zhaobiaorenpingweiDeleteList = (data) => {
    return service({
        url: `/api/zhaobiaorenpingwei/deleteList`,
        method: 'post',
        data
    })
}
// 抽取
export const chouqupingweiChouqu = (data) => {
    return service({
        url: `/api/chouqupingwei/chouqu${objToUrl(data)}`,
        method: 'get'
    })
}
// 抽取评委数据
export const chouqupingweiGetlist = (data) => {
    return service({
        url: `/api/chouqupingwei/getlist${objToUrl(data)}`,
        method: 'get'
    })
}
