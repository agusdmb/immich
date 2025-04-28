import { getActivities, getActivityStatistics, type ActivityResponseDto } from '@immich/sdk';

class ActivityManager {
  #albumId = $state<string | undefined>();
  #assetId = $state<string | undefined>();
  #activities = $state<ActivityResponseDto[]>([]);
  #commentCount = $state(0);

  get activities() {
    return this.#activities;
  }

  set activities(activities: ActivityResponseDto[]) {
    if (this.#albumId === undefined) {
      return;
    }

    this.#activities = activities;
    void this.updateActivities(this.#albumId, this.#assetId);
  }

  get commentCount() {
    return this.#commentCount;
  }

  init(albumId: string, assetId?: string) {
    this.#albumId = albumId;
    this.#assetId = assetId;
  }

  async updateActivities(albumId: string, assetId?: string) {
    this.#activities = await getActivities({ albumId, assetId });
    const { comments } = await getActivityStatistics({ albumId, assetId });
    this.#commentCount = comments;
  }

  reset() {
    this.#albumId = undefined;
    this.#assetId = undefined;
    this.#activities = [];
    this.#commentCount = 0;
  }
}

export const activityManager = new ActivityManager();
