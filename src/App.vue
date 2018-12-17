<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-layout mb-2 column>
          <v-layout justify-center>
            <h1>PROGRAM PENJADWALAN MATAPELAJARAN DENGAN MENGGUNAKAN ALGORITMA GENETIKA</h1>
          </v-layout>
          <br>
          <v-layout fill-height>
            <v-flex xs1>
              <v-text-field label="Populations" v-model="pops"></v-text-field>
            </v-flex>
            <v-flex xs1 ml-5>
              <v-text-field label="Crossover Rate" v-model="cr"></v-text-field>
            </v-flex>
            <v-flex xs1 ml-5>
              <v-text-field label="Mutation Rate" v-model="mr"></v-text-field>
            </v-flex>
            <v-flex xs1 ml-5>
              <v-text-field label="Maximum Generation" v-model="max_gen"></v-text-field>
            </v-flex>
            <v-btn @click="startProcess" round dark large color="#9575CD">Start Scheduling
              <v-icon>slideshow</v-icon>
            </v-btn>
            <v-btn @click="reset" round dark large color="red lighten-1">Reset
              <v-icon>cancel</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <h3>Algorithm Process :</h3>
            <v-progress-linear :indeterminate="isloading" color="#9575CD"></v-progress-linear>
            <v-container
              xs12
              fluid
              style="height: 300px"
              class="grey darken-4 scroll-y"
            >
              <div class="consoleLine">
                <v-layout column>
                  <v-flex class="grey--text">
                    <ul v-if="consoleMessage.length">
                      <ol>
                        <li v-for="(msg, index) in consoleMessage">{{msg}}</li>
                      </ol>
                    </ul>
                  </v-flex>
                </v-layout>
              </div>
            </v-container>
          </v-flex>
          <v-flex>
            <timeTable></timeTable>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer class="pa-3">
      <v-layout align-center justify-center>Coded by Rifaldi Kusnawan &copy; 2018</v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import api from "./api";
import { mapGetters } from "vuex";
import timeTable from "./components/timeTable.vue";

export default {
  name: "App",
  data: () => {
    return {
      pops: 0,
      cr: 0,
      mr: 0,
      max_gen: 1,
      isloading: false
    };
  },
  components: {
    timeTable
  },
  computed: {
    ...mapGetters(["generations", "consoleMessage", "data"])
  },
  methods: {
    startProcess() {
      this.isloading = true;
      var that = this;
      setTimeout(function() {
        that.startScheduling();
      }, 500);
    },
    async startScheduling() {
      await api.initialize(this.data, this.pops).then(chromosome => {
        this.$store.dispatch("add_message", "Tahap Inisialisasi Populasi Awal");
        // .then(() => {
        // console.log("Ini chromosome", chromosome);
        this.$store.dispatch("add_generation", chromosome);
        // });
      });

      for (var gen = 0; gen < this.max_gen; gen++) {
        // console.log("Ini Generasi", this.generations);
        // console.log(this.data.teachers.length);
        await api
          .fitness_value(this.generations[gen], this.data.teachers.length)
          .then(fitness_value => {
            this.$store.dispatch(
              "add_message",
              "Nilai Fitness Generasi Ke - " + (gen + 1)
            );
            this.$store.dispatch("add_fitness_value", fitness_value);
          });
      }
      this.isloading = false;
    },
    reset() {
      this.$store.dispatch("reset_data");
    }
  }
};
</script>

<style>
.logNumber {
  max-width: 30px;
  min-width: 30px;
}
.consoleLine {
  border: 1 solid whitesmoke;
}
.console {
  border: 2px solid #42b983;
  border-radius: 3px;
}
</style>


