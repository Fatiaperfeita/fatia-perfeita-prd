import React from 'react';
import { STATUS_PEDIDO } from '../../constants/constants';

const StatusBadge = ({ status, mini = false }) => {
    const current = STATUS_PEDIDO[status?.toLowerCase()] || { cor: '#94A3B8', texto: status };

    // Common style for touch feedback
    const activeStyle = "active:brightness-90 transition-all cursor-pointer";

    if (mini) {
        return (
            <div
                className={`w-3 h-3 rounded-full ${activeStyle}`}
                style={{ backgroundColor: current.cor }}
                title={current.texto}
            ></div>
        );
    }

    return (
        <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-[12px] font-bold text-white shadow-sm ${activeStyle}`}
            style={{ backgroundColor: current.cor }}
        >
            {current.texto}
        </div>
    );
};

export default StatusBadge;
