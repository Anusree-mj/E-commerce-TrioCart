// adminDashboard.js
document.addEventListener('DOMContentLoaded', function () {
    console.log('entered in fetch')
    fetch('http://localhost:3000/admin/dashboard')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                const orders = data.orders;
                const formattedDates = orders.map(order => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate.toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    });
                });

                const ctx = document.getElementById('myChart');

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels:  formattedDates,
                        datasets: [{
                            label: '# of Votes',
                            data: orders.map(order => order.totalAmount),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
            else {
                console.error('adding graph failed');
            }
        })
        .catch(error => console.error('Error fetching orders:', error));
});