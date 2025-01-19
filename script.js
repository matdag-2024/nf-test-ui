const checkPermission = async () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error("No support for service worker")
    } else {
        console.log("Support service worker")
    }

    if (!('Notification' in window)) {
        throw new Error("No Support for notificaion API")
    } else {
        console.log("Support notificaiton api")
    }
}

const registerSW = async () => {
    const registration = await navigator.serviceWorker.register('sw.js')
    return registration
}

const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        throw new Error("Notification permission not granted")
    }
}
navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'play-audio') {
        const audio = new Audio('/sound.mp3'); // Replace with your audio file URL
        audio.play().catch((error) => console.error('Audio playback failed:', error));
    }
});


const main = async () => {
    await checkPermission()
    await requestNotificationPermission()
    await registerSW()
}


