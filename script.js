const modes = ["plain", "dotted", "grid"];
const buttons = document.querySelectorAll(".track button");
const thumb = document.querySelector(".thumb");
const DEFAULT_PLANNER_NAME = "Your Planner Name";

const PAGE_LIBRARY = {
  datatabPlanner: {
    title: "DataTab Planner",
    url: "https://poornima20.github.io/DataTab-ProjectVisualizer/",
    previewImage: "./previews/datatab.png"
  },
  notesTab: {
    title: "NotesTab",
    url: "https://poornima20.github.io/DataTab-ProjectVisualizer/",
    previewImage: "./previews/notestab.png"
  },
  jobTab: {
    title: "JobTab",
    url: "https://poornima20.github.io/JobTab-DataTab/",
    previewImage: "./previews/jobtab.png"
  },
  projectVisualizer: {
    title: "Project Visualizer",
    url: "https://poornima20.github.io/DataTab-ProjectVisualizer/",
    previewImage: "./previews/project.png"
  },
  Habbit: {
    title: "Habit Tracker",
    url: "https://poornima20.github.io/DataTab-ProjectVisualizer/",
    previewImage: "./previews/habit.png"
  },
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
  }
};



const CATEGORY_PAGES = {
  daily: [ "focusgrid", "datatabPlanner", "Habbit" ],

  monthly: [ "tasklog" ],

  weekly: ["weeklog" ],

  goals: ["jobTab", "projectVisualizer"  ],

  notes: [  "notesTab"  ],

  tracker: [ "projecttimeline" ]
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

// Load saved planner name
const savedPlannerName = localStorage.getItem("personalPlannerName");
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
    localStorage.removeItem("personalPlannerName");
    plannerNameDisplay.textContent = DEFAULT_PLANNER_NAME;
    profilePlannerName.textContent = DEFAULT_PLANNER_NAME;
  } else {
    localStorage.setItem("personalPlannerName", value);
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
  return JSON.parse(localStorage.getItem("plannerPages")) || [];
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

  localStorage.setItem("plannerPages", JSON.stringify(pages));
}




function renderPlannerPages() {
  const container = document.getElementById("plannerCanvas");
  const pages = getSavedPages().filter(p => !p.hidden);

  container.innerHTML = "";

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


  localStorage.setItem("plannerPages", JSON.stringify(pages));
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

    localStorage.setItem("plannerPages", JSON.stringify(pages));
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

  localStorage.setItem("plannerPages", JSON.stringify(pages));
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


