function clearSpan(spanId) {
    document.getElementById(spanId).textContent = ''
}

function getDailySales(day) {
    let date;
    if (day === 'today') {
        date = new Date();
    } else if (day === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        date = yesterday;
    } else if (day === 'custom') {
        const customDateValue = document.getElementById('dailyCustom').value;
        if (customDateValue) {
            date = new Date(customDateValue);
        } else {
            document.getElementById('dailyCustomSpan').textContent = '*Please select a date'
        }
    }

    let url = `http://localhost:3000/admin/sales?day=${date}`;
    window.location.replace(url)
}

//yearly sale 
function getYearlySales(yearRecieved) {
    let year;
    if (yearRecieved === 'thisYear') {
        year = new Date().getFullYear();
    }
    else
        if (yearRecieved === 'lastYear') {
            const lastYear = new Date();
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            year = lastYear.getFullYear();
        }
        else
            if (yearRecieved === 'custom') {
                const customYearValue = document.getElementById('yearInput').value;
                if (customYearValue) {
                    year = customYearValue;
                }
                else {
                    document.getElementById('dailyCustomSpan').textContent = '*Please select a date'
                }
            }

    let url = `http://localhost:3000/admin/sales?yearly=${year}`;
    window.location.replace(url)
}

// weeklysale
function getWeeklySales(weakReceived) {
    let start;
    let end;

    if (weakReceived === 'thisWeek') {
        start = new Date();
        end = new Date();
        end.setDate(end.getDate() - 7);

        let url = `http://localhost:3000/admin/sales?startingWeak=${start}&endingWeak=${end}`;
        window.location.replace(url);
    } else if (weakReceived === 'custom') {
        const startingWeakValue = document.getElementById('startPoint').value;
        const endingWeakValue = document.getElementById('endPoint').value;

        if (startingWeakValue && endingWeakValue) {
            start = new Date(startingWeakValue);
            end = new Date(endingWeakValue);

            let url = `http://localhost:3000/admin/sales?startingWeak=${start}&endingWeak=${end}`;
            window.location.replace(url);
        } else {
            document.getElementById('weaklyCustomSpan').textContent = '*Please select a date';
        }
    }
}
