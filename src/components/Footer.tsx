import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'

const InstagramIcon = ({ size = 24, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

export function Footer() {
  return (
    <footer className="bg-[#E5D7CC] border-t border-[#DDD0C2] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Seção 1: Sobre o Ateliê */}
        <div className="flex flex-col space-y-3">
          <h3 className="font-heading font-bold text-[#B28F76] text-lg mb-2">Sobre o Ateliê</h3>
          <p className="text-[#B28F76] text-sm">🪡 Bordados personalizados feitos com amor e delicadeza</p>
          <p className="text-[#B28F76] text-sm">✨ Feito à mão por Silvana Becker</p>
          <p className="text-[#B28F76] text-sm">📍 Tubarão/SC</p>
        </div>

        {/* Seção 2: Contato */}
        <div className="flex flex-col space-y-3">
          <h3 className="font-heading font-bold text-[#B28F76] text-lg mb-2">Contato</h3>
          <a
            href="https://wa.me/5548999632215"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#B28F76] text-sm hover:text-[#D2B6A2] transition-colors w-fit"
          >
            <Phone size={16} />
            (48) 99963-2215
          </a>
          <a
            href="mailto:silvanabeckerbordados@yahoo.com"
            className="flex items-center gap-2 text-[#B28F76] text-sm hover:text-[#D2B6A2] transition-colors w-fit"
          >
            <Mail size={16} />
            silvanabeckerbordados@yahoo.com
          </a>
        </div>

        {/* Seção 3: Redes Sociais */}
        <div className="flex flex-col space-y-3">
          <h3 className="font-heading font-bold text-[#B28F76] text-lg mb-2">Redes Sociais</h3>
          <a
            href="https://www.instagram.com/silvanabeckerbordados?igsh=ZGcxaHRwc2tpdWQy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#B28F76] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-colors w-fit shadow-sm"
          >
            <InstagramIcon size={18} />
            Siga nosso Instagram
          </a>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-[#DDD0C2] flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-[#B28F76] text-center sm:text-left">
          © {new Date().getFullYear()} Ateliê Silvana Becker. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
