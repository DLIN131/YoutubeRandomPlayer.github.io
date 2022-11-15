/**********************************/
//variable and fetch data function//
/**********************************/

const API_KEY = "AIzaSyDiWp98C7yAeOmww4UPauEGc1G0yAgYSIs";
const api = "https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyDiWp98C7yAeOmww4UPauEGc1G0yAgYSIs";
const part = "contentDetails,snippet";
let playlistId = "";//"PLR3WiLknrVUZX033xFGw8ISMA_RdXUnNk";
const maxResults = 50;
let nextpageT;
// auth = "959560237311-13dbj26mjffjcph7r49pq3c57lbvpgrr.apps.googleusercontent.com"
const videoTitleEle = document.querySelector("#video-title");
const randomBtn = document.querySelector("#random-btn");
const loadImgEle = document.querySelector("#load-img");
const prevSongBtn = document.querySelector("#prev-song");
const nextSongBtn = document.querySelector("#next-song");
const searchBtn = document.querySelector("#search");
const searchListBtn = document.querySelector("#search-list-btn");
const searchListTxt = document.querySelector("#search-list");
const orderBtn = document.querySelector("#order");
const useLocalStorageBtn = document.querySelector("#use-localStorage");
let youtubeData = null;
let snippetData=[];
let playlistIdTempArr = [];

async function fetchData(){
    do{
        const res = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems",{
            params:{
                part: part,// 必填，把需要的資訊列出來
                playlistId: playlistId,// 播放清單的id
                maxResults: maxResults,// 預設為五筆資料，可以設定1~50
                pageToken: nextpageT,
                key: API_KEY
        }
    })
    youtubeData = res.data;
    console.log(youtubeData);
    for(let i=0;i<youtubeData.items.length;i++){
        snippetData.push(youtubeData.items[i].snippet);
    }
    nextpageT = youtubeData.nextPageToken;
    }while(nextpageT !== undefined) 
    console.log(snippetData);
}






/*********************/ 
/*youtube iframe api*/ 
/*******************/ 
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);




var player;
let videoId = "";

function onYouTubeIframeAPIReady(){
    player = new YT.Player('player',{
        fitToBackground: true,
        height: '360',
        width: '640',
        videoId: videoId,
        playerVars: { 
        //自訂參數
        // 'autoplay':1,
        'controls': 1, //控制列，0:隱藏，1:顯示(默認)
        //'fs': 0, //全屏按鈕，0:隱藏，1:顯示(默認)
        //'iv_load_policy': 3, //影片註釋，1:顯示(默認)，3:不顯示
        //'rel': 0,//顯示相關視頻，0:不顯示，1:顯示(默認)
        //'modestbranding': 0, //YouTube標籤，0:顯示(默認)，1:不顯示//'playsinline': 1 //在iOS的播放器中全屏播放，0:全屏(默認)，1:內嵌
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
    })
}

// 4. The API will call this function when the video player is ready.
let onPlayerReadyEvent;
function onPlayerReady(event) {
    onPlayerReadyEvent = event;
    // videoTitleEle.addEventListener("change",function(e){
    //     console.log(e.target);
    // event.target.loadVideoById(e.target.value);
    
    // })

  }

  // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
    if(event.data === 0 ){
        console.log(event.data); 
        let index = videoTitleEle.selectedIndex;
        if(videoTitleEle.options[index+1].value !==undefined);
        console.log(videoTitleEle.options[index+1].selected = "selected"); 
        index = videoTitleEle.selectedIndex;
        onPlayerReadyEvent.target.loadVideoById(videoTitleEle.options[index].value);
    }
}
function stopVideo() {
    player.stopVideo();
}
////////////////////////////////////////////////////////////////////////////////////////////
/*************************主要功能分界******************************************************/
///////////////////////////////////////////////////////////////////////////////////////////


// const videoTitleEle = document.querySelector("#video-title");
// videoTitleEle.addEventListener("change",function(e){
//     console.log(e.target.value);
//     onYouTubeIframeAPIReady();
//     player.videoId = e.target.value;
//     console.log(player.event);
    
