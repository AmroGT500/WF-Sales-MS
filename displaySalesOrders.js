import displaySalesOrderForm from './createSalesOrder.js';

// Dummy sales order data for testing
const salesOrderData = [
    {
        deliveryDate: '2024-01-12',
        itemsTotal: 31000,
        tax: 4650,
        currency: 'PKR',
        items: [
            { quantity: 70, uom: 'DZ', pricePerUnit: 300, currency: 'PKR' },
            { quantity: 100, uom: 'DZ', pricePerUnit: 100, currency: 'PKR' }
        ]
    },
    {
        deliveryDate: '2024-02-04',
        itemsTotal: 271500,
        tax: 40725,
        currency: 'PKR',
        items: [
            { quantity: 25, uom: 'DZ', pricePerUnit: 300, currency: 'PKR' },
            { quantity: 90, uom: 'DZ', pricePerUnit: 100, currency: 'PKR' },
            { quantity: 34, uom: 'KG', pricePerUnit: 3000, currency: 'PKR' },
            { quantity: 17, uom: 'KG', pricePerUnit: 9000, currency: 'PKR' }
        ]
    }
];

// Function to display sales order header
function displaySalesOrderHeader(order) {
    const header = `
        <div class="sales-order-header">
            <h3>Sales Order Header</h3>
            <table>
                <tr>
                    <td>Delivery Date</td>
                    <td>Total Price</td>
                    <td>15% Tax</td>
                    <td>Currency</td>
                </tr>
                <tr>
                    <td>${order.deliveryDate}</td>
                    <td>${order.itemsTotal}</td>
                    <td>${order.tax}</td>
                    <td>${order.currency}</td>
                </tr>
            </table>
        </div>
    `;
    return header;
}

// Function to display sales order items
function displaySalesOrderItems(items) {
    const itemTable = `
        <div class="sales-order-items">
            <h3>Sales Order Item</h3>
            <table>
                <tr>
                    <td>Order Quantity</td>
                    <td>Unit of Measure (UoM)</td>
                    <td>Price/Unit</td>
                    <td>Currency</td>
                </tr>
                ${items.map(item => `
                    <tr>
                        <td>${item.quantity}</td>
                        <td>${item.uom}</td>
                        <td>${item.pricePerUnit}</td>
                        <td>${item.currency}</td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
    return itemTable;
}

// Function to display sales orders
function displaySalesOrders() {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';

    salesOrderData.forEach(order => {
        const salesOrderHTML = `
            <div class="sales-order">
                ${displaySalesOrderHeader(order)}
                ${displaySalesOrderItems(order.items)}
            </div>
        `;
        dataList.insertAdjacentHTML('beforeend', salesOrderHTML);
    });
}


document.addEventListener('DOMContentLoaded', function () {

    const listSalesOrdersBtn = document.getElementById('listSalesOrdersBtn');
    

    listSalesOrdersBtn.addEventListener('click', displaySalesOrders);
});
