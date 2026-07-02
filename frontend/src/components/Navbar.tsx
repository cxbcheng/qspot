import { useState, useRef, useEffect } from "react";
import "../styles/navbar.css";
import "../styles/dropdown.css";
import {UserProfile} from "../../../shared/types/UserProfile.ts";
import {useLogout} from "../hooks/useLogout.ts";
import { Link } from "react-router-dom";

export function Navbar({ profile }: { profile: UserProfile }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const logout = useLogout();
    const displayName = profile?.display_name ?? "";
    const avatarUrl = profile?.images?.[0]?.url;

    if (!displayName || !avatarUrl) {
        console.error("Failed to display user profile in Navbar.");
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar__logo">
                QSpot
            </Link>
            <div className="navbar__spacer" />
            <div className="navbar__profile-container" ref={menuRef}>
                <button
                    className="navbar__profile-button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                >
                    <div className="navbar__profile">
                        {avatarUrl && (
                            <img
                                src={avatarUrl}
                                alt={displayName}
                                className="navbar__avatar"
                            />
                        )}
                    </div>
                </button>
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <button className="dropdown-menu__item dropdown-menu__item--danger" onClick={logout}>
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}