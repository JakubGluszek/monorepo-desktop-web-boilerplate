import { Outlet } from '@tanstack/react-router';
import { RootLayout } from '../layouts/root';

export default function RootRoute() {
  return (
    <>
      <RootLayout>
        <Outlet />
      </RootLayout>
    </>
  );
}
