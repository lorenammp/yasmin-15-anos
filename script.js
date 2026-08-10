const openingScreen = document.querySelector(".opening-screen");
const inviteVideo = document.querySelector(".invite-video");
const detailsScreen = document.querySelector(".details-screen");
const modalBackdrop = document.querySelector(".modal-backdrop");
const modalTitle = document.querySelector("#modal-title");
const modalText = document.querySelector("#modal-text");
const closeModalButton = document.querySelector(".modal-close");

const modalContent = {
  date: {
    title: "Data",
    text: "Em breve confirmaremos a data desse sonho. Reserve esse momento com carinho.",
  },
  time: {
    title: "Horário",
    text: "A celebração está prevista para começar às 21 horas.",
  },
  gift: {
    title: "Presente",
    text: "Sua presença já será um presente especial. Sugestões carinhosas chegarão por aqui.",
  },
  dress: {
    title: "Traje",
    text: "Venha em traje social, com um toque de encanto para uma noite de conto de fadas.",
  },
};

const showDetailsScreen = () => {
  inviteVideo?.classList.add("is-hidden");
  detailsScreen?.classList.add("is-visible");
};

const openModal = (modalId) => {
  const content = modalContent[modalId];

  if (!content || !modalBackdrop || !modalTitle || !modalText) {
    return;
  }

  modalTitle.textContent = content.title;
  modalText.textContent = content.text;
  modalBackdrop.hidden = false;
  closeModalButton?.focus();
};

const closeModal = () => {
  if (!modalBackdrop) {
    return;
  }

  modalBackdrop.hidden = true;
};

openingScreen?.addEventListener("click", () => {
  if (!inviteVideo) {
    return;
  }

  inviteVideo.muted = false;
  inviteVideo.volume = 1;
  inviteVideo.currentTime = 0;

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
