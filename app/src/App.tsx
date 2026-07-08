import { useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './lib/auth';
import { useHabits } from './lib/data/hooks';
import { AuthScreen } from './screens/AuthScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { HabitsListScreen } from './screens/HabitsListScreen';
import { AddEditHabitScreen } from './screens/AddEditHabitScreen';
import { HabitDetailScreen } from './screens/HabitDetailScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { DayDetailScreen } from './screens/DayDetailScreen';
import { GeneralStatsScreen } from './screens/GeneralStatsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { TabBar, type TabKey } from './components/layout/TabBar';

function useOnboardingSeen(userId: string) {
  const key = `coachpal_onboarded_${userId}`;
  const [seen, setSeen] = useState(() => localStorage.getItem(key) === '1');
  const markDone = () => {
    localStorage.setItem(key, '1');
    setSeen(true);
  };
  return { seen, markDone };
}

function TabsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const active: TabKey = location.pathname.startsWith('/stats') ? 'stats' : location.pathname.startsWith('/profile') ? 'profile' : 'home';
  const onChange = (tab: TabKey) => navigate(tab === 'home' ? '/' : `/${tab}`);
  return (
    <>
      <Outlet />
      <TabBar active={active} onChange={onChange} />
    </>
  );
}

function LoadingScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-app)' }}>
      <div style={{ font: 'var(--text-body-md)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)' }}>Cargando…</div>
    </div>
  );
}

function AuthenticatedApp({ userId }: { userId: string }) {
  const { seen, markDone } = useOnboardingSeen(userId);
  const { isLoading } = useHabits();

  if (isLoading) return <LoadingScreen />;
  if (!seen) return <OnboardingScreen onFinish={markDone} />;

  return (
    <Routes>
      <Route element={<TabsLayout />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/stats" element={<GeneralStatsScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
      <Route path="/habits" element={<HabitsListScreen />} />
      <Route path="/habits/new" element={<AddEditHabitScreen />} />
      <Route path="/habits/:id" element={<HabitDetailScreen />} />
      <Route path="/habits/:id/edit" element={<AddEditHabitScreen />} />
      <Route path="/calendar" element={<CalendarScreen />} />
      <Route path="/day/:date" element={<DayDetailScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  return (
    <div className="app-shell">
      {loading ? <LoadingScreen /> : !user ? <AuthScreen /> : <AuthenticatedApp userId={user.id} />}
    </div>
  );
}
