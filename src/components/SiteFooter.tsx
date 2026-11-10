export function SiteFooter({ children }: { children: React.ReactNode }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-ash sm:px-8">
        <span className="font-wide font-black text-bone">NEBUL4</span>
        {children}
      </div>
    </footer>
  )
}
