import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import LoginView from "@/views/LoginView";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/admin",
    name: "admin",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AdminView.vue"),
  },
  {
    path: "/edit/:userUsername",
    name: "editUser",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/EditUser.vue"),
  },
  {
    path: "/reserve/:auditoriumId",
    name: "reserve",
    component: () => import("../views/ReserveView"),
  },
  {
    path: "/movie",
    name: "movie",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/MovieView.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LoginView.vue"),
  },

  {
    path: "/signup",
    name: "Signup",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SignUpView.vue"),
  },
  {
    path: "/user",
    name: "UserList",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/UserListView.vue"),
  },
  {
    path: "/password/:userUsername",
    name: "ChangePassword",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ChangePasswordView.vue"),
  },
];

const router = new VueRouter({
  routes,
});
router.beforeEach(async (to, from, next) => {
  // get login state using whomai and axios
  let response = await Vue.axios.get("/api/whoAmI");
  // response.data is our payload
  await store.dispatch("setLoggedInUser", response.data);
  let isLoggedIn = store.state.isLoggedIn;
  // make sure if user is logged, user will not be able to see login page
  if (to.name === "Login" && isLoggedIn) {
    next({ name: "movie" });
  }
  if (to.name === "admin" && isLoggedIn && response.data.role !== "ADMIN") {
    next({ name: "movie" });
  }
  if (to.name === "editUser" && isLoggedIn && response.data.role !== "ADMIN") {
    next({ name: "movie" });
  }
  if (to.name === "UserList" && isLoggedIn && response.data.role !== "ADMIN") {
    next({ name: "movie" });
  }
  if (to.name !== "Login" && to.name !== "Signup" && !isLoggedIn) {
    // redirect to login page
    next({ name: "Login" });
  } else {
    // otherwise, let go
    next();
  }
});
export default router;
