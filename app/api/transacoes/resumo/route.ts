import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getUserId(request: NextRequest): string | null {
  const userId = request.headers.get('x-user-id')
  return userId
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes')
    const ano = searchParams.get('ano')

    if (!mes || !ano) {
      return NextResponse.json(
        { error: 'Parâmetros mes e ano são obrigatórios' },
        { status: 400 }
      )
    }

    const mesNum = parseInt(mes)
    const anoNum = parseInt(ano)

    // Buscar todas as transações do mês
    const transacoes = await prisma.transacao.findMany({
      where: {
        userId,
        mes: mesNum,
        ano: anoNum,
      },
    })

    // Calcular totais
    const renda = transacoes
      .filter(t => t.tipo === 'renda')
      .reduce((acc, t) => acc + t.valor, 0)

    const despesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + t.valor, 0)

    const economias = transacoes
      .filter(t => t.tipo === 'economia')
      .reduce((acc, t) => acc + t.valor, 0)

    const saldoRestante = renda - despesas - economias

    // Buscar mês anterior para comparação
    let despesasMesAnterior = 0;
    try {
      const mesAnterior = mesNum === 1 ? 12 : mesNum - 1
      const anoAnterior = mesNum === 1 ? anoNum - 1 : anoNum

      const transacoesMesAnterior = await prisma.transacao.findMany({
        where: {
          userId,
          mes: mesAnterior,
          ano: anoAnterior,
        },
      })

      despesasMesAnterior = transacoesMesAnterior
        .filter(t => t.tipo === 'despesa')
        .reduce((acc, t) => acc + t.valor, 0)
    } catch (error) {
      // Se não houver mês anterior, despesasMesAnterior permanece 0
      console.log('Sem dados do mês anterior');
    }

    return NextResponse.json({
      renda,
      despesas,
      economias,
      saldoRestante,
      despesasMesAnterior,
      totalTransacoes: transacoes.length,
    })
  } catch (error) {
    console.error('Erro ao buscar resumo:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar resumo' },
      { status: 500 }
    )
  }
}

