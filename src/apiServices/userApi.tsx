import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  username: string;
  email: string;
  is_verified: boolean;
  last_seen: string | null;
  created_at: string;
  updated_at: string;
}

interface UserResponse {
  status: string;
  data: User;
}

interface UsersResponse {
  status: string;
  result: number;
  data: User[]; // ✅ User[] not UserResponse[]
}

// Object { username: "niyi", email: "arokoyueb11@gmail.com", is_verified: true, … }
// created_at: "2026-06-19T07:00:44.112902Z"

// email: "arokoyueb11@gmail.com"

// is_verified: true
// ​last_seen: null
// updated_at: "2026-06-19T07:00:44.112902Z"
// username: "niyi"
export const useGetMe = () => {
    const getMe = async (): Promise<UserResponse> => {
        const response = await fetch("http://localhost:8000/api/users/me", {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            // let errorData = await response.json();
            // console.error("Failed to fetch user data:", errorData);
            // throw new Error(errorData.message);
            throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        console.log("User data fetched successfully:", userData);
        return userData;
    }

    const {data, isPending} = useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        retry: false,        // ← don't retry 401s endlessly
  staleTime: 0, 
    });
    return {user: data, isPending, getMe};
}


export const useGetUsers = () => {
    const getUsers = async (): Promise<UsersResponse> => {
        const response = await fetch("http://localhost:8000/api/users/user-all", {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch users data");
        }
        let usersData = await response.json();
        console.log("Users data fetched successfully:", usersData);
        return usersData;
    }
    const {data, isPending} = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
        retry: false,        // ← don't retry 401s endlessly
        staleTime: 0,
    })
    return {users: data, isPending, getUsers};
}