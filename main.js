let inputName = document.getElementById("inputName");
let inputPhone = document.getElementById("inputPhone");
let submit = document.getElementById("submit");
let output = document.getElementById('output');
let contact = document.createElement('div');
let errorMessage = document.getElementById('error-message');
let checked = false;
let edited = false;
let localPhone;
let users = [];

submit.addEventListener("click", function () {
    validate();
    createContact();
});

function validate(name, phone) {
    let controlName = /^(?:((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-.\s])){1,}(['’,\-\.]){0,1}){2,}(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){1,})(['’\-,\.]){0,1}){2,}((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){2,})?)*)$/;
    let controlPhone = /(^(?!\+.*\(.*\).*\-\-.*$)(?!\+.*\(.*\).*\-$)(\+[0-9]{1,3}\([0-9]{1,3}\)[0-9]{1}([-0-9]{0,8})?([0-9]{0,1})?)$)|(^[0-9]{1,4}$)/;
    if (edited === true) {
        if (name == "" || phone == "") {
            createErrorMessage('Enter Name or Phone');
            return false;
        };
        if (!controlName.test(name)) {
            createErrorMessage('Invalid Name');
            return false;
        };
        if (!controlPhone.test(phone)) {
            createErrorMessage('Invalid Phone');
            return false;
        };
        if (users.length != 0) {
            let userIndex = users.findIndex(user => user.phone === phone);
            if (userIndex != -1) {
                createErrorMessage('Phone already exists');
                return false;
            };
        };
        if (errorMessage.classList.contains('open-error')) {
            errorMessage.classList.remove('open-error');
        };
        checked = true;
    } else {
        if (inputName.value == "" || inputPhone.value == "") {
            createErrorMessage('Enter Name or Phone');
            return false;
        };
        if (!controlName.test(inputName.value)) {
            createErrorMessage('Invalid Name');
            return false;
        };
        if (!controlPhone.test(inputPhone.value)) {
            createErrorMessage('Invalid Phone');
            return false;
        };
        if (users.length != 0) {
            let userIndex = users.findIndex(user => user.phone === inputPhone.value);
            if (userIndex != -1) {
                createErrorMessage('Phone already exists');
                return false;
            };
        };
        if (errorMessage.classList.contains('open-error')) {
            errorMessage.classList.remove('open-error');
        };
        checked = true;
    };
};

output.onclick = function (event) {
    let target = event.target.textContent;
    let targetParent = event.target.parentNode.parentNode;
    let targetParentChildrenName = targetParent.childNodes[1];
    let targetParentChildrenPhone = targetParent.childNodes[3];
    if (edited === false && targetParentChildrenPhone.textContent) {
        localPhone = targetParentChildrenPhone.textContent;
    };
    switch (target) {
        case 'delete':
            targetParent.classList.add("destroy");
            let userIndex = users.findIndex(user => user.phone === targetParentChildrenPhone.textContent);
            setTimeout(function () {
                users.splice(userIndex, 1);
                updateLocal();
                targetParent.remove();
            }, 900);
            break;
        case 'edit':
            edited = true;
            targetParentChildrenName.classList.add("edit");
            targetParentChildrenPhone.classList.add("edit");
            targetParentChildrenName.contentEditable = true;
            targetParentChildrenPhone.contentEditable = true;
            event.target.textContent = 'save';
            break;
        case 'save':
            validate(targetParentChildrenName.textContent, targetParentChildrenPhone.textContent);
            let userIndexLocal = users.findIndex(user => user.phone === localPhone);
            if (checked === true) {
                targetParentChildrenName.classList.remove("edit");
                targetParentChildrenPhone.classList.remove("edit");
                targetParentChildrenName.contentEditable = false;
                targetParentChildrenPhone.contentEditable = false;
                users[userIndexLocal].name = targetParentChildrenName.textContent;
                users[userIndexLocal].phone = targetParentChildrenPhone.textContent;
                event.target.textContent = 'edit';
                updateLocal();
                checked = false;
                edited = false;
            };
            break;
        default:
            return false;
    };
};

function createContact() {
    if (checked === true) {
        let str = createContactRow(inputName.value, inputPhone.value);
        contact.innerHTML = str + contact.innerHTML;

        let user = {
            name: inputName.value,
            phone: inputPhone.value,
        };
        output.append(contact);
        users.push(user);
        inputName.value = "";
        inputPhone.value = "";
        updateLocal();
        checked = false;
    };
};

function updateLocal() {
    localStorage.setItem('storedUsers', JSON.stringify(users));
};

function createErrorMessage(text) {
    errorMessage.classList.add('open-error');
    let textError = document.getElementById('textError');
    textError.innerText = text;
};

function init() {
    if (localStorage.getItem('storedUsers')) {
        debugger
        users = JSON.parse(localStorage.getItem('storedUsers'));
        if (users.length === 0) {
            initDefault();
        }
    } else {
        initDefault();
    };

    for (let i = 0; i < users.length; i++) {
        let str = createContactRow(users[i].name, users[i].phone);
        contact.innerHTML = str + contact.innerHTML;
        output.append(contact);
    };
};

function createContactRow(name, phone) {
    return `<div class='grid-container'>
    <div class="name" contenteditable="false">${name}</div>
    <div class="phone" contenteditable="false">${phone}</div>
    <div class="btn-edit"><button>edit</button></div>
    <div class="btn-del"><button>delete</button></div>
    </div>`;
}

function initDefault() {
    users = [
        {
            name: "Vlad",
            phone: "+375(44)75-33-097"
        },
        {
            name: "Stas",
            phone: "+375(25)54-35-149"
        },
        {
            name: "Marina",
            phone: "+375(33)32-98-370"
        },
        {
            name: "Olya",
            phone: "+375(29)88-10-721"
        },
        {
            name: "Daniil",
            phone: "+375(44)11-72-000"
        }
    ];
};

init();