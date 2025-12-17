// módulos Js
import { setupCurrencyMask, setupCNPJMask } from '../common/format.js';

/*
  --------------------------------------------------------------------------------------
  Formulário para inserir nova Faturas de Recebimento
  --------------------------------------------------------------------------------------
*/

export function initializeReceiptInvoiceForm() {
  console.log('🏢 Initializing receipt invoice form...');

  // Encontra o forulário
  const form = document.getElementById('receipt-invoice-form');
  
  if (!form) {
      console.warn('⚠️ Receipt Invoice form not found on page');
      return;
  }
  
  console.log('✅ Receipt Invoice form found, setting up...');

  // formatação para o formulário de valor
  setupCurrencyMask('newReceiptInvoiceValue');
  setupCNPJMask('NewReceiptInvoiceCNPJ');
  
  // Lógica do formulário
  form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Form submitted!');

      newReceiptInvoiceItem();
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com invoice, descrição, valor e data de recebimento 
  --------------------------------------------------------------------------------------
*/

const newReceiptInvoiceItem = async (number, cnpj, value, receipt_date) => {
  const inputReceiptInvoice = document.getElementById("NewReceiptInvoice").value.trim();
  const inputReceiptInvoiceCNPJ = document.getElementById("NewReceiptInvoiceCNPJ").value.trim();
  let inputReceiptInvoiceValue = document.getElementById("newReceiptInvoiceValue").value.trim();
  const inputReceiptInvoiceReceiptDate = document.getElementById("newReceiptInvoiceReceiptDate").value.trim();

  if (!inputReceiptInvoice) {
    alert("Escreva o código da fatura!");
    return;
  }

  if (!inputReceiptInvoiceCNPJ) {
    alert("Escreva o CNPJ da empresa!");
    return;
  }

  if (!inputReceiptInvoiceValue) {
    alert("Valor precisa ser um número válido!");
    return;
  }

  if (!inputReceiptInvoiceReceiptDate) {
    alert("Insira uma data de recebimento válida!");
    return;
  }

  // troca "," por "." no inputValue converte-o de string para float
  inputReceiptInvoiceValue = inputReceiptInvoiceValue.replace('.', '').replace(',', '.').replace('R$','');
  const inputFloatValue = parseFloat(inputReceiptInvoiceValue);

  try {
    await postReceiptInvoice(inputReceiptInvoice, inputReceiptInvoiceCNPJ, inputFloatValue, inputReceiptInvoiceReceiptDate)
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

const postReceiptInvoice = async (inputReceiptInvoice, inputReceiptInvoiceCNPJ, inputReceiptValue, inputReceiptDate) => {

  const formData = new FormData();
  formData.append('ReceiptInvoiceNumber', inputReceiptInvoice);
  formData.append('ReceiptInvoiceCompanyCNPJ', inputReceiptInvoiceCNPJ);
  formData.append('ReceiptValue', inputReceiptValue);
  formData.append('ReceiptInvoiceReceiptDate', inputReceiptDate);

  let url = 'http://localhost:5000/addReceiptInvoice';

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