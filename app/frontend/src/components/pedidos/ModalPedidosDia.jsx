import React, { useEffect, useState } from 'react';
import PedidoCardMobile from './PedidoCardMobile';
import StatusBadge from './StatusBadge';

const ModalPedidosDia = ({ isOpen, onClose, pedidos, data, diaLotado, onExcluirPedido }) => {
    const [pedidoParaExcluir, setPedidoParaExcluir] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    // Handle body scroll locking
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Format date for display
    const formattedData = data ? data.split('-').reverse().join('/') : '';

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
            {/* Blocking Overlay */}
            <div
                className="fixed inset-0 bg-black/80 animate-fade-in"
                aria-hidden="true"
            ></div>

            {/* Modal Content */}
            <div
                className="relative bg-white w-[90%] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col z-[1000] animate-modal-slide-up"
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 text-lg">
                            Pedidos {formattedData}
                        </h3>
                        {diaLotado && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-200">
                                LOTADO
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Fechar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body - Success Message */}
                {showSuccessMessage && (
                    <div className="mx-4 mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                        <span className="text-xl">✅</span>
                        <p className="text-xs font-bold text-emerald-700">Pedido excluído com sucesso!</p>
                    </div>
                )}

                {/* Content - Scrollable */}
                <div className="p-4 overflow-y-auto space-y-3">
                    {diaLotado && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 mb-2 animate-in slide-in-from-top-2 duration-300">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <p className="text-xs font-black text-red-600 uppercase tracking-tight">Dia Lotado</p>
                                <p className="text-[11px] text-red-400 font-medium">Todos os 4 horários disponíveis para este dia já foram agendados.</p>
                            </div>
                        </div>
                    )}

                    {pedidos && pedidos.length > 0 ? (
                        pedidos.map(pedido => (
                            <div key={pedido.id} className="group relative">
                                <PedidoCardMobile
                                    {...pedido}
                                    onClick={() => {
                                        if (pedido.onDetails) pedido.onDetails(pedido);
                                    }}
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPedidoParaExcluir(pedido);
                                    }}
                                    className="absolute top-3 right-3 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity hover:bg-red-100 active:scale-95 z-10"
                                    title="Excluir pedido"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <p className="text-4xl mb-3">📭</p>
                            <p className="text-sm">Nenhum pedido para este dia.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-50 bg-slate-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl active:scale-[0.98] transition-transform"
                    >
                        FECHAR
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {pedidoParaExcluir && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setPedidoParaExcluir(null)}></div>
                    <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-modal-slide-up text-center">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                            ⚠️
                        </div>
                        <h4 className="text-xl font-black text-slate-800 mb-2">Confirmar Exclusão</h4>
                        <p className="text-slate-500 text-sm mb-8">
                            Tem certeza que deseja excluir o pedido de <span className="font-bold text-slate-700">{pedidoParaExcluir.cliente}</span>?<br />
                            <span className="text-xs text-red-400 mt-2 block">Esta ação não pode ser desfeita.</span>
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setPedidoParaExcluir(null)}
                                className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    if (onExcluirPedido) {
                                        onExcluirPedido(pedidoParaExcluir.id);
                                        setPedidoParaExcluir(null);
                                        setShowSuccessMessage(true);
                                        setTimeout(() => {
                                            setShowSuccessMessage(false);
                                            if (pedidos.length <= 1) onClose();
                                        }, 2000);
                                    }
                                }}
                                className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 transition-all"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModalPedidosDia;
