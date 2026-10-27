'use client';

import React from 'react';
import {
  Menu,
  Search,
  Bell,
  ShieldCheck,
  ChevronRight,
  LayoutDashboard,
  ArrowLeftRight,
  FilePlus2,
  MapPin,
  Scale,
  CheckCircle2,
  LogOut,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { MainNavTab } from './Sidebar';
import { UserRole } from './Header';
import { useAuth } from '@/lib/authContext';

interface TopHeaderProps {
  activeTab: MainNavTab;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onToggleMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onToggleMobileMenu,
}) => {
  const { user, isAuthenticated, openAuthModal, logout, quickLogin } = useAuth();

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return {
          section: 'Industrial Symbiosis Grid',
          title: 'Executive Overview',
          icon: <LayoutDashboard className="w-4 h-4 text-emerald-600" />,
        };
      case 'MATCHES':
        return {
          section: 'Exchange Hub',
          title: 'Bilateral Algorithmic Matches',
          icon: <ArrowLeftRight className="w-4 h-4 text-emerald-600" />,
        };
      case 'INGEST':
        return {
          section: 'Stream Ingestion',
          title: '3-Step Intake Wizard',
          icon: <FilePlus2 className="w-4 h-4 text-emerald-600" />,
        };
      case 'MAP':
        return {
          section: 'Geospatial Grid',
          title: 'Ahmedabad Industrial GIS Corridor',
          icon: <MapPin className="w-4 h-4 text-emerald-600" />,
        };
      case 'COMPLIANCE':
        return {
          section: 'GPCB Compliance',
          title: 'Form 10 Manifests & Form 4 Returns',
          icon: <Scale className="w-4 h-4 text-purple-600" />,
        };
      default:
        return {
          section: 'Platform',
          title: 'Workspace',
          icon: <LayoutDashboard className="w-4 h-4 text-emerald-600" />,
        };
    }
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 md:hidden transition"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hidden sm:flex">
            {breadcrumb.icon}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium hidden sm:inline">
              {breadcrumb.section}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">
              {breadcrumb.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Search Bar + Notifications + Authenticated Facility or Sign In Gate */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative hidden xl:block w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search corridor..."
            className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 transition"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
        </div>

        {/* Auth State & Header Badge Integration */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            {/* Authenticated Facility Name Badge */}
            <div className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-xl px-3 py-1.5 transition shadow-2xs max-w-[220px] sm:max-w-xs md:max-w-sm">
              <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-xs font-bold text-slate-900 truncate"
                    title={user.facilityName}
                  >
                    {user.facilityName}
                  </span>
                  {/* Masked ID Tag */}
                  <span
                    className="font-mono text-[10px] bg-white border border-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold flex-shrink-0"
                    title="Anonymized Cluster Identifier"
                  >
                    {user.maskedLabel}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 truncate">
                  <span
                    className={`font-semibold uppercase text-[9px] px-1 rounded ${
                      user.role === 'GENERATOR'
                        ? 'bg-amber-100 text-amber-800'
                        : user.role === 'OFFTAKER'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {user.role}
                  </span>
                  <span>•</span>
                  <span className="truncate">{user.clusterZone}</span>
                </div>
              </div>

              {/* Fast Sandbox Switcher Popover / Select for testing */}
              <div className="relative group">
                <button
                  type="button"
                  title="Switch testing facility"
                  className="p-1 rounded-md hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute right-0 top-full mt-1.5 w-60 p-2 bg-white rounded-xl border border-slate-200 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50 text-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Quick Switch Sandbox Facility
                  </div>
                  <button
                    onClick={() => quickLogin('VATVA')}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-800 font-medium flex items-center justify-between"
                  >
                    <span className="truncate">Vatva Dye-Chem</span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded">Generator</span>
                  </button>
                  <button
                    onClick={() => quickLogin('CEMENT')}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-800 font-medium flex items-center justify-between"
                  >
                    <span className="truncate">Gujarat Cement</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded">Offtaker</span>
                  </button>
                  <button
                    onClick={() => quickLogin('GPCB')}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-800 font-medium flex items-center justify-between"
                  >
                    <span className="truncate">GPCB Regional Officer</span>
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1 rounded">Regulator</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Log Out Button */}
            <button
              onClick={logout}
              title="Log out and return to guest view"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-xs font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        ) : (
          /* Logged Out / Guest View */
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Guest View
            </span>

            <button
              onClick={() => openAuthModal('SIGN_IN')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Sign In / Register Facility</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
