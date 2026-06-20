import { Header } from '@/components/Header'
import { RegisterForm } from './RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3EAE5]">
      <Header user={null} />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <RegisterForm />
      </div>
    </div>
  )
}
