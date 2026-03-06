/**
 * BLOCKEEPER - Main Application Router
 * Design: Dark Navy + Neon Cyan
 * Rebuilt based on HLD document
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Web App Pages
import LoginPage from "./pages/LoginPage";
import WebDashboard from "./pages/WebDashboard";
import AlertsPage from "./pages/AlertsPage";
import AlertDetailPage from "./pages/AlertDetailPage";
import CamerasPage from "./pages/CamerasPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
// Mobile App Pages
import MobileHomePage from "./pages/mobile/MobileHomePage";
import MobileAlertsPage from "./pages/mobile/MobileAlertsPage";
import MobileCamerasPage from "./pages/mobile/MobileCamerasPage";
import MobileAnalyticsPage from "./pages/mobile/MobileAnalyticsPage";
import MobileSettingsPage from "./pages/mobile/MobileSettingsPage";

/**
 * Simple auth check - in production this would verify a JWT token.
 * For the prototype, we treat any visit to the app as authenticated
 * unless the user explicitly navigates to /login.
 */
function isAuthenticated(): boolean {
  // In a real app: return !!localStorage.getItem("bk_auth_token");
  // For the prototype/demo, always return true so the app is fully explorable.
  return true;
}

/** Redirect unauthenticated users to /login */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  if (!isAuthenticated()) {
    return <Redirect to={`/login?redirect=${encodeURIComponent(location)}`} />;
  }
  return <>{children}</>;
}

// Mobile View Wrapper - shows phone frame on desktop
function MobileWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-start justify-center py-8 px-4" style={{ background: "#060A12" }}>
      <div className="w-full" style={{ maxWidth: "430px" }}>
        {/* Phone Frame */}
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl" style={{ border: "2px solid rgba(0,212,255,0.15)", boxShadow: "0 0 60px rgba(0,212,255,0.08), 0 40px 80px rgba(0,0,0,0.6)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Auth - public route */}
      <Route path="/login" component={LoginPage} />

      {/* Web App - protected routes */}
      <Route path="/">
        {() => <ProtectedRoute><WebDashboard /></ProtectedRoute>}
      </Route>
      <Route path="/alerts">
        {() => <ProtectedRoute><AlertsPage /></ProtectedRoute>}
      </Route>
      <Route path="/alerts/:id">
        {(params) => <ProtectedRoute><AlertDetailPage params={params} /></ProtectedRoute>}
      </Route>
      <Route path="/cameras">
        {() => <ProtectedRoute><CamerasPage /></ProtectedRoute>}
      </Route>
      <Route path="/analytics">
        {() => <ProtectedRoute><AnalyticsPage /></ProtectedRoute>}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute><SettingsPage /></ProtectedRoute>}
      </Route>

      {/* Mobile App - protected routes */}
      <Route path="/mobile">
        {() => <ProtectedRoute><MobileWrapper><MobileHomePage /></MobileWrapper></ProtectedRoute>}
      </Route>
      <Route path="/mobile/alerts">
        {() => <ProtectedRoute><MobileWrapper><MobileAlertsPage /></MobileWrapper></ProtectedRoute>}
      </Route>
      <Route path="/mobile/cameras">
        {() => <ProtectedRoute><MobileWrapper><MobileCamerasPage /></MobileWrapper></ProtectedRoute>}
      </Route>
      <Route path="/mobile/analytics">
        {() => <ProtectedRoute><MobileWrapper><MobileAnalyticsPage /></MobileWrapper></ProtectedRoute>}
      </Route>
      <Route path="/mobile/settings">
        {() => <ProtectedRoute><MobileWrapper><MobileSettingsPage /></MobileWrapper></ProtectedRoute>}
      </Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
