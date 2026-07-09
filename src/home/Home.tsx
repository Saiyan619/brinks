
import { SidebarInset } from '@/components/ui/sidebar'

const Home = () => {
  return (
    <SidebarInset>
      <div className="flex min-h-[calc(100vh-1rem)] items-center justify-center p-8">
        <div className="max-w-md rounded-2xl border border-border bg-background p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold">Welcome FN!!!</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Use the sidebar to open chats, search users, or search groups.
          </p>
        </div>
      </div>
    </SidebarInset>
  )
}

export default Home
