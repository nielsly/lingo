function settings() {
    const container = document.getElementById('lingo');
    container.innerHTML = '';

    const radioGroup = document.createElement('span');

    for (let i = 5; i < 10; i++) {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'size';
        radio.value = i;
        radioGroup.append(radio);

        const label = document.createElement('label');
        label.for = i;
        label.innerHTML = i + ' letterwoorden';
        radioGroup.append(label);

        radioGroup.append(document.createElement('br'));
    }

    radioGroup.children[0].checked = true;

    container.append(radioGroup);

    const submit = document.createElement('button');
    submit.type = 'button';
    submit.innerHTML = "Start Lingo!"

    submit.onclick = function () {
        const size = document.querySelector('input[name="size"]:checked').value;
        lingo(size);
    }

    container.append(submit);
}

async function lingo(size = 5) {
    //setup
    const lingo = document.getElementById('lingo');
    lingo.innerHTML = '';
    const rows = 5;
    
    words = await fetch('../words/' + size + '.json').then(res => res.json());
    wordString = Object.keys(words)[Math.random() * words.length | 0].replace(/\s/g, '');

    const input = document.createElement('input');
    input.type = 'text';
    lingo.append(input);

    const table = createTable(rows, size);
    lingo.append(table);
    let row = -1;

    //get word as char array
    const word = combineIJ(wordString.split(''));
    let known = [word[0]];
    nextRow(table, known, row + 1);
    
    input.onchange = async function() {
        const guessString = this.value.replace(/\s/g, '').toUpperCase();
        const guess = combineIJ(guessString.split(''));
        if (guess.length === size && row < rows) {
            row++;
            known = await guessWord(table, word, known, row, guess);

            if (known === undefined) {
                nextQuestion(size, true);
            } else if (row < rows - 1) {
                //TODO: change for 2 teams
                await nextRow(table, known, row + 1);
            } else {
                table.children[0].hidden = true;
                table.children[rows-1].hidden = false;
                await guessWord(table, word, known, row + 1, word);
                nextQuestion(size, false);
            }
        }
    };
}

function createTable(rows, size) {
    const table = document.createElement('table');

    for (let r = 0; r < rows + 2; r++) {
        const row = document.createElement('tr');

        for (let c = 0; c < size; c++) {
            cell = document.createElement('td');
            cell.append(document.createElement('td'));
            row.append(cell);
        }

        table.append(row)
    }
    
    table.children[rows].hidden = true;
    table.children[rows + 1].hidden = true;
    return table;
}

async function nextRow(table, known, row) {
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

        if (char === word[i]) {
            known[i] = char;
            letters[char]--;
        } else {
            correct = false;
        }
    }

    for (let i = 0; i < cells.length; i++) {
        const char = chars[i];
        cells[i].children[0].innerHTML = char;
        
        if (char === word[i]) {
            cells[i].style.backgroundColor = 'red';
            await sound(1);
        } else if (char in letters && letters[char] > 0) {
            letters[char]--;
            cells[i].children[0].style.backgroundColor = 'yellow';
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

async function nextQuestion(size = 5, correct = false) {
    await sleep(1000);
    lingo(size);
}

function combineIJ(word) {
    for (let i = 1; i < word.length; i++) {
        if (word[i - 1] === 'I' && word[i] === 'J') {
            word[i - 1] = 'IJ';
            word.splice(i, 1);
        }
    }
    return word;
}

document.addEventListener('DOMContentLoaded', function() {
    settings();
});