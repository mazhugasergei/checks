import SalaryCheckForm from "@/app/checks/salary-check-form"
import { tokenLogIn } from "../components/forms/auth/logging.actions"

export default async function Home() {
  const { user } = await tokenLogIn()

  return (
    <main>
      <SalaryCheckForm user={user} />
    </main>
  )
}
