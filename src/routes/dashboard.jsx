import Dashboard from "views/Dashboard/Dashboard";
import UserProfile from "views/UserProfile/UserProfile";
import TableList from "views/TableList/TableList";
import Typography from "views/Typography/Typography";
import Icons from "views/Icons/Icons";
import Maps from "views/Maps/Maps";
import Notifications from "views/Notifications/Notifications";
import Upgrade from "views/Upgrade/Upgrade";

import Settings from "views/Settings/Settings"
import AddDevice from "views/AddDevice/AddDevice"
import EditDevice from "views/EditDevice/EditDevice"
import ManageUsers from "views/ManageUsers/ManageUsers"
import Devices from "views/Devices/Devices"
import AddUser from "views/AddUser/AddUser"
import EditUser from "views/EditUser/EditUser"
import EditGroup from "views/EditGroup/EditGroup"
import Groups from "views/Groups/Groups"
import UserSearch from "views/UserSearch/UserSearch"
import DeviceSearch from "views/DeviceSearch/DeviceSearch"

const dashboardRoutes = [

  {
    path: "/device/edit/:hardwareId",
    name: "Edit Device",
    icon: "pe-7s-tools",
    component: EditDevice,
    linkonly : true
  },

  {
    path: "/device/search/",
    name: "Search a device",
    icon: "pe-7s-tools",
    component: DeviceSearch,
    linkonly : true
  },


  {
    path: "/users/edit/:userId",
    name: "Edit User",
    icon: "pe-7s-tools",
    component: EditUser,
    linkonly : true
  },

  {
    path: "/users/add/",
    name: "Register a user",
    icon: "pe-7s-tools",
    component: AddUser,
    linkonly : true
  },

  {
    path: "/users/search/",
    name: "Register a user",
    icon: "pe-7s-tools",
    component: UserSearch,
    linkonly : true
  },


  {
    path: "/groups/edit/:groupId",
    name: "Edit Device",
    icon: "pe-7s-tools",
    component: EditGroup,
    linkonly : true
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard
  },  
  // {
  //   path: "/profile",
  //   name: "Your Profile",
  //   icon: "pe-7s-user",
  //   component: UserProfile
  // },
  {
    path: "/users",
    name: "Manage Users",
    icon: "pe-7s-users",
    adminonly : true,
    component: ManageUsers
  },
  {
    path: "/device",
    name: "Show Devices",
    icon: "pe-7s-server",
    component: Devices
  },

  {
    path: "/add-device",
    name: "Add Device",
    icon: "pe-7s-plus",
    component: AddDevice
  },
  {
    path: "/groups",
    name: "Manage Groups",
    icon: "pe-7s-network",
    component: Groups
  },
  {
    path: "/setting",
    name: "Settings",
    icon: "pe-7s-tools",
    component: Settings
  },



  // {
  //   path: "/table",
  //   name: "Table List",
  //   icon: "pe-7s-note2",
  //   component: TableList
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "pe-7s-news-paper",
  //   component: Typography
  // },
  // { path: "/icons", name: "Icons", icon: "pe-7s-science", component: Icons },
  // { path: "/maps", name: "Maps", icon: "pe-7s-map-marker", component: Maps },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "pe-7s-bell",
  //   component: Notifications
  // },
  // {
  //   upgrade: true,
  //   path: "/upgrade",
  //   name: "Upgrade to PRO",
  //   icon: "pe-7s-rocket",
  //   component: Upgrade
  // },
  { redirect: true, path: "/", to: "/dashboard", name: "Dashboard" }
];

export default dashboardRoutes;
