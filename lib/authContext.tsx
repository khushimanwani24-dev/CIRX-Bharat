'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/components/Header';
import { Facility } from '@/types';

export type AuthRole = 'GENERATOR' | 'OFFTAKER' | 'REGULATOR' | 'TRANSPORTER';

export interface UserProfile {
  id: string;
  email: string;
  role: AuthRole;
  facilityName: string;
  maskedLabel: string;
  gstin: string;
  gpcbConsentId: string;
  clusterZone: string;
  facilityId?: string;
  activeRole: UserRole;
  verified?: boolean;
}

export interface RegisterFacilityInput {
  legalName: string;
  corporateEmail: string;
  clusterZone: 'GIDC Vatva Phase-III' | 'GIDC Naroda' | 'GIDC Kathwada' | 'Sanand / Sarkhej Corridor';
  gstin: string;
  gpcbConsentId: string;
  role: 'GENERATOR' | 'OFFTAKER';
}

export const SANDBOX_PRESETS: Record<'VATVA' | 'CEMENT' | 'GPCB', UserProfile> = {
  VATVA: {
    id: 'user-fac-gen-01',
    email: 'operations@vatvadyechem.com',
    role: 'GENERATOR',
    facilityName: 'Vatva Specialty Dye-Chem Industries Pvt. Ltd.',
    maskedLabel: 'GIDC-Vatva-Unit-09',
    gstin: '24AABCV5412K1ZT',
    gpcbConsentId: 'GPCB/AHM-EAST/CCA-5412',
    clusterZone: 'GIDC Vatva Phase-III',
    facilityId: 'fac-gen-01',
    activeRole: 'GEN_PRECISION',
    verified: true,
  },
  CEMENT: {
    id: 'user-fac-off-02',
    email: 'circularity@gujaratcement.in',
    role: 'OFFTAKER',
    facilityName: 'Gujarat Regional Cement & Grinding Terminal',
    maskedLabel: 'Sanand-Grinding-Sink-08',
    gstin: '24AAACG1142J1Z8',
    gpcbConsentId: 'GPCB/AHM-WEST/CCA-1142',
    clusterZone: 'Sanand / Sarkhej Corridor',
    facilityId: 'fac-off-02',
    activeRole: 'OFF_CEMENT',
    verified: true,
  },
  GPCB: {
    id: 'user-gpcb-01',
    email: 'inspector.vatva@gpcb.gov.in',
    role: 'REGULATOR',
    facilityName: 'Gujarat Pollution Control Board (Ahmedabad East)',
    maskedLabel: 'GPCB-RO-AHM-01',
    gstin: '24GPCB00000A1Z5',
    gpcbConsentId: 'GPCB/AUDIT/RO-EAST',
    clusterZone: 'GIDC Vatva Phase-III',
    activeRole: 'REGULATOR_SPCB',
    verified: true,
  },
};

