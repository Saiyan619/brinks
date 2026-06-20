import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface RegisterDataRequest {
    username: string;
    email: string;
    password: string
}
interface LoginDataRequest {
    email: string;
    password: string
}

export const useRegister = () => {
    const register = async (registerinput: RegisterDataRequest) =>{
        const response = await fetch("http://localhost:8000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerinput)
        })

        if (!response.ok){
            let errorData = await response.json();
            console.error("Failed to register user:", errorData);
            throw new Error(errorData.message);
        }
        console.log("User registered successfully");
        return response.json();
        
    }
    const {mutateAsync: registerUser, isPending} = useMutation(
        {
            mutationFn: register,
            onSuccess: () =>{
                toast.success("User registered successfully, Please check your email to verify your account");
            },
            onError: (error: Error) => {
                toast.error(error.message || "Failed to register user");
            }
        }
    )
    return {registerUser, isPending};
}

export const useVerifyEmail = () => {
    const verifyEmail = async (token: string) => {
        const response = await fetch(`http://localhost:8000/api/auth/verify-email?token=${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            // let errorData = await response.json();
            // console.error("Failed to verify email:", errorData);
            // throw new Error(errorData.message);
            throw new Error("Failed to verify email");
        }

        console.log("Email verified successfully");
        return response.json();
    };

    const { mutateAsync: verifyUserEmail, isPending } = useMutation({
        mutationFn: verifyEmail,
        onSuccess: () => {
            toast.success("Email verified successfully");
        },
        onError: () => {
            toast.error("Failed to verify email");
        }
    });

    return { verifyUserEmail, isPending };
};


export const useLogin = () => {
    const login = async (loginData: LoginDataRequest) => {
        const response = await fetch("http://localhost:8000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            throw new Error("Failed to login");
        }

        return response.json();
    };

    const { mutateAsync: loginUser, isPending } = useMutation({
        mutationFn: login,
        onSuccess: () => {
            toast.success("Login successful");
        },
        onError: () => {
            toast.error("Failed to login");
        }
    });

    return { loginUser, isPending };
};
