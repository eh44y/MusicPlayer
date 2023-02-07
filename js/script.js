$(function () {
  const musicWrapper = $(".music-wrapper");
  const musicImg = musicWrapper.find(".img-area img");
  const musicName = musicWrapper.find(".song-details .name");
  const musicArtist = musicWrapper.find(".song-details .artist");
  /* const main_Audio = new Audio(); */
  const mainAudio = musicWrapper.find("#main-audio")[0];
  const playPauseBtn = musicWrapper.find(".play-pause");
  const prevBtn = musicWrapper.find("#prev");
  const nextBtn = musicWrapper.find("#next");
  const progressArea = musicWrapper.find(".progress-area");
  const progressBar = musicWrapper.find(".progress-bar");
  const musicList = musicWrapper.find(".music-list");
  const showMoreBtn = musicWrapper.find("#more-music");
  const hideMusicBtn = musicWrapper.find(musicList).find("#close");

  // 1
  let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

  $(window).on("load", () => {
    loadMusic(musicIndex);
    pausedMusic();
  });

  function loadMusic(indexNumb) {
    musicName.text(allMusic[indexNumb - 1].name);
    musicArtist.text(allMusic[indexNumb - 1].artist);
    musicImg.attr("src", `img/${allMusic[indexNumb - 1].img}.jpg`);
    mainAudio.src = `musics/${allMusic[indexNumb - 1].src}.mp3`;
    /* mainAudio.src = `musics/${allMusic[indexNumb - 1].src}.mp3`; */
  } // fn loadMusic end

  function playMusic() {
    musicWrapper.addClass("paused");
    playPauseBtn.find("i").text("pause");
    playPauseBtn
      .find("i.material-symbols-outlined")
      .css("font-variation-settings", "'FILL' " + 0 + "");
    mainAudio.play();
    playingNow();
  } // fn playMusic end

  function pauseMusic() {
    musicWrapper.removeClass("paused");
    playPauseBtn.find("i").text("play_arrow");
    playPauseBtn
      .find("i.material-symbols-outlined")
      .css("font-variation-settings", "'FILL' " + 1 + "");
    mainAudio.pause();
    pausedMusic();
  } // fn pauseMusic end

  function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
    loadMusic(musicIndex);
    playMusic();
    playingNow();
  } // fn prevMusic end

  function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
    loadMusic(musicIndex);
    playMusic();
    playingNow();
  } // fn nextMusic end

  playPauseBtn.on("click", () => {
    const isMusicPaused = musicWrapper.hasClass("paused");
    isMusicPaused ? pauseMusic() : playMusic();
  }); // click

  prevBtn.on("click", () => {
    prevMusic();
  }); // click

  nextBtn.on("click", () => {
    nextMusic();
  }); // click

  mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.css("width", `${progressWidth}%`);

    let musicCurrentTime = musicWrapper.find(".current");
    let musicDuration = musicWrapper.find(".duration");

    // duration time
    mainAudio.addEventListener("loadeddata", () => {
      let audioDuration = mainAudio.duration;
      let totalMin = Math.floor(audioDuration / 60);
      let totalSec = Math.floor(audioDuration % 60);
      if (totalSec < 10) {
        totalSec = `0${totalSec}`;
      }
      musicDuration.text(`${totalMin}:${totalSec}`);
    }); // loadeddata

    // current time
    let currentlMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
      currentSec = `0${currentSec}`;
    }
    musicCurrentTime.text(`${currentlMin}:${currentSec}`);
  }); // timeupdate

  progressArea.on("click", (e) => {
    let progressWidthval = $(".progress-area").width();
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidthval) * songDuration;
    playMusic();
    /* alert(progressWidthval); */
    /* alert(aaaa); */
  }); // click

  const repeatBtn = musicWrapper.find("#repeat");
  repeatBtn.on("click", () => {
    let getText = repeatBtn.text();
    switch (getText) {
      case "repeat":
        repeatBtn.text("repeat_one");
        repeatBtn.attr("title", "Song looped");
        break;
      case "repeat_one":
        repeatBtn.text("shuffle");
        repeatBtn.attr("title", "Playback shuffle");
        break;
      case "shuffle":
        repeatBtn.text("repeat");
        repeatBtn.attr("title", "Playlist looped");
        break;
    } // switch
  }); // click

  mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.text();
    switch (getText) {
      case "repeat":
        nextMusic();
        break;
      case "repeat_one":
        mainAudio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic();
        break;
      case "shuffle":
        let randIndex = Math.floor(Math.random() * allMusic.length + 1);
        do {
          randIndex = Math.floor(Math.random() * allMusic.length + 1);
        } while (musicIndex == randIndex);
        musicIndex = randIndex;
        loadMusic(musicIndex);
        playMusic();
        playingNow();
        break;
    } // switch
  }); // ended

  showMoreBtn.on("click", () => {
    musicList.toggleClass("show");
  }); // click
  hideMusicBtn.on("click", () => {
    showMoreBtn.click();
  }); // click

  const ulTag = musicWrapper.find("ul");
  for (let i = 0; i < allMusic.length; i++) {
    let liTag = `
    <li li-index="${i + 1}">
      <div class="row">
        <span>${allMusic[i].name}</span>
        <p>${allMusic[i].artist}</p>
      </div>
      <audio class="${allMusic[i].src}" src="musics/${
      allMusic[i].src
    }.mp3"></audio>
      <span id="${allMusic[i].src}" class="audio-duration"></span>
    </li>
    `;
    ulTag.append(liTag);
    let liAudioDuration = ulTag.find(`#${allMusic[i].src}`); // span
    let liAudioTag = ulTag.find(`.${allMusic[i].src}`); // audio

    liAudioTag[0].addEventListener("loadeddata", () => {
      let audioDuration = liAudioTag[0].duration; // audio.duration
      let totalMin = Math.floor(audioDuration / 60);
      let totalSec = Math.floor(audioDuration % 60);
      if (totalSec < 10) {
        totalSec = `0${totalSec}`;
      }
      liAudioDuration.text(`${totalMin}:${totalSec}`);
      liAudioDuration.attr("liList-duration", `${totalMin}:${totalSec}`);
    }); // loadeddata
  } // for end

  const allLiTags = ulTag.find("li");
  function playingNow() {
    $.each(allLiTags, function (j) {
      let audioTag = $(this).find(".audio-duration");
      let liListDuration = audioTag.attr("liLIst-duration");
      $(this).removeClass("playing");
      audioTag.removeClass("material-symbols-outlined");
      audioTag.removeClass("active");
      $(this).find(audioTag).text(liListDuration);
      if ($(this).attr("li-index") == musicIndex) {
        $(this).addClass("playing");
        audioTag.addClass("material-symbols-outlined");
        audioTag.addClass("active");
        audioTag.text("music_note");
      } // if
      /* $(this).attr("onclick", "clicked()"); */
    }); // each
  } // fn playingNow end

  function pausedMusic() {
    $.each(allLiTags, function (j) {
      let audioTag = $(this).find(".audio-duration");
      let liListDuration = audioTag.attr("liLIst-duration");
      $(this).removeClass("playing");
      audioTag.removeClass("material-symbols-outlined");
      audioTag.removeClass("active");
      $(this).find(audioTag).text(liListDuration);
    }); // each
  } // fn pausedMusic end

  $.each(allLiTags, function () {
    $(this).on("click", function () {
      let getLiIndex = $(this).attr("li-index");
      musicIndex = getLiIndex;
      loadMusic(musicIndex);
      playMusic();
      playingNow();
    }); // click
  }); // each
}); //ready
