import inventoryData from './inventoryData.js';
import customerData from './customerData.js';

document.getElementById('displayInventoryBtn').addEventListener('click', function () {
    displayData(inventoryData);
});

document.getElementById('displayCustomersBtn').addEventListener('click', function () {
    displayData(customerData);
});

document.getElementById('createSalesOrderBtn').addEventListener('click', createSalesOrderForm);

let itemIdCounter = 1;
let customerSelected = false;

function displayData(data) {
    const dataName = data === inventoryData ? 'Inventory' : 'Customers';
    const dataList = document.getElementById('inventoryList');
    dataList.innerHTML = `<h2>${dataName} List</h2>`;

    const headers = Object.keys(data[0]);

    const table = `
        <table class="inventory-table">
            <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
            ${data.map(item => `
                <tr>${Object.values(item).map(value => `<td>${value}</td>`).join('')}</tr>
            `).join('')}
        </table>
    `;

    dataList.insertAdjacentHTML('beforeend', table);
}

function createSalesOrderForm() {
    document.getElementById('inventoryList').innerHTML = '';

    const salesOrderForm = `
        <div id="salesOrderForm">
            <h2>Create Sales Order</h2>
            <div id="customerInfoHeader">
                <div id="customerDeliveryInfo">
                    <label for="customerID">Customer:</label>
                    <select id="customerID">
                        ${customerData.map(customer => `<option value="${customer.customerID}">${customer.customerID}</option>`).join('')}
                    </select>
                    <button id="acceptCustomerBtn" style="font-size: 11px; height: 22px;">Accept</button>
                    <label for="deliveryDate">Delivery Date:</label>
                    <input type="date" id="deliveryDate">
                </div>
                <div id="totals">
                    <label>Items Total:</label>
                    <span id="itemsTotal">0</span><br>
                    <label>Tax 15%:</label>
                    <span id="tax">0</span><br>
                    <label>Order Total:</label>
                    <span id="orderTotal">0</span>
                </div>
            </div>
            <div id="validationBar">
                <button id="validateBtn">Validate</button>
                <button id="saveBtn">Save</button>
            </div>
            <table id="salesOrderTable" class="inventory-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Material ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category ID</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Price Per Unit</th>
                        <th>Currency</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody id="salesOrderItems">
                    <!-- Rows will be dynamically added here -->
                </tbody>
            </table>
        </div>
    `;

    const existingSalesOrderForm = document.getElementById('salesOrderForm');
    if (existingSalesOrderForm) {
        existingSalesOrderForm.remove();
    }

    document.getElementById('container').insertAdjacentHTML('beforeend', salesOrderForm);

    document.getElementById('validateBtn').addEventListener('click', validateSalesOrder);
    document.getElementById('saveBtn').addEventListener('click', saveSalesOrder);
    document.getElementById('acceptCustomerBtn').addEventListener('click', acceptCustomer);
}

function acceptCustomer() {
    if (!customerSelected) {
        populateMaterialIDs();
        customerSelected = true;
        document.getElementById('customerID').disabled = true;
        document.getElementById('acceptCustomerBtn').disabled = true;
    }
}

function populateMaterialIDs() {
    const customerID = document.getElementById('customerID').value;
    const materialDropdown = document.querySelectorAll('#salesOrderItems td:nth-child(2) select');

    materialDropdown.forEach(select => {
        select.innerHTML = inventoryData.map(material => `<option value="${material.materialID}">${padMaterialID(material.materialID)}</option>`).join('');
    });

    addRowToSalesOrderTable();

    materialDropdown.forEach(select => {
        select.addEventListener('change', populateItemDetails);
    });
}

function populateItemDetails(event) {
    const selectedMaterialID = event.target.value;
    const selectedItem = inventoryData.find(material => material.materialID === selectedMaterialID);
    const selectedRow = event.target.closest('tr');

    if (selectedItem) {
        selectedRow.children[2].textContent = selectedItem.name;
        selectedRow.children[3].textContent = selectedItem.description;
        selectedRow.children[4].textContent = selectedItem.categoryID;
        selectedRow.children[7].textContent = selectedItem.salesPricePerUnit;
        selectedRow.children[8].textContent = selectedItem.currency;

        const quantity = parseInt(selectedRow.children[5].querySelector('input').value);
        const total = quantity * selectedItem.salesPricePerUnit;
        selectedRow.children[9].textContent = total.toFixed(2);
        updateItemsTotal();
    }
}

function updateItemsTotal() {
    const items = document.querySelectorAll('#salesOrderItems tr');
    let itemsTotal = 0;
    items.forEach(item => {
        const total = parseFloat(item.children[9].textContent);
        itemsTotal += total;
    });
    const tax = itemsTotal * 0.15;
    const orderTotal = itemsTotal + tax;
    document.getElementById('itemsTotal').textContent = '$' + itemsTotal.toFixed(2);
    document.getElementById('tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('orderTotal').textContent = '$' + orderTotal.toFixed(2);
}

function padMaterialID(materialID) {
    return String(materialID).padStart(4, '0');
}

function addRowToSalesOrderTable() {
    const salesOrderItems = document.getElementById('salesOrderItems');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${padItemId(itemIdCounter)}</td>
        <td>
            <select>
                <!-- Material IDs will be dynamically added here -->
            </select>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td><input type="number" min="1" value="1" style="width: 40px;"></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    `;
    salesOrderItems.appendChild(newRow);
    itemIdCounter++;

    populateMaterialIDs();
}


function validateSalesOrder() {
    const deliveryDate = new Date(document.getElementById('deliveryDate').value);
    const currentDate = new Date();
    const items = document.querySelectorAll('#salesOrderItems tr');
    let isValid = true;

    if (deliveryDate < currentDate) {
        isValid = false;
        alert('Please select a future delivery date.');
    }

    items.forEach(item => {
        const quantity = parseInt(item.children[5].querySelector('input').value);
        if (quantity < 0 || quantity > inventoryData[item.children[1].querySelector('select').selectedIndex].quantity) {
            isValid = false;
            alert('Invalid quantity for one or more items.');
        }
    });

    if (isValid) {
        alert('Sales order validated successfully!');
        saveSalesOrder();
    }
}

function saveSalesOrder() {
}

function padItemId(itemId) {
    return itemId.toString().padStart(4, '0');
}

createSalesOrderForm();
