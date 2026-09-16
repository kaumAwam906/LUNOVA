document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // KONFIGURASI
    // =========================================================

    const API = "";

    // Dashboard akan mengecek backend setiap 3 detik
    const POLL_INTERVAL = 3000;


    // =========================================================
    // HELPER
    // =========================================================

    const $ = (id) => document.getElementById(id);


    // =========================================================
    // ELEMENT
    // =========================================================

    const el = {

        sidebar: $("sidebar"),
        menuToggle: $("menuToggle"),
        systemText: $("systemText"),

        fileInput: $("fileInput"),
        dropZone: $("dropZone"),
        previewPanel: $("previewPanel"),
        previewImage: $("previewImage"),
        fileName: $("fileName"),
        removeFile: $("removeFile"),
        analyzeButton: $("analyzeButton"),
        analysisStatus: $("analysisStatus"),

        latestImage: $("latestImage"),
        latestImageEmpty: $("latestImageEmpty"),

        resultBadge: $("resultBadge"),
        predictionText: $("predictionText"),
        confidenceText: $("confidenceText"),
        confidenceBar: $("confidenceBar"),

        probNormal: $("probNormal"),
        probLuad: $("probLuad"),
        probLusc: $("probLusc"),

        gradcamImage: $("gradcamImage"),
        gradcamEmpty: $("gradcamEmpty"),

        clinicalTitle: $("clinicalTitle"),
        clinicalText: $("clinicalText"),

        statTotal: $("statTotal"),
        statLuad: $("statLuad"),
        statLusc: $("statLusc"),
        statNormal: $("statNormal"),

        statTotalNote: $("statTotalNote"),
        statLuadNote: $("statLuadNote"),
        statLuscNote: $("statLuscNote"),
        statNormalNote: $("statNormalNote"),

        donut: $("donut"),
        donutTotal: $("donutTotal"),
        legendLuad: $("legendLuad"),
        legendLusc: $("legendLusc"),
        legendNormal: $("legendNormal"),

        historyList: $("historyList")
    };


    // =========================================================
    // STATE
    // =========================================================

    let selectedFile = null;

    let dashboardLoading = false;

    let lastRenderedAnalysisId = null;


    // =========================================================
    // CHECK ELEMENT
    // =========================================================

    function exists(element) {

        return element !== null &&
               element !== undefined;

    }


    // =========================================================
    // MOBILE MENU
    // =========================================================

    if (
        exists(el.menuToggle) &&
        exists(el.sidebar)
    ) {

        el.menuToggle.addEventListener(
            "click",
            () => {

                el.sidebar.classList.toggle(
                    "open"
                );

            }
        );

    }


    // =========================================================
    // NAVIGATION
    // =========================================================

    document
        .querySelectorAll(".nav-link")
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".nav-link"
                            )
                            .forEach(
                                (item) => {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        link.classList.add(
                            "active"
                        );


                        if (
                            window.innerWidth <= 750 &&
                            exists(el.sidebar)
                        ) {

                            el.sidebar.classList.remove(
                                "open"
                            );

                        }

                    }
                );

            }
        );


    // =========================================================
    // FILE INPUT
    // =========================================================

    if (exists(el.fileInput)) {

        el.fileInput.addEventListener(
            "change",
            (event) => {

                const file =
                    event.target.files?.[0];


                if (file) {

                    handleFile(file);

                }

            }
        );

    }


    // =========================================================
    // DRAG & DROP
    // =========================================================

    if (exists(el.dropZone)) {

        el.dropZone.addEventListener(
            "dragover",
            (event) => {

                event.preventDefault();

                el.dropZone.classList.add(
                    "drag-over"
                );

            }
        );


        el.dropZone.addEventListener(
            "dragleave",
            () => {

                el.dropZone.classList.remove(
                    "drag-over"
                );

            }
        );


        el.dropZone.addEventListener(
            "drop",
            (event) => {

                event.preventDefault();

                el.dropZone.classList.remove(
                    "drag-over"
                );


                const file =
                    event.dataTransfer.files?.[0];


                if (file) {

                    handleFile(file);

                }

            }
        );

    }


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


        // FORMAT

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            showStatus(
                "Format file tidak didukung. Gunakan JPG, PNG, atau TIFF.",
                "error"
            );

            return;

        }


        // SIZE

        if (
            file.size > maxSize
        ) {

            showStatus(
                "Ukuran file maksimal 20 MB.",
                "error"
            );

            return;

        }


        selectedFile = file;


        const reader =
            new FileReader();


        reader.onload =
            (event) => {

                if (
                    exists(
                        el.previewImage
                    )
                ) {

                    el.previewImage.src =
                        event.target.result;

                }


                if (
                    exists(
                        el.fileName
                    )
                ) {

                    el.fileName.textContent =
                        file.name;

                }


                if (
                    exists(
                        el.previewPanel
                    )
                ) {

                    el.previewPanel.hidden =
                        false;

                }


                if (
                    exists(
                        el.dropZone
                    )
                ) {

                    el.dropZone.hidden =
                        true;

                }


                if (
                    exists(
                        el.analyzeButton
                    )
                ) {

                    el.analyzeButton.disabled =
                        false;

                }


                showStatus(
                    "Gambar siap dianalisis.",
                    "success"
                );

            };


        reader.onerror =
            () => {

                showStatus(
                    "Gagal membaca gambar.",
                    "error"
                );

            };


        reader.readAsDataURL(
            file
        );

    }


    // =========================================================
    // REMOVE FILE
    // =========================================================

    if (
        exists(
            el.removeFile
        )
    ) {

        el.removeFile.addEventListener(
            "click",
            () => {

                selectedFile = null;


                if (
                    exists(
                        el.fileInput
                    )
                ) {

                    el.fileInput.value =
                        "";

                }


                if (
                    exists(
                        el.previewImage
                    )
                ) {

                    el.previewImage.src =
                        "";

                }


                if (
                    exists(
                        el.previewPanel
                    )
                ) {

                    el.previewPanel.hidden =
                        true;

                }


                if (
                    exists(
                        el.dropZone
                    )
                ) {

                    el.dropZone.hidden =
                        false;

                }


                if (
                    exists(
                        el.analyzeButton
                    )
                ) {

                    el.analyzeButton.disabled =
                        true;

                }


                showStatus(
                    "",
                    ""
                );

            }
        );

    }


    // =========================================================
    // ANALYZE IMAGE
    // =========================================================

    if (
        exists(
            el.analyzeButton
        )
    ) {

        el.analyzeButton.addEventListener(
            "click",
            async () => {

                if (!selectedFile) {

                    showStatus(
                        "Pilih gambar terlebih dahulu.",
                        "error"
                    );

                    return;

                }


                const formData =
                    new FormData();


                formData.append(
                    "image",
                    selectedFile
                );


                el.analyzeButton.disabled =
                    true;


                showStatus(
                    "AI sedang menganalisis gambar...",
                    "loading"
                );


                try {

                    const response =
                        await fetch(
                            `${API}/api/analyze`,
                            {
                                method:
                                    "POST",

                                body:
                                    formData
                            }
                        );


                    const data =
                        await response.json();


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        throw new Error(
                            data.error ||
                            "Analisis gagal."
                        );

                    }


                    const result =
                        data.analysis ||
                        data;


                    // UPDATE HASIL

                    applyAnalysis(
                        result
                    );


                    // STATISTIK

                    if (
                        data.statistics
                    ) {

                        applyStatistics(
                            data.statistics
                        );

                    }


                    // GRAD-CAM

                    if (
                        result.gradcam_url
                    ) {

                        showGradcam(
                            result.gradcam_url
                        );

                    }
                    else if (
                        data.gradcam_url
                    ) {

                        showGradcam(
                            data.gradcam_url
                        );

                    }


                    // LOAD ULANG DATA SERVER

                    await loadDashboard(
                        true
                    );


                    showStatus(
                        `Analisis selesai: ${labelFor(
                            result.prediction
                        )} (${num(
                            result.confidence
                        ).toFixed(2)}%)`,
                        "success"
                    );


                    // SCROLL HASIL

                    const resultSection =
                        $("result-section");


                    if (resultSection) {

                        resultSection.scrollIntoView(
                            {
                                behavior:
                                    "smooth",

                                block:
                                    "start"
                            }
                        );

                    }

                }
                catch (error) {

                    console.error(
                        "ANALYZE ERROR:",
                        error
                    );


                    showStatus(
                        error.message ||
                        "Terjadi kesalahan saat analisis.",
                        "error"
                    );

                }
                finally {

                    el.analyzeButton.disabled =
                        false;

                }

            }
        );

    }


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    loadStatus();

    loadDashboard(
        true
    );


    // =========================================================
    // REALTIME POLLING
    //
    // Setiap 3 detik Dashboard membaca:
    // /api/status
    // /api/dashboard
    //
    // Jadi tidak perlu refresh browser.
    // =========================================================

    setInterval(
        () => {

            loadStatus();

            loadDashboard(
                false
            );

        },
        POLL_INTERVAL
    );


    // =========================================================
    // LOAD STATUS
    // =========================================================

    async function loadStatus() {

        try {

            const response =
                await fetch(
                    `${API}/api/status`,
                    {
                        cache:
                            "no-store"
                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Backend offline."
                );

            }


            if (
                exists(
                    el.systemText
                )
            ) {

                el.systemText.textContent =
                    "System Online";

            }

        }
        catch (error) {

            if (
                exists(
                    el.systemText
                )
            ) {

                el.systemText.textContent =
                    "Backend Offline";

            }

        }

    }


    // =========================================================
    // LOAD DASHBOARD
    // =========================================================

    async function loadDashboard(
        forceLatest
    ) {

        if (
            dashboardLoading
        ) {

            return;

        }


        dashboardLoading =
            true;


        try {

            const response =
                await fetch(
                    `${API}/api/dashboard`,
                    {
                        cache:
                            "no-store"
                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Dashboard API gagal."
                );

            }


            const data =
                await response.json();


            if (
                !data.success
            ) {

                throw new Error(
                    data.error ||
                    "Data dashboard tidak valid."
                );

            }


            // =================================================
            // STATISTICS
            // =================================================

            if (
                data.statistics
            ) {

                applyStatistics(
                    data.statistics
                );

            }


            // =================================================
            // RECENT HISTORY
            // =================================================

            if (
                Array.isArray(
                    data.recent
                )
            ) {

                renderHistory(
                    data.recent
                );


                if (
                    data.recent.length > 0
                ) {

                    const latest =
                        data.recent[0];


                    const latestId =
                        latest.id ||
                        latest.timestamp ||
                        latest.filename ||
                        null;


                    // Pertama kali load
                    // atau ada analisis baru

                    if (
                        forceLatest ||
                        latestId !==
                        lastRenderedAnalysisId
                    ) {

                        applyAnalysis(
                            latest
                        );


                        lastRenderedAnalysisId =
                            latestId;

                    }
                    else {

                        // Tetap sinkronkan media
                        // server secara realtime

                        syncServerMedia(
                            latest
                        );

                    }

                }

            }

        }
        catch (error) {

            console.warn(
                "Dashboard API:",
                error
            );

        }
        finally {

            dashboardLoading =
                false;

        }

    }


    // =========================================================
    // APPLY ANALYSIS
    // =========================================================

    function applyAnalysis(
        result
    ) {

        if (!result) {

            return;

        }


        const prediction =
            result.prediction ||
            "Unknown";


        const confidence =
            num(
                result.confidence
            );


        const probabilities =
            result.probabilities ||
            {};


        const normal =
            num(
                probabilities.Normal ??
                probabilities.normal
            );


        const luad =
            num(
                probabilities.LUAD ??
                probabilities.luad
            );


        const lusc =
            num(
                probabilities.LUSC ??
                probabilities.lusc
            );


        // =====================================================
        // PREDICTION
        // =====================================================

        if (
            exists(
                el.resultBadge
            )
        ) {

            el.resultBadge.textContent =
                labelFor(
                    prediction
                );


            el.resultBadge.className =
                `result-badge ${badgeClass(
                    prediction
                )}`;

        }


        if (
            exists(
                el.predictionText
            )
        ) {

            el.predictionText.textContent =
                labelFor(
                    prediction
                );

        }


        // =====================================================
        // CONFIDENCE
        // =====================================================

        if (
            exists(
                el.confidenceText
            )
        ) {

            el.confidenceText.textContent =
                `${confidence.toFixed(2)}%`;

        }


        if (
            exists(
                el.confidenceBar
            )
        ) {

            el.confidenceBar.style.width =
                `${clamp(
                    confidence
                )}%`;

        }


        // =====================================================
        // PROBABILITY
        // =====================================================

        if (
            exists(
                el.probNormal
            )
        ) {

            el.probNormal.textContent =
                `${normal.toFixed(2)}%`;

        }


        if (
            exists(
                el.probLuad
            )
        ) {

            el.probLuad.textContent =
                `${luad.toFixed(2)}%`;

        }


        if (
            exists(
                el.probLusc
            )
        ) {

            el.probLusc.textContent =
                `${lusc.toFixed(2)}%`;

        }


        // =====================================================
        // GAMBAR SERVER
        // =====================================================

        if (
            result.image_url
        ) {

            showLatestImage(
                result.image_url
            );

        }
        else if (
            exists(
                el.previewImage
            ) &&
            el.previewImage.src
        ) {

            // Fallback kalau backend lama
            // belum memberikan image_url.

            showLatestImage(
                el.previewImage.src
            );

        }


        // =====================================================
        // GRAD-CAM
        // =====================================================

        if (
            result.gradcam_url
        ) {

            showGradcam(
                result.gradcam_url
            );

        }


        // =====================================================
        // CLINICAL SUPPORT
        // =====================================================

        updateClinicalSupport(
            result
        );


        // =====================================================
        // ID ANALISIS TERAKHIR
        // =====================================================

        if (
            result.id
        ) {

            lastRenderedAnalysisId =
                result.id;

        }

    }


    // =========================================================
    // SERVER MEDIA
    // =========================================================

    function syncServerMedia(
        result
    ) {

        if (!result) {

            return;

        }


        if (
            result.image_url
        ) {

            const currentUrl =
                exists(
                    el.latestImage
                )
                    ? el.latestImage.getAttribute(
                        "data-server-url"
                    )
                    : null;


            if (
                currentUrl !==
                result.image_url
            ) {

                showLatestImage(
                    result.image_url
                );

            }

        }


        if (
            result.gradcam_url
        ) {

            const currentUrl =
                exists(
                    el.gradcamImage
                )
                    ? el.gradcamImage.getAttribute(
                        "data-server-url"
                    )
                    : null;


            if (
                currentUrl !==
                result.gradcam_url
            ) {

                showGradcam(
                    result.gradcam_url
                );

            }

        }


        updateClinicalSupport(
            result
        );

    }


    // =========================================================
    // SHOW LATEST IMAGE
    // =========================================================

    function showLatestImage(
        url
    ) {

        if (
            !exists(
                el.latestImage
            ) ||
            !url
        ) {

            return;

        }


        el.latestImage.src =
            cacheBustUrl(
                url
            );


        el.latestImage.hidden =
            false;


        if (
            exists(
                el.latestImageEmpty
            )
        ) {

            el.latestImageEmpty.hidden =
                true;

        }


        el.latestImage.setAttribute(
            "data-server-url",
            url
        );

    }


    // =========================================================
    // APPLY STATISTICS
    // =========================================================

    function applyStatistics(
        data
    ) {

        if (!data) {

            return;

        }


        const total =
            num(
                data.total
            );


        const luad =
            num(
                data.luad
            );


        const lusc =
            num(
                data.lusc
            );


        const normal =
            num(
                data.normal
            );


        const luadPercent =
            num(
                data.luad_percent
            );


        const luscPercent =
            num(
                data.lusc_percent
            );


        const normalPercent =
            num(
                data.normal_percent
            );


        // =====================================================
        // STAT CARD
        // =====================================================

        if (
            exists(
                el.statTotal
            )
        ) {

            el.statTotal.textContent =
                total.toLocaleString(
                    "id-ID"
                );

        }


        if (
            exists(
                el.statLuad
            )
        ) {

            el.statLuad.textContent =
                luad;

        }


        if (
            exists(
                el.statLusc
            )
        ) {

            el.statLusc.textContent =
                lusc;

        }


        if (
            exists(
                el.statNormal
            )
        ) {

            el.statNormal.textContent =
                normal;

        }


        // =====================================================
        // NOTE
        // =====================================================

        if (
            exists(
                el.statTotalNote
            )
        ) {

            el.statTotalNote.textContent =
                "Data realtime";

        }


        if (
            exists(
                el.statLuadNote
            )
        ) {

            el.statLuadNote.textContent =
                `${luadPercent}% dari total`;

        }


        if (
            exists(
                el.statLuscNote
            )
        ) {

            el.statLuscNote.textContent =
                `${luscPercent}% dari total`;

        }


        if (
            exists(
                el.statNormalNote
            )
        ) {

            el.statNormalNote.textContent =
                `${normalPercent}% dari total`;

        }


        // =====================================================
        // DONUT
        // =====================================================

        if (
            exists(
                el.donutTotal
            )
        ) {

            el.donutTotal.textContent =
                total.toLocaleString(
                    "id-ID"
                );

        }


        if (
            exists(
                el.legendLuad
            )
        ) {

            el.legendLuad.textContent =
                `${luadPercent}%`;

        }


        if (
            exists(
                el.legendLusc
            )
        ) {

            el.legendLusc.textContent =
                `${luscPercent}%`;

        }


        if (
            exists(
                el.legendNormal
            )
        ) {

            el.legendNormal.textContent =
                `${normalPercent}%`;

        }


        if (
            exists(
                el.donut
            )
        ) {

            const firstEnd =
                luadPercent;


            const secondEnd =
                luadPercent +
                luscPercent;


            el.donut.style.background =
                `
                radial-gradient(
                    circle at center,
                    #fff 58%,
                    transparent 59%
                ),

                conic-gradient(
                    #8b5cf6
                    0 ${firstEnd}%,

                    #f59e0b
                    ${firstEnd}% ${secondEnd}%,

                    #10b981
                    ${secondEnd}% 100%
                )
                `;

        }

    }


    // =========================================================
    // HISTORY
    // =========================================================

    function renderHistory(
        items
    ) {

        if (
            !exists(
                el.historyList
            )
        ) {

            return;

        }


        el.historyList.innerHTML =
            "";


        if (
            !Array.isArray(
                items
            ) ||
            items.length === 0
        ) {

            el.historyList.innerHTML =
                `
                <div class="empty-history">
                    Belum ada riwayat analisis.
                </div>
                `;

            return;

        }


        items
            .slice(
                0,
                6
            )
            .forEach(
                (
                    item,
                    index
                ) => {

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "history-item";


                    row.innerHTML =
                        `
                        <div class="history-avatar">
                            P${index + 1}
                        </div>

                        <div>

                            <strong>
                                ${escapeHtml(
                                    item.id ||
                                    "Analysis"
                                )}
                            </strong>

                            <span>
                                ${escapeHtml(
                                    item.timestamp ||
                                    "-"
                                )}
                            </span>

                        </div>

                        <div class="history-result">

                            <strong>
                                ${escapeHtml(
                                    labelFor(
                                        item.prediction
                                    )
                                )}
                            </strong>

                            <span>
                                ${num(
                                    item.confidence
                                ).toFixed(2)}%
                            </span>

                        </div>
                        `;


                    el.historyList.appendChild(
                        row
                    );

                }
            );

    }


    // =========================================================
    // GRAD-CAM
    // =========================================================

    function showGradcam(
        url
    ) {

        if (
            !exists(
                el.gradcamImage
            ) ||
            !url
        ) {

            return;

        }


        el.gradcamImage.src =
            cacheBustUrl(
                url
            );


        el.gradcamImage.hidden =
            false;


        if (
            exists(
                el.gradcamEmpty
            )
        ) {

            el.gradcamEmpty.hidden =
                true;

        }


        el.gradcamImage.setAttribute(
            "data-server-url",
            url
        );

    }


    // =========================================================
    // CLINICAL SUPPORT
    // =========================================================

    function updateClinicalSupport(result) {

    if (!result) {
        return;
    }

    const prediction = result.prediction || "";
    const confidence = num(result.confidence);

    let title = "";
    let text = "";
    let steps = [];


    // =====================================================
    // NORMAL
    // =====================================================

    if (prediction === "Normal") {

        title =
            "Langkah Penanganan: Normal";

        text =
            "Hasil klasifikasi AI tidak menunjukkan pola " +
            "yang termasuk ke dalam kelas kanker yang dipelajari " +
            "model. Tidak ada terapi kanker yang dapat ditentukan " +
            "berdasarkan hasil citra ini. Bila terdapat keluhan " +
            "atau temuan klinis lain, lakukan evaluasi oleh " +
            "tenaga medis.";

        steps = [
            "✓ Evaluasi klinis bila terdapat keluhan",
            "✓ Konfirmasi hasil sesuai kebutuhan medis",
            "✓ Jangan menggunakan hasil AI sebagai pengganti diagnosis"
        ];
    }


    // =====================================================
    // LUAD
    // =====================================================

    else if (prediction === "LUAD") {

        title =
            "Langkah Penanganan: Adenocarcinoma (LUAD)";

        text =
            "Hasil ini perlu dikonfirmasi oleh tenaga medis. " +
            "Setelah diagnosis dikonfirmasi, dilakukan penentuan " +
            "stadium dan evaluasi kondisi pasien. Pada penyakit " +
            "yang masih dapat direseksi, pembedahan dapat menjadi " +
            "bagian utama penanganan. Sesuai stadium dan karakteristik " +
            "tumor, dokter dapat mempertimbangkan radioterapi, " +
            "kemoterapi, imunoterapi, atau terapi target.";

        steps = [
            "✓ Konfirmasi diagnosis dan stadium",
            "✓ Evaluasi kelayakan operasi dan/atau radioterapi",
            "✓ Evaluasi karakteristik molekuler sebelum terapi sistemik"
        ];
    }


    // =====================================================
    // LUSC
    // =====================================================

    else if (prediction === "LUSC") {

        title =
            "Langkah Penanganan: Squamous Cell Carcinoma (LUSC)";

        text =
            "Hasil ini perlu dikonfirmasi oleh tenaga medis dan " +
            "dilanjutkan dengan penentuan stadium. Penanganan " +
            "ditentukan berdasarkan stadium, lokasi tumor, kondisi " +
            "pasien, dan kelayakan terapi. Pilihan dapat mencakup " +
            "pembedahan, radioterapi, kemoterapi, dan imunoterapi " +
            "sesuai kondisi klinis.";

        steps = [
            "✓ Konfirmasi diagnosis dan stadium",
            "✓ Evaluasi operasi dan/atau radioterapi",
            "✓ Evaluasi pemeriksaan molekuler yang relevan"
        ];
    }


    // =====================================================
    // UNKNOWN
    // =====================================================

    else {

        title =
            "Langkah Penanganan";

        text =
            "Hasil klasifikasi tidak dapat dipetakan ke kelas " +
            "yang tersedia.";

        steps = [
            "✓ Periksa kembali hasil analisis",
            "✓ Konsultasikan hasil kepada tenaga medis"
        ];
    }


    // =====================================================
    // TITLE
    // =====================================================

    if (exists(el.clinicalTitle)) {

        el.clinicalTitle.textContent =
            title;
    }


    // =====================================================
    // DESCRIPTION
    // =====================================================

    if (exists(el.clinicalText)) {

        el.clinicalText.textContent =
            `${text} Confidence AI: ${confidence.toFixed(2)}%.`;
    }


    // =====================================================
    // RECOMMENDATION LIST
    // =====================================================

    const recommendationList =
        document.querySelector(
            ".recommendation-list"
        );


    if (recommendationList) {

        recommendationList.innerHTML = "";

        steps.forEach((step) => {

            const item =
                document.createElement("span");

            item.textContent =
                step;

            recommendationList.appendChild(
                item
            );

        });
    }
}

    // =========================================================
    // LABEL
    // =========================================================

    function labelFor(
        value
    ) {

        if (
            value === "LUAD"
        ) {

            return "Adenocarcinoma";

        }


        if (
            value === "LUSC"
        ) {

            return "Squamous Cell Carcinoma";

        }


        if (
            value === "Normal"
        ) {

            return "Normal";

        }


        return (
            value ||
            "Belum ada hasil"
        );

    }


    // =========================================================
    // BADGE
    // =========================================================

    function badgeClass(
        value
    ) {

        if (
            value === "LUAD"
        ) {

            return "luad";

        }


        if (
            value === "LUSC"
        ) {

            return "lusc";

        }


        if (
            value === "Normal"
        ) {

            return "normal";

        }


        return "neutral";

    }


    // =========================================================
    // STATUS MESSAGE
    // =========================================================

    function showStatus(
        message,
        type
    ) {

        if (
            !exists(
                el.analysisStatus
            )
        ) {

            return;

        }


        el.analysisStatus.textContent =
            message;


        el.analysisStatus.className =
            "status-message";


        if (type) {

            el.analysisStatus.classList.add(
                type
            );

        }

    }


    // =========================================================
    // NUMBER
    // =========================================================

    function num(
        value
    ) {

        const number =
            Number(
                value
            );


        return Number.isFinite(
            number
        )
            ? number
            : 0;

    }


    // =========================================================
    // CLAMP
    // =========================================================

    function clamp(
        value
    ) {

        return Math.max(
            0,
            Math.min(
                100,
                num(
                    value
                )
            )
        );

    }


    // =========================================================
    // CACHE BUST
    // =========================================================

    function cacheBustUrl(
        url
    ) {

        if (!url) {

            return url;

        }


        const separator =
            url.includes("?")
                ? "&"
                : "?";


        return (
            `${url}` +
            `${separator}t=${Date.now()}`
        );

    }


    // =========================================================
    // ESCAPE HTML
    // =========================================================

    function escapeHtml(
        value
    ) {

        return String(
            value
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }

});

