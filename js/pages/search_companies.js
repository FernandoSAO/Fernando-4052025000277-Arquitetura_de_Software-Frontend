/*
  --------------------------------------------------------------------------------------
  Página de busca de empresas com sistema de filtros
  --------------------------------------------------------------------------------------
*/

export function initializeSearchCompaniesForm() {
    console.log('🏢 Initializing company form...');

    // Encontra formulário
    const form = document.getElementById('search-companies-form');
    
    if (!form) {
        console.warn('⚠️ Search Company form not found on page');
        return;
    }
    
    console.log('✅ Company form found, setting up...');
    
    // Lógica do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        newSearchCompanyItem();
    });

    newSearchCompanyItem();
}

/*
  --------------------------------------------------------------------------------------
  Função para filtragem da tabela de empresas
  --------------------------------------------------------------------------------------
*/

const newSearchCompanyItem = async () => {

  const inputSearchCompany = document.getElementById("SearchCompanyCNPJ").value.trim();
  const inputSearchCompanyTradeName = document.getElementById("SearchCompanyTradeName").value.trim();
  const inputSearchCompanyCorporateName = document.getElementById("SearchCompanyCorporateName").value.trim();

  try {
    const companies = await getCompanysList(inputSearchCompany, inputSearchCompanyTradeName, inputSearchCompanyCorporateName)
    renderCompanys(companies);
    alert("Empresas procuradas!")
  } catch (error) {
    alert(`Erro: ${error.message}`);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

const getCompanysList = async (cnpj, nome_fantasia, razão_social) => {

    // Monta os query dos parametros
    const params = new URLSearchParams();

    if (cnpj) params.append("CompanyCNPJ", cnpj);
    if (nome_fantasia) params.append("CompanyTradeName", nome_fantasia);
    if (razão_social) params.append("CompanyCorporateName", razão_social);

    const url = `http://localhost:5000/getCompaniesByFilters?${params.toString()}`;

    try {

      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
          throw new Error(`Erro ao buscar empresas: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data.companies)) {

        return data.companies ?? [];

      } else {
          console.warn('Resposta inesperada do backend:', data);
      }

    } catch (error) {
    console.error('Erro:', error);
    }
};

/*
  --------------------------------------------------------------------------------------
  Função que cria a tabela de empresas. Dá refresh para cada busca. Adiciona funcionalidade para os botão Delete
  --------------------------------------------------------------------------------------
*/

function renderCompanys(companies) {

  const tbody = document.getElementById("company-table-body");

  // limpa antes de preencher novamente
  tbody.innerHTML = "";

  if (!Array.isArray(companies) || companies.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="6" style="text-align:center">Nenhuma empresa encontrada</td>`;
      tbody.appendChild(tr);
      return;
  }

  companies.forEach(com => {
      
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${com.CompanyCNPJ}</td>
        <td>${com.CompanyCorporateName}</td>
        <td>${com.CompanyTradeName}</td>
        <td>${com.PaymentInvoiceCount}</td>
        <td>${com.ReceiptInvoiceCount}</td>
        <td class="action-column">
            <button class="delete-btn" data-cnpj="${com.CompanyCNPJ}" data-name="${com.CompanyTradeName}">Delete</button>
        </td>
    `;

      tbody.appendChild(tr);
  });

  // adiciona evento aos botões delete
  const deleteButtons = tbody.querySelectorAll('.delete-btn');
  deleteButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
          const name = btn.dataset.name;
          const cnpj = btn.dataset.cnpj;

          // Confirmação antes de deletar
          if (!confirm(`Deseja realmente remover a empresa ${name} da cnpj ${cnpj}?`)) return;

          try {
              await deleteCompany(cnpj);
              alert("Fatura deletada!");
              // Recarrega a tabela
              newSearchCompanyItem();
          } catch (error) {
              alert(`Erro ao deletar fatura: ${error.message}`);
          }
      });
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar empresa via requisição Delete
  --------------------------------------------------------------------------------------
*/

async function deleteCompany(cnpj) {

    const params = new URLSearchParams({ CompanyCNPJ: cnpj });

    const response = await fetch(`http://localhost:5000/deleteCompany?${params.toString()}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || 'Erro ao deletar empresa');
    }

    return true;
}