import customerData from './customerData.js';
import inventoryData from './inventoryData.js';

// Function to display the sales order form
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
                        <th>Customer ID</th> <!-- Change here -->
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
                        <td id="itemsTotalPlaceholder"></td>
                        <td id="taxPlaceholder"></td>
                        <td id="orderTotalPlaceholder"></td>
                    </tr>
                </tbody>
            </table>
            <button id="addItemBtn" class="add-item-btn">Add Item</button>
            <table id="salesOrderTable" class="inventory-table">
                <thead id="salesOrderHeader"> <!-- Moved the header to a separate section -->
                    <tr>
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
                    </tr>
                </thead>
                <tbody id="salesOrderItems">
                </tbody>
            </table>
            <div id="validationBar" style="display: none;">
                <button id="validateBtn">Validate</button>
                <button id="saveBtn" disabled>Save</button> <!-- Disable the save button initially -->
                <div id="validationMessage"></div>
            </div>
        </div>
    `;

    dataList.insertAdjacentHTML('beforeend', salesOrderForm);

    // Populate customer selector and add event listeners
    const customerCell = document.getElementById('customerCell');
    const customerSelector = document.createElement('select');
    customerSelector.id = 'customerSelector';
    customerData.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.customerID;
        option.textContent = customer.customerID; // Change here
        customerSelector.appendChild(option);
    });
    customerCell.appendChild(customerSelector);




    // Add event listeners
    document.getElementById('addItemBtn').addEventListener('click', addRowToSalesOrderTable);
    document.getElementById('validateBtn').addEventListener('click', validateAndSave);
}
export default displaySalesOrderForm; 



// Function to validate and save the sales order
function validateAndSave() {
    const tempTable = [];
    const isValid = validateSalesOrder(tempTable);

    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = !isValid;

    const validationMessage = document.getElementById('validationMessage');

    if (isValid) {
        validationMessage.textContent = "Validation successful!";
        validationMessage.classList.remove('error');
        validationMessage.classList.add('success');
        setTimeout(() => {
            validationMessage.textContent = '';
        }, 5000);
        saveRowToTempTable(tempTable);
    } else {
        validationMessage.textContent = "Validation failed! Please check the form.";
        validationMessage.classList.remove('success');
        validationMessage.classList.add('error');
        setTimeout(() => {
            validationMessage.textContent = '';
        }, 5000);
    }
}




// Function to add a new row/item to the sales order table
function addRowToSalesOrderTable() {
    const salesOrderItems = document.getElementById('salesOrderItems');

    // Generate item ID
    const itemIdCounter = salesOrderItems.children.length;

    // Create new row
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${(itemIdCounter + 1).toString().padStart(4, '0')}</td>
        <td>
            <select class="material-id-selector">
                <option value="">Select Material ID</option>
                <!-- Populate options dynamically -->
            </select>
        </td>
        <td class="name"></td>
        <td class="description"></td>
        <td class="category-id"></td>
        <td><input type="number" min="1" value="1" style="width: 40px;" class="quantity"></td>
        <td class="unit"></td>
        <td class="price-per-unit"></td>
        <td class="currency"></td>
        <td class="total"></td>
    `;
    salesOrderItems.appendChild(newRow);

    // Populate material ID options
    populateMaterialIdOptions(newRow);

    // Display validation bar if hidden
    const validationBar = document.getElementById('validationBar');
    if (validationBar.style.display === 'none') {
        validationBar.style.display = 'flex';
    }

    // Listen for quantity input changes
    const quantityInput = newRow.querySelector('.quantity');
    quantityInput.addEventListener('input', function () {
        updateTotal(newRow);
        updatePlaceholders();
    });

    // Re-validate and update the "Save" button status
    validateAndSave();
}




// Function to populate material ID options
function populateMaterialIdOptions(row) {
    const materialIdSelector = row.querySelector('.material-id-selector');

    inventoryData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.materialID;
        option.textContent = item.materialID;
        materialIdSelector.appendChild(option);
    });

    // Listen for change event on the material ID selector
    materialIdSelector.addEventListener('change', function () {
        const selectedMaterialID = this.value;
        const selectedMaterial = inventoryData.find(item => item.materialID === selectedMaterialID);
        if (selectedMaterial) {
            row.querySelector('.name').textContent = selectedMaterial.name;
            row.querySelector('.description').textContent = selectedMaterial.description;
            row.querySelector('.category-id').textContent = selectedMaterial.categoryID;
            row.querySelector('.unit').textContent = selectedMaterial.uom;
            row.querySelector('.price-per-unit').textContent = selectedMaterial.salesPricePerUnit;
            row.querySelector('.currency').textContent = selectedMaterial.currency;
        }
    });
}




