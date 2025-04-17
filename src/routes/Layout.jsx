import { Outlet, NavLink } from "react-router-dom";
import ParticlesBackground from "../particlesbackground";
import "./Layout.css";

const Layout = () => {
  return (
    <div className="layout-container">
      <ParticlesBackground />
      <aside className="sidebar">
        <h1 className="logo">WeatherDash</h1>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/trend"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Temp Trend
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/comparison"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Temp Comp
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
