import Fetcher from '@/assets/js/fetcher';
import { DISPLAY_LEVELS } from '@/assets/js/display-levels';

const labels = {
  github: 'GitHub',
  bugzilla: 'Bugzilla',
};

class Identities {
  constructor(identities) {
    this.fetcher = new Fetcher({ failoverOn: [302] });
    this.identities = identities;
    this.githubUsername = null;
    this.list = new Map();
    this.list.set('github', this.hasGithub());
    this.list.set('bugzilla', this.hasBugzilla());
    this.labels = new Map(
      [...this.list.keys()].map((p) => {
        return [p, { label: labels[p], value: p }];
      }),
    );
  }

  available() {
    return [...this.list].filter(([, v]) => !v).map(([k]) => k);
  }

  label(identity) {
    return this.labels.get(identity);
  }

  noIdentitiesLeft() {
    return this.available().length === 0;
  }

  anyIdentity() {
    return this.hasGithub() || this.hasBugzilla();
  }

  bugzillaProfile() {
    return `https://bugzilla.mozilla.org/user_profile?user_id=${this.identities.bugzillaMozillaOrgId.value}`;
  }

  bugzillaDisplay() {
    return (
      this.identities.bugzillaMozillaOrgId.metadata.display ||
      DISPLAY_LEVELS.private
    );
  }

  githubDisplay() {
    return (
      this.identities.githubIdV3.metadata.display || DISPLAY_LEVELS.private
    );
  }

  bugzillaEmail() {
    return this.identities.bugzillaMozillaOrgPrimaryEmail.value;
  }

  hasBugzilla() {
    return this.identities.bugzillaMozillaOrgId.value;
  }

  hasGithub() {
    return this.identities.githubIdV3.value;
  }

  static redirect(identity) {
    return `/whoami/${identity}/add`;
  }

  fetchGithubUsername() {
    if (this.githubUsername !== null) {
      return Promise.resolve(this.githubUsername);
    }
    if (this.identities.githubIdV3.value) {
      return this.fetcher
        .fetch(`/whoami/github/username/${this.identities.githubIdV3.value}`)
        .then((r) => r.json())
        .then(({ username }) => {
          this.githubUsername = username;
          return { username, link: `https://github.com/${username}` };
        })
        .catch((e) => {
          console.error(e);
          return {
            username: `id: ${this.identities.githubIdV3.value}`,
            link: `https://api.github.com/user/${this.identities.githubIdV3.value}`,
          };
        });
    }
    return Promise.resolve(null);
  }
}

export { Identities as default };
