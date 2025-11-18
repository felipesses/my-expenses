"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Progress } from "@/ui/progress";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Utensils,
  Car,
  Home as HomeIcon,
  Smartphone,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  LogOut,
  DollarSign,
  PiggyBank,
  ArrowLeftRight,
  Edit,
  Menu,
  Trash2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Transacao {
  id: number;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  tipo: string;
  mes: number;
  ano: number;
}

interface ResumoMes {
  renda: number;
  despesas: number;
  economias: number;
  saldoRestante: number;
  despesasMesAnterior: number;
}

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function HomeContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [todasTransacoes, setTodasTransacoes] = useState<Transacao[]>([]);
  const [resumo, setResumo] = useState<ResumoMes>({
    renda: 0,
    despesas: 0,
    economias: 0,
    saldoRestante: 0,
    despesasMesAnterior: 0,
  });
  const [loading, setLoading] = useState(true);

  const hoje = new Date();
  
  // Carregar mês selecionado do localStorage
  const [mesSelecionado, setMesSelecionado] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mesSelecionado');
      return saved ? parseInt(saved) : hoje.getMonth() + 1;
    }
    return hoje.getMonth() + 1;
  });
  
  const [anoSelecionado, setAnoSelecionado] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anoSelecionado');
      return saved ? parseInt(saved) : hoje.getFullYear();
    }
    return hoje.getFullYear();
  });

  // Salvar mês selecionado no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mesSelecionado', mesSelecionado.toString());
      localStorage.setItem('anoSelecionado', anoSelecionado.toString());
    }
  }, [mesSelecionado, anoSelecionado]);

  // Carregar dados
  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user, mesSelecionado, anoSelecionado]);

  const carregarDados = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Carregar resumo do mês
      const resumoResponse = await fetch(
        `/api/transacoes/resumo?mes=${mesSelecionado}&ano=${anoSelecionado}`,
        {
          headers: {
            "x-user-id": user.uid,
          },
        }
      );

      if (resumoResponse.ok) {
        const resumoData = await resumoResponse.json();
        setResumo(resumoData);
      }

      // Carregar transações do mês
      const transacoesResponse = await fetch("/api/transacoes", {
        headers: {
          "x-user-id": user.uid,
        },
      });

      if (transacoesResponse.ok) {
        const data = await transacoesResponse.json();
        const transacoesMes = data.filter(
          (t: Transacao) => t.mes === mesSelecionado && t.ano === anoSelecionado
        );
        setTransacoes(transacoesMes);
        // Armazenar todas as transações para cálculo de reserva
        setTodasTransacoes(data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Calcular gastos por categoria (apenas despesas)
  // Obter categorias únicas das transações de despesa
  const categoriasDespesa = [
    "Cartão de Crédito",
    "Mensalidade",
    "Parcelamento",
    "PIX",
    "Medicamento",
    "Supermercado",
    "Saúde",
    "Transporte",
    "Moradia",
    "Educação",
    "Lazer",
    "Tecnologia",
    "Assinaturas",
    "Outros",
  ];

  // Mapear categorias para ícones e cores
  const categoriaConfig: Record<string, { icon: any; color: string }> = {
    "Cartão de Crédito": { icon: CreditCard, color: "#8b5cf6" },
    "Mensalidade": { icon: CreditCard, color: "#f43f5e" },
    "Parcelamento": { icon: CreditCard, color: "#ec4899" },
    "PIX": { icon: Wallet, color: "#10b981" },
    "Medicamento": { icon: Smartphone, color: "#ec4899" },
    "Supermercado": { icon: ShoppingCart, color: "#f59e0b" },
    "Saúde": { icon: Smartphone, color: "#ec4899" },
    "Transporte": { icon: Car, color: "#3b82f6" },
    "Moradia": { icon: HomeIcon, color: "#10b981" },
    "Educação": { icon: CreditCard, color: "#f43f5e" },
    "Lazer": { icon: ShoppingCart, color: "#8b5cf6" },
    "Tecnologia": { icon: Smartphone, color: "#ec4899" },
    "Assinaturas": { icon: CreditCard, color: "#f43f5e" },
    "Outros": { icon: MoreHorizontal, color: "#6b7280" },
  };

  // Calcular gastos por categoria a partir das transações reais
  const gastosPorCategoriaMap = new Map<string, number>();
  
  transacoes
    .filter((t) => t.tipo === "despesa")
    .forEach((t) => {
      const valorAtual = gastosPorCategoriaMap.get(t.categoria) || 0;
      gastosPorCategoriaMap.set(t.categoria, valorAtual + t.valor);
    });

  // Converter para array e adicionar ícones e cores
  const gastoPorCategoria = Array.from(gastosPorCategoriaMap.entries())
    .map(([categoria, valor]) => {
      const config = categoriaConfig[categoria] || {
        icon: MoreHorizontal,
        color: "#6b7280",
      };
      return {
        categoria,
        valor,
        icon: config.icon,
        color: config.color,
      };
    })
    .sort((a, b) => b.valor - a.valor);

  // Comparação com mês anterior
  const variacaoDespesas =
    resumo.despesasMesAnterior > 0
      ? ((resumo.despesas - resumo.despesasMesAnterior) /
          resumo.despesasMesAnterior) *
        100
      : 0;

  // Gerar lista de meses (ano atual e próximo)
  const anoAtual = hoje.getFullYear();
  const mesesAnos = [];
  for (let ano = anoAtual; ano <= anoAtual + 1; ano++) {
    for (let mes = 1; mes <= 12; mes++) {
      mesesAnos.push({ mes, ano, label: `${meses[mes - 1]} ${ano}` });
    }
  }

  const handleExcluir = async (id: number) => {
    if (!user) return;
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return;

    try {
      const response = await fetch(`/api/transacoes/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user.uid,
        },
      });

      if (response.ok) {
        await carregarDados();
      } else {
        alert("Erro ao excluir transação");
      }
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      alert("Erro ao excluir transação");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 flex items-center justify-center">
        <p className="text-slate-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-violet-50 to-purple-50">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              {/* Título e descrição */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                    Controle Financeiro
                  </h1>
                  <p className="text-sm md:text-base text-slate-600">
                    Gerencie sua renda, despesas e economias
                  </p>
                </div>
                {/* Botão de logout - desktop */}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>

              {/* Controles - Mobile e Desktop */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Select
                  value={`${mesSelecionado}-${anoSelecionado}`}
                  onValueChange={(value) => {
                    const [mes, ano] = value.split("-").map(Number);
                    setMesSelecionado(mes);
                    setAnoSelecionado(ano);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mesesAnos.map((item) => (
                      <SelectItem
                        key={`${item.mes}-${item.ano}`}
                        value={`${item.mes}-${item.ano}`}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Link href="/transacao/nova" className="flex-1 sm:flex-initial">
                  <Button className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Nova Transação</span>
                    <span className="sm:hidden">Nova</span>
                  </Button>
                </Link>

                {/* Botão de logout - mobile */}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="md:hidden flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards principais de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-700">Renda</CardTitle>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900 mb-1">{formatarMoeda(resumo.renda)}</div>
              <p className="text-sm text-slate-600">Total do mês</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-700">Despesas</CardTitle>
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900 mb-1">
                {formatarMoeda(resumo.despesas)}
              </div>
              <div className="flex items-center gap-1 text-sm">
                {variacaoDespesas !== 0 && (
                  <span
                    className={
                      variacaoDespesas > 0 ? "text-red-600" : "text-green-600"
                    }
                  >
                    <ArrowUpRight className="h-4 w-4 inline" />
                    {Math.abs(variacaoDespesas).toFixed(1)}% vs mês anterior
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-700">Economias</CardTitle>
                <PiggyBank className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900 mb-1">
                {formatarMoeda(resumo.economias)}
              </div>
              <p className="text-sm text-slate-600">Poupado no mês</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white/90">Saldo Restante</CardTitle>
                <ArrowLeftRight className="h-5 w-5 text-white/80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1 text-white">
                {formatarMoeda(resumo.saldoRestante)}
              </div>
              <p className="text-sm text-white/80">
                Renda - Despesas - Economias
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de despesas por categoria */}
          <Card className="lg:col-span-2 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900">
                Despesas por Categoria
              </CardTitle>
              <CardDescription>Distribuição de gastos no mês</CardDescription>
            </CardHeader>
            <CardContent>
              {gastoPorCategoria.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gastoPorCategoria}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="valor"
                    >
                      {gastoPorCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                              <p className="font-semibold text-slate-900">
                                {data.categoria}
                              </p>
                              <p className="text-sm text-slate-600">
                                {formatarMoeda(data.valor)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                  Nenhuma despesa registrada
                </div>
              )}
            </CardContent>
          </Card>

          {/* Categorias detalhadas */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900">Categorias</CardTitle>
              <CardDescription>Despesas por categoria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {gastoPorCategoria.length > 0 ? (
                gastoPorCategoria.map((item) => {
                  const Icon = item.icon;
                  const percentual =
                    resumo.despesas > 0
                      ? (item.valor / resumo.despesas) * 100
                      : 0;
                  return (
                    <div key={item.categoria} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${item.color}20` }}
                          >
                            <Icon
                              className="h-4 w-4"
                              style={{ color: item.color }}
                            />
                          </div>
                          <span className="text-sm text-slate-700">
                            {item.categoria}
                          </span>
                        </div>
                        <span className="text-sm text-slate-900">
                          {formatarMoeda(item.valor)}
                        </span>
                      </div>
                      <Progress
                        value={percentual}
                        className="h-1.5"
                        style={{
                          backgroundColor: "#e2e8f0",
                        }}
                      />
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">
                  Nenhuma despesa registrada ainda
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transações por tipo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rendas do Mês */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Rendas do Mês
              </CardTitle>
              <CardDescription>
                Total: {formatarMoeda(resumo.renda)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {transacoes.filter((t) => t.tipo === "renda").length > 0 ? (
                  transacoes
                    .filter((t) => t.tipo === "renda")
                    .sort(
                      (a, b) =>
                        new Date(b.data).getTime() - new Date(a.data).getTime()
                    )
                    .map((transacao) => (
                      <div
                        key={transacao.id}
                        className="p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors border border-green-100"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-900 font-semibold mb-2 truncate">
                              {transacao.descricao}
                            </p>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs font-medium">
                                  {transacao.categoria}
                                </Badge>
                              </div>
                              <span className="text-sm font-medium text-slate-600">
                                {new Date(transacao.data).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 flex-shrink-0">
                            <div className="text-right">
                              <p className="text-green-600 font-bold text-base whitespace-nowrap">
                                +{formatarMoeda(transacao.valor)}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Link href={`/transacao/${transacao.id}/editar`}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Excluir"
                                onClick={() => handleExcluir(transacao.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-6">
                    Nenhuma renda registrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Despesas do Mês */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Despesas do Mês
              </CardTitle>
              <CardDescription>
                Total: {formatarMoeda(resumo.despesas)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {transacoes.filter((t) => t.tipo === "despesa").length > 0 ? (
                  transacoes
                    .filter((t) => t.tipo === "despesa")
                    .sort(
                      (a, b) =>
                        new Date(b.data).getTime() - new Date(a.data).getTime()
                    )
                    .map((transacao) => (
                      <div
                        key={transacao.id}
                        className="p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors border border-red-100"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-900 font-semibold mb-2 truncate">
                              {transacao.descricao}
                            </p>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs font-medium">
                                  {transacao.categoria}
                                </Badge>
                              </div>
                              <span className="text-sm font-medium text-slate-600">
                                {new Date(transacao.data).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 flex-shrink-0">
                            <div className="text-right">
                              <p className="text-red-600 font-bold text-base whitespace-nowrap">
                                -{formatarMoeda(transacao.valor)}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Link href={`/transacao/${transacao.id}/editar`}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Excluir"
                                onClick={() => handleExcluir(transacao.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-6">
                    Nenhuma despesa registrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Economias do Mês */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-blue-600" />
                Economias do Mês
              </CardTitle>
              <CardDescription>
                Total: {formatarMoeda(resumo.economias)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {transacoes.filter((t) => t.tipo === "economia").length > 0 ? (
                  transacoes
                    .filter((t) => t.tipo === "economia")
                    .sort(
                      (a, b) =>
                        new Date(b.data).getTime() - new Date(a.data).getTime()
                    )
                    .map((transacao) => (
                      <div
                        key={transacao.id}
                        className="p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-900 font-semibold mb-2 truncate">
                              {transacao.descricao}
                            </p>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs font-medium">
                                  {transacao.categoria}
                                </Badge>
                              </div>
                              <span className="text-sm font-medium text-slate-600">
                                {new Date(transacao.data).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 flex-shrink-0">
                            <div className="text-right">
                              <p className="text-blue-600 font-bold text-base whitespace-nowrap">
                                {formatarMoeda(transacao.valor)}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Link href={`/transacao/${transacao.id}/editar`}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Excluir"
                                onClick={() => handleExcluir(transacao.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-6">
                    Nenhuma economia registrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recomendação de Economia */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-blue-600" />
              Recomendação de Reserva de Emergência
            </CardTitle>
            <CardDescription>
              Baseado nas suas despesas mensais
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              // Calcular média de despesas do mês atual
              const despesaMedia = resumo.despesas > 0 ? resumo.despesas : 0;
              
              // Reserva de emergência recomendada: 6 meses de despesas
              const reservaRecomendada = despesaMedia * 6;
              
              // Total economizado até agora (soma de TODAS as economias de todos os meses)
              const totalEconomizado = todasTransacoes
                .filter((t) => t.tipo === "economia")
                .reduce((acc, t) => acc + t.valor, 0);
              
              // Quanto falta para atingir a reserva
              const faltaParaReserva = Math.max(0, reservaRecomendada - totalEconomizado);
              
              // Percentual da reserva atingido
              const percentualReserva = reservaRecomendada > 0 
                ? Math.min(100, (totalEconomizado / reservaRecomendada) * 100)
                : 0;

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-white">
                      <p className="text-sm text-slate-600 mb-1">
                        Despesa Média Mensal
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        {formatarMoeda(despesaMedia)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white">
                      <p className="text-sm text-slate-600 mb-1">
                        Reserva Recomendada
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatarMoeda(reservaRecomendada)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        (6 meses de despesas)
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white">
                      <p className="text-sm text-slate-600 mb-1">
                        Total Economizado
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatarMoeda(totalEconomizado)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">
                        Progresso da Reserva de Emergência
                      </span>
                      <span className="font-semibold text-slate-900">
                        {percentualReserva.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={percentualReserva} className="h-3" />
                  </div>

                  {faltaParaReserva > 0 ? (
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-sm font-medium text-amber-900 mb-1">
                        💡 Recomendação
                      </p>
                      <p className="text-sm text-amber-800">
                        Você ainda precisa economizar{" "}
                        <span className="font-semibold">
                          {formatarMoeda(faltaParaReserva)}
                        </span>{" "}
                        para atingir sua reserva de emergência recomendada.
                      </p>
                      <p className="text-xs text-amber-700 mt-2">
                        Economize pelo menos{" "}
                        <span className="font-semibold">
                          {formatarMoeda(faltaParaReserva / 12)}
                        </span>{" "}
                        por mês durante 12 meses para alcançar sua meta.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-sm font-medium text-green-900 mb-1">
                        🎉 Parabéns!
                      </p>
                      <p className="text-sm text-green-800">
                        Você já atingiu sua reserva de emergência recomendada!
                        Continue economizando para manter sua segurança financeira.
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
