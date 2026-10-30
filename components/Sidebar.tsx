'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutGrid,
  ArrowLeftRight,
  Sparkles,
  ClipboardList,
  MessageSquareQuote,
  Tags,
  Truck,
  ShieldCheck,
  FolderLock,
  MessageSquare,
  BarChart3,
  Settings,
  Building2,
  Tag,
  FileSearch,
  ClipboardCheck,
  Scroll,
  ChevronDown,
  Check,
  LogOut,
  Building,
} from 'lucide-react';
import { UserRole } from './Header';
import { useAuth } from '@/lib/authContext';

export type MainNavTab =
  | 'DASHBOARD'
  | 'EXCHANGE'
  | 'MATCHES'
  | 'REQUIREMENTS'
  | 'ENQUIRIES'
  | 'TRANSACTIONS'
  | 'LOGISTICS'
  | 'COMPLIANCE'
  | 'DOCUMENTS'
  | 'MESSAGES'
  | 'ANALYTICS'
  | 'SETTINGS'
  | 'ADMIN_OVERVIEW'
  | 'ADMIN_ORGANISATIONS'
  | 'ADMIN_MODERATION'
  | 'ADMIN_REVIEW'
  | 'ADMIN_OVERSIGHT'
  | 'ADMIN_AUDIT'
  // Legacy aliases
  | 'INGEST'
  | 'MAP';

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

interface NavItemDef {
  id: MainNavTab;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
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
  const { user, isAuthenticated, quickLogin, logout } = useAuth();
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOrgDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine current active organisation display name
  const currentOrgName =
    user?.facilityName || 'Demo Logistics Services';

  // Determine organisation owner / role label
  const currentRoleLabel = user?.role
    ? `${user.role} OWNER`
    : 'ORGANISATION OWNER';

  // Available organisations for switching
  const organisations = [
    {
      id: 'VATVA',
      name: 'Vatva Specialty Dye-Chem',
      role: 'ORGANISATION OWNER (GENERATOR)',
      zone: 'Vatva GIDC Phase-III',
    },
    {
      id: 'CEMENT',
      name: 'Gujarat Co-Processing Kilns',
      role: 'ORGANISATION OWNER (OFFTAKER)',
      zone: 'Sanand / Kathwada Corridor',
    },
    {
      id: 'DEMO_LOGISTICS',
      name: 'Demo Logistics Services',
      role: 'ORGANISATION OWNER (CARRIER)',
      zone: 'Ahmedabad HazTrans Fleet',
    },
    {
      id: 'GPCB',
      name: 'GPCB Regional Office',
      role: 'ENVIRONMENTAL REGULATOR',
      zone: 'GPCB XGN Monitoring Cell',
    },
  ];

