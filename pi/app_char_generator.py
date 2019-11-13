from sense_hat import SenseHat
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import time

SenseHat().clear()

print('Initializing Firestore connection...')
# Credentials and Firebase App initialization. Always required
firCredentials = credentials.Certificate("./character-generator-bb5b6-firebase-adminsdk-rioeb-60200d2e9a.json")
firApp = firebase_admin.initialize_app (firCredentials)

# Get access to Firestore
db = firestore.client()
print('Connection initialized')

lightsChanged = False
justStarted = True

def on_snapshot(doc_snapshot, changes, read_time):
    global lightsChanged, justStarted
    if not justStarted:
        for change in changes:
            print(change.document.id)
            readDb(change.document.id)
            lightsChanged = True
    
    justStarted = False

def setLeds(doc):
    SenseHat().clear()
    pixels = doc['pixels']
    for pixel in pixels:
        h = pixel['color'].lstrip('#')
        color = tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
        SenseHat().set_pixel(pixel['x'], pixel['y'], color)

def readDb(id):
    print('fetching pixels')
    global lightsChanged
    lightsChanged = False
    doc_ref = db.collection(u'characters').document(id)
    lights = doc_ref.get().to_dict()
    setLeds(lights)

doc_ref = db.collection('characters')
doc_watch = doc_ref.on_snapshot(on_snapshot)

# Keep the app running
while True:
    print("listenening...")
    time.sleep(1)