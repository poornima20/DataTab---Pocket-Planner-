const modes = ["plain", "dotted", "grid"];
const buttons = document.querySelectorAll(".track button");
const thumb = document.querySelector(".thumb");
const DEFAULT_PLANNER_NAME = "Your Planner Name";

const PAGE_LIBRARY = {
  focusgrid: {
    title: "Focus Grid",
    url: "https://poornima20.github.io/PocketPlanner-DailyPlanner-FocusGrid/",
    previewImage: "./Icons/focusgrid.png"
  },
  tasklog: {
    title: "Task Log",
    url: "https://poornima20.github.io/PocketPlanner-MonthlyPlanner-TaskLog/",
    previewImage: "./Icons/tasklog.png"
  },
  projecttimeline: {
    title: "Project Timeline",
    url: "https://poornima20.github.io/PocketPlanner-Tracker-ProjectTimeline/",
    previewImage: "./Icons/projecttimeline.png"
  },
  weeklog: {
    title: "Week Log",
    url: "https://poornima20.github.io/PocketPlanner-WeeklyPlaner-WeekLog/",
    previewImage: "./Icons/weeklog.png"
  },
  timeprogress: {
    title: "Time Progress",
    url: "https://poornima20.github.io/PocketPlanner-YearlyPlanner-TimeProgress/",
    previewImage: "./Icons/timeprogress.png"
  },
  monthlygrid: {
    title: "Monthly Grid",
    url: "https://poornima20.github.io/PocketPlanner-MonthlyPlanner-MonthlyGrid/",
    previewImage: "./Icons/monthlygrid.png"
  },
  studylog: {
    title: "Study Log",
    url: "https://poornima20.github.io/PocketPlanner-Tracker-StudyLog/",
    previewImage: "./Icons/studylog.png"
  },
  cornellnotes: {
    title: "Cornell Notes",
    url: "https://poornima20.github.io/PocketPlanner-Notes-Cornell-Notes//",
    previewImage: "./Icons/cornellnotes.png"
  },
  spendlog: {
    title: "Spend Log",
    url: "https://poornima20.github.io/PocketPlanner-Tracker-SpendLog/",
    previewImage: "./Icons/spendlog.png"
  },
  minuteplanner: {
    title: "10-Minute Planner",
    url: "https://poornima20.github.io/PocketPlanner-DailyPlanner-10MinutePlanner/",
    previewImage: "./Icons/10minuteplanner.png"
  },
  yearoverview: {
    title: "Year Overview",
    url: "https://poornima20.github.io/PocketPlanner-MonthlyPlanner-YearOverview/",
    previewImage: "./Icons/yearoverview.png"
  },
  waterlog: {
    title: "Water Log",
    url: "https://poornima20.github.io/PocketPlanner-Tracker-WaterLog/",
    previewImage: "./Icons/waterlog.png"
  },
  arirang: {
    title: "Arirang",
    url: "https://poornima20.github.io/PocketPlanner-Music-Arirang/",
    previewImage: "./Icons/arirang.png"
  },
  bookshelf: {
    title: "Bookshelf",
    url: "https://poornima20.github.io/PocketPlanner-Entertainment-Bookshelf/",
    previewImage: "./Icons/bookshelf.png"
  },
  weeklyspread: {
    title: "Weekly Spread",
    url: "https://poornima20.github.io/PocketPlanner-WeeklyPlaner-WeeklySpread/",
    previewImage: "./Icons/weeklyspread.png"
  }
  
};

const DATED_CATEGORIES = ["daily", "weekly", "monthly", "yearly", "tracker"];
const UNDATED_CATEGORIES = ["goals", "notes","music", "entertainment"];


const CATEGORY_PAGES = {
  daily: [ "focusgrid", "minuteplanner" ],

  monthly: [ "tasklog" , "monthlygrid" ],

  weekly: ["weeklog" , "weeklyspread" ],

  goals: [ ],

  notes: [  "cornellnotes"  ],

  tracker: [ "projecttimeline" , "studylog", "spendlog", "waterlog" ],

  yearly: [ "timeprogress" , "yearoverview" ],

  music: [ "arirang" ],

  entertainment: [ "bookshelf" ]
};


function goHome() {
  modal.classList.add("hidden");
  profilePage.classList.remove("active", "pages-open");
  pagesOverlay.classList.remove("active");
}


