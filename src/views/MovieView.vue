<template>
  <div class="movie">
    <template>
      <v-sheet
        class="mx-auto mt-16"
        elevation="8"
        max-width="1600"
        height="530"
      >
        <v-footer padless>
          <v-col class="text-center" cols="12">
            NOW SHOWING — <strong>SSC MOVIES</strong>
          </v-col>
        </v-footer>
        <v-row>
          <v-slide-group class="pa-4" center-active show-arrows>
            <v-slide-item
              v-for="auditorium in auditoriums"
              :key="auditorium.id"
              v-slot="{ active }"
            >
              <v-card
                :color="active ? 'primary' : 'grey lighten-1'"
                class="ma-4"
                height="400"
                width="250"
                @click="$router.push(`/reserve/${auditorium.id}`)"
              >
                <v-img
                  class="fill-height"
                  :src="auditorium.movie.picUrl"
                ></v-img>
                <div
                  class="text-center"
                  style="position: absolute; bottom: -15px"
                >
                  <v-bottom-sheet inset>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        rounded
                        dark
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ auditorium.movie.title }}
                      </v-btn>
                    </template>
                    <v-sheet class="text-center" height="500px">
                      <template>
                        <v-row class="justify-center">
                          <v-col cols="4">
                            <v-img
                              height="450"
                              width="300"
                              :src="auditorium.movie.picUrl"
                            ></v-img>
                          </v-col>
                          <v-col cols="4">
                            <v-simple-table>
                              <template v-slot:default>
                                <thead>
                                  <tr>
                                    <th class="text-center">Section</th>
                                    <th class="text-center">Detail</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Title :</td>
                                    <td>{{ auditorium.movie.title }}</td>
                                  </tr>
                                  <tr>
                                    <td>Director :</td>
                                    <td>{{ auditorium.movie.director }}</td>
                                  </tr>
                                  <tr>
                                    <td>Description :</td>
                                    <td>{{ auditorium.movie.description }}</td>
                                  </tr>
                                  <tr>
                                    <td>Duration :</td>
                                    <td>{{ auditorium.movie.duration }} min</td>
                                  </tr>
                                  <tr>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                          </v-col>
                        </v-row>
                      </template>
                    </v-sheet>
                  </v-bottom-sheet>
                </div>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </v-row>
        <v-row> </v-row>
      </v-sheet>
    </template>
  </div>
</template>
<script>
import Vue from "vue";
export default {
  data() {
    return {
      auditoriums: [],
    };
  },
  methods: {
    async show() {
      await Vue.axios.get("/api/getAuditoriums", {}).then((response) =>
        response.data.forEach((auditorium) => {
          if (auditorium.movie !== null) {
            this.auditoriums.push(auditorium);
          }
        })
      );
    },
  },
  mounted: function () {
    this.show();
  },
};
</script>
