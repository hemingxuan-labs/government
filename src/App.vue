<template>
    <div id="app">
        <Header v-if="this.$route.path !== '/login'" />
        <div class="app-box">
            <Menu v-if="this.$route.path !== '/login'" />
            <router-view class="router-view" />
        </div>
    </div>
</template>
<script>
import Header from '@/components/header.vue'
import Menu from '@/components/menu.vue'
export default {
    name: 'app',
    components: {
        Header,
        Menu
    },
    mounted() {}
}
</script>
<style>
* {
    margin: 0;
    padding: 0;
    font-family: Microsoft Yahei;
    font-weight: 400;
}
a {
    text-decoration: none;
    color: #000;
}
#app {
    display: flex;
    flex-direction: column;
}
.app-box {
    display: flex;
}
.router-view {
    flex: 1;
}
</style>
