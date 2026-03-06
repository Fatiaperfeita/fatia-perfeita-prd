import React from 'react';
import { useNavigate } from 'react-router-dom';
import NovoPedidoWizard from '../components/pedidos/NovoPedidoWizard';

const NovoPedidoPage = () => {
    const navigate = useNavigate();

    const handleSave = (pedido) => {
        console.log("Pedido salvo:", pedido);
        // Here we would typically call an API to save
        // For now, let's just show a success alert and go back
        alert("Pedido salvo com sucesso!");
        navigate('/');
    };

    return (
        <div className="pb-20">
            <NovoPedidoWizard onSave={handleSave} />
        </div>
    );
};

export default NovoPedidoPage;
