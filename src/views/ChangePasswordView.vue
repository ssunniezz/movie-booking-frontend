<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-row class="justify-center mt-5">
      <v-col cols="4">
        <v-text-field
          label="New password"
          v-model="password"
          :rules="passwordRules"
          type="password"
          required
        ></v-text-field>
        <v-text-field
          label="Confirm new password"
          v-model="confirmPassword"
          :rules="confirmPasswordRules.concat(passwordConfirmationRule)"
          type="password"
          required
        ></v-text-field>
        <v-btn :disabled="!valid" color="success" @click="validate">
          Confirm change password
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
import Vue from "vue";

export default {
  data: () => ({
    valid: true,
    password: "",
    confirmPassword: "",
    passwordRules: [(v) => !!v || "Password is required"],
    confirmPasswordRules: [(v) => !!v || "Password is required"],
    items: [
      { title: "Movies", route: "/movie" },
      { title: "EditUser", route: "/user" },
      { title: "Change password", route: "/edit/user/username" },
      { title: "Log out", route: "/logout" },
    ],
  }),

  methods: {
    async validate() {
      if (this.$refs.form.validate()) {
        let formData = new FormData();
        formData.append("username", this.$route.params.userUsername);
        formData.append("password", this.password);
        let response = await Vue.axios.post("/api/password", formData);
        if (response.data.success) {
          alert("success!!");
          this.$router.push({ path: "/login" });
        } else {
          alert("error");
        }
      }
    },
  },
  computed: {
    passwordConfirmationRule() {
      return () =>
        this.password === this.confirmPassword || "Password must match";
    },
  },
};
</script>
