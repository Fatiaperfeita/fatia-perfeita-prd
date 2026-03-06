import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../common/ProgressBar';
import InputMask from '../common/InputMask';
import QuantidadeSelector from '../common/QuantidadeSelector';
import ImageUpload from '../common/ImageUpload';
import ResumoPedido from '../common/ResumoPedido';
import AgendaDisponibilidade from '../common/AgendaDisponibilidade';
import DatePicker from '../common/DatePicker';
import { SABORES, TAMANHOS, ADICIONAIS, HORARIOS_DISPONIVEIS } from '../../constants/constants';
import {
    formatarMoeda,
    formatarWhatsApp,
    calcularTotalPedido,
    formatarDataISO,
    formatarDataBR,
    getHorariosDisponiveis,
    isHorarioDisponivel
} from '../../utils/utils';
import { getHoje, getAmanha, getDaquiNDias } from '../../utils/datas';

// Mock inicial de pedidos agendados para controle de fluxo
const mockPedidosAgendados = [
    { dataRetirada: '2026-02-18', horaRetirada: '14:00', quantidade: 1 },
    { dataRetirada: '2026-02-18', horaRetirada: '16:00', quantidade: 1 },
    { dataRetirada: '2026-02-19', horaRetirada: '15:00', quantidade: 1 },
];

