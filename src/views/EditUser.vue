<template>
  <v-app id="inspire">
    <div>
      <v-app-bar color="blue" dense dark>
        <v-toolbar-title>Edit account - ({{ user }})</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="mr-4" @click="logout"> Logout</v-btn>
      </v-app-bar>
    </div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row class="justify-center mt-10">
        <v-col cols="3">
          <v-select
            v-model="roleForm"
            :items="roles"
            :value="roleForm"
            :rules="roleRule"
            color="blue darken-2"
            label="Select Role"
            required
          ></v-select>
          <v-btn :disabled="!valid" color="success" @click="validate()">
            Confirm edit
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-app>
</template>
<script>
import Vue from "vue";

export default {
  data() {
    return {
      roleForm: null,
      user: "",
      roles: ["USER", "ADMIN"],
      roleRule: [(val) => (val || "").length > 0 || "This field is required"],
    };
  },
  methods: {
    refresh: function () {
      this.roleForm = null;
    },
    getUserInfo: async function () {
      let formData = new FormData();
      formData.append("username", this.$route.params.userUsername);

      await Vue.axios.post("/api/getUserByUsername", formData).then((res) => {
        this.user = res.data.username;
      });
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.setRole();
      }
    },
    setRole: async function () {
      let formData = new FormData();
      formData.append("username", this.user);
      formData.append("group", this.roleForm);

      await Vue.axios.post("/api/setRole", formData).then((res) => {
        if (res.data.success) {
          alert("success!!!");
          this.$router.push("/user");
        } else {
          alert(res.data.error);
        }
      });
      this.refresh();
    },
  },
  mounted: function () {
    this.getUserInfo();
  },
};
</script>
