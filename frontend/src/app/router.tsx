import { createBrowserRouter } from 'react-router'
import { GuestOnly, RequireAuth } from '@/app/route-guards'
import { AppLayout } from '@/components/layout/AppLayout'
import { CharacterPage } from '@/pages/CharacterPage'
import { HomePage } from '@/pages/HomePage'
import { LogPage } from '@/pages/LogPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { QuestsPage } from '@/pages/QuestsPage'
import { RegisterPage } from '@/pages/RegisterPage'

// 画面一覧は docs/design.md 2.1 を参照
export const router = createBrowserRouter([
  {
    element: <GuestOnly />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/quests', element: <QuestsPage /> },
          { path: '/log', element: <LogPage /> },
          { path: '/character', element: <CharacterPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
