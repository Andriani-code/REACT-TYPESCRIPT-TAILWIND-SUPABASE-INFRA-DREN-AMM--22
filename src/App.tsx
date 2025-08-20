import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

import Details from "./pages/Details";
import AdminHomePage from "./pages/admin/AdminDahboard";
import AdminAccueil from "./pages/admin/AdminAccueil";
import AdminDetails from "./pages/admin/AdminDetails";
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";


import DomaineScolaire from "./pages/admin/DomaineScolaire";
import NewEtablissement from "./pages/NewEtablissement";
import Apropos from "./pages/Apropos";

import SalleDetails from "./pages/admin/SalleDetails";
import PrintExample from "./pages/DetailsImpression.tsx";
import DetailsImpression from "./pages/DetailsImpression.tsx";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:code" element={<Details />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/admin/home" element={<AdminAccueil />} />
          <Route path="/admin/details" element={<AdminDetails />} />
          <Route path="/admin/edit/:codeetab" element={<NewEtablissement/>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/salle/:idBat" element={<SalleDetails />} />
          {/* on va jouter un params avyh ei */}
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="/admin/new" element={<NewEtablissement />} />
          <Route path="/apropos" element={<Apropos/>} />
          <Route path="/print/:code" element={<DetailsImpression/>} />


          
          <Route path="/exemple" element={<DomaineScolaire codeetab={5464} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
