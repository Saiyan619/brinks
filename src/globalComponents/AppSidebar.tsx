import { useState, type FormEvent } from 'react';
import { LogOut, MessageSquarePlus, Search, MoreVertical, MessageCircle, Bell, Settings, UsersRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { useCreateGroupChatroom } from '@/apiServices/chatApi';
import { useLogout } from '@/apiServices/authApi';
import { useGetMe } from '@/apiServices/userApi';

export default function AppSidebar() {
  const navigate = useNavigate();
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const {createGroupChatroom, isPending} = useCreateGroupChatroom();
  const { logoutUser, isPending: isLoggingOut } = useLogout();
  const {user} = useGetMe();
  // group name, decs, isdirect, createdby

  const handleCreateGroup = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const room_name = groupName.trim();
    const description = groupDescription.trim();

    if (!room_name) return;
    let user_id = user?.data.id;
  
    await createGroupChatroom({room_name, description, is_direct: false, created_by: user_id});
    // const group = saveGroupChat({
    //   name,
    //   description: description || "A new group conversation.",
    // });

    setGroupName("");
    setGroupDescription("");
    // setIsNewGroupOpen(false);
    // setGroups(getGroupChats());
    // navigate(`/group/${group.id}`, { state: { group } });
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLogoutConfirmOpen(false);
      setIsProfileMenuOpen(false);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold">Brinks</h1>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        </div>
        <Dialog open={isNewGroupOpen} onOpenChange={setIsNewGroupOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <MessageSquarePlus className="w-4 h-4" />
              New Group
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[min(28rem,calc(100vw-2rem))] gap-0 overflow-hidden rounded-md bg-white p-0 text-gray-950 shadow-sm ring-0 sm:max-w-md">
            <DialogHeader className="px-6 pb-6 pt-5">
              <DialogTitle className="text-base font-semibold">New Group</DialogTitle>
              <div className="ml-auto mt-10 h-px w-1/2 bg-gray-200" />
            </DialogHeader>

            <form id="new-group-form" className="px-6 pb-6" onSubmit={handleCreateGroup}>
              <FieldGroup className="gap-4">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="group-name" className="text-[0.625rem] font-semibold uppercase tracking-normal text-gray-700">
                    Group Name
                  </FieldLabel>
                  <Input
                    id="group-name"
                    placeholder="e.g. Design Systems Team"
                    value={groupName}
                    onChange={(event) => setGroupName(event.target.value)}
                    className="h-11 rounded-md border-gray-200 bg-violet-50/60 px-4 text-xs shadow-none focus-visible:ring-1"
                  />
                </Field>

                <Field className="gap-1.5">
                  <FieldLabel htmlFor="group-description" className="text-[0.625rem] font-semibold uppercase tracking-normal text-gray-700">
                    Description
                  </FieldLabel>
                  <textarea
                    id="group-description"
                    placeholder="What's this group about?"
                    value={groupDescription}
                    onChange={(event) => setGroupDescription(event.target.value)}
                    className="min-h-28 w-full resize-none rounded-md border border-gray-200 bg-violet-50/60 px-4 py-3 text-xs outline-none transition-colors placeholder:text-gray-500 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                  />
                </Field>
              </FieldGroup>
            </form>

            <DialogFooter className="border-t border-gray-300 bg-violet-50/60 px-6 py-5 sm:justify-center">
              <DialogClose asChild>
                <Button type="button" variant="ghost" size="sm" className="h-7 px-5 text-xs font-semibold text-gray-900 hover:bg-violet-100">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" form="new-group-form" size="sm" className="h-7 px-5 text-xs font-semibold">
                {isPending ? "Creating..." : "Create Group"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                    <span>Search Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="flex items-center gap-3">
                  <Link to="/search-groups">
                    <UsersRound className="w-4 h-4" />
                    <span>Search Groups</span>
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
        <div className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-100">
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
          <Dialog open={isProfileMenuOpen} onOpenChange={setIsProfileMenuOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-gray-500 hover:bg-white hover:text-gray-900"
                aria-label="Open profile options"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[min(20rem,calc(100vw-2rem))] gap-0 overflow-hidden rounded-2xl bg-white p-0 text-gray-950 shadow-xl ring-1 ring-gray-200 sm:max-w-sm">
              <DialogHeader className="px-5 pb-4 pt-5">
                <DialogTitle className="text-sm font-semibold">Account options</DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Choose an account action.
                </DialogDescription>
              </DialogHeader>

              <div className="px-3 pb-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsLogoutConfirmOpen(true);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
            <DialogContent className="w-[min(22rem,calc(100vw-2rem))] gap-0 overflow-hidden rounded-2xl bg-white p-0 text-gray-950 shadow-xl ring-1 ring-gray-200 sm:max-w-md">
              <DialogHeader className="px-5 pb-4 pt-5">
                <DialogTitle className="text-base font-semibold">Log out?</DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  You can sign back in anytime. This only changes the interface for now.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="border-t border-gray-200 bg-gray-50 px-5 py-4">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" className="h-9 px-4 text-sm font-medium text-gray-700 hover:bg-white">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  variant="destructive"
                  className="h-9 px-4 text-sm font-medium"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
