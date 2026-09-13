import { useMemo, useState } from 'react'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [creatingRecipientId, setCreatingRecipientId] = useState<string | null>(null)
  const { users } = useGetUsers()
  const { user: currentUser } = useGetMe()
  const { createChatroom, isPending: isCreatingChatroom } = useCreateChatroom()

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) return users?.data ?? []

    return (users?.data ?? []).filter((user) =>
      user.username.toLowerCase().includes(normalizedQuery) ||
      user.email.toLowerCase().includes(normalizedQuery),
    )
  }, [searchQuery, users?.data])

  const handleCreateRoom = async (recipientId: string) => {
    setCreatingRecipientId(recipientId)

    try {
      const response = await createChatroom({
        room_name: null,
        description: null,
        is_direct: true,
        created_by: currentUser?.data.id || '',
        recipient: recipientId,
      })
      const roomId = response.data.room_id
      navigate(`/chat/${roomId}`, {
        state: { user: users?.data?.find((user) => user.id === recipientId) },
      })
    } catch (error) {
      console.error('Failed to create chatroom:', error)
    } finally {
      setCreatingRecipientId(null)
    }
  }

  return (
    <SidebarInset className="min-w-0 overflow-x-hidden">
      <div className="mx-auto w-full max-w-4xl min-w-0 space-y-6 p-4 sm:space-y-8 sm:p-6 md:p-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or username"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-12 rounded-full border-0 bg-gray-100 pl-10 text-sm focus-visible:ring-2 sm:text-base"
          />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <h2 className="text-xl font-bold sm:text-2xl">Search Results</h2>
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
            </span>
          </div>

          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex min-w-0 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <Avatar className="h-11 w-11 shrink-0 sm:h-12 sm:w-12">
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${encodeURIComponent(user.username)}`}
                      alt={user.username}
                    />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold sm:text-base">{user.username}</p>
                    <p className="truncate text-xs text-gray-600 sm:text-sm">{user.email}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="h-10 w-full shrink-0 border-blue-600 bg-white text-blue-600 hover:bg-blue-50 sm:w-auto"
                  onClick={() => handleCreateRoom(user.id)}
                  disabled={isCreatingChatroom}
                >
                  {creatingRecipientId === user.id ? 'Creating...' : 'Message'}
                </Button>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                No users match your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

export default Search
