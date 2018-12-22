// Storage Controller
const StorageCtrl = (()=> {
	return {
		storeItem (foodItem) {
			let foodItems;
			if(localStorage.getItem('foodItems') === null) {
				foodItems = [];
				foodItems.push(foodItem);
				localStorage.setItem('foodItems', JSON.stringify(foodItems));
			} else {
				foodItems = JSON.parse(localStorage.getItem('foodItems'));
				foodItems.push(foodItem);
				localStorage.setItem('foodItems', JSON.stringify(foodItems));
			}
		},
		getItemsFromStorage () {
			let foodItems;
			if(localStorage.getItem('foodItems') === null) {
				foodItems = [];
			} else {
				foodItems = JSON.parse(localStorage.getItem('foodItems'));
			}
			return foodItems;
		},
		deleteItemFromStorage(id) {
			let items = JSON.parse(localStorage.getItem('foodItems'));
			const newId = items.findIndex((item) => {return item.id === id});
			items.splice(newId,1);
			localStorage.setItem('foodItems', JSON.stringify(items));
		},
		clearStorage() {
			localStorage.removeItem('foodItems');
		}
	}
})();
// Item Controller
const FoodItemCtrl = (() =>{
	// Item Constructor
	const FoodItem = function (id, title, cost) {
		this.id = id;
		this.title = title;
		this.cost = cost;
	};
	// Data Structure
	const data = {
		foodItemID: 0,
		foodItemTitle: '',
		foodItemCost: 0,
		foodItems: StorageCtrl.getItemsFromStorage()
	};
	return {
		getItems () {
			return data.foodItems;
		},
		setTitle (target) {
			data.foodItemTitle = target.dataset.food;
		},
		setCost (cost) {
			data.foodItemCost = cost;
		},
		setID () {
			let id;
			if(data.foodItems.length > 0) {
				id = data.foodItems[data.foodItems.length - 1].id + 1;
			} else {
				id = 0;
			}
			data.foodItemsID = id;
		},
		addItem () {
			const newFoodItem = new FoodItem(data.foodItemsID, data.foodItemTitle, data.foodItemCost);
			data.foodItems.push(newFoodItem);
			return newFoodItem;
		},
		getId(e) {
			return parseInt(e.target.closest('tr').getAttribute('data-id'));
		},
		removeItem (newId) {
			const id = data.foodItems.findIndex((item) => {return item.id === newId});
			data.foodItems.splice(id,1);
		},
		getTotalSum () {
			return data.foodItems.reduce((cur, next) => {
				return cur + next.cost;
			}, 0);
		},
		getTotalResult() {
			return `Total cost: ${this.getTotalSum()}`;
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
			let count = Object.create(null), max = 0, current;
			for(let item of data.foodItems) {
				if((current = count[item.title] = ~~count[item.title] + 1) > max){
					max = current;
				}
			}
			let result = Object.keys(count).filter((x)=> {
				return count[x] === max;
			});
			if(!result.length) {
				return 'You haven\'t eaten anything yet';
			} else {
				return `Favorite food: ${result.join(', ')}`;
			}
		},
		clearItems() {
			data.foodItems = [];
		}
	}
})();

