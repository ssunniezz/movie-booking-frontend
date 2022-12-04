<template>
  <v-container>
    <template>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="username"
          :rules="usernameRules"
          label="Username"
          required
        ></v-text-field>

        <v-text-field
          type="password"
          v-model="password"
          :rules="passwordRules"
          label="Password"
          required
        ></v-text-field>

        <v-btn :disabled="!valid" color="success" class="mr-4" @click="submit">
          Login
        </v-btn>

        <v-btn color="error" class="mr-4" @click="reset"> Reset </v-btn>

        <div>
          <br />
          If you do not have an account
        </div>
        <br />
        <v-btn color="primary" class="mr-4" @click="signup"> Sign up </v-btn>
      </v-form>
    </template>
  </v-container>
</template>

<script>
import Vue from "vue";
export default {
  data: () => ({
    valid: true,
    username: "",
    password: "",
    usernameRules: [(v) => !!v || "Username is required"],
    passwordRules: [(v) => !!v || "Password is required"],
  }),
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        let formData = new FormData();
        formData.append("username", this.username);
        formData.append("password", this.password);
        let response = await Vue.axios.post("/api/login", formData);
        if (response.data.success) {
          alert("Login successfully");
          await this.$router.push({ path: "/" });
        } else {
          alert("Incorrect username or password");
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    signup() {
      this.$router.push({ path: "/signup" });
    },
  },
};
</script>
