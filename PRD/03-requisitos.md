# PRD - Requisitos

## Requisitos Funcionais

### RF-001: Cadastro de Insumos
- O sistema deve permitir cadastrar insumos com descrição, unidade e preço
- O sistema deve permitir editar insumos existentes
- O sistema deve permitir excluir insumos
- O sistema deve permitir buscar insumos por nome

### RF-002: Cadastro de Produtos
- O sistema deve permitir cadastrar produtos com nome e descrição
- O sistema deve permitir adicionar insumos à receita do produto
- O sistema deve calcular automaticamente o custo total do produto
- O sistema deve calcular o preço sugerido com base na margem de lucro
- O sistema deve permitir definir custos fixos mensais rateados

### RF-003: Tela de Produção
- O sistema deve permitir selecionar um produto cadastrado
- O sistema deve permitir digitar a quantidade a produzir
- O sistema deve gerar lista de materiais multiplicando a receita
- O sistema deve permitir imprimir a lista de materiais

### RF-004: Sistema de Pedidos
- O sistema deve guiar o usuário por um fluxo de 8 passos
- O sistema deve permitir upload de imagem
- O sistema deve validar dados obrigatórios
- O sistema deve salvar o pedido no banco de dados
- O sistema deve gerar um ID único para cada pedido

### RF-005: Dashboard
- O sistema deve exibir pedidos organizados por data (hoje, amanhã, futuros)
- O sistema deve permitir visualização em tabela
- O sistema deve permitir visualização em calendário
- O sistema deve mostrar status dos pedidos com cores diferentes
- O sistema deve exibir contadores de pedidos

### RF-006: Integração N8N
- O sistema deve expor um endpoint REST compatível com N8N
- O endpoint deve retornar pedidos com status "pendente"
- A estrutura de dados deve ser compatível com o fluxo atual do N8N

## Requisitos Não Funcionais

### RNF-001: Performance
- Carregamento de páginas em menos de 2 segundos
- Resposta de API em menos de 500ms

### RNF-002: Usabilidade
- Interface intuitiva para usuários não técnicos
- Fluxo de pedidos com no máximo 8 passos
- Mensagens de erro claras e objetivas

### RNF-003: Segurança
- Autenticação obrigatória para acessar o sistema
- Dados sensíveis criptografados
- Backup automático do banco de dados

### RNF-004: Disponibilidade
- Sistema disponível 99% do tempo
- Deploy automático em ambiente de produção

## Requisitos Técnicos

### RT-001: Frontend
- Framework: React + Vite
- UI Library: Shadcn/ui
- Roteamento: React Router
- Estado: Zustand ou Context API

### RT-002: Backend
- Banco de Dados: **AINDA A DECIDIR**
- Autenticação: **AINDA A DECIDIR**
- Storage: **AINDA A DECIDIR**
- API: **AINDA A DECIDIR**

### RT-003: Infraestrutura
- Hosting: **AINDA A DECIDIR**
- CI/CD: GitHub Actions
- Monitoramento: **AINDA A DECIDIR**
