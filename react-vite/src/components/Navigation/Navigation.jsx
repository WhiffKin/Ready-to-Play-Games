import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <div>
          <li>
            <NavLink to="/characters/new">Create Character</NavLink>
          </li>
          <li>
            <NavLink to="/templates/new">Create Campaign Template/Rooms</NavLink>
          </li>
          <li>
            <NavLink to="/campaigns">Campaigns</NavLink>
          </li>
        </div>
        <div>
          <li>
            <ProfileButton />
          </li>
        </div>
      </ul>
    </nav>
  );
}

export default Navigation;
