import axios from 'axios';

async function get_home_page() {
    let { data } = await axios.get(`${process.env.baseUrl}/api/playlist/top_playlists`);
    return data.top_playlists;
}

export const state = () => ({
    top_playlists: [{
        id: "trneding",
        name: "Treding",
        items: []
    }]
})

export const mutations = {
    update_top_playlists(state, payload) {
        state.top_playlists[0].items = payload
    }
}

export const actions = {
    async init({ commit }, payload) {
        var home_page_data = await get_home_page();
        commit('update_top_playlists', home_page_data);
    }
}
