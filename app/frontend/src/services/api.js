import { gerarMockPedidos } from '../data/mockData';

export const getPedidos = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(gerarMockPedidos());
        }, 500); // Simulate network delay
    });
};
