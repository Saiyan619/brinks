import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ChatroomRequest{
    room_name: string | null;
    description: string | null;
    is_direct: boolean;
    created_by: string;
    recipient: string;
}

export interface ChatroomResponse {
    status: string;
    data: {
        room_id: string;
        room_name: string | null;
        description: string | null;
        is_direct: boolean;
        direct_key: string;
        created_by: string;
        created_at: string;
        updated_at: string;
    };
}
// {
//     "room_name": null,
//     "description": null,
//     "is_direct": true,
//     "created_by": "935a42bb-90b4-47c7-be2a-94c3b0002c13",
//     "recipient": "dc8c6bf1-347b-4b51-9d4f-3422c7db8d9b"
// }
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
