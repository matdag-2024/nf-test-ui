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
    const existingRegistration = await navigator.serviceWorker.getRegistration();
    if (existingRegistration) {
        await existingRegistration.unregister();
        console.log('Unregistered existing service worker');
    }

    const registration = await navigator.serviceWorker.register('sw.js');
    console.log('New service worker registered:', registration);

    return registration;
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
    if (event.data.type === 'PUSH_RECEIVED') {
        const data = event.data.payload;
        updateUI(data);
    }
});

// navigator.serviceWorker.addEventListener('message', (event) => {
//     if (event.data.type === 'PUSH_RECEIVED') {
//         const data = event.data.payload;
//         updateUI(data);
//     }
// });

function updateUI(data) {
    const notificationDiv = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.message}</p>
        <small>${new Date().toLocaleTimeString()}</small>
    `;
    notificationDiv.prepend(notification);
}


const main = async () => {
    await checkPermission()
    await requestNotificationPermission()
    await registerSW()
}