// =========================================================
// SIDEBAR ACTIVE MENU MENGIKUTI SCROLL
// =========================================================

const sections = [
    {
        id: "top",
        link: '#top'
    },
    {
        id: "upload-section",
        link: 'a[href="#upload-section"]'
    },
    {
        id: "result-section",
        link: 'a[href="#result-section"]'
    },
    {
        id: "history-section",
        link: 'a[href="#history-section"]'
    },
    {
        id: "clinical-section",
        link: 'a[href="#clinical-section"]'
    },
    {
        id: "model-section",
        link: 'a[href="#model-section"]'
    }
];


function updateActiveSidebar() {

    const scrollPosition =
        window.scrollY + 180;


    let currentSection = "top";


    sections.forEach(section => {

        const element =
            document.getElementById(
                section.id
            );


        if (!element) {
            return;
        }


        if (
            scrollPosition >=
            element.offsetTop
        ) {

            currentSection =
                section.id;

        }

    });


    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.classList.remove(
                "active"
            );

        });


    const activeSection =
        sections.find(
            section =>
                section.id ===
                currentSection
        );


    if (
        activeSection
    ) {

        const activeLink =
            document.querySelector(
                activeSection.link
            );


        if (
            activeLink
        ) {

            activeLink.classList.add(
                "active"
            );

        }

    }
}


window.addEventListener(
    "scroll",
    updateActiveSidebar,
    {
        passive: true
    }
);


window.addEventListener(
    "load",
    updateActiveSidebar
);

