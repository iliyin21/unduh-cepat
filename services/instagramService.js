const axios = require("axios");

exports.getInstagramMedia = async (url) => {

    if (!process.env.RAPID_API_KEY) {
        throw new Error("RAPID_API_KEY belum diatur.");
    }

    const response = await axios.get(
        "https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com/convert",
        {
            params: {
                url: url
            },
            headers: {
                "x-rapidapi-key": process.env.RAPID_API_KEY,
                "x-rapidapi-host": process.env.RAPID_API_HOST
            }
        }
    );


    // Tampilkan response asli API di terminal
    

    const data = response.data;


    // Mencari URL video dari beberapa kemungkinan format response
    const downloadUrl =
        data.downloadUrl ||
        data.download_url ||
        data.video ||
        data.video_url ||
        data.url ||
        data.result?.downloadUrl ||
        data.result?.video ||
        data.result?.video_url ||
        data.result?.url ||
        data.data?.downloadUrl ||
        data.data?.video ||
        data.data?.video_url ||
        data.data?.url ||
        data.medias?.[0]?.url ||
        data.media?.[0]?.url ||
        null;


    return {

        title:
            data.title ||
            data.result?.title ||
            "Instagram Video",


        thumbnail:
            data.thumbnail ||
            data.result?.thumbnail ||
            data.data?.thumbnail ||
            "",


        downloadUrl: downloadUrl,


        originalResponse: data

    };

};