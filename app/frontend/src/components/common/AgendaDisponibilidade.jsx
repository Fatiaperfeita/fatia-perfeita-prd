import React, { useState, useMemo } from 'react';
import { getHorariosDisponiveis, isHorarioDisponivel } from '../../utils/utils';
import { getHoje, getDaquiNDias } from '../../utils/datas';

const AgendaDisponibilidade = ({
    pedidosAgendados = [],
    onDataSelect,
    onHoraSelect,
    dataSelecionada,
    minDate = getHoje(),
    maxDate = getDaquiNDias(30)
}) => {
    const [selectedDate, setSelectedDate] = useState(dataSelecionada || '');
    const [selectedTime, setSelectedTime] = useState('');
    const [viewDate, setViewDate] = useState(new Date());

    const HORARIOS_FIXOS = ['14:00', '15:00', '16:00', '17:00'];

    // --- Helper: Navigation ---
    const canGoPrevMonth = () => {
        const today = new Date();
        const currentMonth = viewDate.getMonth();
        const currentYear = viewDate.getFullYear();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        if (currentYear > todayYear) return true;
        if (currentYear === todayYear && currentMonth > todayMonth) return true;
        return false;
    };

    const handlePrevMonth = () => {
        if (canGoPrevMonth()) {
            setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
        }
    };

    const handleNextMonth = () => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const isMonthHoje = () => {
        const today = new Date();
        return viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();
    };

    // --- Helper: Get Days of Current Month ---
    const daysInMonth = useMemo(() => {
        const today = new Date();
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const days = [];
        // Pad start
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        // Month days
        for (let i = 1; i <= lastDate; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({
                day: i,
                dateStr,
                isToday: i === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            });
        }
        return days;
    }, [viewDate]);

    const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(viewDate);

    const isDataDesabilitada = (dateStr) => {
        if (!dateStr) return true;
        return dateStr < minDate || dateStr > maxDate;
    };

    // --- Logic: Availability ---
    const getHorariosDetails = (dateStr) => {
        return HORARIOS_FIXOS.map(hora => {
            const disponivel = isHorarioDisponivel(dateStr, hora, pedidosAgendados);
            return { hora, disponivel };
        });
    };

    const isDayFull = (dateStr) => {
        return getHorariosDisponiveis(dateStr, pedidosAgendados).length === 0;
    };

    // --- Handlers ---
    const handleDataClick = (dateStr) => {
        if (!dateStr || isDataDesabilitada(dateStr)) return;
        setSelectedDate(dateStr);
        setSelectedTime('');
        if (onDataSelect) onDataSelect(dateStr);
    };

    const handleHoraClick = (horaObj) => {
        if (!horaObj.disponivel) return;
        setSelectedTime(horaObj.hora);
        if (onHoraSelect) onHoraSelect(horaObj.hora);
    };

    return (
        <div className="w-full bg-white md:bg-transparent rounded-2xl border md:border-0 border-slate-100 shadow-sm md:shadow-none p-4 md:p-0 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Calendar */}
                <div className="bg-white md:p-6 md:rounded-3xl md:border md:border-slate-100 md:shadow-sm">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
                        <button
                            onClick={handlePrevMonth}
                            disabled={!canGoPrevMonth()}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${canGoPrevMonth()
                                ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                : 'text-slate-300 opacity-30 cursor-not-allowed'
                                }`}
                            title={canGoPrevMonth() ? 'Mês anterior' : 'Não permitido voltar para meses passados'}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="text-center">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                📅 <span className="capitalize">{monthName}</span>
                            </h3>
                            {isMonthHoje() && (
                                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest -mt-0.5">
                                    Este Mês
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleNextMonth}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
                            title="Próximo mês"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-6">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                            <div key={i} className="text-[10px] font-black text-slate-300 uppercase py-1">{d}</div>
                        ))}

                        {daysInMonth.map((dayObj, idx) => {
                            if (!dayObj) return <div key={`empty-${idx}`} className="h-10" />;

                            const disabled = isDataDesabilitada(dayObj.dateStr);
                            const full = isDayFull(dayObj.dateStr);
                            const isSelected = selectedDate === dayObj.dateStr;

                            return (
                                <button
                                    key={dayObj.dateStr}
                                    onClick={() => handleDataClick(dayObj.dateStr)}
                                    disabled={disabled}
                                    className={`
                                        h-10 flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all relative overflow-hidden
                                        ${isSelected ? 'bg-blue-50 border-2 border-blue-500 text-blue-600 z-10' : 'text-slate-600'}
                                        ${disabled && !isSelected ? 'text-slate-200 cursor-not-allowed opacity-40' : ''}
                                        ${full && !disabled && !isSelected ? 'bg-red-50 text-red-400 opacity-70 border border-red-100 hover:bg-red-100 cursor-pointer active:scale-95' : 'active:scale-95'}
                                        ${!disabled ? 'cursor-pointer' : ''}
                                        ${dayObj.isToday && !isSelected && !full ? 'text-blue-500 font-extrabold border-b-2 border-blue-100' : ''}
                                    `}
                                    title={full && !disabled ? 'Dia lotado - clique para detalhes' : ''}
                                >
                                    <span className="relative z-10">{dayObj.day}</span>
                                    {isSelected && <div className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full" />}

                                    {full && !disabled && (
                                        <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-red-500 uppercase tracking-widest bg-red-50/50 mix-blend-multiply opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                                            LOTADO
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side: Time Slots Section */}
                <div className="flex flex-col">
                    {selectedDate ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 bg-white md:p-6 md:rounded-3xl md:border md:border-slate-100 md:shadow-sm flex-1">

                            {/* Selected Date Header */}
                            <div className="mb-4 p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                                <h3 className="font-bold text-slate-800 text-base">
                                    {selectedDate.split('-').reverse().join('/')}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${isDayFull(selectedDate)
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-green-100 text-green-700'
                                    }`}>
                                    {isDayFull(selectedDate) ? 'LOTADO' : 'Disponível'}
                                </span>
                            </div>

                            {isDayFull(selectedDate) ? (
                                /* Dia Lotado - MENSAGEM EM DESTAQUE */
                                <div className="text-center py-6 animate-in zoom-in duration-300">
                                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                                    <h3 className="text-lg font-black text-red-600 uppercase tracking-tight mb-2">
                                        Dia Lotado!
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-6 px-4">
                                        Todos os horários deste dia já foram agendados.
                                    </p>

                                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 text-left inline-block w-full max-w-[280px]">
                                        <p className="font-bold text-red-800 text-sm mb-3 text-center border-b border-red-200/50 pb-2">
                                            {pedidosAgendados.filter(p => p.dataRetirada === selectedDate).length} de 4 horários ocupados
                                        </p>
                                        <div className="space-y-3">
                                            {pedidosAgendados
                                                .filter(p => p.dataRetirada === selectedDate)
                                                .sort((a, b) => a.horaRetirada.localeCompare(b.horaRetirada))
                                                .map(p => (
                                                    <div key={p.id} className="flex justify-between items-center text-xs">
                                                        <span className="font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-lg">{p.horaRetirada}</span>
                                                        <span className="font-bold text-slate-700 truncate ml-2 max-w-[150px]">{p.cliente}</span>
                                                    </div>
                                                ))}
                                            {/* Fallback check for missing detail (should not happen if full) */}
                                            {pedidosAgendados.filter(p => p.dataRetirada === selectedDate).length === 0 && (
                                                <p className="text-[10px] text-center text-red-400">Dados de horários indisponíveis</p>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm font-bold text-slate-600">
                                        Por favor, escolha outro dia no calendário.
                                    </p>
                                </div>
                            ) : (
                                /* Dia com Disponibilidade */
                                <>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">
                                        Selecione um horário:
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {getHorariosDetails(selectedDate).filter(h => h.disponivel).map((h) => {
                                            const isTimeSelected = selectedTime === h.hora;
                                            return (
                                                <button
                                                    key={h.hora}
                                                    onClick={() => handleHoraClick(h)}
                                                    className={`
                                                        h-16 md:h-20 rounded-2xl font-black text-sm md:text-base flex flex-col items-center justify-center transition-all border-2
                                                        ${isTimeSelected
                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-105 z-10'
                                                            : 'bg-green-50 border-green-500 text-green-700 active:scale-95 hover:bg-green-100'
                                                        }
                                                    `}
                                                >
                                                    {h.hora}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Horários Ocupados em Cinza */}
                                    {getHorariosDetails(selectedDate).some(h => !h.disponivel) && (
                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-xs font-bold text-slate-400 mb-3 ml-1">
                                                Horários indisponíveis:
                                            </p>
                                            <div className="grid grid-cols-4 gap-2">
                                                {getHorariosDetails(selectedDate).filter(h => !h.disponivel).map(h => (
                                                    <div
                                                        key={h.hora}
                                                        className="py-2 text-center text-xs font-bold text-slate-400 bg-slate-100/50 rounded-xl"
                                                    >
                                                        {h.hora}
                                                        <div className="text-[9px] uppercase tracking-tighter mt-0.5 opacity-70">Ocupado</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-auto pt-6 border-t border-slate-50 text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center">
                                        * Cada horário comporta 1 bolo
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                            <div className="text-4xl mb-4">☝️</div>
                            <p className="text-sm font-bold text-slate-300 italic max-w-[200px]">
                                Selecione um dia no calendário para ver os horários disponíveis
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgendaDisponibilidade;
