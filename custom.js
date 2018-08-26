// Item Controller
const FoodItemCtrl = (function(){
	// Item Constructor
	const FoodItem = function (id, title, cost) {
		this.id = id;
		this.title = title;
		this.cost = cost;
	}
	// Data Structure
	const data = {
		foodItemID: 0,
		foodItemTitle: '',
		foodItemCost: 0,
		foodItems: []
	}
	return {
		getItems () {
			return data.foodItems;
		},
		setTitle () {
			data.foodItemTitle = this.dataset.food;
		},
		setCost (cost) {
			data.foodItemCost = cost;
		},
		setID () {
			data.foodItemsID = data.foodItems.length;
		},
		addItem () {
			const newFoodItem = new FoodItem(data.foodItemsID, data.foodItemTitle, data.foodItemCost);
			data.foodItems.push(newFoodItem);
			return newFoodItem;
		},
		removeItem (e) {
			const id = parseInt(e.target.closest('tr').getAttribute('data-id'));
			data.foodItems.forEach(function(item, index) {
				if(item.id === id) {
					data.foodItems.splice(index, 1);
				}
			});
		},
		getTotalSum () {
			let result = 0;
			for(let item of data.foodItems) {
				result += item.cost;
			}
			return result;
		},
		getTotalResult() {
			const result = this.getTotalSum();
			const message = `Total cost: ${result}`;
			return message;
		},
		getAverageValue(){
			const result = this.getTotalSum();
			let message = '';
			if(result === 0) {
				message = 'Average value: 0';
			} else {
				message = `Average value: ${(result / data.foodItems.length).toFixed(2)}`;
			}
			return message;
		},
		getFavoriteFood() {
			let count = Object.create(null), max = 0, message = '', current;
			for(let item of data.foodItems) {
				if((current = count[item.title] = ~~count[item.tile] + 1) > max){
					max = current;
				}
			}
			let result = Object.keys(count).filter(function(x) {
				return count[x] === max;
			});
			if(result.length === 0) {
				message = 'You haven\'t eaten anything yet';
			} else {
				message = `Favorite food: ${result.join(', ')}`;
			}
			return message;
		},
		clearItems() {
			data.foodItems = [];
		}
	}
})();

// UI Controller
const UICtrl = (function(){
	const UISelectors = {
		itemList: '#list',
		foodTitle: '.title',
		expense: '.expense',
		expenseValue: '#expense-value',
		deleteItem: '.delete-item',
		totalResultBtn: '.calculate-total',
		totalResultBlock: '.total',
		averageValueBtn: '.average',
		averageValueBlock: '.average-result',
		favoriteFoodBtn: '.favorite-food',
		favoriteFoodBlock: '.fav-food',
		clearBtn: '.clear'
	}
	return {
		populateItemList (items){
			let html = '';
			items.forEach(function(item) {
				html += `<tr data-id="${item.id}">
						 <td>${item.title}</td>
						 <td>${item.cost}</td>
						 <td><button class="delete-item"></button></td></tr>`;
			});
			document.querySelector(UISelectors.itemList).innerHTML = html;
		},
		additemToList (item) {
			const row = document.createElement('tr');
			row.dataset.id = item.id;
			row.innerHTML = ` <td>${item.title}</td>
						 <td>${item.cost}</td>
						 <td><button class="delete-item"></button></td>`;
			document.querySelector(UISelectors.itemList).appendChild(row);
		},
		getSelectors () {
			return UISelectors;
		},
		showExpenseForm () {
			document.querySelector(UISelectors.expense).style.display = 'block';
		},
		getCostValue () {
			const costValue = document.querySelector(UISelectors.expenseValue).value;
			let result;
			if(costValue) {
				result = parseInt(costValue);
			} else {
				result = 0
			} 
			return result;
		},
		hideExpenseForm () {
			document.querySelector(UISelectors.expense).style.display = 'none';
			document.querySelector(UISelectors.expenseValue).value = '';
		},
		removeItemRow (e) {
			if(e.target.className == UISelectors.deleteItem.slice(1)) {
				e.target.closest('tr').remove();
			}
		},
		showTotal (selector, message) {
			document.querySelector(selector).textContent = message;
		},
		clearFoodItems () {
			const list = document.querySelector(UISelectors.itemList);
			while(list.firstChild) {
				list.removeChild(list.firstChild);
			}
		}
	}
})();

// App Controller

const App = (function(FoodItemCtrl, UICtrl){
	let items, UISelectors;
	const loadEventListeners = function() {
		UISelectors = UICtrl.getSelectors();
		Array.from(document.querySelectorAll(UISelectors.foodTitle)).forEach(function(item) {
			item.addEventListener('click',openExpenseForm );
		});
		document.querySelector(UISelectors.expense).addEventListener('submit',createFoodItemRow );
		document.querySelector(UISelectors.itemList).addEventListener('click',removeItemRow);
		document.querySelector(UISelectors.totalResultBtn).addEventListener('click', showTotalCost );
		document.querySelector(UISelectors.averageValueBtn).addEventListener('click', showAverageValue);
		document.querySelector(UISelectors.favoriteFoodBtn).addEventListener('click',showFavoriteFood );
		document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAll );
	}
	const showTotalCost = function() {
		const result = FoodItemCtrl.getTotalResult();
		UICtrl.showTotal(UISelectors.totalResultBlock, result);
	}
	const showAverageValue = function() {
		const averageVal = FoodItemCtrl.getAverageValue();
		UICtrl.showTotal(UISelectors.averageValueBlock, averageVal);
	}
	const showFavoriteFood = function() {
		const favoriteFood = FoodItemCtrl.getFavoriteFood();
		UICtrl.showTotal(UISelectors.favoriteFoodBlock, favoriteFood);
	}
	const clearAll = function() {
		FoodItemCtrl.clearItems();
		UICtrl.hideExpenseForm();
		UICtrl.clearFoodItems();
		showTotalCost();
		showAverageValue();
		showFavoriteFood();
	}
	const removeItemRow = function(e) {
		UICtrl.removeItemRow(e);
		FoodItemCtrl.removeItem(e);
	}
	const createFoodItemRow = function(e) {
		e.preventDefault();
		const cost = UICtrl.getCostValue();
		FoodItemCtrl.setCost(cost);

		UICtrl.hideExpenseForm();
		const newFoodItem = FoodItemCtrl.addItem();

		UICtrl.additemToList(newFoodItem);
	}
	const openExpenseForm = function() {
		FoodItemCtrl.setID();
		FoodItemCtrl.setTitle.call(this);
		UICtrl.showExpenseForm();
	}
	return {
		init: function(){
			items = FoodItemCtrl.getItems();
			UICtrl.populateItemList(items);
			loadEventListeners();
		}
	}
})(FoodItemCtrl, UICtrl);

App.init();