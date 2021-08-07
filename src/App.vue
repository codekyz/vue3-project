<template>

  <div class="container">
    <h2>To-Do List</h2>
    <TodoSimpleform @add-todo="addTodo" />
    
    <div v-if="!todos.length">
      추가된 Todo가 없습니다
    </div>

    <TodoList :todos="todos" />
    <!-- 자식 컴포넌트에서 todos라는 이름으로 todos 데이터에 접근 가능 -->

  </div>
</template>

<script>
import { ref } from 'vue';
import TodoSimpleform from './components/TodoSimpleform.vue';
import TodoList from './components/TodoList.vue'

export default {
  components: {
    TodoSimpleform,
    TodoList,
  },
  setup() {
    const todos = ref([]);
    //todos에 들어갈 아이템은 자식컴포넌트인 심플폼에서 부모컴포넌트인 앱.vue로 넘겨 준것

    const tosoStyle = {
      textDecoration: 'line-through',
      color: 'gray'
    }
    const addTodo = (todo) => {
      todos.value.push(todo);
    };

    const deleteTodo = (index) => {
      todos.value.splice(index, 1);
    };

    return {
      todos,
      addTodo,
      tosoStyle,
      deleteTodo,
    };
  }
}
</script>

<style>
  .todo {
    color: gray;
    text-decoration: line-through;
  }
</style>