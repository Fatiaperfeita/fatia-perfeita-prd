import React from 'react';
import StatusBadge from './StatusBadge';

const PedidoCardMobile = ({
    cliente,
    horaRetirada,
    produto,
    tamanho,
    sabor,
    status,
    valor,
    onClick // Added onClick prop
}) => {

    // Construct product summary
    const produtoResumo = `${produto} • ${tamanho} • ${sabor}`;

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl shadow-sm p-4 mb-3 border border-slate-100 flex flex-col justify-between relative h-auto min-h-[110px] 
                       active:scale-[0.98] transition-all touch-manipulation cursor-pointer hover:border-orange-200
                       md:p-6 md:mb-0 md:min-h-[160px] md:hover:shadow-md md:hover:-translate-y-1"
        >

            {/* Row 1: Status Dot + Time + Value */}
            <div className="flex items-center justify-between mb-1 md:mb-2">
                <div className="flex items-center gap-2 md:gap-3">
                    <StatusBadge status={status} mini={true} />
                    <span className="text-base md:text-xl font-bold text-slate-800 tracking-tight">{horaRetirada}</span>
                </div>
                <div className="text-base md:text-xl font-bold text-slate-900 bg-slate-50 md:bg-transparent px-2 md:px-0 rounded-lg">
                    {valor ? `R$ ${valor.toFixed(0)},00` : ''}
                </div>
            </div>

            {/* Row 2: Client Name */}
            <div className="mb-px md:mb-2 text-slate-900">
                <h3 className="font-bold text-[14px] md:text-lg leading-tight truncate">
                    {cliente}
                </h3>
            </div>

            {/* Row 3: Product Summary */}
            <div className="mb-2 md:mb-4">
                <p className="text-[13px] md:text-sm text-slate-500 truncate md:whitespace-normal md:line-clamp-2">
                    {produtoResumo}
                </p>
            </div>

            {/* Row 4: Status Badge (Small/Full) */}
            <div className="flex items-center">
                <StatusBadge status={status} />
            </div>

        </div>
    );
};

export default PedidoCardMobile;