buttons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    document.body.classList.remove(...modes);
    document.body.classList.add(btn.dataset.mode);
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    thumb.style.transform = `translateX(${index * 34}px)`;
  });
});

const plannerButtons = document.querySelectorAll(".planner-card");
const modal = document.getElementById("plannerModal");
const title = document.getElementById("plannerTitle");
const closeModal = document.getElementById("closeModal");

function renderModalPages(categoryKey) {
  const carousel = document.querySelector(".page-carousel");
  carousel.innerHTML = "";

  const pageKeys = CATEGORY_PAGES[categoryKey] || [];

pageKeys.forEach(pageKey => {
  const page = PAGE_LIBRARY[pageKey];
  if (!page) return;

  const alreadyAdded = isPageAlreadyAdded(pageKey);

  const card = document.createElement("div");
  card.className = "page-card";
  card.dataset.page = pageKey;

card.innerHTML = `
  <div class="page-preview image">
    <img 
      src="${page.previewImage}" 
      alt="${page.title} preview"
      loading="lazy"
    />
  </div>

  <div class="page-card-footer">
    <span class="page-name">${page.title}</span>
    <button class="add-page ${alreadyAdded ? "added" : ""}">
      ${alreadyAdded ? "Added" : "Add"}
    </button>
  </div>
`;



  const addBtn = card.querySelector(".add-page");

  if (alreadyAdded) {
    addBtn.disabled = true;
  } else {
    addBtn.addEventListener("click", () => {
      savePage(pageKey);
      renderPlannerPages();

      addBtn.textContent = "Added";
      addBtn.classList.add("added");
      addBtn.disabled = true;
    });
  }

  carousel.appendChild(card);
});

}


plannerButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.planner;
    title.textContent = btn.innerText;
    renderModalPages(key);

    history.pushState({ open: true }, "");
    modal.classList.remove("hidden");
  });
});




closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});



const plannerNameDisplay = document.getElementById("plannerNameDisplay");
const plannerNameInput = document.getElementById("plannerNameInput");

// Load saved planner name - fullmoon.pocketplanner
const savedPlannerName = localStorage.getItem("fullmoon.pocketplanner.name");
if (savedPlannerName) {
  plannerNameDisplay.textContent = savedPlannerName;
}

// Enter edit mode
plannerNameDisplay.addEventListener("click", () => {
  plannerNameInput.value = plannerNameDisplay.textContent;
  plannerNameDisplay.classList.add("hidden");
  plannerNameInput.classList.remove("hidden");
  plannerNameInput.focus();
});

// Save on blur / Enter
function savePlannerName() {
  const value = plannerNameInput.value.trim();

  if (!value) {
    // Reset to default
    localStorage.removeItem("fullmoon.pocketplanner.name");
    plannerNameDisplay.textContent = DEFAULT_PLANNER_NAME;
    profilePlannerName.textContent = DEFAULT_PLANNER_NAME;
  } else {
    localStorage.setItem("fullmoon.pocketplanner.name", value);
    plannerNameDisplay.textContent = value;
    profilePlannerName.textContent = value;
  }

  plannerNameDisplay.classList.remove("hidden");
  plannerNameInput.classList.add("hidden");
}


plannerNameInput.addEventListener("blur", savePlannerName);

plannerNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    plannerNameInput.blur();
  }
});


const profilePage = document.getElementById("profilePage");
const profilePlannerName = document.getElementById("profilePlannerName");


if (savedPlannerName) {
  profilePlannerName.textContent = savedPlannerName;
}

const openProfileBtn = document.getElementById("openProfile");
const openProfileFromModal = document.getElementById("openProfileFromModal");

function openProfile() {
  history.pushState({ open: true }, "");
  modal.classList.add("hidden");
  profilePage.classList.add("active");
  renderPlannerPages();
}



openProfileBtn.addEventListener("click", openProfile);
openProfileFromModal.addEventListener("click", openProfile);



// Swipe right to close (mobile)
let touchStartX = 0;

profilePage.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

profilePage.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  if (touchEndX - touchStartX > 80) {
    profilePage.classList.remove("active");
  }
});


