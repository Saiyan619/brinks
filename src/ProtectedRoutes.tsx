
import React, { useEffect } from 'react'
import { useGetMe } from './apiServices/userApi';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoutes = ({children}: {children: React.ReactNode}) => {
    const {getMe, user, isPending} = useGetMe();
    const location = useLocation();
    useEffect(() => {
        user
    }, [user])
    
    if (isPending) return null; 

    if (!user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }
  return <>{children}</>

}

export default ProtectedRoutes