const NovoPedidoWizard = ({ onSave }) => {
    // --- Initial State ---
    const initialBolo = {
        sabor: '',
        saborNome: '',
        tamanho: '',
        tamanhoNome: '',
        valorUnitario: 0,
        quantidade: 1,
        desenho: '',
        imagemFile: null,
        imagemPreview: null,
        dataRetirada: getAmanha(), // DEFAULT: AMANHÃ
        horaRetirada: '',
        subtotal: 0
    };

    const [step, setStep] = useState(1);
    const [cliente, setCliente] = useState({
        nome: '',
        whatsapp: '',
        embalagem: false
    });
    const [bolos, setBolos] = useState([]);
    const [currentBolo, setCurrentBolo] = useState(initialBolo);
    const [pedidosAgendados] = useState(mockPedidosAgendados);

    // --- Modal e Navigation ---
    const [showExitModal, setShowExitModal] = useState(false);
    const navigate = useNavigate();

    const handleExit = () => {
        setShowExitModal(true);
    };

    const handleConfirmExit = () => {
        setShowExitModal(false);
        navigate('/'); // Volta para o Dashboard
    };

    const handleCancelExit = () => {
        setShowExitModal(false);
    };

    // --- Validation Helper ---
    const isStepValid = () => {
        switch (step) {
            case 1:
                const whatsappNumeros = cliente.whatsapp.toString().replace(/\D/g, '');
                return cliente.nome.trim() !== '' && whatsappNumeros.length >= 10 && whatsappNumeros.length <= 13;
            case 2:
                return currentBolo.sabor !== '';
            case 3:
                return currentBolo.tamanho !== '';
            case 6:
                return currentBolo.dataRetirada !== '' &&
                    currentBolo.horaRetirada !== '' &&
                    isHorarioDisponivel(currentBolo.dataRetirada, currentBolo.horaRetirada, pedidosAgendados);
            default:
                return true;
        }
    };

    // --- Navigation ---
    const nextStep = () => {
        if (isStepValid()) {
            setStep(s => s + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(s => s - 1);
            window.scrollTo(0, 0);
        }
    };

    // --- Handlers ---
    const handleClienteChange = (field, value) => {
        setCliente(prev => ({ ...prev, [field]: value }));
    };

    const handleBoloChange = (field, value) => {
        setCurrentBolo(prev => {
            const updated = { ...prev, [field]: value };

            // Sync names and prices if ID changes
            if (field === 'sabor') {
                const s = SABORES.find(item => item.id === value);
                updated.saborNome = s ? s.nome : '';
            }
            if (field === 'tamanho') {
                const t = TAMANHOS.find(item => item.id === value);
                updated.tamanhoNome = t ? t.nome : '';
                updated.valorUnitario = t ? t.valor : 0;
            }

            // Simple subtotal update (Quantity * UnitPrice)
            updated.subtotal = updated.quantidade * updated.valorUnitario;

            return updated;
        });
    };

    const handleImageChange = (file) => {
        const previewUrl = URL.createObjectURL(file);
        handleBoloChange('imagemFile', file);
        handleBoloChange('imagemPreview', previewUrl);
    };

    const handleRemoveImage = () => {
        if (currentBolo.imagemPreview) {
            URL.revokeObjectURL(currentBolo.imagemPreview);
        }
        handleBoloChange('imagemFile', null);
        handleBoloChange('imagemPreview', null);
    };

    const handleAddBolo = () => {
        setBolos(prev => [...prev, currentBolo]);
        // Reset current bolo but keep common fields like schedule
        setCurrentBolo({
            ...initialBolo,
            dataRetirada: currentBolo.dataRetirada,
            horaRetirada: currentBolo.horaRetirada
        });
        setStep(2); // Go back to flavor selection for the next cake
    };

    const handleRemoveBolo = (index) => {
        const updated = [...bolos];
        updated.splice(index, 1);
        setBolos(updated);
    };

    const handleSavePedido = () => {
        const fullPedido = {
            id: Date.now(),
            cliente,
            bolos: [...bolos, currentBolo],
            status: 'pendente',
            dataCriacao: new Date().toISOString()
        };

        if (onSave) {
            onSave(fullPedido);
        } else {
            console.log('Salvando Pedido:', fullPedido);
            alert('Pedido salvo com sucesso! (Interface Mock)');
        }
    };

    // --- Totals Calculation ---
    const { subtotal, adicionalEmbalagem, total } = calcularTotalPedido({
        cliente,
        bolos: [...bolos, currentBolo]
    });

    // --- Render Helpers ---
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Passo 1: Cliente</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-[#6B7280] ml-1">Nome do Cliente *</label>
                                    <input
                                        type="text"
                                        value={cliente.nome}
                                        onChange={(e) => handleClienteChange('nome', e.target.value)}
                                        placeholder="Ex: João Silva"
                                        className="w-full h-14 px-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold text-lg text-slate-800 transition-all"
                                    />
                                </div>
                                <InputMask
                                    label="WhatsApp *"
                                    value={cliente.whatsapp}
                                    onChange={(val) => handleClienteChange('whatsapp', val)}
                                    required
                                />
                            </div>
                            <div className="bg-slate-50 md:bg-white p-4 md:p-6 rounded-2xl border border-slate-100 md:border-2 md:border-slate-100">
                                <label className="block text-sm font-black text-slate-800 mb-1 uppercase tracking-tighter">Embalagem protetora?</label>
                                <p className="text-[11px] text-slate-500 mb-4 font-medium leading-tight">
                                    Sacola para transporte seguro (+ R$ 3,00)
                                </p>
                                <div className="space-y-2.5">
                                    <label
                                        onClick={() => handleClienteChange('embalagem', false)}
                                        className={`flex items-center space-x-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${!cliente.embalagem ? 'bg-white border-blue-500 shadow-sm' : 'bg-transparent border-slate-100'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!cliente.embalagem ? 'border-blue-500' : 'border-slate-300'}`}>
                                            {!cliente.embalagem && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                                        </div>
                                        <div className="flex-1">
                                            <span className={`block font-bold text-sm ${!cliente.embalagem ? 'text-blue-600' : 'text-slate-600'}`}>Não</span>
                                            <span className="text-[10px] text-slate-400 font-medium">(cliente busca na loja)</span>
                                        </div>
                                    </label>

                                    <label
                                        onClick={() => handleClienteChange('embalagem', true)}
                                        className={`flex items-center space-x-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${cliente.embalagem ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-transparent border-slate-100'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${cliente.embalagem ? 'border-blue-500' : 'border-slate-300'}`}>
                                            {cliente.embalagem && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                                        </div>
                                        <div className="flex-1">
                                            <span className={`block font-bold text-sm ${cliente.embalagem ? 'text-blue-600' : 'text-slate-600'}`}>Sim (+ R$ 3,00)</span>
                                            <span className="text-[10px] text-blue-400 font-medium">(sacola protetora)</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Passo 2: Sabor</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {SABORES.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => handleBoloChange('sabor', s.id)}
                                    className={`p-4 md:p-6 rounded-2xl border-2 text-left transition-all group ${currentBolo.sabor === s.id ? 'bg-white border-blue-500 shadow-md transform scale-[1.02]' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                                >
                                    <p className={`font-bold text-lg ${currentBolo.sabor === s.id ? 'text-blue-600' : 'text-slate-800'}`}>
                                        {s.nome}
                                    </p>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed mt-1">{s.descricao}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Passo 3: Tamanho</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {TAMANHOS.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => handleBoloChange('tamanho', t.id)}
                                    className={`p-4 md:p-6 rounded-2xl border-2 text-left transition-all ${currentBolo.tamanho === t.id ? 'bg-white border-blue-500 shadow-md transform scale-[1.02]' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="min-w-0">
                                            <p className={`font-bold text-lg truncate ${currentBolo.tamanho === t.id ? 'text-blue-600' : 'text-slate-800'}`}>
                                                {t.nome}
                                            </p>
                                            {t.descricao && <p className="text-sm text-slate-400 font-medium mt-1">{t.descricao}</p>}
                                        </div>
                                        <div className="text-xl font-black text-blue-500 whitespace-nowrap">
                                            {formatarMoeda(t.valor)}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-10 py-10 animate-in fade-in zoom-in-95 duration-500">
                        <h2 className="text-2xl font-black text-slate-800 text-center uppercase tracking-tight">Quantidade</h2>
                        <QuantidadeSelector
                            label="Quantos bolos deste sabor?"
                            value={currentBolo.quantidade}
                            valorUnitario={currentBolo.valorUnitario}
                            onChange={(val) => handleBoloChange('quantidade', val)}
                        />
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Passo 5: Desenho</h2>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-[#6B7280] ml-1">Descrição do Desenho</label>
                                <textarea
                                    value={currentBolo.desenho}
                                    onChange={(e) => handleBoloChange('desenho', e.target.value)}
                                    placeholder="Ex: Flamengo escuro preto e branco"
                                    rows={4}
                                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-700 resize-none transition-all"
                                />
                            </div>
                            <ImageUpload
                                label="Upload de imagem (opcional)"
                                value={currentBolo.imagemFile}
                                previewUrl={currentBolo.imagemPreview}
                                onChange={handleImageChange}
                                onRemove={handleRemoveImage}
                            />
                        </div>
                    </div>
                );
            case 6:
                const horariosDisp = currentBolo.dataRetirada ? getHorariosDisponiveis(currentBolo.dataRetirada, pedidosAgendados) : [];
                const nenhumHorarioDisp = currentBolo.dataRetirada && horariosDisp.length === 0;

                return (
                    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                📅 Escolha data e horário para retirada
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">
                                Pedidos podem ser agendados a partir de hoje
                            </p>
                        </div>

                        <AgendaDisponibilidade
                            pedidosAgendados={pedidosAgendados}
                            dataSelecionada={currentBolo.dataRetirada}
                            onDataSelect={(val) => {
                                handleBoloChange('dataRetirada', val);
                                handleBoloChange('horaRetirada', '');
                            }}
                            onHoraSelect={(val) => handleBoloChange('horaRetirada', val)}
                        />

                        {!currentBolo.dataRetirada && (
                            <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-2">
                                ⚠️ Selecione uma data no calendário para ver os horários
                            </div>
                        )}

                        {/* Status Messages */}
                        <div className="min-h-[60px] flex flex-col justify-center">
                            {!currentBolo.dataRetirada && (
                                <p className="text-xs text-slate-400 text-center italic">
                                    ⚠️ Não é possível agendar para datas anteriores
                                </p>
                            )}

                            {currentBolo.dataRetirada && !nenhumHorarioDisp && !currentBolo.horaRetirada && (
                                <p className="text-sm font-bold text-slate-400 animate-pulse text-center">
                                    Selecione um horário para {formatarDataBR(currentBolo.dataRetirada)}
                                </p>
                            )}

                            {currentBolo.horaRetirada && (
                                <div className="bg-green-50 border border-green-100 p-3 rounded-xl flex items-center justify-center gap-2 animate-in zoom-in-95 fill-mode-both">
                                    <span className="text-lg">✅</span>
                                    <p className="text-sm font-bold text-green-600">
                                        Horário {currentBolo.horaRetirada} reservado para retirada
                                    </p>
                                </div>
                            )}

                            {nenhumHorarioDisp && (
                                <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center justify-center gap-2 animate-bounce">
                                    <span className="text-lg">⚠️</span>
                                    <p className="text-sm font-bold text-red-600">
                                        Não há horários disponíveis nesta data
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 7:
                return (
                    <ResumoPedido
                        cliente={cliente}
                        bolos={[...bolos, currentBolo]}
                        onAddBolo={handleAddBolo}
                        onRemoveBolo={handleRemoveBolo}
                        subtotal={subtotal}
                        adicionalEmbalagem={adicionalEmbalagem}
                        total={total}
                        onBack={prevStep}
                        onSave={handleSavePedido}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-md md:max-w-4xl mx-auto min-h-screen bg-white md:bg-slate-50/50 md:mt-8 md:rounded-3xl md:shadow-xl md:border md:border-slate-100 overflow-hidden pb-32 md:pb-8 relative">

            {/* Exit Button */}
            <button
                onClick={handleExit}
                className="fixed top-3 right-4 md:absolute md:top-6 md:right-6 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md md:bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-100 md:hover:bg-slate-200 rounded-full transition-all z-50 shadow-sm md:shadow-none border border-slate-100 md:border-transparent"
                title="Fechar e Sair"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Exit Modal */}
            {showExitModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full animate-in zoom-in-95 duration-200 shadow-2xl">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Atenção</h2>
                            <p className="text-slate-500 font-medium mt-2">
                                Deseja realmente sair?<br />
                                <span className="text-slate-700 font-bold">Os dados não salvos serão perdidos.</span>
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelExit}
                                className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmExit}
                                className="flex-1 bg-red-500 text-white py-3.5 rounded-2xl font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Progress Bar */}
            <div className="fixed md:relative top-0 left-0 right-0 bg-white md:bg-transparent z-40">
                <ProgressBar currentStep={step} totalSteps={7} />
            </div>

            {/* Content Container */}
            <div className={`pt-24 md:pt-10 px-4 md:px-12 ${step === 7 ? 'p-0' : ''}`}>
                {renderStepContent()}
            </div>

            {/* Navigation Buttons (Bottom Fixo for steps 1-6) */}
            {step < 7 && (
                <div className="fixed md:relative bottom-0 left-0 right-0 p-4 md:p-12 md:mt-8 bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t md:border-t-0 border-slate-100 flex justify-between gap-3 z-40">
                    {step > 1 && (
                        <button
                            onClick={prevStep}
                            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold active:scale-95 transition-all hover:bg-slate-200"
                        >
                            Voltar
                        </button>
                    )}
                    <button
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        className={`py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all ${isStepValid()
                            ? 'flex-[2] bg-blue-500 text-white shadow-lg shadow-blue-200 hover:bg-blue-600'
                            : 'flex-[2] bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        Próximo →
                    </button>
                </div>
            )}
        </div>
    );
};

export default NovoPedidoWizard;
