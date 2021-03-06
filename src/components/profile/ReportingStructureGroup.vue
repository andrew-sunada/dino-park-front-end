<template>
  <div
    v-if="this.collection.length > 0 || this.person !== null"
    :class="{
      'reporting-structure__container': true,
      'reporting-structure__peers': true,
      'has-more': hasMoreToView,
    }"
  >
    <h3>{{ this.heading }}</h3>
    <div class="reporting-structure__content" v-if="this.isSingle">
      <Person class="person--borderless" v-bind="this.person" />
    </div>
    <div class="reporting-structure__content" v-else>
      <Person
        v-for="(item, index) in this.collection.slice(0, this.initiallyShown)"
        :class="viewClasses"
        :key="`item-${index}`"
        v-bind="item"
      />
      <ShowMore
        v-if="this.collection.length > this.initiallyShown"
        :buttonText="fluent('more')"
        :alternateButtonText="fluent('less')"
        class="reporting-structure__show-more"
        buttonClass="button button--text-only button--less-padding reporting-structure__show-more-button"
        :closeOnUpdate="true"
        :updateIndicator="$route.params.username"
        :transition="true"
      >
        <template slot="overflow">
          <Person
            v-for="(item, index) in this.collection.slice(this.initiallyShown)"
            :class="viewClasses"
            :key="`item-${index}`"
            v-bind="item"
          />
        </template>
        <template slot="icon-expanded">
          <Icon id="chevron-up" :width="24" :height="24" />
        </template>
        <template slot="icon-collapsed">
          <Icon id="chevron-down" :width="24" :height="24" />
        </template>
      </ShowMore>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/ui/Icon.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import Person from '@/components/ui/Person.vue';
import ShowMore from '@/components/_functional/ShowMore.vue';

export default {
  name: 'ReportingStructureGroup',
  props: {
    collection: {
      type: Array,
      default: () => [],
    },
    person: {
      type: Object,
      default: () => null,
    },
    collectionName: {
      type: String,
      default: '',
    },
    viewAs: {
      type: String,
      default: 'list',
    },
    isSingle: {
      type: Boolean,
      default: false,
    },
    heading: String,
  },
  components: {
    Icon,
    LoadingSpinner,
    Person,
    ShowMore,
  },
  computed: {
    viewClasses() {
      return this.collection.length > 1 && this.viewAs === 'grid'
        ? 'person--borderless person--avatar-only'
        : 'person--borderless';
    },
    initiallyShown() {
      return this.viewAs === 'grid' ? undefined : 8;
    },
    hasMoreToView() {
      return !this.isSingle && this.collection.length > this.initiallyShown;
    },
  },
};
</script>

<style>
.reporting-structure__container {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--gray-30);
  padding-top: 1.5em;
  padding-bottom: 1.5em;
}

.reporting-structure h3 {
  font-weight: 400;
  margin: 1.5em 0 1em 1.5em;
  padding: 0;
  width: 6em;
  min-width: 6em;
}
.reporting-structure__content {
  min-width: 0;
  margin-left: 1.5em;
  padding-right: 1.5em;
}

.reporting-structure__container:first-child {
  border-top: none;
  padding-top: 0;
}

.reporting-structure__container.has-more {
  padding-bottom: 0;
}

@media (min-width: 50em) {
  .reporting-structure__container {
    display: grid;
    grid-gap: 2em;
    grid-template-columns: 6em 1fr;
  }
}
.reporting-structure__show-more {
  max-width: 37.5em;
}
.reporting-structure__show-more-button {
  margin: 1em auto 0.5em auto;
  font-size: 1em;
  color: var(--gray-50);
}
</style>
