import inventoryData from './inventoryData.js';



// Display sales order form //
function displaySalesOrderForm() {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';
    
    const salesOrderForm = `
        <div id="salesOrderForm">
            <h2>Sales Order</h2>
            <!-- Add your form elements here -->
            <button id="addItemBtn">Add Item</button>
            <table id="salesOrderTable" class="inventory-table">
                <thead>
                    <tr>
                        <!-- Define your table headers -->
                    </tr>
                </thead>
                <tbody id="salesOrderItems">
                    <!-- Rows will be dynamically added here -->
                </tbody>
            </table>
            <div id="validationBar" style="display: none;">
                <button id="validateBtn">Validate</button>
                <button id="saveBtn">Save</button>
            </div>
        </div>
    `;

    dataList.insertAdjacentHTML('beforeend', salesOrderForm);

    document.getElementById('addItemBtn').addEventListener('click', addRowToSalesOrderTable);
    document.getElementById('validateBtn').addEventListener('click', validateSalesOrder);
    document.getElementById('saveBtn').addEventListener('click', saveSalesOrder);
}

document.getElementById('createSalesOrderBtn').addEventListener('click', displaySalesOrderForm);




// Add a row to the sales order table //
let isFirstAdd = true;
let itemIdCounter = 0;

function addRowToSalesOrderTable() {
    const salesOrderItems = document.getElementById('salesOrderItems');

    if (isFirstAdd) {
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Item</th>
            <th>Material ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Category ID</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Price per Unit</th>
            <th>Currency</th>
            <th>Total</th>
        `;
        salesOrderItems.appendChild(headerRow);
        isFirstAdd = false; 
    }

    itemIdCounter++;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${itemIdCounter.toString().padStart(4, '0')}</td> <!-- Item ID -->
        <td>
            <select class="material-id-selector">
                <option value="">Select Material ID</option>
                <!-- Populate options dynamically -->
            </select>
        </td>
        <td class="name"></td> <!-- Placeholder for Name -->
        <td class="description"></td> <!-- Placeholder for Description -->
        <td class="category-id"></td> <!-- Placeholder for Category ID -->
        <td><input type="number" min="1" value="1" style="width: 40px;" class="quantity"></td> <!-- Quantity -->
        <td class="unit"></td> <!-- Placeholder for Unit -->
        <td class="price-per-unit"></td> <!-- Placeholder for Price Per Unit -->
        <td class="currency"></td> <!-- Placeholder for Currency -->
        <td class="total"></td> <!-- Placeholder for Total -->
    `;
    salesOrderItems.appendChild(newRow);

    populateMaterialIdOptions(newRow);

    const validationBar = document.getElementById('validationBar');
    if (validationBar.style.display === 'none') {
        validationBar.style.display = 'flex';
    }

    // Listen for input event on the quantity input field //
    const quantityInput = newRow.querySelector('.quantity');
    quantityInput.addEventListener('input', function() {
        updateTotal(newRow);
    });
}

function updateTotal(row) {
    const quantity = parseInt(row.querySelector('.quantity').value);
    const pricePerUnit = parseFloat(row.querySelector('.price-per-unit').textContent);
    const total = quantity * pricePerUnit;
    row.querySelector('.total').textContent = total.toFixed(2);
}

function populateMaterialIdOptions(row) {
    const materialIdSelector = row.querySelector('.material-id-selector');

    inventoryData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.materialID;
        option.textContent = item.materialID;
        materialIdSelector.appendChild(option);
    });

    // Listen for change event on the material ID selector //
    materialIdSelector.addEventListener('change', function() {
        const selectedMaterialID = this.value;
        const selectedMaterial = inventoryData.find(item => item.materialID === selectedMaterialID);
        if (selectedMaterial) {
            // Update row with selected material data //
            row.querySelector('.name').textContent = selectedMaterial.name;
            row.querySelector('.description').textContent = selectedMaterial.description;
            row.querySelector('.category-id').textContent = selectedMaterial.categoryID;
            row.querySelector('.unit').textContent = selectedMaterial.uom;
            row.querySelector('.price-per-unit').textContent = selectedMaterial.salesPricePerUnit;
            row.querySelector('.currency').textContent = selectedMaterial.currency;
        }
    });
}




// Validation and Save //
function validateSalesOrder() {
}

function saveSalesOrder() {
}
