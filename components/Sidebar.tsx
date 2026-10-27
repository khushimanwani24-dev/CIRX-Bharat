'use client';

import React from 'react';
import {
  RotateCw,
  LayoutDashboard,
  ArrowLeftRight,
  FilePlus2,
  MapPin,
  Scale,
  Cpu,
  RefreshCcw,
  Building2,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { UserRole, ROLE_LABELS } from './Header';
import { useAuth } from '@/lib/authContext';

export type MainNavTab = 'DASHBOARD' | 'MATCHES' | 'INGEST' | 'MAP' | 'COMPLIANCE';

interface SidebarProps {
  activeTab: MainNavTab;
  onTabChange: (tab: MainNavTab) => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSpecs: () => void;
  onResetData: () => void;
  matchCount: number;
  manifestCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  activeRole,
  onRoleChange,
  onOpenSpecs,
  onResetData,
  matchCount,
  manifestCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const currentRoleMeta = ROLE_LABELS[activeRole];

  const navItems: { id: MainNavTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'DASHBOARD',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'MATCHES',
      label: 'Exchange Hub',
      icon: <ArrowLeftRight className="w-4 h-4" />,
      badge: matchCount,
    },
    {
      id: 'INGEST',
      label: 'Ingestion Portal',
      icon: <FilePlus2 className="w-4 h-4" />,
      badge: 'Wizard',
    },
    {
      id: 'MAP',
      label: 'Corridor Map',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: 'COMPLIANCE',
      label: 'SPCB Compliance',
      icon: <Scale className="w-4 h-4" />,
      badge: manifestCount,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Vertical Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* TOP BRAND */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
              <RotateCw className="w-4 h-4 text-white" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-slate-900 tracking-tight font-sans">
                  ReBharat
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Ahmedabad (Vatva & Naroda GIDC)
              </p>
            </div>
          </div>
        </div>

        {/* PRIMARY NAVIGATION */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Workspace
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* BOTTOM SIDEBAR / FOOTER */}
        <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
          {/* Technical Specs Trigger */}
          <button
            onClick={onOpenSpecs}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition"
          >
            <div className="flex items-center gap-2.5">
              <Cpu className="w-3.5 h-3.5 text-slate-500" />
              <span>Technical Specs & Math</span>
            </div>
            <span className="text-[10px] text-slate-400">CPCB/Algo</span>
          </button>

          {/* Reset Seed Data */}
          <button
            onClick={onResetData}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition"
          >
            <div className="flex items-center gap-2.5">
              <RefreshCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Seed Fixtures</span>
            </div>
            <span className="text-[10px] text-slate-400">v2.4</span>
          </button>

          {/* User Persona / Authenticated Facility Card */}
          <div className="pt-2">
            {isAuthenticated && user ? (
              <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Facility Session</span>
                  </div>
                  <span className="font-mono text-[9px] bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                    {user.maskedLabel}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-900 truncate" title={user.facilityName}>
                    {user.facilityName}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {user.clusterZone}
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                      user.role === 'GENERATOR'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : user.role === 'OFFTAKER'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    }`}
                  >
                    {user.role}
                  </span>
                  <button
                    onClick={logout}
                    className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Guest Preview Mode</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Sign in or register an industrial unit to list streams and transact.
                </p>
                <button
                  onClick={() => openAuthModal('SIGN_IN')}
                  className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition"
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
