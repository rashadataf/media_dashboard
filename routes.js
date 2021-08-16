/*!

=========================================================
* * NextJS Material Dashboard v1.1.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import SchoolIcon from "@material-ui/icons/School";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import BookIcon from "@material-ui/icons/Book";
import PublicIcon from "@material-ui/icons/Public";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import CategoryIcon from "@material-ui/icons/Category";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import LanguageIcon from "@material-ui/icons/Language";
import FavoriteIcon from "@material-ui/icons/Favorite";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AppsIcon from "@material-ui/icons/Apps";
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar";
import PeopleIcon from "@material-ui/icons/People";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import ContactMailIcon from "@material-ui/icons/ContactMail";

import SvgIcon from "@material-ui/core/SvgIcon";
const state = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M7.875 10.05h1.813v10.2H7.875zm0 0M7.875 21.656h8.25v2.313h-8.25zm0 0M11.094 10.05h1.812v10.2h-1.812zm0 0M14.313 10.05h1.812v10.2h-1.813zm0 0M17.926 8.043L12 5.66 6.074 8.043v.602h11.852zm0 0M0 23.969h6.469V10.05H0zm2.531-11.88h1.406v3.778H2.532zm0 5.833h1.406v3.777H2.532zm0 0M17.531 10.05V23.97H24V10.05zM21.47 21.7h-1.407v-3.778h1.407zm0-5.833h-1.407V12.09h1.407zm0 0M12.703 4.43V2.977l3.48.043V.03h-4.886V4.43L12 4.145zm0 0" />
  </SvgIcon>
);

const Scholarship = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M2.156 4.266L12 8.484l9.844-4.218L12 0zm0 0" />
    <path d="M18.328 10.3v-3L12 10.017 5.672 7.3v3L12 13.01zm0 0M.75 16.922v1.406h9.14V14.11H.75v1.407c.387 0 .703.316.703.703a.705.705 0 01-.703.703zm0 0M20.438 18.328a2.11 2.11 0 000-4.219h-9.141v4.22h9.14zm0 0M23.25 21.14v-1.406H11.297v1.407H9.89v-1.407H3.562a2.11 2.11 0 00-2.109 2.11c0 1.164.945 2.156 2.11 2.156H23.25v-1.453a.705.705 0 01-.703-.703c0-.387.316-.703.703-.703zm0 0M21.14 6.098l-1.406.601v6.004h1.407zm0 0" />
  </SvgIcon>
);

const dashboardRoutes = [
  // {
  //   path: "/dashboard",
  //   name: "Main",
  //   rtlName: "الرئيسية",
  //   icon: Dashboard,
  //   layout: "/admin",
  // },
  // {
  //   path: "/universities",
  //   name: "Universities",
  //   rtlName: "الجامعات",
  //   icon: AccountBalanceIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/colleges",
  //   name: "Colleges",
  //   rtlName: "الكليات",
  //   icon: SchoolIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/programs",
  //   name: "Programs",
  //   rtlName: "البرامج",
  //   icon: BookIcon,
  //   layout: "/admin",
  // },
  {
    path: "/blogs",
    name: "Blogs",
    rtlName: "البوستات",
    icon: AssignmentIcon,
    layout: "/admin",
  },
  // {
  //   path: "/services",
  //   name: "Services",
  //   rtlName: "الخدمات",
  //   icon: AppsIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/scholarships",
  //   name: "Scholarships",
  //   rtlName: "المنح",
  //   icon: Scholarship,
  //   layout: "/admin",
  // },
  // {
  //   path: "/agents",
  //   name: "Agents",
  //   rtlName: "العملاء",
  //   icon: PermContactCalendarIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/users",
  //   name: "Users",
  //   rtlName: "المستخدمين",
  //   icon: PeopleIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/members",
  //   name: "Members",
  //   rtlName: "الأعضاء",
  //   icon: GroupWorkIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/public-questions",
  //   name: "Public Questions",
  //   rtlName: "الأسئلة العامة",
  //   icon: QuestionAnswerIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/faqs",
  //   name: "FAQs",
  //   rtlName: "الأسئلة الشائعة",
  //   icon: LiveHelpIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/specializations",
  //   name: "Specializations",
  //   rtlName: "التخصصات",
  //   icon: FavoriteIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/countries",
  //   name: "Countries",
  //   rtlName: "الدول",
  //   icon: PublicIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/areas",
  //   name: "Areas",
  //   rtlName: "المناطق",
  //   icon: GpsFixedIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/states",
  //   name: "States",
  //   rtlName: "الولايات",
  //   icon: state,
  //   layout: "/admin",
  // },
  // {
  //   path: "/categories",
  //   name: "Categories",
  //   rtlName: "الأصناف",
  //   icon: CategoryIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/media",
  //   name: "Media",
  //   rtlName: "الميديا",
  //   icon: PermMediaIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/degrees",
  //   name: "Scientific Degrees",
  //   rtlName: "الدرجات العلمية",
  //   icon: AcUnitIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/languages",
  //   name: "Languages",
  //   rtlName: "اللغات",
  //   icon: LanguageIcon,
  //   layout: "/admin",
  // },
  // {
  //   path: "/applications",
  //   name: "Applications",
  //   icon: ContactMailIcon,
  //   layout: "/admin",
  // },
];

export default dashboardRoutes;
