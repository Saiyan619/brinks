import { useState, type ChangeEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Button } from '@/components/ui/button';
import { useRegister } from '@/apiServices/authApi';
import { Spinner } from '@/components/ui/spinner';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const {registerUser, isPending} = useRegister();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  function handleRegister(e:ChangeEvent<HTMLFormElement>) {
    // registerUser({
    //   username: username,
    //   email: email,
    //   password: password
    // })
    e.preventDefault();
    let data = {
      username: username,
      email: email,
      password: password
    };
    console.log(data);
    registerUser(data);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafc] p-4 font-sans">
      {/* Logo Area */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-10 h-10 bg-[#4040e0] rounded-xl flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <path d="M14 8h.01M14 12h.01M14 16h.01"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">brinks</h1>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-[440px] shadow-sm border-gray-100 rounded-2xl p-2 border-0 sm:border">
        <CardHeader className="mb-3">
          <CardTitle className="text-xl font-medium text-gray-900">Create your account</CardTitle>
          <CardDescription className="text-sm">Join the community of precision and speed.</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleRegister}>
            <FieldGroup className="space-y-4">
              {/* Username */}
              <Field>
                <FieldLabel className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider block">
                  Username
                </FieldLabel>
                <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
                  type="text"
                  placeholder="@username"
                  className="bg-[#f4f5f9] border-transparent text-gray-900 rounded-xl px-4 py-6 placeholder:text-gray-400 focus-visible:bg-white focus-visible:border-[#4040e0] focus-visible:ring-2 focus-visible:ring-[#4040e0]/20"
                />
              </Field>

              {/* Email Address */}
              <Field>
                <FieldLabel className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider block">
                  Email Address
                </FieldLabel>
                <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                  type="email"
                  placeholder="name@example.com"
                  className="bg-[#f4f5f9] border-transparent text-gray-900 rounded-xl px-4 py-6 placeholder:text-gray-400 focus-visible:bg-white focus-visible:border-[#4040e0] focus-visible:ring-2 focus-visible:ring-[#4040e0]/20"
                />
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider block">
                  Password
                </FieldLabel>
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
            <div className="pt-8">
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
                Create account
              </Button>}
              
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Footer Link */}
      <div className="mt-8 text-[14px] text-gray-500">
        Already have an account?{' '}
        <a href="/login" className="text-[#4646e2] font-semibold hover:underline">
          Sign in
        </a>
      </div>
    </div>
  );
}
