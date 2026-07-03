class NestedArrayBuilder {
    constructor() {
        this.items = [];
        this.color = {
            teg: "#39ff14",
            atribut: "#121313",
            reflex: "#5555ff",
            function: "#ff073a",
        };
        this.selectedItemId = null;
        this.previousState = null;
    }

    addItem(id, name, type, parentId = null) {
        const newItem = { id, name, type, children: [] };
        const insertItem = (list) => {
            const lastAtributIndex = list.map((item) => item.type).lastIndexOf("atribut");
            if (type === "atribut") {
                lastAtributIndex !== -1 ? list.splice(lastAtributIndex + 1, 0, newItem) : list.unshift(newItem);
            } else {
                list.push(newItem);
            }
        };

        if (parentId === null) {
            insertItem(this.items);
        } else {
            const parent = this.findItemById(this.items, parentId);
            if (parent) {
                insertItem(parent.children);
            } else {
                console.error(`Parent with ID ${parentId} not found.`);
            }
        }
    }
	
	
    moveItem(id, direction) {
        const move = (list) => {
                 console.error(list);
            const index = list.findIndex(item => {
                 console.error(`check: ${item.id}.`);
                    return Number(item.id) === Number(id);
                });
            if (index === -1){
				return false;
				}

            const currentItem = list[index];
			
            if (direction === 'up' && index > 0) {
				
            const upperItem = list[index - 1];

            // Проверка на невозможность перемещения вверх
            if (currentItem.type !== 'atribute' && upperItem.type === 'atribute') {
                return false;
            }
                [list[index - 1], list[index]] = [list[index], list[index - 1]];
                return true;
            } else if (direction === 'down' && index < list.length - 1) {
				
            const downItem = list[index + 1];
			
            if (currentItem.type === 'atribute' && downItem.type !== 'atribute') {
                return false;
            }
                [list[index], list[index + 1]] = [list[index + 1], list[index]];
                return true;
            }
			
            return false;
        };

        const traverseAndMove = (list) => {
            if (move(list)) return true;
            for (const item of list) {
                if (traverseAndMove(item.children)) return true;
            }
            return false;
        };

        if(traverseAndMove(this.items)){
			render();
		}
    }
	
    checkmoveItem(id, direction) {
        const move = (list) => {
                 console.error(list);
            const index = list.findIndex(item => {
                    return Number(item.id) === Number(id);
                });
            if (index === -1){
				return false;
				}

				
            const currentItem = list[index];
			
            if (direction === 'up' && index > 0) {
				
            const upperItem = list[index - 1];

            // Проверка на невозможность перемещения вверх
            if (currentItem.type !== 'atribut' && upperItem.type === 'atribut') {
                return false;
            }
			
                return true;
            } else if (direction === 'down' && index < list.length - 1) {
				
            const downItem = list[index + 1];
			
            if (currentItem.type === 'atribut' && downItem.type !== 'atribut') {
                return false;
            }
                return true;
            }
			
            return false;
        };

        const traverseAndMove = (list) => {
            if (move(list)) return true;
            for (const item of list) {
                if (traverseAndMove(item.children)) return true;
            }
            return false;
        };

        return traverseAndMove(this.items);
    }

    updateItem(id, name, type, newParentId = null) {
        const item = this.findItemById(this.items, id);
        if (!item) {
            console.error(`Item with ID ${id} not found.`);
            return;
        }

        // Save state for undo
        this.saveState();

        // Update name and type
        item.name = name;
        item.type = type;

        // Handle parentId change
        const currentParent = this.findParentById(this.items, id);
        if ((currentParent && currentParent.id !== newParentId) || (!currentParent && newParentId !== null)) {
            // Remove item from current parent
            if (currentParent) {
                currentParent.children = currentParent.children.filter((child) => child.id !== id);
            } else {
                // If no parent, remove from root
                this.items = this.items.filter((rootItem) => rootItem.id !== id);
            }

            // Add item to the new parent or root
            if (newParentId === null) {
                this.items.push(item);
            } else {
                const newParent = this.findItemById(this.items, newParentId);
                if (newParent) {
                    newParent.children.push(item);
                } else {
                    console.error(`New parent with ID ${newParentId} not found.`);
                }
            }
        }
    }

    deleteItem(id) {
        // Save state for undo
        this.saveState();

        const currentParent = this.findParentById(this.items, id);
        if (currentParent) {
            currentParent.children = currentParent.children.filter((child) => child.id !== id);
        } else {
            this.items = this.items.filter((item) => item.id !== id);
        }
    }

    saveState() {
        this.previousState = JSON.parse(JSON.stringify(this.items));
    }

    undo() {
        if (this.previousState) {
            this.items = this.previousState;
            this.previousState = null;
        } else {
            console.warn("No previous state to undo.");
        }
    }

    findItemById(items, id) {
        for (const item of items) {
            if (item.id === id) {
                return item;
            }
            const found = this.findItemById(item.children, id);
            if (found) {
                return found;
            }
        }
        return null;
    }

    findParentById(items, childId) {
        for (const item of items) {
            if (item.children.some((child) => child.id === childId)) {
                return item;
            }
            const found = this.findParentById(item.children, childId);
            if (found) {
                return found;
            }
        }
        return null;
    }

    getItems() {
        return this.items;
    }

    renderList(items, parentElement, level = 1) {
        const ul = document.createElement("ul");
        items.forEach((item) => {
            const li = document.createElement("li");
            var name = item.name;
			
            var liData = `<span class="${item.type}"><text class="section_item_id">id: ${item.id}</text> `;
			
            if (item.type === "teg" && level == 1) {
                liData = liData + `<text class="section_item_id">модульный</text> `;
            }
			
			liData = liData + `<b>${name}</b> `;
			
			liData = liData + `<a href="#" onclick="builder.selectItem(${item.id});" class="section_item_id" title="Редактировать"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="section_item_svg"><path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm2.92-2.92l9.06-9.06 3.75 3.75-9.06 9.06H5.92v-3.75z"></path></svg></a>`;
			
			if(builder.checkmoveItem(item.id, 'up')){
				liData = liData + ` <a href="#" onclick="builder.moveItem(${item.id}, 'up')" class="section_item_id" title="Поднять вверх"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="section_item_svg"><path d="M7 14l5-5 5 5H7z"></path></svg></a>`;
			}
			
			if(builder.checkmoveItem(item.id, 'down')){
				liData = liData + ` <a onclick="builder.moveItem(${item.id}, 'down')" class="section_item_id" title="Опустить вниз"><svg class="section_item_svg"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z"></path></svg></a>`;
			}
			
			liData = liData + `<\/span>`;
			
			li.innerHTML = liData;
			
            //li.onclick = (event) => {
               // event.stopPropagation();
               // this.selectItem(item.id);
            //};
            ul.appendChild(li);
            if (item.children.length > 0) {
                this.renderList(item.children, li, level + 1);
            }
        });
        parentElement.appendChild(ul);
    }

    updateParentOptions() {
        var selectElement = document.getElementById("parentId");

        var last_value = selectElement.value;
        selectElement.innerHTML = '<option value="">Корень программы</option>';
        this.addOptions(selectElement, this.items);
        selectElement.value = last_value;
    }

    addOptions(selectElement, items, level = 1) {
        items.forEach((item) => {
            if ((document.querySelector('input[name="itemType"]:checked').value === "reflex" && item.type === "atribut") || item.type === "teg") {
                var see = true;
            } else {
                var see = false;
            }

            if (see) {
                const option = document.createElement("option");
                option.value = item.id;
                var prefix = "&nbsp;".repeat(level * 2);
                var name = item.name;
                if (item.type === "teg" && level == 1) {
                    name = "[модульный] " + name;
                }
                option.innerHTML = `${prefix}[id: ${item.id}] ${name}`;
                selectElement.appendChild(option);

                if (item.children.length > 0) {
                    this.addOptions(selectElement, item.children, level + 1);
                }
            }
        });
    }

    generateOutput() {
        return JSON.stringify(this.items, null, 2);
    }
	
	
    unselectItem() {
		
		this.selectedItemId = null;

            // Сбрасываем форму и возвращаем в режим добавления
            document.getElementById("addItem").style.display = "inline";
            document.getElementById("updateItem").style.display = "none";
            document.getElementById("deleteItem").style.display = "none";
            document.getElementById("closeupdateItem").style.display = "none";
            document.getElementById("itemName").value = "";
            document.getElementById("parentId").value = "";

            // Получаем все элементы input с именем itemType
            const itemTypeInputs = document.querySelectorAll('input[name="itemType"]');

            // Проходим по каждому элементу и устанавливаем checked в зависимости от значения
            itemTypeInputs.forEach((input) => {
                if (input.value === "teg") {
                    input.checked = true; // Устанавливаем checked для элемента с value 'teg'
                } else {
                    input.checked = false; // Убираем checked для всех остальных
                }
            });
		
	}

    selectItem(id) {
        // Если элемент не выбран, выделяем его
            this.selectedItemId = id;
            const item = this.findItemById(this.items, id);
            if (item) {
				
            document.getElementById("updateItem").innerText = "Сохранить элемент [id: "+id+"]";
            document.getElementById("deleteItem").innerText = "Удалить элемент  [id: "+id+"]";
			
                document.getElementById("addItem").style.display = "none";
                document.getElementById("updateItem").style.display = "inline";
                document.getElementById("closeupdateItem").style.display = "inline";
                document.getElementById("deleteItem").style.display = "inline";
                document.getElementById("itemName").value = item.name;
                const parent = this.findParentById(this.items, id);
                document.getElementById("parentId").value = parent ? parent.id : "";

                // Получаем все элементы input с именем itemType
                const itemTypeInputs = document.querySelectorAll('input[name="itemType"]');

                // Проходим по каждому элементу и устанавливаем checked в зависимости от значения
                itemTypeInputs.forEach((input) => {
                    if (input.value === item.type) {
                        input.checked = true; // Устанавливаем checked для элемента с value 'teg'
                    } else {
                        input.checked = false; // Убираем checked для всех остальных
                    }
                });

                builder.updateParentOptions();
            }
    }
}

