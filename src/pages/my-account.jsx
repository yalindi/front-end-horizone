import { UserProfile } from "@clerk/clerk-react";
import { BookingHistory } from "@/components/BookingHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar } from "lucide-react";

const MyAccountPage = () => {
  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Booking History
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings">
            <BookingHistory />
          </TabsContent>
          
          <TabsContent value="profile">
            <div className="bg-white rounded-lg border p-6">
              <UserProfile />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default MyAccountPage;