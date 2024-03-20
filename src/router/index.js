import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/views/HomePage";
import BoardPage from "@/views/BoardPage.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/board/:boardId',
    name: 'board',
    component: BoardPage
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
