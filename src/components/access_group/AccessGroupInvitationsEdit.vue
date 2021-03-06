<template>
  <section class="edit-invitations-container">
    <AccessGroupEditPanel
      :title="`${fluent(
        'access-group_pending-invitations',
      )} (${totalInvitationsAndRequests})`"
      :full="true"
    >
      <template v-slot:content>
        <AccessGroupMembersTable
          :data="groupInvitations"
          :columns="invitationColumns"
          :totalRows="groupInvitations.length"
          :showHeaders="false"
        >
          <div slot="row-confirm" slot-scope="{ member }">
            <p class="leave-confirm__description">
              {{ fluent('access-group_members', 'remove-confirm') }}
            </p>
            <Button
              class="primary-button"
              @click="handleRemoveConfirmClick(member)"
              >{{ fluent('access-group_members', 'remove-action') }}</Button
            >
            <Button
              class="secondary-button"
              @click="handleCancelClick(member)"
              >{{ fluent('access-group_members', 'remove-cancel') }}</Button
            >
          </div>
          <div
            slot="row-actions"
            slot-scope="{ member }"
            class="pending-invitations-container__actions"
          >
            <Button
              class="tertiary-action delete"
              @click="handleRemoveClicked(member)"
            >
              <Icon id="x" :width="16" :height="16" />
            </Button>
          </div>
        </AccessGroupMembersTable>
        <hr />
        <AccessGroupMembersTable
          :data="groupRequests"
          :columns="requestColumns"
          :totalRows="groupRequests.length"
          :rowHasExpandedContent="() => true"
          :showHeaders="false"
        >
          <div
            slot="row-expandable-content"
            slot-scope="{ member }"
            class="expandable-content-container"
          >
            <p class="expandable-content-container__first-row">
              {{ fluent('access-group_members', 'request-invite-intro') }}
            </p>
            <form
              novalidate
              v-on:submit.prevent="
                (ev) =>
                  handleCustomRequestInvitation(
                    ev,
                    member,
                    selectedRowExpiration,
                  )
              "
              class="expandable-content-container__second-row"
            >
              <ExpirationSelect
                class="renew-expiration-select"
                v-model="selectedRowExpiration"
                :highlightError="customExpirationErrorHighlight"
              />
              <div class="expiration-actions">
                <Button class="primary-button renew" type="submit">{{
                  fluent('access-group_members', 'request-action')
                }}</Button>
              </div>
            </form>
          </div>
          <div
            slot="row-expandable-actions"
            slot-scope="{ member }"
            class="expandable-actions-container"
          >
            <p class="member-email" v-if="member.email">
              {{ fluent('access-group_members', 'expandable-email') }}
              <a :href="`mailto:${member.email}`">{{ member.email }}</a>
            </p>
            <Button
              class="primary-button delete"
              @click="rejectRequest(member)"
              >{{ fluent('access-group_members', 'request-reject') }}</Button
            >
          </div>
          <div
            slot="row-actions"
            slot-scope="{ member, toggleExpand }"
            class="member-actions"
          >
            <Button
              class="primary-action hide-mobile"
              @click="handleRequestInvitation(member)"
              >{{ fluent('access-group_members', 'request-action') }}</Button
            >
            <Button
              class="primary-action button--red-secondary hide-mobile"
              @click="rejectRequest(member)"
              >{{ fluent('access-group_members', 'request-reject') }}</Button
            >
            <Button
              class="tertiary-action expand"
              @click="toggleExpand(true)"
              :title="fluent('access-group_members', 'expandable-action-text')"
            >
              <Icon id="chevron-down" :width="32" :height="32" />
            </Button>
          </div>
          <div
            slot="row-actions-expanded"
            slot-scope="{ member, toggleExpand }"
            class="member-actions"
          >
            <Button class="tertiary-action expand" @click="toggleExpand(false)">
              <Icon id="chevron-up" :width="32" :height="32" />
            </Button>
          </div>
        </AccessGroupMembersTable>
      </template>
    </AccessGroupEditPanel>
    <AccessGroupEditPanel
      form="invitationForm"
      :handler="handleAddNewInvitesClicked"
      :beforeHandler="beforeAddNewInvitesClicked"
      :title="fluent('access-group_invite-member')"
    >
      <template v-slot:content>
        <div class="members-invite-container tags-selector">
          <TagSelector
            class="tags-selector__value"
            v-model="newInvites"
            :getLabel="getTagLabel"
            :updateAutoComplete="updateAutoCompleteList"
            :showMeta="showTagSelectorMeta"
          />
          <p class="tags-selector__description">
            {{
              fluent('access-group_invite-member', 'tags-selector__description')
            }}
          </p>
          <div class="content-area__row invite-expiration">
            <div class="radio-control invite-expiration__toggle">
              <input
                id="custom-expiration-enabled"
                type="checkbox"
                v-model="newInvitesExpirationEnabled"
              />
              <label for="custom-expiration-enabled">
                {{
                  fluent(
                    'access-group_invite-member',
                    'invite-expiration__toggle',
                  )
                }}
              </label>
            </div>
          </div>
          <div class="expiration-container" v-if="newInvitesExpirationEnabled">
            <label class="expiration-container__label">
              {{
                fluent('access-group_invite-member', 'invite-expiration__label')
              }}
            </label>
            <ExpirationSelect
              class="expiration-container__value"
              :highlightError="highlightError"
              v-model="newInvitesExpiration"
            />
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <Button
          :disabled="!newInvitesDirty"
          class="button--secondary button--action row-primary-action"
          type="submit"
          >{{ fluent('access-group_invite-member', 'invite') }}</Button
        >
      </template>
    </AccessGroupEditPanel>
    <AccessGroupEditPanel
      :title="fluent('access-group_email-invite-text')"
      v-if="getFeature('customInvitationText')"
    >
      <template v-slot:content>
        <div class="members-expiration-container">
          <div class="content-area__row">
            <div class="radio-control">
              <input type="checkbox" v-model="emailInviteTextEnabled" />
              {{ fluent('access-group_email-invite-text', 'checkbox') }}
            </div>
          </div>
        </div>
        <div class="content-area__row multi-line" v-if="emailInviteTextEnabled">
          <label class="content-area__label">{{
            fluent('access-group_email-invite-text', 'description')
          }}</label>
          <TextArea
            :rows="5"
            :maxlength="5000"
            v-model="emailInviteText"
            class="content-area__value"
          ></TextArea>
        </div>
      </template>
      <template v-slot:footer>
        <Button
          :disabled="!emailInviteTextDirty"
          @click="handleUpdateInviteTextClicked"
          class="button--secondary button--action row-primary-action"
          >{{
            fluent('access-group_email-invite-text', 'update-invite-text')
          }}</Button
        >
      </template>
    </AccessGroupEditPanel>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import TextInput from '@/components/ui/TextInput.vue';
import TextArea from '@/components/ui/TextArea.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import ExpirationSelect from '@/components/ui/ExpirationSelect.vue';
import AccessGroupEditPanel from '@/components/access_group/AccessGroupEditPanel.vue';
import TagSelector from '@/components/ui/TagSelector.vue';
import AccessGroups from '@/assets/js/access-groups';
import {
  DisplayMemberViewModel,
  GroupInvitationViewModel,
  GroupRequestViewModel,
  MEMBER_EXPIRATION_NONE,
  MEMBER_EXPIRATION_ONE_YEAR,
  MEMBER_EXPIRATION_TWO_YEARS,
} from '@/view_models/AccessGroupViewModel';
import AccessGroupMemberListDisplay from '@/components/access_group/AccessGroupMemberListDisplay.vue';
import AccessGroupMembersTable from '@/components/access_group/AccessGroupMembersTable.vue';
import { expiryTextFromDate } from '@/assets/js/component-utils';

const memberRowsDisplay = 20;
export default {
  name: 'AccessGroupInvitationsEdit',
  components: {
    TextInput,
    TextArea,
    Button,
    Icon,
    AccessGroupEditPanel,
    TagSelector,
    AccessGroupMemberListDisplay,
    AccessGroupMembersTable,
    ExpirationSelect,
  },
  props: [],
  mounted() {},
  data() {
    const invitationConfig = this.$store.getters[
      'accessGroup/getInvitationConfig'
    ];
    const groupExpiration = this.$store.getters['accessGroup/getExpiration'];
    return {
      selectedRowExpiration: !groupExpiration ? 0 : groupExpiration,
      customExpirationErrorHighlight: false,
      highlightError: false,
      newInvites: [],
      newInvitesDirty: false,
      emailInviteTextEnabled: invitationConfig !== null,
      emailInviteText: invitationConfig,
      emailInviteTextDirty: false,
      newInvitesExpirationEnabled: false,
      newInvitesExpiration: groupExpiration,
      memberRowsDisplay,
      invitationColumns: [
        {
          header: null,
        },
        {
          header: null,
          contentHandler: () => 'Invitation',
        },
        {
          header: null,
          contentHandler: (member) =>
            `${this.fluent(
              'access-group_invite-member',
              'table-row-text',
            )} ${this.expiry(member.invitationExpiration)}`,
        },
        {
          header: null,
        },
      ],
      requestColumns: [
        {
          header: null,
        },
        {
          header: null,
          contentHandler: () => 'Request',
        },
        {
          header: null,
          contentHandler: (member) =>
            `${this.fluent(
              'access-group_invite-member',
              'table-row-text',
            )} ${this.expiry(member.requestExpiration)}`,
        },
        {
          header: null,
        },
      ],
    };
  },
  watch: {
    newInvites(value) {
      if (value.length > 0) {
        this.newInvitesDirty = true;
      }
    },
    emailInviteTextEnabled(value) {
      this.emailInviteTextDirty = true;
    },
    emailInviteText(value) {
      this.emailInviteTextDirty = true;
    },
  },
  methods: {
    ...mapActions({
      resendInvitation: 'accessGroup/resendInvitation',
      deleteInvitation: 'accessGroup/deleteInvitation',
      rejectRequest: 'accessGroup/rejectRequest',
      sendInvitations: 'accessGroup/sendInvitations',
      updateInviteText: 'accessGroup/updateInviteText',
    }),
    expiry(expiration) {
      return expiryTextFromDate(this.fluent, expiration);
    },
    handleResendClicked(invitation) {
      this.resendInvitation(invitation).then((result) => {
        this.tinyNotification('access-group-invite-email-resent');
      });
    },
    handleRemoveClicked(invitation) {
      this.deleteInvitation(invitation).then((result) => {
        this.tinyNotification('access-group-invite-deleted');
      });
    },
    handleRequestInvitation(member) {
      this.sendInvitations({ invites: [member] });
    },
    handleCustomRequestInvitation(ev, member, expiration) {
      this.customExpirationErrorHighlight = true;
      const form = ev.target;
      if (!form.checkValidity()) {
        ev.preventDefault();
      } else {
        this.sendInvitations({ invites: [member], expiration });
      }
    },
    getTagLabel(curator) {
      return curator.displayName;
    },
    loadMoreHandler() {
      this.memberListOptions.numResults += memberRowsDisplay;
      this.getMembersWithOptions({
        groupName: this.groupName,
        options: this.memberListOptions,
      });
    },
    updateAutoCompleteList(search) {
      return new Promise((res, rej) => {
        AccessGroups.getUsers(search, this.groupName, false, true).then(
          (results) => {
            res(
              results.map((profile) =>
                DisplayMemberViewModel.fromUserData(profile),
              ),
            );
          },
        );
      });
    },
    async beforeAddNewInvitesClicked() {
      this.highlightError = true;
      await this.$nextTick();
    },
    async handleAddNewInvitesClicked() {
      await this.sendInvitations({
        invites: this.newInvites,
        expiration: this.newInvitesExpiration,
      });
      this.tinyNotification('access-group-members-invite-success');
      this.newInvites = [];
      this.newInvitesDirty = false;
    },
    handleUpdateInviteTextClicked() {
      this.updateInviteText(this.newInvites).then((result) => {
        this.tinyNotification('access-group-invitation-text-updated');
        this.emailInviteTextDirty = false;
      });
    },
    showTagSelectorMeta(member) {
      return member.role !== null;
    },
  },
  computed: {
    ...mapGetters({
      groupName: 'accessGroup/getGroupName',
      groupExpiration: 'accessGroup/getExpiration',
      groupInvitations: 'accessGroup/getInvitations',
      groupRequests: 'accessGroup/getRequests',
      group: 'accessGroup/getGroup',
      accessGroupExpiration: 'accessGroup/getExpiration',
    }),
    expirationIsCustom() {
      return this.selectedExpiration === 'custom';
    },
    expirationMetaText() {
      if (this.accessGroupExpiration === MEMBER_EXPIRATION_ONE_YEAR) {
        return `1 ${this.fluent('date-year')}`;
      }
      if (this.accessGroupExpiration === MEMBER_EXPIRATION_TWO_YEARS) {
        return `2 ${this.fluent('date-year', 'plural')}`;
      }
      if (this.accessGroupExpiration === 1) {
        return `1 ${this.fluent('date-day')}`;
      }
      if (this.accessGroupExpiration === MEMBER_EXPIRATION_NONE) {
        return `not expire`;
      }
      return `${this.accessGroupExpiration} ${this.fluent(
        'date-day',
        'plural',
      )}`;
    },
    // TODO: Eventually include request numbers in this number
    totalInvitationsAndRequests() {
      return this.groupInvitations.length + this.groupRequests.length;
    },
  },
};
</script>

<style>
.edit-invitations-container {
  /* enable tag selector dropdown */
  overflow: visible;
}

.pending-invitations-container {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.pending-invitations-container .pending-invitations-container__item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.pending-invitations-container
  .pending-invitations-container__item:nth-child(odd) {
  background: var(--gray-20);
}

.pending-invitations-container__actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.pending-invitations-container__actions .secondary-button {
  border: 1px solid var(--gray-60);
  color: var(--gray-60);
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  height: 2em;
  background: var(--white);
}

.pending-invitations-container__actions .tertiary-action {
  border: none;
  background: none;
  color: #ff0039;
  padding-right: 0;
  display: inline-block;
  margin-right: 1em;
}

.content-area__row.multi-line .content-area__value {
  width: 100%;
  margin-top: 1em;
}

.tags-selector .tags-selector__description {
  color: var(--gray-50);
}
</style>
