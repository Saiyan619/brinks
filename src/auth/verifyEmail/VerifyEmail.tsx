import { useEffect } from 'react'
import { useVerifyEmail } from '@/apiServices/authApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const VerifyEmail = () => {
  const { verifyUserEmail, isPending } = useVerifyEmail();
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  function getTokenParams(){
    let token = searchParams.get("token");
    if (token){
      console.log("Token found:", token);
      verifyUserEmail(token);
    }
  }

  useEffect(() => {
    getTokenParams();
  }, [searchParams])
  
  
  return (
    <div>
      {
        isPending ? <p>Verifying your email...</p> : <p>Your email has been verified successfully!</p>
      }
      <Button onClick={() => navigate("/login")}>Go to Login</Button>
    </div>
  )
}

export default VerifyEmail
