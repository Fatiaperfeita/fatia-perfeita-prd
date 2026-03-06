import React, { useState } from 'react';
import { formatarDataISO, formatarDataBR } from '../../utils/utils';

const DatePicker = ({
    value,
    onChange,
    minDate = formatarDataISO(new Date()),
    maxDate = formatarDataISO(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    disabledDates = []
}) => {
    const [currentViewDate, setCurrentViewDate] = useState(value ? new Date(value) : new Date());

    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const isDataPassada = (dateStr) => {
        const d = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        return d < today;
    };

    const isDataDesabilitada = (dateStr) => {
        return (
            isDataPassada(dateStr) ||
            disabledDates.includes(dateStr) ||
            dateStr < minDate ||
            dateStr > maxDate
        );
    };

    const handleDateClick = (dateStr) => {
        if (!isDataDesabilitada(dateStr)) {
            onChange(dateStr);
        }
    };

    const changeMonth = (offset) => {
        const newDate = new Date(year, month + offset, 1);
        setCurrentViewDate(newDate);
    };

    const days = [];
    // Offset days
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    // Month days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        days.push({ day: d, dateStr });
    }

    const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentViewDate);

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => handleNav(-1)}
                    disabled={!canGoPrevMonth()}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${canGoPrevMonth()
                            ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            : 'text-slate-300 opacity-30 cursor-not-allowed'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                    {monthName}
                </h3>

                <button
                    onClick={() => handleNav(1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                    <div key={i} className="text-[10px] font-black text-slate-300 uppercase py-1">{d}</div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((dayObj, idx) => {
                    if (!dayObj) return <div key={`empty-${idx}`} className="h-10" />;

                    const disabled = isDataDesabilitada(dayObj.dateStr);
                    const selected = value === dayObj.dateStr;
                    const today = formatarDataISO(new Date()) === dayObj.dateStr;

                    return (
                        <button
                            key={dayObj.dateStr}
                            onClick={() => handleDateClick(dayObj.dateStr)}
                            disabled={disabled}
                            className={`
                h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all
                ${selected ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105 z-10' : ''}
                ${!selected && !disabled ? 'text-slate-700 hover:bg-slate-50' : ''}
                ${disabled ? 'bg-slate-50 text-slate-300 opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${today && !selected ? 'ring-2 ring-blue-100 text-blue-500' : ''}
              `}
                        >
                            {dayObj.day}
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50">
                <p className="text-[11px] text-slate-400 font-medium text-center">
                    Selecione uma data a partir de <span className="text-blue-500 font-bold">{formatarDataBR(minDate)}</span>
                </p>
                <p className="text-[10px] text-slate-300 mt-1 text-center italic">
                    Datas anteriores não permitidas para agendamento
                </p>
            </div>
        </div>
    );
};

export default DatePicker;
