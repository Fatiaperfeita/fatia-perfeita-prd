# Fluxos de Trabalho - Fatia Perfeita

## 1. Fluxo de Cadastro de Insumos
graph TD
    A[Usuário acessa 'Insumos'] --> B[Clica em 'Novo Insumo']
    B --> C[Preenche: nome, unidade, estoque mínimo]
    C --> D[Define fornecedor (opcional)]
    D --> E[Sistema valida dados]
    E --> F[Insumo salvo com ID único]
    F --> G[Notificação: 'Insumo cadastrado com sucesso']
