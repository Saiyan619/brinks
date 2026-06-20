import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/globalComponents/AppSidebar'
import { Route, Routes } from 'react-router-dom'
import ChatLayout from '@/chat/Chat'
import Home from '@/home/Home'
import Search from '@/search/Search'

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Routes>
        <Route path="/" element={<ChatLayout />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chat/:room_id" element={<ChatLayout />} />
      </Routes>
    </SidebarProvider>
  )
}
