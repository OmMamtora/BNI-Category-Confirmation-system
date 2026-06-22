// js/app.js
import { login, logout } from './firebase-auth.js';
import { ready as firebaseReady } from './firebase.js';
import {
  getMembers,
  getPendingMembers,
  addMember,
  deleteMember,
  updateMemberSubmissionStatus,
  getSubmissions,
  saveSubmission,
  updateSubmission,
  deleteSubmission,
  getMissingRequests,
  saveRequest,
  approveMissingRequest as approveMissingRequestApi,
  deleteRequest,
  getDashboardStats
} from './api.js';

/* ==========================================
   STATE
========================================== */

let members = [];
let selectedMember = null;
let lastSubmission = null;

/* ==========================================
   SCREEN REFERENCES
========================================== */

const screens = {
  landing   : document.getElementById('screen-landing'),
  selection : document.getElementById('screen-selection'),
  form      : document.getElementById('screen-form'),
  success   : document.getElementById('screen-success'),
  missing   : document.getElementById('screen-missing'),
  missingDone: document.getElementById('screen-missing-success'),
  adminLogin: document.getElementById('screen-admin-login'),
  dashboard : document.getElementById('screen-dashboard')
};

/* ==========================================
   DOM REFERENCES (dropdown / lists)
========================================== */

const dropdownToggle  = document.getElementById('dropdown-toggle');
const dropdownMenu    = document.getElementById('dropdown-menu');
const dropdownList    = document.getElementById('dropdown-list');
const dropdownSearch  = document.getElementById('member-search');
const selectedMemberEl = document.getElementById('selected-member');

/* ==========================================
   SCREEN NAVIGATION
========================================== */

function showScreen(screenName) {

  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  if (screens[screenName]) {
    screens[screenName].classList.add('active');
  }

  const adminNavBtn = document.getElementById('admin-nav-btn');
  if (adminNavBtn) {
    adminNavBtn.style.display =
      (isAdminLoggedIn() && screenName !== 'dashboard') ? 'inline-flex' : 'none';
  }

  const main = document.getElementById('main-content');
  if (main) main.classList.toggle('wide', screenName === 'dashboard');
}

function isAdminLoggedIn() {
  return !!sessionStorage.getItem('bni_admin');
}

/* ==========================================
   LOAD MEMBERS
========================================== */

async function loadMembers() {

  try {

    members = await getMembers();

    const availableMembers = members.filter(
      member => !member.isSubmitted
    );

    renderMembers(availableMembers);

  } catch (error) {

    console.error(error);

  }

}

/* ==========================================
   RENDER MEMBERS DROPDOWN
========================================== */

function renderMembers(list) {

  if (!dropdownList) return;

  dropdownList.innerHTML = '';

  if (list.length === 0) {
    dropdownList.innerHTML = '<div class="dropdown-empty">No pending members found</div>';
    return;
  }

  list.forEach(member => {

    const div = document.createElement('div');

    div.className = 'dropdown-item';

    div.innerHTML = `
      <span class="dropdown-name">
        ${escHtml(member.name)}
      </span>

      <span class="dropdown-business">
        ${escHtml(member.businessName || '')}
      </span>
    `;

    div.addEventListener('click', () => {

      selectedMember = member;

      selectedMemberEl.textContent = member.name;
      selectedMemberEl.dataset.id = member.id;
      selectedMemberEl.classList.add('chosen');

      document
        .getElementById('dropdown-menu')
        .classList.remove('active');

      const errEl = document.getElementById('selection-error');
      if (errEl) errEl.textContent = '';

    });

    dropdownList.appendChild(div);

  });

}

/* ==========================================
   MEMBER SEARCH
========================================== */

function searchMembers(queryText) {

  const filtered = members.filter(member =>
    !member.isSubmitted &&
    member.name.toLowerCase().includes(queryText.toLowerCase())
  );

  renderMembers(filtered);

}

/* ==========================================
   CATEGORY SUBMISSION
========================================== */

