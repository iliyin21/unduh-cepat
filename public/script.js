const form = document.getElementById('downloadForm');
const urlInput = document.getElementById('urlInput');
const submitBtn = document.getElementById('submitBtn');
const btnLabel = submitBtn.querySelector('.btn-label');
const btnSpinner = submitBtn.querySelector('.btn-spinner');
const formError = document.getElementById('formError');
const platformResult = document.getElementById("platformResult");

const resultSection = document.getElementById('resultSection');
const resThumb = document.getElementById('resThumb');
const resPlatform = document.getElementById('resPlatform');
const resTitle = document.getElementById('resTitle');
const resMeta = document.getElementById('resMeta');
const formatList = document.getElementById('formatList');


// Deteksi Instagram
urlInput.addEventListener("input", function () {

    const url = urlInput.value.toLowerCase();

    if (url.includes("instagram.com")) {
        platformResult.innerHTML = "✓ Instagram terdeteksi";
    } else {
        platformResult.innerHTML = "";
    }

});


// Loading button
function setLoading(isLoading) {

    submitBtn.disabled = isLoading;
    btnLabel.hidden = isLoading;
    btnSpinner.hidden = !isLoading;

}


// Error
function showError(message) {

    formError.textContent = message;
    formError.hidden = false;

}


function hideError() {

    formError.hidden = true;
    formError.textContent = '';

}


// Tampilkan hasil
function renderResult(data) {


    resThumb.src = data.thumbnail || "";

    resPlatform.textContent =
        data.platform || "Instagram";

    resTitle.textContent =
        data.title || "Instagram Video";


    resMeta.textContent =
        data.author || "";


    formatList.innerHTML = "";


    if (!data.downloadUrl) {

        formatList.innerHTML = `
            <p style="color:var(--ink-soft); font-size:0.85rem;">
                Link download tidak ditemukan.
            </p>
        `;

    } else {


        const a = document.createElement("a");

        a.className = "format-item";

        a.href = data.downloadUrl;

        a.target = "_blank";

        a.download = "instagram-video.mp4";


        a.innerHTML = `

            <span class="res">
                ⬇ Download Video
            </span>

            <span class="ext">
                MP4
            </span>

        `;


        formatList.appendChild(a);

    }


    resultSection.hidden = false;


    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}



// Submit form
form.addEventListener('submit', async (e) => {

    e.preventDefault();

    hideError();

    resultSection.hidden = true;


    const url = urlInput.value.trim();


    if (!url) return;


    if (!url.includes("instagram.com")) {

        showError(
            "Masukkan link Instagram yang valid."
        );

        return;

    }


    setLoading(true);


    try {


        const res = await fetch('/api/download', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                url
            })

        });



        const result = await res.json();



        if (!res.ok || !result.success) {


            showError(
                result.message ||
                "Gagal mengambil video Instagram."
            );


            return;

        }



        renderResult(result.data);



    } catch (err) {


        console.error(err);


        showError(
            "Tidak bisa terhubung ke server."
        );


    } finally {


        setLoading(false);


    }

});