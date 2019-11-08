const blocksContainer = document.getElementById('blocks-container')
const rows = blocksContainer.children
const numbers = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eigth']
let ledObject
let x, y, color
let selectedPixels = []

for (let row of rows) {
    for (let item of row.children) {
        item.addEventListener('change', (e) => {
            color = e.target.value

            numbers.forEach((number, index) => {
                if((e.target.classList).contains(`${number}-row`))
                    y = index
                if((e.target.classList).contains(`${number}-element`))
                    x = index
            });
            ledObject = {
                'x': x,
                'y': y,
                'color': color
            }
            selectedPixels.push(ledObject)
        })
    }
}

submitCharacter = () => {
    console.log(selectedPixels)
}
