// form
let tiTxt = document.getElementById('head-textArea')
let pTxt = document.getElementById('para-textArea')
let form = document.querySelector('.form-class')
let formButton = form.querySelector('button')

let mainBoard = document.getElementsByClassName('main-board')
let textContainer = document.getElementsByClassName('text-container')
let textBoxContainer = document.getElementsByClassName('textbox-container')
let contentContainer = document.getElementsByClassName('content-container')
let caretDown = document.getElementsByClassName('fa-caret-down')
let sideShow = document.getElementsByClassName('sidebar_show')
let anim = document.getElementsByClassName('anim')

let getLoc = document.getElementById('hidden_input')

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
        attribution: '© OpennopStreetMap'
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

        // set location from loc to hidden input getLoc(input html element)
        // function getVal() {

        //     let newVal = getLoc.value = loc
        //     console.log(newVal);
        //     return newVal
        // }
        // setTimeout(getVal, 5000)

    }
    map.on('click', onMapClick);


    // this function collect data from the form
    function collectFormData(e) {
        e.preventDefault()
        // get value of the noteTitle and the content
        let noteTitle = tiTxt.value
        let noteContent = pTxt.value
        // console.log(noteTitle + '\n', noteContent);
        // get dates
        let date = new Date()
        const currTime = (date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
        console.log(currTime);
        // noteObject 
        let noteObj = {
            noteTitle,
            noteContent,
            loc,
            currTime
        }

        console.log('the submit button called this fn');


        // save all notes into this array



        if (!noteTitle && !noteContent === true) {

            // if no title & content 
            alert('Add note title and content');

        } else {
            let allNotes = [1, 1, 2, 3]
            allNotes.map((val, ind) => {
                console.log(val);
                console.log(ind);
            })
            console.log(allNotes);

            // code below to interact data to the server
            // we create an object structure to receive our input 
            let payload = noteObj;
            // xhr object listen on the server and send data to the server
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/dash');
            xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
            xhr.send(JSON.stringify(payload))

            // this fn create an html content with the note data and render back to the user
            function showData() {

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
                contentContainer[0].insertAdjacentHTML('afterbegin', htmlNote)
            }
            showData()
            tiTxt.value = pTxt.value = '';
            localStorage.setItem('noteData', JSON.stringify(noteObj))
        }
    }

    try {
        formButton.addEventListener('click', collectFormData)

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

