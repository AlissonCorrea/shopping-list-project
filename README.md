# Shopping List Project

Este é um projeto que utiliza CDK e TypeScript.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado em sua máquina:

- Node.js (versão X.X.X)
- AWS CLI configurada com suas credenciais de acesso

## Configuração

1. Clone o repositório para sua máquina local:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   
2. Acesse o diretório do projeto:

   ```bash
   cd shopping-list-project
   
3. Instale as dependências do projeto:

   ```bash
   npm install

4. Crie um arquivo .env na raiz do projeto e defina as seguintes variáveis de ambiente:

   ```bash
   ACCOUNT=XXXXXXXXXXXX
   REGION=XXXXXXXX
   ```
  
## Implantação

1. Execute o seguinte comando para implantar o serviço:

   ```bash
   cdk deploy
   ```
   
   O CDK criará e implantará os recursos necessários na AWS com base nas configurações fornecidas.
   
2. Após a implantação ser concluída, verifique o console para obter as informações relevantes sobre o serviço implantado.
