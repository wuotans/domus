export { default } from "next-auth/middleware";
export const config = { matcher: ["/dashboard/:path*","/contas-pagar/:path*","/contas-receber/:path*","/movimentacoes/:path*","/categorias/:path*","/manutencoes/:path*","/calendario/:path*","/assembleias/:path*","/historico/:path*","/relatorios/:path*"] };
