import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Alphabet } from "./pages/Alphabet.jsx";
import { WordPractice } from "./pages/WordPractice.jsx";
import { Parents } from "./pages/Parents.jsx";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index={true} element={<Home />} />
          <Route path="alphabet" element={<Alphabet />} />
          <Route path="word-practice" element={<WordPractice />} />
          <Route path="dashboard" element={<Parents />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
