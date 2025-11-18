"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

function EditarTransacaoContent() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const transacaoId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    descricao: "",
    categoria: "",
    valor: "",
    tipo: "",
    mes: "",
    ano: "",
    data: new Date().toISOString().split("T")[0],
  });

  const anoAtual = new Date().getFullYear();
  const anos = [anoAtual, anoAtual + 1];

  // Carregar transação
  useEffect(() => {
    if (user && transacaoId) {
      carregarTransacao();
    }
  }, [user, transacaoId]);

  const carregarTransacao = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/transacoes/${transacaoId}`, {
        headers: {
          "x-user-id": user.uid,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Formatar valor ao carregar
        const valorFormatado = new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(data.valor);
        
        setFormData({
          descricao: data.descricao,
          categoria: data.categoria,
          valor: valorFormatado,
          tipo: data.tipo,
          mes: data.mes.toString(),
          ano: data.ano.toString(),
          data: new Date(data.data).toISOString().split("T")[0],
        });
      } else {
        setError("Transação não encontrada");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar transação");
    } finally {
      setLoading(false);
    }
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

    setSaving(true);

    try {
      const valorNumerico = parseFloat(
        formData.valor.replace(/\./g, "").replace(",", ".")
      );

      const response = await fetch(`/api/transacoes/${transacaoId}`, {
        method: "PUT",
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
        setError(data.error || "Erro ao atualizar transação");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar transação");
    } finally {
      setSaving(false);
    }
  };

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

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarValor(e.target.value);
    setFormData({ ...formData, valor: valorFormatado });
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
                <CardTitle className="text-2xl">Editar Transação</CardTitle>
                <CardDescription>
                  Atualize os dados da transação
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
                    disabled={saving}
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

                <div className="grid gap-2">
                  <Label htmlFor="valor">Valor (R$) *</Label>
                  <Input
                    id="valor"
                    placeholder="0,00"
                    value={formData.valor}
                    onChange={handleValorChange}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mes">Mês *</Label>
                    <Select
                      value={formData.mes}
                      onValueChange={(value) =>
                        setFormData({ ...formData, mes: value })
                      }
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
                      onValueChange={(value) =>
                        setFormData({ ...formData, ano: value })
                      }
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
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EditarTransacao() {
  return (
    <ProtectedRoute>
      <EditarTransacaoContent />
    </ProtectedRoute>
  );
}

