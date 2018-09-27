
   base_url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?location=47.212305,%20-1.555840&type=bar&radius=600&key=AIzaSyDcTTk48WN-xeLgJB_YIfeRTCQ7i25Icsg';

    array_bar = [];


    async function getData(callback) {

        let data = null;
        // $.getJSON("./data.json", function (element) {
        //     // console.log(data)
        //     data = element;
        //
        // });

        $.ajax({
            url: "./data.json",
            dataType: 'json',
            async: false,
            success: function(json){
                // return json;
                data = json
            }
        });

        return await data;


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

        const response = await fetch(url);
        return await response.json();

        // return data;
    }