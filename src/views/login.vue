<template>
    <div class="login">
        <div class="login-header"></div>
        <div class="login-body">
            <img src="@/assets/images/login2-pic.png" class="body-pic2" />
            <img src="@/assets/images/login2-bottom.png" class="body-icon2" />
            <div class="login-block">
                <div style="display: flex; align-items: center; justify-content: space-between">
                    <div
                        :class="{ active: activeName == 1 }"
                        style="
                            height: 46px;
                            line-height: 46px;
                            flex: 1;
                            text-align: center;
                            border-bottom: 2px solid #daeaf7;
                            cursor: pointer;
                        "
                        @click="activeName = 1">
                        用户登录
                    </div>
                    <div
                        :class="{ active: activeName == 2 }"
                        style="
                            height: 46px;
                            line-height: 46px;
                            flex: 1;
                            text-align: center;
                            border-bottom: 2px solid #daeaf7;
                            cursor: pointer;
                        "
                        @click="activeName = 2">
                        CA登录
                    </div>
                </div>
                <div class="login-input">
                    <img class="login" src="@/assets/images/person-login2.png" alt="" />
                    <el-input v-model="input1" placeholder="请输入用户名"></el-input>
                </div>
                <div class="login-input">
                    <img class="login" src="@/assets/images/pwd-login2.png" alt="" />
                    <el-input v-model="input2" placeholder="请输入密码" show-password></el-input>
                </div>
                <div class="qudongxiazai">
                    <img src="@/assets/images/download-icon.png" alt="" />
                    <span>驱动下载</span>
                </div>
                <el-button
                    type="primary"
                    class="lijidenglu"
                    @click="
                        () => {
                            this.$router.push('/management')
                            // this.$router.push('/home')
                        }
                    "
                    >立即登录</el-button
                >
            </div>
        </div>
        <div class="login-footer">
            <p style="font-size: 14px; color: #333; text-decoration: none; font-family: 微软雅黑">
                技术支持：<a
                    style="color: #333; text-decoration: none; font-family: 微软雅黑"
                    href="#"
                    @click="window.open('http://www.epoint.com.cn')"
                    >国泰新点软件股份有限公司</a
                >
            </p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'login',
    data() {
        return {
            activeName: 1,
            input1: '',
            input2: ''
        }
    },
    methods: {
        onLoginClick() {
            this.$router.push('/management')
        }
    }
}
</script>
<style lang="scss">
.login {
    .login-header {
        margin-left: 3%;
        height: 105px;
        background: url(../assets/images/login-title.png) left center no-repeat;
    }
    .login-body {
        position: relative;
        background: #1577e4;
        width: 100vw;
        height: calc(100vh - 201px);
        overflow: hidden;
        .body-pic2 {
            position: absolute;
            top: 0;
            left: -1%;
            height: 100%;
        }
        .body-icon2 {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 23%;
        }
        .login-block {
            margin-top: -150px;
            position: absolute;
            top: 50%;
            right: 10%;
            width: 325px;
            height: 300px;
            background-color: #fff;
            border-radius: 4px;
            padding: 8px 24px;
            box-sizing: border-box;
            color: #999;
            .active {
                color: #4d90df;
                border-bottom: 2px solid #4d90df !important;
            }
            .login-input {
                margin-top: 18px;
                position: relative;
                .login {
                    height: 50%;
                    position: absolute;
                    top: 25%;
                    left: 10px;
                    z-index: 1;
                }
                .el-input__inner {
                    padding-left: 45px !important;
                }
            }
            .qudongxiazai {
                font-size: 14px;
                color: #999;
                display: flex;
                align-items: center;
                margin: 14px 0;
                img {
                    margin-right: 6px;
                }
            }
            .lijidenglu {
                width: 100%;
                background-color: #43a8ef;
                font-size: 18px;
                span {
                    letter-spacing: 4px;
                }
            }
        }
    }
    .login-footer {
        height: 96px;
        padding-top: 16px;
        box-sizing: border-box;
        width: 100%;
        text-align: center;
        color: #666;
    }
}
</style>
