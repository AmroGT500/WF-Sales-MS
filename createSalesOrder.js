import inventoryData from './inventoryData.js';
import customerData from './customerData.js';


// Display sales order form //
function displaySalesOrderForm() {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';
    
    const salesOrderForm = `
        <div id="salesOrderForm">
            <h2>WholeFoods, Jhang</h2>
            <p>138 Iqbal Road, Jhang, Pakistan +92-333-555-1212 wholefoods@wfj.com</p>
            <table id="orderDetailsTable">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Delivery Date</th>
                        <th>Items Total $</th>
                        <th>15% Tax</th>
                        <th>Order Total $</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td id="customerCell"></td>
                        <td><input type="date" id="deliveryDate"></td>
                        <td id="itemsTotalPlaceholder">Placeholder for Items Total $</td>
                        <td id="taxPlaceholder">Placeholder for 15% Tax</td>
                        <td id="orderTotalPlaceholder">Placeholder for Order Total $</td>
                    </tr>
                </tbody>
            </table>
            <button id="addItemBtn" class="add-item-btn">Add Item</button>
            <table id="salesOrderTable" class="inventory-table">
                <thead>
                    <tr>
                    </tr>
                </thead>
                <tbody id="salesOrderItems">
                </tbody>
            </table>
            <div id="validationBar" style="display: none;">
                <button id="validateBtn">Validate</button>
                <button id="saveBtn">Save</button>
            </div>
        </div>
    `;

    dataList.insertAdjacentHTML('beforeend', salesOrderForm);

    // customer selector //
    const customerCell = document.getElementById('customerCell');
    const customerSelector = document.createElement('select');
    customerSelector.id = 'customerSelector';
    customerData.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.customerID;
        option.textContent = customer.name;
        customerSelector.appendChild(option);
    });
    customerCell.appendChild(customerSelector);

    document.getElementById('addItemBtn').addEventListener('click', addRowToSalesOrderTable);
    document.getElementById('validateBtn').addEventListener('click', validateSalesOrder);
    document.getElementById('saveBtn').addEventListener('click', saveSalesOrder);

    // initialize placeholders //
    updatePlaceholders();
}

document.getElementById('createSalesOrderBtn').addEventListener('click', displaySalesOrderForm);

// add row to order table //
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

    // listen for input event on the quantity input field //
    const quantityInput = newRow.querySelector('.quantity');
    quantityInput.addEventListener('input', function() {
        updateTotal(newRow);
        updatePlaceholders(); // update placeholders when quantity changes //
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

    // listen for change event on the material ID selector //
    materialIdSelector.addEventListener('change', function() {
        const selectedMaterialID = this.value;
        const selectedMaterial = inventoryData.find(item => item.materialID === selectedMaterialID);
        if (selectedMaterial) {
            // update row with selected material's data //
            row.querySelector('.name').textContent = selectedMaterial.name;
            row.querySelector('.description').textContent = selectedMaterial.description;
            row.querySelector('.category-id').textContent = selectedMaterial.categoryID;
            row.querySelector('.unit').textContent = selectedMaterial.uom;
            row.querySelector('.price-per-unit').textContent = selectedMaterial.salesPricePerUnit;
            row.querySelector('.currency').textContent = selectedMaterial.currency;
        }
    });
}

// update placeholders for Items Total, Tax, and Order Total //
function updatePlaceholders() {
    const salesOrderItems = document.getElementById('salesOrderItems');
    const totalElements = salesOrderItems.querySelectorAll('.total');
    let itemsTotal = 0;
    totalElements.forEach(element => {
        itemsTotal += parseFloat(element.textContent);
    });

    const itemsTotalPlaceholder = document.getElementById('itemsTotalPlaceholder');
    itemsTotalPlaceholder.textContent = itemsTotal.toFixed(2);

    const taxPlaceholder = document.getElementById('taxPlaceholder');
    const tax = itemsTotal * 0.15; 
    taxPlaceholder.textContent = tax.toFixed(2);

    const orderTotalPlaceholder = document.getElementById('orderTotalPlaceholder');
    const orderTotal = itemsTotal + tax;
    orderTotalPlaceholder.textContent = orderTotal.toFixed(2);
}

// Validation and Save //
function validateSalesOrder() {
}

function saveSalesOrder() {
}
