import { RyuCho, type Feed } from '../src/ryu-cho'
import type { Config } from '../src/config'
import * as GitHub from '../src/github'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../src/github')

const DEFAULT_CONFIG: Config = {
  userName: '',
  email: '',
  accessToken: '',
  workflowName: '',
  trackFrom: '',
  pathStartsWith: '',
  paths: [],

  remote: {
    upstream: {
      url: '',
      owner: '',
      name: '',
      branch: '',
    },
    head: {
      url: '',
      owner: '',
      name: '',
      branch: '',
    }
  }
}

const DEFAULT_FEED: Feed = {
  isoDate: '',
  link: '',
  title: '',
  contentSnippet: '',
}

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
}

type MutableGitHub = Mutable<typeof GitHub>

function makeRyuCho(config: Partial<Config>, filenames: string[]) {
  class TestRyuCho extends RyuCho {
    public containsValidFile(feed: Feed, hash: string): Promise<boolean> {
      return super.containsValidFile(feed, hash)
    }
  }
  (GitHub as MutableGitHub).GitHub = vi.fn(() => ({
    getCommit() {
      return Promise.resolve({
        data: {
          files: filenames.map(n => ({ filename: n }))
        }
      })
    }
  })) as unknown as typeof GitHub.GitHub

  const ryuCho = new TestRyuCho({
    ...DEFAULT_CONFIG,
    ...config,
  })

  return ryuCho
}

describe('RyuCho', () => {
  it('containsValidFile matches single config.paths[]', () => {
    const paths = ['/docs/**/*.md']
    const filenames = [
      '/docs/guide/index.md',
      '/docs/team.md',
      '/README.md',
    ]
    const ryuCho = makeRyuCho({ paths }, filenames)

    const hasValidFile = ryuCho.containsValidFile(DEFAULT_FEED, 'hash')
    expect(hasValidFile).resolves.toBe(true)
  })

  it('containsValidFile does not match any config.paths[]', () => {
    const paths = ['/docs/**/*.md']
    const filenames = [
      '/docs/guide/index.txt',
      '/docs/team.txt',
      '/README.md',
    ]
    const ryuCho = makeRyuCho({ paths }, filenames)

    const hasValidFile = ryuCho.containsValidFile(DEFAULT_FEED, 'hash')
    expect(hasValidFile).resolves.toBe(false)
  })

  it('containsValidFile matches multiple config.paths[]', () => {
    const paths = ['/docs/**/*.md', '/README.md']
    const filenames = [
      '/docs/guide/index.md',
      '/docs/team.md',
      '/README.md',
    ]
    const ryuCho = makeRyuCho({ paths }, filenames)

    const hasValidFile = ryuCho.containsValidFile(DEFAULT_FEED, 'hash')
    expect(hasValidFile).resolves.toBe(true)
  })

  it('containsValidFile excludes specified config.paths[]', () => {
    // match all *.md files except README.md
    const paths = ['**/!(README).md']
    const filenames = [
      '/docs/guide/index.txt',
      '/docs/team.txt',
      '/README.md',
    ]
    const ryuCho = makeRyuCho({ paths }, filenames)

    const hasValidFile = ryuCho.containsValidFile(DEFAULT_FEED, 'hash')
    expect(hasValidFile).resolves.toBe(false)
  })
})