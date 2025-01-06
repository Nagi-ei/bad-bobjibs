import { User, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '../components/ui/BottomNav';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Profile() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-2">
            <User className="h-12 w-12 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold">John Doe</h2>
          <p className="text-muted-foreground">john.doe@example.com</p>
        </div>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive"
          >
            Log Out
          </Button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
