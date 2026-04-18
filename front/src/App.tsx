import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from './application/providers/AppProviders';
import { AppShell } from './ui/layouts';
import { HomePage } from './ui/pages';
import { LoadingSpinner } from './ui/components/shared/LoadingSpinner';

const LootPage = lazy(() => import('./ui/pages/LootPage').then(m => ({ default: m.LootPage })));
const MerchantPage = lazy(() => import('./ui/pages/MerchantPage').then(m => ({ default: m.MerchantPage })));
const DicePage = lazy(() => import('./ui/pages/DicePage').then(m => ({ default: m.DicePage })));
const EncyclopediaPage = lazy(() => import('./ui/pages/EncyclopediaPage').then(m => ({ default: m.EncyclopediaPage })));
const CharactersPage = lazy(() => import('./ui/pages/CharactersPage').then(m => ({ default: m.CharactersPage })));
const CharacterSheetPage = lazy(() => import('./ui/pages/CharacterSheetPage').then(m => ({ default: m.CharacterSheetPage })));
const SessionsPage = lazy(() => import('./ui/pages/SessionsPage').then(m => ({ default: m.SessionsPage })));
const SessionDetailPage = lazy(() => import('./ui/pages/SessionDetailPage').then(m => ({ default: m.SessionDetailPage })));
const BestiaryPage = lazy(() => import('./ui/pages/BestiaryPage').then(m => ({ default: m.BestiaryPage })));
const CraftPage = lazy(() => import('./ui/pages/CraftPage').then(m => ({ default: m.CraftPage })));

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppShell>
            <div className={"m-10"}>
          <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><LoadingSpinner /></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/loot" element={<LootPage />} />
            <Route path="/merchant" element={<MerchantPage />} />
            <Route path="/dice" element={<DicePage />} />
            <Route path="/encyclopedia" element={<EncyclopediaPage />} />
            <Route path="/characters" element={<CharactersPage />} />
            <Route path="/characters/:id" element={<CharacterSheetPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/sessions/:id" element={<SessionDetailPage />} />
            <Route path="/bestiary" element={<BestiaryPage />} />
            <Route path="/craft" element={<CraftPage />} />
          </Routes>
          </Suspense>
            </div>
        </AppShell>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
