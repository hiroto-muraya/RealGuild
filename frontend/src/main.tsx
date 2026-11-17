import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { router } from '@/app/router'
import { applyPalette, loadPalette } from '@/lib/palette'
import { queryClient } from '@/lib/query-client'
import './index.css'

// 保存済みの配色を最初の描画より前に適用する（ちらつき防止）
applyPalette(loadPalette())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
