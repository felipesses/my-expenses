import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getUserId(request: NextRequest): string | null {
  const userId = request.headers.get('x-user-id')
  return userId
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    const transacao = await prisma.transacao.findFirst({
      where: { 
        id,
        userId,
      },
    })

    if (!transacao) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(transacao)
  } catch (error) {
    console.error('Erro ao buscar transação:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar transação' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    
    // Verificar se a transação pertence ao usuário
    const transacaoExistente = await prisma.transacao.findFirst({
      where: { id, userId },
    })

    if (!transacaoExistente) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { descricao, categoria, valor, data, tipo, mes, ano } = body

    const transacao = await prisma.transacao.update({
      where: { id },
      data: {
        ...(descricao && { descricao }),
        ...(categoria && { categoria }),
        ...(valor && { valor: typeof valor === 'string' ? parseFloat(valor.replace(/\./g, '').replace(',', '.')) : parseFloat(valor) }),
        ...(data && { data: new Date(data) }),
        ...(tipo && { tipo }),
        ...(mes && { mes: parseInt(mes) }),
        ...(ano && { ano: parseInt(ano) }),
      },
    })

    return NextResponse.json(transacao)
  } catch (error) {
    console.error('Erro ao atualizar transação:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar transação' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    
    // Verificar se a transação pertence ao usuário
    const transacaoExistente = await prisma.transacao.findFirst({
      where: { id, userId },
    })

    if (!transacaoExistente) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      )
    }

    await prisma.transacao.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Transação deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar transação:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar transação' },
      { status: 500 }
    )
  }
}

