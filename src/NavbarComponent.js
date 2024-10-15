import React from "react";
import { Link } from "react-router-dom";

const NavbarComponent = ( {setTheme, theme }) => {

    const handleThemeChange = (e) => {
        const selectedTheme = e.target.value;
        setTheme(selectedTheme);
    };

    const baseColor = theme === 'dark' ? 'bg-darkBlue text-customOrange' : 'bg-customOrange text-darkBlue';
    const borderColor = theme === 'dark' ? 'border-customOrange' : 'border-darkBlue';

    return (
        <nav className={`font-mono shadow flex justify-between items-center py-4 px-8 border rounded-xl mx-[2vw] mt-4 mb-4 ${borderColor}`}>
            <div className={`flex space-x-4 ${baseColor}`}>
                <Link 
                    to="/"
                    className="font-semibold text-lg cursor-pointer"
                >
                    tracker
                </Link>
                <Link
                    to="/stats"
                    className="font-semibold text-lg cursor-pointer"
                >
                    stats
                </Link>
            </div>
        <select
            value={theme}
            onChange={handleThemeChange}
            className={`appearance-none bg-transparent font-semibold cursor-pointer ${baseColor}`}
        >
            <option value="light">light mode</option>
            <option value="dark">dark mode</option>
        </select>     
    </nav>
    );
}

export default NavbarComponent;