# Estrutura do Projeto - Sistema de Gestão de Atendimentos com Chakra UI

## 1. Tecnologias Principais

### Frontend
- React com TypeScript
- Chakra UI para interface
- React Query para gerenciamento de dados
- React Router para navegação
- Zustand para gerenciamento de estado global

### Backend
- Supabase para autenticação e banco de dados
- PostgreSQL para armazenamento
- Políticas RLS para segurança

## 2. Componentes Chakra UI Principais

### Layout
```typescript
// Layout principal usando componentes Chakra
- Box (container principal)
- Flex (layout flexível)
- Grid (grid system)
- Container (conteúdo centralizado)
```

### Navegação
```typescript
// Componentes de navegação
- Breadcrumb (navegação hierárquica)
- Tabs (navegação em abas)
- Menu (menus dropdown)
- Drawer (menu lateral responsivo)
```

### Formulários
```typescript
// Componentes de formulário
- Input (campos de texto)
- Select (seleção)
- Checkbox (múltipla escolha)
- Radio (escolha única)
- FormControl (controle de formulário)
- InputGroup (grupo de inputs)
```

### Feedback
```typescript
// Componentes de feedback
- Alert (mensagens de alerta)
- Toast (notificações)
- Progress (progresso)
- Spinner (carregamento)
```

### Dados
```typescript
// Componentes de dados
- Table (tabelas)
- Badge (status)
- Stat (estatísticas)
- Card (cartões de conteúdo)
```

### Modais
```typescript
// Componentes de diálogo
- Modal (janelas modais)
- Popover (popovers)
- Tooltip (dicas)
- AlertDialog (confirmações)
```

## 3. Tema Personalizado

```typescript
// src/styles/theme.ts
import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
    },
    status: {
      pending: '#ff9800',
      inProgress: '#2196f3',
      completed: '#4caf50',
      cancelled: '#f44336'
    }
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand'
      }
    },
    Table: {
      variants: {
        simple: {
          th: {
            borderColor: 'gray.200'
          }
        }
      }
    }
  }
})
```

## 4. Estrutura de Componentes

### Common/Layout
```typescript
// Componentes de layout
- Navbar (usando Flex, Box)
- Sidebar (usando Drawer)
- PageHeader (usando Stack, Heading)
- Footer (usando Box, Stack)
```

### Common/Forms
```typescript
// Componentes de formulário
- FormField (usando FormControl, Input)
- PhoneInput (usando InputGroup, Input)
- AddressForm (usando SimpleGrid, Input)
- SearchInput (usando InputGroup, InputLeftElement)
```

### Customers
```typescript
// Componentes de cliente
- CustomerList (usando Table, Badge)
- CustomerForm (usando Stack, FormField)
- CustomerCard (usando Card, Stack)
```

### Attendances
```typescript
// Componentes de atendimento
- AttendanceList (usando Table, Badge)
- AttendanceForm (usando Stack, FormField)
- AttendanceTimeline (usando Stack, Box)
- StatusBadge (usando Badge)
```

### Dashboard
```typescript
// Componentes do dashboard
- StatCard (usando Stat, Box)
- ChartCard (usando Box, Heading)
- RecentList (usando List, ListItem)
```

## 5. Hooks Personalizados

```typescript
// Hooks para lógica comum
- useToastMessage (notificações)
- useConfirmDialog (confirmações)
- useFormValidation (validação)
- useTableSort (ordenação)
- usePagination (paginação)
```

## 6. Utilitários

```typescript
// Funções utilitárias
- formatPhone (formatação de telefone/celular)
- formatDate (formatação de data)
- validateForm (validação de formulários)
- handleApiError (tratamento de erros)
```

## 7. Considerações de UI/UX

### Responsividade
- Layout adaptativo com Grid e Flex
- Menu lateral colapsável
- Tabelas responsivas
- Formulários adaptáveis

### Acessibilidade
- Contraste adequado
- Labels semânticos
- Navegação por teclado
- Mensagens de erro claras

### Performance
- Lazy loading de componentes
- Paginação de listas
- Otimização de imagens
- Cache de dados

### Feedback
- Loading states
- Mensagens de sucesso/erro
- Confirmações de ações
- Indicadores de progresso
