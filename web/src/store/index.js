import { createStore } from 'vuex';
import { io } from 'socket.io-client';
import rpc from '@/api/rpc';

/*
* Manages application state
*/
const store = createStore({
  state() {
    return {
      gettingContainers: false,
      containers: [],
    };
  },
  getters: {
    sortedContainers(state) {
      return state.containers.slice().sort((a, b) => {
        const aName = a.serverName || a.name;
        const bName = b.serverName || b.name;
        if (aName < bName) {
          return -1;
        }
        return aName > bName ? 1 : 0;
      });
    },
  },
  mutations: {
    setGettingContainers(state, gettingContainers) {
      state.gettingContainers = gettingContainers;
    },
    setContainers(state, containers) {
      state.containers = containers;
    },
    updateContainer(state, container) {
      state.containers = state.containers.map((c) => (c.id === container.id ? container : c));
    },
  },
  actions: {
    getContainers(context) {
      context.commit('setGettingContainers', true);
      return rpc('containers.list')
        .then((containers) => {
          context.commit('setContainers', containers);
        })
        .finally(() => {
          context.commit('setGettingContainers', false);
        });
    },
    updateContainers(context, containers) {
      context.commit('setContainers', containers);
    },
    updateContainer(context, container) {
      context.commit('updateContainer', container);
    },
  },
});

/*
* Use socket.io to handle updates pushed from the server
*/
const socket = io();

socket.on('containersUpdated', (data) => {
  store.dispatch('updateContainers', data.containers);
});

socket.on('containerChanged', (data) => {
  store.dispatch('updateContainer', data.container);
});

export default store;
