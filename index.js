import mockData from './mockData.js';

document.getElementById('displayInventoryBtn').addEventListener('click', function () {
    displayInventory(mockData);
});

function displayInventory(inventory) {
    const inventoryList = document.getElementById('inventoryList');
    inventoryList.innerHTML = '<h2>Inventory List</h2>';

    const headers = ['Material ID', 'Name', 'Description', 'Category ID', 'Category Description', 'Quantity', 'Unit of Measure', 'Sales Price Per Unit', 'Currency'];

    const table = `
        <table class="inventory-table">
            <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
            ${inventory.map(item => `
                <tr>${Object.values(item).map(value => `<td>${value}</td>`).join('')}</tr>
            `).join('')}
        </table>
    `;

    inventoryList.insertAdjacentHTML('beforeend', table);
}
