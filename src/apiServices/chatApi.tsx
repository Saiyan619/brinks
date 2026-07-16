import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface ChatroomRequest{
    room_name: string | null;
    description: string | null;
    is_direct: boolean;
    created_by: string;
    recipient: string;
}

export interface ChatroomResponse {
        room_id: string;
        room_name: string | null;
        description: string | null;
        is_direct: boolean;
        direct_key: string;
        created_by: string;
        created_at: string;
        updated_at: string;
}

export interface groupChatroomRequest {
    room_name: string | null;
    description: string | null;
    is_direct: boolean;
    created_by: string | undefined;
}
export interface GroupChatroomResponse {
        room_id: string;
        room_name: string | null;
        description: string | null;
        is_direct: boolean;
        direct_key: string;
        created_by: string;
        created_at: string;
        updated_at: string;
}

interface GroupChatroomsResponse {
    data: GroupChatroomResponse[];
}

export interface DirectChatroomResponse {
    room_id: string;
    is_direct: boolean;
    direct_key: string;
    created_at: string;
    created_by: string;
    description: string | null;
    other_username: string;
    room_name: string | null;
    updated_at: string;
}

export interface DirectChatroomsResponse {
    data: DirectChatroomResponse[];
}


export const useCreateChatroom = () => {
     const createRoom = async(chatroomData: ChatroomRequest) => {
        const reponse = await fetch("http://localhost:8000/api/chatroom/chat", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(chatroomData)
        })

        if (!reponse.ok) {
            // let errorData = await reponse.json();
            // console.error("Failed to create chatroom:", errorData);
            // throw new Error(errorData.message);
            throw new Error("Failed to create chatroom");
        }
        let roomData = await reponse.json();
        console.log("Chatroom created successfully}", roomData);
        return roomData;
     }
     const {mutateAsync: createChatroom, isPending} = useMutation({
        mutationFn: createRoom,
        onSuccess: () => {
            console.log("Chatroom created successfully");
            toast.success("Chatroom created successfully");
        },
        onError: () => {
            console.error("Failed to create chatroom");
            toast.error("Failed to create chatroom");
        }
        
    })
    return {createChatroom, isPending};
    };


export const useCreateGroupChatroom = () => {
    const createGroupRoom = async(groupChatroomData: groupChatroomRequest) => {
       const reponse = await fetch("http://localhost:8000/api/chatroom/create-groupchat", {
              credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(groupChatroomData)
            })



         if (!reponse.ok) {
                throw new Error("Failed to create group chatroom");
            }
            console.log("Group chatroom created successfully", await reponse.json());
            return reponse;
        }

    const {mutateAsync: createGroupChatroom, isPending} = useMutation({
        mutationFn: createGroupRoom,
        onSuccess: () => {
            console.log("Group chatroom created successfully");
            toast.success("Group chatroom created successfully");
        },
        onError: () => {
            console.error("Failed to create group chatroom");
            toast.error("Failed to create group chatroom");
        }
    })
    return {createGroupChatroom, isPending};
    };

export const useGetGroupChatrooms = () => {
    const getGroupChatrooms = async(): Promise<GroupChatroomsResponse> => {
        const response = await fetch("http://localhost:8000/api/chatroom/all-groupchats", {
            credentials: "include",
            method: "GET",
        });

        let data = await response.json();
        if (!response.ok) {
            throw new Error("Failed to fetch group chatrooms");
        }
        console.log("Fetched group chatrooms successfully", data);
        return data;
    }
    const {data, isPending} = useQuery({
        queryKey: ['groupChatrooms'],
        queryFn: getGroupChatrooms
    })
    return { groupChats: data, isPending };
}

export const useGetUserDirectChatrooms = () => {
    const getuserDirectChatrooms = async(): Promise<DirectChatroomsResponse> => {
        const response = await fetch("http://localhost:8000/api/chatroom/user-direct-chats", {
            credentials: "include",
            method: "GET",
        });
        let data = await response.json();
        if (!response.ok) {
            throw new Error("Failed to fetch user chatrooms");
        }
        console.log("Fetched user chatrooms successfully", data);
        return data;
    }
    const {data, isPending} = useQuery({
        queryKey: ['userDirectChatrooms'],
        queryFn: getuserDirectChatrooms,
    })
    return { userChats: data, isPending };
} 

export const useGetUserGroupChatrooms = () => {
    const getuserGroupChatrooms = async(): Promise<GroupChatroomsResponse> => {
        const response = await fetch("http://localhost:8000/api/chatroom/user-group-chats", {
            credentials: "include",
            method: "GET",
        });
        let data = await response.json();
        if (!response.ok) {
            throw new Error("Failed to fetch user chatrooms");
        }
        console.log("Fetched user chatrooms successfully", data);
        return data;
    }
    const {data, isPending} = useQuery({
        queryKey: ['userGroupChatrooms'],
        queryFn: getuserGroupChatrooms,
    })
    return { userChats: data, isPending };
}   