const { getInstagramMedia } = require("../services/instagramService");


exports.downloadInstagram = async (req, res) => {

    try {

        const { url } = req.body;


        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL Instagram wajib diisi."
            });
        }


        // Validasi Instagram
        if (!url.includes("instagram.com")) {
            return res.status(400).json({
                success: false,
                message: "Gunakan link Instagram yang valid."
            });
        }


        const data = await getInstagramMedia(url);


        res.json({
            success: true,
            data
        });


    } catch (err) {


        console.error(
            "Instagram Error:",
            err.response?.data || err.message
        );


        res.status(500).json({

            success: false,

            message:
                err.response?.data?.message ||
                err.message ||
                "Gagal mengambil video Instagram."

        });


    }

};