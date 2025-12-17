// módulos Js
import { setupCurrencyMask, setupCNPJMask } from '../common/format.js';

/*
  --------------------------------------------------------------------------------------
  Formulário para inserir nova Faturas de Pagamento
  --------------------------------------------------------------------------------------
*/

export function initializePaymentInvoiceForm() {
  console.log('🏢 Initializing payment invoice form...');

  // encontra o formulário
  const form = document.getElementById('payment-invoice-form');
  
  if (!form) {
      console.warn('⚠️ Payment Invoice form not found on page');
      return;
  }
  
  console.log('✅ Payment Invoice form found, setting up...');
  
  // formatação para o formulário de valor
  setupCurrencyMask('newPaymentInvoiceValue');
  setupCNPJMask('NewPaymentInvoiceCNPJ');

  // lógica do formulário
  form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Form submitted!');

      newPaymentInvoiceItem();
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com invoice, descrição, valor e data de pagamento 
  --------------------------------------------------------------------------------------
*/

const newPaymentInvoiceItem = async (number, cnpj, value, payment_date) => {
  const inputPaymentInvoice = document.getElementById("NewPaymentInvoice").value.trim();
  const inputPaymentInvoiceCNPJ = document.getElementById("NewPaymentInvoiceCNPJ").value.trim();
  let inputPaymentInvoiceValue = document.getElementById("newPaymentInvoiceValue").value.trim();
  const inputPaymentInvoicePaymentDate = document.getElementById("newPaymentInvoicePaymentDate").value.trim();

  if (!inputPaymentInvoice) {
    alert("Escreva o código da fatura!");
    return;
  }

  if (!inputPaymentInvoiceCNPJ) {
    alert("Escreva o CNPJ da empresa!");
    return;
  }

  if (!inputPaymentInvoiceValue) {
    alert("Valor precisa ser um número válido!");
    return;
  }

  if (!inputPaymentInvoicePaymentDate) {
    alert("Insira uma data de pagamento válida!");
    return;
  }

  // troca "," por "." no inputValue converte-o de string para float
  inputPaymentInvoiceValue = inputPaymentInvoiceValue.replace(/\./g, '') .replace(',', '.').replace('R$ ','');
  const inputFloatValue = parseFloat(inputPaymentInvoiceValue);

  try {
    await postPaymentInvoice(inputPaymentInvoice, inputPaymentInvoiceCNPJ, inputFloatValue, inputPaymentInvoicePaymentDate)
    alert("Item adicionado!")
  } catch (error) {
    alert(`Erro: ${error.message}`);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para colocar uma fatura na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/

const postPaymentInvoice = async (inputPaymentInvoice, inputPaymentInvoiceCNPJ, inputPaymentValue, inputPaymentDate) => {

  const formData = new FormData();
  formData.append('PaymentInvoiceNumber', inputPaymentInvoice);
  formData.append('PaymentInvoiceCompanyCNPJ', inputPaymentInvoiceCNPJ);
  formData.append('PaymentValue', inputPaymentValue);
  formData.append('PaymentInvoicePaymentDate', inputPaymentDate);

  let url = 'http://localhost:5000/addPaymentInvoice';

  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const backendMessage = data?.message || `${response.status} ${response.statusText}`;
    throw new Error(backendMessage);
  }

  return data;
}