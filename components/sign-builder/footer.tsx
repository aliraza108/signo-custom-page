"use client"

export function Footer() {
  return (
    <footer className="h-10 bg-card border-t flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground font-medium">
          Custom Sign Builder
        </span>
        <span className="text-xs text-muted-foreground">
          Powered by SignoGrafx
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground">
          Images stored on Cloudinary
        </span>
        <span className="text-[10px] text-muted-foreground/60">
          v1.0
        </span>
      </div>
    </footer>
  )
}