async function submitCategoryForm() {

  const memberId = selectedMember?.id || selectedMemberEl?.dataset.id;
  const memberName = selectedMember?.name || selectedMemberEl?.textContent;

  const data = {

    memberId,

    memberName,

    businessName: document.getElementById('form-business-name').value.trim(),

    chapter: 'BNI Lakshya',

    category: document.getElementById('form-category').value.trim(),

    includes: document.getElementById('form-includes').value.trim(),

    excludes: document.getElementById('form-excludes').value.trim(),

    specificAsk: document.getElementById('form-specific-ask').value.trim(),

    declarationAccepted: document.getElementById('form-declaration').checked === true

  };

  const ref = await saveSubmission(data);

  lastSubmission = {
    id: ref.id,
    ...data,
    submittedAt: new Date()
  };

  return lastSubmission;

}

/* ==========================================
   MISSING NAME REQUEST
========================================== */

async function submitMissingRequest() {

  await saveRequest({

    fullName: document.getElementById('req-fullname').value.trim(),

    businessName: document.getElementById('req-business').value.trim(),

    mobile: document.getElementById('req-mobile').value.trim(),

    email: document.getElementById('req-email').value.trim(),

    suggestedCategory: document.getElementById('req-category').value.trim(),

    message: document.getElementById('req-message').value.trim()

  });

}

/* ==========================================
   DASHBOARD STATS
========================================== */

async function loadDashboardStats() {

  const stats = await getDashboardStats();

  document.getElementById('total-members').textContent = stats.totalMembers;

  document.getElementById('confirmed-count').textContent = stats.confirmedCount;

  document.getElementById('pending-count').textContent = stats.pendingCount;

  document.getElementById('request-count').textContent = stats.requestCount;

  document.getElementById('tab-confirmed').textContent = `Confirmed Submissions (${stats.confirmedCount})`;
  document.getElementById('tab-pending').textContent   = `Pending Members (${stats.pendingCount})`;
  document.getElementById('tab-requests').textContent  = `Name Requests (${stats.requestCount})`;

}

/* ==========================================
   CONFIRMED SUBMISSIONS TAB
========================================== */

