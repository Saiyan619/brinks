import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/globalComponents/AppSidebar'
import { Route, Routes } from 'react-router-dom'
import ChatLayout from '@/chat/Chat'
import Home from '@/home/Home'
import Search from '@/search/Search'
import GroupSearch from '@/search/GroupSearch'

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4 md:hidden">
          <SidebarTrigger />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-none">Dashboard</p>
            <p className="text-xs text-muted-foreground">Open the sidebar</p>
          </div>
        </header>
        <div className="min-w-0 flex-1">
          <Routes>
            <Route path="/" element={<ChatLayout />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search-groups" element={<GroupSearch />} />
            <Route path="/chat/:room_id" element={<ChatLayout />} />
            <Route path="/group/:group_id" element={<ChatLayout />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  )
}
