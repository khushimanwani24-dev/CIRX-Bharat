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
} from 'lucide-react';
import { MainNavTab } from './Sidebar';
import { UserRole, ROLE_LABELS } from './Header';

interface TopHeaderProps {
  activeTab: MainNavTab;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onToggleMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  activeRole,
  onRoleChange,
  onToggleMobileMenu,
}) => {
  const currentRoleMeta = ROLE_LABELS[activeRole];

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
          title: 'Nashik Industrial GIS Corridor',
          icon: <MapPin className="w-4 h-4 text-emerald-600" />,
        };
      case 'COMPLIANCE':
        return {
          section: 'SPCB Compliance',
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

      {/* Right: Search Bar + Live Indicator + Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative hidden lg:block w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Quick search corridor..."
            className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 transition"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
        </div>

        {/* Persona Switcher Quick Dropdown */}
        <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${currentRoleMeta.color}`}>
            {currentRoleMeta.badge}
          </span>
          <select
            value={activeRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs max-w-[190px] truncate"
          >
            {Object.entries(ROLE_LABELS).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
