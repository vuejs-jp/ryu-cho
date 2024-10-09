import { assert } from './utils'
import { createConfig } from './config'
import { RyuCho } from './ryu-cho'

assert(!!process.env.ACCESS_TOKEN, '`accessToken` is required.')
assert(!!process.env.USER_NAME, '`userName` is required.')
assert(!!process.env.EMAIL, '`email` is required.')
assert(!!process.env.UPSTREAM_REPO, '`upstreamRepo` is required.')
assert(!!process.env.HEAD_REPO, '`headRepo` is required.')
assert(!!process.env.TRACK_FROM, '`trackFrom` is required.')

const config = createConfig({
  accessToken: process.env.ACCESS_TOKEN!,
  userName: process.env.USER_NAME!,
  email: process.env.EMAIL!,
  upstreamRepo: process.env.UPSTREAM_REPO!,
  upstreamRepoBranch: process.env.UPSTREAM_REPO_BRANCH,
  headRepo: process.env.HEAD_REPO!,
  headRepoBranch: process.env.HEAD_REPO_BRANCH,
  workflowName: process.env.WORKFLOW_NAME,
  trackFrom: process.env.TRACK_FROM!,
  pathStartsWith: process.env.PATH_STARTS_WITH,
  labels: process.env.LABELS
})

const ryuCho = new RyuCho(config)

process.on('unhandledRejection', (err) => {
  console.error(err)
})

ryuCho.start()
