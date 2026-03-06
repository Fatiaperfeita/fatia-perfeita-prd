import { formatarDataISO } from './utils';

/**
 * Retorna a data de hoje no formato YYYY-MM-DD
 */
export const getHoje = () => {
    return formatarDataISO(new Date());
};

/**
 * Retorna a data de amanhã no formato YYYY-MM-DD
 */
export const getAmanha = () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    return formatarDataISO(amanha);
};

/**
 * Retorna a data de daqui a N dias no formato YYYY-MM-DD
 */
export const getDaquiNDias = (n) => {
    const data = new Date();
    data.setDate(data.getDate() + n);
    return formatarDataISO(data);
};

/**
 * Verifica se uma string de data (YYYY-MM-DD) é hoje
 */
export const isHoje = (dataStr) => {
    return dataStr === getHoje();
};

/**
 * Verifica se uma string de data (YYYY-MM-DD) é amanhã
 */
export const isAmanha = (dataStr) => {
    return dataStr === getAmanha();
};
