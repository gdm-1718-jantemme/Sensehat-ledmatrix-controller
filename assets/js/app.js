var firebaseConfig = {
    apiKey: "AIzaSyDp2VXbjNAFrWo9qSy9cUTinHDTf6k0Ow0",
    authDomain: "character-generator-bb5b6.firebaseapp.com",
    databaseURL: "https://character-generator-bb5b6.firebaseio.com",
    projectId: "character-generator-bb5b6",
    storageBucket: "character-generator-bb5b6.appspot.com",
    messagingSenderId: "957318233480",
    appId: "1:957318233480:web:a50546f95cb64919f5ce3d"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()

const blocksContainer = document.getElementById("blocks-container")
const rows = blocksContainer.children
const numbers = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eigth"]
let ledObject;
let x, y, color
let selectedPixels = []
let pushRealtime = false
let currentRefId

for (const row of rows) {
    for (const item of row.children) {
        item.addEventListener("change", (e) => {
            color = e.target.value;

            numbers.forEach((number, index) => {
                if ((e.target.classList).contains(`${number}-row`)) {
                    y = index;
                }
                if ((e.target.classList).contains(`${number}-element`)) {
                    x = index;
                }
            });
            ledObject = {
                'x': x,
                'y': y,
                'color': color
            };
            selectedPixels.push(ledObject);
            if(pushRealtime) {
                if(currentRefId) {
                    db.collection("characters").doc(currentRefId).update({
                        pixels: selectedPixels
                    });
                } else {
                    db.collection("characters").add({
                        "pixels": selectedPixels
                    })
                    .then(function(docRef) {
                        currentRefId = docRef.id
                        console.log("Document written with ID: ", docRef.id);
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    });
                }
            }
        });
    }
}

const clearPixels = () => {
    selectedPixels = []
    currentRefId = null
    for (const row of rows) {
        for (const item of row.children) {
            item.value = "#000000"
        }
    }
}

const submitCharacter = () => {
    if(selectedPixels.length > 0) {
        document.getElementById("pushRealtime").checked = false
        console.log(selectedPixels)
        db.collection("characters").add({
            "pixels": selectedPixels
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
        clearPixels()
    }
}

const toggleRealtime = () => {
    if(document.getElementById("pushRealtime").checked) {
        pushRealtime = true
    } else {
        pushRealtime = false
    }
}