interface AuthContextType {
  user: UserProfile | null;
  registeredFacilities: Facility[];
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'SIGN_IN' | 'REGISTER';
  openAuthModal: (tab?: 'SIGN_IN' | 'REGISTER') => void;
  closeAuthModal: () => void;
  loginWithEmail: (email: string, password?: string) => Promise<boolean>;
  quickLogin: (presetKey: 'VATVA' | 'CEMENT' | 'GPCB') => void;
  registerFacility: (data: RegisterFacilityInput) => Promise<UserProfile>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'rebharat_auth_session';
const REGISTERED_FACILITIES_KEY = 'rebharat_registered_facilities';
const REGISTERED_FULL_FACILITIES_KEY = 'rebharat_registered_full_facilities';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [registeredFacilities, setRegisteredFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'SIGN_IN' | 'REGISTER'>('SIGN_IN');

  // Hydrate session and facilities from localStorage safely on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        if (parsed && parsed.id && parsed.facilityName) {
          setUser(parsed);
        }
      }

      const storedFacs = localStorage.getItem(REGISTERED_FULL_FACILITIES_KEY);
      if (storedFacs) {
        const parsedFacs = JSON.parse(storedFacs) as Facility[];
        if (Array.isArray(parsedFacs)) {
          setRegisteredFacilities(parsedFacs);
        }
      }
    } catch (e) {
      console.warn('Failed to hydrate auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserSession = (newUser: UserProfile | null) => {
    setUser(newUser);
    if (newUser) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      } catch (e) {
        console.warn('Failed to save auth session:', e);
      }
    } else {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to clear auth session:', e);
      }
    }
  };

  const openAuthModal = (tab: 'SIGN_IN' | 'REGISTER' = 'SIGN_IN') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const quickLogin = (presetKey: 'VATVA' | 'CEMENT' | 'GPCB') => {
    const preset = SANDBOX_PRESETS[presetKey];
    if (preset) {
      saveUserSession(preset);
      closeAuthModal();
    }
  };

  const loginWithEmail = async (email: string): Promise<boolean> => {
    const trimmed = email.trim().toLowerCase();

    // Check predefined sandbox presets
    if (trimmed.includes('vatva') || trimmed.includes('dyechem')) {
      quickLogin('VATVA');
      return true;
    }
    if (trimmed.includes('cement') || trimmed.includes('gujaratcement')) {
      quickLogin('CEMENT');
      return true;
    }
    if (trimmed.includes('gpcb') || trimmed.includes('inspector') || trimmed.includes('regulator')) {
      quickLogin('GPCB');
      return true;
    }

    // Check locally registered facilities
    try {
      const storedRegs = localStorage.getItem(REGISTERED_FACILITIES_KEY);
      if (storedRegs) {
        const list = JSON.parse(storedRegs) as UserProfile[];
        const found = list.find((u) => u.email.toLowerCase() === trimmed);
        if (found) {
          saveUserSession(found);
          closeAuthModal();
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Fallback: create dynamic session for custom industrial email
    const isOfftaker = trimmed.includes('cement') || trimmed.includes('infra') || trimmed.includes('brick');
    const role: AuthRole = isOfftaker ? 'OFFTAKER' : 'GENERATOR';
    const fallbackProfile: UserProfile = {
      id: `user-custom-${Date.now().toString().slice(-5)}`,
      email: trimmed,
      role,
      facilityName: trimmed.split('@')[0].replace(/[._-]/g, ' ').toUpperCase() + ' INDUSTRIES',
      maskedLabel: `GIDC-Vatva-Unit-${Math.floor(10 + Math.random() * 89)}`,
      gstin: '24AAACF' + Math.floor(1000 + Math.random() * 9000) + 'K1Z5',
      gpcbConsentId: 'GPCB/AHM/CCA-' + Math.floor(1000 + Math.random() * 9000),
      clusterZone: 'GIDC Vatva Phase-III',
      activeRole: isOfftaker ? 'OFF_CEMENT' : 'GEN_PRECISION',
      verified: true,
    };
    saveUserSession(fallbackProfile);
    closeAuthModal();
    return true;
  };

  const registerFacility = async (data: RegisterFacilityInput): Promise<UserProfile> => {
    // Generate clean masked label according to industrial estate
    let prefix = 'GIDC-Vatva-Unit-';
    let defaultLat = 22.9562;
    let defaultLng = 72.6315;

    if (data.clusterZone.includes('Naroda')) {
      prefix = 'GIDC-Naroda-Unit-';
      defaultLat = 23.0784;
      defaultLng = 72.6512;
    } else if (data.clusterZone.includes('Kathwada')) {
      prefix = data.role === 'OFFTAKER' ? 'Kathwada-Infra-Sink-' : 'Kathwada-Unit-';
      defaultLat = 23.0381;
      defaultLng = 72.6894;
    } else if (data.clusterZone.includes('Sanand')) {
      prefix = data.role === 'OFFTAKER' ? 'Sanand-Grinding-Sink-' : 'Sanand-Unit-';
      defaultLat = 22.9814;
      defaultLng = 72.4412;
    }

    const randomSuffix = Math.floor(10 + Math.random() * 89).toString();
    const maskedLabel = `${prefix}${randomSuffix}`;
    const facilityId = `fac-reg-${Date.now().toString().slice(-5)}`;

    const newProfile: UserProfile = {
      id: `user-${facilityId}`,
      email: data.corporateEmail.trim().toLowerCase(),
      role: data.role,
      facilityName: data.legalName.trim(),
      maskedLabel,
      gstin: data.gstin.trim().toUpperCase(),
      gpcbConsentId: data.gpcbConsentId.trim().toUpperCase(),
      clusterZone: data.clusterZone,
      facilityId,
      activeRole: data.role === 'GENERATOR' ? 'GEN_PRECISION' : 'OFF_CEMENT',
      verified: true,
    };

    // Construct full facility object for map and platform ledger
    const newFacility: Facility = {
      id: facilityId,
      legal_name: data.legalName.trim(),
      anonymous_label: maskedLabel,
      gstin: data.gstin.trim().toUpperCase(),
      spcb_consent_id: data.gpcbConsentId.trim().toUpperCase(),
      cluster_zone: `${data.clusterZone}, Ahmedabad`,
      coordinates: {
        lat: defaultLat + (Math.random() - 0.5) * 0.005,
        lng: defaultLng + (Math.random() - 0.5) * 0.005,
      },
      contact_person: 'EHS & Plant Operations Head',
      contact_phone: '+91 98250 ' + Math.floor(10000 + Math.random() * 89999),
      contact_email: data.corporateEmail.trim(),
      verified: true,
      facility_type: data.role,
      industry_sector:
        data.role === 'GENERATOR'
          ? 'Specialty Chemicals & Secondary Byproducts'
          : 'Circular Raw Materials & Processing Infrastructure',
    };

    // Save to registered facilities history
    try {
      const existing = localStorage.getItem(REGISTERED_FACILITIES_KEY);
      const list = existing ? JSON.parse(existing) : [];
      list.push(newProfile);
      localStorage.setItem(REGISTERED_FACILITIES_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to store registered facility profile:', e);
    }

    // Add to registered facilities reactive state
    setRegisteredFacilities((prev) => {
      const updated = [newFacility, ...prev.filter((f) => f.id !== newFacility.id)];
      try {
        localStorage.setItem(REGISTERED_FULL_FACILITIES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to store registered full facility:', e);
      }
      return updated;
    });

    saveUserSession(newProfile);
    closeAuthModal();
    return newProfile;
  };

  const logout = () => {
    saveUserSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        registeredFacilities,
        isAuthenticated: Boolean(user),
        isLoading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        loginWithEmail,
        quickLogin,
        registerFacility,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
