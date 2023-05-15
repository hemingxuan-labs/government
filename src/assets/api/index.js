import service from '@/utils/request.js'
import { objToUrl } from '@/utils/common.js'

// discord登录
export const discordOauthToken = (data) => {
    return service({
        url: `/api/needex/discord/oauth/token?code=${data}`,
        method: 'get'
    })
}
// 用户签名
export const userDoLong = (data) => {
    return service({
        url: `/api/needex/user/doLong`,
        method: 'post',
        data
    })
}
// 用户提交邮箱
export const doEmail = (data) => {
    return service({
        url: `/api/needex/user/doEmail`,
        method: 'post',
        data
    })
}
// Twitter授权第一步
export const twitterOauthRequestToken = () => {
    return service({
        url: `/api/needex/twitter/oauth/requestToken`,
        method: 'get'
    })
}
// 创建提案
export const proposalCreate = (data) => {
    return service({
        url: `/api/needex/proposal/create`,
        method: 'post',
        data
    })
}
