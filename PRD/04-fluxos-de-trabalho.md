# Fluxos de Trabalho - Fatia Perfeita

## 1. Fluxo de Cadastro de Insumos
```mermaid
graph TD
    A[Usuário acessa 'Insumos'] --> B[Clica em 'Novo Insumo']
    B --> C[Preenche: nome, unidade, estoque mínimo]
    C --> D[Define fornecedor (opcional)]
    D --> E[Sistema valida dados]
    E --> F[Insumo salvo com ID único]
    F --> G[Notificação: 'Insumo cadastrado com sucesso']


## 3. Fluxo de Cadastro de Insumos
graph LR
    A[Nova Venda] --> B[Adicionar produtos]
    B --> C{Estoque suficiente}
    C -->|Sim| D[Aplicar desconto ou promocao]
    C -->|Nao| E[Sugerir produto similar]
    D --> F[Finalizar pagamento]
    F --> G[Gerar comanda ou NF]
    G --> H[Deduzir produtos do estoque]
