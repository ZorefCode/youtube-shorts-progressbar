(() => {
    if (window.location.href.indexOf('youtube.com/shorts') < 0) return false;

    function injectProgressBar() {
        const progress = `<progress id="zfProgressBar" value="0" max="1"></progress><div id="zfTooltip"></div>`;
        const progressStyle = `<style>#zfProgressBar{ width: 100%; height: 8px;accent-color: #f00;pointer-events: all;cursor: pointer;border:none;vertical-align:top;}progress::-webkit-progress-value{background-color:#f00;}#zfTooltip{display: none;top: 10px; position: relative; color: #fff; background: rgb(3,3,3,0.25);width: 25px; padding: 2px; text-align: center; }</style>`;
        document.querySelector('ytd-shorts-player-controls').insertAdjacentHTML('beforebegin', progress);
        document.head.insertAdjacentHTML("beforeend", progressStyle);
    }
    
    function addProgressListeners() {
        const progressBar = document.querySelector("#zfProgressBar");
        const tooltip = document.querySelector("#zfTooltip");
        const video = document.querySelector("#shorts-player>div>video");
        let {
            clientWidth,
            duration,
            currentTime
        } = video;
        let {
            left
        } = video.getBoundingClientRect();

        const getTimestamp = (clientX) => {
            let posX = clientX - left;
            if (posX < 0) posX = 0;
            if (posX > clientWidth) posX = clientWidth;
            return ((posX / clientWidth) * duration).toFixed(1);
        }

        video.addEventListener('timeupdate', (event) => {
            const {
                currentTime,
                duration
            } = video;
            const progressVal = currentTime / duration;
            progressBar.value = progressVal && !isNaN(progressVal) ? progressVal : 0;
        })

        progressBar.addEventListener('click', (event) => {
            const timestamp = getTimestamp(event.clientX);
            video.currentTime = timestamp;
        })

        progressBar.addEventListener('mousemove', (event) => {
            let posX = event.clientX - left;
            const timestamp = getTimestamp(event.clientX);
            tooltip.innerText = `${timestamp}s`;
            tooltip.style.display = 'block';
            tooltip.style.left = `${posX}px`;
        })

        progressBar.addEventListener('mouseout', (event) => {
            tooltip.style.display = 'none';
        })
    }

    function init() {
        if (!document.querySelector("#zfProgressBar")) {
            injectProgressBar();
        }
        addProgressListeners();
    }

    init();
    window.navigation.addEventListener("navigate", (event) => {
        setTimeout(() => init(), 200);
    });
})()
