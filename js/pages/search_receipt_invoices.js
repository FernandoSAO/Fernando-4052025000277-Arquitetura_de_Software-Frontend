/*
  --------------------------------------------------------------------------------------
  Página de busca de faturas de recebimento com sistema de filtros (inicia com todas as faturas abertas)
  --------------------------------------------------------------------------------------
*/

export function initializeSearchReceiptInvoicesForm() {
    console.log('🏢 Initializing receipt invoice form...');

    // Encontra o formulário
    const form = document.getElementById('search-receipt-invoices-form');
    
    if (!form) {
        console.warn('⚠️ Search Receipt Invoice form not found on page');
        return;
    }
    
    console.log('✅ Receipt Invoice form found, setting up...');
    
    // Lógica do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        newSearchReceiptInvoiceItem();
    });

    newSearchReceiptInvoiceItem();
}

/*
  --------------------------------------------------------------------------------------
  Função para filtragem da tabela de faturas de recebimento
  --------------------------------------------------------------------------------------
*/

const newSearchReceiptInvoiceItem = async () => {

  const inputSearchReceiptInvoice = document.getElementById("SearchReceiptInvoice").value.trim();
  const inputSearchReceiptInvoiceCNPJ = document.getElementById("SearchReceiptInvoiceCNPJ").value.trim();
  const inputSearchReceiptInvoiceStatus = document.getElementById("SearchReceiptInvoiceStatus").value.trim();


  if (!inputSearchReceiptInvoiceStatus) {
    alert("Erro no status!");
    return;
  }

  try {
    const invoices = await getReceiptInvoicesList(inputSearchReceiptInvoice, inputSearchReceiptInvoiceCNPJ, inputSearchReceiptInvoiceStatus)
    renderReceiptInvoices(invoices);
    alert("Items procurados!")
  } catch (error) {
    alert(`Erro: ${error.message}`);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

const getReceiptInvoicesList = async (number, cnpj, status) => {

    // Monta os query dos parametros
    const params = new URLSearchParams();

    if (number) params.append("ReceiptInvoiceNumber", number);
    if (cnpj) params.append("ReceiptInvoiceCompanyCNPJ", cnpj);
    if (status) params.append("ReceiptInvoiceStatus", status);

    const url = `http://localhost:5000/getReceiptInvoicesByFilters?${params.toString()}`;

    try {

      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
          throw new Error(`Erro ao buscar faturas: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data.receipt_invoices)) {

        return data.receipt_invoices ?? [];

      } else {
          console.warn('Resposta inesperada do backend:', data);
      }
    } catch (error) {
    console.error('Erro:', error);
    }
};

/*
  --------------------------------------------------------------------------------------
  Função que cria a tabela de faturas. Dá refresh para cada busca. Adiciona funcionalidade para os botões Delete e Pago
  --------------------------------------------------------------------------------------
*/

function renderReceiptInvoices(invoices) {

  const tbody = document.getElementById("receipt-table-body");

  // limpa antes de preencher novamente
  tbody.innerHTML = "";

  if (!Array.isArray(invoices) || invoices.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" style="text-align:center">Nenhuma fatura encontrada</td>`;
    tbody.appendChild(tr);
    return;
  }

  invoices.forEach(inv => {
      
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${inv.ReceiptInvoiceNumber}</td>
        <td>${inv.ReceiptInvoiceCompanyCNPJ}</td>
        <td>R$ ${inv.ReceiptValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
        <td>${inv.ReceiptInvoiceReceiptDate}</td>
        <td>${inv.ReceiptInvoiceStatus}</td>
        <td class="action-column">
            <button class="paid-btn" data-number="${inv.ReceiptInvoiceNumber}" data-cnpj="${inv.ReceiptInvoiceCompanyCNPJ}">Pago</button>
            <button class="delete-btn" data-number="${inv.ReceiptInvoiceNumber}" data-cnpj="${inv.ReceiptInvoiceCompanyCNPJ}">Delete</button>
        </td>
    `;

      tbody.appendChild(tr);
  });

  // adiciona evento aos botões delete
  const deleteButtons = tbody.querySelectorAll('.delete-btn');
  deleteButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
          const number = btn.dataset.number;
          const cnpj = btn.dataset.cnpj;

          // Confirmação antes de deletar
          if (!confirm(`Deseja realmente deletar a fatura ${number} da empresa ${cnpj}?`)) return;

          try {
              await deleteReceiptInvoice(number, cnpj);
              alert("Fatura deletada!");
              // Recarrega a tabela
              newSearchReceiptInvoiceItem();
          } catch (error) {
              alert(`Erro ao deletar fatura: ${error.message}`);
          }
      });
  });

  // adiciona evento aos botões pago
  const paidButtons = tbody.querySelectorAll('.paid-btn');
  paidButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
          const number = btn.dataset.number;
          const cnpj = btn.dataset.cnpj;

          // Confirmação antes de deletar
          if (!confirm(`Deseja realmente marcar a fatura ${number} da empresa ${cnpj}? como paga`)) return;

          try {
              await paidReceiptInvoice(number, cnpj);
              alert("Fatura paga!");
              // Recarrega a tabela
              newSearchReceiptInvoiceItem();
          } catch (error) {
              alert(`Erro ao marcar a fatura como paga: ${error.message}`);
          }
      });
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar fatura via requisição Delete
  --------------------------------------------------------------------------------------
*/

async function deleteReceiptInvoice(number, cnpj) {

    const params = new URLSearchParams({ ReceiptInvoiceNumber: number, ReceiptInvoiceCompanyCNPJ: cnpj });

    const response = await fetch(`http://localhost:5000/deleteReceiptInvoice?${params.toString()}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || 'Erro ao deletar fatura');
    }

    return true;
}

/*
  --------------------------------------------------------------------------------------
  Função para dar a fatura como paga via requisição Delete
  --------------------------------------------------------------------------------------
*/

async function paidReceiptInvoice(number, cnpj) {

    const params = new URLSearchParams({ ReceiptInvoiceNumber: number, ReceiptInvoiceCompanyCNPJ: cnpj });

    const response = await fetch(`http://localhost:5000/markReceiptInvoicePaid?${params.toString()}`, {
        method: 'PATCH'
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || 'Erro ao dar a fatura como paga');
    }

    return true;
}