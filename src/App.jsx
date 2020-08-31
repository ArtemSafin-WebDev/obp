import React, { Component } from "react";
import "./App.scss";

import { v4 as uuidv4 } from "uuid";

import { ReactComponent as MenuBurger } from "./icons/menu.svg";
import { ReactComponent as LeftArrow } from "./icons/left-arrow.svg";
import { ReactComponent as LogoutIcon } from "./icons/logout.svg";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ClaimsDynamics from "./pages/ClaimsDynamics";
import ClaimsDynamicsByType from "./pages/ClaimsDynamicsByType";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeMenuId: null,
      activeSubmenuId: null,

      menuShown: true,
      menuItems: [
        {
          id: uuidv4(),
          name: "Отчеты",
          submenu: [
            {
              id: uuidv4(),
              name: "Обращения",
              submenu: [
                {
                  id: uuidv4(),
                  name: "Динамика обращений",
                  url: "/",
                 
                },
                {
                  id: uuidv4(),
                  name: "Динамика обращений по типу",
                  url: "/claims-dynamics-by-type",
                },
              ],
            },
            {
              id: uuidv4(),
              name: "Звонки",
            },
          ],
        },
        {
          id: uuidv4(),
          name: "Метрики",
        },
      ],
    };
  }

  handleMenuClick = (id) => {
    this.setState({
      activeMenuId: id,
    });
  };
  handleSubMenuClick = (id) => {
    this.setState({
      activeSubmenuId: id,
    });
  };

  hideMenu = () => {
    this.setState({
      menuShown: false,
      activeSubmenuId: null,
      activeMenuId: null,
    });
  };

  showMenu = () => {
    this.setState({
      menuShown: true,
    });
  };

  render() {
    return (
      <Router>
        <div className="app">
          <div className="layout-top-panel">
            <button className="menu-btn" onClick={() => this.showMenu()}>
              <MenuBurger className="menu-btn-icon" />
            </button>
            <button className="logout-btn">
              <span className="logout-btn-content">
                <LogoutIcon className="logout-btn-icon"/>
              Выйти
              </span>
            
            </button>
          </div>
          <div className="layout-row">
            <div
              className={`layout-sidebar ${
                this.state.menuShown ? "" : "hidden"
              }`}
            >
              <nav className="menu">
                <ul className="menu-list">
                  {this.state.menuItems.map((item) => (
                    <li
                      className={`menu-list-item ${
                        this.state.activeMenuId === item.id ? "active" : ""
                      }`}
                      key={item.id}
                    >
                      <div
                        className="menu-item-link"
                        onClick={() => this.handleMenuClick(item.id)}
                      >
                        {item.name}
                      </div>

                      {item.submenu && (
                        <ul className="submenu-list">
                          {item.submenu.map((submenuItem) => (
                            <li
                              className={`submenu-list-item ${
                                this.state.activeSubmenuId === submenuItem.id
                                  ? "active"
                                  : ""
                              }`}
                              key={submenuItem.id}
                            >
                              <div
                                className="submenu-item-link"
                                onClick={() =>
                                  this.handleSubMenuClick(submenuItem.id)
                                }
                              >
                                {submenuItem.name}
                              </div>
                              {submenuItem.submenu && (
                                <ul className="submenu-list">
                                  {submenuItem.submenu.map((item) => (
                                    <li
                                      className="submenu-list-item"
                                      key={item.id}
                                      onClick={() => this.hideMenu()}
                                    >
                                      {console.log({
                                        item
                                      })}
                                      <Link to={item.url} className="submenu-item-link">{item.name}</Link>
                                      
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
                <button className="menu-close" onClick={() => this.hideMenu()}>
                  <LeftArrow className="menu-close-arrow" />
                </button>
              </nav>
            </div>
            <div className="layout-main">
              <Switch>
                <Route path="/claims-dynamics-by-type">
                  <ClaimsDynamicsByType/>
                </Route>
                <Route path="/">
                  <ClaimsDynamics/>
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
