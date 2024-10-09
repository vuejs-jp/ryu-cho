import { Octokit } from '@octokit/rest'
import { Remote } from './config'

export interface CreateIssueOptions {
  title: string
  body: string
  labels: string[]
}

export interface CreatePullRequestOptions {
  title: string
  body: string
  branch: string
}

export class GitHub {
  api: Octokit

  constructor(auth: string) {
    this.api = new Octokit({ auth })
  }

  searchIssue(remote: Remote, hash: string) {
    return this.api.search.issuesAndPullRequests({
      q: `${hash} repo:${remote.owner}/${remote.name} type:issue`
    })
  }

  getCommit(remote: Remote, hash: string) {
    return this.api.repos.getCommit({
      owner: remote.owner,
      repo: remote.name,
      ref: hash
    })
  }

  createIssue(remote: Remote, options: CreateIssueOptions) {
    return this.api.issues.create({
      owner: remote.owner,
      repo: remote.name,
      title: options.title,
      body: options.body,
      labels: options.labels
    })
  }

  createPullRequest(remote: Remote, options: CreatePullRequestOptions) {
    return this.api.pulls.create({
      owner: remote.owner,
      repo: remote.name,
      title: options.title,
      body: options.body,
      head: `${remote.owner}:${options.branch}`,
      base: remote.branch
    })
  }

  getRuns(remote: Remote) {
    return this.api.actions.listWorkflowRunsForRepo({
      owner: remote.owner,
      repo: remote.name
    })
  }

  async getLatestRun(remote: Remote, name: string) {
    const { data } = await this.getRuns(remote)

    // Strip out all runs which are not relevant. We only want to keep a list
    // of runs that has the name of `config.workflowName`.
    const runs = data.workflow_runs.filter((run) => {
      return run.name === name
    })

    // Return the second latest run from the list because the latest run is the
    // run that is executing right now. What we want is the "previous" run,
    // which is the second latest.
    return runs[1] ?? null
  }
}
