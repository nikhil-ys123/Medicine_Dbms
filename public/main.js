// public/main.js - Enhanced with Modal System
document.addEventListener('DOMContentLoaded', () => {
  initHavingFeature();
  initModalSystem();
  initActionButtons();
});

// === HAVING CLAUSE FEATURE ===
function initHavingFeature() {
  const btn = document.getElementById('check-multi');
  const target = document.getElementById('multi-result');
  
  if (!btn || !target) return;

  btn.addEventListener('click', async () => {
    target.innerHTML = '<div class="loading-spinner">Loading...</div>';
    try {
      const res = await fetch('/api/suppliers/more-than-one');
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      
      if (!data.length) {
        target.innerHTML = '<p style="color: var(--text-secondary); font-style: italic;">No supplier supplies more than one medicine.</p>';
        return;
      }

      let html = '<table class="data-table"><thead><tr><th>Supplier</th><th>Medicines Supplied</th></tr></thead><tbody>';
      data.forEach(r => {
        html += `<tr><td>${escapeHtml(r.supp_name)}</td><td><span style="color: var(--accent-cyan); font-weight: 600;">${r.med_count}</span></td></tr>`;
      });
      html += '</tbody></table>';
      target.innerHTML = html;
    } catch (err) {
      console.error(err);
      target.innerHTML = '<p style="color: var(--danger);">Error fetching data. Check server console.</p>';
    }
  });
}

// === MODAL SYSTEM ===
function initModalSystem() {
  createModalHTML();
  setupModalEventListeners();
}

function createModalHTML() {
  const modalHTML = `
    <div id="edit-modal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Edit Record</h3>
          <button class="close-modal">&times;</button>
        </div>
        <form id="edit-form" class="modal-form">
          <div id="form-fields"></div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel">Cancel</button>
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function setupModalEventListeners() {
  const modal = document.getElementById('edit-modal');
  const closeBtn = modal.querySelector('.close-modal');
  const cancelBtn = modal.querySelector('.btn-cancel');
  const form = modal.querySelector('#edit-form');

  // Close modal events
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // Form submission
  form.addEventListener('submit', handleFormSubmit);
}

// === EDIT FUNCTIONALITY ===
async function editMedicine(medId) {
  try {
    showModal('Edit Medicine');
    showLoading(true);
    
    const response = await fetch(`/api/medicine/${medId}`);
    if (!response.ok) throw new Error('Failed to fetch medicine data');
    
    const medicine = await response.json();
    showLoading(false);
    
    const formFields = document.getElementById('form-fields');
    formFields.innerHTML = `
      <input type="hidden" id="record-id" value="${medicine.med_id}">
      <input type="hidden" id="record-type" value="medicine">
      
      <label>
        Medicine Name
        <input type="text" id="med_name" value="${escapeHtml(medicine.med_name)}" required>
      </label>
      
      <label>
        Quantity
        <input type="number" id="quantity" value="${medicine.quantity}" min="0" required>
      </label>
      
      <label>
        Price per Pack
        <input type="number" id="price_prpk" value="${medicine.price_prpk}" step="0.01" min="0" required>
      </label>
    `;
    
  } catch (err) {
    console.error(err);
    showNotification('Failed to load medicine data', 'error');
    closeModal();
  }
}

async function editSupplier(suppId) {
  try {
    showModal('Edit Supplier');
    showLoading(true);
    
    const response = await fetch(`/api/supplier/${suppId}`);
    if (!response.ok) throw new Error('Failed to fetch supplier data');
    
    const supplier = await response.json();
    showLoading(false);
    
    const formFields = document.getElementById('form-fields');
    formFields.innerHTML = `
      <input type="hidden" id="record-id" value="${supplier.supp_id}">
      <input type="hidden" id="record-type" value="supplier">
      
      <label>
        Supplier Name
        <input type="text" id="supp_name" value="${escapeHtml(supplier.supp_name)}" required>
      </label>
      
      <label>
        Address
        <input type="text" id="supp_add" value="${escapeHtml(supplier.supp_add)}" required>
      </label>
      
      <label>
        Contact
        <input type="text" id="supp_contact" value="${escapeHtml(supplier.supp_contact)}" required>
      </label>
    `;
    
  } catch (err) {
    console.error(err);
    showNotification('Failed to load supplier data', 'error');
    closeModal();
  }
}

// === MODAL FUNCTIONS ===
function showModal(title) {
  const modal = document.getElementById('edit-modal');
  const modalTitle = modal.querySelector('.modal-title');
  modalTitle.textContent = title;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeModal() {
  const modal = document.getElementById('edit-modal');
  modal.classList.remove('show');
  document.body.style.overflow = 'auto'; // Restore scroll
  
  // Clear form
  const formFields = document.getElementById('form-fields');
  formFields.innerHTML = '';
}

function showLoading(isLoading) {
  const formFields = document.getElementById('form-fields');
  if (isLoading) {
    formFields.innerHTML = '<div class="loading-spinner" style="text-align: center; padding: 40px;">Loading...</div>';
  }
}

// === FORM SUBMISSION ===
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const recordId = document.getElementById('record-id').value;
  const recordType = document.getElementById('record-type').value;
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Saving...';
  submitBtn.disabled = true;
  
  try {
    let data = {};
    let endpoint = '';
    
    if (recordType === 'medicine') {
      data = {
        med_name: document.getElementById('med_name').value.trim(),
        quantity: parseInt(document.getElementById('quantity').value),
        price_prpk: parseFloat(document.getElementById('price_prpk').value)
      };
      endpoint = `/api/medicine/${recordId}`;
    } else if (recordType === 'supplier') {
      data = {
        supp_name: document.getElementById('supp_name').value.trim(),
        supp_add: document.getElementById('supp_add').value.trim(),
        supp_contact: document.getElementById('supp_contact').value.trim()
      };
      endpoint = `/api/supplier/${recordId}`;
    }
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Update failed');
    
    showNotification('Record updated successfully!', 'success');
    closeModal();
    
    // Refresh current page
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (err) {
    console.error(err);
    showNotification('Failed to update record', 'error');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// === DELETE FUNCTIONALITY ===
async function deleteRecord(type, id, name) {
  const confirmed = confirm(`Are you sure you want to delete "${name}"?\n\nThis action cannot be undone.`);
  if (!confirmed) return;
  
  try {
    const response = await fetch(`/delete-${type}/${id}`, {
      method: 'POST'
    });
    
    if (response.ok) {
      showNotification('Record deleted successfully!', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      throw new Error('Delete failed');
    }
  } catch (err) {
    console.error(err);
    showNotification('Failed to delete record', 'error');
  }
}

// === ACTION BUTTONS INITIALIZATION ===
function initActionButtons() {
  // Medicine edit buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-medicine-btn')) {
      const medId = e.target.dataset.id;
      editMedicine(medId);
    }
    
    if (e.target.classList.contains('delete-medicine-btn')) {
      const medId = e.target.dataset.id;
      const medName = e.target.dataset.name;
      deleteRecord('medicine', medId, medName);
    }
    
    if (e.target.classList.contains('edit-supplier-btn')) {
      const suppId = e.target.dataset.id;
      editSupplier(suppId);
    }
    
    if (e.target.classList.contains('delete-supplier-btn')) {
      const suppId = e.target.dataset.id;
      const suppName = e.target.dataset.name;
      deleteRecord('supplier', suppId, suppName);
    }
  });
}

// === NOTIFICATION SYSTEM ===
function showNotification(message, type = 'success') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// === UTILITY FUNCTIONS ===
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}