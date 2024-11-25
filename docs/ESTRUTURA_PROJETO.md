# Estrutura do Projeto - Sistema de Gestão de Atendimentos

## 1. Modelo de Dados (Supabase)

### Tabelas Principais

#### users (Responsáveis/Atendentes)
```sql
- id: uuid (PK)
- email: text (unique)
- name: text
- role: enum ('admin', 'attendant')
- phone: text
- active: boolean
- created_at: timestamp
- updated_at: timestamp
```

#### customers (Clientes)
```sql
- id: uuid (PK)
- name: text
- email: text
- phone: text
- address: text
- active: boolean
- created_at: timestamp
- updated_at: timestamp
```

#### attendances (Atendimentos)
```sql
- id: uuid (PK)
- customer_id: uuid (FK)
- attendant_id: uuid (FK)
- title: text
- description: text
- status: enum ('pending', 'in_progress', 'completed', 'cancelled')
- priority: enum ('low', 'medium', 'high')
- start_date: timestamp
- end_date: timestamp
- created_at: timestamp
- updated_at: timestamp
```

#### attendance_history (Histórico)
```sql
- id: uuid (PK)
- attendance_id: uuid (FK)
- user_id: uuid (FK)
- action: text
- description: text
- created_at: timestamp
```

## 2. Estrutura de Diretórios Frontend

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Common/          # Componentes comuns
│   │   ├── Layout/      # Componentes de layout
│   │   ├── Forms/       # Componentes de formulário
│   │   └── UI/          # Componentes de interface
│   ├── Customers/       # Componentes relacionados a clientes
│   ├── Attendances/     # Componentes de atendimentos
│   └── Dashboard/       # Componentes do dashboard
├── pages/               # Páginas da aplicação
├── services/           # Serviços e integrações
├── hooks/              # Hooks personalizados
├── utils/              # Funções utilitárias
├── types/              # Definições de tipos
└── styles/             # Estilos globais
```

## 3. Principais Componentes

### Common
- `Layout/MainLayout`: Layout principal com menu e header
- `Forms/InputField`: Campo de entrada padronizado
- `UI/LoadingSpinner`: Indicador de carregamento
- `UI/ErrorMessage`: Mensagem de erro padronizada
- `UI/ConfirmDialog`: Diálogo de confirmação

### Customers
- `CustomerList`: Lista de clientes
- `CustomerForm`: Formulário de cliente
- `CustomerDetails`: Detalhes do cliente

### Attendances
- `AttendanceList`: Lista de atendimentos
- `AttendanceForm`: Formulário de atendimento
- `AttendanceDetails`: Detalhes do atendimento
- `AttendanceHistory`: Histórico do atendimento
- `AttendanceStatusBadge`: Badge de status

### Dashboard
- `AttendanceStats`: Estatísticas gerais
- `RecentAttendances`: Atendimentos recentes
- `PriorityDistribution`: Gráfico de distribuição por prioridade
- `AttendantPerformance`: Desempenho dos atendentes

## 4. Páginas Principais

- `/`: Dashboard
- `/customers`: Lista de clientes
- `/customers/new`: Novo cliente
- `/customers/:id`: Detalhes do cliente
- `/attendances`: Lista de atendimentos
- `/attendances/new`: Novo atendimento
- `/attendances/:id`: Detalhes do atendimento
- `/profile`: Perfil do usuário
- `/settings`: Configurações (admin)

## 5. Funcionalidades por Perfil

### Admin
- Gerenciar usuários/atendentes
- Visualizar todas as estatísticas
- Configurar parâmetros do sistema
- Todas as funcionalidades do atendente

### Atendente
- Gerenciar seus atendimentos
- Visualizar e cadastrar clientes
- Registrar histórico de atendimentos
- Visualizar suas estatísticas

## 6. Integrações

### Supabase
- Autenticação de usuários
- Armazenamento de dados
- Políticas de segurança (RLS)
- Triggers para histórico

### Funcionalidades Adicionais
- Notificações em tempo real
- Exportação de relatórios
- Upload de arquivos
- Filtros avançados

## 7. Fluxos Principais

### Atendimento
1. Cliente é cadastrado/selecionado
2. Atendimento é criado e atribuído
3. Atendente atualiza status e histórico
4. Atendimento é finalizado
5. Histórico é registrado

### Dashboard
1. Carrega estatísticas gerais
2. Atualiza em tempo real
3. Permite filtros por período
4. Exporta relatórios

## 8. Considerações Técnicas

### Performance
- Paginação nas listas
- Cache com React Query
- Otimização de consultas

### Segurança
- Autenticação JWT
- Políticas RLS no Supabase
- Validação de dados

### UX/UI
- Interface responsiva
- Feedback visual de ações
- Temas claro/escuro
- Loading states
