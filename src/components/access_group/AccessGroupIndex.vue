<template>
  <section class="group-index-container">
    <main class="group-index">
      <section class="summary-area">
        <h1 class="access-group__header">{{ fluent('access-group_list') }}</h1>
        <div class="summary-area__bottom">
          <p class="summary-area__summary">
            {{ fluent('access-group_list', 'summary-area__summary--1') }}
            <br />
            {{ fluent('access-group_list', 'summary-area__summary--2') }}
            <ExternalLink href="/#help">
              {{ fluent('access-group_list', 'summary-area__summary--3') }}
            </ExternalLink>
            {{ fluent('access-group_list', 'summary-area__summary--4') }}
          </p>
          <RouterLink
            class="button summary-area__action"
            v-if="canCreateGroup"
            :to="{
              name: 'Create Access Group',
            }"
          >
            <Icon id="plus" :width="24" :height="24" />
            {{ fluent('access-group_list', 'summary-area__action') }}
          </RouterLink>
        </div>
      </section>
      <AccessGroupList />
    </main>
  </section>
</template>

<script>
import store, { fetchAccessGroups, resolvePromisesSerially } from '@/store';
import ExternalLink from '@/components/ui/ExternalLink.vue';
import Icon from '@/components/ui/Icon.vue';
import Button from '@/components/ui/Button.vue';
import EditButton from '@/components/ui/EditButton.vue';
import LinksMixin from '@/components/_mixins/LinksMixin.vue';
import PanelSection from '@/components/ui/PanelSection.vue';
import AccessGroupList from '@/components/access_group/AccessGroupList.vue';

export default {
  name: 'AccessGroupIndex',
  mixins: [LinksMixin],
  components: {
    Icon,
    ExternalLink,
    Button,
    EditButton,
    PanelSection,
    AccessGroupList,
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch('setLoading');
    const [agPromises, agResolvers] = fetchAccessGroups(store);
    resolvePromisesSerially([...agPromises], [...agResolvers]).then(() => {
      store.dispatch('completeLoading');
      next();
    });
  },
  computed: {
    canCreateGroup() {
      return this.$store.state.scope.isGroupCreator;
    },
  },
};
</script>

<style>
.group-index-container {
  overflow: visible;
}
.group-index {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.group-index .access-group__header {
  margin-bottom: 0.5em;
}

.group-index .summary-area {
  padding: 1.5em;
}

.summary-area .summary-area__bottom {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

@media (min-width: 57.5em) {
  .group-index {
    padding: 1.5em;
  }

  .group-index .summary-area {
    padding: 0;
    margin-bottom: 3em;
  }

  .group-index .summary-area .summary-area__summary {
    margin-bottom: 0;
  }

  .group-index .summary-area .summary-area__bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.summary-area .summary-area__action {
  background: transparent;
  color: var(--blue-60);
  border-color: var(--blue-60);
  display: flex;
  margin: 1em 0;
}
</style>
