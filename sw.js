function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const saveSubscription = async (subscription) => {
    // const response = await fetch("https://nf-test-ui.onrender.com/save-subscription", {
    const response = await fetch("http://localhost:3000/save-subscription", {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(subscription)
    })

    return response.json()
}

self.addEventListener('activate', async (e) => {
    console.log("In activating module");
    // Check if service worker is already active
    try {
        const existingSubscription = await self.registration.pushManager.getSubscription();
        console.log(existingSubscription,"Existing")
        if (!existingSubscription) {
            console.log("Neeeeew")
            const subscription = await self.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array("BCTrWHRejIZgIzrsBob9CdszCoBhq0oylzFvjJ9_ZV2iIg15Rrb2c4UgRkH7_Jqt18-NIzW8htgyfOMT3JzppKQ")
            });
            const response = await saveSubscription(subscription);
            self.clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            }).then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'PUSH_RECEIVED',
                        payload: {title:"New",message:"message1"}
                    });
                });
            });
            console.log('New subscription created:', response);
        } else {
            console.log('Existing subscription found:', existingSubscription);
            const response = await saveSubscription(existingSubscription);
            self.clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            }).then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'PUSH_RECEIVED',
                        payload: {title:"Existing",message:"message1"}
                    });
                });
            });
            console.log('Existing subscription saved:', response);
        }
    } catch (error) {
        console.error('Error handling subscription:', error);
    }
});

// self.addEventListener('push',(e)=>{
//     self.registration.showNotification("Yeeeah",{
//         body:e.data.text()
//     })
// })
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'No payload',
    };

    event.waitUntil(
        self.registration.showNotification('Yeeeah', options).then(() => {
            // Send a message to the client to play audio
            self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({ action: 'play-audio' });
                });
            });
        })
    );
})


// Public Key:
// BCTrWHRejIZgIzrsBob9CdszCoBhq0oylzFvjJ9_ZV2iIg15Rrb2c4UgRkH7_Jqt18-NIzW8htgyfOMT3JzppKQ

// Private Key:
// v3DUPzYyQD7FXN-_hTGZjr7DXCvILmaGgJyMy-2kZFk