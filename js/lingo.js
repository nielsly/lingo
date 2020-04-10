async function lingo() {
    //setup
    const lingo = document.getElementById("lingo");
    const rows = 5;
    const size = 5;
    const input = document.createElement('input');
    input.type = "text";
    lingo.append(input)
    const table = createTable(rows, size);
    lingo.append(table);
    let row = -1;

    //get word as char array
    const word = combineIJ(await generateWord(size));
    let known = [word[0].toUpperCase()];
    nextRow(table, known, row + 1);
    
    input.onchange = async function() {
        const guess = await combineIJ(input.value.replace(/\s/g, '').toUpperCase().split(''));
        if (guess.length === size && row < size) {
            row++;
            known = await guessWord(table, word, known, row, guess);

            if (known === undefined) {
                nextQuestion(true);
            } else if (row < rows - 2) {
                //TODO: change for 2 teams
                await nextRow(table, known, row + 1, rows);
            } else {
                table.children[0].hidden = true;
                table.children[rows-1].hidden = false;
                await guessWord(table, word, known, row + 1, word);
                nextQuestion(false);
            }
        }
    };
}

function createTable(rows, size) {
    const table = document.createElement("table");

    for (let r = 0; r < rows + 2; r++) {
        const row = document.createElement("tr");

        for (let c = 0; c < size; c++) {
            cell = document.createElement("td");
            cell.append(document.createElement("td"));
            row.append(cell);
        }

        table.append(row)
    }
    table.children[rows].hidden = true;
    table.children[rows + 1].hidden = true;
    return table;
}

async function generateWord(size) {
    //open file of words of desired size and split into array by newlines
    
    
    //return random word as char array
    return words[Math.random() * words.length | 0].toUpperCase().split('');
}

var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[Math.random() * keys.length | 0]];
};

async function nextRow(table, known, row, rows) {
    const cells = table.children[row].children;
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.children[0].innerHTML = known[i] === undefined ? '.' : known[i];
        await sleep(200);
    }
}

async function guessWord(table, word, known, row, chars) {
    const cells = table.children[row].children;
    
    for (let i = 0; i < cells.length; i++) {
        cells[i].children[0].innerHTML = chars[i];
        await sleep(200);
    }

    const letters = {};
    let correct = true;

    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        letters[char] = char in letters ? letters[char] + 1 : 1;
    }

    for (let i = 0; i < cells.length; i++) {
        const char = chars[i];

        if (char == word[i]) {
            known[i] = char;
            letters[char]--;
        } else {
            correct = false;
        }
    }

    for (let i = 0; i < cells.length; i++) {
        const char = chars[i];
        cells[i].children[0].innerHTML = char;
        
        if (char == word[i]) {
            cells[i].style.backgroundColor = 'red';
            await sound(1);
        } else if (char in letters && letters[char] > 0) {
            letters[char]--;
            cells[i].children[0].style.backgroundColor = "yellow";
            await sound(2);
        } else {
            await sound(0);
        }
    }

    if (correct) {
        return undefined;
    }

    return known;
}

async function sound(type) {
    const audio = new Audio('audio/' + type + '.mp3');
    audio.play();
    await sleep(100);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function nextQuestion(correct) {
    await sleep(1000);
    document.getElementById('lingo').innerHTML = '';
    lingo();
}

function combineIJ(word) {
    console.log("test" + word)
    for (let i = 1; i < word.length; i++) {
        if (word[i - 1] === "I" && word[i] === "J") {
            word[i - 1] = "IJ";
            word.splice(i, 1);
        }
    }
    console.log("test" + word)
    return word;
}

document.addEventListener('DOMContentLoaded', function() {
    lingo();
});