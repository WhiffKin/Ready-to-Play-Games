import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/users">Users</NavLink>
      </li>
      <li>
        <NavLink to="/characters">Characters</NavLink>
      </li>
      <li>
        <NavLink to="/characters/new">Create Character</NavLink>
      </li>
      <li>
        <NavLink to="/templates">Campaign Templates</NavLink>
      </li>
      <li>
        <NavLink to="/templates/new">Create Campaign Template/Rooms</NavLink>
      </li>
      <li>
        <NavLink to="/campaigns">Campaigns</NavLink>
      </li>
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
