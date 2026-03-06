export const SABORES = [
    {
        id: 'chocolate',
        nome: 'Chocolate com Recheio de Chocolate',
        descricao: 'Bolo de chocolate com recheio de chocolate'
    },
    {
        id: 'red-velvet',
        nome: 'Red Velvet com geleia de morango e Recheio de Ninho',
        descricao: 'Red Velvet com geleia de morango e recheio de Ninho'
    },
    {
        id: 'maracuja',
        nome: 'Maracujá com Recheio de chocolate',
        descricao: 'Bolo de maracujá com recheio de chocolate'
    },
    {
        id: 'limao',
        nome: 'Limão siciliano com Recheio de Ninho',
        descricao: 'Bolo de limão siciliano com recheio de Ninho'
    }
];

export const TAMANHOS = [
    {
        id: '6-fatias',
        nome: '06 Fatias',
        valor: 45.00,
        descricao: 'desenhos simples'
    },
    {
        id: '10-fatias',
        nome: '10 Fatias',
        valor: 65.00,
        descricao: ''
    },
    {
        id: '20-fatias',
        nome: '20 Fatias',
        valor: 110.00,
        descricao: ''
    },
    {
        id: '25-fatias',
        nome: '25 Fatias',
        valor: 135.00,
        descricao: ''
    }
];

export const ADICIONAIS = {
    EMBALAGEM: { nome: 'Embalagem', valor: 3.00 }
};

export const HORARIOS_DISPONIVEIS = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const STATUS_PEDIDO = {
    pendente: { cor: '#EF4444', texto: 'Pendente' },
    em_producao: { cor: '#F59E0B', texto: 'Em produção' },
    concluido: { cor: '#10B981', texto: 'Concluído' },
    cancelado: { cor: '#8B5CF6', texto: 'Cancelado' }
};
