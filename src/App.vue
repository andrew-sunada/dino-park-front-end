<template>
  <div id="app" :class="['app-container', containerCSS]">
    <FactorBlockTemplate :searchBarConfig="searchBarConfig">
      <RouterLink
        :to="{ name: 'Home' }"
        class="top-bar__link--logo"
        slot="logo"
      >
        <img src="@/assets/images/mozilla.svg" :alt="fluent('mozilla')" />
      </RouterLink>
      <template slot="main">
        <GlobalNotifications class="container" />
        <RouterView class="container" />
      </template>
      <div class="template-nav" slot="nav">
        <RouterLink
          v-if="showAccessGroupNav"
          :to="{ name: indexPageName }"
          class="top-bar__link"
          exact-active-class="top-bar__link--current"
          :title="fluent('access-group-nav-bar')"
        >
          <FactorIcon id="users-outline" :width="24" :height="24" />
        </RouterLink>
        <RouterLink
          v-if="scope.isStaff"
          :to="{ name: 'Orgchart' }"
          class="top-bar__link"
          exact-active-class="top-bar__link--current"
          :title="fluent('orgchart_nav-bar')"
        >
          <title id="org-chart-link-icon-title">{{ fluent('orgchart') }}</title>
          <FactorIcon id="org-chart" :width="24" :height="24" />
        </RouterLink>
      </div>
      <template slot="profile">
        <template v-if="scope.isLoggedIn">
          <ShowMore
            :buttonText="fluent('user-menu_open')"
            :alternateButtonText="fluent('user-menu_close')"
            buttonClass="top-bar__user-menu-toggle"
            :closeWhenClickedOutside="true"
            :buttonTextVisuallyHidden="true"
          >
            <template slot="overflow">
              <UserMenu></UserMenu>
            </template>
            <template slot="button-content">
              <UserPicture
                v-if="scope.isReady"
                :avatar="{
                  picture: user.picture.value,
                  username: user.primaryUsername.value,
                }"
                :size="40"
                :pictureSize="100"
                :showLabel="scope.isStaff"
              ></UserPicture>
              <UserPicture
                v-else
                :size="40"
                :pictureSize="100"
                :showLabel="scope.isStaff"
              ></UserPicture>
            </template>
          </ShowMore>
        </template>
        <ExternalButtonLink
          v-else
          href="/_/login"
          class="top-bar__login"
          iconRight="chevron-right"
          :text="fluent('log_in')"
        ></ExternalButtonLink>
      </template>
      <Footer slot="footer-links"> </Footer>
    </FactorBlockTemplate>
    <!-- <TopBar></TopBar> -->
    <OnboardingModal v-if="showOnboarding"></OnboardingModal>
    <TourTooltip v-if="showTooltipTour" />
  </div>
</template>

<script>
import { FactorBlockTemplate, FactorIcon } from '@mozilla/factor-ui';
import { ACCESS_GROUP_INDEX_PAGE } from '@/router';
import ShowMore from '@/components/_functional/ShowMore.vue';
import UserMenu from '@/components/ui/UserMenu.vue';
import UserPicture from '@/components/ui/UserPicture.vue';
import ExternalButtonLink from '@/components/ui/ExternalButtonLink.vue';
import Footer from '@/components/ui/Footer.vue';
import GlobalNotifications from '@/components/ui/GlobalNotifications.vue';
import OnboardingModal from '@/components/guide/OnboardingModal.vue';
import '@mozilla/factor-ui/dist/lib/factor.css';

export default {
  name: 'PageHome',
  components: {
    ShowMore,
    ExternalButtonLink,
    Footer,
    UserMenu,
    UserPicture,
    FactorIcon,
    GlobalNotifications,
    OnboardingModal,
    FactorBlockTemplate,
  },
  computed: {
    containerCSS() {
      return `${this.$route.meta.key}-container`;
    },
    showOnboarding() {
      return this.$store.state.onboarding.modal;
    },
    searchBarConfig() {
      return {
        handler: this.searchBarHandler,
        label: this.fluent('search_input', 'placeholder'),
        value: this.$route.query.q,
        dropdownEnabled: false,
      };
    },
    showAccessGroupNav() {
      const { isNdaed, isStaff } = this.$store.state.scope;
      return isNdaed || isStaff;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    awaitTabbing() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('focus-styles');
        }
      });
    },
    searchBarHandler(searchQuery, scope) {
      this.$router.push({
        name: 'Search',
        query: {
          query: searchQuery,
          who: scope,
        },
      });
    },
  },
  mounted() {
    this.awaitTabbing();
  },
  data() {
    return {
      indexPageName: ACCESS_GROUP_INDEX_PAGE,
    };
  },
};
</script>

