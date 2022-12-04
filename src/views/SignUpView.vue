<template>
  <v-app id="inspire">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row class="justify-center">
        <v-col cols="4">
          <v-text-field
            v-model="username"
            :counter="10"
            :rules="usernameRules"
            label="Username"
            required
          ></v-text-field>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            :rules="passwordRules"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            label="Confirm Password"
            v-model="confirmPassword"
            :rules="confirmPasswordRules.concat(passwordConfirmationRule)"
            type="password"
            required
          ></v-text-field>
          <v-btn :disabled="!valid" color="success" @click="validate">
            Sign up
          </v-btn>
          <v-btn color="error" @click="reset"> Reset Form </v-btn>
          <v-btn color="warning" @click="resetValidation">
            Reset Validation
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-app>
</template>
<script>
import Vue from "vue";

export default {
  data: () => ({
    valid: true,
    username: "",
    usernameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    confirmPassword: "",
    passwordRules: [(v) => !!v || "Password is required"],
    confirmPasswordRules: [(v) => !!v || "Password is required"],
  }),

  methods: {
    async validate() {
      if (this.$refs.form.validate()) {
        let formData = new FormData();
        formData.append("username", this.username);
        formData.append("email", this.email);
        formData.append("password", this.password);

        let response = await Vue.axios.post("/api/signup", formData);
        if (response.data.success) {
          alert("success!!");
          this.$router.push({ path: "/login" });
        } else {
          alert("error");
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
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
