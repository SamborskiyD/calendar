'use client'

import { signOut } from "next-auth/react"

const LogOutButton = () => {
  return (
    <button onClick={signOut} className="button button__delete">Log Out</button>
  )
}

export default LogOutButton