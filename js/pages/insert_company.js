// módulos Js
import { setupPhoneMask, setupCNPJMask } from '../common/format.js';

/*
  --------------------------------------------------------------------------------------
  Formulário para inserir nova empresa
  --------------------------------------------------------------------------------------
*/

export function initializeCompanyForm() {
    console.log('🏢 Inicializando o formulário da empresa...');
    
    // Encontra o formulário
    const form = document.getElementById('company-form');
    
    if (!form) {
        console.warn('⚠️ Company form not found on page');
        return;
    }
    
    console.log('✅ Company form found, setting up...');

    setupPhoneMask('NewCompanyPhone');
    setupCNPJMask('NewCompanyCNPJ');
    
    // Lógica do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        newCompanyItem();
    });

    // Evento do botão buscar CEP
    const cepButton = document.querySelector('.cep-btn');
    if (cepButton) {
        cepButton.addEventListener('click', function() {
            const cep = document.getElementById('NewCompanyCEP').value.trim();
            getCEPInformation(cep);
        });
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com empresa e cnpj
  --------------------------------------------------------------------------------------
*/

const newCompanyItem = async (cnpj, corporate_name, trade_name, responsible, email, phone, cep, street_adress, neighborhood_district,
  state, address_complement) => {

    const inputCompanyCNPJ = document.getElementById("NewCompanyCNPJ").value.trim();
    const inputCompanyCorporateName = document.getElementById("NewCompanyCorporateName").value.trim();
    const inputCompanyTradeName = document.getElementById("NewCompanyTradeName").value.trim();
    const inputCompanyResponsible = document.getElementById("NewCompanyResponsible").value.trim();
    const inputCompanyEmail = document.getElementById("NewCompanyEmail").value.trim();
    const inputCompanyPhone = document.getElementById("NewCompanyPhone").value.trim();
    const inputCompanyCEP = document.getElementById("NewCompanyCEP").value.trim();
    const inputCompanyStreetAddress = document.getElementById("NewCompanyStreetAddress").value.trim();
    const inputCompanyNeighborhoodDistrict = document.getElementById("NewCompanyNeighborhoodDistrict").value.trim();
    const inputCompanyState = document.getElementById("NewCompanyState").value.trim();
    const inputCompanyAddressComplement = document.getElementById("NewCompanyAddressComplement").value.trim();

    if (!inputCompanyCNPJ) {
    alert("Escreva o CNPJ da empresa!");
    return;
    }

    if (!inputCompanyCorporateName) {
    alert("Escreva o nome da empresa!");
    return;
    }

    if (!inputCompanyCEP) {
    alert("Escreva o CEP da empresa!");
    return;
    }

    if (!inputCompanyStreetAddress) {
    alert("Escreva o endereço da empresa!");
    return;
    }

    if (!inputCompanyNeighborhoodDistrict) {
    alert("Escreva o Bairro/Distrito da empresa!");
    return;
    }

    if (!inputCompanyState) {
    alert("Escreva o Estado da empresa!");
    return;
    }

    if (!inputCompanyEmail && !inputCompanyPhone) {
    alert("Escreva pelo menos o email ou telefone da empresa!");
    return;
    }

    console.log(inputCompanyCNPJ);
    console.log(inputCompanyCorporateName);
    console.log(inputCompanyTradeName);
    console.log(inputCompanyResponsible);
    console.log(inputCompanyEmail);
    console.log(inputCompanyPhone);
    console.log(inputCompanyCEP);
    console.log(inputCompanyStreetAddress);
    console.log(inputCompanyNeighborhoodDistrict);
    console.log(inputCompanyState);
    console.log(inputCompanyAddressComplement);

    try {
      await postCompany(inputCompanyCNPJ, inputCompanyCorporateName, inputCompanyTradeName, inputCompanyResponsible,
          inputCompanyEmail, inputCompanyPhone, inputCompanyCEP, inputCompanyStreetAddress, 
          inputCompanyNeighborhoodDistrict, inputCompanyState, inputCompanyAddressComplement
      )
      alert("Item adicionado!")
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }

}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar nova empresa no servidor via requisição POST
  --------------------------------------------------------------------------------------
*/

const postCompany = async (company_cnpj, corporate_name, trade_name, company_responsible, company_email,
    company_phone, company_CEP, company_street_address, company_neighborhood_district, company_state,
    address_complement) => {

    const formData = new FormData();
    formData.append('CompanyCNPJ', company_cnpj);
    formData.append('CompanyCorporateName', corporate_name);
    formData.append('CompanyTradeName', trade_name);
    formData.append('CompanyResponsible', company_responsible);
    formData.append('CompanyEmail', company_email);
    formData.append('CompanyPhone', company_phone);
    formData.append('CompanyCEP', company_CEP);
    formData.append('CompanyStreetAddress', company_street_address);
    formData.append('CompanyNeighborhoodDistrict', company_neighborhood_district);
    formData.append('CompanyState', company_state);
    formData.append('CompanyAddressComplement', address_complement);

    const url = 'http://localhost:5000/addCompany';

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

/*
  --------------------------------------------------------------------------------------
  Função para obter detalhes do CEP a partir do ViaCEP, passando pelo backend
  --------------------------------------------------------------------------------------
*/

const getCEPInformation = async (cep) => {

  const url = `http://localhost:5000/getCEPInformation?CEP=${encodeURIComponent(cep)}`;

  try {
    const response = await fetch(url, { method: 'GET' });

    // Tenta obter informação do backend:
    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      // Usa mensagem do backend se for enviada
      const backendMessage = data?.message || `${response.status} ${response.statusText}`;
      throw new Error(backendMessage);
    }

    // Preenche o formulário
    if (!data.erro) {
      document.getElementById("NewCompanyStreetAddress").value =
        data.CompanyStreetAddress || "";

      document.getElementById("NewCompanyNeighborhoodDistrict").value =
        data.CompanyNeighborhoodDistrict || "";

      document.getElementById("NewCompanyState").value =
        data.CompanyState || "";

    } else {
      console.warn("CEP não encontrado:", data);
      alert("CEP não encontrado.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert(`Erro: ${error.message}`);
  }

};