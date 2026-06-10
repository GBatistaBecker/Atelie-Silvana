import { signOut } from '@/actions/auth'
import { LogOut } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F3EAE5] p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-heading font-bold text-[#B28F76] mb-8">
        Home do Ateliê
      </h1>
      
      <form action={signOut}>
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-[#ECE1D9] text-[#B28F76] font-medium rounded-md border border-[#DDD0C2] hover:bg-[#DDD0C2] transition-colors shadow-sm"
        >
          <LogOut size={20} />
          Fazer Logout
        </button>
      </form>
    </div>
  )
}
