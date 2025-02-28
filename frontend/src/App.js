import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Components/Home"
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import Signup from "./Components/Signup"
import Login from "./Components/Login"
import Logout from "./Components/Logout"
import HotelAdminDashboard from "./Components/HotelAdminDashboard"
import HotelListing from "./Components/HotelLisitng"
import UserDashboard from "./Components/UserDashboard"
import ProductPage from "./Components/ProductPage"
import SearchPage from "./Components/SearchPage"
import NotFound from "./Components/NotFound"
import EditListing from './Components/EditListing';
import AdminReservations from './Components/AdminReservations'
import {SessionProvider} from "./Context/SessionContext"
import UserProfile from './Components/UserProfile';
import UserReservation from './Components/UserReservation';

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
            <Route path="/logout" element={<Logout />} />
            <Route path="/user/user-dashboard" element={<UserDashboard />}>
              <Route index element={<UserProfile />} />
              <Route path='profile' element={<UserProfile/>}/>
              <Route path='reservations' element={<UserReservation/>}/>
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/hotel-admin-dashboard/" element={<HotelAdminDashboard />}>
              <Route path="add-listing" element={<HotelListing />} />
              <Route path="edit-listing" element={<EditListing />} />
              <Route path="see-reservations" element={<AdminReservations />} />
              <Route index element={<HotelListing />} />
              <Route path="*" element={<NotFound />} />
            </Route> 
            <Route path="/search" element={<SearchPage />} />
            <Route path="/hotel/:id" element={<ProductPage />} />
          </Routes>
        <Footer/>
    </Router>
    </SessionProvider>
  );
}
export default App