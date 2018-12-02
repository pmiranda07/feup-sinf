// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Product from "@material-ui/icons/Store";
import Money from "@material-ui/icons/AttachMoney";
import MoneyOff from "@material-ui/icons/MoneyOff";
import Finances from "@material-ui/icons/PieChart";

import Person from "@material-ui/icons/Person";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
// core components/views
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import TableList from "views/TableList/TableList.jsx";
import Typography from "views/Typography/Typography.jsx";
import Icons from "views/Icons/Icons.jsx";
import Maps from "views/Maps/Maps.jsx";
import FinancesView from "views/Finances/Finances.jsx";

const dashboardRoutes = [
  {
    path: "/overview",
    sidebarName: "Overview",
    navbarName: "Overview",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/products",
    sidebarName: "Products",
    navbarName: "Products",
    icon: Product,
    component: TableList
  },
  {
    path: "/finances",
    sidebarName: "Finances",
    navbarName: "Finances",
    icon: Finances,
    component: FinancesView
  },
  {
    path: "/sales",
    sidebarName: "Sales",
    navbarName: "Sales",
    icon: Money,
    component: TableList
  },
  {
    path: "/purchases",
    sidebarName: "Purchases",
    navbarName: "Purchases",
    icon: MoneyOff,
    component: TableList
  },
  { redirect: true, path: "/", to: "/overview", navbarName: "Redirect" }
];

export default dashboardRoutes;
