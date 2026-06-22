import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left nav nav column */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 flex justify-center gap-8 !ml-64">
        <div className="w-full max-w-3xl border-x min-h-screen"
          style={{ borderColor: 'var(--border)' }}>
          <Outlet />
        </div>

        {/* Right sidebar container column matches the size perfectly */}
        <div className="hidden xl:block w-80">
          <RightSidebar />
        </div>
      </main>
    </div>
  )
}