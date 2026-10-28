import type {ReactNode} from 'react';
import DocsSidebar from '@/components/DocsSidebar';
import Toc from '@/components/Toc';

export default function DocsLayout({children}: {children: ReactNode}) {
  return (
    <div className="mx-auto grid max-w-[88rem] gap-10 px-4 py-10 sm:px-6 md:grid-cols-[13.5rem_minmax(0,1fr)] xl:grid-cols-[13.5rem_minmax(0,1fr)_13rem] lg:gap-14">
      <aside className="hidden md:block">
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pb-8 pr-2">
          <DocsSidebar />
        </div>
      </aside>
      <main id="contenu" className="min-w-0">{children}</main>
      <aside className="hidden xl:block">
        <div className="sticky top-20">
          <Toc />
        </div>
      </aside>
    </div>
  );
}
