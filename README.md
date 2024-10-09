# Ryu-Cho

Ryu-Cho (means "fluent" in Japanese) is a GitHub Action that creates issues and PRs from the head repo based on its commit. Very useful for tracking diffs between translating docs, for example.

Ryu-Cho is a fork of [Che-Tsumi](https://github.com/vuejs-jp/che-tsumi). It works almost identical, while Che-Tsumi works as a stand-alone service while Ryu-Cho works with GitHub Action.

## Usage

Ryu-Cho requires GitHub authentication to create issues and PRs to the repository. At first, create [Encrypted secret](https://docs.github.com/en/actions/reference/encrypted-secrets) that has access to the repository which you want to set up Ryu-Cho. Here we assume you've created a secret called `ACCESS_TOKEN`.

Next, create `.github/workflows/ryu-cho.yml` file in your repository. Then configure the yaml file.

```yml
name: ryu-cho

on:
  # Schedule the interval of the checks.
  schedule:
    - cron: '*/5 * * * *'

jobs:
  ryu-cho:
    name: Ryu Cho
    runs-on: ubuntu-latest
    steps:
      - uses: vuejs-translations/ryu-cho@v1
        with:
          # GitHub access token. Required.
          access-token: ${{ secrets.ACCESS_TOKEN }}

          # Git user name to use when making issues and PRs. Required.
          username: johndoe

          # Git email address to use when making issues and PRs. Required.
          email: "john.doe@example.com"

          # The url for the upstream repo. This is the repository that you
          # set up Ryu-Cho. Required.
          upstream-repo: https://github.com/vuejs-translations/docs-ja.git

          # The branch for the upstream repo. Optional. Defaults to `main`.
          upstream-repo-branch: main

          # The head repo to track. This is the repository you want to
          # take a diff. Required.
          head-repo: https://github.com/vuejs/docs.git

          # The branch for the head repo. Optional. Defaults to `main`.
          head-repo-branch: main

          # The git commit sha of head repo to start tracking. Ryu-Cho will
          # only track commit from this hash. Required.
          track-from: 4ed8b2f83a2f149734f3c5ecb6438309bd85a9e5

          # File path to track. In this example, Ryu-Cho will only track
          # commits that modified files under `docs` folder. Optional.
          path-starts-with: docs/

          # GitHub workflow name that runs Ryu-Cho. This is required since
          # Ryu-Cho determines the last run by looking into last workflow
          # run timestamp. Optional. Defaults to `ryu-cho`.
          workflow-name: ryu-cho

          # Labels to add to the issues. You can specify multiple labels.
          # Each label must be separated by a newline.
          # Optional. Defaults to empty(no labels are added).
          labels: |
            sync
            needs review
            my label
```

The important part to note is that you must match the GitHub workflow name to `workflow-name` option.
