import './style.css';
import { renderHeader } from './components/Header';
import { renderHero } from './components/Hero';
import { renderCategories, initCategories } from './components/Categories';
import { renderFooter } from './components/Footer';
import { renderVendorSubmission, initVendorSubmission } from './pages/VendorSubmission';
import { renderAdminLogin, initAdminLogin } from './pages/AdminLogin';
import { renderAdminDashboard, initAdminDashboard } from './pages/AdminDashboard';
import { checkAdminAuth } from './utils/adminAuth';
import { navigateTo } from './utils/router';
import { initPostcodeSearch } from './components/PostcodeSearch';
import { renderBetaBanner, initBetaBanner } from './components/BetaBanner';

async function renderPage() {
  const path = window.location.pathname;
  
  let pageContent = '';
  
  switch (path) {
    case '/admin/login':
      pageContent = renderAdminLogin();
      break;
    case '/admin/dashboard':
      const isAdmin = await checkAdminAuth();
      if (!isAdmin) return;
      pageContent = renderAdminDashboard();
      break;
    case '/vendor-submission':
      pageContent = renderVendorSubmission();
      break;
    default:
      pageContent = `
        ${renderHero()}
        ${renderCategories()}
        <div id="results" class="max-w-6xl mx-auto w-full px-6 py-8"></div>
      `;
  }

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="min-h-screen flex flex-col">
      ${path.startsWith('/admin') ? '' : renderHeader()}
      ${pageContent}
      ${path.startsWith('/admin') ? '' : renderFooter()}
      ${renderBetaBanner()}
    </div>
  `;

  // Initialize page-specific functionality
  switch (path) {
    case '/admin/login':
      initAdminLogin();
      break;
    case '/admin/dashboard':
      if (await checkAdminAuth()) {
        initAdminDashboard();
      }
      break;
    case '/vendor-submission':
      initVendorSubmission();
      break;
    default:
      initHomePageFunctionality();
  }

  // Initialize beta banner
  initBetaBanner();
}

function initHomePageFunctionality() {
  initPostcodeSearch();
  initCategories();
}

// Initial render
renderPage();

// Handle navigation
window.addEventListener('popstate', renderPage);

// Handle navigation links
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('/')) {
    e.preventDefault();
    navigateTo(target.getAttribute('href')!);
  }
});