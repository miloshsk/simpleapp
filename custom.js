// Variables
const places = document.querySelectorAll('.title'),
	  list = document.querySelector('#list'),
	  expense = document.querySelector('.expense'),
	  expenseValue = document.querySelector('#expense-value'),
	  //Total reuslts
	  totalResults = document.querySelector('.total-result'),
	  favFoodResult = document.querySelector('.fav-food'),
	  totalCostResult = document.querySelector('.total'),
	  averageCostResult = document.querySelector('.average-result'),
	  //Buttons
	  calcTotalCost = document.querySelector('.calculate-total'),
	  calcAverageCost = document.querySelector('.average'),
	  calcFavFood = document.querySelector('.calculate-food'),
	  clearBtn = document.querySelector('.clear');
// Item class
class Item {
	constructor(title, cost) {
		this.title = title;
		this.cost = cost;
	}
}

// Add class
class Add {
	addItemToList(item) {	
		const row = document.createElement('tr');
		row.innerHTML = `
		<td>${item.title}</td>
		<td>${item.cost}</td>
		<td><button class="delete-item"></button></td>`;
		list.appendChild(row);
	}
	clearFields() {
		expenseValue.value = '';
		expense.style.display = 'none';
	}
	showError(error) {
		const errorDiv = document.createElement('div');
		errorDiv.className = 'error-message';	
		errorDiv.appendChild(document.createTextNode(error));
		expense.insertBefore(errorDiv, expenseValue );
		setTimeout(function() {
			document.querySelector('.error-message').remove();
		}, 2000);
	}
	deleteItem(target) {
		if(target.className === 'delete-item') {
			target.parentElement.parentElement.remove();
		}
	}
	totalSum() {
		let arr =JSON.parse(localStorage.items);
		let result = 0;
		for(let i = 0; i < arr.length; i++) {
			result += +arr[i].cost;
		}
		totalCostResult.textContent = `Total cost: ${result}`;
	}
	favFood() {
		let arr =JSON.parse(localStorage.items);
		let count = Object.create(null), max = 0, cur;
		for (let x of arr) {
  		if ((cur = count[x.title] = ~~count[x.title] + 1) > max) {
		    max = cur;
		  }
		}
		let res = Object.keys(count).filter(function(x) {
			return count[x] === max;
		});
		if(res.length === 0) {
			favFoodResult.textContent = 'You haven\'t eaten anything yet';
		} else {
			favFoodResult.textContent = `Favorite food: ${res.join(' and ')}`;
		}
	}
	averageSum() {
		let arr =JSON.parse(localStorage.items);
		let result = 0, cnt;
		for(let i = 0; i < arr.length; i++) {
			result += +arr[i].cost;
			cnt = i + 1;
		}
		if(result === 0) {
			averageCostResult.textContent = 'Average value: 0';
		} else {
		averageCostResult.textContent = `Average value: ${(result / cnt).toFixed(2)}`; 
		}
	}
	clearAll() {
		for(let i = 0; i < totalResults.children.length; i++) {
			totalResults.children[i].textContent = '';
		}
		while(list.firstChild) {
			list.removeChild(list.firstChild);
		}
	}
}

//LS class
class Store {
	static getFood() {
		let items;
		if(localStorage.getItem('items') === null) {
			items = [];
		} else {
			items = JSON.parse(localStorage.getItem('items'));
		}
		return items;
	}
	static displayFood() {
		const items = Store.getFood();
		items.forEach( function(item) {
			const add = new Add;
			add.addItemToList(item);
		});
	}
	static addFood(item) {
		const items = Store.getFood();
		items.push(item);
		localStorage.setItem('items', JSON.stringify(items));
	}
	static removeFood(cost) {
		const items = Store.getFood();
		items.forEach( function(item, index) {
			if(item.cost === cost) {
				items.splice(index, 1);
			}
		});
		localStorage.setItem('items', JSON.stringify(items));
	}
	static clearAll(item) {
		localStorage.removeItem('items');
	}
}
// Dp Ls
document.addEventListener('DOMContentLoaded', Store.displayFood);
// Button click event
for(let i = 0; i < places.length; i++) {
	places[i].addEventListener('click', function() {
		expense.style.display = 'block';
		title = this.textContent;
	})
}

//Form submit event
expense.addEventListener('submit', function(e) {
	e.preventDefault();
	const cost = expenseValue.value;
	const item = new Item(title, cost);
	const add = new Add();

	if(expenseValue.value === '') {
		add.showError('Enter value');
	} else {
		add.addItemToList(item);
		Store.addFood(item);
		add.clearFields();
	}
});

//Detete items

list.addEventListener('click', function(e) {
	const add = new Add();
	add.deleteItem(e.target);
	switch(e.target.parentElement.previousElementSibling ) {
		case null:
			break;
		default:
			Store.removeFood(e.target.parentElement.previousElementSibling.textContent);
	}
})

calcTotalCost.addEventListener('click', function() {
	const item = new Item();
	const add = new Add();
	add.totalSum(item);
})

calcFavFood.addEventListener('click', function()  {
	const item = new Item();
	const add = new Add();
	add.favFood(item);
})
calcAverageCost.addEventListener('click', function() {
	const item = new Item();
	const add = new Add();
	add.averageSum(item);
})
clearBtn.addEventListener('click', function() {
	const item = new Item();
	const add = new Add();
	Store.clearAll(item);
	add.clearAll(item);
})