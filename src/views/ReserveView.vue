<template>
  <div class="reserve">
    <template>
      <v-card color="basil">
        <v-card-title class="text-center justify-center py-6">
          <h1 class="font-weight-bold text-h2 basil--text">{{ movie }}</h1>
        </v-card-title>

        <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
          <v-tab
            @click="getReservedSeats(index)"
            v-for="(time, index) in times"
            :key="time"
          >
            {{ time }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item v-for="time in times" :key="time">
            <template>
              <v-container fluid fill-height class="mx-0 basil">
                <v-row align="center" justify="center">
                  <v-col
                    cols="5 mt-3 mb-5"
                    class="text-center justify-center screen"
                    >Screen</v-col
                  >
                </v-row>
                <v-row
                  align="center"
                  justify="center"
                  v-for="(r, i) in row"
                  :key="r"
                >
                  <v-col cols="1" class="basil--text">{{ r }}</v-col>
                  <v-col cols="1" v-for="(c, j) in col" :key="c">
                    <v-icon v-if="loaded" :color="seatColor[(4 - i) * 6 + j]">
                      mdi-seat
                    </v-icon>
                  </v-col>
                </v-row>
                <v-row align="center" justify="center">
                  <v-col cols="1"></v-col>
                  <v-col cols="1" v-for="c in col" :key="c" class="basil--text">
                    {{ c }}
                  </v-col>
                </v-row>
                <v-row align="center" justify="center">
                  <v-col cols="2">
                    <v-subheader>Available Seats</v-subheader>
                  </v-col>

                  <v-col cols="4">
                    <v-select
                      v-model="selectedSeat"
                      :items="availableSeats"
                      :value="availableSeats"
                      item-text="name"
                      label="Select Available Seat"
                      prepend-icon="mdi-seat"
                      no-data-text="No Seat Available"
                      return-object
                      persistent-hint
                      single-line
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row align="center" justify="center">
                  <v-col cols="1">
                    <v-btn
                      depressed
                      :disabled="selectedSeat === null"
                      color="primary"
                      @click="reserveSeat()"
                    >
                      Reserve
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row align="center" justify="center" v-if="admin">
                  <v-col cols="2">
                    <v-subheader>Reserved Seats</v-subheader>
                  </v-col>

                  <v-col cols="4">
                    <v-select
                      v-model="cancelSelectedSeat"
                      :items="seatsReserved"
                      :value="seatsReserved"
                      item-text="name"
                      label="Select Reserved Seat"
                      prepend-icon="mdi-seat"
                      no-data-text="No Seat Reserved"
                      return-object
                      persistent-hint
                      single-line
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row align="center" justify="center" v-if="admin">
                  <v-col cols="1" class="ml-n8">
                    <v-btn
                      depressed
                      :disabled="cancelSelectedSeat === null"
                      color="warning"
                      @click="cancelSeat()"
                    >
                      Cancel Seat
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="1" class="ml-n16">
                    <v-btn
                      depressed
                      v-if="admin"
                      :disabled="seatsReserved.length === 0"
                      color="error"
                      @click="clearReservedSeats()"
                    >
                      Clear all seats
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </template>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  data() {
    return {
      // Auditorium info
      movie: "",
      startSeatId: "",
      endSeatId: "",
      allSeats: [],
      screeningIds: [],
      row: ["A", "B", "C", "D", "E"],
      col: ["1", "2", "3", "4", "5", "6"],

      // Screening info
      tab: 0,
      index: 0,
      times: [],
      screeningId: "",
      seatsReserved: [],
      availableSeats: [],

      // Reservation info
      selectedSeat: null,
      cancelSelectedSeat: null,

      // Rendering helper
      seatColor: [],
      loaded: false,
      admin: true,
    };
  },
  async mounted() {
    this.row = ["A", "B", "C", "D", "E"];
    this.col = ["1", "2", "3", "4", "5", "6"];
    await this.getAuditoriumInfo();
    await this.fillSeats();
    await this.getReservedSeats(0);
  },
  methods: {
    fillSeats: async function () {
      for (let i = 0; i < this.row.length; i++) {
        for (let j = 0; j < this.col.length; j++) {
          this.allSeats.push({
            name: this.row[i].concat(this.col[j]),
            id: Number(this.startSeatId) + j + i * this.col.length,
          });
        }
      }
      // for rendering purpose
      this.row.reverse();
    },
    getReservedSeats: async function (index) {
      this.seatsReserved = [];
      this.availableSeats = [];
      this.seatColor = [];
      this.loaded = false;
      this.selectedSeat = null;
      this.cancelSelectedSeat = null;
      this.screeningId = this.screeningIds[index];
      this.index = index;

      let formData = new FormData();
      formData.append("screeningId", this.screeningId);

      await Vue.axios.post("/api/getReservedSeats", formData).then((res) => {
        let index = 0;
        res.data.forEach((seatReserved) => {
          while (seatReserved.seat.id !== index + Number(this.startSeatId)) {
            this.seatColor.push("red");
            this.availableSeats.push(this.allSeats[index++]);
          }
          this.seatColor.push("grey");
          this.seatsReserved.push({
            name: seatReserved.seat.row
              .toString()
              .concat(seatReserved.seat.number.toString()),
            id: seatReserved.seat.id,
          });
          index++;
        });
        while (index < 30) {
          this.seatColor.push("red");
          this.availableSeats.push(this.allSeats[index++]);
        }
        this.loaded = true;
      });
    },
    getAuditoriumInfo: async function () {
      let formData = new FormData();
      formData.append("id", this.$route.params.auditoriumId);

      await Vue.axios.post("/api/getAuditoriumById", formData).then((res) => {
        this.movie = res.data.movie.title.toUpperCase();
        this.startSeatId = res.data.startSeatId;
        this.endSeatId = res.data.endSeatId;

        res.data.movie.auditorium.screenings.forEach((screen) => {
          this.times.push(screen.start.toString().concat(":00"));
          this.screeningIds.push(screen.id);
        });
      });
    },
    reserveSeat: async function () {
      let formData = new FormData();
      formData.append("screeningId", this.screeningId);
      formData.append("username", this.$store.state.username);
      formData.append("seatId", this.selectedSeat.id);

      await Vue.axios.post("/api/reserveSeat", formData).then((res) => {
        if (res.data.success) {
          alert("success!!!");
        } else {
          alert(res.data.error);
        }
      });
      // update seats
      await this.getReservedSeats(this.index);
    },
    cancelSeat: async function () {
      let formData = new FormData();
      formData.append("screeningId", this.screeningId);
      formData.append("seatId", this.cancelSelectedSeat.id);

      await Vue.axios.post("/api/cancelReservedSeat", formData).then((res) => {
        if (res.data.success) {
          alert("success!!!");
        } else {
          alert(res.data.error);
        }
      });
      // update seats
      await this.getReservedSeats(this.index);
    },
    clearReservedSeats: async function () {
      let formData = new FormData();
      formData.append("screeningId", this.screeningId);

      await Vue.axios.post("/api/clearReservedSeats", formData).then((res) => {
        if (res.data.success) {
          alert("success!!!");
        } else {
          alert(res.data.error);
        }
      });
      await this.getReservedSeats(this.index);
    },
  },
};
</script>

<style>
/* Helper classes */
.basil {
  background-color: whitesmoke !important;
}

.screen {
  background-color: white;
}

.basil--text {
  color: royalblue !important;
}
</style>
