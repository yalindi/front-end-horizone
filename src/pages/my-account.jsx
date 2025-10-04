import { UserProfile } from "@clerk/clerk-react";
const MyAccountPage = () => {
  return (
    <>
        <main className="px-4 min-h-screen flex items-center justify-center">
            <UserProfile/>
        </main>
    </>
    
  );
}

export default MyAccountPage;