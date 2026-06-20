import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SidebarInset } from '@/components/ui/sidebar'
import { Search as SearchIcon } from 'lucide-react'
import { useGetMe, useGetUsers } from '@/apiServices/userApi'
import { useNavigate } from 'react-router-dom'
import { useCreateChatroom } from '@/apiServices/chatApi'

const Search = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('');
  const {users, isPending} = useGetUsers();
  const {user: currentUser} = useGetMe();
  const {createChatroom, isPending: isCreatingChatroom} = useCreateChatroom();
  const handleCreateRoom = async (recipient_id:string) => {
    try {
      let data = {
        room_name: null,
        description: null,
        is_direct: true,
        created_by: currentUser?.data.id || "", 
        recipient: recipient_id
      }
      const response = await createChatroom(data);
      const room_id = response.data.room_id;
      navigate(`/chat/${room_id}`, { state: { user: users?.data?.find(u => u.id === recipient_id) } });
    } catch (error) {
      console.error("Failed to create chatroom:", error);
    }
  }
  // Mock user data
//   const users = [
//     { id: 1, name: 'Marcus Thorne', username: '@m_thorne', avatar: 'https://i.pravatar.cc/150?u=marcus' },
//     { id: 2, name: 'Elena Rodriguez', username: '@elena_design', avatar: 'https://i.pravatar.cc/150?u=elena' },
//     { id: 3, name: 'Sarah Kim', username: '@slim_dev', avatar: 'https://i.pravatar.cc/150?u=sarah' },
//     { id: 4, name: 'David Chen', username: '@dchen_28', avatar: 'https://i.pravatar.cc/150?u=david' },
//     { id: 5, name: 'Maya Patel', username: '@mayaportfolio', avatar: 'https://i.pravatar.cc/150?u=maya' },
//   ]
  return (
    <SidebarInset>
      <div className="w-full p-8 space-y-8">
        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name or username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 bg-gray-100 border-0 rounded-full text-base focus-visible:ring-2"
          />
        </div>

        {/* Search Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Search Results</h2>
            <span className="text-sm font-medium text-black">{users?.data?.length} USERS FOUND</span>
          </div>

          {/* Users List */}        
          <div className="space-y-3">
            {users?.data?.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://i.pravatar.cc/150?u=sarah" alt={user.username} />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-base">{user.username}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                  onClick={() => handleCreateRoom(user.id)}
                >
                  {isCreatingChatroom ? "Creating..." : "Message"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

export default Search
