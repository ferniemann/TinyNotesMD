const btnNewCategory = document.querySelector("#new-category");
const btnNewNote = document.querySelector("#new-note");

const data = {
    categories: [],
};

let categoryId;
let noteId;

renderLayout();

function renderLayout() {
    const categoriesList = document.querySelector("#categories");
    categoriesList.innerText = "";

    for (let category of data.categories) {
        const categoryItem = document.createElement("li");
        categoryItem.classList.add("category");

        const categoryCheck = document.createElement("input");
        categoryCheck.type = "radio";
        categoryCheck.name = "category";
        categoryCheck.classList.add("category__element");
        categoryCheck.id = "cat" + category.id;
        categoryCheck.dataset.id = category.id;

        const categoryText = document.createElement("label");
        categoryText.innerText = category.title;
        categoryText.setAttribute("for", categoryCheck.id);
        categoryText.classList.add("category__element-text");

        categoryItem.append(categoryCheck, categoryText);
        categoriesList.append(categoryItem);
    }

    if (categoryId) {
        const checkedCategory = document.querySelector(`[data-id="${categoryId}"]`);
        checkedCategory.checked = true;
    }

    categoriesList.addEventListener("change", renderNotesList);
}

function renderNotesList(e) {
    const notesList = document.querySelector("#notes-list");
    let id;

    btnNewNote.hidden = false;

    notesList.innerText = "";

    if (typeof e === "object") {
        id = Number(e.target.dataset.id);
    } else {
        id = Number(e);
    }

    const notes = data.categories.filter((category) => category.id === id);
    categoryId = id;

    if (notes[0].notes) {
        notes[0].notes.forEach((note) => {
            const noteItem = document.createElement("li");
            noteItem.classList.add("note");

            const noteCheck = document.createElement("input");
            noteCheck.type = "radio";
            noteCheck.name = "note";
            noteCheck.id = "note" + note.id;
            noteCheck.classList.add("note__element");

            const noteTitle = document.createElement("label");
            noteTitle.setAttribute("for", noteCheck.id);
            noteTitle.innerText = note.title;

            noteItem.append(noteCheck, noteTitle);
            notesList.append(noteItem);
        });
    }
}

btnNewCategory.addEventListener("click", createNewCategory);
btnNewNote.addEventListener("click", createNewNote);

function createNewCategory() {
    const newCategoryTitleElement = document.querySelector("#new-category-title");

    newCategoryTitleElement.hidden = false;
    newCategoryTitleElement.disabled = false;
    newCategoryTitleElement.focus();

    newCategoryTitleElement.addEventListener("focusout", function hideForm() {
        newCategoryTitleElement.value = "";
        newCategoryTitleElement.hidden = true;
        newCategoryTitleElement.disabled = true;

        this.removeEventListener("keypress", hideForm);
    });

    newCategoryTitleElement.addEventListener("keypress", function addCategory(e) {
        if (e.key === "Enter") {
            const newCategoryTitle = newCategoryTitleElement.value.replace(/\s\s+/g, " ").trim();

            if (checkIfCategoryIsUnique(newCategoryTitle) && newCategoryTitle.length > 0) {
                const newCategory = {
                    title: newCategoryTitle,
                    notes: [],
                    id: createNewId(),
                };

                data.categories.unshift(newCategory);

                renderLayout();

                const newCategoryItem = document.querySelector(`[data-id="${newCategory.id}"]`);
                newCategoryItem.checked = true;

                newCategoryTitleElement.value = "";
                newCategoryTitleElement.hidden = true;
                newCategoryTitleElement.disabled = true;

                this.removeEventListener("keypress", addCategory);
                renderNotesList(newCategory.id);
            }
        }
    });
}

function createNewNote() {
    const newNoteTitleElement = document.querySelector("#new-note-title");
    const index = data.categories.findIndex((category) => category.id === categoryId);

    newNoteTitleElement.hidden = false;
    newNoteTitleElement.disabled = false;
    newNoteTitleElement.focus();

    newNoteTitleElement.addEventListener("focusout", function hideForm() {
        newNoteTitleElement.hidden = true;
    });

    newNoteTitleElement.addEventListener("keypress", function addNote(e) {
        if (e.key === "Enter") {
            const newNoteTitle = newNoteTitleElement.value;

            const newNote = {
                id: createNewId(),
                title: newNoteTitle,
                text: "Schreibe deinen Notiztext in Markdown",
            };

            if (checkIfNoteIsUnique(newNote.title) && newNote.title.length > 0) {
                data.categories[index].notes.unshift(newNote);
                newNoteTitleElement.hidden = true;
                newNoteTitleElement.disabled = true;
                newNoteTitleElement.value = "";
                renderNotesList(categoryId);
            }

            this.removeEventListener("keypress", addCategory);
        }
    });
}

function checkIfCategoryIsUnique(newCategory) {
    if (data.categories.findIndex((category) => category.title === newCategory) === -1) {
        return true;
    }

    return false;
}

function checkIfNoteIsUnique(noteTitle) {
    const index = data.categories.findIndex((category) => category.id === categoryId);
    if (data.categories[index].notes.findIndex((note) => note.title === noteTitle) === -1) {
        return true;
    } else {
        return false;
    }
}

function createNewId() {
    const newId = Math.floor(Math.random() * 4999 * (Math.random() * 2500));

    if (data.categories.findIndex((category) => category.id === newId) === -1) {
        return newId;
    }

    createNewId();
}
