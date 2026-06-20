'use client'

import { useState, useTransition } from 'react'
import { addAddress, deleteAddress } from '@/actions/address'
import { MapPin, Trash2, Plus, Loader2 } from 'lucide-react'

interface Address {
  id: string
  zip_code: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
}

export function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')

  // Form states
  const [zipCode, setZipCode] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  const handleCepChange = async (val: string) => {
    const rawCep = val.replace(/\D/g, '')
    let formattedCep = rawCep
    if (rawCep.length > 5) {
      formattedCep = `${rawCep.slice(0, 5)}-${rawCep.slice(5, 8)}`
    }
    setZipCode(formattedCep)

    if (rawCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`)
        const data = await res.json()

        if (!data.erro) {
          setStreet(data.logradouro || '')
          setNeighborhood(data.bairro || '')
          setCity(data.localidade || '')
          setState(data.uf || '')
          document.getElementById('profile-number')?.focus()
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err)
      }
    }
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    
    const formData = new FormData()
    formData.append('zip_code', zipCode)
    formData.append('street', street)
    formData.append('number', number)
    formData.append('complement', complement)
    formData.append('neighborhood', neighborhood)
    formData.append('city', city)
    formData.append('state', state)

    startTransition(async () => {
      const res = await addAddress(formData)
      if (res.error) {
        setErrorMsg(res.error)
      } else {
        setIsAdding(false)
        setZipCode('')
        setStreet('')
        setNumber('')
        setComplement('')
        setNeighborhood('')
        setCity('')
        setState('')
      }
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este endereço?')) {
      startTransition(async () => {
        await deleteAddress(id)
      })
    }
  }

  return (
    <div className="bg-[#ECE1D9] p-6 rounded-xl border border-[#DDD0C2] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-heading font-bold text-[#B28F76]">Meus Endereços</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 bg-[#B28F76] text-[#F3EAE5] px-4 py-2 rounded-md font-medium hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-colors"
          >
            <Plus size={18} />
            Adicionar Novo
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 mb-6 rounded-md text-sm bg-red-50 text-red-600 border border-red-200">
          {errorMsg}
        </div>
      )}

      {isAdding && (
        <div className="mb-8 p-6 bg-[#F3EAE5] border border-[#DDD0C2] rounded-lg">
          <h3 className="font-heading font-bold text-[#B28F76] mb-4">Novo Endereço</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <input
              name="zip_code"
              type="text"
              required
              maxLength={9}
              className="relative block w-full md:w-1/3 rounded-md border-0 py-2.5 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] focus:ring-2 focus:ring-inset focus:ring-[#B28F76] bg-white sm:text-sm sm:leading-6"
              placeholder="CEP"
              value={zipCode}
              onChange={e => handleCepChange(e.target.value)}
            />

            <div className="flex flex-col md:flex-row gap-4">
              <input
                name="street"
                type="text"
                required
                className="relative block w-full md:w-3/4 rounded-md border-0 py-2.5 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] focus:ring-2 focus:ring-inset focus:ring-[#B28F76] bg-white sm:text-sm sm:leading-6"
                placeholder="Rua / Logradouro"
                value={street}
                onChange={e => setStreet(e.target.value)}
              />
              <input
                id="profile-number"
                name="number"
                type="text"
                required
                className="relative block w-full md:w-1/4 rounded-md border-0 py-2.5 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] focus:ring-2 focus:ring-inset focus:ring-[#B28F76] bg-white sm:text-sm sm:leading-6"
                placeholder="Número"
                value={number}
                onChange={e => setNumber(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                name="complement"
                type="text"
                className="relative block w-full md:w-1/2 rounded-md border-0 py-2.5 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] focus:ring-2 focus:ring-inset focus:ring-[#B28F76] bg-white sm:text-sm sm:leading-6"
                placeholder="Complemento (Opcional)"
                value={complement}
                onChange={e => setComplement(e.target.value)}
              />
              <input
                name="neighborhood"
                type="text"
                required
                className="relative block w-full md:w-1/2 rounded-md border-0 py-2.5 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] focus:ring-2 focus:ring-inset focus:ring-[#B28F76] bg-white sm:text-sm sm:leading-6"
                placeholder="Bairro"
                value={neighborhood}
                onChange={e => setNeighborhood(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                name="city"
                type="text"
                required
                className="relative block w-full md:w-3/4 rounded-md border-0 py-2.5 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] focus:ring-2 focus:ring-inset focus:ring-[#B28F76] bg-white sm:text-sm sm:leading-6"
                placeholder="Cidade"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
              <input
                name="state"
                type="text"
                required
                maxLength={2}
                className="relative block w-full md:w-1/4 rounded-md border-0 py-2.5 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] focus:ring-2 focus:ring-inset focus:ring-[#B28F76] bg-white sm:text-sm sm:leading-6 uppercase"
                placeholder="UF"
                value={state}
                onChange={e => setState(e.target.value.toUpperCase())}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-md font-medium text-[#B28F76] bg-transparent border border-[#B28F76] hover:bg-[#DDD0C2] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 bg-[#B28F76] text-white px-6 py-2 rounded-md font-medium hover:bg-[#D2B6A2] transition-colors disabled:opacity-50"
              >
                {isPending && <Loader2 size={16} className="animate-spin" />}
                {isPending ? 'Salvando...' : 'Salvar Endereço'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {initialAddresses.length === 0 && !isAdding ? (
          <p className="text-[#B28F76] col-span-full">Você ainda não possui endereços cadastrados.</p>
        ) : (
          initialAddresses.map(addr => (
            <div key={addr.id} className="bg-[#F3EAE5] border border-[#DDD0C2] p-4 rounded-lg flex flex-col relative group">
              <button
                onClick={() => handleDelete(addr.id)}
                disabled={isPending}
                className="absolute top-3 right-3 text-[#B28F76] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                aria-label="Remover endereço"
                title="Remover endereço"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="flex items-start gap-3 flex-1">
                <MapPin className="text-[#B28F76] shrink-0 mt-0.5" size={20} />
                <div className="text-[#B28F76]">
                  <p className="font-bold">{addr.street}, {addr.number}</p>
                  {addr.complement && <p className="text-sm">{addr.complement}</p>}
                  <p className="text-sm">{addr.neighborhood}</p>
                  <p className="text-sm">{addr.city} - {addr.state}</p>
                  <p className="text-sm mt-1 opacity-80">CEP: {addr.zip_code}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