const builder = new NestedArrayBuilder();
let currentId = 1;

function addItem() {
    if (document.querySelector('input[name="itemType"]:checked') == undefined) {
        alert("Пожалуйста, выберите тип элемента! Например: контейнер.");
        return;
    }

    const itemName = document.getElementById("itemName").value;
    const itemType = document.querySelector('input[name="itemType"]:checked').value;
    const parentId = document.getElementById("parentId").value || null;

    if (itemName.trim() === "") {
        alert("Пожалуйста, введите значение элемента! Например: table.");
        return;
    }

    builder.addItem(currentId, itemName, itemType, parentId ? parseInt(parentId) : null);
    currentId++;

    render();
}

function updateItem() {
    if (builder.selectedItemId === null) {
        alert("Пожалуйста, выберите элемент для изменения! Например: корень программы.");
        return;
    }

    document.getElementById("addItem").style.display = "inline";
    document.getElementById("updateItem").style.display = "none";
    document.getElementById("closeupdateItem").style.display = "none";
    document.getElementById("deleteItem").style.display = "none";

    const itemName = document.getElementById("itemName").value;
    const itemType = document.querySelector('input[name="itemType"]:checked').value;
    const parentId = document.getElementById("parentId").value || null;

    builder.updateItem(builder.selectedItemId, itemName, itemType, parentId ? parseInt(parentId) : null);
    builder.selectedItemId = null;

    render();
}

