import SalaryCheckForm from "@/components/forms/salary-check-form"
import { tokenLogIn } from "./actions/logging"

export default async function Home() {
  const { user } = await tokenLogIn()

  return (
    <main>
      <SalaryCheckForm user={user} />
    </main>
  )
}
