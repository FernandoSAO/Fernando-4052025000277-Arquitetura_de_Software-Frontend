/*
  --------------------------------------------------------------------------------------
  Página de busca de faturas de pagamento com sistema de filtros (inicia com todas as faturas abertas)
  --------------------------------------------------------------------------------------
*/

export function initializeSearchPaymentInvoicesForm() {
    console.log('🏢 Initializing payment invoice form...');

    // Encontra o formulário
    const form = document.getElementById('search-payment-invoices-form');
    
    if (!form) {
        console.warn('⚠️ Search Payment Invoice form not found on page');
        return;
    }
    
    console.log('✅ Payment Invoice form found, setting up...');
    
    // Lógica do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        newSearchPaymentInvoiceItem();
    });

    newSearchPaymentInvoiceItem();
}

/*
  --------------------------------------------------------------------------------------
  Função para filtragem da tabela de faturas de pagamento
  --------------------------------------------------------------------------------------
*/

const newSearchPaymentInvoiceItem = async () => {

  const inputSearchPaymentInvoice = document.getElementById("SearchPaymentInvoice").value.trim();
  const inputSearchPaymentInvoiceCNPJ = document.getElementById("SearchPaymentInvoiceCNPJ").value.trim();
  const inputSearchPaymentInvoiceStatus = document.getElementById("SearchPaymentInvoiceStatus").value.trim();

  if (!inputSearchPaymentInvoiceStatus) {
    alert("Erro no status!");
    return;
  }

  try {
    const invoices = await getPaymentInvoicesList(inputSearchPaymentInvoice, inputSearchPaymentInvoiceCNPJ, inputSearchPaymentInvoiceStatus)
    renderPaymentInvoices(invoices);
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

const getPaymentInvoicesList = async (number, cnpj, status) => {

    // Monta os query dos parametros
    const params = new URLSearchParams();

    if (number) params.append("PaymentInvoiceNumber", number);
    if (cnpj) params.append("PaymentInvoiceCompanyCNPJ", cnpj);
    if (status) params.append("PaymentInvoiceStatus", status);

    const url = `http://localhost:5000/getPaymentInvoicesByFilters?${params.toString()}`;

    try {

      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
          throw new Error(`Erro ao buscar faturas: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data.payment_invoices)) {

        return data.payment_invoices ?? [];

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

function renderPaymentInvoices(invoices) {

  const tbody = document.getElementById("payment-table-body");

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
        <td>${inv.PaymentInvoiceNumber}</td>
        <td>${inv.PaymentInvoiceCompanyCNPJ}</td>
        <td>R$ ${inv.PaymentValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
        <td>${inv.PaymentInvoicePaymentDate}</td>
        <td>${inv.PaymentInvoiceStatus}</td>
        <td class="action-column">
            <button class="paid-btn" data-number="${inv.PaymentInvoiceNumber}" data-cnpj="${inv.PaymentInvoiceCompanyCNPJ}">Pago</button>
            <button class="delete-btn" data-number="${inv.PaymentInvoiceNumber}" data-cnpj="${inv.PaymentInvoiceCompanyCNPJ}">Delete</button>
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
              await deletePaymentInvoice(number, cnpj);
              alert("Fatura deletada!");
              // Recarrega a tabela
              newSearchPaymentInvoiceItem();
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
              await paidPaymentInvoice(number, cnpj);
              alert("Fatura paga!");
              // Recarrega a tabela
              newSearchPaymentInvoiceItem();
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

async function deletePaymentInvoice(number, cnpj) {

    const params = new URLSearchParams({ PaymentInvoiceNumber: number, PaymentInvoiceCompanyCNPJ: cnpj });

    const response = await fetch(`http://localhost:5000/deletePaymentInvoice?${params.toString()}`, {
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

async function paidPaymentInvoice(number, cnpj) {

    const params = new URLSearchParams({ PaymentInvoiceNumber: number, PaymentInvoiceCompanyCNPJ: cnpj });

    const response = await fetch(`http://localhost:5000/markPaymentInvoicePaid?${params.toString()}`, {
        method: 'PATCH'
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || 'Erro ao dar a fatura como paga');
    }

    return true;
}