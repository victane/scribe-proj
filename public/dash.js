
let tiTxt = document.getElementById('head-textArea')
let pTxt = document.getElementById('para-textArea')
let noteBtn = document.querySelector('.button')

let mainBoard = document.getElementsByClassName('main-board')
let textContainer = document.getElementsByClassName('text-container')
let textBoxContainer = document.getElementsByClassName('textbox-container')
let contentContainer = document.getElementsByClassName('content-container')
let caretDown = document.getElementsByClassName('fa-caret-down')
let sideShow = document.getElementsByClassName('sidebar_show')
let anim = document.getElementsByClassName('anim')


const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {
    const crd = pos.coords;
    let lat = crd.latitude;
    let long = crd.longitude;

    let map = L.map('map').setView([lat, long], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);


    // on map click let this code happen
    // 1. display popup
    let popup = L.popup();
    let loc;
    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
        // fetching reverse geocoding
        const { lat, lng } = popup._latlng
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
            .then(response => response.json())
            .then(data =>
                // adding locality address from data to popup
                popup
                    .setLatLng(e.latlng)
                    .setContent(loc = data.locality, e.latlng.toString())
                    .openOn(map));

        // console.log(popup);
        console.log(lat);
        console.log(lng);
        // we remove the display none that was initially set on the mainboard
        // then add the class of list 
        mainBoard[0].classList.remove('hide')
        mainBoard[0].classList.add('show')

    }
    map.on('click', onMapClick);
    // on send button click 
    try {
        noteBtn.addEventListener('click', (e) => {

            // get the calue of the Title and thr Paragraph
            let noteTitle = tiTxt.value
            let noteContent = pTxt.value


            console.log('clicked');
            console.log(noteTitle);
            console.log(noteContent);



            let date = new Date()
            const currTime = (date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
            console.log(currTime);

            if (!noteTitle && !noteContent) {

                e.preventDefault()
                // return true
            } else
                function localityData() {
                    let htmlNote = `                   
                <div class="new-content">
                <div class="new_content-child">
                <div class="parent_h2-span">
                <h2 class="content-h2">${noteTitle}</h2>
                    <span>${currTime}</span>
            </div>
            <div class="parent_content-p">
            <p class="content-p">${noteContent}</p>
            </div>
            <div class="locality-container">
            <p class="locality-p">${loc}</p>
            <span class="edit-con">
                    <i class="edit-fa fa fa-trash" aria-hidden="false"></i>
                    
                    </span>
                    </div>
                    </div>
                    </div>
                    `

                    // textContainer[0].insertAdjacentHTML('afterend', htmlNote)
                    contentContainer[0].insertAdjacentHTML('afterbegin', htmlNote)
                }
            tiTxt.value = pTxt.value = '';

            localityData()
            // return false
            // e.currentTarget.submit();
        })

    } catch (e) {
        console.log(e);
    }

}


function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
navigator.geolocation.getCurrentPosition(success, error, options)



caretDown[0].addEventListener('click', function () {

    caretDown[0].classList.toggle('caret-drop')
})

// code for the sidebar animation
caretDown[0].addEventListener('click', function () {
    if (!sideShow[0].classList.contains('anim')) {

        sideShow[0].classList.add('anim')
        console.log('add anim');
        // sideShow[0].style.animation = 'slidein 800ms forwards';

    } else if (caretDown[0].classList.contains('caret-drop')) {
        sideShow[0].classList.remove('anim')
        console.log('remove anim');

    }
})

