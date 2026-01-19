// src/components/layout/SidebarLayout.tsx
import type { ReactNode } from "react";

type Props = {
  sidebar: ReactNode;
  children: ReactNode;
};

export default function SidebarLayout({ sidebar, children }: Props) {
  return (
    <div className="flex h-full">
      {sidebar}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