// Function to update total in a row
function updateTotal(row) {
    const quantity = parseInt(row.querySelector('.quantity').value);
    const pricePerUnit = parseFloat(row.querySelector('.price-per-unit').textContent);
    const total = quantity * pricePerUnit;
    row.querySelector('.total').textContent = total.toFixed(2);
}




// Function to update placeholders for items total, tax, and order total
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




// Function to validate the sales order
function validateSalesOrder(tempTable) {
    saveRowToTempTable(tempTable);

    let isValid = true;
    const tempQuantityMap = new Map();

    tempTable.forEach(orderObj => {
        if (orderObj.materialID) {
            if (!tempQuantityMap.has(orderObj.materialID)) {
                tempQuantityMap.set(orderObj.materialID, orderObj.quantity);
            } else {
                tempQuantityMap.set(orderObj.materialID, tempQuantityMap.get(orderObj.materialID) + orderObj.quantity);
            }
        }
    });

    const deliveryDate = document.getElementById('deliveryDate').value;
    // Check if delivery date is selected and is a valid future date
    if (!deliveryDate || new Date(deliveryDate) <= new Date()) {
        isValid = false;
        displayValidationMessage("Please select a valid future delivery date.");
    }

    const salesOrderItems = document.getElementById('salesOrderItems').querySelectorAll('tr');
    salesOrderItems.forEach(row => {
        const materialID = row.querySelector('.material-id-selector').value;
        const orderQuantity = parseInt(row.querySelector('.quantity').value);

        // Check if quantity is below 1 or exceeds stock
        if (orderQuantity < 1 || (materialID && orderQuantity > getAvailableStock(materialID, tempQuantityMap))) {
            isValid = false;
            displayValidationMessage("Validation failed: Quantity exceeds available stock or is invalid.");
        }
    });

    return isValid; // Return validation status
}




// Function to display validation message
function displayValidationMessage(message) {
    const validationMessage = document.getElementById('validationMessage');
    validationMessage.textContent = message;
    validationMessage.classList.remove('success');
    validationMessage.classList.add('error');
    setTimeout(() => {
        validationMessage.textContent = '';
    }, 5000);
}




// Function to get available stock for a material ID
function getAvailableStock(materialID, tempQuantityMap) {
    const inventoryItem = inventoryData.find(item => item.materialID === materialID);
    return inventoryItem ? (inventoryItem.quantity - (tempQuantityMap.get(materialID) || 0)) : 0;
}




// Function to save data to tempTable 
function saveRowToTempTable(tempTable) {
    const salesOrderItems = document.getElementById('salesOrderItems');
    const rows = salesOrderItems.querySelectorAll('tr');

    const customerID = document.getElementById('customerSelector').value;
    const customer = customerData.find(customer => customer.customerID === customerID);
    const customerName = customer ? customer.name : '';

    const deliveryDate = document.getElementById('deliveryDate').value;
    const itemsTotal = parseFloat(document.getElementById('itemsTotalPlaceholder').textContent);
    const tax = parseFloat(document.getElementById('taxPlaceholder').textContent);
    const orderTotal = parseFloat(document.getElementById('orderTotalPlaceholder').textContent);
    const currency = 'PKR';

    // Clear the tempTable before pushing new data
    tempTable.length = 0;

    // Push each row's data to tempTable
    rows.forEach(row => {
        const itemID = row.querySelector('td').textContent;
        const materialID = row.querySelector('.material-id-selector').value;
        const name = row.querySelector('.name').textContent;
        const description = row.querySelector('.description').textContent;
        const categoryID = row.querySelector('.category-id').textContent;
        const quantity = parseInt(row.querySelector('.quantity').value);
        const unit = row.querySelector('.unit').textContent;
        const pricePerUnit = parseFloat(row.querySelector('.price-per-unit').textContent);
        const total = parseFloat(row.querySelector('.total').textContent);

        const salesOrderObj = {
            customer: customerName,
            customerID,
            deliveryDate,
            itemsTotal,
            tax,
            orderTotal,
            currency,
            itemID,
            materialID,
            name,
            description,
            categoryID,
            quantity,
            unit,
            pricePerUnit,
            total
        };

        tempTable.push(salesOrderObj);
    });

    console.log(tempTable);
}



// Event listener for DOMContentLoaded to initialize
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('createSalesOrderBtn').addEventListener('click', displaySalesOrderForm);
});