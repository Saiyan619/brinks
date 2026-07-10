import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface roomMemberRequest{
    room_id: string | null;
    user_id: string | null;
}

export const useAddMemberToRoom = () => {
    const addMember = async (roomMemberData: roomMemberRequest) => {
        const response = await fetch(`http://localhost:8000/api/add-member/join`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ room_id: roomMemberData.room_id, user_id: roomMemberData.user_id })
        });
        if (!response.ok) {
            throw new Error("Failed to add member to room");
        }
        console.log(`Member ${roomMemberData.user_id} added to room ${roomMemberData.room_id} successfully`);
        return response.json();
    }
    const { mutateAsync: addMemberToRoom, isPending } = useMutation({
        mutationFn: addMember,
       onSuccess: () => {
            console.log("Member added to chatroom successfully");
            toast.success("Member added to chatroom successfully");
        },
        onError: () => {
            console.error("Failed to add member to chatroom");
            toast.error("Failed to add member to chatroom");
        }
    });
    return { addMemberToRoom, isPending };
}