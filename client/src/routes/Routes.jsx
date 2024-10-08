import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/Home/Home";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import RoomDetails from "../pages/RoomDetails/RoomDetails";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Statistics from "../pages/Dashboard/Common/Statistics";
import AddRooms from "../pages/Dashboard/Host/AddRooms";
import MyListings from "../pages/Dashboard/Host/MyListings";
import Profile from "../pages/Dashboard/Common/Profile";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import AdminRoute from "./AdminRoute";
import HostRoute from "./HostRoute";
import MyBookings from "../pages/Dashboard/Guest/MyBookings";
import ManageBookkings from "../pages/Dashboard/Host/ManageBookings"
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/room/:id",
        element: (
          <PrivateRoute>
            <RoomDetails />
          </PrivateRoute>
        ),
      },
    ],
  },

  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children: [
      {
        index: true,
        element: <PrivateRoute><Statistics /></PrivateRoute>,
      },
      {
        path: "add-room",
        element:<PrivateRoute>
          <HostRoute><AddRooms></AddRooms></HostRoute>
        </PrivateRoute>
      },
      {
        path: "my-listings",
        element:<PrivateRoute>
          <HostRoute><MyListings></MyListings></HostRoute>
        </PrivateRoute>
      },
      {
        path: "my-bookings",
        element:<PrivateRoute>
          <MyBookings></MyBookings>
        </PrivateRoute>
      },
      {
        path: "manage-bookings",
        element:<PrivateRoute>
          <ManageBookkings></ManageBookkings>
        </PrivateRoute>
      },
      {
        path: "manage-users",
        element:<PrivateRoute>
          <AdminRoute><ManageUsers></ManageUsers></AdminRoute>
        </PrivateRoute>
      },
      {
        path: "/dashboard/profile",
        element:<PrivateRoute><Profile></Profile></PrivateRoute>
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
]);
