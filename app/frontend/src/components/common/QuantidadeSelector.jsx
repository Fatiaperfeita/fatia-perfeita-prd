import React from 'react';
import { formatarMoeda } from '../../utils/utils';

const QuantidadeSelector = ({
    label,
    value = 1,
    onChange,
    min = 1,
    max = 99,
    valorUnitario = 0
}) => {

    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    const totalCalculado = valorUnitario * value;

    return (
        <div className="w-full flex flex-col items-center">
            {label && (
                <p className="text-center text-[15px] font-bold text-slate-700 mb-4 uppercase tracking-tight">
                    {label}
                </p>
            )}

            <div className="flex items-center justify-center gap-2">
                {/* Decrement Button */}
                <button
                    onClick={handleDecrement}
                    disabled={value <= min}
                    className="w-[44px] h-[44px] flex items-center justify-center rounded-lg bg-[#E5E7EB] text-2xl font-bold text-slate-700 active:scale-90 transition-all 
                               enabled:hover:bg-[#9CA3AF] disabled:bg-[#D1D5DB] disabled:text-slate-400 disabled:cursor-not-allowed"
                    aria-label="Diminuir"
                >
                    −
                </button>

                {/* Number Display */}
                <input
                    type="text"
                    value={value}
                    readOnly
                    className="w-[60px] h-[44px] text-center text-[18px] font-bold border border-[#D1D5DB] bg-white text-slate-800 rounded-md outline-none"
                    aria-label="Quantidade"
                />

                {/* Increment Button */}
                <button
                    onClick={handleIncrement}
                    disabled={value >= max}
                    className="w-[44px] h-[44px] flex items-center justify-center rounded-lg bg-[#E5E7EB] text-2xl font-bold text-slate-700 active:scale-90 transition-all 
                               enabled:hover:bg-[#9CA3AF] disabled:bg-[#D1D5DB] disabled:text-slate-400 disabled:cursor-not-allowed"
                    aria-label="Aumentar"
                >
                    +
                </button>
            </div>

            {/* Total Price Display */}
            <div className="mt-2 text-center">
                <p className="text-[16px] font-bold text-[#3B82F6]">
                    Valor total: {formatarMoeda(totalCalculado)}
                </p>
            </div>
        </div>
    );
};

export default QuantidadeSelector;
