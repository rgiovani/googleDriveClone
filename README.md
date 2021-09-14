# Google Drive Clone - Semana JS Expert 5.0

Seja bem vindo(a) à quinta Semana Javascript Expert.

Marque esse projeto com uma estrela 🌟

## Preview

![](./resources/demo.gif)

## Checklist Features

- Web API
    - [x] Deve listar arquivos baixados
    - [x] Deve receber stream de arquivos e salvar em disco 
    - [x] Deve notificar sobre progresso de armazenamento de arquivos em disco 
    - [x] Deve permitir upload de arquivos em formato image, video ou audio
    - [x] Deve atingir 100% de cobertura de código em testes

- Web App 
    - [x] Deve listar arquivos baixados
    - [x] Deve permitir fazer upload de arquivos de qualquer tamanho
    - [x] Deve ter função de upload via botão
    - [x] Deve exibir progresso de upload 
    - [x] Deve ter função de upload via drag and drop

## Créditos ao Layout <3

- O Layout foi adaptado a partir do projeto do brasileiro [Leonardo Santo](https://github.com/leoespsanto) disponibilizado no [codepen](https://codepen.io/leoespsanto/pen/KZMMKG). 

## FAQ 
- `NODE_OPTIONS` não é um comando reconhecido pelo sistema, o que fazer?
    - Se você estiver no Windows, a forma de criar variáveis de ambiente é diferente. Você deve usar a palavra `set` antes do comando. 
    - Ex: `    "test": "set NODE_OPTIONS=--experimental-vm-modules && npx jest --runInBand",`

- Certificado SSL é inválido, o que fazer?
    - Esse erro acontece porque gerei um certificado atrelado ao usuário da minha máquina.
    - Você pode clicar em prosseguir no browser e usar o certificado invalido que o projeto vai continuar funcionando.
- Rodei `npm test` mas nada acontece, o que fazer?
    - Verifique a versão do seu Node.js. Estamos usando na versão 16.8. Entre no [site do node.js](https://nodejs.org) e baixe a versão mais recente.