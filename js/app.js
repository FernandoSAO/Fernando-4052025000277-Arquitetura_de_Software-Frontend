
// módulos Js
import { initializeCompanyForm } from './pages/insert_company.js';
import { initializePaymentInvoiceForm } from './pages/insert_payment_invoice.js';
import { initializeReceiptInvoiceForm } from './pages/insert_receipt_invoice.js';
import { initializeSearchPaymentInvoicesForm } from './pages/search_payment_invoices.js';
import { initializeSearchReceiptInvoicesForm } from './pages/search_receipt_invoices.js';
import { initializeSearchCompaniesForm } from './pages/search_companies.js';

// Salva todos os inicializadores em um objeto
const pageInitializers = {
    'insert-company': initializeCompanyForm,
    'insert-payment-invoice': initializePaymentInvoiceForm,
    'insert-receipt-invoice': initializeReceiptInvoiceForm,
    'search-payment-invoices': initializeSearchPaymentInvoicesForm,
    'search-receipt-invoices': initializeSearchReceiptInvoicesForm,
    'search-companies': initializeSearchCompaniesForm
};

// Cache para todos os elementos HTML
const componentCache = new Map();

async function loadComponent(componentName) {
    if (componentCache.has(componentName)) {
        return componentCache.get(componentName);
    }
    
    try {
        const response = await fetch(`components/${componentName}.html`);
        const html = await response.text();
        componentCache.set(componentName, html);
        return html;
    } catch (error) {
        console.error(`Error loading ${componentName}:`, error);
        return `<div>Error loading ${componentName}</div>`;
    }
}

// Inicializa o app
async function initApp() {
    console.log('🚀 Initializing app...');
    
    // Carrega o header e a sidebar
    const [headerHTML, sidebarHTML] = await Promise.all([
        loadComponent('header'),
        loadComponent('sidebar')
    ]);
    
    // Insert components into DOM
    document.getElementById('header-container').innerHTML = headerHTML;
    document.getElementById('sidebar-container').innerHTML = sidebarHTML;
    
    console.log('✅ Components loaded');
    
    // DEBUG: Check dropdown elements
    setTimeout(() => {
        console.log('🔍 Dropdown toggles found:', 
            document.querySelectorAll('.dropdown-toggle').length);
        console.log('🔍 Dropdown items found:', 
            document.querySelectorAll('.dropdown-nav-btn').length);
    }, 50);
    
    // Faz o setup das interações após a inserção dos componentes
    setupHamburgerToggle();
    setupSidebarNavigation();
    
    // Carrega página inicial
    loadPage('inicial');
}

// função para abrir e fechar a sidebar usando apenas o hamburgerBtn
function setupHamburgerToggle() {
    const hamburgerBtn = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.left-sidebar');
    
    if (!hamburgerBtn || !sidebar) {
        console.error('❌ Button or sidebar not found');
        return;
    }
    
    hamburgerBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    console.log('✅ Hamburger setup: Click hamburger to open/close');
}

function setupSidebarNavigation() {
    console.log('🔗 Setting up ALL sidebar interactions...');
    
    // A. Setup dropdown toggles (buttons with .dropdown-toggle class)
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    console.log(`📂 Found ${dropdownToggles.length} dropdown toggles`);
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Don't trigger parent clicks
            
            console.log('📂 Dropdown toggle clicked:', this.textContent.trim());
            
            // Find and toggle the dropdown container
            const dropdown = this.closest('.sidebar-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('expanded');
                console.log(`Dropdown ${dropdown.classList.contains('expanded') ? 'expanded' : 'collapsed'}`);
            }
        });
    });
    
    // B. Setup page navigation (buttons with data-page attribute)
    const navButtons = document.querySelectorAll('[data-page]');
    console.log(`📄 Found ${navButtons.length} navigation buttons`);
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Don't trigger parent clicks
            
            const page = this.dataset.page;
            console.log(`📄 Navigating to: ${page}`);
            
            // Load the page
            loadPage(page);
            
            // Update active navigation item
            updateActiveNavItem(page);

            // FECHA A SIDEBAR AO NAVEGAR
            const sidebar = document.querySelector('.left-sidebar');
            if (sidebar?.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    console.log('✅ Sidebar navigation setup complete');
}

// Carrega a página para o content area
async function loadPage(pageName) {
    console.log(`📄 Loading page: ${pageName}`);
    
    const content = document.getElementById('app-content');
    
    // Show loading indicator
    content.innerHTML = '<div class="loading">⌛ Carregando...</div>';
    
    try {
        // converte nome da página para nome do arquivo
        const fileName = pageName.replace(/-/g, '_'); // insert-company → insert_company
        const filePath = `pages/${fileName}.html`;
        
        console.log(`📂 Fetching: ${filePath}`);
        
        // Faz o Fetch do arquivo de HTML
        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const pageHTML = await response.text();
        
        // Insere o HTML
        content.innerHTML = pageHTML;
        
        // Inicializa o JavaScript da página
        initializePage(pageName);
        
        console.log(`✅ Page loaded: ${pageName}`);
        
    } catch (error) {
        console.error(`❌ Failed to load page "${pageName}":`, error);
        content.innerHTML = `
            <div class="error">
                <h2>Erro ao carregar página</h2>
                <p>Não foi possível carregar "${pageName}"</p>
                <button onclick="loadPage('home')">Voltar para Início</button>
            </div>
        `;
    }
}

// Update active navigation item
function updateActiveNavItem(activePage) {
    // Remove active from all buttons
    document.querySelectorAll('.nav-btn, .dropdown-nav-btn').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active to matching buttons
    document.querySelectorAll('[data-page]').forEach(item => {
        if (item.dataset.page === activePage) {
            item.classList.add('active');
        }
    });
}

// Inicializa as funcionalidades da página
function initializePage(pageName) {
    console.log(`⚙️ Initializing page: ${pageName}`);
    
    const initializer = pageInitializers[pageName];
    
    if (initializer) {
        console.log(`🔧 Calling initializer for: ${pageName}`);
        initializer();
    } else {
        console.log(`ℹ️ No initializer for: ${pageName}`);
    }
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);