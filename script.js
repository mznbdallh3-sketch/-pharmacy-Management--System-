const STORAGE_KEY = "pharmacy_medicines_v1";

let medicines = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const totalCount = document.getElementById("totalCount");
const lowCount = document.getElementById("lowCount");
const medicineForm = document.getElementById("medicineForm");
const medicineIdInput = document.getElementById("medicineId");
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const expiryInput = document.getElementById("expiry");
const saveBtn = document.getElementById("saveBtn");
const cancelEditBtn = document.getElementById("cancelEdit");
const formTitle = document.getElementById("formTitle");
const searchInput = document.getElementById("search");
const medicineRows = document.getElementById("medicineRows");
const emptyMessage = document.getElementById("emptyMessage");

function saveStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
}

function getStatus(qty, expiry) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const expDate = new Date(expiry);
  if (expDate < today) return { text: "Expired", class: "expired" };
  if (qty <= 5) return { text: "Low stock", class: "low" };
  return { text: "In stock", class: "" };
}

function render() {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(query) ||
    m.category.toLowerCase().includes(query)
  );

  medicineRows.innerHTML = "";
  totalCount.textContent = medicines.length;
  lowCount.textContent = medicines.filter(m => m.quantity <= 5).length;

  if (filtered.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }
  emptyMessage.style.display = "none";

  filtered.forEach(med => {
    const status = getStatus(med.quantity, med.expiry);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${med.name}</td>
      <td>${med.category}</td>
      <td>${med.quantity}</td>
      <td>$${Number(med.price).toFixed(2)}</td>
      <td>${med.expiry}</td>
      <td><span class="status ${status.class}">${status.text}</span></td>
      <td>
        <button class="action edit" onclick="editMedicine('${med.id}')">Edit</button>
        <button class="action delete" onclick="deleteMedicine('${med.id}')">Delete</button>
      </td>
    `;
    medicineRows.appendChild(tr);
  });
}

function resetForm() {
  medicineForm.reset();
  medicineIdInput.value = "";
  formTitle.textContent = "Add a medicine";
  saveBtn.textContent = "Add medicine";
  cancelEditBtn.classList.add("hidden");
}

medicineForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    id: medicineIdInput.value || Date.now().toString(),
    name: nameInput.value.trim(),
    category: categoryInput.value.trim(),
    quantity: parseInt(quantityInput.value),
    price: parseFloat(priceInput.value),
    expiry: expiryInput.value
  };

  if (medicineIdInput.value) {
    const index = medicines.findIndex(m => m.id === medicineIdInput.value);
    if (index > -1) medicines[index] = data;
  } else {
    medicines.unshift(data);
  }

  saveStorage();
  render();
  resetForm();
});

window.editMedicine = (id) => {
  const med = medicines
