# Front-end

Esta front tem como objetivo a gestão de faturas de recebimento e pagamento.

Tem como funcionalidade das páginas:

    - inclusão de faturas de pagamento (utilizando a API: http://localhost:5000/addPaymentInvoice  método: post);
    - inclusão de faturas de recebimento (utilizando a API: http://localhost:5000/addReceiptInvoice  método: post);
    - inclusão de empresas (utilizando a API: http://localhost:5000/addCompany  método: post);
    - busca de logradouro, bairro e UF a partir do CEP, utilizando a API dos Correios (ViaCEP) (utilizando a API: http://localhost:5000/getCEPInformation  método: get);
    - busca por faturas de pagamento a partir de um sistema de filtros (utilizando a API: http://localhost:5000/getPaymentInvoicesByFilters  método: get);
    - busca por faturas de recebimento a partir de um sistema de filtros (utilizando a API: http://localhost:5000/getReceiptInvoicesByFilters  método: get);
    - busca por empresas a partir de um sistema de filtros (utilizando a API: http://localhost:5000/getCompaniesByFilters  método: get);
    - alteração do estado de faturas de pagamento (aberto -> fechado) (utilizando a API: http://localhost:5000/markPaymentInvoicePaid  método: patch);
    - alteração do estado de faturas de recebimento (aberto -> fechado) (utilizando a API: http://localhost:5000/markReceiptInvoicePaid  método: patch);
    - exclusão de faturas de pagamento (utilizando a API: http://localhost:5000/deletePaymentInvoice  método: delete);
    - exclusão de faturas de recebimento (utilizando a API: http://localhost:5000/deleteReceiptInvoice  método: delete);
    - exclusão de empresas (utilizando a API: http://localhost:5000/deleteCompany  método: delete);

Fluxograma do sistema:

![fluxograma](/fluxogramas/arquitetura_aplicação.png)

---

## Como executar 

Certifique-se de ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile no terminal e seus arquivos de aplicação e Execute como administrador o seguinte comando para construir a imagem Docker:

$ docker build -t front .
Uma vez criada a imagem, para executar o container basta executar, como administrador, seguinte o comando:

$ docker run -d -p 8080:80 front
Uma vez executando, para acessar o front-end, basta abrir o http://localhost:8080/#/ no navegador.