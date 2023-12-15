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
                    type: 'line',
                    data: {
                        labels: formattedDates,
                        datasets: [{
                            label: '# of Sales',
                            data: orders.map(order => order.totalCount),
                            borderWidth: 2,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: {
                                target: 'origin',
                            },
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    font: {
                                        size: 16,
                                        weight: 'bolder',
                                    },
                                    stepSize: 1, // Set step size to 1 to display only integer values
                                    precision: 0, // Set precision to 0 to avoid decimal places
                                }
                            },
                            x: {
                                ticks: {
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
                            line: {
                                borderWidth: 2,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                tension: 0.4,
                                fill: 'start',
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