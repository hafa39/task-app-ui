import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/views/HomePage";
import BoardPage from "@/views/BoardPage.vue";
import HelpPage from "@/views/HelpPage.vue";

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
  {
    path: '/help',
    name: 'help',
    component: HelpPage
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
