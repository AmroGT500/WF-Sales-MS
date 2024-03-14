import inventoryData from './inventoryData.js';
import customerData from './customerData.js';

const displayInventoryBtn = document.getElementById('displayInventoryBtn');
const displayCustomersBtn = document.getElementById('displayCustomersBtn');
const dataList = document.getElementById('dataList');

// Event listeners
displayInventoryBtn.addEventListener('click', () => displayData(inventoryData, 'Inventory'));
displayCustomersBtn.addEventListener('click', () => displayData(customerData, 'Customers'));

function displayData(data, dataName) {
    dataList.innerHTML = `<h2>${dataName} List</h2>`;
    const tableRows = data.map(item => `<tr>${Object.values(item).map(value => `<td>${value}</td>`).join('')}</tr>`).join('');
    const tableHeader = createTableHeader(dataName);
    dataList.insertAdjacentHTML('beforeend', `<table class="inventory-table">${tableHeader}${tableRows}</table>`);
}


// Function to create table header
function createTableHeader(dataName) {
    const headerMap = {
        inventory: ["Material ID", "Name", "Description", "Category ID", "Category Description", "Quantity", "Unit of Measure (UoM)", "Sales Price/Unit", "Currency"],
        customers: ["Customer ID", "Name", "Category ID", "Address", "E-mail", "Credit Line", "Currency", "Status"]
    };
    const headerLabels = headerMap[dataName.toLowerCase()];
    return `<tr>${headerLabels.map(header => `<th>${header}</th>`).join('')}</tr>`;
}


