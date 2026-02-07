# Fluxos de Trabalho - Fatia Perfeita

## 1. Fluxo de Cadastro de Insumos
```mermaid
graph TD
    A[Usuário acessa Insumos] --> B[Clica em Novo Insumo]
    B --> C[Preenche nome, unidade, estoque minimo]
    C --> D[Define fornecedor opcional]
    D --> E[Sistema valida dados]
    E --> F[Insumo salvo com ID unico]
    F --> G[Notificacao Insumo cadastrado com sucesso]
```

## 2. Fluxo de Cadastro de Insumos
1. Usuário acessa Produção → Nova Produção
2. Seleciona produto final (ex: Pizza Margherita)
3. Sistema exibe lista de insumos necessários com quantidades calculadas
4. Usuário confirma disponibilidade no estoque
5. Sistema:
    * Deduz insumos do estoque
    * Registra data/hora da produção
    * Atualiza estoque do produto final
6. Notificação: "Produção registrada. Estoque atualizado."

## 3. Fluxo de Pedido de Venda
```mermaid
graph LR
    A[Nova Venda] --> B[Adicionar produtos]
    B --> C{Estoque suficiente}
    C -->|Sim| D[Aplicar desconto ou promocao]
    C -->|Nao| E[Sugerir produto similar]
    D --> F[Finalizar pagamento]
    F --> G[Gerar comanda ou NF]
    G --> H[Deduzir produtos do estoque]
```

## 4. Fluxo de Alertas Automáticos
* **Estoque baixo:** Notificação quando insumo < estoque mínimo
* **Validade próxima:** Alerta 3 dias antes do vencimento
* **Produção sugerida:** Indicação baseada em histórico de vendas
