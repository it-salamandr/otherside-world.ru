
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
            // Создаем обертку для пары «радиокнопка + текст»
            const wrapper = document.createElement("span");
            wrapper.style.whiteSpace = "nowrap";

            // Создаем radio input
            const input = document.createElement("input");
            input.type = "radio";
            input.id = itemTypes[currentIndex].id;
            input.name = "itemType";
            input.value = itemTypes[currentIndex].id;
            input.checked = true;

            input.onclick = function () {
                builder.updateParentOptions();
            };

            // Создаем label
            const label = document.createElement("label");
            label.htmlFor = itemTypes[currentIndex].id;
            label.textContent = itemTypes[currentIndex].label;

            // Добавляем элементы в обертку
            wrapper.appendChild(input);
            wrapper.appendChild(label);

            // Добавляем пару в контейнер
            dynamicContent.appendChild(wrapper);

            currentIndex++;
            setTimeout(showNextInput, 500);
        } else {
            document.getElementById(itemTypes[0].id).checked = true;
        }
    }

    // Начинаем замену через 500 мс после загрузки страницы
    setTimeout(showNextInput, 2000);
};
