<template>
  <v-app>
    <v-app-bar app color="black" dark>
      <v-toolbar-title style="cursor: pointer" @click="redirect('/')"
        ><h2>SSC Theatre</h2></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn
        v-if="$store.state.role === 'ADMIN'"
        class="mr-4"
        plain
        @click="redirect('/admin')"
      >
        Manage</v-btn
      >
      <v-btn
        v-if="$store.state.role === 'ADMIN'"
        class="mr-4"
        plain
        @click="redirect('/user')"
      >
        User List</v-btn
      >
      <v-btn class="mr-4" plain @click="redirect('/')"> Movies</v-btn>
      <v-btn
        v-if="$store.state.isLoggedIn"
        class="mr-4"
        plain
        @click="redirect('/reserveList')"
      >
        My Seat</v-btn
      >
      <v-btn
        v-if="$store.state.isLoggedIn"
        color="error"
        class="mr-4"
        @click="logout"
      >
        Logout</v-btn
      >
      <v-btn
        v-if="!$store.state.isLoggedIn"
        class="mr-4"
        plain
        @click="redirect('/signup')"
      >
        Sign up</v-btn
      >
      <v-btn
        v-if="!$store.state.isLoggedIn"
        color="success"
        class="mr-4"
        @click="redirect('/login')"
      >
        Login</v-btn
      >
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";

export default {
  name: "App",

  data: () => {
    //
  },
  methods: {
    async redirect(path) {
      await this.$router.push({ path: path });
    },
    async logout() {
      let response = await Vue.axios.get("/api/logout");
      if (response.data.success) {
        alert("success!!");
        await this.$router.push({ path: "/home" });
      } else {
        alert("error");
      }
    },
  },
};
</script>
