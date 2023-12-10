// adminDashboard.js
document.addEventListener('DOMContentLoaded', function () {
    console.log('entered in fetch')
    fetch('http://localhost:3000/admin/dashboard')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                const orders = data.orders;

                const orderDates = orders.map(order => new Date
                    (order._id.year, order._id.month - 1, order._id.day));
                orderDates.sort((a, b) => a - b);
                const formattedDates = orderDates.map(orderDate => orderDate.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }));

                const lineGraph = document.getElementById('ordersPerDay');

                new Chart(lineGraph, {
                    type: 'bar',
                    data: {
                        labels: formattedDates,
                        datasets: [{
                            label: '# of Sales',
                            data: orders.map(order => order.totalCount),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    // Customize the y-axis label font size and font weight
                                    font: {
                                        size: 16,
                                        weight: 'bolder',
                                    }
                                }
                            },
                            x: {
                                ticks: {
                                    // Customize the x-axis label font size and font weight
                                    font: {
                                        size: 16,
                                        weight: 'bolder',
                                    }
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return context.dataset.label + ': ' + context.formattedValue;
                                    }
                                }
                            }
                        },
                        elements: {
                            bar: {
                                borderWidth: 2, // Adjust bar border width
                                borderColor: 'rgba(75, 192, 192, 1)', // Adjust bar border color
                                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Adjust bar background color
                            },
                        }
                    }
                });

                const pieChart = document.getElementById('ordersTotalAmount');

                new Chart(pieChart, {
                    type: 'pie',
                    data: {
                        labels: formattedDates,
                        datasets: [{
                            label: '# total sales',
                            data: orders.map(order => order.totalPrice),
                            borderWidth: 1
                        }]
                    },
                    options: {

                        scales: {
                            x: { // Hide x-axis
                                display: false
                            },
                            y: { // Hide y-axis
                                display: false
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const dataIndex = context.dataIndex;
                                        const totalSales = orders[dataIndex].totalPrice;
                                        return 'Total Sales: ₹' + totalSales;
                                    }
                                },
                                title: {
                                    // Customize tooltip title font size and weight
                                    font: {
                                        size: 16,
                                        weight: 'bold',
                                    }
                                },
                                body: {
                                    // Customize tooltip body font size and weight
                                    font: {
                                        size: 24,
                                        weight: 'bold',
                                    }
                                }
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