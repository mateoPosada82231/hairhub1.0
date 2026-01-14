"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCalendarDays,
  faHeart,
  faUser,
  faStore,
  faBars,
  faXmark,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  href: string;
  label: string;
  icon: typeof faHouse;
  authRequired?: boolean;
}

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isOwner = user?.role === "OWNER";

  const navItems: NavItem[] = [
    { href: "/", label: "Inicio", icon: faHouse },
    { href: "/mis-citas", label: "Mis Citas", icon: faCalendarDays, authRequired: true },
    { href: "/favoritos", label: "Favoritos", icon: faHeart, authRequired: true },
    { href: "/perfil", label: "Perfil", icon: faUser, authRequired: true },
  ];

  // Agregar "Mi Negocio" solo para owners
  if (isOwner) {
    navItems.push({ href: "/mi-negocio", label: "Mi Negocio", icon: faStore, authRequired: true });
  }

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <span className="navbar-logo-text">BOOKHUB</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            {navItems.map((item) => {
              if (item.authRequired && !isAuthenticated) return null;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`navbar-link ${isActive ? "navbar-link-active" : ""}`}
                >
                  <FontAwesomeIcon icon={item.icon} className="navbar-link-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {isAuthenticated ? (
              <button onClick={handleLogout} className="navbar-link navbar-logout">
                <FontAwesomeIcon icon={faRightFromBracket} className="navbar-link-icon" />
                <span>Salir</span>
              </button>
            ) : (
              <Link href="/login" className="navbar-login-btn">
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="navbar-mobile-toggle"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <FontAwesomeIcon
              icon={isMobileMenuOpen ? faXmark : faBars}
              className="navbar-mobile-toggle-icon"
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile">
          <div className="navbar-mobile-links">
            {navItems.map((item) => {
              if (item.authRequired && !isAuthenticated) return null;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`navbar-mobile-link ${isActive ? "navbar-mobile-link-active" : ""}`}
                >
                  <FontAwesomeIcon icon={item.icon} className="navbar-mobile-link-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {isAuthenticated ? (
              <button onClick={handleLogout} className="navbar-mobile-link navbar-mobile-logout">
                <FontAwesomeIcon icon={faRightFromBracket} className="navbar-mobile-link-icon" />
                <span>Cerrar Sesión</span>
              </button>
            ) : (
              <Link href="/login" onClick={closeMobileMenu} className="navbar-mobile-login-btn">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
