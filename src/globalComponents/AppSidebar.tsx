import { MessageSquarePlus, Search, MoreVertical, MessageCircle, Bell, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold">Brinks</h1>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <MessageSquarePlus className="w-4 h-4" />
          New Message
        </Button>
      </SidebarHeader>

      <SidebarContent>
        {/* Search */}
        <SidebarGroup className="pb-2">
          <SidebarGroupContent>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search" 
                className="pl-8 bg-gray-100 border-0 focus-visible:ring-1 rounded-full"
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Direct Messages */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-600 uppercase">Direct Messages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 px-0 py-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://i.pravatar.cc/150?u=alex" alt="Alex Rivera" />
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">Alex Rivera</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Groups */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-600 uppercase">Groups</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Groups will be added here */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-600 uppercase">Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chats</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="flex items-center gap-3">
                  <Link to="/search">
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-600 uppercase">Profile</SidebarGroupLabel>
        </SidebarGroup>
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://i.pravatar.cc/150?u=brinks" alt="Brinks" />
              <AvatarFallback>BR</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">Brinks</p>
              <p className="text-xs text-gray-500">Active Now</p>
            </div>
          </div>
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
