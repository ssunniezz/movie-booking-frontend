<template>
  <div class="admin">
    <template>
      <v-container fill-height class="pa-10">
        <v-row align="center">
          <v-col cols="2">
            <v-subheader></v-subheader>
          </v-col>
          <v-col cols="5">
            <v-subheader class="justify-center">Available</v-subheader>
          </v-col>
          <v-col cols="5">
            <v-subheader class="justify-center">Linked</v-subheader>
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col cols="2">
            <v-subheader> Movie</v-subheader>
          </v-col>

          <v-col cols="4">
            <v-select
              v-model="movieForm1"
              :items="movies"
              :value="movieForm1"
              item-text="title"
              label="Select Available Movie"
              prepend-icon="mdi-movie"
              no-data-text="No Movie Available"
              return-object
              persistent-hint
              single-line
            ></v-select>
          </v-col>
          <v-col cols="1">
            <v-btn
              class="align-center"
              depressed
              :disabled="movieForm1 === null"
              color="error"
              @click="deleteMovie()"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-col>

          <v-col cols="5">
            <v-select
              v-model="movieForm2"
              :items="linkedMovies"
              :value="movieForm2"
              item-text="link"
              label="Select Linked Movie/Auditorium"
              prepend-icon="mdi-movie"
              no-data-text="No Movie/Auditorium Linked"
              return-object
              persistent-hint
              single-line
            ></v-select>
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col cols="2">
            <v-subheader> Auditorium</v-subheader>
          </v-col>

          <v-col cols="4">
            <v-select
              v-model="auditoriumForm1"
              :items="auditoriums"
              :value="auditoriumForm1"
              item-text="name"
              label="Select Available Auditorium"
              prepend-icon="mdi-theater"
              no-data-text="No Auditorium Available"
              return-object
              single-line
            ></v-select>
          </v-col>

          <v-col cols="1">
            <v-btn
              class="align-center"
              depressed
              :disabled="auditoriumForm1 === null"
              color="error"
              @click="deleteAuditorium()"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row align="center" justify="center">
          <v-col cols="2"></v-col>
          <v-col cols="5">
            <v-btn
              depressed
              :disabled="auditoriumForm1 === null || movieForm1 === null"
              color="primary"
              @click="link()"
            >
              Link
            </v-btn>
          </v-col>
          <v-btn
            class="align-center"
            depressed
            :disabled="movieForm2 === null"
            color="error"
            @click="unlink()"
          >
            Unlink
          </v-btn>
        </v-row>

        <v-divider inset class="mt-4 mb-4"></v-divider>

        <v-row align="center" justify="space-between">
          <v-col cols="5">
            <v-subheader class="justify-center">Add Movie</v-subheader>
          </v-col>
          <v-col cols="5">
            <v-subheader class="justify-center">Add Auditorium</v-subheader>
          </v-col>
        </v-row>

        <v-row align="center" justify="space-between">
          <v-col cols="5">
            <template>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="title"
                  label="Title"
                  :rules="defaultRules"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="director"
                  label="Director"
                  :rules="defaultRules"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="description"
                  label="Description"
                  :rules="defaultRules"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="duration"
                  label="Duration"
                  :rules="numberRules"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="picUrl"
                  label="Picture Url"
                  :rules="defaultRules"
                  required
                ></v-text-field>

                <v-btn
                  :disabled="!valid"
                  color="success"
                  class="mr-4"
                  @click="validate"
                >
                  Add Movie
                </v-btn>

                <v-btn color="error" class="mr-4" @click="reset"> Reset </v-btn>

                <v-btn color="warning" @click="resetValidation">
                  Reset Validation
                </v-btn>
              </v-form>
            </template>
          </v-col>

          <v-col cols="6">
            <template>
              <v-form ref="form2" v-model="valid2" lazy-validation>
                <v-text-field
                  v-model="name"
                  label="Name"
                  :rules="defaultRules"
                  required
                ></v-text-field>

                <v-btn
                  :disabled="!valid"
                  color="success"
                  class="mr-4"
                  @click="validate2"
                >
                  Add Auditorium
                </v-btn>

                <v-btn color="error" class="mr-4" @click="reset2">
                  Reset
                </v-btn>

                <v-btn color="warning" @click="resetValidation2">
                  Reset Validation
                </v-btn>
              </v-form>
            </template>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  data() {
    return {
      movieForm1: null,
      auditoriumForm1: null,
      movieForm2: null,
      movies: [],
      linkedMovies: [],
      auditoriums: [],

      valid: "true",
      valid2: "true",
      valid3: "true",
      title: "",
      duration: "",
      director: "",
      description: "",
      picUrl: "",

      name: "",

      defaultRules: [(v) => !!v || "Field is required"],
      numberRules: [(v) => /[0-9]+/.test(v) || "Must be digits"],
    };
  },
  methods: {
    link: async function () {
      let formData = new FormData();
      formData.append("movieId", this.movieForm1.id);
      formData.append("auditoriumId", this.auditoriumForm1.id);

      await Vue.axios.post("/api/link", formData).then((res) => {
        if (res.data.success) {
          alert("success!!!");
        } else {
          alert(res.data.error);
        }
      });
      this.refresh();
      await this.reload();
    },
    unlink: async function () {
      let formData = new FormData();
      formData.append("movieId", this.movieForm2.id);
      formData.append("auditoriumId", this.movieForm2.auditorium.id);

      await Vue.axios.post("/api/unlink", formData).then((res) => {
        if (res.data.success) {
          alert("success!!!");
        } else {
          alert(res.data.error);
        }
      });
      this.refresh();
      await this.reload();
    },
    addMovie: async function () {
      let formData = new FormData();
      formData.append("title", this.title);
      formData.append("director", this.director);
      formData.append("description", this.description);
      formData.append("duration", this.duration);
      formData.append("picUrl", this.picUrl);

      await Vue.axios.post("/api/addMovie", formData).then((res) => {
        if (res.data.success) {
          alert("success!!!");
        } else {
          alert(res.data.error);
        }
      });
      this.refresh();
      this.reset();
      await this.reload();
    },
    deleteMovie: async function () {
      let formData = new FormData();
      formData.append("id", this.movieForm1.id);

      await Vue.axios.post("/api/deleteMovie", formData).then((res) => {
        if (res.data.success) {
          alert("success!!!");
        } else {
          alert(res.data.error);
        }
      });
      this.refresh();
      await this.reload();
    },
    addAuditorium: async function () {
      let formData = new FormData();
      formData.append("name", this.name);

      await Vue.axios.post("/api/addAuditorium", formData).then((res) => {
        if (res.data.success) {
          alert("success!!!");
        } else {
          alert(res.data.error);
        }
      });
      this.refresh();
      this.reset2();
      await this.reload();
    },
    deleteAuditorium: async function () {
      let formData = new FormData();
      formData.append("id", this.auditoriumForm1.id);

      await Vue.axios.post("/api/deleteAuditorium", formData).then((res) => {
        if (res.data.success) {
          alert("success!!!");
        } else {
          alert(res.data.error);
        }
      });
      this.refresh();
      await this.reload();
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.addMovie();
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    validate2() {
      if (this.$refs.form2.validate()) {
        this.addAuditorium();
      }
    },
    reset2() {
      this.$refs.form2.reset();
    },
    resetValidation2() {
      this.$refs.form2.resetValidation();
    },
    refresh: function () {
      this.movieForm1 = null;
      this.auditoriumForm1 = null;
      this.movieForm2 = null;
      this.movies = [];
      this.linkedMovies = [];
      this.auditoriums = [];
    },
    reload: async function () {
      await Vue.axios.get("/api/getMovies", {}).then((response) =>
        response.data.forEach((movie) => {
          if (movie.auditorium === null) {
            this.movies.push(movie);
          } else {
            movie.link = movie.title.concat("/", movie.auditorium.name);
            this.linkedMovies.push(movie);
          }
        })
      );
      await Vue.axios.get("/api/getAuditoriums", {}).then((response) =>
        response.data.forEach((auditorium) => {
          if (auditorium.movie === null) {
            this.auditoriums.push(auditorium);
          }
        })
      );
    },
  },
  mounted: function () {
    this.reload();
  },
};
</script>
