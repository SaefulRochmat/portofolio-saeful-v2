"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, User, GraduationCap, Briefcase, Code, FolderKanban, FileText } from "lucide-react";
import UserGreetText from "../UserGreetText";
import LoginButton from "../LoginLogoutButton";

// Types
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  classes?: string;
}

interface BurgerProps {
  onClick: () => void;
  expanded?: boolean;
}

interface CloseBtnProps {
  onClick: () => void;
}

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface TopbarProps {
  onOpenSidebar: () => void;
  title: string;
  expanded: boolean;
}

interface AdminTemplateProps {
  children: React.ReactNode;
  title?: string;
}

// NavLink Component
function NavLink({ classes = "", href, children, icon }: NavLinkProps) {
  return (
    <Link
      className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 hover:shadow-sm hover:translate-x-1 active:scale-[0.98] ${classes}`}
      href={href}
    >
      {icon && <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
}

// Burger Menu Button
function Burger({ onClick, expanded = false }: BurgerProps) {
  return (
    <button
      aria-label="Toggle sidebar"
      aria-expanded={expanded}
      aria-controls="admin-sidebar"
      title={expanded ? "Close sidebar" : "Open sidebar"}
      className="inline-flex items-center justify-center rounded-xl p-2.5 text-gray-700 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 hover:shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={onClick}
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}

// Close Button
function CloseBtn({ onClick }: CloseBtnProps) {
  return (
    <button
      aria-label="Close sidebar"
      className="absolute right-4 top-4 rounded-xl p-2 text-gray-600 transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:rotate-90 active:scale-90 focus:outline-none focus:ring-2 focus:ring-red-500 md:hidden"
      onClick={onClick}
    >
      <X className="h-5 w-5" />
    </button>
  );
}

// Sidebar Component
function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen && typeof window !== "undefined" && typeof document !== "undefined") {
      document.addEventListener("keydown", onEsc);
      return () => document.removeEventListener("keydown", onEsc);
    }
  }, [mobileOpen, setMobileOpen]);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/dashboard/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    { href: "/dashboard/education", label: "Education", icon: <GraduationCap className="h-5 w-5" /> },
    { href: "/dashboard/experience", label: "Experience", icon: <Briefcase className="h-5 w-5" /> },
    { href: "/dashboard/skills", label: "Skills", icon: <Code className="h-5 w-5" /> },
    { href: "/dashboard/projects", label: "Projects", icon: <FolderKanban className="h-5 w-5" /> },
    { href: "/dashboard/documents", label: "Documents", icon: <FileText className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-gray-200/80 bg-white shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out will-change-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-200/80 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-lg">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <span className="text-lg font-bold text-white">Admin Panel</span>
            <CloseBtn onClick={() => setMobileOpen(false)} />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200/80 bg-gradient-to-r from-gray-50 to-gray-100 p-4">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs font-medium text-gray-600">Need help?</p>
              <p className="text-xs text-gray-500 mt-1">Contact support team</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Topbar Component
function Topbar({ onOpenSidebar, title, expanded }: TopbarProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current || !btnRef.current) return;
      if (!menuRef.current.contains(e.target as Node) && !btnRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <Burger onClick={onOpenSidebar} expanded={expanded} />
        
        <div className="ml-auto relative">
          <button
            ref={btnRef}
            onClick={() => setOpenMenu((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={openMenu}
            className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 text-gray-700 shadow-sm transition-all duration-300 hover:shadow-md hover:from-blue-50 hover:to-indigo-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <UserGreetText />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${openMenu ? "rotate-180" : ""}`}
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.939l3.71-3.71a.75.75 0 1 1 1.06 1.061l-4.24 4.24a.75.75 0 0 1-1.06 0L5.25 8.29a.75.75 0 0 1-.02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Dropdown */}
          <div
            ref={menuRef}
            className={`absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xl transition-all duration-300 ${
              openMenu ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
            }`}
            role="menu"
          >
            <div className="p-2">
              <LoginButton/>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Main Admin Template
export default function AdminTemplate({ children, title = "Dashboard" }: AdminTemplateProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(min-width: 768px)");
      setMobileOpen(mq.matches);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main
        className={`transition-all duration-300 ease-out ${
          mobileOpen ? "md:pl-72" : "md:pl-0"
        }`}
      >
        <Topbar title={title} onOpenSidebar={() => setMobileOpen((v) => !v)} expanded={mobileOpen} />

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}