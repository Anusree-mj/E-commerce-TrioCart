document.addEventListener('DOMContentLoaded', function () {
    console.log('entered in fetch')
    fetch('http://localhost:3000/admin/dashboard')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                const orders = data.orders;
                createLineGraph(orders);
                createPieChart(orders);
            } else {
                console.error('adding graph failed');
            }
        })
        .catch(error => console.error('Error fetching orders:', error));

    function createLineGraph(orders) {
        const orderWeeks = Array.from({ length: 5 }, (_, weekIndex) => {
            const startDay = weekIndex * 7 + 1;
            const endDay = Math.min((weekIndex + 1) * 7, 31); // Assuming a month has at most 31 days
            const weekOrders = orders.filter(order => order._id.day >= startDay && order._id.day <= endDay);
            const totalCount = weekOrders.reduce((total, order) => total + order.totalCount, 0);
            return {
                startDay,
                endDay,
                totalCount,
            };
        });

        const formattedDates = orderWeeks.map(week => `${week.startDay}-${week.endDay} Dec`);

        const lineGraph = document.getElementById('ordersPerDay');
        new Chart(lineGraph, {
            type: 'line',
            data: {
                labels: formattedDates,
                datasets: [{
                    label: '# of Sales',
                    data: orderWeeks.map(week => week.totalCount),
                    borderWidth: 2,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: {
                        target: 'origin',
                    },
                    pointRadius: 0,
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
                            stepSize: 1,
                            precision: 0,
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
    }

    function createPieChart(orders) {
        const pieChart = document.getElementById('ordersTotalAmount');
        const orderDates = orders.map(order => new Date
            (order._id.year, order._id.month - 1, order._id.day));
        orderDates.sort((a, b) => a - b);
        const formattedDatesPieGraph = orderDates.map(orderDate => orderDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }));

        new Chart(pieChart, {
            type: 'pie',
            data: {
                labels: formattedDatesPieGraph,
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
                            font: {
                                size: 16,
                                weight: 'bold',
                            }
                        },
                        body: {
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
});
