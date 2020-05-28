const textValue = document.querySelector('[type="text"]');
const button = document.querySelector('[type="button"]');
const result = document.querySelector(".result");
const request = document.querySelector(".req");
const more = document.querySelector(".more-btns");
const image = document.querySelector(".image");

function showdata(data) {
  var songList = "";

  data.data.forEach((song) => {
    songList += ` <li><span class="info-span"><strong>${song.artist.name} -</strong> ${song.title}</span> <span class="button-span"><button data-artist="${song.artist.name}" data-songtitle="${song.title}">Get lyrics</button></span> </li>`;
  });

  var imageSrc = data.data[0].artist.picture_big;

  console.log(imageSrc);

  image.innerHTML = `<img src="${imageSrc}" alt= "Profile pic">`;

  request.textContent = textValue.value;

  result.innerHTML = `
  <ul>
   ${songList}
  </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
        ${data.prev ? ` <button class="prev">Previous</button>` : ""}
        ${data.next ? ` <button class="next">Next</button>` : ""}
      `;

    const prev = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    if (data.next) {
      nextBtn.addEventListener("click", () => {
        moreSong(data.next);
      });
    }

    if (data.prev) {
      prev.addEventListener("click", () => {
        moreSong(data.prev);
      });
    }
    console.log(prev, nextBtn);
  } else {
    more.innerHTML = "";
  }
}

async function searchSong(term) {
  const res = await fetch(`https://api.lyrics.ovh/suggest/${term}`);
  const data = await res.json();
  showdata(data);
  console.log(data);
}

async function moreSong(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();
  showdata(data);
  console.log(data);
}

async function getLyrics(artist, song) {
  const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`);
  const data = await res.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  result.innerHTML = `
   
  <p>
  <strong>${artist}</strong> - <span>${song}</span>
  <hr>
  <p>
  ${lyrics}</p>
  </p>
`;
}

button.addEventListener("click", () => {
  searchSong(textValue.value);
});

////making lyrics buttons work

result.addEventListener("click", (e) => {
  const clickedBtn = e.target;

  if (clickedBtn.tagName === "BUTTON") {
    const artist = clickedBtn.getAttribute("data-artist");
    const song = clickedBtn.getAttribute("data-songtitle");

    //   console.log(artist,song)
    getLyrics(artist, song);
  }
});
