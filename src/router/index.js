import Vue from 'vue'
import VueRouter from 'vue-router'
import Appointments from '../views/Appointments.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Appointments',
        component: Appointments
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue')
    },
    {
        path: '/record',
        redirect: '/search'
    },
    {
        path: '/record/:id',
        name: 'Record',
        component: () => import('../views/Record.vue')
    },
    {
        path: '/appointment',
        redirect: '/'
    },
    {
        path: '/appointment/:id',
        name: 'Appointment',
        component: () => import('../views/Appointment.vue')
    }
]

const router = new VueRouter({
    // base: "/apps/appointments_alternate",
    routes
})

export default router
