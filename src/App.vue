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
            <v-btn @click="start_scheduling" round dark large color="#9575CD">Start Scheduling
              <v-icon>slideshow</v-icon>
            </v-btn>
            <v-btn round dark large color="red lighten-1">Reset
              <v-icon>cancel</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <h3>Algorithm Process :</h3>
            <v-progress-linear :indeterminate="isloading" color="#9575CD"></v-progress-linear>
            <v-container xs12 fluid style="height: 300px" class="grey darken-4 scroll-y">
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
import json from "./data/data.json";
import api from "./api";
import timeTable from "./components/timeTable.vue";

export default {
  name: "App",
  data: () => {
    return {
      pops: 0,
      cr: 85,
      mr: 0,
      max_gen: 1,
      isloading: false,
      consoleMessage: new Array(),
      generations: new Array(),
      fitness_value: new Array()
    };
  },
  components: {
    timeTable
  },
  computed: {
    dummy_data: function() {
      return json;
    }
  },
  methods: {
    async start_scheduling() {
      this.isloading = true;
      // console.log(this.dummy_data);
      var that = this;
      await api.initialize(this.dummy_data, this.pops).then(chromosome => {
        // console.log("Inside Initialize Function", chromosome)
        this.generations.push(chromosome);
        this.add_message(chromosome);
      });
      // console.log("generasi", this.generations);
      for (let gen = 0; gen < this.max_gen; gen++) {
        //   var individu = this.generations[gen];
        // console.log(this.generations[gen]);
        await api
          .fitness_value(this.generations[gen], this.dummy_data.teachers.length)
          .then(fitness_value => {
            this.add_message("Nilai Fitness Generasi Ke - " + (gen + 1));
            this.add_message(fitness_value);

            this.fitness_value.push(fitness_value);
            // console.log("generasi", this.generations);
          });
        var selected_parent = [];
        await api.selection(this.fitness_value[gen]).then(selected => {
          selected_parent = selected;
        });

        await api
          .crossover(this.cr, this.generations[gen], selected_parent)
          .then(new_generation => {
            // console.log([this.generations[gen], new_generation]);
          });
        // });
      }
      this.isloading = false;
    },
    add_message(msg) {
      var arr = [];
      if (msg[0].length > 30) {
        msg.forEach(element => {
          arr = element.slice(0, 30);
          arr.push(`...and ${element.length - 30} more`);
          this.consoleMessage.push(arr);
        });
      } else {
        arr = msg;
        this.consoleMessage.push(arr);
      }
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


