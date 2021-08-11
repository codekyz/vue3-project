<template>

  <div class="container">
    <h2>To-Do List</h2>

    <input
      class="form-control"
      type="text"
      v-model="searchText"
      placeholder="Search"
    >
    <hr/>
    <TodoSimpleform @add-todo="addTodo" />
    <div style="color: red">{{ error }}</div>
    
    <div v-if="!filterTodos.length">
      There is nothing to display

    </div>
    <TodoList :todos="filterTodos"
    @toggle-Todo="toggleTodo"
    @delete-todo="deleteTodo"
    />
    <!-- 자식 컴포넌트에서 todos라는 이름으로 todos 데이터에 접근 가능 -->

  </div>
</template>

<script>
import { ref, computed } from 'vue';
import TodoSimpleform from './components/TodoSimpleform.vue';
import TodoList from './components/TodoList.vue'
import axios from 'axios';

export default {
  components: {
    TodoSimpleform,
    TodoList,
  },
  setup() {
    const todos = ref([]);
    //todos에 들어갈 아이템은 자식컴포넌트인 심플폼에서 부모컴포넌트인 앱.vue로 넘겨 준것
    const error = ref('');

    const getTodos = async () => {
      try {
        const res = await axios.get('http://localhost:3000/todos');
        todos.value = res.data;
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong.';
      }
    };

    getTodos();

    const tosoStyle = {
      textDecoration: 'line-through',
      color: 'gray'
    }
    const addTodo = async (todo) => {
      error.value = '';
      //error 메세지 초기화
      try {
        const res = await axios.post('http://localhost:3000/todos', {
          subject: todo.subject,
          completed: todo.completed,
        });
        todos.value.push(res.data);
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong.';
      }
      //async와 await를 이용하여 then,catch 사용과 같은 효고
      
    };

    const deleteTodo = async (index) => {
      error.value = '';
      const id = todos.value[index].id;
      try {
        await axios.delete('http://localhost:3000/todos/' + id);
        todos.value.splice(index, 1);
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong.';
      }
    };


    const toggleTodo = async (index) => {
      error.value = '';
      const id = todos.value[index].id;
      try {
        await axios.patch('http://localhost:3000/todos/' + id, {
          completed: !todos.value[index].completed
        });
        todos.value[index].completed = !todos.value[index].completed;
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong.';
      }
    };

    const searchText = ref('');
    const filterTodos = computed(() => {
      if (searchText.value) {
        return todos.value.filter(todo => {
          return todo.subject.includes(searchText.value);
        });
      }

      return todos.value;
    });



    return {
      todos,
      addTodo,
      tosoStyle,
      deleteTodo,
      toggleTodo,
      searchText,
      filterTodos,
      error,
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