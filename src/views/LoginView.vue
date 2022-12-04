<template>
  <v-container>
    <template>
      <v-row class="justify-center mt-10"> <h1>Login Page</h1> </v-row>
      <v-row class="justify-center">
        <v-col cols="4" class="justify-center align-center">
          <v-form ref="form" v-model="valid" lazy-validation class="mt-10">
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

            <v-row class="justify-center mt-2">
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="submit"
              >
                Login
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset"> Reset </v-btn>
            </v-row>

            <v-row class="justify-center mt-2">
              <br />
              If you do not have an account
            </v-row>
            <br />
            <v-row class="justify-center mt-2">
              <v-btn color="primary" class="mr-4" @click="signup">
                Sign up
              </v-btn>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
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
