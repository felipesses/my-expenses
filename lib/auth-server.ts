// Para verificação no servidor, precisamos usar Firebase Admin SDK
// Por enquanto, vamos usar uma abordagem mais simples com verificação do token no cliente
// TODO: Implementar verificação adequada com Firebase Admin SDK quando necessário
export async function getUserIdFromRequest(
  request: Request
): Promise<string | null> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split("Bearer ")[1];

    // Em produção, você deve verificar o token usando Firebase Admin SDK
    // Por enquanto, vamos usar uma abordagem onde o cliente envia o userId
    // Isso não é ideal para segurança, mas funciona para desenvolvimento
    // TODO: Implementar verificação adequada com Firebase Admin SDK

    return token; // Por enquanto, o token é o userId
  } catch (error) {
    return null;
  }
}
