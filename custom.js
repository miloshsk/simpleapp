// Variables
const places = document.querySelectorAll('.title'),
	  items = document.querySelector('.items-wrapper'),
	  list = document.querySelector('#list'),
	  expense = document.querySelector('.expense'),
	  expenseValue = document.querySelector('#expense-value'),
	  //Total reuslts
	  totalResults = document.querySelector('.total-result'),
	  favFoodResult = document.querySelector('.fav-food'),
	  totalCostResult = document.querySelector('.total'),
	  averageCostResult = document.querySelector('.average-result'),
	  //Buttons
	  totalBtnWrapper = document.querySelector('.total-buttons-wrapper'),
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
class ItemAdd {
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
	deleteItem(target) {
		if(target.className === 'delete-item') {
			target.parentElement.parentElement.remove();
		}
	}
}

//Class Message
class Message {
	showMessage(message) {
		const messageDiv = document.createElement('div');
		messageDiv.className = 'message';	
		messageDiv.appendChild(document.createTextNode(message));
		items.appendChild(messageDiv);
		setTimeout(function() {
			document.querySelector('.message').remove();
		}, 2000);
	}
}
//Class Total
class ItemTotal{
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
			const add = new ItemAdd;
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
	const add = new ItemAdd();
	const mes = new Message();

	if(expenseValue.value === '') {
		mes.showMessage('Enter value');
	} else {
		add.addItemToList(item);
		Store.addFood(item);
		add.clearFields();
	}
});

//Detete items
list.addEventListener('click', function(e) {
	const add = new ItemAdd();
	add.deleteItem(e.target);
	switch(e.target.parentElement.previousElementSibling ) {
		case null:
			break;
		default:
			Store.removeFood(e.target.parentElement.previousElementSibling.textContent);
	}
});

//Total buttons events
totalBtnWrapper.addEventListener('click', function(e) {
	const item = new Item();
	const total = new ItemTotal();
	const mes = new Message();
	const target = e.target;
	
	switch(target) {
		case calcFavFood:
			if(localStorage.length !== 0) {
				total.favFood(item);
			} else {
				mes.showMessage('Localstorage is empty');
			};
			break;
		case calcTotalCost:
			if(localStorage.length !== 0) {
				total.totalSum(item);
			} else {
				mes.showMessage('Localstorage is empty');
			};
			break;
		case calcAverageCost:
			if(localStorage.length !== 0) {
				total.averageSum(item);
			} else {
				mes.showMessage('Localstorage is empty');
			};
			break;
		case clearBtn:
			Store.clearAll(item);
			total.clearAll(item);
			mes.showMessage('Clear all');
			break;
	}
});