async function parse(size) {
    const wordsArray = (await fetch('../../words/' + size + '.txt').then(x => x.text())).split('\n');
    const wordsObject = {}

    for (let i = 0; i < wordsArray.length; i++) {
        wordsObject[wordsArray[i]] = wordsArray[i];
    }

    const jsonString = JSON.stringify(wordsObject);

    const params = {'jsonString':jsonString, 'fileName': size}
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'php/parse.php';
  
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = params[key];
    
            form.appendChild(hiddenField);
        }
    }
  
    document.body.appendChild(form);
    form.submit();
}

function addInput() {
    const input = document.createElement('input');
    input.type = 'text';
    document.body.append(input);

    const submit = document.createElement('a');
    submit.href = '#';
    submit.innerHTML = 'Parse file'
    submit.onclick = function() {
        parse(input.value);
    }
    document.body.append(submit);
}

document.addEventListener('DOMContentLoaded', function() {
    addInput();
});