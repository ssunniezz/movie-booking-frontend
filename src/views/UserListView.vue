<template>
  <div class="text-center justify-center align-center mt-10 mx-5">
    <v-simple-table class="text-center">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center grey lighten-5">ID</th>
            <th class="text-center grey lighten-5">Username</th>
            <th class="text-center grey lighten-5">Email</th>
            <th class="text-center grey lighten-5">Role</th>
            <th class="text-center grey lighten-5">Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.group }}</td>
            <td>
              <v-btn
                v-if="$store.state.username !== user.username"
                depressed
                color="warning"
                class="mr-2"
                @click="$router.push(`/edit/${user.username}`)"
              >
                Edit Role
              </v-btn>
              <v-btn
                depressed
                color="primary"
                class="mr-2"
                @click="$router.push(`/password/${user.username}`)"
              >
                <v-icon>mdi-key</v-icon>
              </v-btn>
              <v-dialog v-model="dialog" persistent max-width="290">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-if="$store.state.username !== user.username"
                    color="error"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    @click="temp = user.username"
                  >
                    <v-icon>mdi-trash-can</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="text-h5">
                    Are you sure to delete - ({{ temp }})
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="dialog = false">
                      No, Not Delete
                    </v-btn>
                    <v-btn
                      color="red darken-1"
                      text
                      @click="deleteUser(temp), (dialog = false)"
                    >
                      Yes, Delete
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  data() {
    return {
      users: [],
      dialog: false,
      temp: null,
    };
  },
  methods: {
    getUserInfo: async function () {
      let formData = new FormData();
      formData.append("username", this.$route.params.userUsername);

      await Vue.axios.post("/api/getUserByUsername", formData).then((res) => {
        this.user = res.data.username;
      });
    },
    deleteUser: async function (username) {
      let formData = new FormData();
      formData.append("username", username);

      await Vue.axios.post("/api/deleteUser", formData).then((res) => {
        if (res.data.success) {
          alert("success!!!");
          this.$router.push("/user");
        } else {
          alert(res.data.error);
        }
      });
      this.refresh();
    },
    async show() {
      await Vue.axios.get("/api/getUser", {}).then((response) =>
        response.data.forEach((user) => {
          if (user !== null) {
            this.users.push(user);
          }
        })
      );
    },
  },
  mounted: async function () {
    await this.show();
    await this.getUserInfo();
  },
};
</script>
