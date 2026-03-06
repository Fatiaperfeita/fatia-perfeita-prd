import React, { useState } from 'react';
import { getHoje } from '../../utils/datas';
import { getHorariosDisponiveis } from '../../utils/utils';

const CalendarMobile = ({ pedidos, onDayClick, todayStr = getHoje() }) => {
    // Current view state (starts at today's month)
    const [viewDate, setViewDate] = useState(() => {
        const d = new Date(todayStr);
        // Ensure valid date even if todayStr is just YYYY-MM-DD
        if (isNaN(d.getTime())) return new Date();
        return d;
    });

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Helper to get days for the calendar grid
    const getCalendarDays = () => {
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const days = [];

        // Previous month days (grayed out)
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                month: month - 1,
                year: year,
                isCurrentMonth: false
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                month: month,
                year: year,
                isCurrentMonth: true
            });
        }

        // Next month days (grayed out)
        const remainingCells = 42 - days.length; // 6 rows of 7 days
        for (let i = 1; i <= remainingCells; i++) {
            days.push({
                day: i,
                month: month + 1,
                year: year,
                isCurrentMonth: false
            });
        }

        return days;
    };

    const canGoPrevMonth = () => {
        const today = new Date(todayStr + "T12:00:00");
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        if (year > todayYear) return true;
        if (year === todayYear && month > todayMonth) return true;
        return false;
    };

    const handlePrevMonth = () => {
        if (canGoPrevMonth()) {
            setViewDate(new Date(year, month - 1, 1));
        }
    };

    const handleNextMonth = () => {
        setViewDate(new Date(year, month + 1, 1));
    };

    const isMonthHoje = () => {
        const today = new Date(todayStr + "T12:00:00");
        return year === today.getFullYear() && month === today.getMonth();
    };

    const isToday = (d, m, y) => {
        const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        return dateStr === todayStr;
    };

    const hasOrders = (d, m, y) => {
        const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        return pedidos.some(p => p.dataRetirada === dateStr);
    };

    const isDiaDisponivel = (d, m, y) => {
        const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        // Se for mês passado ou futuro distante, ignoramos validação de slots (opcional)
        // Mas para simplificar, usamos a lógica de slots:
        return getHorariosDisponiveis(dateStr, pedidos).length > 0;
    };

    const days = getCalendarDays();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-100">
                <button
                    onClick={handlePrevMonth}
                    disabled={!canGoPrevMonth()}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${canGoPrevMonth()
                        ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        : 'text-slate-300 opacity-30 cursor-not-allowed'
                        }`}
                    title={canGoPrevMonth() ? 'Mês anterior' : 'Não permitido voltar para meses passados'}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="text-center">
                    <h2 className="text-lg font-bold text-slate-800">
                        {monthNames[month]} {year}
                    </h2>
                    {isMonthHoje() && (
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest -mt-1">
                            Este Mês
                        </p>
                    )}
                </div>

                <button
                    onClick={handleNextMonth}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
                    title="Próximo mês"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 border-b border-slate-50">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                    <div key={i} className="py-3 text-center text-xs font-bold text-slate-400">
                        {d}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7">
                {days.map((item, idx) => {
                    const { day, month: itemMonth, year: itemYear, isCurrentMonth } = item;
                    const isTargetToday = isToday(day, itemMonth, itemYear);
                    const isWithOrders = hasOrders(day, itemMonth, itemYear);
                    const dateStr = `${itemYear}-${String(itemMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const disponivel = isCurrentMonth ? isDiaDisponivel(day, itemMonth, itemYear) : false;

                    return (
                        <button
                            key={idx}
                            disabled={!isCurrentMonth}
                            onClick={() => isCurrentMonth && onDayClick(dateStr)}
                            className={`
                                h-16 md:h-20 flex flex-col items-center justify-center relative border-r border-b border-slate-50 transition-all overflow-hidden
                                ${!isCurrentMonth ? 'bg-slate-50/50' : ''}
                                ${isCurrentMonth && !disponivel ? 'bg-red-50/50 text-red-500 hover:bg-red-50 cursor-pointer active:bg-slate-100' : 'cursor-pointer active:bg-slate-100'}
                                ${isTargetToday ? 'z-10 bg-[#BFDBFE] border-[3px] border-[#3B82F6]' : ''}
                            `}
                            title={isCurrentMonth && !disponivel ? 'Dia lotado - clique para ver detalhes' : ''}
                        >
                            <div className="flex items-center gap-1 z-10 relative">
                                <span className={`
                                    text-sm md:text-base
                                    ${!isCurrentMonth ? 'text-slate-400' : ''}
                                    ${isCurrentMonth && !disponivel ? 'text-red-500/30' : 'text-slate-700'}
                                    ${isTargetToday ? 'font-black text-[#1E40AF]' : ''}
                                `}>
                                    {day}
                                </span>
                                {isTargetToday && (
                                    <span className="text-[10px] text-[#1E40AF]">●</span>
                                )}
                            </div>

                            {isWithOrders && isCurrentMonth && disponivel && (
                                <div className={`
                                    w-1.5 h-1.5 rounded-full mt-1 z-10 relative
                                    ${isTargetToday ? 'bg-[#1E40AF]' : 'bg-orange-500'}
                                `}></div>
                            )}

                            {!disponivel && isCurrentMonth && (
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-black text-red-500 uppercase tracking-widest bg-red-50/50 mix-blend-multiply pointer-events-none">
                                    LOTADO
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarMobile;
