import React, { useState, useEffect } from 'react';

const InputMask = ({
    label,
    value = '',
    onChange,
    placeholder = "Cole o WhatsApp aqui",
    required = false
}) => {
    const [inputValue, setInputValue] = useState(value);

    // Sincroniza estado interno se o value mudar externamente
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const numeros = inputValue ? inputValue.toString().replace(/\D/g, '') : '';
    const qtdDigitos = numeros.length;

    // Lógica de Validação
    const isTooShort = qtdDigitos > 0 && qtdDigitos < 10;
    const isTooLong = qtdDigitos > 13;
    const isValid = qtdDigitos >= 10 && qtdDigitos <= 13;
    const isEmpty = required && (!inputValue || inputValue.toString().trim() === '');

    // Erro específico para exibição
    let errorMessage = null;
    if (isTooShort) errorMessage = '⚠️ WhatsApp incompleto (mínimo 10 dígitos)';
    if (isTooLong) errorMessage = '⚠️ WhatsApp muito longo (máximo 13 dígitos)';
    if (isEmpty) errorMessage = '⚠️ Campo obrigatório';

    // Formatação Visual (Visual apenas, preserva o que o usuário digitou se não bater na régua)
    const formatarVisual = (val) => {
        const nums = val.replace(/\D/g, '');
        const q = nums.length;

        if (q === 11) {
            // (XX) XXXXX-XXXX
            return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
        }
        if (q === 13 && nums.startsWith('55')) {
            // +55 XX XXXXX-XXXX
            return `+55 ${nums.slice(2, 4)} ${nums.slice(4, 9)}-${nums.slice(9)}`;
        }
        return val;
    };

    const handleChange = (e) => {
        const rawValue = e.target.value;
        const formatted = formatarVisual(rawValue);
        setInputValue(formatted);
        onChange(formatted);
    };

    return (
        <div className="w-full space-y-1.5">
            <div className="flex justify-between items-end px-1">
                {label && (
                    <label className="block text-[14px] font-semibold text-[#6B7280]">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                )}

                {/* Contador de Dígitos */}
                {qtdDigitos > 0 && (
                    <div className="flex items-center gap-1.5 transition-all">
                        {isValid ? (
                            <span className="text-[11px] text-green-600 font-bold flex items-center gap-0.5">
                                ✓ {qtdDigitos} dígitos
                            </span>
                        ) : (
                            <span className="text-[11px] text-red-600 font-bold flex items-center gap-0.5">
                                ✗ {qtdDigitos} dígitos ({qtdDigitos < 10 ? 'mín 10' : 'máx 13'})
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className={`
                flex items-center gap-3 bg-white border-2 rounded-2xl px-4 h-14 transition-all
                ${errorMessage ? 'border-red-500 bg-red-50/10' : (isValid ? 'border-emerald-500 bg-emerald-50/5' : 'border-slate-100 focus-within:border-blue-500')}
                ${!errorMessage && !isValid && qtdDigitos > 0 ? 'focus-within:border-amber-400' : ''}
            `}>
                {/* WhatsApp Icon */}
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-colors
                    ${isValid ? 'bg-[#25D366]' : (errorMessage ? 'bg-red-400' : 'bg-slate-200')}
                `}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.584 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
                    </svg>
                </div>

                <input
                    type="tel"
                    inputMode="tel"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full h-full bg-transparent outline-none text-slate-800 font-bold text-lg placeholder:text-slate-300 placeholder:font-normal"
                />

                {isValid && (
                    <span className="text-emerald-500 font-black animate-in zoom-in duration-300">✓</span>
                )}
            </div>

            {errorMessage && (
                <p className="text-[12px] text-red-500 font-bold ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default InputMask;
