import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Forçar renderização dinâmica (usa headers)
export const dynamic = 'force-dynamic'

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

    const transacoes = await prisma.transacao.findMany({
      where: {
        userId,
      },
      orderBy: {
        data: 'desc',
      },
    })
    return NextResponse.json(transacoes)
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar transações' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { descricao, categoria, valor, data, tipo, mes, ano } = body

    if (!descricao || !categoria || !valor || !tipo || !mes || !ano) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: descricao, categoria, valor, tipo, mes, ano' },
        { status: 400 }
      )
    }

    const dataTransacao = data ? new Date(data) : new Date()

    const transacao = await prisma.transacao.create({
      data: {
        descricao,
        categoria,
        valor: parseFloat(valor),
        data: dataTransacao,
        tipo: tipo, // "renda", "despesa", "economia"
        mes: parseInt(mes),
        ano: parseInt(ano),
        userId,
      },
    })

    return NextResponse.json(transacao, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar transação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar transação' },
      { status: 500 }
    )
  }
}

