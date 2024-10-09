import { extractRepoOwner, extractRepoName } from './utils'

export interface UserConfig {
  /**
   * Git user name to use when making PR.
   *
   * Uses `process.env.USER_NAME` if it exists.
   */
  userName: string

  /**
   * Git email address to use when making PR.
   *
   * Uses `process.env.EMAIL` if it exists.
   */
  email: string

  /**
   * GitHub access token.
   *
   * Uses `process.env.ACCESS_TOKEN` if it exists.
   */
  accessToken: string

  /**
   * The url for the upstream repo.
   *
   * Uses `process.env.UPSTREAM_REPO` if it exists.
   *
   * @example 'git@github.com:vuejs/vuejs.org'
   */
  upstreamRepo: string

  /**
   * The branch to track on the upstream repo.
   *
   * Uses `process.env.UPSTREAM_REPO_BRANCH` if it exists.
   *
   * @default 'main'
   */
  upstreamRepoBranch?: string

  /**
   * The url for the head repo.
   *
   * Uses `process.env.HEAD_REPO` if it exists.
   *
   * @example 'https://github.com/vuejs/vuejs.org'
   */
  headRepo: string

  /**
   * The branch to track on head repo.
   *
   * Uses `process.env.HEAD_REPO_BRANCH` if it exists.
   *
   * @default 'main'
   */
  headRepoBranch?: string

  /**
   * The name of the GitHub workflow. This value is used to determine the last
   * run of the Che Tsumi.
   *
   * Uses `process.env.WORKFLOW_NAME` if it exists.
   *
   * @default 'ryu-cho'
   */
  workflowName?: string

  /**
   * The git commit sha to start tracking.
   *
   * Uses `process.env.TRACK_FROM` if it exists.
   *
   * @example '889d985125558731c14278c3c5764bdcfb2389fd'
   */
  trackFrom: string

  /**
   * File path to track. If this option is set, commit not containing the
   * path will be not tracked.
   *
   * @example 'docs/'
   */
  pathStartsWith?: string

  /**
   * Labels to add to the issues. You can specify multiple labels. Each
   * label must be separated by a newline.
   *
   * @default undefined
   * @example |
   *  label1
   *  label2
   */
  labels?: string
}

export interface Config {
  userName: string
  email: string
  accessToken: string
  workflowName: string
  trackFrom: string
  pathStartsWith?: string
  labels?: string

  remote: {
    upstream: Remote
    head: Remote
  }
}

export interface Remote {
  url: string
  owner: string
  name: string
  branch: string
}

export function createConfig(config: UserConfig): Config {
  return {
    userName: config.userName,
    email: config.email,
    accessToken: config.accessToken,
    workflowName: config.workflowName ?? 'ryu-cho',
    trackFrom: config.trackFrom,
    pathStartsWith: config.pathStartsWith,
    labels: config.labels,

    remote: {
      upstream: {
        url: config.upstreamRepo,
        owner: extractRepoOwner(config.upstreamRepo),
        name: extractRepoName(config.upstreamRepo),
        branch: config.upstreamRepoBranch ?? 'main'
      },
      head: {
        url: config.headRepo,
        owner: extractRepoOwner(config.headRepo),
        name: extractRepoName(config.headRepo),
        branch: config.headRepoBranch ?? 'main'
      }
    }
  }
}
