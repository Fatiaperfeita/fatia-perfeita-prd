import { ADICIONAIS } from '../constants/constants';

/**
 * Formata um número para o padrão de moeda brasileiro (R$ XX,XX)
 */
export const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor || 0);
};

/**
 * Formata WhatsApp para o padrão +55 XX XXXXX-XXXX
 */
export const formatarWhatsApp = (numero) => {
    if (!numero) return "";

    // Remove tudo exceto números e o sinal de +
    let cleaned = numero.toString().replace(/[^\d+]/g, '');

    // Garante o prefixo +55
    if (!cleaned.startsWith('+55')) {
        // Se começar com 55 mas sem o +, adiciona o +
        if (cleaned.startsWith('55')) {
            cleaned = '+' + cleaned;
        } else {
            // Se não tiver 55, assume que é BR e adiciona +55
            cleaned = '+55' + cleaned;
        }
    }

    // Regex para capturar os grupos: +55 (2), DDD (2), Prefixo (5), Sufixo (4)
    const match = cleaned.match(/^(\+55)(\d{2})(\d{5})(\d{4})$/);

    if (match) {
        return `${match[1]} ${match[2]} ${match[3]}-${match[4]}`;
    }

    return cleaned;
};

/**
 * Calcula o total simplificado de um pedido
 * Retorna { subtotal, adicionalEntrega, total }
 */
export const calcularTotalPedido = (pedido) => {
    const { cliente, bolos } = pedido;

    const subtotal = bolos.reduce((sum, bolo) => {
        return sum + ((bolo.valorUnitario || bolo.valor || 0) * (bolo.quantidade || 1));
    }, 0);

    const adicionalEntrega = cliente?.entrega || cliente?.uber ? ADICIONAIS.ENTREGA.valor : 0;
    const total = subtotal + adicionalEntrega;

    return { subtotal, adicionalEntrega, total };
};

/**
 * Gera um identificador único
 */
export const gerarIdUnico = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Formata data para YYYY-MM-DD
 */
export const formatarDataISO = (data) => {
    const d = new Date(data);
    if (isNaN(d.getTime())) return "";

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/**
 * Formata data para DD/MM/YYYY
 */
export const formatarDataBR = (data) => {
    if (!data) return "";

    let d;
    if (typeof data === 'string' && data.includes('-')) {
        const [year, month, day] = data.split('-');
        return `${day}/${month}/${year}`;
    } else {
        d = new Date(data);
    }

    if (isNaN(d.getTime())) return "";

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
};

/**
 * Adiciona dias a uma data e retorna YYYY-MM-DD
 */
export const adicionarDias = (data, dias) => {
    const d = new Date(data);
    if (isNaN(d.getTime())) return "";

    d.setDate(d.getDate() + dias);
    return formatarDataISO(d);
};

/**
 * Retorna a data de amanhã em YYYY-MM-DD
 */
export const getDataAmanha = () => {
    return adicionarDias(new Date(), 1);
};

/**
 * Retorna os horários disponíveis para uma data específica
 */
export const getHorariosDisponiveis = (data, pedidosAgendados) => {
    const HORARIOS_FIXOS = ['14:00', '15:00', '16:00', '17:00'];

    return HORARIOS_FIXOS.filter(hora => {
        const agendado = pedidosAgendados.find(p =>
            p.dataRetirada === data && p.horaRetirada === hora
        );
        return !agendado; // Retorna true se NÃO estiver agendado
    });
};

/**
 * Verifica se um horário específico está disponível
 */
export const isHorarioDisponivel = (data, hora, pedidosAgendados) => {
    return !pedidosAgendados.some(p =>
        p.dataRetirada === data && p.horaRetirada === hora
    );
};

/**
 * Retorna o número de vagas restantes (0 ou 1)
 */
export const getCapacidadeHorario = (data, hora, pedidosAgendados) => {
    const ocupados = pedidosAgendados.filter(p =>
        p.dataRetirada === data && p.horaRetirada === hora
    ).length;
    return 1 - ocupados; // Capacidade máxima: 1
};

/**
 * Retorna um array de datas (YYYY-MM-DD) com pelo menos 1 horário disponível nos próximos X dias
 */
export const getDatasComDisponibilidade = (pedidosAgendados, diasParaFrente = 30) => {
    const datasDisponiveis = [];
    const hoje = new Date();

    for (let i = 0; i < diasParaFrente; i++) {
        const data = new Date();
        data.setDate(hoje.getDate() + i);
        const dataStr = formatarDataISO(data);

        const horariosDisp = getHorariosDisponiveis(dataStr, pedidosAgendados);
        if (horariosDisp.length > 0) {
            datasDisponiveis.push(dataStr);
        }
    }

    return datasDisponiveis;
};
