function clearSpan(spanId) {
    document.getElementById(spanId).textContent = ''
}

function getDailySales(day) {
    let date;
    if (day === 'today') {
        date = new Date();
        console.log('date in today', date)
    } else if (day === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        date = yesterday;
        console.log('date in yesterday', date)
    } else if (day === 'custom') {
        const customDateValue = document.getElementById('dailyCustom').value;
        if (customDateValue) {
            date = new Date(customDateValue);
            console.log('dateincustom', date)
        } else {
            document.getElementById('dailyCustomSpan').textContent = '*Please select a date'
        }
    }
    console.log('datebeing passed', date)

    let url = `http://localhost:3000/admin/sales?day=${date}`;
    window.location.replace(url)
}

//yearly sale 
function getYearlySales(yearRecieved) {
    let year;
    if (yearRecieved === 'thisYear') {
        year = new Date().getFullYear();
        console.log('date in today', year)
    }
    else
        if (yearRecieved === 'lastYear') {
            const lastYear = new Date();
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            year = lastYear.getFullYear();
            console.log('year in last year', year);
        }
        else
            if (yearRecieved === 'custom') {
                const customYearValue = document.getElementById('yearInput').value;
                if (customYearValue) {
                    year = customYearValue;
                    console.log('dateincustom', year)
                }
                else {
                    document.getElementById('dailyCustomSpan').textContent = '*Please select a date'
                }
            }
    console.log('datebeing passed', year);

    let url = `http://localhost:3000/admin/sales?yearly=${year}`;
    window.location.replace(url)
}

// weeklysale
function getWeeklySales(weakReceived) {
    console.log('entered in weeklly sales')
    let start;
    let end;

    if (weakReceived === 'thisWeek') {
        start = new Date();
        end = new Date();
        end.setDate(end.getDate() - 7);
        console.log('date in today', start, end);       

        let url = `http://localhost:3000/admin/sales?startingWeak=${start}&endingWeak=${end}`;
        window.location.replace(url);
    } else if (weakReceived === 'custom') {
        const startingWeakValue = document.getElementById('startPoint').value;
        const endingWeakValue = document.getElementById('endPoint').value;

        if (startingWeakValue && endingWeakValue) {
            start = new Date(startingWeakValue);
            end = new Date(endingWeakValue);

            console.log('date in custom', start, end);           

            let url = `http://localhost:3000/admin/sales?startingWeak=${start}&endingWeak=${end}`;
            window.location.replace(url);
        } else {
            document.getElementById('weaklyCustomSpan').textContent = '*Please select a date';
        }
    }
}
