const openingScreen = document.querySelector(".opening-screen");
const inviteVideo = document.querySelector(".invite-video");
const detailsScreen = document.querySelector(".details-screen");
const modalBackdrop = document.querySelector(".modal-backdrop");
const modalTitle = document.querySelector("#modal-title");
const modalBody = document.querySelector("#modal-body");
const closeModalButton = document.querySelector(".modal-close");
const desktopContinueButton = document.querySelector(".desktop-continue");

const modalContent = {
  gift: {
    title: "Presente",
    sections: [
      {
        icon: "👗",
        title: "Roupas",
        items: ["Blusa P", "Calça, short ou saia P/M (38)", "Tênis 37/38"],
      },
      {
        icon: "💍",
        title: "Acessórios",
        items: ["Colar", "Pulseira", "Anel 15/16", "Brinco", "Só uso prata"],
      },
      {
        icon: "🎁",
        title: "Mais ideias",
        items: ["Perfume", "Body splash", "Creme de pele", "Maquiagem", "Bolsa"],
      },
    ],
    pix: "31986296394",
  },
  dress: {
    title: "Traje",
    text: "Venha em traje social, com um toque de encanto para uma noite de conto de fadas.",
  },
};

const showDetailsScreen = () => {
  detailsScreen?.classList.add("is-visible");
  inviteVideo?.classList.add("is-ended");
};

const renderGiftContent = (content) => {
  const fragment = document.createDocumentFragment();

  content.sections.forEach((section) => {
    const group = document.createElement("section");
    group.className = "gift-section";

    const heading = document.createElement("h3");
    heading.innerHTML = `<span aria-hidden="true">${section.icon}</span>${section.title}`;

    const list = document.createElement("ul");
    section.items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      list.appendChild(listItem);
    });

    group.append(heading, list);
    fragment.appendChild(group);
  });

  const pix = document.createElement("p");
  pix.className = "gift-pix";
  pix.innerHTML = `<span>PIX</span> ${content.pix}`;
  fragment.appendChild(pix);

  return fragment;
};

const openModal = (modalId) => {
  const content = modalContent[modalId];

  if (!content || !modalBackdrop || !modalTitle || !modalBody) {
    return;
  }

  modalTitle.textContent = content.title;
  modalBody.replaceChildren();

  if (content.sections) {
    modalBody.appendChild(renderGiftContent(content));
  } else {
    const text = document.createElement("p");
    text.textContent = content.text;
    modalBody.appendChild(text);
  }

  modalBackdrop.dataset.modal = modalId;
  modalBackdrop.hidden = false;
  closeModalButton?.focus();
};

const closeModal = () => {
  if (!modalBackdrop) {
    return;
  }

  modalBackdrop.hidden = true;
  delete modalBackdrop.dataset.modal;
};

openingScreen?.addEventListener("click", () => {
  if (!inviteVideo) {
    return;
  }

  inviteVideo.muted = false;
  inviteVideo.volume = 1;
  inviteVideo.currentTime = 0;
  inviteVideo.classList.remove("is-ended");
  detailsScreen?.classList.remove("is-visible");

  const playPromise = inviteVideo.play();

  openingScreen.classList.add("is-hidden");

  if (playPromise) {
    playPromise.catch(() => {
      openingScreen.classList.remove("is-hidden");
    });
  }
});

inviteVideo?.addEventListener("ended", showDetailsScreen);

document.querySelectorAll("[data-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.dataset.modal);
  });
});

closeModalButton?.addEventListener("click", closeModal);

modalBackdrop?.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

desktopContinueButton?.addEventListener("click", () => {
  document.body.classList.add("desktop-accepted");
  openingScreen?.focus();
});
