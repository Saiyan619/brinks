import { useMemo, useState } from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search as SearchIcon, UsersRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGetGroupChatrooms } from '@/apiServices/chatApi'
import { useAddMemberToRoom } from '@/apiServices/roomMemberApi'
import { useGetMe } from '@/apiServices/userApi'

type GroupSearchResult = {
  room_id: string
  room_name: string | null
  description: string | null
  created_at: string
  updated_at: string
  created_by: string
  is_direct: boolean
  direct_key: string
}

const GroupSearch = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const { groupChats, isPending } = useGetGroupChatrooms()
  const { user: currentUser } = useGetMe()
  const { addMemberToRoom, isPending: isJoiningGroup } = useAddMemberToRoom()

  const groups = (groupChats?.data ?? []) as GroupSearchResult[]

  const filteredGroups = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return groups
    }

    return groups.filter((group) => {
      const name = group.room_name?.toLowerCase() ?? ''
      const description = group.description?.toLowerCase() ?? ''

      return name.includes(normalizedQuery) || description.includes(normalizedQuery)
    })
  }, [groups, searchQuery])

  const handleOpenGroup = async (group: GroupSearchResult) => {
    try {
      if (currentUser?.data.id) {
        await addMemberToRoom({
          room_id: group.room_id,
          member_id: currentUser.data.id,
        })
      }

      navigate(`/group/${group.room_id}`, {
        state: {
          group: {
            id: group.room_id,
            name: group.room_name ?? 'Untitled group',
            description: group.description ?? '',
            memberCount: 0,
            createdAt: group.created_at,
          },
        },
      })
    } catch (error) {
      console.error('Failed to open group:', error)
    }
  }

  return (
    <SidebarInset>
      <div className="w-full p-8 space-y-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by group name or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 bg-gray-100 border-0 rounded-full text-base focus-visible:ring-2"
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Group Search</h2>
            <span className="text-sm font-medium text-black">
              {filteredGroups.length} GROUPS FOUND
            </span>
          </div>

          {isPending ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-6 text-sm text-gray-500">
              Loading groups...
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-6 text-sm text-gray-500">
              No groups match your search.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGroups.map((group) => (
                <div
                  key={group.room_id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <Avatar className="h-12 w-12 rounded-md bg-blue-50 text-blue-700">
                      <AvatarFallback className="rounded-md bg-blue-50 text-blue-700">
                        <UsersRound className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold">
                        {group.room_name ?? 'Untitled group'}
                      </p>
                      <p className="truncate text-sm text-gray-600">
                        {group.description || 'No description available.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden text-right text-xs text-gray-500 sm:block">
                      <p>Created {new Date(group.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                      onClick={() => handleOpenGroup(group)}
                      disabled={isJoiningGroup}
                    >
                      {isJoiningGroup ? 'Joining...' : 'Join Group'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}

export default GroupSearch