<template>

  <div>
    <h2>To-Do List</h2>

    <input
      class="form-control"
      type="text"
      v-model="searchText"
      placeholder="Search"
      @keyup.enter="searchTodo"
    >
    <hr/>
    <TodoSimpleform @add-todo="addTodo" />
    <div style="color: red">{{ error }}</div>
    
    <div v-if="!todos.length">
      There is nothing to display

    </div>
    <TodoList :todos="todos"
    @toggle-Todo="toggleTodo"
    @delete-todo="deleteTodo"
    />
    <!-- 자식 컴포넌트에서 todos라는 이름으로 todos 데이터에 접근 가능 -->
    <hr />

    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li v-if="currentPage !== 1" class="page-item">
          <a style="cursor: pointer" class="page-link" @click="getTodos(currentPage - 1)">
            Previous
          </a>
        </li>

        <li
          v-for="page in numOfPages"
          :key="page"
          class="page-item"
          :class="currentPage === page ? 'active' : ''"
        >
          <a style="cursor: pointer" class="page-link" @click="getTodos(page)">
            {{page}}
          </a>
        </li>

        <li v-if="numOfPages !== currentPage" class="page-item">
          <a style="cursor: pointer" class="page-link" @click="getTodos(currentPage + 1)">
            Next
          </a>
        </li>
      </ul>
    </nav>
  </div>
  <Toast
    v-if="showToast"
    :message="toastMessage"
    :type="toastAlertType"
  />
</template>

<script>
import { ref, computed, watch } from 'vue';
import TodoSimpleform from '@/components/TodoSimpleform.vue';
import TodoList from '@/components/TodoList.vue'
import axios from 'axios';
import Toast from '@/components/Toast.vue';
import { useToast } from '@/composables/toast';

export default {
  components: {
    TodoSimpleform,
    TodoList,
    Toast,
  },
  setup() {
    const todos = ref([]);
    //todos에 들어갈 아이템은 자식컴포넌트인 심플폼에서 부모컴포넌트인 앱.vue로 넘겨 준것
    const error = ref('');
    const numOfTodos = ref(0);
    const limit = 5;
    const currentPage = ref(1);
    const searchText = ref('');

  
    const numOfPages = computed(() => {
      return Math.ceil(numOfTodos.value/limit);
    });

    const {
      toastMessage,
      toastAlertType,
      showToast,
      triggerToast
    } = useToast();

    

    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page;
        try {
        const res = await axios.get(
          `http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`
          );
        numOfTodos.value = res.headers['x-total-count']
        todos.value = res.data;
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong.';
        triggerToast('Something went wrong', 'danger');
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
        await axios.post('http://localhost:3000/todos', {
          subject: todo.subject,
          completed: todo.completed,
        });
        getTodos(1);
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong.';
        triggerToast('Something went wrong', 'danger');
      }
      //async와 await를 이용하여 then,catch 사용과 같은 효고
      
    };

    const deleteTodo = async (index) => {
      error.value = '';
      const id = todos.value[index].id;
      try {
        await axios.delete('http://localhost:3000/todos/' + id);
        getTodos(1);
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong.';
        triggerToast('Something went wrong', 'danger');
      }
    };


    const toggleTodo = async (index, checked) => {
      console.log(checked);
      error.value = '';
      const id = todos.value[index].id;
      try {
        await axios.patch('http://localhost:3000/todos/' + id, {
          completed: checked
        });
        todos.value[index].completed = checked;
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong.';
        triggerToast('Something went wrong', 'danger');
      }
    };

    //search func
    let timeout = null;
    const searchTodo = () => {
      clearTimeout(timeout);
      getTodos(1);
    };
    watch(searchText, () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getTodos(1);
      }, 2000)
    });
    // const filterTodos = computed(() => {
    //   if (searchText.value) {
    //     return todos.value.filter(todo => {
    //       return todo.subject.includes(searchText.value);
    //     });
    //   }

    //   return todos.value;
    // });

    return {
      todos,
      addTodo,
      tosoStyle,
      deleteTodo,
      toggleTodo,
      searchText,
      // filterTodos,
      error,
      numOfPages,
      currentPage,
      getTodos,
      searchTodo,
      toastMessage,
      toastAlertType,
      showToast,
      triggerToast,
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