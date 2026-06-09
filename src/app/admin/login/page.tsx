import { LoginForm } from "@/components/admin/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理员登录",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <LoginForm />
    </div>
  );
}
