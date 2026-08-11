const openingScreen = document.querySelector(".opening-screen");
const inviteVideo = document.querySelector(".invite-video");
const inviteAudio = document.querySelector(".invite-audio");
const detailsScreen = document.querySelector(".details-screen");
const modalBackdrop = document.querySelector(".modal-backdrop");
const modalTitle = document.querySelector("#modal-title");
const modalBody = document.querySelector("#modal-body");
const closeModalButton = document.querySelector(".modal-close");
const desktopContinueButton = document.querySelector(".desktop-continue");
const AUDIO_FADE_DURATION = 10000;
let audioFadeFrame = null;

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
    text: "Venha em traje social, com um toque de encanto para uma noite de conto de fadas.\n\nPedimos gentilmente que evite trajes azuis, pois essa cor será reservada para a aniversariante.",
  },
};

const showDetailsScreen = () => {
  detailsScreen?.classList.add("is-visible");
  inviteVideo?.classList.add("is-ended");
  fadeOutAudio();
};

const stopAudioFade = () => {
  if (audioFadeFrame) {
    cancelAnimationFrame(audioFadeFrame);
    audioFadeFrame = null;
  }
};

const fadeOutAudio = () => {
  if (!inviteAudio || inviteAudio.paused) {
    return;
  }

  stopAudioFade();

  const startVolume = inviteAudio.volume;
  const startTime = performance.now();

  const fadeStep = (now) => {
    const progress = Math.min((now - startTime) / AUDIO_FADE_DURATION, 1);
    inviteAudio.volume = Math.max(startVolume * (1 - progress), 0);

    if (progress < 1) {
      audioFadeFrame = requestAnimationFrame(fadeStep);
      return;
    }

    inviteAudio.pause();
    inviteAudio.currentTime = 0;
    inviteAudio.volume = 1;
    audioFadeFrame = null;
  };

  audioFadeFrame = requestAnimationFrame(fadeStep);
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

  stopAudioFade();
  inviteVideo.muted = false;
  inviteVideo.volume = 1;
  inviteVideo.currentTime = 0;
  inviteVideo.classList.remove("is-ended");
  detailsScreen?.classList.remove("is-visible");

  if (inviteAudio) {
    inviteAudio.muted = false;
    inviteAudio.volume = 1;
    inviteAudio.currentTime = 0;
  }

  const videoPlayPromise = inviteVideo.play();
  const audioPlayPromise = inviteAudio?.play();

  openingScreen.classList.add("is-hidden");

  Promise.allSettled([
    videoPlayPromise || Promise.resolve(),
    audioPlayPromise || Promise.resolve(),
  ]).then((results) => {
    const videoRejected = results[0]?.status === "rejected";

    if (videoRejected) {
      openingScreen.classList.remove("is-hidden");
      inviteAudio?.pause();
    }
  });
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
