import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Tracking from "./pages/Tracking";
import TravelDiaries from "./pages/TravelDiaries";
import AdminPortal from "./pages/AdminPortal";
import TripExecution from "./pages/TripExecution";
import GroupTravel from "./pages/GroupTravel";
import JoinGroup from "./pages/JoinGroup";
import MyGroups from "./pages/MyGroups";
import NotFound from "./pages/NotFound";
import Documentation from "./pages/Documentation";
import PlaceDetail from "./pages/PlaceDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PWAInstallPrompt />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/diaries" element={<TravelDiaries />} />
            <Route path="/admin-portal" element={<AdminPortal />} />
            <Route path="/trip-execution" element={<TripExecution />} />
            <Route path="/group/:groupId" element={<GroupTravel />} />
            <Route path="/group/join" element={<JoinGroup />} />
            <Route path="/my-groups" element={<MyGroups />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/place/:placeName" element={<PlaceDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
