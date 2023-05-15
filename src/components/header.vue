<template>
    <div class="header">
        <div>
            <img class="logo" src="@/assets/images/logo.png" />
            <div class="dzdan">
                <span
                    @click="
                        () => {
                            this.$router.push('/management')
                        }
                    "
                    >电子档案</span
                >
                <span
                    @click="
                        () => {
                            this.$router.push('/management')
                        }
                    "
                    >工程建设</span
                >
                <span
                    @click="
                        () => {
                            this.$router.push('/management')
                        }
                    "
                    >综合管理</span
                >
            </div>
        </div>
        <div>
            <img class="user-portrait" src="@/assets/images/getMyPicture.jpeg" alt="" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'headers',
    data() {
        return {
            headerMenu: [
                {
                    title: '工程建设',
                    path: '/'
                },
                {
                    title: '水利及农业农村工程',
                    path: '/'
                }
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
.header {
    height: 60px;
    background: #1f5bac;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    & > div {
        display: flex;
        align-items: center;
    }
    .logo {
        width: 330px;
    }
    .dzdan {
        display: flex;
        span {
            font-size: 16px;
            color: #fff;
            opacity: 0.5;
            margin-left: 50px;
            cursor: pointer;
            transition: 0.3s;
            &:hover {
                opacity: 1;
            }
        }
    }
    .user-portrait {
        display: block;
        border-radius: 50%;
        margin-right: auto;
        margin-left: auto;
        width: 28px;
        height: 28px;
    }
}
</style>
