(function () {
    const form = document.getElementById('item-form');
    const nameInput = document.getElementById('name');
    const priceInput = document.getElementById('price');
    const listEl = document.getElementById('item-list');
    const totalEl = document.getElementById('total');
    const diffEl = document.getElementById('diff');
    const goalInput = document.getElementById('goal');
    const totalSection = document.getElementById('total-section');
    const toggleBtn = document.getElementById('toggle-view');
  
    const items = [];
    let showSelectedOnly = false;
  
    function render() {
      listEl.innerHTML = '';
  
      items.forEach((it, idx) => {
        if (showSelectedOnly && !it.checked) return;
  
        const li = document.createElement('li');
        li.className = 'item';
        if (it.checked) li.classList.add('selected');
  
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = it.checked || false;
        checkbox.addEventListener('change', () => {
          it.checked = checkbox.checked;
          render();
        });
  
        const nameSpan = document.createElement('span');
        nameSpan.textContent = it.name;
  
        const unitInput = document.createElement('input');
        unitInput.type = 'number';
        unitInput.min = 0;
        unitInput.value = it.price;
        unitInput.className = 'unit';
        unitInput.addEventListener('change', () => {
          const val = Number(unitInput.value);
          it.price = val >= 0 ? val : 0;
          render();
        });
  
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = 1;
        quantityInput.value = it.quantity;
        quantityInput.className = 'quantity';
        quantityInput.addEventListener('change', () => {
          const val = Number(quantityInput.value);
          it.quantity = val > 0 ? val : 1;
          render();
        });
  
        const subtotalSpan = document.createElement('span');
        subtotalSpan.className = 'subtotal';
        subtotalSpan.textContent = (it.price * it.quantity).toLocaleString();
  
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '削除';
        removeBtn.className = 'remove';
        removeBtn.addEventListener('click', () => {
          items.splice(idx, 1);
          render();
        });
  
        li.appendChild(checkbox);
        li.appendChild(nameSpan);
        li.appendChild(unitInput);
        li.appendChild(quantityInput);
        li.appendChild(subtotalSpan);
        li.appendChild(removeBtn);
        listEl.appendChild(li);
      });
  
      updateTotal();
    }
  
    function updateTotal() {
        const total = items
          .filter(it => it.checked)
          .reduce((sum, it) => sum + it.price * it.quantity, 0);
        totalEl.textContent = total.toLocaleString();
      
        const goal = Number(goalInput.value);
        const diff = goal - total;
        diffEl.textContent = diff.toLocaleString();
      
        const goalDisplay = document.getElementById('goal-display');
        goalDisplay.textContent = Number.isFinite(goal) ? goal.toLocaleString() : '0';
      
        totalSection.classList.remove('over', 'under', 'match');
        if (!Number.isFinite(goal)) return;
      
        if (diff === 0) {
          totalSection.classList.add('match');
        } else if (diff < 0) {
          totalSection.classList.add('over');
        } else {
          totalSection.classList.add('under');
        }
      }
      
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const price = Number(priceInput.value);
      if (!name || !Number.isFinite(price)) return;
  
      items.push({ name, price, quantity: 1, checked: true });
      nameInput.value = '';
      priceInput.value = '';
      render();
      nameInput.focus();
    });
  
    goalInput.addEventListener('input', updateTotal);
  
    toggleBtn.addEventListener('click', () => {
      showSelectedOnly = !showSelectedOnly;
      toggleBtn.textContent = showSelectedOnly ? '全商品を表示' : '選択商品のみ表示';
      render();
    });
  
    render();
  })();
  