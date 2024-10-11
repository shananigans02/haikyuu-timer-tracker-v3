import React from "react";
import { Link } from "react-router-dom";

const NavbarComponent = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Timer</Link></li>
                <li><Link to="/stats">Stats</Link></li>
            </ul>
        </nav>
    );
}

export default NavbarComponent;