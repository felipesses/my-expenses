import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ShoppingCart, 
  Utensils, 
  Car, 
  Home, 
  Smartphone,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface Transacao {
  id: number;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  tipo: string;
}

export default function App() {
  // Estados para gerenciar transações e diálogo
  const [transacoesRecentes, setTransacoesRecentes] = useState<Transacao[]>([
    { id: 1, descricao: "Amazon.com", categoria: "Compras", valor: 450.00, data: "18/11/2025", tipo: "débito" },
    { id: 2, descricao: "iFood", categoria: "Alimentação", valor: 85.50, data: "17/11/2025", tipo: "débito" },
    { id: 3, descricao: "Uber", categoria: "Transporte", valor: 32.75, data: "17/11/2025", tipo: "débito" },
    { id: 4, descricao: "Netflix", categoria: "Assinaturas", valor: 55.90, data: "16/11/2025", tipo: "débito" },
    { id: 5, descricao: "Supermercado Extra", categoria: "Alimentação", valor: 320.80, data: "16/11/2025", tipo: "débito" },
    { id: 6, descricao: "Shell", categoria: "Transporte", valor: 250.00, data: "15/11/2025", tipo: "débito" },
  ]);

  const [dialogAberto, setDialogAberto] = useState(false);
  const [novaTransacao, setNovaTransacao] = useState({
    descricao: "",
    categoria: "",
    valor: "",
    data: new Date().toISOString().split('T')[0]
  });

  // Dados mockados para o dashboard
  const limiteTotal = 15000;
  const gastoTotal = transacoesRecentes.reduce((acc, t) => acc + t.valor, 0);
  const limiteDisponivel = limiteTotal - gastoTotal;
  const percentualUsado = (gastoTotal / limiteTotal) * 100;
  const gastoMesAnterior = 7230.50;
  const variacaoMensal = ((gastoTotal - gastoMesAnterior) / gastoMesAnterior) * 100;

  const categorias = [
    { nome: "Compras", icon: ShoppingCart, color: "#8b5cf6" },
    { nome: "Alimentação", icon: Utensils, color: "#f59e0b" },
    { nome: "Transporte", icon: Car, color: "#3b82f6" },
    { nome: "Moradia", icon: Home, color: "#10b981" },
    { nome: "Tecnologia", icon: Smartphone, color: "#ec4899" },
    { nome: "Assinaturas", icon: CreditCard, color: "#f43f5e" },
    { nome: "Outros", icon: MoreHorizontal, color: "#6b7280" }
  ];

  // Calcular gastos por categoria
  const gastoPorCategoria = categorias.map(cat => {
    const valor = transacoesRecentes
      .filter(t => t.categoria === cat.nome)
      .reduce((acc, t) => acc + t.valor, 0);
    return {
      categoria: cat.nome,
      valor,
      icon: cat.icon,
      color: cat.color
    };
  }).filter(cat => cat.valor > 0);

  const gastoPorDia = [
    { dia: "01", valor: 245.50 },
    { dia: "03", valor: 580.00 },
    { dia: "05", valor: 120.75 },
    { dia: "07", valor: 890.00 },
    { dia: "09", valor: 340.25 },
    { dia: "11", valor: 1250.00 },
    { dia: "13", valor: 450.80 },
    { dia: "15", valor: 720.50 },
    { dia: "17", valor: 980.75 },
    { dia: "19", valor: 520.30 },
    { dia: "21", valor: 680.90 },
    { dia: "23", valor: 420.00 },
    { dia: "25", valor: 250.00 },
  ];

  const maioresGastos = [...transacoesRecentes]
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 4)
    .map(t => ({
      descricao: t.descricao,
      valor: t.valor,
      categoria: t.categoria
    }));

  const adicionarTransacao = () => {
    if (!novaTransacao.descricao || !novaTransacao.categoria || !novaTransacao.valor) {
      return;
    }

    const novaId = Math.max(...transacoesRecentes.map(t => t.id), 0) + 1;
    const valorNumerico = parseFloat(novaTransacao.valor.replace(',', '.'));

    const transacao: Transacao = {
      id: novaId,
      descricao: novaTransacao.descricao,
      categoria: novaTransacao.categoria,
      valor: valorNumerico,
      data: new Date(novaTransacao.data).toLocaleDateString('pt-BR'),
      tipo: "débito"
    };

    setTransacoesRecentes([transacao, ...transacoesRecentes]);
    setDialogAberto(false);
    setNovaTransacao({
      descricao: "",
      categoria: "",
      valor: "",
      data: new Date().toISOString().split('T')[0]
    });
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-slate-900 mb-2">Controle de Gastos</h1>
            <p className="text-slate-600">Acompanhe seus gastos e mantenha suas finanças organizadas</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-4 py-2">
              Novembro 2025
            </Badge>
            
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Transação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Registrar Transação</DialogTitle>
                  <DialogDescription>
                    Adicione uma nova transação ao seu cartão de crédito
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Input
                      id="descricao"
                      placeholder="Ex: Supermercado, Restaurante..."
                      value={novaTransacao.descricao}
                      onChange={(e) => setNovaTransacao({ ...novaTransacao, descricao: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select
                      value={novaTransacao.categoria}
                      onValueChange={(value) => setNovaTransacao({ ...novaTransacao, categoria: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat) => (
                          <SelectItem key={cat.nome} value={cat.nome}>
                            {cat.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="valor">Valor (R$)</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={novaTransacao.valor}
                      onChange={(e) => setNovaTransacao({ ...novaTransacao, valor: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      value={novaTransacao.data}
                      onChange={(e) => setNovaTransacao({ ...novaTransacao, data: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setDialogAberto(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                    onClick={adicionarTransacao}
                  >
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Cards principais de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white/90">Limite Total</CardTitle>
                <CreditCard className="h-5 w-5 text-white/80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{formatarMoeda(limiteTotal)}</div>
              <p className="text-sm text-white/80">Cartão de crédito</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-700">Gasto Total</CardTitle>
                <Wallet className="h-5 w-5 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900 mb-1">{formatarMoeda(gastoTotal)}</div>
              <div className="flex items-center gap-1 text-sm text-red-600">
                <ArrowUpRight className="h-4 w-4" />
                +{variacaoMensal.toFixed(1)}% vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-700">Disponível</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900 mb-1">{formatarMoeda(limiteDisponivel)}</div>
              <p className="text-sm text-slate-600">{(100 - percentualUsado).toFixed(1)}% do limite</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-700">Uso do Limite</CardTitle>
                <TrendingDown className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900 mb-3">{percentualUsado.toFixed(1)}%</div>
              <Progress 
                value={percentualUsado} 
                className="h-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Gráficos principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de gastos por dia */}
          <Card className="lg:col-span-2 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900">Evolução de Gastos</CardTitle>
              <CardDescription>Gastos diários ao longo do mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={gastoPorDia}>
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="dia" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    formatter={(value: number) => formatarMoeda(value)}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorValor)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gastos por categoria - Pie Chart */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900">Por Categoria</CardTitle>
              <CardDescription>Distribuição de gastos</CardDescription>
            </CardHeader>
            <CardContent>
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
                    formatter={(value: number) => formatarMoeda(value)}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Categorias e transações */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categorias detalhadas */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900">Categorias</CardTitle>
              <CardDescription>Gastos por categoria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {gastoPorCategoria.map((item) => {
                const Icon = item.icon;
                const percentual = (item.valor / gastoTotal) * 100;
                return (
                  <div key={item.categoria} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${item.color}20` }}
                        >
                          <Icon className="h-4 w-4" style={{ color: item.color }} />
                        </div>
                        <span className="text-sm text-slate-700">{item.categoria}</span>
                      </div>
                      <span className="text-sm text-slate-900">{formatarMoeda(item.valor)}</span>
                    </div>
                    <Progress 
                      value={percentual} 
                      className="h-1.5"
                      style={{ 
                        backgroundColor: '#e2e8f0'
                      }}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Transações recentes */}
          <Card className="lg:col-span-2 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900">Transações Recentes</CardTitle>
              <CardDescription>Últimas movimentações do cartão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transacoesRecentes.map((transacao) => (
                  <div 
                    key={transacao.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-slate-900 mb-1">{transacao.descricao}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {transacao.categoria}
                        </Badge>
                        <span className="text-xs text-slate-500">{transacao.data}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600">-{formatarMoeda(transacao.valor)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maiores gastos */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900">Maiores Gastos do Mês</CardTitle>
            <CardDescription>Transações de maior valor</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={maioresGastos} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="descricao" type="category" width={150} stroke="#64748b" />
                <Tooltip 
                  formatter={(value: number) => formatarMoeda(value)}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Bar dataKey="valor" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
