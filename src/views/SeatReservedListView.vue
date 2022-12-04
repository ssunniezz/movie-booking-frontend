<template>
  <div class="MySeatList">
    <template>
      <v-app-bar color="#2979FF" dense dark>
        <v-btn text class="ml-2" to="/MySeatList">
          <v-icon>mdi-seat</v-icon>
          <h3>Seat Reservation's {{ $store.state.name }}</h3>
        </v-btn>
        <v-btn text class="ml-2" to="/movie"> Movies</v-btn>
        <!-- Contact Us might be add later which link to contact page-->
        <v-btn text class="ml-2" v-on:click="contactUS">Contact Us</v-btn>
        <v-spacer></v-spacer>
        {{ new Date().getHours() }}:{{ new Date().getMinutes() }}:{{
          new Date().getSeconds()
        }}
        —
        <strong></strong>
        <v-badge bordered bottom color="green" dot offset-x="10" offset-y="10">
          <v-avatar size="40" class="justify-content-end float-right">
            <v-img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
            ></v-img>
          </v-avatar>
        </v-badge>
        <!-- Logout might be add later which make it logout and redirect to homepage-->
        <v-btn text class="ml-2" v-on:click="Logout"
          ><v-icon>mdi-logout</v-icon></v-btn
        >
      </v-app-bar>
      <v-list v-for="movieList in myMovieList" :key="movieList">
        <v-list-item v-for="usr in movieList.user" :key="usr">
          <h1 v-if="$store.state.name === usr">
            <v-list-item-content>
              <v-list-item-title
                >{{ movieList.id }} {{ movieList.screeningId }}
                {{ movieList.username }}
                {{ movieList.auditoriums.movie }}</v-list-item-title
              >
            </v-list-item-content>
          </h1>
        </v-list-item>
      </v-list>
      <!-- This probably change to something else this is example to test footer and button link -->
      <v-footer app bottom fixed padless color="#2979FF" dense>
        <v-btn
          text
          class="ml-2"
          href="https://music.youtube.com/watch?v=lYBUbBu4W08&feature=share"
        >
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </v-footer>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      myMovieList: [],
    };
  },
  methods: {
    async show() {
      await Vue.axios.get("/api/getSeatReserved", {}).then((response) =>
        response.data.forEach((SeatReserved) => {
          if (SeatReserved.id !== null) {
            this.myMovieList.push(SeatReserved);
          }
        })
      );
    },
    contactUS: function () {
      alert("This is mock up contactUS button");
    },
    Logout: function () {
      alert("This is mock up Logout button");
    },
  },
  mounted: function () {
    this.show();
  },
};
</script>
