import { client } from '@/server.js';
import { DISPLAY_PROFILE } from '@/queries/profile';
import { ProfileViewModel } from '@/view_models/ProfileViewModel.js';

export const profileState = {
  profile: null,
  loaded: false,
};
export const profileActions = {
  async fetchProfile({ commit, dispatch }) {
    // This is redundant to fetchUser in store/index.js.
    // Right now this will always retrieve from cache and error handing is done
    // in store/index.js gracefully.
    const { data } = await client.query({
      query: DISPLAY_PROFILE,
      variables: { username: null },
    });
    dispatch('scopeV2/set', data.profile, { root: true });
    commit('setProfile', data.profile);
  },
};
export const profileMutations = {
  setProfile(state, user) {
    state.loaded = true;
    try {
      state.profile = new ProfileViewModel(user);
    } catch (e) {
      state.error = e.message;
      throw new Error(e.message);
    }
  },
};
export const profileGetters = {
  getProfile: ({ profile }) => profile,
  getLoaded: ({ loaded }) => loaded,
};
