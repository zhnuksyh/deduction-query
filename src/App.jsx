import { lazy, Suspense } from 'react'
import { useGame } from './state/useGame.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import MainMenu from './screens/MainMenu.jsx'
import LevelSelect from './screens/LevelSelect.jsx'
import Options from './screens/Options.jsx'
import Credits from './screens/Credits.jsx'

// The dashboard drags in sql.js, CodeMirror, and TanStack Table. Loading it
// lazily keeps all of that OUT of the initial bundle, so the menu and level
// select paint instantly. The heavy chunk is only fetched when a case opens.
const GameDashboard = lazy(() => import('./screens/GameDashboard.jsx'))

export default function App() {
  const game = useGame()
  const crt = game.save.settings.crt

  return (
    <div
      className={`h-full w-full bg-zinc-950 text-zinc-200 ${crt ? 'crt' : ''}`}
      style={{ fontSize: `${game.save.settings.textScale}rem` }}
    >
      <ErrorBoundary>
        {game.screen === 'menu' && <MainMenu game={game} />}
        {game.screen === 'levels' && <LevelSelect game={game} />}
        {game.screen === 'options' && <Options game={game} />}
        {game.screen === 'credits' && <Credits game={game} />}
        {game.screen === 'game' && (
          <Suspense fallback={<DashboardLoading />}>
            <GameDashboard game={game} />
          </Suspense>
        )}
      </ErrorBoundary>
    </div>
  )
}

function DashboardLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-300">
          loading case workspace
        </div>
        <pre className="text-[11px] leading-relaxed text-zinc-300/70">
{`> fetching editor + data grid ...
> preparing sql.js runtime ...`}
          <span className="ml-0.5 inline-block h-3 w-2 animate-blink bg-zinc-400 align-middle" />
        </pre>
      </div>
    </div>
  )
}
