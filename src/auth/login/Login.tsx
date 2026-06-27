import React, { useRef, useState, type ChangeEvent } from 'react';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { useLogin } from '@/apiServices/authApi';
import { Spinner } from '@/components/ui/spinner';
import { useNavigate } from 'react-router-dom';
import { useGetMe } from '@/apiServices/userApi';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const hasLoggedIn = useRef(false);

  async function handleLogin(e: ChangeEvent<HTMLFormElement>){
    e.preventDefault();
    const data = {
      email: email,
      password: password
    }
    console.log(data);
    // Prevent multiple login attempts, incase the user clicks the login button multiple times before the first request completes
    if (hasLoggedIn.current) return;
    hasLoggedIn.current = true;
    // Didn't realize that the loginUser function is to be made asynchronous here again after writing an async hook earlier, 
    // so we need to await it before navigating to the home page. Otherwise, the user might be redirected before the login request completes, which could lead to unexpected behavior.
    await loginUser(data);
    navigate("/");
    
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafc] p-4 font-sans">
      <Card className="w-full max-w-[400px] shadow-sm border-gray-100 rounded-2xl p-2 border-0 sm:border text-center">
        <CardHeader className="flex flex-col items-center pb-6">
          <div className="w-12 h-12 bg-[#4646e2] rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1.5">Welcome back</h1>
          <p className="text-sm text-gray-500">Pick up where you left off.</p>
        </CardHeader>
        
        <CardContent className="text-left">
          <form onSubmit={handleLogin}>
            <FieldGroup className="space-y-4">
              {/* Email or Username */}
              <Field>
                <FieldLabel className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider block">
                  Email or Username
                </FieldLabel>
                <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="name@example.com"
                  className="bg-[#f4f5f9] border-transparent text-gray-900 rounded-xl px-4 py-6 placeholder:text-gray-400 focus-visible:bg-white focus-visible:border-[#4040e0] focus-visible:ring-2 focus-visible:ring-[#4040e0]/20"
                />
              </Field>

              {/* Password */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider block">
                    Password
                  </FieldLabel>
                  <a href="/forgot-password" className="text-[12px] font-medium text-[#4646e2] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-[#f4f5f9] border-transparent text-gray-900 rounded-xl px-4 py-6 pr-12 placeholder:text-gray-400 focus-visible:bg-white focus-visible:border-[#4040e0] focus-visible:ring-2 focus-visible:ring-[#4040e0]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </Field>
            </FieldGroup>

            {/* Submit Button */}
            <div className="pt-6">
              {isPending ? 
              <Button disabled
              className="w-full bg-[#4646e2] hover:bg-[#3434cf] text-white text-[15px] font-medium rounded-xl py-6 transition-colors focus-visible:ring-4 focus-visible:ring-[#4646e2]/20">
        <Spinner data-icon="inline-start" />
        Please wait...
      </Button>
              :
              <Button
                type="submit"
                className="w-full bg-[#4646e2] hover:bg-[#3434cf] text-white text-[15px] font-medium rounded-xl py-6 transition-colors focus-visible:ring-4 focus-visible:ring-[#4646e2]/20"
              >
                Sign in
              </Button>}
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-[14px] text-gray-500">
            Don't have an account?{' '}
            <a href="/register" className="text-[#4646e2] font-semibold hover:underline">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
