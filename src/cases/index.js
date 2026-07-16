import { case01 } from './case01.js'
import { case02 } from './case02.js'
import { case03 } from './case03.js'
import { case04 } from './case04.js'
import { case05 } from './case05.js'

/**
 * Case 06 is a "coming soon" placeholder — it renders as a folder but has no
 * playable schema yet. `comingSoon` marks it for the level-select card.
 */
const lockedStub = (over) => ({
  locked: true,
  crimeScene: null,
  schemaSql: null,
  erd: null,
  report: null,
  ...over,
})

export const CASES = [
  case01,
  case02,
  case03,
  case04,
  case05,
  lockedStub({
    id: 'case_06',
    code: 'CODE_06',
    tag: 'ARCHIVE',
    title: 'The Archivist',
    folderTheme: 'archive',
    teaser: 'Every file in the vault was signed out in perfect order. Except the one that never came back.',
    comingSoon: true,
  }),
]

export function getCase(id) {
  return CASES.find((c) => c.id === id) || null
}

/** A case is unlocked if it's case_01 or the previous case has been solved. */
export function isCaseUnlocked(caseId, solvedCases) {
  const idx = CASES.findIndex((c) => c.id === caseId)
  if (idx <= 0) return true
  return solvedCases.includes(CASES[idx - 1].id)
}
