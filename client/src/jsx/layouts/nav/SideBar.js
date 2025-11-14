  import React, { useReducer, useContext, useEffect, useState } from "react";
  /// Scroll
  import PerfectScrollbar from "react-perfect-scrollbar";
  import { Collapse, Dropdown } from "react-bootstrap";
  /// Link
  import { Link } from "react-router-dom";

  import { UserMenu, AdminMenu } from "./Menu";  // <-- UPDATED
  import { useSelector } from "react-redux";

  import { useScrollPosition } from "@n8tb1t/use-scroll-position";
  import { ThemeContext } from "../../../context/ThemeContext";
  import LogoutPage from "./Logout";

  const reducer = (previousState, updatedState) => ({
    ...previousState,
    ...updatedState,
  });

  const initialState = {
    active: "",
    activeSubmenu: "",
  };

  const SideBar = () => {
    let d = new Date();
    const {
      iconHover,
      sidebarposition,
      headerposition,
      sidebarLayout,
      ChangeIconSidebar,
    } = useContext(ThemeContext);

    const auth = useSelector((state) => state.auth);
    console.log("🚀 ~ SideBar ~ auth:", auth)

    // 🟢 Detect role safely
    console.log("🚀 ~ SideBar ~ auth?.admin:", auth?.admin)
    const role = auth?.admin?.role || auth?.user?.role || "user";
    console.log("🚀 ~ SideBar ~ role:", role)


    // 🟢 Pick correct menu based on role
    const MenuList = role === "admin" ? AdminMenu : UserMenu;

    const [state, setState] = useReducer(reducer, initialState);

    useEffect(() => {
      var btn = document.querySelector(".nav-control");
      var aaa = document.querySelector("#main-wrapper");
      function toggleFunc() {
        return aaa.classList.toggle("menu-toggle");
      }
      btn.addEventListener("click", toggleFunc);
    }, []);

    let handleheartBlast = document.querySelector(".heart");
    function heartBlast() {
      return handleheartBlast.classList.toggle("heart-blast");
    }

    const [hideOnScroll, setHideOnScroll] = useState(true);
    useScrollPosition(
      ({ prevPos, currPos }) => {
        const isShow = currPos.y > prevPos.y;
        if (isShow !== hideOnScroll) setHideOnScroll(isShow);
      },
      [hideOnScroll]
    );

    const handleMenuActive = (status) => {
      setState({ active: status });
      if (state.active === status) {
        setState({ active: "" });
      }
    };

    const handleSubmenuActive = (status) => {
      setState({ activeSubmenu: status });
      if (state.activeSubmenu === status) {
        setState({ activeSubmenu: "" });
      }
    };

    /// Path
    let path = window.location.pathname;
    path = path.split("/");
    path = path[path.length - 1];

    return (
      <div
        onMouseEnter={() => ChangeIconSidebar(true)}
        onMouseLeave={() => ChangeIconSidebar(false)}
        className={`dlabnav ${iconHover} ${
          sidebarposition.value === "fixed" &&
          sidebarLayout.value === "horizontal" &&
          headerposition.value === "static"
            ? hideOnScroll > 120
              ? "fixed"
              : ""
            : ""
        }`}
      >
        <PerfectScrollbar className="dlabnav-scroll">
          <Dropdown as="div" className=" header-profile2 dropdown">
            <Dropdown.Toggle
              as="div"
              variant=""
              className=" i-false c-pointer"
              // href="#"
              role="button"
              data-toggle="dropdown"
            >
              <div className="header-info2 d-flex align-items-center">
                {/* <img src={profile} width={20} alt="" /> */}
                <div className="d-flex align-items-center sidebar-info">
                  <div>
                    {/* <span className="font-w400 d-block">ADMIN</span> */}
                    {/* <small className="text-end font-w400">Superadmin</small> */}
                  </div>
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu
              align="end"
              className=" dropdown-menu dropdown-menu-end"
            >
              <LogoutPage />
            </Dropdown.Menu>
          </Dropdown>
          <ul className="metismenu" id="menu">
            {MenuList.map((data, index) => {
              let menuClass = data.classsChange;
              if (menuClass === "menu-title") {
                return (
                  <li className={menuClass} key={index}>
                    {data.title}
                  </li>
                );
              } else {
                return (
                  <li
                    className={` ${
                      state.active === data.title ? "mm-active" : ""
                    }`}
                    key={index}
                  >
                    {data.content && data.content.length > 0 ? (
                      <>
                        <Link
                          to={"#"}
                          className="has-arrow"
                          onClick={() => {
                            handleMenuActive(data.title);
                          }}
                        >
                          {data.iconStyle}
                          <span className="nav-text">{data.title}</span>
                          <span className="badge badge-xs style-1 badge-danger">
                            {data.update}
                          </span>
                        </Link>
                        <Collapse in={state.active === data.title ? true : false}>
                          <ul
                            className={`${
                              menuClass === "mm-collapse" ? "mm-show" : ""
                            }`}
                          >
                            {data.content &&
                              data.content.map((data, index) => {
                                return (
                                  <li
                                    key={index}
                                    className={`${
                                      state.activeSubmenu === data.title
                                        ? "mm-active"
                                        : ""
                                    }`}
                                  >
                                    {data.content && data.content.length > 0 ? (
                                      <>
                                        <Link
                                          to={data.to}
                                          className={
                                            data.hasMenu ? "has-arrow" : ""
                                          }
                                          onClick={() => {
                                            handleSubmenuActive(data.title);
                                          }}
                                        >
                                          {data.title}
                                        </Link>
                                        <Collapse
                                          in={
                                            state.activeSubmenu === data.title
                                              ? true
                                              : false
                                          }
                                        >
                                          <ul
                                            className={`${
                                              menuClass === "mm-collapse"
                                                ? "mm-show"
                                                : ""
                                            }`}
                                          >
                                            {data.content &&
                                              data.content.map((data, index) => {
                                                return (
                                                  <>
                                                    <li key={index}>
                                                      <Link
                                                        className={`${
                                                          path === data.to
                                                            ? "mm-active"
                                                            : ""
                                                        }`}
                                                        to={data.to}
                                                      >
                                                        {data.title}
                                                      </Link>
                                                    </li>
                                                  </>
                                                );
                                              })}
                                          </ul>
                                        </Collapse>
                                      </>
                                    ) : (
                                      <Link to={data.to}>{data.title}</Link>
                                    )}
                                  </li>
                                );
                              })}
                          </ul>
                        </Collapse>
                      </>
                    ) : (
                      <Link to={data.to}>
                        {data.iconStyle}
                        <span className="nav-text">{data.title}</span>
                      </Link>
                    )}
                  </li>
                );
              }
            })}
          </ul>

        </PerfectScrollbar>
      </div>
    );
  };

  export default SideBar;
