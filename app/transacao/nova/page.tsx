"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Alert, AlertDescription } from "@/ui/alert";
import { ArrowLeft, Wallet } from "lucide-react";
import Link from "next/link";

const categoriasRenda = [
  "Salário",
  "PIX Recebido",
  "Bônus",
  "Freelance",
  "Renda Extra",
  "Outros",
];

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

const categoriasEconomia = [
  "Investimentos",
  "Renda Extra",
  "Reserva de Emergência",
  "Poupança",
  "Tesouro Direto",
  "Ações",
  "Outros",
];

const meses = [
  { valor: "1", nome: "Janeiro" },
  { valor: "2", nome: "Fevereiro" },
  { valor: "3", nome: "Março" },
  { valor: "4", nome: "Abril" },
  { valor: "5", nome: "Maio" },
  { valor: "6", nome: "Junho" },
  { valor: "7", nome: "Julho" },
  { valor: "8", nome: "Agosto" },
  { valor: "9", nome: "Setembro" },
  { valor: "10", nome: "Outubro" },
  { valor: "11", nome: "Novembro" },
  { valor: "12", nome: "Dezembro" },
];

function NovaTransacaoContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const anoAtual = new Date().getFullYear();
  const anos = [anoAtual, anoAtual + 1];

  // Função para obter o primeiro dia do mês/ano
  const getPrimeiroDiaMes = (mes: string, ano: string) => {
    const mesNum = parseInt(mes);
    const anoNum = parseInt(ano);
    const primeiroDia = new Date(anoNum, mesNum - 1, 1);
    return primeiroDia.toISOString().split("T")[0];
  };

  // Carregar mês selecionado do localStorage
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const mesSalvo = localStorage.getItem('mesSelecionado');
      const anoSalvo = localStorage.getItem('anoSelecionado');
      const mes = mesSalvo || (new Date().getMonth() + 1).toString();
      const ano = anoSalvo || anoAtual.toString();
      return {
        descricao: "",
        categoria: "",
        valor: "",
        tipo: "",
        mes: mes,
        ano: ano,
        data: getPrimeiroDiaMes(mes, ano),
      };
    }
    const mes = (new Date().getMonth() + 1).toString();
    const ano = anoAtual.toString();
    return {
      descricao: "",
      categoria: "",
      valor: "",
      tipo: "",
      mes: mes,
      ano: ano,
      data: getPrimeiroDiaMes(mes, ano),
    };
  });

  const formatarValor = (valor: string) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, "");
    
    // Converte para número e divide por 100 para ter centavos
    const numero = parseFloat(apenasNumeros) / 100;
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numero);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.descricao ||
      !formData.categoria ||
      !formData.valor ||
      !formData.tipo ||
      !formData.mes ||
      !formData.ano
    ) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (!user) {
      setError("Usuário não autenticado");
      return;
    }

    setLoading(true);

    try {
      // Converter valor formatado para número
      const valorNumerico = parseFloat(
        formData.valor.replace(/\./g, "").replace(",", ".")
      );

      const response = await fetch("/api/transacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.uid,
        },
        body: JSON.stringify({
          descricao: formData.descricao,
          categoria: formData.categoria,
          valor: valorNumerico,
          data: formData.data,
          tipo: formData.tipo,
          mes: formData.mes,
          ano: formData.ano,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao criar transação");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar transação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-violet-100">
                <Wallet className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Nova Transação</CardTitle>
                <CardDescription>
                  Cadastre uma nova transação financeira
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de Transação *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tipo: value, categoria: "" })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="renda">Renda</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                      <SelectItem value="economia">Economia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Input
                    id="descricao"
                    placeholder="Ex: Salário, Supermercado, Poupança..."
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="valor">Valor (R$) *</Label>
                  <Input
                    id="valor"
                    placeholder="0,00"
                    value={formData.valor}
                    onChange={(e) => {
                      const valorFormatado = formatarValor(e.target.value);
                      setFormData({ ...formData, valor: valorFormatado });
                    }}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoria: value })
                    }
                    required
                    disabled={!formData.tipo}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.tipo === "renda" &&
                        categoriasRenda.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      {formData.tipo === "despesa" &&
                        categoriasDespesa.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      {formData.tipo === "economia" &&
                        categoriasEconomia.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mes">Mês *</Label>
                    <Select
                      value={formData.mes}
                      onValueChange={(value) => {
                        const novaData = getPrimeiroDiaMes(value, formData.ano);
                        setFormData({ ...formData, mes: value, data: novaData });
                      }}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {meses.map((mes) => (
                          <SelectItem key={mes.valor} value={mes.valor}>
                            {mes.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="ano">Ano *</Label>
                    <Select
                      value={formData.ano}
                      onValueChange={(value) => {
                        const novaData = getPrimeiroDiaMes(formData.mes, value);
                        setFormData({ ...formData, ano: value, data: novaData });
                      }}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                      <SelectContent>
                        {anos.map((ano) => (
                          <SelectItem key={ano} value={ano.toString()}>
                            {ano}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="data">Data da Transação</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) =>
                      setFormData({ ...formData, data: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Transação"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NovaTransacao() {
  return (
    <ProtectedRoute>
      <NovaTransacaoContent />
    </ProtectedRoute>
  );
}
