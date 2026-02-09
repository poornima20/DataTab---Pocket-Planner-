export function initBookView() {
  const book = document.getElementById("book");
  if (!book) return;

  // 🔄 Always reset (order may change)
  book.innerHTML = `<div class="left-base"></div>`;

  // 🔹 Read SAME pages as Profile
  const pages = (JSON.parse(localStorage.getItem("plannerPages")) || [])
    .filter(p => !p.hidden); // respect visibility

  if (!pages.length) return;

  const COVER_DATA = {
    title: "Pocket Planner",
    subtitle: "Tap to open your book"
  };

  /* ---------------- COVER ---------------- */
  {
    const sheet = document.createElement("div");
    sheet.className = "sheet";
    sheet.style.zIndex = pages.length + 1;

    const front = document.createElement("div");
    front.className = "page front cover-front";
    front.innerHTML = `
      <div class="cover-content">
        <h1>${COVER_DATA.title}</h1>
        <p>${COVER_DATA.subtitle}</p>
      </div>
    `;

    const back = document.createElement("div");
    back.className = "page back";

    sheet.appendChild(front);
    sheet.appendChild(back);
    book.appendChild(sheet);
  }

  /* ---------------- CONTENT PAGES ---------------- */
  pages.forEach((page, i) => {
    const sheet = document.createElement("div");
    sheet.className = "sheet";
    sheet.style.zIndex = pages.length - i;

    const front = document.createElement("div");
    front.className = "page front";

    const back = document.createElement("div");
    back.className = "page back";

    const iframe = document.createElement("iframe");
    iframe.src = page.url;          // 🔑 SAME iframe as profile
    iframe.loading = "lazy";
    iframe.tabIndex = -1;

    front.appendChild(iframe);
    sheet.appendChild(front);
    sheet.appendChild(back);
    book.appendChild(sheet);
  });

  /* ---------------- PAGE TURN ---------------- */
  const sheets = book.querySelectorAll(".sheet");
  let current = 0;

  book.onclick = (e) => {
    const rect = book.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeft = clickX < rect.width / 2;

    if (isLeft) {
      if (current <= 0) return;
      current--;
      sheets[current].classList.remove("turned");
    } else {
      if (current >= sheets.length) return;
      sheets[current].classList.add("turned");
      current++;
    }
  };
}
