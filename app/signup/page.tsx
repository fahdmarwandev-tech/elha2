import React from "react";
import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إنشاء حساب جديد | جامع الحق",
  description: "إنشاء حساب جديد في المجلس العام - جامع الحق لتسهيل حجز القاعات ومتابعة المناسبات.",
};

export default function SignupPage() {
  return <AuthForm initialMode="signup" />;
}

