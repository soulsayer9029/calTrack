// Storage Controller
const StorageCtrl = (function(){
  // Public methods
  return {
    storeItem: function(item){
      let items;
      // Check if any items in ls
      if(localStorage.getItem('items') === null){
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is already in ls
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item
        items.push(item);

        // Re set ls
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage:(updateditem)=>{
      let items=JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item,index){
        if(item.id===updateditem.id){
          items.splice(index,1,updateditem)
        }
      });
      // Re set ls
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage:(id)=>{
      let items=JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item,index){
        if(item.id===id){
          items.splice(index,1);
        }
      });
      // Re set ls
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearStorage:()=>{
    localStorage.removeItem('items');
    }
  }
})();

// Item Controller
const ItemCtrl = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      let ID;
      // Create ID
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories:()=>{
      let total=0;
      data.items.forEach(function(item){
        total=total+item.calories;
        
      });
      data.totalCalories=total;
      return data.totalCalories

    },
    getItemById:(id)=>{
      let found=''
      data.items.forEach(function(item){
        if(item.id===id){
          found=item;
        }
      });
      return found;

    },
    setItemToCurrentItem:(item)=>{
      data.currentItem=item;
    },
    updateItem:(name,calories)=>{
      calories=parseInt(calories);
      let found=null;
      data.items.forEach(function(item){
        if(item.id===data.currentItem.id){
          item.name=name;
          item.calories=calories;
          found=item
        }
      });
      return found
    },
    getCurrentItem:()=>data.currentItem,
    deleteItem:(id)=>{
      const ids=data.items.map(function(item){
        return item.id;
      });
      //get index
      const index=ids.indexOf(id);
      //remove item
      data.items.splice(index,1);
    },
    clearAllItems:()=>{
      data.items=[];
    },
    logData: function(){
      return data;
    }
  }
})();



// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    listItems:'#item-list li',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCaloriesDisplay:'.total-calories',
    updateBtn:'.update-btn',
    deleteBtn:'.delete-btn',
    backBtn:'.back-btn',
    clearBtn:'.clear-btn'
  }
  
  // Public methods
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name:document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories:function(total){
      document.querySelector(UISelectors.totalCaloriesDisplay).textContent=total;

    },
    getSelectors: function(){
      return UISelectors;
    },
    addItemToForm:()=>{
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =ItemCtrl.getCurrentItem().calories ;
      UICtrl.showEditState();
      
    },
    showEditState:()=>{
       
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';


    },
    clearEditState:()=>{
      UICtrl.clearInput();
      
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';

    },
    updateList:(item)=>{
      let listItems=document.querySelectorAll(UISelectors.listItems);
      listItems=Array.from(listItems);
      listItems.forEach(function(listitem){
        itemID=listitem.getAttribute('id');
        if(itemID===`item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML=`<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteItemFromUI:(id)=>{
      const itemID =`#item-${id}`;
      const item=document.querySelector(itemID);
      item.remove();
    },
    removeItems:()=>{
      let listItems=document.querySelectorAll(UISelectors.listItems);
      listItems=Array.from(listItems);
      listItems.forEach(function(item){
        item.remove();
      })

    }

  }
})();



// App Controller
const App = (function(StorageCtrl,ItemCtrl, UICtrl){
  // Load event listeners
  const loadEventListeners = function(){
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    //remove submit by enter button
    document.addEventListener('keypress',function(e){
      if(e.keyCode===13 || e.which===13){
        e.preventDefault();
        return false;
      }
    });
    //edit button click event
    document.querySelector(UISelectors.itemList).addEventListener('click',editItemSubmit);
    //update button click event
    document.querySelector(UISelectors.updateBtn).addEventListener('click',updateItemSubmit);
    //back button
    document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);
    //delete button event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);
    //clear button event
    document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);

  }

  // Add item submit
  const itemAddSubmit = function(e){
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if(input.name !== '' && input.calories !== ''){
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);
      //get total calories
      const totalCalories=ItemCtrl.getTotalCalories();
      //add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      // Clear fields
      UICtrl.clearInput();
      //Add to local storage
      StorageCtrl.storeItem(newItem);
    }

    e.preventDefault();
  }
  const editItemSubmit=(e)=>{
    if(e.target.classList.contains('edit-item')){
      //get id of the item that whose edit button has been clicked
      const liId=e.target.parentNode.parentNode.id;
      const id=parseInt(liId.slice(-1)); 
      //get item to edit
      const itemToEdit=ItemCtrl.getItemById(id);     
      // Set Item to current Item
      ItemCtrl.setItemToCurrentItem(itemToEdit);
    }
    UICtrl.addItemToForm();
    e.preventDefault()

  }
  const updateItemSubmit=(e)=>{
    input=UICtrl.getItemInput();
    const updatedItem=ItemCtrl.updateItem(input.name,input.calories);
    UICtrl.updateList(updatedItem);
    const totalCalories=ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    StorageCtrl.updateItemStorage(updatedItem);
    UICtrl.clearEditState();
    
    e.preventDefault()
  }
  const itemDeleteSubmit=function(e){
    //getCurrent Item
    currentItem=ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currentItem.id);
    //delete from UI
    UICtrl.deleteItemFromUI(currentItem.id);
    const totalCalories=ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    StorageCtrl.deleteItemFromStorage(currentItem.id);
    UICtrl.clearEditState();
    e.preventDefault()
  }
  const clearAllItemsClick=(e)=>{
    ItemCtrl.clearAllItems();    
    const totalCalories=ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    UICtrl.removeItems();
    StorageCtrl.clearStorage();
    UICtrl.hideList()
    e.preventDefault();
  }



  // Public methods
  return {
    init: function(){
      //clear edit stae/set initial state
      UICtrl.clearEditState();
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length === 0){
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }
      //get total calories
      const totalCalories=ItemCtrl.getTotalCalories();
      //add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      //
      // Load event listeners
      loadEventListeners();
    }
  }
  
})(StorageCtrl,ItemCtrl, UICtrl);

// Initialize App
App.init();