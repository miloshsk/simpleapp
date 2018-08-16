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
// FoodItem class
class FoodItem {
	constructor(title, cost) {
		this.title = title;
		this.cost = cost;
	}
	addItemToList() {	
		const row = document.createElement('tr');
		row.innerHTML = `
		<td>${this.title}</td>
		<td>${this.cost}</td>
		<td><button class="delete-item"></button></td>`;
		list.appendChild(row);
	}
	deleteItem(target) {
		if(target.className === 'delete-item') {
			target.parentElement.parentElement.remove();
		}
	}
}

// ClearItem class
class ClearItem { 
	static clearFields() {
		expenseValue.value = '';
		expense.style.display = 'none';
	}
	static clearAll() {
		for(let i = 0; i < totalResults.children.length; i++) {
			totalResults.children[i].textContent = '';
		}
		while(list.firstChild) {
			list.removeChild(list.firstChild);
		}
	}
}

//Class Message
class Message {
	static showMessage(message) {
		const messageDiv = document.createElement('div');
		messageDiv.className = 'message';	
		messageDiv.appendChild(document.createTextNode(message));
		items.appendChild(messageDiv);
		setTimeout(function() {
			document.querySelector('.message').remove();
		}, 2000);
	}
}
//Class TotalResults
class TotalResults{
	static totalSum() {
		let arr = JSON.parse(localStorage.getItem('fastFoodItems'));
		let result = 0;
		for(let item of arr) {
			result += +item.cost;
		}
		totalCostResult.textContent = `Total cost: ${result}`;
	}
	static favFood() {
		let arr = JSON.parse(localStorage.getItem('fastFoodItems'));
		let count = Object.create(null), max = 0, cur;
		for (let item of arr) {
  		if ((cur = count[item.title] = ~~count[item.title] + 1) > max) {
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
	static averageSum() {
		let arr = JSON.parse(localStorage.getItem('fastFoodItems'));
		let result = 0, i;
		for( i = 0; i < arr.length; i++) {
			result += +arr[i].cost;
		}
		if(result === 0) {
			averageCostResult.textContent = 'Average value: 0';
		} else {
			averageCostResult.textContent = `Average value: ${(result / i).toFixed(2)}`; 
		}
	}
}
//LS class
class Store {
	static getFood() {
		let fastFoodItems;
		if(localStorage.getItem('fastFoodItems') === null) {
			fastFoodItems = [];
		} else {
			fastFoodItems = JSON.parse(localStorage.getItem('fastFoodItems'));
		}
		return fastFoodItems;
	}
	static displayFood() {
		const fastFoodItems = Store.getFood();
		fastFoodItems.forEach( function(item) {
			const foodItem = new FoodItem(item.title,item.cost);
			foodItem.addItemToList();
		});
	}
	static addFood(item) {
		const fastFoodItems = Store.getFood();
		fastFoodItems.push(item);
		localStorage.setItem('fastFoodItems', JSON.stringify(fastFoodItems));
	}
	static removeFood(cost) {
		const fastFoodItems = Store.getFood();
		fastFoodItems.forEach( function(item, index) {
			if(item.cost === cost) {
				fastFoodItems.splice(index, 1);
			}
		});
		localStorage.setItem('fastFoodItems', JSON.stringify(fastFoodItems));
	}
	static clearAll(item) {
		localStorage.removeItem('fastFoodItems');
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
	const foodItem = new FoodItem(title, cost);

	if(expenseValue.value === '') {
		Message.showMessage('Enter value');
	} else {
		foodItem.addItemToList();
		Store.addFood(foodItem);
		ClearItem.clearFields();
	}
});

//Detete items
list.addEventListener('click', function(e) {
	const foodItem = new FoodItem();
	foodItem.deleteItem(e.target);
	switch(e.target.parentElement.previousElementSibling ) {
		case null:
			break;
		default:
			Store.removeFood(e.target.parentElement.previousElementSibling.textContent);
	}
});

//Total buttons events
totalBtnWrapper.addEventListener('click', function(e) {
	const foodItem = new FoodItem();
	const target = e.target;
	switch(target) {
		case calcFavFood:
			if(localStorage.getItem('fastFoodItems') !== null) {
				TotalResults.favFood(foodItem);
			} else {
				Message.showMessage('Localstorage is empty');
			};
			break;
		case calcTotalCost:
			if(localStorage.getItem('fastFoodItems') !== null) {
				TotalResults.totalSum(foodItem);
			} else {
				Message.showMessage('Localstorage is empty');
			};
			break;
		case calcAverageCost:
			if(localStorage.getItem('fastFoodItems') !== null) {
				TotalResults.averageSum(foodItem);
			} else {
				Message.showMessage('Localstorage is empty');
			};
			break;
		case clearBtn:
			Store.clearAll(foodItem);
			ClearItem.clearAll(foodItem);
			Message.showMessage('Clear all');
			break;
	}
});