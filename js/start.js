(function() {
    console.log('this is getting called straight away')
    if (!sessionStorage.user_name) {
        sessionStorage.user_name = 'user_1' // when login is done change this to redirect to login page.
    }

    var url = new URL(window.location.href)
    var success = url.searchParams.get('success')

    console.log(success)
    if (success != null) {
        if (success == 'true') alert('Upload was sucessful')
        else alert('Upload was unsuccessful, please try again later')
    }

    request('GET', '/latest_barcode', (barcode)=> {
            sessionStorage.latest_barcode = barcode
            console.log(barcode)
    })
})()

function request(method, url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText)
        }
    };
    xhttp.open(method, url, true);
    xhttp.send();
}