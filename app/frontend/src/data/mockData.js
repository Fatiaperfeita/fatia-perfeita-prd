import { getHoje, getDaquiNDias } from '../utils/datas';
import { formatarDataISO } from '../utils/utils';
import { SABORES, TAMANHOS } from '../constants/constants';

export const gerarMockPedidos = () => {
    const hoje = new Date();
    const pedidos = [];
    let idCounter = 1;

    // Clientes e WhatsApps para variedade
    const CLIENTES_MOCK = [
        { nome: 'João Silva', whatsapp: '+55 21 99999-9999' },
        { nome: 'Maria Souza', whatsapp: '+55 21 98765-4321' },
        { nome: 'Pedro Costa', whatsapp: '+55 21 91234-5678' },
        { nome: 'Ana Paula', whatsapp: '+55 21 98765-1234' },
        { nome: 'Carlos Silva', whatsapp: '+55 21 99887-7665' },
        { nome: 'Juliana Santos', whatsapp: '+55 21 97654-3210' },
        { nome: 'Roberto Almeida', whatsapp: '+55 21 96543-2109' },
        { nome: 'Fernanda Lima', whatsapp: '+55 21 95432-1098' }
    ];

    const DESENHOS_MOCK = [
        'Flamengo escuro preto e branco', 'Caricatura do Mickey', 'Time Vasco',
        'Bolo com tema infantil', 'Desenho personalizado', 'Letras decoradas',
        'Flores pintadas', 'Personagem anime'
    ];

    const HORARIOS_SLOTS = ['14:00', '15:00', '16:00', '17:00'];

    // Gerar pedidos para os próximos 14 dias
    for (let diasOffset = 0; diasOffset < 14; diasOffset++) {
        const data = new Date();
        data.setDate(hoje.getDate() + diasOffset);
        const dataStr = formatarDataISO(data);

        // Lógica de densidade:
        // Dias 2, 5, 9 (em relação a hoje) serão SEMPRE lotados para teste
        // Outros dias variam entre 0 e 3
        let qtdPedidos;
        if (diasOffset === 2 || diasOffset === 5 || diasOffset === 9) {
            qtdPedidos = 4; // Lotado
        } else if (diasOffset === 0) {
            qtdPedidos = 2; // Hoje: 2 pedidos
        } else if (diasOffset === 1) {
            qtdPedidos = 3; // Amanhã: 3 pedidos
        } else {
            // Aleatório 0-3
            qtdPedidos = Math.floor(Math.random() * 4);
        }

        const slotsDisponiveis = [...HORARIOS_SLOTS];

        for (let i = 0; i < qtdPedidos; i++) {
            if (slotsDisponiveis.length === 0) break;

            // Escolhe um horário aleatório dos disponíveis para o dia
            const slotIdx = Math.floor(Math.random() * slotsDisponiveis.length);
            const horaStr = slotsDisponiveis.splice(slotIdx, 1)[0];

            const clienteMock = CLIENTES_MOCK[Math.floor(Math.random() * CLIENTES_MOCK.length)];
            const saborMock = SABORES[Math.floor(Math.random() * SABORES.length)];
            const tamanhoMock = TAMANHOS[Math.floor(Math.random() * TAMANHOS.length)];
            const desenhoMock = DESENHOS_MOCK[Math.floor(Math.random() * DESENHOS_MOCK.length)];

            // Status: 'em_producao' para hoje, 'pendente' para o resto
            const status = diasOffset === 0 ? 'em_producao' : 'pendente';

            pedidos.push({
                id: `pedido-${idCounter++}`,
                cliente: clienteMock.nome,
                whatsapp: clienteMock.whatsapp,
                produto: 'Bolo',
                sabor: saborMock.id,
                saborNome: saborMock.nome,
                tamanho: tamanhoMock.id,
                tamanhoNome: tamanhoMock.nome,
                valor: tamanhoMock.valor,
                desenho: desenhoMock,
                dataRetirada: dataStr,
                horaRetirada: horaStr,
                status: status,
                embalagem: Math.random() > 0.5,
                createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
    }

    return pedidos.sort((a, b) => {
        if (a.dataRetirada !== b.dataRetirada) return a.dataRetirada.localeCompare(b.dataRetirada);
        return a.horaRetirada.localeCompare(b.horaRetirada);
    });
};