function deleteItem() {
    if (builder.selectedItemId === null) {
        alert("Пожалуйста, выберите элемент для удаления.");
        return;
    }
    document.getElementById("addItem").style.display = "inline";
    document.getElementById("updateItem").style.display = "none";
    document.getElementById("closeupdateItem").style.display = "none";
    document.getElementById("deleteItem").style.display = "none";
    builder.deleteItem(builder.selectedItemId);
    builder.selectedItemId = null;
    render();
}

function undo() {
    builder.undo();
    render();
}
function render() {
    const nestedListContainer = document.getElementById("nested-list");
    nestedListContainer.innerHTML = "";
    builder.renderList(builder.getItems(), nestedListContainer);

    builder.updateParentOptions();

    const iframe = document.getElementById("output");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    var htmlTop = '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Страница схемокодера</title>\n</head>\n<body>\n    <script>';
    var htmlCenter = `console.clear();
                var schema = ${builder.generateOutput()};
                `;
    var htmlBottom =
        "function schemaToHtml(schema) {\n            // Объект для подсчета количества переходов по каждому ID\n            let transitionCount = {};\n\n            function createElement(node, level = 1, relocation = false) {\n            \n            console.log('запрос: ' + node.type + ' = ' + node.name + ' | level ' + level + ' | relocation '+relocation);\n\n                if (node.type === 'teg' && level === 1 && relocation===false) {\n                console.log('результат: тэг уровня 1 игнорим');\n                    return '';\n                }\n\n                if (node.type === 'reflex') {\n                    const refId = node.name.match(/подключить {id: (\\d+)}/);\n                    if (refId) {\n                      console.log('результат: обнаружен запрос подключение '+parseInt(refId[1]));\n                        const referencedNode = schema.find(item => item.id === parseInt(refId[1]));\n                        if (referencedNode) {\n                            return createElement(referencedNode, level+1);\n                        }\n                    }\n                }\n\n                if (node.type === 'reflex') {\n                    const refId = node.name.match(/перейти на {id: (\\d+)}/);\n                    if (refId) {\n                    \n                    console.log('результат: обнаружен запрос на переход к '+parseInt(refId[1]));\n                    \n                        const referencedNode = schema.find(item => item.id === parseInt(refId[1]));\n                        if (referencedNode) {\n                            // Подсчитываем количество переходов по данному ID\n                            transitionCount[node.id] = (transitionCount[node.id] || 0) + 1;\n\n                            // Если переходов больше 10, игнорируем этот переход\n                            if (transitionCount[node.id] > 10) {\n                                console.log('результат: превышен лимит переходов ' + (transitionCount[node.id]-1));\n                                return '';  // Игнорируем дальнейшие переходы по этому ID\n                            }\n                            \n                            // Определяем уровень вложенности для этого элемента\n                            const level = findNodeLevel(schema, referencedNode.id);\n\n                            // Найдем индекс в схеме и обработаем элементы начиная с найденного\n                            const startIndex = schema.indexOf(referencedNode);\n                            const subSchema = createSubSchema(schema.slice(startIndex), node.id);  // Создаём новый массив, начиная с найденного элемента и обрываем на повторном запуске\n                            \n                            // Добавляем вычисление уровня относительно корня для каждого элемента\n                            const html = subSchema.map(item => {\n                                return createElement(item, level,true);\n                            }).join('');\n                            return html;  // Возвращаем HTML содержимое всех элементов начиная с этого\n                        \n                        }\n                    }\n                }\n\n                if (node.type === 'atribut' && level === 1) {\n                    const styleMatch = node.name.match(/^([\\w-]+):\\s*(.*)$/);\n                    if (styleMatch) {\n                    \n                    console.log('результат: обнаружен запрос на установку в body атрибута ' + styleMatch[1]);\n                    \n                        let currentStyle = document.body.getAttribute('style') || '';\n                        currentStyle += styleMatch[1] + ': ' + styleMatch[2] + ';';\n                        document.body.setAttribute('style', currentStyle.trim());\n                    }\n                    return '';\n                }\n\n                if (node.type === 'teg') {\n                \n                console.log('результат: обнаружен запрос на тэг ' + node.name);\n                \n                    let attributes = ' id=\"' + node.id + '\"';\n                    let innerText = '';\n                    let styles = '';\n\n                    node.children.forEach(child => {\n                        if (child.type === 'atribut') {\n                            if (child.name.startsWith('innerText:')) {\n                                innerText = child.name.split(\":\")[1].trim();\n                            } else {\n                                styles += child.name + '; ';\n                            }\n                        }\n                    });\n\n                    if (styles) {\n                        attributes += ' style=\"' + styles.trim() + '\"';\n                    }\n\n                    let childrenHtml = node.children\n                        .filter(child => child.type !== 'atribut')\n                        .map(child => createElement(child, level + 1))\n                        .join('');\n\n                    return '<' + node.name + '' + attributes + '>' + innerText + '' + childrenHtml + '</' + node.name + '>';\n                }\n                \n              console.log('результат: неизвестная команда');\n              \n                return '';\n            }\n\n            var htmlContent = schema.map(node => createElement(node, 1)).join('');\n\n            return htmlContent;\n        }\n        \n        \n        // Функция для нахождения уровня вложенности элемента в схеме\n        function findNodeLevel(schema, nodeId, currentLevel = 1) {\n            for (let node of schema) {\n                // Если нашли нужный узел\n                if (node.id === nodeId) {\n                    return currentLevel;  // Возвращаем уровень\n                }\n                // Рекурсивно ищем в дочерних элементах\n                if (node.children.length > 0) {\n                    const level = findNodeLevel(node.children, nodeId, currentLevel + 1);\n                    if (level) {\n                        return level;  // Если нашли в дочерних\n                    }\n                }\n            }\n            return null;  // Если не нашли узел\n        }\n        \n        // Функция для создания subSchema, остановившегося на определенном id\n        function createSubSchema(schema, stopId) {\n            let startIndex = -1;\n            let stopIndex = -1;\n\n            // Найдем индекс элемента, на который нужно перейти\n            for (let i = 0; i < schema.length; i++) {\n                if (schema[i].id === stopId) {\n                    stopIndex = i; // Сохраняем индекс, где остановить\n                    break;\n                }\n            }\n\n            // Создаем подмассив, начиная с startIndex и заканчивая на stopIndex\n            if (stopIndex !== -1) {\n                return schema.slice(0, stopIndex + 1); // Останавливаемся на нужном id\n            }\n\n            return []; // Если stopId не найден, возвращаем пустой массив\n        }\n\n        document.body.innerHTML = schemaToHtml(schema);\n    </script>\n</body>\n</html>";

    var html = htmlTop + htmlCenter + htmlBottom;

    document.getElementById("output2").innerHTML = html;
    doc.open();
    doc.write(html);
    doc.close();

    // Сбрасываем форму при обновлении
    document.getElementById("itemName").value = "";
}

