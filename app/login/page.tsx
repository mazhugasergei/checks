import LogInForm from "@/components/forms/auth/login-form"
import { redirect } from "next/navigation"
import { tokenLogIn } from "../../components/forms/auth/logging.actions"

export default async function LogIn() {
  const { user } = await tokenLogIn()
  if (user) redirect("/")

  return (
    <main>
      <LogInForm />
    </main>
  )
}
