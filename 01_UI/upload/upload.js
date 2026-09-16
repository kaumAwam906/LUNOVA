document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // ELEMENT
    // =========================================================

    const fileInput =
        document.getElementById("fileInput");

    const dropZone =
        document.getElementById("dropZone");

    const previewContainer =
        document.getElementById("previewContainer");

    const previewImage =
        document.getElementById("previewImage");

    const fileName =
        document.getElementById("fileName");

    const removeImage =
        document.getElementById("removeImage");

    const analyzeButton =
        document.getElementById("analyzeButton");

    const analysisStatus =
        document.getElementById("analysisStatus");

    const menuToggle =
        document.getElementById("menuToggle");

    const sidebar =
        document.querySelector(".sidebar");


    // =========================================================
    // STATE
    // =========================================================

    let selectedFile = null;


    // =========================================================
    // MOBILE MENU
    // =========================================================

    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "mobile-open"
                );

            }
        );

    }


    // =========================================================
    // OPEN FILE DIALOG
    // =========================================================

    dropZone.addEventListener(
        "click",
        function () {

            fileInput.click();

        }
    );


    // =========================================================
    // FILE INPUT
    // =========================================================

    fileInput.addEventListener(
        "change",
        function (event) {

            const file =
                event.target.files[0];

            if (file) {

                handleFile(file);

            }

        }
    );


    // =========================================================
    // DRAG OVER
    // =========================================================

    dropZone.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            dropZone.classList.add(
                "drag-over"
            );

        }
    );


    // =========================================================
    // DRAG LEAVE
    // =========================================================

    dropZone.addEventListener(
        "dragleave",
        function () {

            dropZone.classList.remove(
                "drag-over"
            );

        }
    );


    // =========================================================
    // DROP
    // =========================================================

    dropZone.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            dropZone.classList.remove(
                "drag-over"
            );

            const file =
                event.dataTransfer.files[0];

            if (file) {

                handleFile(file);

            }

        }
    );


    // =========================================================
    // HANDLE FILE
    // =========================================================

    function handleFile(file) {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/tiff"
        ];

        const maxSize =
            20 * 1024 * 1024;


        // -----------------------------------------------------
        // FILE TYPE
        // -----------------------------------------------------

        if (!allowedTypes.includes(file.type)) {

            showStatus(
                "Format file tidak didukung.",
                "error"
            );

            return;
        }


        // -----------------------------------------------------
        // FILE SIZE
        // -----------------------------------------------------

        if (file.size > maxSize) {

            showStatus(
                "Ukuran file melebihi 20 MB.",
                "error"
            );

            return;
        }


        // -----------------------------------------------------
        // SAVE FILE
        // -----------------------------------------------------

        selectedFile = file;


        // -----------------------------------------------------
        // PREVIEW
        // -----------------------------------------------------

        const reader =
            new FileReader();

        reader.onload =
            function (event) {

                previewImage.src =
                    event.target.result;

                fileName.textContent =
                    file.name;

                dropZone.hidden =
                    true;

                previewContainer.hidden =
                    false;

                analyzeButton.disabled =
                    false;

                clearStatus();

            };

        reader.readAsDataURL(file);

    }


    // =========================================================
    // REMOVE FILE
    // =========================================================

    removeImage.addEventListener(
        "click",
        function () {

            selectedFile = null;

            fileInput.value = "";

            previewImage.src = "";

            fileName.textContent = "";

            previewContainer.hidden =
                true;

            dropZone.hidden =
                false;

            analyzeButton.disabled =
                true;

            clearStatus();

        }
    );


    // =========================================================
    // ANALYZE
    // =========================================================

    analyzeButton.addEventListener(
        "click",
        async function () {

            if (!selectedFile) {

                showStatus(
                    "Pilih gambar terlebih dahulu.",
                    "error"
                );

                return;
            }


            // -------------------------------------------------
            // DISABLE BUTTON
            // -------------------------------------------------

            analyzeButton.disabled =
                true;

            showStatus(
                "AI sedang menganalisis gambar...",
                "loading"
            );


            // -------------------------------------------------
            // FORM DATA
            // -------------------------------------------------

            const formData =
                new FormData();

            formData.append(
                "image",
                selectedFile
            );


            try {

                const response =
                    await fetch(
                        "http://127.0.0.1:5000/api/analyze",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok ||
                    !result.success) {

                    throw new Error(
                        result.error ||
                        "Analisis gagal."
                    );

                }


                // ------------------------------------------------
                // BERHASIL
                // ------------------------------------------------

                showStatus(
                    `Analisis selesai — ${result.prediction} (${result.confidence}%)`,
                    "success"
                );


                console.log(
                    "Hasil AI:",
                    result
                );


                // Simpan hasil agar halaman hasil
                // bisa membacanya nanti.

                sessionStorage.setItem(
                    "lunovaAnalysis",
                    JSON.stringify(result)
                );


                // Untuk tahap sekarang kita tetap di halaman
                // upload. Nanti akan kita arahkan ke hasil.

                alert(
                    `Prediksi: ${result.prediction}\n` +
                    `Confidence: ${result.confidence}%`
                );


            } catch (error) {

                console.error(error);

                showStatus(
                    error.message,
                    "error"
                );

            } finally {

                analyzeButton.disabled =
                    false;

            }

        }
    );


    // =========================================================
    // STATUS
    // =========================================================

    function showStatus(
        message,
        type
    ) {

        analysisStatus.textContent =
            message;

        analysisStatus.className =
            "analysis-status " + type;
    }


    function clearStatus() {

        analysisStatus.textContent =
            "";

        analysisStatus.className =
            "analysis-status";
    }

});