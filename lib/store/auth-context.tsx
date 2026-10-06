"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { dataAdapter, UserProfile, AuthResponse } from "./data-adapter";
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
  refreshUser: () => void;
  addCoins: (amount: number) => Promise<number>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [banModalNotice, setBanModalNotice] = useState<string | null>(null);

  const refreshUser = useCallback(() => {
    const cur = dataAdapter.getCurrentUser();
    if (cur) {
      if (cur.is_banned) {
        setBanModalNotice(cur.ban_reason || "Tài khoản của bạn đã bị khóa bởi Quản trị viên.");
        dataAdapter.logout();
        setUser(null);
      } else {
        setUser({ ...cur });
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
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
    refreshUser();
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
