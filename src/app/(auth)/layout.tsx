export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-[#0a1a2f] to-[#0c2240] text-white relative">
        <div className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none">
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(24)].map((_, i) => (
              <div key={`h-${i}`} className="w-full h-px bg-white"></div>
            ))}
          </div>
          <div className="absolute inset-0 flex flex-row justify-between">
            {[...Array(24)].map((_: any, i: any) => (
              <div key={`v-${i}`} className="h-full w-px bg-white"></div>
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
