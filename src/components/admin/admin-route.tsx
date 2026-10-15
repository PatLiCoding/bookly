import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/use-auth'

/**
 * Higher-order route wrapper that restricts access to admin users only.
 */
export default function AdminRoute({ children }: { children: ReactNode }) {
  const { loggedUser } = useAuth()
  if (loggedUser?.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}