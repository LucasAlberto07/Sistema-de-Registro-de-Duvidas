# Mini PRD - DevDoubt Tracker
## Rastreador de Dúvidas para Desenvolvedores

---

## 1. PROBLEMA

### Qual problema específico você está resolvendo?

Desenvolvedores que estudam Cloud Computing e React enfrentam um problema recorrente: **dúvidas surgem em múltiplos contextos** (vídeos, documentação, projetos práticos, artigos) e são registradas de forma desorganizada no bloco de notas do celular.

O resultado é:
- Dúvidas sem contexto (de onde veio? quando surgiu?)
- Impossível saber quais já foram resolvidas
- Sem priorização (o que precisa resolver urgente vs. o que pode esperar)
- Difícil filtrar por matéria quando está estudando um tópico específico
- Perda de tempo procurando dúvidas antigas em meio a notas diversas

### Por que esse problema vale a pena ser resolvido?

1. **Tempo perdido**: Estudantes gastam tempo procurando dúvidas antigas em blocos de notas desorganizados
2. **Dúvidas esquecidas**: Questões importantes são registradas mas nunca revisitadas
3. **Falta de progresso visível**: Não há forma de ver quantas dúvidas você já resolveu (sensação de avanço)
4. **Contexto perdido**: "Onde eu vi isso mesmo?" - sem referência da fonte, fica difícil voltar ao conteúdo

### Quem é o usuário que sente esse problema?

**Persona Principal**: Desenvolvedor em transição de carreira ou estudante de tecnologia que está estudando simultaneamente:
- Cloud Computing (AWS, Azure, GCP)
- Frontend moderno (React, TypeScript)
- Consome conteúdo de múltiplas fontes (vídeos, docs, projetos, artigos)
- Atualmente usa bloco de notas do celular de forma caótica
- Precisa saber o que perguntar em comunidades/mentores

**Perfil específico**: Eu mesmo - estudando Cloud e React, com dúvidas surgindo em vídeoaulas, documentação oficial, projetos práticos e artigos técnicos.

---

## 2. SOLUÇÃO

### Funcionalidades Essenciais

Cada funcionalidade abaixo foi pensada para resolver uma dor específica:

#### 2.1 Registrar Dúvida com Contexto
**Por quê é essencial**: Sem contexto, a dúvida perde valor. "Como funciona IAM?" sem saber de onde veio é inútil.

**O que faz**:
- Título curto da dúvida
- Descrição detalhada
- Fonte (videoaula, docs, projeto, artigo)
- Matéria (Cloud, React, TypeScript, etc)
- Prioridade (preciso resolver urgente? pode esperar?)
- Data/hora automática

**Se eu tirar essa funcionalidade, a solução ainda resolve o problema?** ❌ NÃO. É o core.

#### 2.2 Visualizar Dúvidas Organizadas
**Por quê é essencial**: A desorganização é o problema principal. Ver tudo em lista caótica não resolve nada.

**O que faz**:
- Lista de dúvidas agrupadas por status (Pendente, Resolvida, Preciso Perguntar)
- Filtro por matéria
- Indicador visual de prioridade
- Contador de dúvidas pendentes vs resolvidas

**Se eu tirar essa funcionalidade, a solução ainda resolve o problema?** ❌ NÃO. Sem organização, volta ao caos do bloco de notas.

#### 2.3 Marcar Dúvida como Resolvida
**Por quê é essencial**: Sem saber o que já foi resolvido, o sistema não tem utilidade real.

**O que faz**:
- Mudar status de "Pendente" para "Resolvida"
- Opcionalmente registrar COMO foi resolvida (útil para revisão futura)
- Registrar data de resolução
- Dúvida sai da lista de pendentes

**Se eu tirar essa funcionalidade, a solução ainda resolve o problema?** ❌ NÃO. Sem marcar como resolvida, vira apenas um acumulador de dúvidas.

#### 2.4 Deletar Dúvida
**Por quê é essencial**: Às vezes a dúvida perde relevância (mudou de foco, descobriu que não precisa daquilo).

**O que faz**:
- Remover dúvida permanentemente
- Pedir confirmação antes (evitar deleção acidental)

**Se eu tirar essa funcionalidade, a solução ainda resolve o problema?** ⚠️ SIM, mas ficaria poluído. Sem deletar, dúvidas irrelevantes ficam acumulando.

#### 2.5 Gerenciar Matérias
**Por quê é essencial**: Precisa cadastrar as matérias que está estudando para categorizar corretamente.

