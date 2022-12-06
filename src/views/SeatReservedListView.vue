<template>
  <div class="text-left justify-center align-center mx-5">
    <h1 class="text-center">
      <br />
      {{ $store.state.name.toString().toUpperCase() }}'s Reservations
    </h1>
    <h4 class="text-center mt-n4">
      <br />
      Contact Us If cancel is needed
    </h4>
    <v-simple-table class="text-left mt-4">
      <template v-slot:default>
        <thead>
          <tr>
            <th width="150" class="grey lighten-3"></th>
            <th height="50" class="text-center grey lighten-3">Movie</th>
            <th class="text-center grey lighten-3">Auditorium</th>
            <th class="text-center grey lighten-3">Show Time</th>
            <th class="text-center grey lighten-3">Seats</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(auditorium, index) in auditoriums" :key="auditorium">
            <td class="grey lighten-5">
              <v-img
                width="150"
                height="250"
                :src="auditorium.movie.picUrl"
              ></v-img>
            </td>
            <td class="text-center grey lighten-5">
              {{ auditorium.movie.title.toUpperCase() }}
            </td>
            <td class="text-center grey lighten-5">
              {{ auditorium.name.toUpperCase() }}
            </td>
            <td class="text-center grey lighten-5">
              {{ mySeatList[index].screening.start.toString().concat(":00") }}
            </td>
            <td class="text-center grey lighten-5">
              {{ mySeatList[index].seats.toString() }}
            </td>
          </tr>
        </tbody></template
      >
    </v-simple-table>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      auditoriums: [],
      mySeatList: [],
    };
  },
  computed: {
    movieArray() {
      return this.auditoriums;
    },
  },
  methods: {
    getSeats: async function () {
      let formData = new FormData();
      formData.append("username", this.$store.state.username);

      await Vue.axios
        .post("/api/getMySeatsListByUsername", formData)
        .then((response) => {
          let temp = [];
          let screening = null;
          const sortAlphaNum = (a, b) =>
            a.localeCompare(b, "en", { numeric: true });

          response.data.forEach((seat) => {
            // response are come sorted by screeningId, just group up seats in the same screening
            if (screening === null || typeof seat.screening === "object") {
              if (temp.length !== 0) {
                this.mySeatList.push({
                  screening: screening,
                  seats: temp.sort(sortAlphaNum),
                });
                temp = [];
              }
              screening = seat.screening;
            }
            temp.push(seat.seat.row.toString().concat(seat.seat.number));
          });

          // push the last screening
          this.mySeatList.push({
            screening: screening,
            seats: temp.sort(sortAlphaNum),
          });
        });
    },
    getAuditoriums: async function () {
      let auditoriums = [];
      for (const grouped of this.mySeatList) {
        let formData = new FormData();

        formData.append("id", grouped.screening.id);
        await Vue.axios
          .post("/api/getAuditoriumByScreeningId", formData)
          .then((res) => {
            this.auditoriums.push(res.data);
            auditoriums.push(res.data);
          });
      }
      console.log(auditoriums);
    },
  },
  mounted: async function () {
    await this.getSeats();
    await this.getAuditoriums();
  },
};
</script>
