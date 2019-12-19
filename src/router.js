import Vue from 'vue';
import Router from 'vue-router';
import PageHome from './pages/PageHome.vue';
import PageProfile from './pages/PageProfile.vue';
import PageOrgchart from './pages/PageOrgchart.vue';
import PageSearchResult from './pages/PageSearchResult.vue';
import PageUnknown from './pages/PageUnknown.vue';
import PageAccessGroup from './pages/PageAccessGroup.vue';
import AccessGroupTerms from './components/access_group/AccessGroupTerms.vue';
import AccessGroupEdit from './components/access_group/AccessGroupEdit.vue';
import AccessGroupView from './components/access_group/AccessGroupView.vue';
import AccessGroupCreate from './components/access_group/AccessGroupCreate.vue';
import scrolling from './assets/js/scrolling';

Vue.use(Router);
export const ACCESS_GROUP_CREATE_PAGE = 'Create Access Group';
export const ACCESS_GROUP_EDIT_PAGE = 'Edit Access Group';
export const ACCESS_GROUP_TOS_PAGE = 'Access Group TOS';
export const ACCESS_GROUP_PAGE = 'Access Group';
export const ACCESS_GROUP_LEAVE_CONFIRMATION_PAGE =
  'Access Group Confirm Leave';

/**
 * We are using the "meta: {key: ''}" field here to denote class name and page.
 * Since we are using the url to hold the state of the page, this is a field to denote which general page we are on
 */
const router = new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
    {
      path: '*',
      name: 'Unknown',
      component: PageUnknown,
      query: {
        message: ':message?',
      },
      meta: { key: 'unknown' },
    },
    {
      path: '/',
      name: 'Home',
      component: PageHome,
      meta: { key: 'home' },
    },
    {
      path: '/p/:username',
      name: 'Profile',
      component: PageProfile,
      props: true,
      meta: { key: 'profile' },
    },
    {
      path: '/e',
      name: 'Edit Profile',
      component: PageProfile,
      query: {
        section: ':section?',
      },
      props: true,
      meta: { key: 'profile' },
    },
    {
      path: '/o/highlight/:username/',
      name: 'OrgchartHighlight',
      component: PageOrgchart,
      props: true,
      meta: { key: 'orgchart' },
    },
    {
      path: '/o/:username?',
      name: 'Orgchart',
      component: PageOrgchart,
      props: true,
      meta: { key: 'orgchart' },
    },
    {
      path: '/s',
      query: {
        query: ':query',
        who: ':who',
      },
      name: 'Search',
      component: PageSearchResult,
      props: true,
      meta: { key: 'search' },
    },
    {
      path: '/a/create',
      name: ACCESS_GROUP_CREATE_PAGE,
      component: AccessGroupCreate,
      props: true,
      meta: { key: 'access-group' },
    },
    {
      path: '/a/:groupname',
      component: PageAccessGroup,
      props: true,
      children: [
        {
          path: '',
          name: ACCESS_GROUP_PAGE,
          component: AccessGroupView,
          props: true,
          meta: { key: 'access-group' },
        },
        {
          path: 'edit',
          name: ACCESS_GROUP_EDIT_PAGE,
          component: AccessGroupEdit,
          query: {
            section: ':section?',
          },
          props: true,
          meta: { key: 'access-group' },
        },
        {
          path: 'tos',
          name: ACCESS_GROUP_TOS_PAGE,
          component: AccessGroupTerms,
          query: {
            accept: ':accept?',
          },
          props: true,
          meta: { key: 'access-group' },
        },
        {
          path: 'leave',
          name: ACCESS_GROUP_LEAVE_CONFIRMATION_PAGE,
          component: AccessGroupView,
          props: true,
          meta: { key: 'access-group', leave: true },
        },
      ],
    },
  ],
  scrollBehavior(to, from) {
    if (to.hash) {
      return { selector: to.hash };
    }
    if (
      scrolling.toEdit(to) ||
      scrolling.fromEditToSelf(to, from, router.app)
    ) {
      return { selector: `#nav-${to.query.section}` };
    }
    if (scrolling.toProfile(to, from)) {
      return { x: 0, y: 0 };
    }
    return {};
  },
});

function usernamePrefix(username) {
  if (username && !username.startsWith('r--')) {
    return `${username} - `;
  }
  return '';
}

router.beforeEach((to, from, next) => {
  switch (to.name) {
    case 'OrgchartHighlight':
      document.title = `${usernamePrefix(
        to.params.username
      )}Org chart - Mozilla People Directory`;
      break;
    case 'Orgchart':
      document.title = 'Org chart - Mozilla People Directory';
      break;
    case 'Profile':
      document.title = `${usernamePrefix(
        to.params.username
      )}Profile - Mozilla People Directory`;
      break;
    case 'Edit Profile':
      document.title = `Edit - Profile - Mozilla People Directory`;
      break;
    case ACCESS_GROUP_TOS_PAGE:
      document.title =
        'Access Group Terms of Service - Mozilla People Directory';
      break;
    default:
      document.title = `${to.name} - Mozilla People Directory`;
  }
  next();
});

export default router;