async function loadConfirmedSubmissions(searchText = '') {

  const submissions = await getSubmissions();

  // cache full objects so the edit modal can read them by id without a re-fetch
  window._submissionsCache = submissions;

  const q = searchText.toLowerCase();

  const filtered = submissions.filter(item =>
    !q ||
    item.memberName?.toLowerCase().includes(q) ||
    item.businessName?.toLowerCase().includes(q) ||
    item.category?.toLowerCase().includes(q)
  );

  const thead = document.getElementById('dash-thead');
  const tbody = document.getElementById('dash-tbody');

  thead.innerHTML = `
    <tr>
      <th>#</th>
      <th>Member Name
      </th><th>Business</th>
      <th>Category</th>
      <th>Includes</th>
      <th>Excludes</th>
      <th style="width:140px;text-align:center">Actions</th>
    </tr>`;

  tbody.innerHTML = filtered.length === 0
    ? `<tr><td colspan="7" class="empty-row">No category confirmations found.</td></tr>`
    : filtered.map((item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td class="bold-cell">${escHtml(item.memberName)}</td>
          <td>${escHtml(item.businessName || '—')}</td>
          <td><span class="badge">${escHtml(item.category)}</span></td>
          <td class="mc">${escHtml(item.includes)}</td>
          <td class="mc">${escHtml(item.excludes)}</td>
          <td style="width:140px;text-align:center;white-space:nowrap;">
            <button type="button" class="btn-action btn-primary" data-id="${item.id}" data-action="edit-submission"> Edit </button>
            <button type="button" class="btn-action btn-danger" data-id="${item.id}" data-member-id="${item.memberId || ''}" data-action="delete-submission"> Delete</button>
          </td>
        </tr>
      `).join('');

  return filtered;

}

/* ==========================================
   PENDING MEMBERS TAB
========================================== */

async function loadPendingMembers(searchText = '') {

  const pendingMembers = await getPendingMembers();

  const q = searchText.toLowerCase();

  const filtered = pendingMembers.filter(member =>
    !q ||
    member.name?.toLowerCase().includes(q) ||
    (member.businessName || '').toLowerCase().includes(q)
  );

  const thead = document.getElementById('dash-thead');
  const tbody = document.getElementById('dash-tbody');

  thead.innerHTML = `
    <tr>
        <th>MEMBER NAME</th>
        <th>BUSINESS NAME</th>
        <th>MOBILE</th>
        <th>EMAIL</th>
        <th>STATUS</th>
    </tr>
    `;

    tbody.innerHTML = filtered.length === 0
    ? `<tr><td colspan="5" class="empty-row">No pending members found.</td></tr>`
    : filtered.map(member => `
    <tr>
        <td class="bold-cell">
            ${escHtml(member.name)}
        </td>

        <td>
            ${escHtml(member.businessName || '-')}
        </td>

        <td>
            ${escHtml(member.mobile || '-')}
        </td>

        <td>
            ${escHtml(member.email || '-')}
        </td>

        <td>
            <span class="badge badge-pending">
                PENDING
            </span>
        </td>
    </tr>
    `).join('');

  return filtered;

}

/* ==========================================
   MISSING REQUESTS TAB
========================================== */

async function loadMissingRequests(searchText = '') {

  const requests = await getMissingRequests();

  const q = searchText.toLowerCase();

  const filtered = requests.filter(r =>
    !q ||
    r.fullName?.toLowerCase().includes(q) ||
    (r.businessName || '').toLowerCase().includes(q)
  );

  const thead = document.getElementById('dash-thead');
  const tbody = document.getElementById('dash-tbody');

  thead.innerHTML = `
    <tr>
        <th>#</th>
        <th>Requested Name</th>
        <th>Business</th>
        <th>Contact Info</th>
        <th>Suggested Category</th>
        <th>Message</th>
        <th>Status</th>
        <th>Actions</th>
    </tr>`;

  tbody.innerHTML = filtered.length === 0
    ? `<tr><td colspan="8" class="empty-row">No name requests found.</td></tr>`
    : filtered.map((r, i) => `
        <tr>
            <td>${i + 1}</td>
            <td class="bold-cell"> ${escHtml(r.fullName)} </td>

            <td> ${escHtml(r.businessName || '—')} </td>

            <td>
                <div class="contact-info">
                    <div>📞 ${escHtml(r.mobile || 'N/A')}</div>
                    <div>✉️ ${escHtml(r.email || 'N/A')}</div>
                </div>
            </td>

            <td class="category-text"> ${escHtml(r.suggestedCategory || '—')} </td>

            <td> ${escHtml(r.message || '—')} </td>

            <td>
                <span class="badge ${ r.status === 'approved' ? 'badge-ok' : 'badge-pending' }">
                    ${escHtml((r.status || 'pending').toLowerCase())}
                </span>
            </td>

            <td class="action-buttons">
                ${ r.status !== 'approved'
                    ? `<button type="button" class="btn-action btn-success" data-id="${r.id}" data-action="approve-request"> Approve </button>` : ''
                }
                <button type="button" class="btn-action btn-danger" data-id="${r.id}" data-action="delete-request"> Reject </button>
            </td>
        </tr>
      `).join('');

  // store full request objects for the approve handler
  window._requestsCache = requests;

  return filtered;

}

/* ==========================================
   EXPORT CSV
========================================== */

async function exportCSV() {

    let csv = '';
    let fileName = '';

    if (activeTab === 'confirmed') {

        const submissions = await getSubmissions();

        fileName = 'confirmed-submissions.csv';

        csv = `Member Name,Business Name,Category,Includes,Excludes,Specific Ask\n`;

        submissions.forEach(item => {
            csv += [
                item.memberName,
                item.businessName,
                item.category,
                item.includes,
                item.excludes,
                item.specificAsk || ''
            ]
            .map(v => `"${String(v || '').replace(/"/g,'""')}"`)
            .join(',') + '\n';

        });

    }

    else if (activeTab === 'pending') {

        const pendingMembers = await getPendingMembers();

        fileName = 'pending-members.csv';
        csv = `Member Name,Business Name,Mobile,Email,Status\n`;
        pendingMembers.forEach(member => {

            csv += [
                member.name,
                member.businessName,
                member.mobile,
                member.email,
                'Pending'
            ]
            .map(v => `"${String(v || '').replace(/"/g,'""')}"`)
            .join(',') + '\n';

        });

    }

    else if (activeTab === 'requests') {

        const requests = await getMissingRequests();
        fileName = 'missing-name-requests.csv';

        csv = `Full Name,Business Name,Mobile,Email,Suggested Category,Message,Status\n`;

        requests.forEach(req => {
            csv += [
                req.fullName,
                req.businessName,
                req.mobile,
                req.email,
                req.suggestedCategory,
                req.message,
                req.status
            ]
            .map(v => `"${String(v || '').replace(/"/g,'""')}"`)
            .join(',') + '\n';

        });

    }

    const blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;'
    });

    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);

    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