function getSavedPages() {
  return JSON.parse(localStorage.getItem("fullmoon.pocketplanner.pages")) || [];
}
function isPageAlreadyAdded(pageKey) {
  const pages = getSavedPages();
  return pages.some(p => p.url === PAGE_LIBRARY[pageKey].url);
}


function savePage(pageKey) {
  const page = PAGE_LIBRARY[pageKey];
  if (!page) return;

  const pages = getSavedPages();

  if (pages.some(p => p.url === page.url)) return;

  pages.push({
    id: crypto.randomUUID(),
    title: page.title,
    url: page.url,
    hidden: false 
  });

  localStorage.setItem("fullmoon.pocketplanner.pages", JSON.stringify(pages));
}




function renderPlannerPages() {
  const container = document.getElementById("plannerCanvas");
  const pages = getSavedPages().filter(p => !p.hidden);

  container.innerHTML = "";

const pagesno = JSON.parse(localStorage.getItem("fullmoon.pocketplanner.pages")) || [];

if (!pagesno.length) {
  renderAddPagePlaceholder();  // 👈 ONLY here
  return;
}

  pages.forEach((page, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "planner-page-wrapper";
    wrapper.dataset.index = index;

    const iframe = document.createElement("iframe");
    iframe.src = page.url;
    iframe.className = "planner-frame";
    iframe.loading = "lazy";
    iframe.tabIndex = -1;

    wrapper.appendChild(iframe);
    container.appendChild(wrapper);
  });

  setupPageCounterObserver(pages);
}



const plannerCanvas = document.getElementById("plannerCanvas");
const pagesOverlay = document.getElementById("pagesOverlay");
const pagesDoneBtn = document.querySelector(".pages-done");

// Open Pages
document.getElementById("plannerPages").onclick = () => {
  history.pushState({ open: true }, "");
  profilePage.classList.add("pages-open");
  pagesOverlay.classList.add("active");
  renderPagesList();
};

// Close Pages
pagesDoneBtn.onclick = () => {
  profilePage.classList.remove("pages-open");
  pagesOverlay.classList.remove("active");
};


window.addEventListener("popstate", () => {
  goHome();
});


document.getElementById("plannerHome").onclick = () => {
  profilePage.classList.remove("active");
};


closeModal.addEventListener("click", () => {
  history.back();
});



document.getElementById("plannerHome").onclick = () => history.back();


function renderPagesList() {
  const list = document.querySelector(".pages-list");
  const pages = getSavedPages();

  list.innerHTML = "";

  pages.forEach((page, index) => {
    const card = document.createElement("div");
    card.className = "page-card-mini";
    card.draggable = true;
    card.dataset.index = index;

card.innerHTML = `
  <div class="mini-preview">
    <img src="${getPreviewByUrl(page.url)}" />
  </div>

  <div class="mini-title">
    <span class="title-text">${page.customTitle || page.title}</span>
   
    <input class="title-input hidden" type="text" />
  </div>

<div class="mini-actions">
  <button class="drag-handle" data-action="move"><i data-lucide="grip-vertical"></i></button>
  <button data-action="edit"><i data-lucide="pencil"></i></button>
   <button data-action="toggle-visibility"><i data-lucide="eye-off"></i></button>
  <button data-action="delete"><i data-lucide="trash-2"></i></button>
  <button data-action="refresh"><i data-lucide="refresh-cw"></i></button>
</div>

`;

const eyeIcon = card.querySelector('[data-action="toggle-visibility"] i');

if (page.hidden) {
  eyeIcon.setAttribute("data-lucide", "eye");
  card.style.opacity = "0.5";
} else {
  eyeIcon.setAttribute("data-lucide", "eye-off");
  card.style.opacity = "1";
}



    list.appendChild(card);
    lucide.createIcons();

  });
}


document.querySelector(".pages-list").addEventListener("click", e => {
  const card = e.target.closest(".page-card-mini");
  if (!card) return;

  const actionBtn = e.target.closest("button[data-action]");
  if (!actionBtn) return;

  const action = actionBtn.dataset.action;
  const pages = getSavedPages();
  const index = Number(card.dataset.index);

  if (action === "edit") {
    startRename(card, index);
    return;
  }


  if (action === "delete") {
    pages.splice(index, 1);
  }

if (action === "toggle-visibility") {
  pages[index].hidden = !pages[index].hidden;
}



  if (action === "refresh") {
    renderPlannerPages();
    return;
  }


  localStorage.setItem("fullmoon.pocketplanner.pages", JSON.stringify(pages));
  renderPagesList();
  renderPlannerPages();
});