<style>
:root {
  --gray-10: #f9f9fa;
  --gray-20: #ededf0;
  --gray-30: #d7d7db;
  --gray-40: #b1b1b3;
  --gray-50: #737373;
  --gray-60: #4a4a4f;
  --blue-60: #0060df;
  --green-80: #006504;
  --white: #fff;
  --black: #000;
  --light-red: #f5d8e1;
  --neon-red: #ff0039;

  --lightBlue: #f2fcfd;
  --darkBlue: #073072;
  --transparentBlue: rgba(69, 161, 255, 0.54);
  --transparentWhite: rgba(255, 255, 255, 0.54);

  --layerOne: 1;
  --layerTwo: 2;
  --layerThree: 3;
  --layerProfileNav: 4;
  --layerContactMe: 5;
  --layerAboveNav: 6;
  --layerUnderPopover: 7;
  --layerPopover: 8;
  --layerTopBar: 9;
  --layerUserMenu: 10;
  --layerModal: 11;

  --shadowCard: 0 0.25em 0.25em 0 rgba(210, 210, 210, 0.5);
  --focusOutlineShadow: 0px 0 0 1px var(--blue-60),
    0 0 0 3px var(--transparentBlue);

  --imageRadius: 0.25em;
  --formElementRadius: 0.25em;
  --keyRadius: 0.25em;
  --cardRadius: 0.125em;
}

* {
  box-sizing: border-box;
}

html {
  overflow-y: scroll;
}

body {
  background: var(--gray-20);
  font-family: 'Open Sans', sans-serif;
  margin: 0;
  font-size: 87.5%;
  letter-spacing: 0.04em;
  height: 100vh;
  height: -webkit-fill-available;
  min-height: 50em;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
}

h1 {
  font-family: 'Zilla Slab', sans-serif;
  font-weight: 400;
  font-size: 2.5em;
}
@media (min-width: 57.5em) {
  h1 {
    font-size: 3.5em;
  }
}

h2 {
  font-weight: 400;
  font-size: 1.5em;
  margin-bottom: 0.5em;
}

h3 {
  font-weight: 700;
  font-size: 1em;
  color: var(--black);
}

h4,
h5 {
  font-size: 1em;
}

img,
pre,
audio,
video,
section {
  max-width: 100%;
  overflow: auto;
}

hr {
  border: 0;
  height: 1px;
  background-color: var(--gray-30);
  margin: 2em 0;
}

a {
  color: var(--blue-60);
}
a:hover {
  color: var(--black);
}

button {
  cursor: pointer; /* as per issue #50 :'( */
}

abbr {
  text-decoration: none;
}

.container {
  margin-top: 2em;
  padding: 0 1em;
  width: 100%;
}

@media (min-width: 57.5em) {
  .container {
    margin: 2em auto 0 auto;
    max-width: 74em;
  }
}

.app-container {
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  min-height: 100vh;
  min-height: -webkit-fill-available;
}
.app-container > .container {
  flex: 1;
}

.app-container > .container.global-notifications-container {
  flex: 0;
}

.visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
}

/* best only use these classes on their own, and use a
   wrapping container to not interfere with an element's
   existing display value */
@media not screen and (min-width: 57.5em) {
  .hide-mobile {
    display: none;
  }
}
@media (min-width: 57.5em) {
  .hide-desktop {
    display: none;
  }
}

:focus {
  outline: 1px solid transparent;
}
::-moz-focus-inner {
  border: 0;
}
.focus-styles :focus {
  outline: 1px solid transparent;
  box-shadow: var(--focusOutlineShadow);
}
.focus-styles ::-moz-focus-inner {
  border: 0;
}
.focus-styles :focus:not(:focus-visible) /* don't show focus if element didn't gain focus by means of keyboard  */ {
  box-shadow: none;
}

[tabindex='-1']:focus,
.focus-styles [tabindex='-1']:focus {
  outline: none; /* if tabindex is -1, focus was
    set programmatically to something that is usually
    not focused (ie not an interactive element), in
    order to improve reading order in widgets; no
    outline seems sensible as it usually concerns
    large elements that people would not expect to
    have focus. */
  box-shadow: none;
}

.focus {
  font-weight: bold;
}

.actions ul {
  display: grid;
  grid-gap: 1em;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  padding: 0;
  margin: 0;
}
.actions li {
  list-style: none;
}
.actions button {
  display: block;
  width: 100%;
}

.block-template .f-main {
  margin-top: 0;
}

/* Top bar logo styles */

.top-bar__link--logo {
  margin-right: auto;
  margin: 1.6em auto 1.6em 1.6em;
  padding: 0;
  max-width: none; /* don't shrink on small screens */
  border-radius: 0;
}
.top-bar__link--logo img {
  vertical-align: middle;
  width: 103px;
  height: 30px;
}
@media (min-width: 57.5em) {
  .top-bar__link--logo img {
    width: 112px;
    height: 32px;
  }
}

.template-nav {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.template-nav .top-bar__link {
  padding: 0.57em;
  text-transform: uppercase;
  color: var(--black);
  font-weight: 700;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;
  border-radius: var(--imageRadius);
  line-height: 0.75; /* to not add vertical whitespace */
}

.template-nav .top-bar__link:hover {
  background-color: var(--gray-20);
}
.top-bar__user-menu-toggle {
  border: 0;
  background-color: transparent;
  padding: 1.6em;
}
.top-bar__user-menu-toggle:hover {
  background-color: var(--gray-20);
}
.top-bar__user-menu-toggle img {
  border-radius: var(--imageRadius);
}
.top-bar__user-menu-toggle img,
.top-bar__search-toggle svg {
  margin-right: 0;
}
.top-bar__login {
  margin-left: 1em;
  margin-right: 1em;
}
</style>
