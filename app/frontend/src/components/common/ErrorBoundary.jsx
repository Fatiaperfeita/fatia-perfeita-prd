import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Atualiza o state para que a próxima renderização mostre a UI de fallback.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Você também pode logar o erro em um serviço de relatórios de erros
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Você pode renderizar qualquer UI de fallback personalizada
            return (
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
                        <div className="text-red-500 text-5xl mb-6">⚠️</div>
                        <h2 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight">
                            Ops! Algo deu errado
                        </h2>
                        <p className="text-slate-500 mb-8 font-medium">
                            Ocorreu um erro inesperado. Tente recarregar a página ou voltar para a tela anterior.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
                            >
                                🔁 Recarregar Página
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-[0.98]"
                            >
                                ← Voltar
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
