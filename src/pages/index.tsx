import { signIn, signOut, useSession } from 'next-auth/react'

import { TodoList } from '@/components/TodoList'

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="container mx-auto p-4">
        Signed in as {session.user?.email} <br />
        <button className="bg-gray-200 p-2" onClick={() => signOut()}>
          Sign out
        </button>
        <TodoList />
      </div>
    )
  }
  return (
    <div className="container mx-auto p-4">
      Not signed in <br />
      <button className="bg-gray-200 p-2" onClick={() => signIn()}>
        Sign in
      </button>
    </div>
  )
}