function runSequence() {
    if (document.getElementById("runButton").innerText == "Остановить") {
        document.getElementById("runButton").innerText = "Останавливается..";
        return;
    }

    const listItems = document.querySelectorAll("#nested-list li");
    let index = 0;
	
    let relocation_index = false;
	
	let doit_data = {};
    let index_out = false;
    let countPropustitSvet = 0;

    let countPropustitSvetNow = false;
    let countPropustitSvetNow2 = false;
    let countPropustitSvetNow3 = false;
	
    let doit_index = false;
    let doit_index_exists = false;
    let doit_index_out = false;
    let doit_index_out_see = false;

    let doit_index2 = false;
    let doit_index_exists2 = false;
    let doit_index_out2 = false;
    let doit_index_out2see = false;

    let doit_index3 = false;
    let doit_index_exists3 = false;
    let doit_index_out3 = false;
    let doit_index_out3see = false;

    function highlightNext() {
        if (document.getElementById("runButton").innerText == "Останавливается..") {
            if (index > 0) {
                listItems[index - 1].classList.remove("highlight");
            }
            if (relocation_index !== false) {
                listItems[relocation_index].classList.remove("highlight");
            }
            if (index_out !== false) {
                listItems[index_out].classList.remove("highlight");
            }
            document.getElementById("runButton").innerText = "Запустить";
            return;
        }


        console.log("запрошенный индекс: " + index);

        let relocation_exists = false;
        if (index > 0 && doit_index_exists !== index && doit_index_exists2 !== index && doit_index_exists3 !== index && countPropustitSvetNow===false) {
            if(listItems[index - 1]){
				listItems[index - 1].classList.remove("highlight");
			}
        }
        if (relocation_index !== false) {
            listItems[relocation_index].classList.remove("highlight");
            relocation_index = false;
            relocation_exists = true;
        }
        if (index_out !== false) {
            listItems[index_out].classList.remove("highlight");
            index_out = false;
        }

        console.log("countPropustitSvetNow: " + countPropustitSvetNow);
        console.log("countPropustitSvetNow2: " + countPropustitSvetNow2);
        console.log("countPropustitSvetNow3: " + countPropustitSvetNow3);

        if (index === countPropustitSvetNow) {
            countPropustitSvetNow = false;
            countPropustitSvetNow3 = true;
        }
        else if (countPropustitSvetNow3===true) {
            listItems[countPropustitSvetNow2].classList.remove("highlight");
            countPropustitSvetNow3 = false;
        }

        console.log("countPropustitSvetNow: " + countPropustitSvetNow);
        console.log("countPropustitSvetNow2: " + countPropustitSvetNow2);
        console.log("countPropustitSvetNow3: " + countPropustitSvetNow3);
			
        if (index < listItems.length) {
		
        var currentItem = listItems[index];
        var itemData = currentItem.querySelector("span");

            if (!relocation_exists && doit_index_exists !== index && doit_index_exists2 !== index && doit_index_exists3 !== index) {
				
                var isTegWithPhrase = itemData.classList.contains("teg") && itemData.textContent.includes(" модульный");


                if (isTegWithPhrase) {
                    var countIn = currentItem.querySelectorAll("span").length;
                    for (let i = 1; i <= countIn; i += 1) {
						
                        index++;
                    }
                    setTimeout(highlightNext, 0);
                    return;
                }
            }


            if(countPropustitSvet>0){
				countPropustitSvet = countPropustitSvet -1;
			}
			else{
				currentItem.classList.add("highlight");
			}

            let relocation = false;
            if (itemData.classList.contains("reflex")) {
                relocation = itemData.textContent.match(/перейти на \{id: (\d+)\}/);
            }

            let doit = false;
            if (itemData.classList.contains("reflex")) {
                doit = itemData.textContent.match(/подключить \{id: (\d+)\}/);
            }

            if (doit_index_out3 !== false && doit_index_out3 === index) {
                console.log("detect out 3 level run: " + index);

                index_out = doit_index_out3;
                doit_index_out3 = false;
                index = doit_index3;
                doit_index3 = false;
                doit_index_out3see = index;
            } else if (doit_index_out2 !== false && doit_index_out2 === index) {
                console.log("detect out 2 level run: " + index);

                index_out = doit_index_out2;
                doit_index_out2 = false;
                index = doit_index2;
                doit_index2 = false;
                doit_index_out2see = index;
            } else if ((!doit || (doit_index_out3see === false && doit_index_out2see === index) || doit_index_out3see === index) && doit_index_out !== false && doit_index_out === index) {
                console.log("detect out 1 level run: " + index);

                doit_index_out2see = false;
                index_out = doit_index_out;
                doit_index_out = false;
				doit_index_exists = false;
                doit_index_exists2 = false;
				doit_index_exists3 = false;
                index = doit_index;
                doit_index = false;

                console.log("detect default item on out 1 level run: " + index);
                index++;
            } else if (doit_index_out2see === index) {
				doit_index_exists2 = false;
				doit_index_exists3 = false;
                console.log("detect default item on out 2 level run: " + index);
                index++;
            } else if (doit_index_out3see === index) {
				doit_index_exists3 = false;
                console.log("detect default item on out 3 level run: " + index);
                console.log("detect default item: " + index);
                index++;
            } else if (doit) {
                const targetId = parseInt(doit[1]);
                const targetIndex = Array.from(listItems).findIndex((item) => {
                    const itemIdMatch = item.querySelector("text").textContent.match(/id: (\d+)/);
                    return itemIdMatch && parseInt(itemIdMatch[1]) === targetId;
                });

                if (targetIndex !== -1) {
                    var doit_index_reload = index;
                    index = targetIndex;

                    if (doit_index_out == false) {
                        console.log("detect in 1 level run: " + index);
                        doit_index = doit_index_reload;
                        doit_index_exists = index;
                        doit_index_out = targetIndex;
                        const countIn = listItems[index].querySelectorAll("span").length;
                        for (let i = 1; i < countIn; i += 1) {
                            doit_index_out++;
                        }
                    } else if (doit_index_out2 == false) {
                        console.log("detect in 2 level run: " + index);
                        doit_index2 = doit_index_reload;
                        doit_index_exists2 = index;
                        doit_index_out2 = targetIndex;
                        const countIn = listItems[index].querySelectorAll("span").length;
                        for (let i = 1; i < countIn; i += 1) {
                            doit_index_out2++;
                        }
                    } else if (doit_index_out3 == false) {
                        console.log("detect in 3 level run: " + index);
                        doit_index3 = doit_index_reload;
                        doit_index_exists3 = index;
                        doit_index_out3 = targetIndex;
                        const countIn = listItems[index].querySelectorAll("span").length;
                        for (let i = 1; i < countIn; i += 1) {
                            doit_index_out3++;
                        }
                    }
                } else {
                    index++;
                }
            } else if (relocation) {
                console.log("detect relocation: " + index);
                const targetId = parseInt(relocation[1]);
                const targetIndex = Array.from(listItems).findIndex((item) => {
                    const itemIdMatch = item.querySelector("span").textContent.match(/id: (\d+)/);
                    return itemIdMatch && parseInt(itemIdMatch[1]) === targetId;
                });

                if (targetIndex !== -1) {
                    relocation_index = index;
                    index = targetIndex;
                } else {
                    index++;
                }
            } else {

                if (itemData.classList.contains("atribut")) {
                    countPropustitSvet = currentItem.querySelectorAll("span").length - 1;
                    if(countPropustitSvet>0){
                        countPropustitSvetNow = index + countPropustitSvet;
                        countPropustitSvetNow2 = index;
                    }
                }
				
                console.log("detect default command: " + index);
                index++;
				
            }
				var wait = 1000;

                console.log("countPropustitSvet: " + countPropustitSvet);
                console.log("countPropustitSvetNow: " + countPropustitSvetNow);

            if(countPropustitSvet>0){
				var wait = 0;
			}

            console.log("wait next command: " + wait);
            setTimeout(highlightNext, wait);
			
        } else {
            document.getElementById("runButton").classList.remove("highlight2");
            document.getElementById("runButton").innerText = "Запустить";
        }
    }

    document.getElementById("runButton").classList.add("highlight2");
    document.getElementById("runButton").innerText = "Остановить";

    highlightNext();
}
