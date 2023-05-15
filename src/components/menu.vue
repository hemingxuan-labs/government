<template>
    <div>
        <el-menu
            :default-active="this.$route.path"
            :default-openeds="['1']"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect">
            <div class="menu-title">
                <span>综合管理</span>
                <img src="@/assets/images/menu.png" alt="" />
            </div>
            <el-submenu index="1">
                <template slot="title">
                    <span>专家抽取</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item
                        index="/management"
                        @click="
                            () => {
                                this.$router.push('/management')
                            }
                        ">
                        项目新建
                    </el-menu-item>
                    <el-menu-item
                        index="/auto-notice"
                        @click="
                            () => {
                                this.$router.push('/auto-notice')
                            }
                        "
                        >自动通知</el-menu-item
                    >
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <span>场地管理</span>
                </template>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <span>数据统计</span>
                </template>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isCollapse: true
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        },
        handleSelect() {
            console.log('asdasd')
        }
    }
}
</script>

<style lang="scss">
.el-menu-vertical-demo {
    width: 180px;
    /* min-height: fit-content; */
    min-height: calc(100vh - 60px);
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.12);
    overflow: hidden;
}
.menu-title {
    width: 180px;
    height: 48px;
    padding: 0 12px;
    box-sizing: border-box;
    cursor: default;
    position: relative;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
}
.el-submenu__title:hover {
    background-color: transparent !important;
    color: #2590eb !important;
}
.el-submenu__title:hover span {
    color: #2590eb !important;
}
.el-menu-item-group__title {
    padding: 0 !important;
}

.el-menu-item,
.el-submenu__title {
    width: 180px;
    min-width: 180px;
    height: 40px !important;
    line-height: 40px !important;
    transition: 0.3s !important;
    position: relative !important;
}
.el-menu-item.is-active {
    color: #2590eb;
    background-color: #e0ecf8 !important;
    &::before {
        content: ' ';
        position: absolute;
        width: 2px;
        height: 100%;
        background: #2590eb;
        top: 0;
        right: 20px;
    }
}
.el-menu-item:hover {
    color: #2590eb;
    &::before {
        content: ' ';
        position: absolute;
        width: 2px;
        height: 100%;
        background: #2590eb;
        top: 0;
        right: 20px;
    }
}
.el-menu-item {
    &::after {
        content: ' ';
        position: absolute;
        top: 49%;
        transform: translateY(-50%);
        left: 26px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        border: 1px solid #c4c4c4;
    }
}
</style>
