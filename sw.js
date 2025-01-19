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

const saveSubscription = async (subscription)=>{
    const response = await fetch("https://nf-test-ui.onrender.com/save-subscription",{
        method:"post",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(subscription)
    })

    return response.json()
}

self.addEventListener('activate', async (e) => {
    console.log("In activating module")
    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BCTrWHRejIZgIzrsBob9CdszCoBhq0oylzFvjJ9_ZV2iIg15Rrb2c4UgRkH7_Jqt18-NIzW8htgyfOMT3JzppKQ")
    })
    const response = await saveSubscription(subscription)
    console.log(response)
})

self.addEventListener('push',(e)=>{
    self.registration.showNotification("Yeeeah",{
        body:e.data.text()
    })
})


// Public Key:
// BCTrWHRejIZgIzrsBob9CdszCoBhq0oylzFvjJ9_ZV2iIg15Rrb2c4UgRkH7_Jqt18-NIzW8htgyfOMT3JzppKQ

// Private Key:
// v3DUPzYyQD7FXN-_hTGZjr7DXCvILmaGgJyMy-2kZFk