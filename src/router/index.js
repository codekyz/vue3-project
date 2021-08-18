import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/index.vue';
import Todos from '../pages/todos/index.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            //url
            name: 'Home',
            component: Home
        },
        {
            path: '/todos',
            name: 'Todos',
            component: Todos
        }
        //하나의 객체는 하나의 라우트
    ]
});

// 1 / home 2 /todos 3 /todos/create 4 /todos/:id
//생성할 라우트

export default router;