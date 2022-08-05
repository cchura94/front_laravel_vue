import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import App from '../App.vue'
import Perfil from '../views/admin/Perfil.vue'
import Login  from '../views/auth/Login.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin',
    component: App,
    meta: {requireAuth: true},
    children: [
      {
        path: 'perfil',
        name: 'Perfil',
        component: Perfil,
        meta: {requireAuth: true},
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to)
  if(to.meta.requireAuth){
    // vuex
    let token = localStorage.getItem("token")
    if(token){
      next()
    }
    next("/login")
  }
  next()
})


export default router
