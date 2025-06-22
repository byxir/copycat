import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

const Wrapper = () => {
  useEffect(() => {
    // Telegram WebApp initialization
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <div className="w-full h-full bg-background">
      <main className="w-full h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Wrapper;