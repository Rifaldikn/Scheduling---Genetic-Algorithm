import Vue from "vue";
import Vuex from "vuex";
import dummy_data from "../data/data.json";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    data: dummy_data,
    consoleMessage: [],
    generations: [],
    fitness_values: []
  },
  getters: {
    consoleMessage: state => state.consoleMessage,
    data: state => state.data,
    generations: state => state.generations,
    fitness_values: state => state.fitness_values
  },
  mutations: {
    ADD_MESSAGE(state, msg) {
      state.consoleMessage.push(msg);
    },
    ADD_GENERATION(state, population) {
      state.generations.push(population);
    },
    RESET_DATA(state) {
      state.consoleMessage = [];
      state.generations = [];
      state.fitness_values = [];
    },
    ADD_FITNESS_VALUE(state, fitness) {
      state.fitness_values.push(fitness);
    }
  },
  actions: {
    add_message({ commit }, msg) {
      // console.log("Ini action add_message, payload: ", msg[0].length);
      var arr = [];
      if (msg[0].length > 30) {
        msg.forEach(element => {
          arr = element.slice(0, 30);
          arr.push(`...and ${element.length - 30} more`);
          commit("ADD_MESSAGE", arr);
        });
      } else {
        arr = msg;
        commit("ADD_MESSAGE", arr);
      }
    },
    add_generation({ dispatch, commit }, payload) {
      dispatch("add_message", payload);
      commit("ADD_GENERATION", payload);
    },
    add_fitness_value({ dispatch, commit }, payload) {
      for (var i = 0; i < payload.length; i++) {
        var msg = `Individu ${i + 1} : ${payload[i].toFixed(7)}`;
        dispatch("add_message", msg);
      }
      commit("ADD_FITNESS_VALUE", payload);
    },
    reset_data({ commit }) {
      commit("RESET_DATA");
    }
  }
});