// })



//建立播放清單到select
function appendVideoTitle(mapData){
    videoTitleEle.style.display = "block";
    let optionMap = mapData.map(item => `<option value=${item.resourceId.videoId}>${item.position+'.'+item.title}</option>`);
    videoTitleEle.innerHTML = optionMap;
}

//檢查播放清單id
function checkPlaylistIdExist(playlistId,idArr){
    for (let i = 0; i < idArr.length; i++) {
        if(playlistId === idArr[i]){
            alert("playlist had been exist");
            return true;
        }
    }
    idArr.push(playlistId);
    return false;
}


//主要執行獲取資料函式與一些基本設定
async function main(){
    loadImgEle.style.display = "inline";
    searchBtn.disabled = true;
    await fetchData();
    loadImgEle.style.display = "none";
    searchBtn.disabled = false;
    updateLocalStorage(snippetData);
    console.log(snippetData.length);
    nextSongBtn.style.display = prevSongBtn.style.display = randomBtn.style.display = "inline";
    appendVideoTitle(snippetData);
   
}

//appendPlaylistEvent
searchBtn.addEventListener("click",function(){
    const PLID = document.getElementById("playlist-url").value;
    if(!checkPlaylistIdExist(PLID,playlistIdTempArr)){
        playlistId = PLID;
        main();
    }
    
})


//////////////////////////////////////////////////////////////////////
//***********************************localStorage******************//
/////////////////////////////////////////////////////////////////////
function updateLocalStorage(playlist){
    localStorage.setItem("playlist",JSON.stringify(playlist));
    console.log("localstorage");
}
function useLocalStorageItem(){
    snippetData = JSON.parse(localStorage.getItem("playlist"));
    console.log("localStorageList"+snippetData);
    appendVideoTitle(snippetData);
}
useLocalStorageBtn.addEventListener("click",function(){
    useLocalStorageItem();
})


/////////////////////////////////////////////////////////////////////
//////**********************button area function*******************//
////////////////////////////////////////////////////////////////////

//點擊清單切換
videoTitleEle.addEventListener("change",function(e){
    console.log(e.target);
    onPlayerReadyEvent.target.loadVideoById(e.target.value);

})

//切換上一首
prevSongBtn.addEventListener("click",function(e){
    let index = videoTitleEle.selectedIndex;
    if(videoTitleEle.options[index-1].value !==undefined);
    console.log(videoTitleEle.options[index-1].selected = "selected"); 
    index = videoTitleEle.selectedIndex;
    onPlayerReadyEvent.target.loadVideoById(videoTitleEle.options[index].value);
})

//切換下一首
nextSongBtn.addEventListener("click",function(e){
    let index = videoTitleEle.selectedIndex;
    if(videoTitleEle.options[index+1].value !==undefined);
    console.log(videoTitleEle.options[index+1].selected = "selected"); 
    index = videoTitleEle.selectedIndex;
    onPlayerReadyEvent.target.loadVideoById(videoTitleEle.options[index].value);
})


//隨機排列
function Shuffle(arr){
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
}

let shuffleArr;
let shuffleFlag = false;
randomBtn.addEventListener("click",function(){
    shuffleArr = snippetData.slice(0);
    shuffleFlag = true;
    Shuffle(shuffleArr);
    appendVideoTitle(shuffleArr);    
})
//順序排列
orderBtn.addEventListener("click",function(){
    appendVideoTitle(snippetData);
    shuffleFlag = false;
})



//搜尋歌曲
searchListBtn.addEventListener("click",function(){
    const videoName = searchListTxt.value.trim().toLowerCase();
    console.log(videoName);
    let result;
    if(shuffleFlag){
        result = shuffleArr.filter((item) => item.title.toLowerCase().match(videoName));
    }
    else{
        result = snippetData.filter((item) => item.title.toLowerCase().match(videoName));
    }
    
    console.log(result);
    appendVideoTitle(result);
})