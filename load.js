


   base_url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?location=47.212305,%20-1.555840&type=bar&radius=600&key=AIzaSyDcTTk48WN-xeLgJB_YIfeRTCQ7i25Icsg';

    array_bar = [];


    function getData() {

        $.getJSON("./data.json", function (data) {
            console.log(data)
        });

        // response.then(function (result) {
        //     let data = result;
        //
        //     if (data) {
        //         let page_token = null;
        //         if (data.next_page_token) {
        //             page_token = data.next_page_token;
        //         }
        //         data.results.forEach(function (bar) {
        //             array_bar.push(bar);
        //         });
        //
        //
        //         if (page_token) {
        //             // setTimeout(2000)
        //             let new_url = base_url + '&pagetoken=' + page_token.toString()
        //             console.log(new_url)
        //             let response2 = getResponseApi(new_url.toString())
        //             console.log(response2)
        //
        //             // response.then(function(result) {
        //             //     let data = result;
        //             //     console.log(data)
        //             // });
        //         }
        //     }
        //
        // });

    }


    async function getResponseApi(url) {

        const response = await
        fetch(url);
        let data = await
        response.json();

        return data;
    }