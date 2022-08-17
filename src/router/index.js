import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import App from '../App.vue'
import Perfil from '../views/admin/Perfil.vue'
import Login  from '../views/auth/Login.vue'
import CategoriaView from "../views/admin/categoria/CategoriaView.vue"
import ProductoView from "../views/admin/producto/ProductoView.vue"
import NuevoPedido from "../views/admin/pedido/NuevoPedido.vue"
import Pedido from "../views/admin/pedido/Pedido.vue"

import { Buffer } from "buffer"

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
      },
      {
        path: 'categoria',
        name: "Categoria",
        component: CategoriaView,
        meta: {requireAuth: true}
      },
      {
        path: 'producto',
        name: "Producto",
        component: ProductoView,
        meta: {requireAuth: true}
      },
      {
        path: 'pedido/nuevo',
        name: "NuevoPedido",
        component: NuevoPedido,
        meta: {requireAuth: true}
      },
      {
        path: 'pedido',
        name: "Pedido",
        component: Pedido,
        meta: {requireAuth: true}
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
    let token = Buffer.from(localStorage.getItem("token"), 'base64').toString('ascii');
    
    if(token){
      next()
    }
    next("/login")
  }
  next()
})


export default router