**O que faz**:
- Criar nova matéria (nome + cor)
- Visualizar matérias cadastradas
- Usar matérias ao criar dúvidas

**Se eu tirar essa funcionalidade, a solução ainda resolve o problema?** ⚠️ SIM, se tivesse matérias fixas. Mas adicionar dinamicamente melhora muito a UX.

---

## 3. DECISÕES TÉCNICAS

### 3.1 Estrutura da API

A API usa json-server e expõe 2 entidades principais:

#### Endpoint: `/doubts`

**Estrutura da entidade:**
```typescript
interface Doubt {
  id: string;
  title: string;
  description: string;
  subject: string; // Relacionamento com subjects (por nome)
  status: 'pending' | 'resolved' | 'asked';
  priority: 'low' | 'medium' | 'high';
  source: string; // De onde veio a dúvida
  createdAt: string; // ISO timestamp
  resolvedAt: string | null;
  resolution: string | null; // Como foi resolvida
}
```

**Operações necessárias:**
- `GET /doubts` - Listar todas as dúvidas (usado na tela principal)
- `POST /doubts` - Criar nova dúvida (formulário de cadastro)
- `PATCH /doubts/:id` - Atualizar status/resolução (marcar como resolvida)
- `DELETE /doubts/:id` - Remover dúvida (botão de deletar)

#### Endpoint: `/subjects`

**Estrutura da entidade:**
```typescript
interface Subject {
  id: string;
  name: string;
  color: string; // Hex color para UI
}
```

**Operações necessárias:**
- `GET /subjects` - Listar matérias (dropdown no formulário)
- `POST /subjects` - Criar nova matéria (modal de adicionar matéria)

### 3.2 Por que essas operações?

| Operação | Justificativa |
|----------|---------------|
| **GET /doubts** | Preciso exibir todas as dúvidas na interface, com possibilidade de filtrar por status/matéria no frontend |
| **POST /doubts** | Usuário precisa registrar novas dúvidas com todos os campos necessários |
| **PATCH /doubts/:id** | Quando resolve uma dúvida, preciso atualizar apenas status, resolvedAt e resolution (PATCH é melhor que PUT pois não substitui o objeto inteiro) |
| **DELETE /doubts/:id** | Quando uma dúvida perde relevância, precisa ser removida permanentemente |
| **GET /subjects** | Preciso listar matérias disponíveis no dropdown ao criar dúvida |
| **POST /subjects** | Usuário pode adicionar novas matérias dinamicamente conforme começa a estudar novos tópicos |

### 3.3 Por que NÃO usar PUT/PATCH em subjects?

Matérias são dados de referência simples. Uma vez criadas, raramente precisam ser editadas ou deletadas. Se o usuário quiser "renomear" uma matéria, é melhor criar uma nova e eventualmente deletar dúvidas antigas da matéria obsoleta.

---

## 4. FORA DO ESCOPO

O que **NÃO** será implementado nesta versão (e por quê):

-  **Sistema de tags**: Matérias já resolvem a categorização básica
-  **Busca por texto**: Com filtros por matéria e status, já dá pra encontrar dúvidas
-  **Integração com Discord/Slack**: Não resolve o problema core
-  **Sistema de lembretes**: Foco é organização, não notificações
-  **Estatísticas complexas**: Um contador simples já mostra progresso
-  **Edição de dúvidas**: Se errou, deleta e cria nova (mais simples)

---

## 5. CRITÉRIOS DE SUCESSO

Como saber se a solução funciona?

1.  Consigo registrar uma dúvida em menos de 30 segundos
2.  Vejo claramente quantas dúvidas tenho pendentes vs resolvidas
3.  Consigo filtrar dúvidas de React quando estou estudando React
4.  Quando resolvo uma dúvida, ela sai da lista de pendentes imediatamente
5.  Sei de onde veio cada dúvida (fonte registrada)
6.  Vejo quais dúvidas são prioridade alta vs baixa

---

## 6. PRÓXIMOS PASSOS (Futuro)

Se tivesse mais tempo, adicionaria:

1. **Exportar dúvidas pendentes** (para levar numa mentoria)
2. **Estatísticas semanais** (quantas dúvidas resolvi essa semana)
3. **Modo "sessão de estudos"** (marcar várias dúvidas como resolvidas de uma vez)
4. **Busca por texto** na descrição das dúvidas
5. **Links externos** (anexar link da doc/vídeo onde surgiu a dúvida)
