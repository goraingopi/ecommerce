// ----------- CONFIG -------------
// IMPORTANT: Change this if your backend runs on a different host/port.
const API_BASE_URL = "http://localhost:8087/api/products";

// If you see CORS errors in the browser console, make sure your Spring controller allows your origin:
// @CrossOrigin(origins = "http://127.0.0.1:5500")  // if you open index.html with Live Server (VS Code)
// or use: @CrossOrigin(origins = "*")               // for development only
// Your current code has: @CrossOrigin(origins = "http://") which is invalid.
// --------------------------------

const els = {
  addForm: document.getElementById("addProductForm"),
  getByIdForm: document.getElementById("getByIdForm"),
  idInput: document.getElementById("productIdInput"),
  tableBody: document.querySelector("#productsTable tbody"),
  singleProduct: document.getElementById("singleProduct"),
  refreshBtn: document.getElementById("refreshBtn"),
  toast: document.getElementById("toast"),
  loader: document.getElementById("loader"),
};

function showLoader(show) {
  if (show) els.loader.classList.remove("hide");
  else els.loader.classList.add("hide");
}

function toast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function formatPrice(n) {
  if (typeof n !== "number") return n;
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

// ----------- API HELPERS -------------
async function apiGetAll() {
  const res = await fetch(`${API_BASE_URL}/getallproducts`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

async function apiCreate(product) {
  const res = await fetch(`${API_BASE_URL}/addproduct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to create product (${res.status}) ${text}`);
  }
  return res.json();
}

async function apiGetById(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
  return res.json();
}

async function apiDelete(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete product: ${res.status}`);
  return true;
}

// ----------- UI RENDERERS -------------
function renderTable(products) {
  els.tableBody.innerHTML = "";
  if (!Array.isArray(products) || products.length === 0) {
    els.tableBody.innerHTML = `
      <tr><td colspan="5"><span class="badge">No products found</span></td></tr>
    `;
    return;
  }

  for (const p of products) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id ?? "-"}</td>
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.description ?? "")}</td>
      <td>${typeof p.price === "number" ? formatPrice(p.price) : p.price}</td>
      <td>
        <div class="actions">
          <button class="action-del" data-del="${p.id}">Delete</button>
        </div>
      </td>
    `;
    els.tableBody.appendChild(tr);
  }

  // attach delete handlers
  els.tableBody.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.getAttribute("data-del");
      if (!confirm(`Delete product #${id}?`)) return;
      try {
        showLoader(true);
        await apiDelete(id);
        toast(`Deleted product #${id}`);
        await refresh();
      } catch (err) {
        console.error(err);
        toast(err.message || "Delete failed");
      } finally {
        showLoader(false);
      }
    });
  });
}

function renderSingle(product) {
  els.singleProduct.classList.remove("hide");
  if (!product) {
    els.singleProduct.innerHTML = `<p class="empty">No product found with that ID.</p>`;
    return;
  }
  els.singleProduct.innerHTML = `
    <div>
      <p><strong>ID:</strong> ${product.id}</p>
      <p><strong>Name:</strong> ${escapeHtml(product.name)}</p>
      <p><strong>Description:</strong> ${escapeHtml(
        product.description ?? ""
      )}</p>
      <p><strong>Price:</strong> ${
        typeof product.price === "number"
          ? formatPrice(product.price)
          : product.price
      }</p>
    </div>
  `;
}

// ----------- UTIL -------------
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ----------- EVENTS -------------
async function refresh() {
  try {
    showLoader(true);
    const products = await apiGetAll();
    renderTable(products);
  } catch (err) {
    console.error(err);
    toast(err.message || "Failed to load products");
  } finally {
    showLoader(false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  refresh();

  els.refreshBtn.addEventListener("click", refresh);

  els.addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const description = e.target.description.value.trim();
    const priceRaw = e.target.price.value.trim();

    if (!name) {
      toast("Name is required");
      return;
    }
    if (!priceRaw || isNaN(priceRaw)) {
      toast("Valid price is required");
      return;
    }

    const product = {
      name,
      description: description || null,
      price: parseFloat(priceRaw),
    };

    try {
      showLoader(true);
      await apiCreate(product);
      toast("Product added");
      e.target.reset();
      await refresh();
    } catch (err) {
      console.error(err);
      toast(err.message || "Failed to add product");
    } finally {
      showLoader(false);
    }
  });

  els.getByIdForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = Number(els.idInput.value);
    if (!id || id < 1) {
      toast("Enter a valid ID");
      return;
    }

    try {
      showLoader(true);
      const product = await apiGetById(id);
      renderSingle(product);
    } catch (err) {
      console.error(err);
      toast(err.message || "Failed to fetch product");
    } finally {
      showLoader(false);
    }
  });
});