  // Workspace Nav Items (matches user screenshot exactly)
  const workspaceItems: NavItemDef[] = [
    {
      id: 'DASHBOARD',
      label: 'Dashboard',
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      id: 'EXCHANGE',
      label: 'Material exchange',
      icon: <ArrowLeftRight className="w-4 h-4" />,
    },
    {
      id: 'MATCHES',
      label: 'Matches',
      icon: <Sparkles className="w-4 h-4" />,
      badge: matchCount > 0 ? matchCount : undefined,
    },
    {
      id: 'REQUIREMENTS',
      label: 'Requirements',
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      id: 'ENQUIRIES',
      label: 'Enquiries & offers',
      icon: <MessageSquareQuote className="w-4 h-4" />,
    },
    {
      id: 'TRANSACTIONS',
      label: 'Transactions',
      icon: <Tags className="w-4 h-4" />,
    },
    {
      id: 'LOGISTICS',
      label: 'Logistics',
      icon: <Truck className="w-4 h-4" />,
    },
    {
      id: 'COMPLIANCE',
      label: 'Compliance centre',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: manifestCount > 0 ? manifestCount : undefined,
    },
    {
      id: 'DOCUMENTS',
      label: 'Documents',
      icon: <FolderLock className="w-4 h-4" />,
    },
    {
      id: 'MESSAGES',
      label: 'Messages',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: 'ANALYTICS',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'SETTINGS',
      label: 'Organisation settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  // Platform Administration Nav Items (matches user screenshot exactly)
  const adminItems: NavItemDef[] = [
    {
      id: 'ADMIN_OVERVIEW',
      label: 'Platform overview',
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      id: 'ADMIN_ORGANISATIONS',
      label: 'Organisations',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'ADMIN_MODERATION',
      label: 'Listing moderation',
      icon: <Tag className="w-4 h-4" />,
    },
    {
      id: 'ADMIN_REVIEW',
      label: 'Review queue',
      icon: <FileSearch className="w-4 h-4" />,
    },
    {
      id: 'ADMIN_OVERSIGHT',
      label: 'Transaction oversight',
      icon: <ClipboardCheck className="w-4 h-4" />,
    },
    {
      id: 'ADMIN_AUDIT',
      label: 'Audit log',
      icon: <Scroll className="w-4 h-4" />,
    },
  ];

  // Helper to check if item is currently active (supporting legacy aliases)
  const isItemActive = (id: MainNavTab) => {
    if (activeTab === id) return true;
    if (id === 'EXCHANGE' && activeTab === 'INGEST') return true;
    if (id === 'LOGISTICS' && activeTab === 'MAP') return true;
    return false;
  };

  const handleSelectNav = (id: MainNavTab) => {
    onTabChange(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Dark Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d141f] text-slate-300 flex flex-col justify-between border-r border-[#1a2332] transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {/* Top Section: ACTIVE ORGANISATION */}
          <div className="px-1" ref={dropdownRef}>
            <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2">
              ACTIVE ORGANISATION
            </div>

            {/* Dropdown Box */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOrgDropdownOpen((prev) => !prev)}
                className="w-full bg-[#16202e] hover:bg-[#1a2637] border border-[#263245] rounded-lg px-3 py-2.5 text-left flex items-center justify-between transition group shadow-xs"
              >
                <span className="text-[13px] font-medium text-slate-100 truncate pr-2">
                  {currentOrgName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-transform ${
                    isOrgDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Sub-label */}
              <div className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mt-1.5 px-0.5">
                {currentRoleLabel}
              </div>

              {/* Switcher Dropdown Popover */}
              {isOrgDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#16202e] border border-[#2a374c] rounded-lg shadow-2xl py-1 text-xs overflow-hidden">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#223044]">
                    Switch Organisation
                  </div>
                  {organisations.map((org) => {
                    const isCurrent =
                      (user?.facilityName && user.facilityName.includes(org.name)) ||
                      (!user && org.id === 'DEMO_LOGISTICS');

                    return (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() => {
                          if (org.id === 'VATVA') quickLogin('VATVA');
                          else if (org.id === 'CEMENT') quickLogin('CEMENT');
                          else if (org.id === 'GPCB') quickLogin('GPCB');
                          else logout(); // Demo logistics default
                          setIsOrgDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#1f2d40] transition ${
                          isCurrent ? 'bg-[#1a2535] text-white font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="truncate text-xs">{org.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{org.zone}</div>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Section 1: WORKSPACE */}
          <div>
            <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest px-3 mb-1.5">
              WORKSPACE
            </div>

            <nav className="space-y-0.5">
              {workspaceItems.map((item) => {
                const active = isItemActive(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectNav(item.id)}
                    className={`relative w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-normal transition text-left group ${
                      active
                        ? 'bg-[#182334] text-white font-medium'
                        : 'text-[#94a3b8] hover:text-white hover:bg-[#141d2c]'
                    }`}
                  >
                    {/* Left Active Orange Bar (matches screenshot) */}
                    {active && (
                      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange-500 rounded-r" />
                    )}

                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`shrink-0 transition ${
                          active ? 'text-white' : 'text-[#94a3b8] group-hover:text-white'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#223147] text-slate-200">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section 2: PLATFORM ADMINISTRATION */}
          <div>
            <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest px-3 mb-1.5">
              PLATFORM ADMINISTRATION
            </div>

            <nav className="space-y-0.5">
              {adminItems.map((item) => {
                const active = isItemActive(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectNav(item.id)}
                    className={`relative w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-normal transition text-left group ${
                      active
                        ? 'bg-[#182334] text-white font-medium'
                        : 'text-[#94a3b8] hover:text-white hover:bg-[#141d2c]'
                    }`}
                  >
                    {/* Left Active Orange Bar */}
                    {active && (
                      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange-500 rounded-r" />
                    )}

                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`shrink-0 transition ${
                          active ? 'text-white' : 'text-[#94a3b8] group-hover:text-white'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Discrete Footer Utility */}
        <div className="p-3 border-t border-[#1a2332] bg-[#0b1018] flex items-center justify-between text-xs text-slate-400">
          <Link
            href="/presentation"
            className="hover:text-white text-[11px] font-medium transition"
          >
            Slides
          </Link>
          <button
            onClick={onOpenSpecs}
            className="hover:text-white text-[11px] font-medium transition"
          >
            Algo Specs
          </button>
          <button
            onClick={onResetData}
            className="hover:text-white text-[11px] font-medium transition"
          >
            Reset Seed
          </button>
        </div>
      </aside>
    </>
  );
};
