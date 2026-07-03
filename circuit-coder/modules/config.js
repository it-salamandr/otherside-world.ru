window.onload = function () {
    const itemTypes = [
        { id: "teg", label: "Контейнер" },
        { id: "atribut", label: "Атрибут" },
        { id: "reflex", label: "Рефлекс" },
        { id: "function", label: "Функционал" },
    ];
    const dynamicContent = document.getElementById("dynamic-content");
    const placeholder = document.getElementById("placeholder");
    let currentIndex = 0;

    function showNextInput() {
        if (currentIndex > 0) {
            // Снимаем checked с предыдущего элемента
            document.getElementById(itemTypes[currentIndex - 1].id).checked = false;
        } else {
            placeholder.style.display = "none";
        }

        if (currentIndex < itemTypes.length) {
            // Создаем новый input и label
            const input = document.createElement("input");
            input.type = "radio";
            input.id = itemTypes[currentIndex].id;
            input.name = "itemType";
            input.value = itemTypes[currentIndex].id;
            input.checked = true; // Устанавливаем checked
            input.onclick = function () {
                builder.updateParentOptions();
            };

            const label = document.createElement("label");
            label.htmlFor = itemTypes[currentIndex].id;
            label.textContent = itemTypes[currentIndex].label;

            // Добавляем их в документ
            dynamicContent.appendChild(input);
            dynamicContent.appendChild(label);

            currentIndex++;
            setTimeout(showNextInput, 500); // Задержка 1000 мс между элементами
        } else {
            document.getElementById(itemTypes[0].id).checked = true;
        }
    }

    // Начинаем замену через 1 секунду после загрузки страницы
    setTimeout(showNextInput, 500);
};
