import React, { useEffect, useState } from 'react';
import { getPedidos } from '../services/api';
import PedidoCardMobile from '../components/pedidos/PedidoCardMobile';
import CalendarMobile from '../components/pedidos/CalendarMobile';
import ModalPedidosDia from '../components/pedidos/ModalPedidosDia';
import StatusBadge from '../components/pedidos/StatusBadge';
import { formatarDataISO, formatarDataBR } from '../utils/utils';
import { getHoje, getAmanha } from '../utils/datas';

const DashboardMobile = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('HOJE');

    // Calendar State
    const [selectedDay, setSelectedDay] = useState(null);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

    // Detail Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Deletion State
    const [pedidoParaExcluir, setPedidoParaExcluir] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const data = await getPedidos();
                setPedidos(data);
            } catch (error) {
                console.error("Erro ao carregar pedidos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPedidos();
    }, []);

    const TODAY_STR = getHoje();
    const TOMORROW_STR = getAmanha();

    const formatDatePT = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}`;
    };

    const getDayOrders = (dateStr) => {
        return pedidos
            .filter(p => p.dataRetirada === dateStr)
            .sort((a, b) => a.horaRetirada.localeCompare(b.horaRetirada));
    };

    const getFutureOrders = () => {
        return pedidos
            .filter(p => p.dataRetirada > TOMORROW_STR)
            .sort((a, b) => a.dataRetirada.localeCompare(b.dataRetirada));
    }

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const handleDayClick = (dateStr) => {
        setSelectedDay(dateStr);
        setIsCalendarModalOpen(true);
    };

    const handleExcluirPedido = (pedidoId) => {
        setPedidos(prev => prev.filter(p => p.id !== pedidoId));
    };

    // --- Order Detail Modal ---
    const OrderDetailModal = () => {
        if (!selectedOrder) return null;
        return (
            <div className="fixed inset-0 bg-black/60 z-[1100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm md:max-w-xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
                    <div className="bg-orange-500 p-4 md:p-6 text-white flex justify-between items-start">
                        <div>
                            <p className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-1">Pedido #{selectedOrder.id.slice(-4)}</p>
                            <h3 className="text-xl md:text-2xl font-bold">{selectedOrder.cliente}</h3>
                        </div>
                        <button onClick={() => setIsDetailModalOpen(false)} className="text-white/80 hover:text-white bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                            ✕
                        </button>
                    </div>
                    <div className="p-6 space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                        {/* Left Col */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Data</p>
                                    <p className="font-semibold text-slate-700">{selectedOrder.dataRetirada.split('-').reverse().join('/')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 font-bold uppercase">Hora</p>
                                    <p className="font-semibold text-slate-700">{selectedOrder.horaRetirada}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Produto</p>
                                <p className="text-slate-800 font-medium text-lg leading-tight">{selectedOrder.produto}</p>
                                <p className="text-slate-600">{selectedOrder.tamanho} • {selectedOrder.sabor}</p>
                            </div>
                        </div>

                        {/* Right Col */}
                        <div className="space-y-4">
                            {selectedOrder.desenho && (
                                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800 text-sm italic h-full">
                                    <p className="text-xs text-yellow-600 font-bold uppercase mb-1">Observações / Desenho</p>
                                    "{selectedOrder.desenho}"
                                </div>
                            )}

                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Contato</p>
                                <div className="flex items-center gap-2 text-green-600 font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.584 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
                                    </svg>
                                    {selectedOrder.whatsapp}
                                </div>
                            </div>
                        </div>

                        {/* Footer Row (Full Width on Desktop) */}
                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center md:col-span-2">
                            <StatusBadge status={selectedOrder.status} />
                            <span className="text-2xl font-bold text-slate-800">
                                R$ {selectedOrder.valor ? selectedOrder.valor.toFixed(0) : '0'},00
                            </span>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3 md:flex md:justify-end">
                        <button className="w-full md:w-auto md:px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100" onClick={() => setIsDetailModalOpen(false)}>
                            Fechar
                        </button>
                        <button className="w-full md:w-auto md:px-6 py-3 rounded-xl bg-orange-600 text-white font-bold shadow-lg shadow-orange-200 hover:bg-orange-700">
                            Editar Pedido
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const RenderContent = () => {
        if (activeTab === 'CALENDÁRIO') {
            const dayOrders = getDayOrders(selectedDay).map(p => ({
                ...p,
                onDetails: (order) => handleOrderClick(order) // Pass detail handler
            }));

            return (
                <>
                    <CalendarMobile
                        pedidos={pedidos}
                        onDayClick={handleDayClick}
                        todayStr={TODAY_STR}
                    />

                    <ModalPedidosDia
                        isOpen={isCalendarModalOpen}
                        onClose={() => setIsCalendarModalOpen(false)}
                        pedidos={dayOrders}
                        data={selectedDay}
                        diaLotado={dayOrders.length >= 4}
                        onExcluirPedido={handleExcluirPedido}
                    />
                </>
            );
        }

        // List Views
        let displayOrders = [];
        let label = "";

        if (activeTab === 'HOJE') {
            displayOrders = getDayOrders(TODAY_STR);
            label = `📅 Hoje, ${formatarDataBR(TODAY_STR).slice(0, 5)}`;
        } else if (activeTab === 'AMANHÃ') {
            displayOrders = getDayOrders(TOMORROW_STR);
            label = `📅 Amanhã, ${formatarDataBR(TOMORROW_STR).slice(0, 5)}`;
        } else {
            // Future logic simplified for list
            displayOrders = getFutureOrders();
            label = "📅 Próximos Eventos";
        }

        return (
            <div className="pb-24 md:pb-0">
                <h2 className="text-sm md:text-xl font-bold text-slate-500 md:text-slate-700 uppercase md:normal-case tracking-widest md:tracking-normal mb-4 px-1 md:px-0">{label}</h2>
                {displayOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 md:py-20 text-slate-300">
                        <span className="text-4xl md:text-6xl mb-3">😴</span>
                        <p className="text-sm md:text-lg">Nenhum pedido para hoje</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                        {displayOrders.map(pedido => (
                            <div key={pedido.id} className="group relative">
                                <PedidoCardMobile {...pedido} onClick={() => handleOrderClick(pedido)} />
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
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto relative min-h-screen">
            {/* Tabs - Mobile: Sticky Scroll | Desktop: Static Header */}
            <div className="sticky top-14 md:static z-10 bg-slate-50 pt-2 pb-2 md:pt-0 md:mb-8 md:flex md:items-center md:justify-between">

                {/* Desktop Title Interaction (Hidden on Mobile) */}
                <div className="hidden md:block">
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                    <p className="text-slate-500">Bem-vindo à Fatia Perfeita</p>
                </div>

                <div className="flex overflow-x-auto gap-2 px-1 md:px-0 scrollbar-hide md:flex-wrap">
                    {['HOJE', 'AMANHÃ', 'FUTUROS', 'CALENDÁRIO'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-none px-5 py-2.5 md:px-6 md:py-3 text-xs md:text-sm font-bold rounded-full transition-all whitespace-nowrap shadow-sm border ${activeTab === tab
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Global Deletion Feedback */}
            {showSuccessMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[2000] px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    <span>✅</span>
                    <span>Pedido excluído com sucesso!</span>
                </div>
            )}

            {/* Global Confirmation Modal */}
            {pedidoParaExcluir && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
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
                                    handleExcluirPedido(pedidoParaExcluir.id);
                                    setPedidoParaExcluir(null);
                                    setShowSuccessMessage(true);
                                    setTimeout(() => setShowSuccessMessage(false), 3000);
                                }}
                                className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 transition-all"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <RenderContent />
            )}

            {isDetailModalOpen && <OrderDetailModal />}
        </div>
    );
};

export default DashboardMobile;
