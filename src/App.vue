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
            <v-btn round dark large color="red lighten-1" @click="reset_data()">Reset
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
      pops: 20,
      cr: 85,
      mr: 1,
      max_gen: 1,
      isloading: false,
      consoleMessage: new Array(),
      generations: new Array(),
      fitness_value: new Array(),
      best_fitness_value: new Array(),
      best_individu: {
        fitnessValue: 0,
        individu: [],
        generation: 0,
        index: 0
      }
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
      var t0 = performance.now();

      this.isloading = true;

      // console.log(this.dummy_data);
      var that = this;
      await api.initialize(this.dummy_data, this.pops).then(chromosome => {
        this.generations.push(chromosome);
        this.add_message(chromosome);
      });

      await api
        .fitness_value(this.generations[0], this.dummy_data.teachers.length)
        .then(fitness_value => {
          this.add_message("Nilai Fitness Generasi Ke - " + 1);
          this.add_message(fitness_value);

          this.fitness_value.push(fitness_value);
        });

      for (let gen = 0; gen < this.max_gen; gen++) {
        var found = false;
        if (!found) {
          var selected_parent = [];
          await api.selection(this.fitness_value[gen]).then(selected => {
            selected_parent = selected;
            this.add_message("Individu Terpilih Generasi Ke - " + (gen + 1));
            this.add_message(selected);
          });

          await api
            .crossover(this.cr, this.generations[gen], selected_parent)
            .then(async crossover_individu => {
              this.add_message("Hasil Crossover Generasi Ke - " + (gen + 1));
              this.add_message(crossover_individu);
              await api
                .mutation(crossover_individu, this.dummy_data, this.mr)
                .then(async mutated => {
                  this.add_message("Hasil Mutasi Generasi Ke - " + (gen + 1));
                  this.add_message(mutated.individu);
                  this.generations.push(mutated.individu);

                  this.add_message(
                    "Nilai Fitness Mutasi Generasi Ke - " + (gen + 1)
                  );
                  this.add_message(mutated.fitness);
                  this.fitness_value.push(mutated.fitness);

                  this.add_message(
                    "Nilai Fitness Terbaik adalah " +
                      Math.max(...mutated.fitness)
                  );

                  if (Math.max(...mutated.fitness) == 1) found = true;
                  // console.log([mutated.individu, mutated.fitness]);
                  console.log(
                    "Fitness terbaik generasi ke - " +
                      (gen + 1) +
                      " =  " +
                      Math.max(...mutated.fitness)
                  );
                  const best = Math.max(...mutated.fitness);
                  this.best_fitness_value.push(best);

                  if (best > this.best_individu.fitnessValue) {
                    this.best_individu = {
                      fitnessValue: best,
                      individu: mutated.individu[mutated.fitness.indexOf(best)],
                      generation: gen,
                      index: mutated.fitness.indexOf(best)
                    };
                  }
                });
            });
        }
      }
      this.isloading = false;
      var t1 = performance.now();
      await api.parsingArr(this.best_individu.individu).then((parsed) => {
        console.log(parsed)
      });
      console.log(
        "Scheduling Process took " + ((t1 - t0) / 1000).toFixed(4) + " seconds."
      );
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
    },
    reset_data() {
      this.consoleMessage = [];
      this.generations = [];
      this.fitness_value = [];
      this.best_fitness_value = [];
      this.best_individu = {};
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