function startRename(card, index) {
  const text = card.querySelector(".title-text");
  const input = card.querySelector(".title-input");

  const pages = getSavedPages();
  const page = pages[index];

  input.value = page.customTitle || page.title;
  text.classList.add("hidden");
  input.classList.remove("hidden");
  input.focus();
  input.select();

  input.onblur = save;
  input.onkeydown = e => {
    if (e.key === "Enter") input.blur();
    if (e.key === "Escape") cancel();
  };

  function save() {
    const value = input.value.trim();
    if (value) page.customTitle = value;
    else delete page.customTitle;

    localStorage.setItem("fullmoon.pocketplanner.pages", JSON.stringify(pages));
    renderPagesList();
    renderPlannerPages();
  }

  function cancel() {
    input.classList.add("hidden");
    text.classList.remove("hidden");
  }
}










function getPreviewByUrl(url) {
  const entry = Object.values(PAGE_LIBRARY).find(p => p.url === url);
  return entry?.previewImage || "./previews/default.png";
}


let snapEnabled = false;

profilePage.addEventListener("scroll", () => {
  if (!snapEnabled) {
    document.getElementById("plannerCanvas").style.scrollSnapType = "y mandatory";
    snapEnabled = true;
  }
}, { once: true });



let dragIndex = null;

document.querySelector(".pages-list").addEventListener("dragstart", e => {
  const card = e.target.closest(".page-card-mini");
  if (!card) return;
  dragIndex = Number(card.dataset.index);
});

document.querySelector(".pages-list").addEventListener("dragover", e => {
  e.preventDefault(); // 🔑 REQUIRED
});

document.querySelector(".pages-list").addEventListener("drop", e => {
  const target = e.target.closest(".page-card-mini");
  if (!target || dragIndex === null) return;

  const pages = getSavedPages();
  const to = Number(target.dataset.index);

  const [moved] = pages.splice(dragIndex, 1);
  pages.splice(to, 0, moved);

  localStorage.setItem("fullmoon.pocketplanner.pages", JSON.stringify(pages));
  dragIndex = null;

  renderPagesList();
  renderPlannerPages();
});

const pageCounter = document.getElementById("pageCounter");

function updatePageCounter() {
  const pages = document.querySelectorAll(".planner-page-wrapper");
  const total = pages.length;

  if (!total) {
    pageCounter.textContent = "0 / 0";
    return;
  }

  const scrollTop = plannerCanvas.scrollTop;
  const pageHeight = pages[0].offsetHeight;

  const current = Math.round(scrollTop / pageHeight) + 1;

  pageCounter.textContent = `${current} / ${total}`;
}

let pageObserver = null;

function setupPageCounterObserver(visiblePages) {
  if (pageObserver) pageObserver.disconnect();

  const wrappers = document.querySelectorAll(".planner-page-wrapper");
  const total = wrappers.length;

  if (!total) {
    pageCounter.textContent = "0 / 0";
    return;
  }

  pageCounter.textContent =
    `1 / ${total} · ${visiblePages[0].customTitle || visiblePages[0].title}`;

  pageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Number(entry.target.dataset.index);
        const page = visiblePages[index];

        pageCounter.textContent =
          `${index + 1} / ${total} · ${page.customTitle || page.title}`;
      }
    });
  }, { threshold: 0.6 });

  wrappers.forEach(w => pageObserver.observe(w));
}


const openPlannerMain = document.getElementById("openPlannerMain");

if (openPlannerMain) {
  openPlannerMain.addEventListener("click", openProfile);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}


const carousel = document.querySelector(".page-carousel");
const prevArrow = document.getElementById("carouselPrev");
const nextArrow = document.getElementById("carouselNext");

function swipeLikeScroll(direction) {
  const card = carousel.querySelector(".page-card");
  if (!card) return;

  const gap = parseInt(getComputedStyle(carousel).gap) || 0;
  const cardWidth = card.offsetWidth + gap;

  carousel.scrollBy({
    left: direction * cardWidth,
    behavior: "smooth"
  });
}


prevArrow.addEventListener("click", () => swipeLikeScroll(-1));
nextArrow.addEventListener("click", () => swipeLikeScroll(1));

