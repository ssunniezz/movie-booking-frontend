import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/admin",
    name: "admin",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AdminView.vue"),
  },
  {
    path: "/edit/:userUsername",
    name: "editUser",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/EditUser.vue"),
  },
  {
    path: "/reserve/:auditoriumId",
    name: "reserve",
    component: () => import("../views/ReserveView"),
  },
  {
    path: "/",
    name: "movie",
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
  {
    path: "/reserveList",
    name: "reserveList",
    component: () => import("../views/SeatReservedListView.vue"),
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
  // allow logged-out user to access only movie, login, signup page
  if (!isLoggedIn) {
    if (to.name === "Login" || to.name === "Signup") {
      next();
    } else if (to.name === "movie") {
      next();
    } else {
      next({ name: "movie" });
    }
  }
  // make sure if user is logged, user will not be able to see login page
  if (isLoggedIn) {
    if (to.name === "Login" || to.name === "Signup") {
      next({ name: "movie" });
    }
    if (to.name === "admin" && response.data.role !== "ADMIN") {
      next({ name: "movie" });
    }
    if (to.name === "editUser" && response.data.role !== "ADMIN") {
      next({ name: "movie" });
    }
    if (to.name === "UserList" && response.data.role !== "ADMIN") {
      next({ name: "movie" });
    } else {
      let l = router.resolve(to);
      if (l.resolved.matched.length > 0) {
        // let go
        next();
      } else {
        // otherwise go to home page
        next({ name: "movie" });
      }
    }
  }
});
export default router;
