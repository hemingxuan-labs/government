import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login.vue')
    },
    {
        path: '/management',
        name: 'management',
        component: () => import('@/views/management.vue')
    },
    {
        path: '/auto-notice',
        name: 'auto-notice',
        component: () => import('@/views/auto-notice.vue')
    }
]
const router = new VueRouter({
    mode: 'history',
    routes
})
export default router