/* ==========================================
   FIREBASE AUTHENTICATION
========================================== */

async function adminLogin(email, password) {

  const cred = await login(email, password);

  sessionStorage.setItem('bni_admin', JSON.stringify({
    uid: cred.user.uid,
    email: cred.user.email
  }));

  return cred;

}

async function adminLogout() {

  await logout();

  sessionStorage.removeItem('bni_admin');

  showScreen('landing');

}

/* ==========================================
   EDIT SUBMISSION
========================================== */

async function editSubmission(submissionId, updatedData) {

  await updateSubmission(submissionId, updatedData);

}

/* ==========================================
   DELETE SUBMISSION
========================================== */

async function deleteSubmissionRecord(submissionId, memberId = null) {

  await deleteSubmission(submissionId, memberId);

}

/* ==========================================
   RESET MEMBER SUBMISSION
========================================== */

async function resetMemberSubmission(memberId) {

  await updateMemberSubmissionStatus(memberId, false);

}

/* ==========================================
   APPROVE MISSING REQUEST
========================================== */

async function approveMissingRequest(request) {
  await approveMissingRequestApi(request);
}

/* ==========================================
   DASHBOARD: ACTIVE TAB STATE + REFRESH
========================================== */

let activeTab = 'confirmed';

async function refreshActiveTab(searchText = '') {

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${activeTab}`)?.classList.add('active');

  setDashLoading(true);

  try {

    if (activeTab === 'confirmed') {
      await loadConfirmedSubmissions(searchText);
    } else if (activeTab === 'pending') {
      await loadPendingMembers(searchText);
    } else if (activeTab === 'requests') {
      await loadMissingRequests(searchText);
    }

  } catch (error) {

    console.error(error);

  } finally {

    setDashLoading(false);

  }

}

async function openDashboard() {

  showScreen('dashboard');

  await loadDashboardStats();

  await refreshActiveTab(document.getElementById('dash-search')?.value || '');

}

/* ==========================================
   BUTTON EVENTS
========================================== */

document
  .getElementById('start-btn')
  ?.addEventListener('click', () => showScreen('selection'));

document
  .getElementById('continue-btn')
  ?.addEventListener('click', () => {

    if (!selectedMember) {
      const errEl = document.getElementById('selection-error');
      if (errEl) errEl.textContent = 'Please select your name first.';
      return;
    }

    document.getElementById('form-member-name').value = selectedMember.name;
    document.getElementById('form-business-name').value = selectedMember.businessName || '';

    showScreen('form');

  });

document
  .getElementById('back-home-btn')
  ?.addEventListener('click', () => showScreen('landing'));

document
  .getElementById('missing-name-link')
  ?.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('missing');
  });

document
  .getElementById('btn-form-back')
  ?.addEventListener('click', () => showScreen('selection'));

document
  .getElementById('btn-missing-back')
  ?.addEventListener('click', () => showScreen('selection'));

document
  .getElementById('btn-missing-done')
  ?.addEventListener('click', () => showScreen('selection'));

document
  .getElementById('btn-print')
  ?.addEventListener('click', () => window.print());

document
  .getElementById('btn-back-home')
  ?.addEventListener('click', () => showScreen('landing'));

document
  .getElementById('admin-footer-link')
  ?.addEventListener('click', (e) => {
    e.preventDefault();
    if (isAdminLoggedIn()) {
      openDashboard();
    } else {
      showScreen('adminLogin');
    }
  });

document
  .getElementById('admin-nav-btn')
  ?.addEventListener('click', () => openDashboard());

document
  .getElementById('btn-admin-cancel')
  ?.addEventListener('click', () => showScreen('landing'));

document
  .getElementById('logout-btn')
  ?.addEventListener('click', adminLogout);

document
  .getElementById('btn-export')
  ?.addEventListener('click', exportCSV);

/* ==========================================
   DROPDOWN OPEN / CLOSE
========================================== */

dropdownToggle?.addEventListener('click', () => {
  const isOpen = dropdownMenu.classList.toggle('active');
  dropdownToggle.querySelector('.dropdown-arrow')?.classList.toggle('open', isOpen);
  if (isOpen) dropdownSearch?.focus();
});

document.addEventListener('click', (e) => {
  if (
    dropdownToggle && dropdownMenu &&
    !dropdownToggle.contains(e.target) &&
    !dropdownMenu.contains(e.target)
  ) {
    dropdownMenu.classList.remove('active');
    dropdownToggle.querySelector('.dropdown-arrow')?.classList.remove('open');
  }
});

dropdownSearch?.addEventListener('input', () => {
  searchMembers(dropdownSearch.value);
});

/* ==========================================
   CATEGORY FORM SUBMIT
========================================== */

document
  .getElementById('category-form')
  ?.addEventListener('submit', async (e) => {

    e.preventDefault();

    clearFormErrors();

    const category    = document.getElementById('form-category').value.trim();
    const includes     = document.getElementById('form-includes').value.trim();
    const excludes     = document.getElementById('form-excludes').value.trim();
    const declaration  = document.getElementById('form-declaration').checked;

    let valid = true;
    if (!category)   { showFieldError('err-category', 'Category is required.'); valid = false; }
    if (!includes)    { showFieldError('err-includes', 'Please describe what is included.'); valid = false; }
    if (!excludes)    { showFieldError('err-excludes', 'Please describe what is not included.'); valid = false; }
    if (!declaration) { showFieldError('err-declaration', 'Please confirm the declaration.'); valid = false; }
    if (!valid) return;

    const btn = e.target.querySelector('button[type="submit"]');
    setButtonLoading(btn, true, 'Submitting…');

    try {

      const submission = await submitCategoryForm();

      renderReceipt(submission);

      showScreen('success');

      e.target.reset();

      selectedMember = null;
      if (selectedMemberEl) {
        selectedMemberEl.textContent = 'Search your name…';
        selectedMemberEl.classList.remove('chosen');
        delete selectedMemberEl.dataset.id;
      }

      await loadMembers();

    } catch (error) {

      console.error(error);

      // Show the REAL reason (e.g. "already submitted by someone else")
      // instead of a generic message, so the member knows what happened.
      document.getElementById('form-submit-error').textContent =
        error.message || 'Unable to save. Please try again.';

      // If the member was taken by someone else in the meantime (the
      // transaction-guard race-condition case), refresh the roster and
      // bounce them back to selection so they can't retry on a dead name.
      if (error.message && error.message.toLowerCase().includes('already submitted')) {
        await loadMembers();
        selectedMember = null;
        showScreen('selection');
        const selErr = document.getElementById('selection-error');
        if (selErr) selErr.textContent = error.message;
      }

    } finally {

      setButtonLoading(btn, false, 'Submit Confirmation');

    }

  });

/* ==========================================
   MISSING NAME FORM SUBMIT
========================================== */

document.getElementById('missing-name-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    clearFormErrors();

    const fullName          = document.getElementById('req-fullname').value.trim();
    const businessName      = document.getElementById('req-business').value.trim();
    const mobile            = document.getElementById('req-mobile').value.trim();
    const email             = document.getElementById('req-email').value.trim();
    const suggestedCategory = document.getElementById('req-category').value.trim();

    let valid = true;
    if (!fullName)     { showFieldError('req-err-name', 'Full name is required.'); valid = false; }
    if (!businessName) { showFieldError('req-err-business', 'Business name is required.'); valid = false; }
    if (!/^\d{10}$/.test(mobile)) { showFieldError('req-err-mobile', 'Enter a valid 10-digit mobile.'); valid = false; }
    if (!/\S+@\S+\.\S+/.test(email)) { showFieldError('req-err-email', 'Enter a valid email.'); valid = false; }
    if (!suggestedCategory) { showFieldError('req-err-category', 'Please suggest a category.'); valid = false; }
    if (!valid) return;

    const btn = e.target.querySelector('button[type="submit"]');
    setButtonLoading(btn, true, 'Submitting…');

    try {

      await submitMissingRequest();

      showScreen('missingDone');

      e.target.reset();

    } catch (error) {

      console.error(error);
      document.getElementById('req-submit-error').textContent = 'Unable to submit. Please try again.';

    } finally {

      setButtonLoading(btn, false, 'Submit Request');

    }

  });

/* ==========================================
   ADMIN LOGIN FORM SUBMIT
========================================== */

document
  .getElementById('admin-login-form')
  ?.addEventListener('submit', async (e) => {

    e.preventDefault();

    const email    = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    const errorEl  = document.getElementById('admin-login-error');
    const btn      = e.target.querySelector('button[type="submit"]');

    errorEl.textContent = '';
    setButtonLoading(btn, true, 'Logging in…');

    try {

      await adminLogin(email, password);

      await openDashboard();

    } catch (error) {

      console.error(error);
      errorEl.textContent = 'Invalid email or password.';

    } finally {

      setButtonLoading(btn, false, 'Login');

    }

  });

/* ==========================================
   DASHBOARD TABS
========================================== */

['confirmed', 'pending', 'requests'].forEach(tab => {
  document.getElementById(`tab-${tab}`)?.addEventListener('click', () => {
    activeTab = tab;
    refreshActiveTab(document.getElementById('dash-search')?.value || '');
  });
});

document
  .getElementById('dash-search')
  ?.addEventListener('input', (e) => {
    refreshActiveTab(e.target.value);
  });

/* ==========================================
   DASHBOARD TABLE ACTIONS (delegated)
========================================== */

document
  .getElementById('dash-tbody')
  ?.addEventListener('click', async (e) => {

    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (!id) {
      console.error('Action button is missing data-id — cannot perform action:', action);
      alert('Something went wrong (missing record id). Please refresh the page and try again.');
      return;
    }

    if (action === 'delete-submission') {

      const memberId = btn.dataset.memberId || null;
      if (!confirm('Delete this submission? This will unlock the member\'s name.')) return;

      btn.disabled = true;

      try {
        await deleteSubmissionRecord(id, memberId);
        await loadDashboardStats();
        await refreshActiveTab(document.getElementById('dash-search')?.value || '');
      } catch (error) {
        console.error('Delete submission failed:', error);
        alert('Failed to delete submission: ' + (error.message || error));
        btn.disabled = false;
      }

    } else if (action === 'delete-member') {

      const name = btn.dataset.name;
      if (!confirm(`Remove ${name} from the roster?`)) return;

      btn.disabled = true;

      try {
        await deleteMember(id);
        await loadDashboardStats();
        await refreshActiveTab(document.getElementById('dash-search')?.value || '');
      } catch (error) {
        console.error('Delete member failed:', error);
        alert('Failed to remove member: ' + (error.message || error));
        btn.disabled = false;
      }

    } else if (action === 'approve-request') {

      const request = (window._requestsCache || []).find(r => r.id === id);

      if (!request) {
        alert('Could not find that request. Please refresh the page and try again.');
        return;
      }

      btn.disabled = true;

      try {

        await approveMissingRequest(request);
        await loadDashboardStats();
        await refreshActiveTab(document.getElementById('dash-search')?.value || '');
        alert('Member added and request approved!');

      } catch (error) {

        console.error('Approve request failed:', error);
        alert('Failed to approve request: ' + (error.message || error));
        btn.disabled = false;

      }

    } else if (action === 'delete-request') {

      if (!confirm('Delete this request?')) return;

      btn.disabled = true;

      try {
        await deleteRequest(id);
        await loadDashboardStats();
        await refreshActiveTab(document.getElementById('dash-search')?.value || '');
      } catch (error) {
        console.error('Delete request failed:', error);
        alert('Failed to delete request: ' + (error.message || error));
        btn.disabled = false;
      }

    } else if (action === 'edit-submission') {

      const submission = (window._submissionsCache || []).find(s => s.id === id);

      if (!submission) {
        alert('Submission not found. Please refresh the page and try again.');
        return;
      }

      openEditSubmissionModal(submission);

    }

  });

/* ==========================================
   EDIT SUBMISSION MODAL
========================================== */

const editModal       = document.getElementById('edit-submission-modal');
const editForm        = document.getElementById('edit-submission-form');
const closeEditModalBtn = document.getElementById('close-edit-modal-btn');
const cancelEditBtn    = document.getElementById('cancel-edit-btn');

let editingSubmissionId = null;

function openEditSubmissionModal(submission) {

  if (!editModal || !editForm) return;

  editingSubmissionId = submission.id;

  clearEditErrors();

  document.getElementById('edit-member-name').value   = submission.memberName || '';
  document.getElementById('edit-business-name').value = submission.businessName || '';
  document.getElementById('edit-category').value      = submission.category || '';
  document.getElementById('edit-includes').value      = submission.includes || '';
  document.getElementById('edit-excludes').value      = submission.excludes || '';
  document.getElementById('edit-specific-ask').value  = submission.specificAsk || '';

  editModal.classList.add('active');

}

function closeEditSubmissionModal() {
  editModal?.classList.remove('active');
  editingSubmissionId = null;
}

function clearEditErrors() {
  document.getElementById('edit-err-category')?.replaceChildren();
  ['edit-err-category', 'edit-err-includes', 'edit-err-excludes', 'edit-submit-error'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

closeEditModalBtn?.addEventListener('click', closeEditSubmissionModal);
cancelEditBtn?.addEventListener('click', closeEditSubmissionModal);

window.addEventListener('click', (e) => {
  if (e.target === editModal) closeEditSubmissionModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && editModal?.classList.contains('active')) {
    closeEditSubmissionModal();
  }
});

editForm?.addEventListener('submit', async (e) => {

  e.preventDefault();

  if (!editingSubmissionId) return;

  clearEditErrors();

  const businessName = document.getElementById('edit-business-name').value.trim();
  const category      = document.getElementById('edit-category').value.trim();
  const includes       = document.getElementById('edit-includes').value.trim();
  const excludes       = document.getElementById('edit-excludes').value.trim();
  const specificAsk    = document.getElementById('edit-specific-ask').value.trim();

  let valid = true;
  if (!category)  { showFieldError('edit-err-category', 'Category is required.'); valid = false; }
  if (!includes)  { showFieldError('edit-err-includes', 'This field is required.'); valid = false; }
  if (!excludes)  { showFieldError('edit-err-excludes', 'This field is required.'); valid = false; }
  if (!valid) return;

  const btn = editForm.querySelector('button[type="submit"]');
  setButtonLoading(btn, true, 'Saving…');

  try {

    await editSubmission(editingSubmissionId, {
      businessName,
      category,
      includes,
      excludes,
      specificAsk
    });

    closeEditSubmissionModal();

    await loadDashboardStats();
    await refreshActiveTab(document.getElementById('dash-search')?.value || '');

  } catch (error) {

    console.error('Edit submission failed:', error);
    document.getElementById('edit-submit-error').textContent =
      'Failed to save changes: ' + (error.message || error);

  } finally {

    setButtonLoading(btn, false, 'Save Changes');

  }

});

/* ==========================================
   RECEIPT RENDERING
========================================== */

function renderReceipt(sub) {

  const el = document.getElementById('receipt-body');
  if (!el) return;

  el.innerHTML = `
<div class="submission-receipt">

    <div class="receipt-title">
        Submission Receipt
    </div>

    <div class="receipt-row">
        <label>MEMBER NAME</label>
        <div>${escHtml(sub.memberName)}</div>
    </div>

    <div class="receipt-row">
        <label>BUSINESS NAME</label>
        <div>${escHtml(sub.businessName || '-')}</div>
    </div>

    <div class="receipt-row">
        <label>CHAPTER</label>
        <div>BNI Lakshya</div>
    </div>

    <div class="receipt-row">
        <label>CATEGORY ALLOTTED</label>
        <div class="category-text">${escHtml(sub.category)}</div>
    </div>

    <div class="receipt-row">
        <label>INCLUDES</label>
        <div>${escHtml(sub.includes)}</div>
    </div>

    <div class="receipt-row">
        <label>DOES NOT INCLUDE</label>
        <div>${escHtml(sub.excludes)}</div>
    </div>

    ${
      sub.specificAsk
      ? `
      <div class="receipt-row">
          <label>SPECIFIC ASK / REFERRAL CLARITY</label>
          <div>${escHtml(sub.specificAsk)}</div>
      </div>
      `
      : ''
    }

    <div class="receipt-row">
        <label>SUBMITTED ON</label>
        <div>
            ${new Date().toLocaleString('en-IN')}
        </div>
    </div>

</div>
`;

}

/* ==========================================
   ADD MEMBER MODAL
========================================== */

const addMemberBtn    = document.getElementById('add-member-btn');
const memberModal      = document.getElementById('member-modal');
const closeModalBtn    = document.getElementById('close-modal-btn');
const cancelMemberBtn  = document.getElementById('cancel-member-btn');
const addMemberForm    = document.getElementById('add-member-form');

/* ==========================================
    OPEN MODAL
 ========================================== */

if (addMemberBtn) {

  addMemberBtn.addEventListener('click', () => {

    addMemberForm.reset();
    clearModalErrors();
    memberModal.classList.add('active');
    document.getElementById('add-member-name')?.focus();

  });

}

/* ========================================== 
    CLOSE MODAL
========================================== */

function closeMemberModal() {

  memberModal.classList.remove('active');

}

if (closeModalBtn) {

  closeModalBtn.addEventListener('click', closeMemberModal);

}

if (cancelMemberBtn) {

  cancelMemberBtn.addEventListener('click', closeMemberModal);

}

/* ==========================================
    CLOSE MODAL ON OUTSIDE CLICK 
========================================== */

window.addEventListener('click', (e) => {

  if (e.target === memberModal) {

    closeMemberModal();

  }

});

/* ==========================================
    CLOSE MODAL ON ESCAPE 
========================================== */

document.addEventListener('keydown', (e) => {

  if (e.key === 'Escape' && memberModal?.classList.contains('active')) {
    closeMemberModal();
  }

});

/* ==========================================
    CLEAR MODAL ERRORS
========================================== */

function clearModalErrors() {

  document.getElementById('modal-err-name').textContent = '';
  document.getElementById('modal-err-business').textContent = '';
  document.getElementById('modal-err-mobile').textContent = '';
  document.getElementById('modal-err-email').textContent = '';
  document.getElementById('modal-submit-error').textContent = '';

}

/* ========================================== 
    SAVE MEMBER TO FIREBASE 
========================================== */

if (addMemberForm) {

  addMemberForm.addEventListener('submit', async function (e) {

    e.preventDefault();

    clearModalErrors();

    const name     = document.getElementById('add-member-name').value.trim();
    const business = document.getElementById('member-business').value.trim();
    const mobile   = document.getElementById('member-mobile').value.trim();
    const email    = document.getElementById('member-email').value.trim();

    let valid = true;

    if (!name) {
      document.getElementById('modal-err-name').textContent = 'Full name is required.';
      valid = false;
    }
    if (!business) {
      document.getElementById('modal-err-business').textContent = 'Business name is required.';
      valid = false;
    }
    if (mobile && !/^\d{10}$/.test(mobile)) {
      document.getElementById('modal-err-mobile').textContent = 'Enter a valid 10-digit number.';
      valid = false;
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      document.getElementById('modal-err-email').textContent = 'Enter a valid email address.';
      valid = false;
    }
    if (!valid) return;

    const submitBtn = document.getElementById('modal-submit-btn');
    setButtonLoading(submitBtn, true, 'Adding…');

    try {

      await addMember({
        name,
        businessName: business,
        mobile,
        email
      });

      addMemberForm.reset();

      closeMemberModal();

      await loadDashboardStats();
      await refreshActiveTab(document.getElementById('dash-search')?.value || '');

    } catch (error) {

      console.error('Add Member Error:', error);
      document.getElementById('modal-submit-error').textContent = 'Failed to add member. Please try again.';

    } finally {

      setButtonLoading(submitBtn, false, 'Add Member');

    }

  });

}

/* ==========================================
   HELPERS
========================================== */

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearFormErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.submit-error').forEach(el => el.textContent = '');
}

function setButtonLoading(btn, loading, loadingText) {
  if (!btn) return;
  if (loading) {
    btn.dataset.label = btn.dataset.label || btn.textContent;
    btn.disabled = true;
    btn.textContent = loadingText;
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.label || loadingText;
  }
}

function setDashLoading(loading) {
  const el = document.getElementById('dash-loading');
  const table = document.getElementById('dash-table-wrapper');
  if (el) el.style.display = loading ? 'flex' : 'none';
  if (table) table.style.display = loading ? 'none' : 'block';
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ==========================================
   INIT
========================================== */

async function init() {

  await firebaseReady;

  showScreen('landing');

  await loadMembers();

  const adminNavBtn = document.getElementById('admin-nav-btn');
  if (adminNavBtn) adminNavBtn.style.display = isAdminLoggedIn() ? 'inline-flex' : 'none';

}

init();