function renderHomeGrids() {
  const datedGrid = document.getElementById("datedGrid");
  const undatedGrid = document.getElementById("undatedGrid");

  datedGrid.innerHTML = "";
  undatedGrid.innerHTML = "";

  Object.entries(CATEGORY_PAGES).forEach(([category, pageKeys]) => {
    pageKeys.forEach(pageKey => {
      const page = PAGE_LIBRARY[pageKey];
      if (!page) return;

      const card = document.createElement("div");
      card.className = "home-page-card";

      card.innerHTML = `
        <div class="home-preview">
          <img src="${page.previewImage}" loading="lazy" />
        </div>
        <div class="home-title">${page.title}</div>
      `;

      // 🔑 clicking a card opens SAME modal
      card.addEventListener("click", () => {
      title.textContent = category.toUpperCase();

      renderModalPages(category);

      modal.classList.remove("hidden");
      history.pushState({ open: true }, "");

      // 🔥 Scroll to the exact clicked page
      setTimeout(() => {
        const targetCard = document.querySelector(
          `.page-card[data-page="${pageKey}"]`
        );

        targetCard?.scrollIntoView({
          behavior: "auto",
          inline: "center"
        });
      }, 50);
    });


      if (DATED_CATEGORIES.includes(category)) {
        datedGrid.appendChild(card);
      } else if (UNDATED_CATEGORIES.includes(category)) {
        undatedGrid.appendChild(card);
      }
    });
  });
}

renderHomeGrids();

import { initBookView } from "./book.js";

const openBookBtn = document.getElementById("openBookView");
const closeBookBtn = document.getElementById("closeBookView");
const bookView = document.getElementById("bookView");

openBookBtn?.addEventListener("click", () => {
  bookView.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  initBookView();
});

closeBookBtn?.addEventListener("click", () => {
  bookView.classList.add("hidden");
  document.body.style.overflow = "";
});

// ✅ ONLY section1 → section2 (strict)

let moved = false;

const section1 = document.getElementById("section1");
const section2 = document.getElementById("section2");

section1.addEventListener("scroll", () => {
  if (!moved) {
    moved = true;

    section2.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
});


function renderAddPagePlaceholder() {
  const canvas = document.getElementById("plannerCanvas");
  if (!canvas) return;

  canvas.innerHTML = `
    <div class="add-page-placeholder" id="addPagePlaceholder">
      <div class="add-page-inner">
        <i data-lucide="plus"></i>
        <p>Add pages to your planner</p>
      </div>
    </div>
  `;

  lucide.createIcons();

  document
    .getElementById("addPagePlaceholder")
    .addEventListener("click", goToLandingFromProfile);
}

function goToLandingFromProfile() {
  // close profile
  document.getElementById("profilePage").classList.remove("active");

  // scroll to landing
  document
    .getElementById("landingSection")
    .scrollIntoView({ behavior: "smooth" });
}

const backupBtn = document.getElementById("backupBtn");
const restoreBtn = document.getElementById("restoreBtn");
const fileInput = document.getElementById("fileInput");

// BACKUP
backupBtn.addEventListener("click", () => {
  const prefix = "fullmoon.pocketplanner.";
  const backupData = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith(prefix)) {
      backupData[key] = localStorage.getItem(key);
    }
  }

  if (Object.keys(backupData).length === 0) {
    alert("No planner data to backup!");
    return;
  }

  const blob = new Blob([JSON.stringify(backupData)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "pocket-planner-backup.json";
  a.click();

  URL.revokeObjectURL(url);

  const count = Object.keys(backupData).length;
  alert(`${count} items backed up successfully!`);
});
// RESTORE
restoreBtn.addEventListener("click", () => {
  fileInput.click();
});



fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    if (!confirm("This will overwrite your current planner data. Continue?")) {
      return;
    }
    try {
      const data = JSON.parse(event.target.result);
      const prefix = "fullmoon.pocketplanner.";

      Object.keys(data).forEach(key => {
        if (key.startsWith(prefix)) {
          localStorage.setItem(key, data[key]);
        }
      });

      alert("Planner restored successfully!");
      location.reload();

    } catch {
      alert("Invalid backup file!");
    }
  };

  reader.readAsText(file);
});