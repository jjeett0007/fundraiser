import AuthHeader from "@/components/useables/authHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AuthHeader />
      <main>{children}</main>
    </div>
  );
}
