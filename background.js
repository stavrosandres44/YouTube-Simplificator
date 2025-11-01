// Al instalar la extensión
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ waitingForYouTubeOpen: true });
});

// Escucha cuando se carga una pestaña
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.startsWith("https://www.youtube.com/")
  ) {
    chrome.storage.local.get("waitingForYouTubeOpen", (data) => {
      if (data.waitingForYouTubeOpen) {
        // Mostrar notificación
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Using YouTube Simplificator",
          message: "Your YouTube interface has been simplified."
        });

        // Evitar que vuelva a mostrarse
        chrome.storage.local.set({ waitingForYouTubeOpen: false });
      }
    });
  }
});
