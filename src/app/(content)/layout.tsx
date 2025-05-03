import FooterComp from "@/components/useables/footer";
import HeaderComp from "@/components/useables/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* <HeaderComp /> */}
      {children}
      {/* <FooterComp /> */}
    </div>
  );
}
