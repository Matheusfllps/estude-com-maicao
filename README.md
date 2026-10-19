# Estude com Maicão

Plataforma de mentoria para concursos militares e policiais: landing page, área do aluno e painel do administrador.

O projeto está disponível em **dois formatos**:

| Arquivo | Descrição |
| --- | --- |
| `plataforma.html` | **Arquivo único** (recomendado). HTML + CSS + JavaScript embutidos, com as 4 telas (landing, login, área do aluno e painel do admin). Basta abrir no navegador ou hospedar. |
| `index.html`, `matricula.html`, `aluno.html`, `admin.html`, `app.js`, `style.css` | Versão original multi-página, com os arquivos separados. |

## Como usar

1. Abra `plataforma.html` no navegador (duplo clique) — ou hospede e compartilhe o link.
2. A primeira tela é a landing page da mentoria.
3. Clique em **Já sou aluno** para entrar.

### Acesso de demonstração do administrador

```
login: admin
senha: admin123
```

> Troque a senha do administrador em *Painel → Minha senha* antes de usar de verdade.

## Funcionalidades

**Landing page**
- Hero com chamada para o WhatsApp, explicação da mentoria, matérias, o que está incluso, prova social de público-alvo, FAQ e CTA final.
- Menu com âncoras, layout responsivo e botão flutuante de WhatsApp.

**Área do aluno**
- Login por perfil (aluno/administrador) com senha.
- Estatísticas (pastas, conteúdos, novidades), busca por título.
- Pastas de estudo e abertura de links ou arquivos publicados pelo mentor.

**Painel do administrador**
- Indicadores de alunos, acessos ativos, bloqueados, pastas e conteúdos.
- Cadastro de alunos, bloqueio/liberação de acesso, nova senha e exclusão.
- Criação de pastas e publicação de conteúdo por link ou envio de arquivo (arrastar e soltar).

## Configuração

No topo do `<script>` de `plataforma.html`:

```js
const ZAP = '5538991000195';        // WhatsApp da mentoria (formato: 55 + DDD + número)
const CFG = {
  wa: 'https://wa.me/' + ZAP + '?text=' + encodeURIComponent('Quero fazer parte da tropa'),
  video: ''                          // ex.: 'https://www.youtube.com/embed/ID_DO_VIDEO'
};
```

## Onde os dados são salvos

Tudo é salvo **no navegador de quem usa** (`localStorage` + `IndexedDB`):

- alunos, pastas, conteúdos e senhas: `localStorage`
- arquivos enviados pelo admin: `IndexedDB`

Isso significa que cada dispositivo tem a sua própria base. Para alunos e mentor compartilharem os mesmos dados, é necessário um backend (Supabase, Firebase, etc.).

Se o navegador bloquear o armazenamento (situação comum ao abrir o arquivo direto no iPhone), a plataforma continua funcionando com memória temporária — os dados apenas não ficam salvos ao fechar.

## Publicar (hosting)

O arquivo é 100% autônomo (as fontes do Google são apenas um enfeite, com fallback para as fontes do sistema). Algumas opções gratuitas:

- **Netlify Drop**: arraste `plataforma.html` em `app.netlify.com/drop`.
- **GitHub Pages** (requer repositório público no plano gratuito): *Settings → Pages → Deploy from branch → main / root*. O endereço fica `https://matheusfllps.github.io/estude-com-maicao/plataforma.html`.
- **Cloudflare Pages** ou **Vercel**: mesma ideia.

> **WhatsApp no iPhone:** o arquivo `.html` enviado como anexo abre no visualizador do WhatsApp, que **não executa JavaScript**. Para o link funcionar no celular, compartilhe a **URL publicada**, e não o arquivo.

## Estrutura

```
plataforma.html      arquivo único (landing + login + aluno + admin)
index.html           login (versão original)
matricula.html       landing page (versão original)
aluno.html           área do aluno (versão original)
admin.html           painel do administrador (versão original)
app.js               lógica da versão original
style.css            estilos da versão original
```
