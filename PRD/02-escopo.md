# PRD - Escopo

## In Scope (Versão 1.0)

### Módulo 1: Cadastro de Insumos
- Listar insumos cadastrados
- Adicionar novo insumo
- Editar insumo existente
- Excluir insumo
- Buscar insumo por nome

**Campos:**
- Descrição
- Unidade (kg, g, unidade, etc.)
- Preço de compra
- Estoque mínimo
- Observações

### Módulo 2: Cadastro de Produtos
- Listar produtos cadastrados
- Criar novo produto
- Editar produto existente
- Receita (lista de insumos)
- Cálculo automático de custos
- Precificação com margem de lucro

**Campos:**
- Nome
- Descrição
- Status (Ativo/Inativo)
- Receita (insumos + quantidades)
- Custos fixos mensais (MEI, gás, água/luz)
- Margem de lucro (%)
- Preço sugerido (calculado)
- Preço de venda real

### Módulo 3: Tela de Produção
- Selecionar produto
- Digitar quantidade
- Gerar lista de materiais
- Imprimir lista

### Módulo 4: Sistema de Pedidos
- Fluxo passo a passo (estilo iFood)
- Upload de imagem
- Cadastro de dados do cliente
- Seleção de data e hora
- Salvar pedido no banco

**Passos:**
1. Produto
2. Tamanho (6, 10, 20, 25 fatias)
3. Sabor (chocolate, red velvet, maracujá, alemão)
4. Desenho/Pintura (texto livre)
5. Imagem de referência (opcional)
6. Dados do cliente (nome, WhatsApp)
7. Retirada (data, hora)
8. Confirmação

### Módulo 5: Dashboard
- Aba: Hoje
- Aba: Amanhã
- Aba: Futuros
- Aba: Tabela
- Aba: Calendário
- Contadores de pedidos
- Status visual (cores)

### Módulo 6: Integração N8N
- Endpoint compatível com N8N
- Estrutura de dados igual ao Notion
- Envio automático de confirmações via WhatsApp

## Out of Scope (Futuro)

### Versão 2.0+
- Controle de estoque em tempo real
- Alertas de estoque mínimo
- Relatórios financeiros detalhados
- Interface para clientes fazerem pedidos
- Login de múltiplos usuários
- Controle de pagamentos
- Notificações push
