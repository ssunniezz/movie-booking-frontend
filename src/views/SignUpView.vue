<template>
  <v-container>
    <template>
      <v-row class="justify-center mt-12"> <h1>Sign Up Page</h1> </v-row>
      <v-row>
        <v-col cols="15" class="align-center">
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
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-btn
                class="mr-4"
                :disabled="!valid"
                color="success"
                @click="validate"
              >
                Sign up
              </v-btn>
              <v-btn class="mr-4" color="error" @click="reset">
                Reset Form
              </v-btn>
              <v-btn class="mr-4" color="warning" @click="resetValidation">
                Reset Validation
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
