import SignupForm from "@/components/forms/auth/signup-form"
import { redirect } from "next/navigation"
import { tokenLogIn } from "../actions/logging"

export default async function SignUp() {
  const { user } = await tokenLogIn()
  if (user) redirect("/")

  return (
    <main>
      <SignupForm />
    </main>
  )
}
