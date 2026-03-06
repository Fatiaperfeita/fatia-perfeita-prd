import React, { useEffect, useState } from 'react';
import { getPedidos } from '../services/api';
import PedidoCard from '../components/pedidos/PedidoCard';
import { formatarDataISO } from '../utils/utils';
import { getHoje, getAmanha } from '../utils/datas';

const Dashboard = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('HOJE');

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Helper dates (Relative to real Today) centralizadas
    const TODAY_STR = getHoje();
    const TOMORROW_STR = getAmanha();

    const formatDatePT = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    const sortOrdersByTime = (orders) => {
        return orders.sort((a, b) => a.horaRetirada.localeCompare(b.horaRetirada));
    };

    const sortOrdersByDateTime = (orders) => {
        return orders.sort((a, b) => {
            if (a.dataRetirada !== b.dataRetirada) {
                return a.dataRetirada.localeCompare(b.dataRetirada);
            }
            return a.horaRetirada.localeCompare(b.horaRetirada);
        });
    };

    const getDayOrders = (dateStr) => {
        return sortOrdersByTime(pedidos.filter(p => p.dataRetirada === dateStr));
    };

    // -- Views Components --

    const TodayView = () => {
        const orders = getDayOrders(TODAY_STR);
        return (
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">📅 Hoje - {formatDatePT(TODAY_STR)}</h2>
                {orders.length === 0 ? (
                    <p className="text-slate-500 italic">Nenhum pedido para hoje.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {orders.map(pedido => <PedidoCard key={pedido.id} {...pedido} />)}
                    </div>
                )}
            </div>
        );
    };

    const TomorrowView = () => {
        const orders = getDayOrders(TOMORROW_STR);
        return (
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">📅 Amanhã - {formatDatePT(TOMORROW_STR)}</h2>
                {orders.length === 0 ? (
                    <p className="text-slate-500 italic">Nenhum pedido para amanhã.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {orders.map(pedido => <PedidoCard key={pedido.id} {...pedido} />)}
                    </div>
                )}
            </div>
        );
    };

    const FutureView = () => {
        const futureOrders = pedidos.filter(p => p.dataRetirada > TOMORROW_STR);
        const grouped = futureOrders.reduce((acc, order) => {
            if (!acc[order.dataRetirada]) acc[order.dataRetirada] = [];
            acc[order.dataRetirada].push(order);
            return acc;
        }, {});

        const sortedDates = Object.keys(grouped).sort();

        return (
            <div className="space-y-8">
                {sortedDates.length === 0 ? (
                    <p className="text-slate-500 italic">Nenhum pedido futuro.</p>
                ) : (
                    sortedDates.map(date => (
                        <div key={date}>
                            <h3 className="text-lg font-bold text-orange-600 mb-3 border-b border-orange-200 pb-1 inline-block pr-4">
                                {formatDatePT(date)}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {sortOrdersByTime(grouped[date]).map(pedido => (
                                    <PedidoCard key={pedido.id} {...pedido} />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        );
    };

    const TableView = () => {
        const sortedOrders = sortOrdersByDateTime([...pedidos]);
        return (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
                            <tr>
                                <th className="px-4 py-3">Data/Hora</th>
                                <th className="px-4 py-3">Cliente</th>
                                <th className="px-4 py-3">WhatsApp</th>
                                <th className="px-4 py-3">Produto</th>
                                <th className="px-4 py-3">Tamanho</th>
                                <th className="px-4 py-3">Sabor</th>
                                <th className="px-4 py-3">Valor</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedOrders.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                                        {formatDatePT(p.dataRetirada)} <br /> {p.horaRetirada}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-900">{p.cliente}</td>
                                    <td className="px-4 py-3">{p.whatsapp}</td>
                                    <td className="px-4 py-3">{p.produto}</td>
                                    <td className="px-4 py-3">{p.tamanho}</td>
                                    <td className="px-4 py-3">{p.sabor}</td>
                                    <td className="px-4 py-3 text-slate-900 font-bold">
                                        R$ {p.valor ? p.valor.toFixed(2) : '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold
                                         ${p.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                                                p.status === 'confirmado' ? 'bg-blue-100 text-blue-800' :
                                                    p.status === 'pago' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                                     `}>
                                            {p.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    const CalendarView = () => {
        // Simple calendar logic
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-indexed

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null); // Empty slots
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        const getOrdersForDay = (day) => {
            if (!day) return [];
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return pedidos.filter(p => p.dataRetirada === dateStr);
        }

        const handleDayClick = (day) => {
            if (!day) return;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            setSelectedDay(dateStr);
            setIsModalOpen(true);
        }

        return (
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 capitalize">
                        {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentDate(new Date(year, month - 1))}
                            className="p-2 hover:bg-slate-200 rounded-full"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200"
                        >
                            Hoje
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date(year, month + 1))}
                            className="p-2 hover:bg-slate-200 rounded-full"
                        >
                            →
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 gap-4 text-center">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                        <div key={d} className="text-slate-400 font-medium text-sm py-2">{d}</div>
                    ))}

                    {days.map((day, idx) => {
                        const dayOrders = getOrdersForDay(day);
                        const hasOrders = dayOrders.length > 0;

                        return (
                            <div
                                key={idx}
                                className={`
                                  h-24 border rounded-xl p-2 flex flex-col items-center justify-between transition-all
                                  ${!day ? 'bg-transparent border-transparent' : 'bg-white border-slate-200 hover:border-orange-400 cursor-pointer hover:shadow-md'}
                                  ${day && selectedDay && selectedDay.endsWith(String(day).padStart(2, '0')) ? 'ring-2 ring-orange-500' : ''}
                              `}
                                onClick={() => handleDayClick(day)}
                            >
                                {day && (
                                    <>
                                        <span className={`text-sm font-semibold ${hasOrders ? 'text-slate-800' : 'text-slate-400'}`}>{day}</span>
                                        {hasOrders && (
                                            <div className="flex flex-col gap-1 items-center w-full">
                                                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                                                    {dayOrders.length} pedido(s)
                                                </span>
                                                <div className="flex gap-0.5">
                                                    {dayOrders.slice(0, 3).map((_, i) => (
                                                        <div key={i} className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                                    ))}
                                                    {dayOrders.length > 3 && <div className="w-1 h-1 bg-slate-300 rounded-full"></div>}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-lg text-slate-800">
                                    Pedidos de {formatDatePT(selectedDay)}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    ✕
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto bg-slate-50">
                                {getDayOrders(selectedDay).length === 0 ? (
                                    <p className="text-center text-slate-500 py-8">Nenhum pedido para este dia.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {getDayOrders(selectedDay).map(pedido => (
                                            <PedidoCard key={pedido.id} {...pedido} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // --- Main Render ---

    return (
        <div className="p-6 ml-64 mt-16 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Fatia Perfeita - Dashboard</h1>
                    <p className="text-slate-500">Gestão de Encomendas</p>
                </div>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors shadow-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Novo Pedido
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="flex space-x-1 mb-6 bg-white p-1 rounded-xl shadow-sm border border-slate-100 w-fit">
                        {['HOJE', 'AMANHÃ', 'FUTUROS', 'TABELA', 'CALENDÁRIO'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="animate-fade-in">
                        {activeTab === 'HOJE' && <TodayView />}
                        {activeTab === 'AMANHÃ' && <TomorrowView />}
                        {activeTab === 'FUTUROS' && <FutureView />}
                        {activeTab === 'TABELA' && <TableView />}
                        {activeTab === 'CALENDÁRIO' && <CalendarView />}
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
