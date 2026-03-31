# DevDoubt Tracker

## Descrição do Problema Resolvido

O DevDoubt Tracker é uma aplicação web para organizar e rastrear dúvidas de estudo. Permite aos usuários criar, gerenciar e filtrar dúvidas por matéria, status e prioridade, facilitando o acompanhamento do progresso nos estudos e a resolução de questões pendentes.

## Tecnologias Usadas

- **Frontend**: React 19 com TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend Simulado**: JSON Server
- **Linting**: ESLint com TypeScript
- **Outros**: PostCSS, Autoprefixer

## Instruções para Rodar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd organizador-estudos
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

### Execução

1. Inicie o servidor JSON (backend simulado):
   ```bash
   npm run server
   ```
   O servidor estará rodando em `http://localhost:3001`.

2. Em outro terminal, inicie o frontend:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

### Build para Produção

1. **Publicar (ou iniciar)** sua API (JSON Server ou serviço real) antes de servir o frontend. Isso garante que o frontend tenha acesso à API e evite erros de conexão.

   - Para JSON Server local:
     ```bash
     npm run server
     ```
   - Para API em nuvem (Heroku, Vercel, etc): confirme que o endpoint está ativo.

2. Em seguida, rode o build e preview do frontend:
   ```bash
   npm run build
   npm run preview
   ```

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run server`: Inicia o JSON Server
- `npm run build`: Compila o projeto para produção
- `npm run lint`: Executa o linter
- `npm run preview`: Visualiza o build de produção
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
