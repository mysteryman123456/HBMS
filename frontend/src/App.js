import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Components/Home"
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import Signup from "./Components/Signup"
import Login from "./Components/Login"
import HotelAdminDashboard from "./Components/HotelAdminDashboard"
import HotelListing from "./Components/HotelLisitng"
import UserDashboard from "./Components/UserDashboard"
import ProductPage from "./Components/ProductPage"
import SearchPage from "./Components/SearchPage"
import NotFound from "./Components/NotFound"
import EditListing from './Components/EditListing';
import {SessionProvider} from "./Context/SessionContext"
import Favourite from './Components/Favourite';



function App() {
  return (
    <SessionProvider>
    <Router>
        <Navbar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/hotel-admin-dashboard/" element={<HotelAdminDashboard />}>
            <Route path="add-listing" element={<HotelListing />} />
            <Route path="edit-listing" element={<EditListing />} />
            <Route index element={<HotelListing />} />
            <Route path="*" element={<NotFound />} />
            </Route> 
            <Route path="/search" element={<SearchPage />} />
            <Route path="/hotel/:id" element={<ProductPage />} />
            <Route path="/favourite" element={<Favourite />} />

          </Routes>
        <Footer/>
    </Router>
    </SessionProvider>
  );
}
export default App