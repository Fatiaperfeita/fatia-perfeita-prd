import React from 'react';
import { formatarMoeda } from '../../utils/utils';

const ResumoPedido = ({
    cliente,
    bolos,
    onAddBolo,
    onRemoveBolo,
    subtotal,
    adicionalEmbalagem,
    total,
    onBack,
    onSave
}) => {
    return (
        <div className="flex flex-col min-h-screen bg-white md:bg-transparent">
            {/* Header */}
            <header className="bg-[#F9FAFB] md:bg-white p-4 md:p-6 border-b border-[#E5E7EB] text-center sticky top-0 md:relative z-10 shadow-sm md:shadow-none md:rounded-t-3xl">
                <h1 className="font-bold text-[18px] md:text-[22px] text-slate-800 tracking-tight">
                    📋 RESUMO DO PEDIDO
                </h1>
            </header>

            {/* Content Area */}
            <main className="flex-1 p-4 md:p-8 pb-32 md:pb-8 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left & Middle Column: Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Client Info Section */}
                        <section className="bg-[#EFF6FF] md:bg-white p-4 md:p-6 rounded-2xl md:border-2 md:border-blue-100 shadow-sm space-y-2">
                            <h2 className="text-[14px] md:text-[16px] font-bold text-blue-800 mb-2 flex items-center gap-1.5">
                                👤 Dados do Cliente
                            </h2>
                            <div className="text-[14px] md:text-[15px] text-blue-900 grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-x-2 gap-y-1">
                                <span className="font-medium text-blue-700/70">Nome:</span>
                                <span className="font-bold">{cliente.nome}</span>

                                <span className="font-medium text-blue-700/70">WhatsApp:</span>
                                <span className="font-bold">{cliente.whatsapp}</span>

                                <span className="font-medium text-blue-700/70">Embalagem:</span>
                                <span className="font-bold">
                                    {cliente.embalagem ? `Sim (+R$ ${adicionalEmbalagem.toFixed(0)},00)` : 'Não'}
                                </span>
                            </div>
                        </section>

                        {/* Cake List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {bolos.map((bolo, index) => (
                                <div
                                    key={index}
                                    className="relative bg-white border border-[#E5E7EB] rounded-xl p-4 md:p-5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 hover:border-blue-200 transition-colors"
                                >
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => onRemoveBolo(index)}
                                        className="absolute top-2 right-2 w-8 h-8 bg-[#FEE2E2] text-[#EF4444] rounded-lg flex items-center justify-center text-lg active:scale-90 transition-transform hover:bg-red-200"
                                        aria-label="Remover Bolo"
                                    >
                                        🗑️
                                    </button>

                                    <div className="flex gap-4">
                                        {/* Cake Icon */}
                                        <div className="flex w-12 h-12 bg-slate-100 rounded-lg items-center justify-center text-2xl">
                                            🎂
                                        </div>

                                        <div className="flex-1 min-w-0 pr-8">
                                            <h3 className="text-[14px] md:text-[15px] font-bold text-[#1F2937] leading-tight truncate">
                                                {bolo.saborNome}
                                            </h3>

                                            <div className="mt-1 space-y-0.5">
                                                <p className="text-[13px] text-[#6B7280]">
                                                    • {bolo.tamanhoNome} ({formatarMoeda(bolo.valorUnitario)})
                                                </p>
                                                <p className="text-[13px] text-[#6B7280]">
                                                    • Quantidade: {bolo.quantidade}
                                                </p>
                                                {bolo.desenho && (
                                                    <p className="text-[12px] text-[#4B5563] italic mt-2 bg-slate-50 p-2 rounded-lg border-l-2 border-slate-200 line-clamp-2">
                                                        "{bolo.desenho}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Another Cake Button */}
                        <button
                            onClick={onAddBolo}
                            className="w-full py-4 bg-[#F8FAFC] md:bg-white text-[#3B82F6] rounded-xl text-center font-bold border-2 border-dashed border-[#3B82F6]/30 hover:border-[#3B82F6] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        >
                            <span className="text-2xl group-hover:scale-125 transition-transform">+</span>
                            Adicionar outro bolo ao pedido
                        </button>
                    </div>

                    {/* Right Column: Totals & Summary */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-lg lg:sticky lg:top-8 space-y-4">
                            <h2 className="text-[16px] font-black text-slate-800 uppercase tracking-tighter border-b border-slate-50 pb-3">
                                Resumo Financeiro
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[15px] text-[#6B7280]">
                                    <span className="font-medium">Subtotal dos Bolos:</span>
                                    <span className="font-bold text-slate-700">{formatarMoeda(subtotal)}</span>
                                </div>

                                {cliente.embalagem && (
                                    <div className="flex justify-between items-center text-[15px] text-[#6B7280]">
                                        <span className="font-medium">Embalagem Protetora:</span>
                                        <span className="font-bold text-slate-700">+{formatarMoeda(adicionalEmbalagem)}</span>
                                    </div>
                                )}

                                <div className="h-px bg-slate-100 my-4"></div>

                                <div className="flex flex-col gap-1 items-end pt-2">
                                    <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest">Valor Total</span>
                                    <span className="text-[32px] font-black text-[#10B981] leading-none">
                                        {formatarMoeda(total)}
                                    </span>
                                </div>
                            </div>

                            {/* Desktop Desktop Actions (Inside sticky card) */}
                            <div className="hidden md:flex flex-col gap-3 mt-8">
                                <button
                                    onClick={onSave}
                                    className="w-full h-14 bg-[#3B82F6] text-white rounded-xl font-bold text-[16px] shadow-lg shadow-blue-500/30 active:scale-95 transition-all hover:bg-blue-600"
                                >
                                    CONFIRMAR E SALVAR
                                </button>
                                <button
                                    onClick={onBack}
                                    className="w-full h-14 bg-slate-100 text-slate-500 rounded-xl font-bold text-[15px] active:scale-95 transition-all hover:bg-slate-200"
                                >
                                    VOLTAR
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Mobile Fixed Bottom Actions (Visible only on mobile) */}
            <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-[#E5E7EB] flex gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
                <button
                    onClick={onBack}
                    className="flex-1 min-h-[48px] bg-[#F3F4F6] text-[#6B7280] rounded-xl font-bold text-[15px] active:scale-95 transition-transform"
                >
                    VOLTAR
                </button>
                <button
                    onClick={onSave}
                    className="flex-1 min-h-[48px] bg-[#3B82F6] text-white rounded-xl font-bold text-[15px] shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
                >
                    SALVAR PEDIDO
                </button>
            </footer>
        </div>
    );
};

export default ResumoPedido;
