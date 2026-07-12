import { case01 } from './case01.js'

/**
 * Cases 02–05 are locked placeholders for now. They carry enough metadata to
 * render the filing-cabinet folders (code, tag, teaser, theme) but no playable
 * schema yet. Themes/tags mirror the GRID DAILY reference: DRIFT, FALLING,
 * FALLING, SIGNAL, AFTER WORK.
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
  lockedStub({
    id: 'case_02',
    code: 'CODE_02',
    tag: 'FALLING',
    title: 'A LONG WAY DOWN',
    folderTheme: 'fall',
    teaser: 'A fall from the seventh floor. The physics say jump. The database says otherwise.',
  }),
  lockedStub({
    id: 'case_03',
    code: 'CODE_03',
    tag: 'FALLING',
    title: 'TERMINAL VELOCITY',
    folderTheme: 'fall',
    teaser: 'Two falls, one week apart, same stairwell. Coincidence has a foreign key.',
  }),
  lockedStub({
    id: 'case_04',
    code: 'CODE_04',
    tag: 'SIGNAL',
    title: 'DEAD SIGNAL',
    folderTheme: 'signal',
    teaser: 'The last text was sent at 02:14. His phone was already off the grid at 01:50.',
  }),
  lockedStub({
    id: 'case_05',
    code: 'CODE_05',
    tag: 'AFTER WORK',
    title: 'AFTER WORK',
    folderTheme: 'work',
    teaser: 'Everyone clocked out. The badge reader remembers one who never did.',
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
