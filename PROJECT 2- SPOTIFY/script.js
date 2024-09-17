console.log("let's write some javascript")
let currentSong = new Audio();
let songs;
let currFolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder){
    currFolder = folder;
let a =await fetch (`http://127.0.0.1:3000/${folder}/`)
let response = await a.text();

let div = document.createElement("div")
div.innerHTML = response ;

let as = div.getElementsByTagName("a")
songs = []
for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
        songs.push(element.href.split(`/${folder}/`)[1])
        
    }
    
}

//shows all the song in playlist

let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0]
songUL.innerHTML = ""
for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li><img class="inverted" src="music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Rafi</div>
                </div>
                <div class="playnow">
                   
                    <span>PlayNow</span>
                    <img class="inverted" src="play.svg" alt="">
                </div></li>`;
    
    
}
// attacvh a event listener to audio
Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach (e=>{
    e.addEventListener("click",element=>{
       
        playMusic (e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
})


}
const playMusic = (track, pause = false)=>{
    
    currentSong.src = `/${currFolder}/`+ track
    if(!pause){
      currentSong.play()
      play.src = "pause.svg"
    }
   
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let CardContainer = document.querySelector(".CardContainer")
    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e= array[index];
        
    


        if(e.href.includes("/songs")){
            let folder = (e.href.split("/").slice(-2)[0])

            //get the meta data of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            CardContainer.innerHTML = CardContainer.innerHTML +`   <div data-folder="${folder}" class="card ">
                <div class="play">  
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"/>
                        </svg>
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="image">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`


        }
    }


     //load the playlist whenever its clicked
     Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            
        })
    })


    
}

 async function main(){

    
    // get the songs list
     await getSongs("songs/ncs")
    playMusic(songs[0],true)

    // display all the albums
    displayAlbums()

   
    // attach a addevlister for to play, next, pause
    play.addEventListener("click",()=>{
        if (currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })
    //durstion and info 
    currentSong.addEventListener("timeupdate", ()=>{
        (currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })
    // for change duration
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime =((currentSong.duration)*percent)/100

    })
    // add an event listener for hamburger

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    //add an event listener for close hamburger
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left ="-100%"
    })
    
    //add an event listener to previous

    previous.addEventListener("click",()=>{
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split ("/").slice(-1)[0])
        if(index-1 >= 0){
            playMusic(songs[index-1])
        }
        

    })

    // add an event listener to next
    next.addEventListener("click",()=>{
        currentSong.pause()

        let index = songs.indexOf(currentSong.src.split ("/").slice(-1)[0])
        if(index+1 < songs.length){
            playMusic(songs[index+1])
        }
        
    })
   
}


main()
// getSongs()

