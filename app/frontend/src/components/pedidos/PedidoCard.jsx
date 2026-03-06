import React from 'react';

const PedidoCard = ({
    id,
    cliente,
    whatsapp,
    produto,
    tamanho,
    sabor,
    desenho,
    dataRetirada,
    horaRetirada,
    status,
    valor
}) => {

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pendente':
                return 'bg-amber-500'; // #F59E0B
            case 'confirmado':
                return 'bg-blue-500'; // #3B82F6
            case 'pago':
                return 'bg-emerald-500'; // #10B981
            case 'concluido':
                return 'bg-gray-500'; // #6B7280
            default:
                return 'bg-gray-300';
        }
    };

    const getStatusLabel = (status) => {
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Desconhecido';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-100 p-4 relative overflow-hidden">
            <div className="flex justify-between items-start">
                {/* Left Indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getStatusColor(status)}`}></div>

                <div className="pl-3 w-full">
                    {/* Header: Cliente and Status Dot */}
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{cliente}</h3>
                        <div className="flex items-center gap-1.5" title={getStatusLabel(status)}>
                            <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(status)}`}></div>
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="text-sm text-slate-500 mb-3 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
                        </svg>
                        {whatsapp}
                    </div>

                    {/* Product Info Line */}
                    <div className="text-slate-700 font-medium text-sm mb-1">
                        {produto} <span className="text-slate-400 mx-1">•</span> {tamanho} <span className="text-slate-400 mx-1">•</span> {sabor}
                    </div>

                    {/* Design Info */}
                    {desenho && (
                        <div className="text-slate-500 italic text-sm mb-4 bg-slate-50 p-2 rounded border border-slate-100 mt-2">
                            "{desenho}"
                        </div>
                    )}

                    {/* Footer: Date/Time & Value */}
                    <div className="flex justify-between items-end mt-2 pt-2 border-t border-slate-50">
                        <div className="text-xs text-slate-400 font-medium">
                            ID: #{id}
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-slate-500 mb-0.5">
                                {dataRetirada} às {horaRetirada}
                            </div>
                            <div className="text-lg font-bold text-slate-800">
                                {valor ? `R$ ${valor.toFixed(2).replace('.', ',')}` : 'A definir'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PedidoCard;
