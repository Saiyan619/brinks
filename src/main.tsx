import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from './components/ui/sonner.tsx'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar.tsx'
import AppSidebar from './globalComponents/AppSidebar.tsx'

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  // uncomment StrictMode for development to catch potential issues, but be aware it may cause double rendering of components
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
<BrowserRouter>
 <TooltipProvider>
   <Toaster />
   
         <App />
    
     
 </TooltipProvider>
     
    </BrowserRouter>
    </QueryClientProvider>
    
  // </StrictMode>
)
