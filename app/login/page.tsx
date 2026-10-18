import React from "react";
import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول | جامع الحق",
  description: "تسجيل الدخول إلى المجلس العام - جامع الحق لمتابعة وإدارة حجوزاتك.",
};

export default function LoginPage() {
  return <AuthForm initialMode="login" />;
}

