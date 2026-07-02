import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SearchPage } from "@/features/search/SearchPage";
import { ProfileDetailPage } from "@/features/profile/ProfileDetailPage";
import { ListPage } from "@/features/list/ListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:username" element={<ProfileDetailPage />} />
        <Route path="/list" element={<ListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