// UI Controller
const UICtrl = (() =>{
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
		clearBtn: '.clear',
		message: '.message'
	};
	const UIElements = {
		itemList: document.querySelector(UISelectors.itemList),
		expense: document.querySelector(UISelectors.expense),
		expenseValue: document.querySelector(UISelectors.expenseValue),
		totalResultBlock: document.querySelector(UISelectors.totalResultBlock),
		averageValueBlock: document.querySelector(UISelectors.averageValueBlock),
		favoriteFoodBlock: document.querySelector(UISelectors.favoriteFoodBlock),
		totalResultBtn: document.querySelector(UISelectors.totalResultBtn),
		averageValueBtn: document.querySelector(UISelectors.averageValueBtn),
		favoriteFoodBtn: document.querySelector(UISelectors.favoriteFoodBtn),
		clearBtn: document.querySelector(UISelectors.clearBtn),
		foodTitle: document.querySelectorAll(UISelectors.foodTitle)
	};
	return {
		createMessage (message) {
			if(document.querySelector(UISelectors.message)) {
				return false;
			} else {
				const messageBlock = document.createElement('div');
				messageBlock.classList.add(UISelectors.message.slice(1));
				messageBlock.appendChild(document.createTextNode(message));
				document.body.appendChild(messageBlock);
				setTimeout(function() {
					messageBlock.remove();
				}, 1500);
			}
		},
		populateItemList (items){
			let html = '';
			items.forEach(function(item) {
				html += `<tr data-id="${item.id}"><td>${item.title}</td><td>${item.cost}</td><td><button class="delete-item"></button></td></tr>`;
			});
			UIElements.itemList.innerHTML = html;
		},
		addItemToList (item) {
			const row = document.createElement('tr');
			row.dataset.id = item.id;
			row.innerHTML = `<td>${item.title}</td><td>${item.cost}</td><td><button class="delete-item"></button></td>`;
			UIElements.itemList.appendChild(row);
		},
		getSelectors () {
			return UISelectors;
		},
		getUIElements() {
			return UIElements;
		},
		showExpenseForm () {
			UIElements.expense.style.display = 'block';
		},
		getCostValue () {
			const costValue = UIElements.expenseValue.value;
			if(costValue) {
				return parseInt(costValue);
			} else {
				return  0
			}
		},
		hideExpenseForm () {
			UIElements.expense.style.display = 'none';
			UIElements.expenseValue.value = '';
		},
		removeItemRow (e) {
			if(e.target.className === UISelectors.deleteItem.slice(1)) {
				e.target.closest('tr').remove();
			}
		},
		showTotal (element, message) {
			element.textContent = message;
		},
		clearFoodItems () {
			const list = UIElements.itemList;
			while(list.firstChild) {
				list.removeChild(list.firstChild);
			}
		}
	}
})();

// App Controller

const App = ((FoodItemCtrl, UICtrl, StorageCtrl) =>{
	const UIElements = UICtrl.getUIElements();
	const loadEventListeners = () => {
		Array.from(UIElements.foodTitle).forEach(function (item) {
			item.addEventListener('click', openExpenseForm);
		});
		UIElements.expense.addEventListener('submit', createFoodItemRow);
		UIElements.itemList.addEventListener('click', removeItemRow);
		UIElements.totalResultBtn.addEventListener('click', showTotalCost);
		UIElements.averageValueBtn.addEventListener('click', showAverageValue);
		UIElements.favoriteFoodBtn.addEventListener('click', showFavoriteFood);
		UIElements.clearBtn.addEventListener('click', clearAll);
	};
	const showTotalCost = () => {
		const result = FoodItemCtrl.getTotalResult();
		UICtrl.showTotal(UIElements.totalResultBlock, result);
	};
	const showAverageValue = () => {
		const averageVal = FoodItemCtrl.getAverageValue();
		UICtrl.showTotal(UIElements.averageValueBlock, averageVal);
	};
	const showFavoriteFood = () => {
		const favoriteFood = FoodItemCtrl.getFavoriteFood();
		UICtrl.showTotal(UIElements.favoriteFoodBlock, favoriteFood);
	};
	const clearAll = () => {
		FoodItemCtrl.clearItems();
		UICtrl.hideExpenseForm();
		UICtrl.clearFoodItems();
		StorageCtrl.clearStorage();
		showTotalCost();
		showAverageValue();
		showFavoriteFood();
	};
	const removeItemRow = (e) => {
		const id = FoodItemCtrl.getId(e);
		UICtrl.removeItemRow(e);
		FoodItemCtrl.removeItem(id);
		StorageCtrl.deleteItemFromStorage(id);
	};
	const createFoodItemRow = (e) =>{
		e.preventDefault();
		const cost = UICtrl.getCostValue();
		if(cost) {
			FoodItemCtrl.setCost(cost);
			UICtrl.hideExpenseForm();
			const newFoodItem = FoodItemCtrl.addItem();
			UICtrl.addItemToList(newFoodItem);
			StorageCtrl.storeItem(newFoodItem);
		} else {
			UICtrl.createMessage('Enter value');
		}
	};
	const openExpenseForm = (e) =>{
		FoodItemCtrl.setID();
		FoodItemCtrl.setTitle(e.target);
		UICtrl.showExpenseForm();
	};
	return {
		init: () => {
			loadEventListeners();
			const items = FoodItemCtrl.getItems();
			UICtrl.populateItemList(items);
		}
	}
})(FoodItemCtrl, UICtrl, StorageCtrl);

App.init();