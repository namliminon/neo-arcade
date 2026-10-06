"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { dataAdapter, UserProfile, AuthResponse } from "./data-adapter";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { soundSynth } from "@/lib/audio/sound-synth";

interface AuthContextType {
  user: UserProfile | null;
  role: "user" | "admin";
  isBanned: boolean;
  banReason: string;
  coins: number;
  level: number;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  banModalNotice: string | null;
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  dismissBanNotice: () => void;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  register: (username: string, email: string, pass: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  addCoins: (amount: number) => Promise<number>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => dataAdapter.getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [banModalNotice, setBanModalNotice] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    const cur = await dataAdapter.fetchCurrentProfile();
    if (cur) {
      if (cur.is_banned) {
        setBanModalNotice(cur.ban_reason || "Tài khoản của bạn đã bị khóa bởi Quản trị viên.");
        await dataAdapter.logout();
        setUser(null);
      } else {
        setUser({ ...cur });
      }
    } else {
      // Check cached local user fallback
      const localCur = dataAdapter.getCurrentUser();
      if (localCur && !localCur.is_banned) {
        setUser({ ...localCur });
      } else {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen to Supabase Auth state changes (login, logout, email confirmation token)
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
          await refreshUser();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [refreshUser]);

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const dismissBanNotice = () => {
    setBanModalNotice(null);
  };

  const login = async (email: string, pass: string): Promise<AuthResponse> => {
    const res = await dataAdapter.login(email, pass);
    if (res.user) {
      setUser(res.user);
      soundSynth.play("coin");
      closeAuthModal();
    } else if (res.banReason) {
      soundSynth.play("lose");
      setBanModalNotice(res.banReason);
    }
    return res;
  };

  const register = async (username: string, email: string, pass: string): Promise<AuthResponse> => {
    const res = await dataAdapter.register(username, email, pass);
    if (res.user) {
      setUser(res.user);
      soundSynth.play("win");
      closeAuthModal();
    }
    return res;
  };

  const logout = async () => {
    await dataAdapter.logout();
    soundSynth.play("click");
    setUser(null);
  };

  const addCoins = async (amount: number): Promise<number> => {
    if (!user) return 0;
    const newCoins = await dataAdapter.addCoins(user.id, amount);
    // Optimistically update local user state to prevent session loss
    setUser((prev) => {
      if (!prev) return null;
      const newExp = prev.exp + Math.abs(amount) * 2;
      return {
        ...prev,
        coins: newCoins,
        exp: newExp,
        level: Math.floor(newExp / 250) + 1,
      };
    });
    return newCoins;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "user",
        isBanned: user?.is_banned || false,
        banReason: user?.ban_reason || "",
        coins: user?.coins || 0,
        level: user?.level || 1,
        isLoading,
        isAuthModalOpen,
        banModalNotice,
        openAuthModal,
        closeAuthModal,
        dismissBanNotice,
        login,
        register,
        logout,
        refreshUser,
        addCoins,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
