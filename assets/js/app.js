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
            console.log('changes')
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
            console.log(pushRealtime)
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
        console.log(pushRealtime)
        if(!pushRealtime) {
            console.log(selectedPixels)
            db.collection("characters").add({
                "current": false,
                "pixels": selectedPixels
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
        document.getElementById("pushRealtime").checked = false
        toggleRealtime()
        clearPixels()
        loadCharacters()
    }
}

const toggleRealtime = () => {
    console.log('pushed')
    if(document.getElementById("pushRealtime").checked) {
        pushRealtime = true
    } else {
        pushRealtime = false
    }
    console.log(pushRealtime)
}

const loadCharacters = async() => {
    const container = document.getElementById('charactersList')
    const snapshot = await db.collection('characters').get()

    container.innerHTML = ""

    snapshot.docs.map(doc => {
        const character = document.createElement('div');
        character.className = "character"
        character.id = doc.id

        character.onclick = function() { 
            loadClickedCharacter(this.id)
        }
        for(let y = 0; y < 8; y++) {
            for(let x = 0; x < 8; x++) {
                const div = document.createElement('div');
                div.className = 'pixel';
                doc.data().pixels.forEach(pixel => {
                    if(pixel.x == x && pixel.y == y) {
                        div.style.backgroundColor = pixel.color
                    }
                });
                character.appendChild(div)
            }
        }
        container.appendChild(character)
    })
}

const loadClickedCharacter = (id) => {
    var characterRef = db.collection("characters").doc(id);
    characterRef.get().then(function(doc) {
        if (doc.exists) {
            let current = doc.data().current
            console.log(current)
            console.log(!current)

            characterRef.update({
                current: !current
            })
            .then(function() {
                console.log("Document successfully updated!");
            })
            .catch(function(error) {
                console.error("Error updating document: ", error);
            });
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

loadCharacters()
