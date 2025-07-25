'use client'

import {  useUser } from '@clerk/nextjs'
import HomePage from '@/components/pages/homePage'
import LoginComponent from '@/components/pages/LoginComponent'

export default function Page() {
  const { isSignedIn, user } = useUser()

  return (
    <main>

      {isSignedIn ? (
        <>
          <HomePage />
        </>
      ) : (
        <LoginComponent />
      )}
    </main>
  )
}
