import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const transacoes = await prisma.transacao.findMany()

    const gastoTotal = transacoes.reduce((acc, t) => acc + t.valor, 0)

    // Gastos por categoria
    const gastoPorCategoria = transacoes.reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor
      return acc
    }, {} as Record<string, number>)

    // Gastos por dia (últimos 30 dias)
    const hoje = new Date()
    const trintaDiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const transacoesRecentes = transacoes.filter(
      (t) => new Date(t.data) >= trintaDiasAtras
    )

    const gastoPorDia = transacoesRecentes.reduce((acc, t) => {
      const dia = new Date(t.data).toISOString().split('T')[0]
      acc[dia] = (acc[dia] || 0) + t.valor
      return acc
    }, {} as Record<string, number>)

    const maioresGastos = [...transacoes]
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 4)
      .map((t) => ({
        descricao: t.descricao,
        valor: t.valor,
        categoria: t.categoria,
      }))

    return NextResponse.json({
      gastoTotal,
      gastoPorCategoria,
      gastoPorDia,
      maioresGastos,
      totalTransacoes: transacoes.length,
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}

