let words,
    keys,
    size,
    checkDictionary,
    suggestionsForm,
    latestSuggestion;

function settings() {
    const container = document.getElementById('lingo');
    container.innerHTML = '';

    for (let i = 5; i < 10; i++) {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'size';
        radio.value = i;
        container.append(radio);

        const label = document.createElement('label');
        label.for = i;
        label.innerHTML = i + ' letterwoorden';
        container.append(label);

        container.append(document.createElement('br'));
    }

    container.children[0].checked = true;

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = 'checkDictionary';
    container.append(checkBox);

    const checkLabel = document.createElement('label');
    checkLabel.for = 'checkDictionary';
    checkLabel.innerHTML = 'Check if words are in dictionary';
    container.append(checkLabel);

    container.append(document.createElement('br'));

    const submit = document.createElement('button');
    submit.type = 'button';
    submit.innerHTML = "Start Lingo!"

    submit.onclick = async function () {
        size = parseInt(document.querySelector('input[name="size"]:checked').value);
        words = await fetch('../words/' + size + '.json').then(res => res.json());
        keys = Object.keys(words);
        checkDictionary = checkBox.checked;

        lingo();
        suggestions(size);
    }

    container.append(submit);
}

async function lingo() {
    //setup
    const lingo = document.getElementById('lingo');
    lingo.innerHTML = '';
    const rows = 5;
    const input = document.createElement('input');
    input.type = 'text';
    lingo.append(input);

    const table = createTable(rows);
    lingo.append(table);
    let row = -1;

    //get word as char array
    const wordString = keys[Math.random() * keys.length | 0];
    const word = combineIJ(wordString.split(''));
    let known = [word[0]];
    nextRow(table, known, row + 1);
    
    input.onchange = async function() {
        const guessString = input.value.replace(/\s/g, '').toUpperCase();
        const guess = combineIJ(guessString.split(''));

        let check;
        if (checkDictionary) {
            check = (guessString in words);
            if (!check && (guess.length === size)) {
                addSuggestion(guessString);
            }
        } else {
            check = (guess.length === size);
            if (check && !(guessString in words)) {
                addSuggestion(guessString);
            }
        }
        if (row < rows && check) {
            row++;
            known = await guessWord(table, word, known, row, guess);

            if (known === undefined) {
                nextQuestion(true);
            } else if (row < rows - 1) {
                //TODO: change for 2 teams
                await nextRow(table, known, row + 1);
            } else {
                table.children[0].hidden = true;
                table.children[rows].hidden = false;
                await guessWord(table, word, known, row + 1, word);
                nextQuestion(false);
            }
        }
    };
}

function createTable(rows) {
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

async function nextQuestion(correct = false) {
    await sleep(1000);
    lingo();
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

function suggestions() {
    suggestionsForm = document.createElement('form');
    suggestionsForm.method = 'post';
    suggestionsForm.action = 'php/suggestions.php';

    latestSuggestion = document.createElement('p');
    suggestionsForm.append(latestSuggestion);

    const sizeField = document.createElement('input');
    sizeField.type = 'hidden';
    sizeField.name = 'size';
    sizeField.value = size;
    suggestionsForm.append(sizeField);

    const submit = document.createElement('input');
    submit.type = 'submit';
    submit.value = "Submit suggestions";
    suggestionsForm.append(submit);

    document.getElementById('container').insertBefore(suggestionsForm, document.getElementsByTagName('footer')[0]);
}

function addSuggestion(word) {
    const suggestion = document.createElement('input');
    suggestion.type = 'hidden';
    suggestion.name = 'suggestion[]';
    suggestion.value = word;
    suggestionsForm.append(suggestion);

    latestSuggestion.innerHTML = 'Suggestion added:' + word;
}

document.addEventListener('DOMContentLoaded', function() {
    settings();
});