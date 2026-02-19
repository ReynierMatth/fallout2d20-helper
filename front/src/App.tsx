import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from './application/providers/AppProviders';
import { AppShell } from './ui/layouts';
import {
  HomePage,
  LootPage,
  MerchantPage,
  DicePage,
  EncyclopediaPage,
  CharactersPage,
  CharacterSheetPage,
  SessionsPage,
  SessionDetailPage,
} from './ui/pages';

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppShell>
            <div className={"m-10"}>
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
          </Routes>
            </div>
        </AppShell>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
