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
  calendarTab: {
    title: "CalendarTab",
    url: "https://poornima20.github.io/CalenderTab-DataTab/",
    previewImage: "./previews/calendar.png"
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
  }
};



const CATEGORY_PAGES = {
  daily: [ "datatabPlanner", "Habbit" ],

  weekly: ["calendarTab" ],

  goals: ["jobTab", "projectVisualizer"  ],

  notes: [  "notesTab"  ]
};





buttons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    document.body.classList.remove(...modes);
    document.body.classList.add(btn.dataset.mode);

    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // 30px button + 4px gap = 34px
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
    url: page.url
  });

  localStorage.setItem("plannerPages", JSON.stringify(pages));
}




function renderPlannerPages() {
  const container = document.getElementById("plannerCanvas");
  const pages = getSavedPages();

  container.innerHTML = "";

  pages.forEach((page, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "planner-page-wrapper";
    wrapper.draggable = true;
    wrapper.dataset.index = index;

    const iframe = document.createElement("iframe");
    iframe.src = page.url;
    iframe.className = "planner-frame";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer";
    iframe.tabIndex = -1; 

    wrapper.appendChild(iframe);
    container.appendChild(wrapper);
  });

}


const plannerCanvas = document.getElementById("plannerCanvas");
const pagesOverlay = document.getElementById("pagesOverlay");
const pagesDoneBtn = document.querySelector(".pages-done");

// Open Pages
document.getElementById("plannerPages").onclick = () => {
  profilePage.classList.add("pages-open");
  pagesOverlay.classList.add("active");
  renderPagesList();
};

// Close Pages
pagesDoneBtn.onclick = () => {
  profilePage.classList.remove("pages-open");
  pagesOverlay.classList.remove("active");
};




document.getElementById("plannerHome").onclick = () => {
  profilePage.classList.remove("active");
};




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

      <div class="mini-title">${page.title}</div>

      <div class="mini-actions">
        <button data-action="move"><i data-lucide="move"></i></button>
<button data-action="duplicate"><i data-lucide="copy"></i></button>
<button data-action="delete"><i data-lucide="trash-2"></i></button>
<button data-action="refresh"><i data-lucide="refresh-cw"></i></button>

      </div>
    `;

    list.appendChild(card);
    lucide.createIcons();

  });
}


document.querySelector(".pages-list").onclick = e => {
  const btn = e.target;
  const card = btn.closest(".page-card-mini");
  if (!card) return;

  const index = Number(card.dataset.index);
  const pages = getSavedPages();

  if (btn.dataset.action === "delete") {
    pages.splice(index, 1);
  }

  if (btn.dataset.action === "duplicate") {
    pages.splice(index + 1, 0, {
      ...pages[index],
      id: crypto.randomUUID()
    });
  }

  if (btn.dataset.action === "refresh") {
    renderPlannerPages();
    return;
  }

  localStorage.setItem("plannerPages", JSON.stringify(pages));
  renderPagesList();
  renderPlannerPages();
};





function getPreviewByUrl(url) {
  const entry = Object.values(PAGE_LIBRARY).find(p => p.url === url);
  return entry?.previewImage || "./previews/default.png";
}

let dragIndex = null;

document.querySelector(".pages-list").addEventListener("dragstart", e => {
  const item = e.target.closest(".page-item");
  if (!item) return;

  dragIndex = Number(item.dataset.index);
});

document.querySelector(".pages-list").addEventListener("dragover", e => {
  e.preventDefault();
});

document.querySelector(".pages-list").addEventListener("drop", e => {
  const target = e.target.closest(".page-item");
  if (!target || dragIndex === null) return;

  const pages = getSavedPages();
  const from = dragIndex;
  const to = Number(target.dataset.index);

  const [moved] = pages.splice(from, 1);
  pages.splice(to, 0, moved);

  localStorage.setItem("plannerPages", JSON.stringify(pages));
  dragIndex = null;

  renderPagesList();
  renderPlannerPages();
});

let snapEnabled = false;

profilePage.addEventListener("scroll", () => {
  if (!snapEnabled) {
    document.getElementById("plannerCanvas").style.scrollSnapType = "y mandatory";
    snapEnabled = true;
  }
}, { once: true });



document.querySelector(".pages-list").addEventListener("click", e => {
  const btn = e.target;
  const card = btn.closest(".page-card-mini");
  if (!card) return;

  const index = Number(card.dataset.index);
  const pages = getSavedPages();

  if (btn.dataset.action === "delete") {
    pages.splice(index, 1);
  }

  if (btn.dataset.action === "duplicate") {
    pages.splice(index + 1, 0, { ...pages[index], id: crypto.randomUUID() });
  }

  if (btn.dataset.action === "refresh") {
    renderPlannerPages();
  }

  localStorage.setItem("plannerPages", JSON.stringify(pages));
  renderPagesList();
  renderPlannerPages();
});
