import React, { Component } from "react";
import "./App.scss";

import { ReactComponent as MenuBurger } from "./icons/menu.svg";
import { ReactComponent as LeftArrow } from "./icons/left-arrow.svg";
import { ReactComponent as LogoutIcon } from "./icons/logout.svg";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import ClaimsDynamics from "./pages/ClaimsDynamics";
import ClaimsDynamicsByType from "./pages/ClaimsDynamicsByType";
import CallsDynamics from "./pages/CallsDynamics";

import getModules from "./api/getModules";
import MetricsHandbook from "./pages/MetricsHandbook";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modules: [],
      menuShown: true,
      connectionError: false,
      menuItems: [
        {
          name: "Отчеты",
          filterTerm: "",
          items: [
            {
              name: "Обращения",
              items: [
                {
                  name: "Динамика обращений",
                  url: "/claims-dynamics",
                },
                {
                  name: "Динамика обращений по типу",
                  url: "/claims-dynamics-by-type",
                },
                {
                  name: "Обращения в разрезе модулей/компонентов",
                  url: "",
                },
              ],
            },
            {
              name: "Звонки",
              items: [
                {
                  name: "Динамика вызовов",
                  url: "/calls-dynamics",
                },
              ],
            },
            {
              name: "Избранное",
              items: [],
            },
            {
              name: "Специальные отчеты",
              items: [],
            },
            {
              name: "Настройки",
              items: [],
            },
          ],
        },
        {
          name: "Метрики",
          filterTerm: "",
          items: [
            {
              name: "Количественные показатели",
              items: [],
            },
            {
              name: "Временные показатели",
              items: [],
            },
            {
              name: "Метрики",
              items: [],
            },
            {
              name: "Настройки",
              items: [
                {
                  name: "Справочник показателей / метрик",
                  url: "/metrics-handbook",
                },
                {
                  name: "Настройка базовых значений показателей / метрик",
                  url: "/metrics-setup",
                },
              ],
            },
          ],
        },
      ],
    };
  }

  hideMenu = () => {
    this.setState({
      menuShown: false,
    });
  };

  showMenu = () => {
    this.setState({
      menuShown: true,
    });
  };

  handleMenu = () => {
    if (this.state.menuShown) {
      this.hideMenu();
    } else {
      this.showMenu();
    }
  };

  handleMenuFiltering = (category, term) => {
    console.log(
      `Handling menu filtering for category ${category} with term ${term}`
    );

    this.setState((state, props) => {
      const menuItems = state.menuItems;

      const menuItemToChange = menuItems.find((item) => item.name === category);

      if (menuItemToChange) {
        menuItemToChange.filterTerm = term;
      }

      return [...menuItems];
    });
  };

  async componentDidMount() {
    let response = [];

    try {
      response = await getModules();

      this.setState({
        modules: response.data,
      });
    } catch (err) {
      console.error(err);
      this.setState({
        connectionError: true,
      });
    }
  }

  render() {
    const menuItems = this.state.menuItems.map((item) => (
      <div className="menu-item" key={item.name}>
        <div className="menu-item-name">{item.name}</div>
        {item.items && item.items.length ? (
          <div className="menu-item-dropdown">
            <input
              type="text"
              className="menu-item-search"
              placeholder="Поиск"
              onChange={(e) => {
                this.handleMenuFiltering(item.name, e.target.value);
              }}
            />
            {item.items.map((subitem) => (
              <div
                className={`menu-item ${
                  subitem.name.includes(item.filterTerm) ||
                  item.filterTerm === ""
                    ? ""
                    : "hidden"
                }`}
                key={subitem.name}
              >
                <div className="menu-item-text">{subitem.name}</div>
                {subitem.items && subitem.items.length ? (
                  <div className="menu-item-dropdown">
                    {subitem.items.map((subitem) => (
                      <Link
                        key={subitem.name}
                        className="menu-item"
                        to={subitem.url}
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    ));

    return (
      <Router>
        <div className="app">
          <div className="layout-top-panel">
            <button className="menu-btn" onClick={() => this.handleMenu()}>
              <MenuBurger className="menu-btn-icon" />
            </button>
            <button className="logout-btn">
              <span className="logout-btn-content">
                <LogoutIcon className="logout-btn-icon" />
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
                <div className="menu-content">{menuItems}</div>
                <button
                  className="menu-close"
                  onClick={() => this.handleMenu()}
                >
                  <LeftArrow className="menu-close-arrow" />
                </button>
              </nav>
            </div>
            <div className="layout-main">
              <Switch>
                <Route path="/claims-dynamics">
                  <ClaimsDynamics modules={this.state.modules} />
                </Route>
                <Route path="/claims-dynamics-by-type">
                  <ClaimsDynamicsByType modules={this.state.modules} />
                </Route>
                <Route path="/calls-dynamics">
                  <CallsDynamics />
                </Route>
                <Route
                  path="/metrics-handbook"
                  render={(props) => <MetricsHandbook {...props} />}
                ></Route>

                <Route
                  path="/"
                  render={() => {
                    return <Redirect to="/claims-dynamics" />;
                  }}
                />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
