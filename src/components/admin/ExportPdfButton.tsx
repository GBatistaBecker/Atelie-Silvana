'use client'

import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { getFilteredOrdersForExport } from '@/actions/orders'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function ExportPdfButton({ query }: { query: string }) {
  const [isExporting, setIsExporting] = useState(false)
  const handleExport = async () => {
    setIsExporting(true)
    try {
      const { data, error } = await getFilteredOrdersForExport(query)

      if (error || !data) {
        console.error('Erro ao buscar dados para PDF', error)
        alert('Erro ao gerar relatório.')
        return
      }

      const doc = new jsPDF()

      // Título e Cabeçalho
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.setTextColor(178, 143, 118) // #B28F76 (Muted Warm)
      doc.text('Ateliê Silvana Becker', 14, 22)
      
      doc.setFontSize(12)
      doc.setTextColor(100)
      doc.text('Relatório de Histórico de Vendas', 14, 30)

      if (query) {
        doc.setFontSize(10)
        doc.text(`Filtro aplicado: Cliente "${query}"`, 14, 36)
      }

      // Preparando dados da tabela
      let totalGeral = 0
      const tableData = data.map((order: any) => {
        totalGeral += Number(order.total_price)
        return [
          order.user?.name || 'Desconhecido',
          new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_price),
          new Date(order.created_at).toLocaleDateString('pt-BR')
        ]
      })

      autoTable(doc, {
        startY: query ? 42 : 36,
        head: [['Cliente', 'Valor Total', 'Data']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [178, 143, 118] },
        styles: { font: 'helvetica', fontSize: 10 },
      })

      // Adicionando Total
      const finalY = (doc as any).lastAutoTable.finalY || 40
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(178, 143, 118)
      doc.text(
        `Total Acumulado: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGeral)}`,
        14,
        finalY + 10
      )

      doc.save(`vendas_atelie_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (err) {
      console.error(err)
      alert('Ocorreu um erro ao gerar o PDF.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 bg-[#B28F76] text-[#F3EAE5] px-4 py-2 rounded-md hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-wait"
    >
      <FileDown size={18} />
      {isExporting ? 'Gerando PDF...' : 'Exportar Histórico (PDF)'}
    </button>
  )
}
