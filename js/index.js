// ^ ==========> HTML ELEMENT
let root =document.querySelector(':root');
let btnAddTask=document.getElementById('newTask');
let modal=document.getElementById('modal');
let addBtnModal=document.getElementById('addBtn');
let updateBtnModal=document.getElementById('updateBtn');
let statusInput=document.getElementById('status');
let categoryInput=document.getElementById('category');
let titleInput=document.getElementById('title');
let descriptionInput=document.getElementById('description');
let modeBtn=document.getElementById('mode');
let gridBtn=document.getElementById('gridBtn');
let barsBtn=document.getElementById('barsBtn');
let section =document.querySelectorAll('section');
let tasksContainer=document.querySelectorAll('.tasks');
let searchInput=document.getElementById('searchInput');
let nextUpCountElement=document.getElementById('nextUpCount');
let inProgressCountElement=document.getElementById('inProgressCount');
let doneCountElement=document.getElementById('doneCount');
let remainingContainer=document.getElementById('remainingCounter');
let containers={
    nextUp:document.querySelector('.to-do'),
    inProgress:document.querySelector('.in-progress'),
    done:document.querySelector('.done'),
}

// & ==========> VARIABLES
let taskArr=JSON.parse(localStorage.getItem('tasks')) || [];
let taskHtml="";
let updateIndex=0;
let nextCount=0;
let inProgressCount=0;
let doneCount=0;
let remainingCounter=100;
for(let i=0 ; i<taskArr.length; i++){
    displayTask(i);
} 
let titleReg=/^[a-zA-Z]{3,}$/;
let descriptionReg=/^[a-z 0-9 A-Z]{5,100}$/;
// ~ ==========> EVENT
btnAddTask.addEventListener('click',showModal);
// ^ hidden modal use Escape keyboard
document.addEventListener('keydown',function(e){
    if(e.key == 'Escape'){
        hiddenModal()
    }
    
})
// ^ hidden modal use click empty modal
modal.addEventListener('click',function(e){
    if(e.target.id=='modal'){
        hiddenModal()
    }
})
addBtnModal.addEventListener('click',function(){
    addTask();
})
updateBtnModal.addEventListener('click',updateTask);
modeBtn.addEventListener('click',changeMode);
titleInput.addEventListener('input',function(){
    validate(titleReg,titleInput);
})
descriptionInput.addEventListener('input',function(){
    validate(descriptionReg,descriptionInput);
});
barsBtn.addEventListener('click',changeToBars);
gridBtn.addEventListener('click',changeToGrid);
searchInput.addEventListener('input',searchTask);
descriptionInput.addEventListener('input',function(){
    validate(descriptionReg,descriptionInput);
    remainingCounter= 100 - descriptionInput.value.split('').length;
    remainingContainer.innerHTML=remainingCounter;
});
// ! ==========> FUNCTION
function showModal(){
    modal.classList.replace('d-none','d-flex');
    document.body.style.overflow='hidden';
    scroll(0,0);
}
function hiddenModal(){
    modal.classList.replace('d-flex','d-none');
    document.body.style.overflow='visible';
    resetInput();
    addBtnModal.classList.remove("d-none");
    updateBtnModal.classList.replace("d-block","d-none");
}
function addTask(){
    if(validate(titleReg,titleInput) && validate(descriptionReg,descriptionInput)){
        let task={
            status:statusInput.value,
            category:categoryInput.value,
            title:titleInput.value,
            description:descriptionInput.value,
        }
        taskArr.push(task);
        localStorage.setItem('tasks',JSON.stringify(taskArr));
        displayTask(taskArr.length - 1);
        hiddenModal();
        resetInput();
    }
}
function displayTask(index){
    taskHtml=`
    <div class="task">
        <h3 class="text-capitalize">${taskArr[index]?.title}</h3>
        <p class="description text-capitalize">${taskArr[index]?.description}</p>
        <h4 class="category ${taskArr[index]?.category} text-capitalize">${taskArr[index]?.category}</h4>
        <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
            <li><i class="bi bi-pencil-square" onclick="getTaskInfo(${index})"></i></li>
            <li><i class="bi bi-trash-fill" onclick="deleteTask(${index})"></i></li>
            <li><i class="bi bi-palette-fill" onclick="changeColor(event)"></i></li>
        </ul>
    </div>
    `;
    containers[taskArr[index].status].querySelector('.tasks').innerHTML+=taskHtml;
    setLocationStatus(taskArr[index].status);
}
function generateColor(){
    let colorChar =[0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
    var color='#';
    for(let i=1;i<=6;i++){
        let rand=Math.trunc(Math.random() * colorChar.length);
        color+=colorChar[rand];
    }
    return color +`22`;
}
function changeColor(event){
    var bgColor=generateColor();
    // event.target.parentElement.parentElement.parentElement.style.backgroundColor=bgColor;
    event.target.closest('.task').style.backgroundColor=bgColor;
}

function deleteTask(index){
    emptyContainer();
    resetCount();
    taskArr.splice(index,1);
    localStorage.setItem('tasks',JSON.stringify(taskArr));
    for(let i=0;i<taskArr.length;i++){
        displayTask(i);
    }
}
function emptyContainer (){
    for(item in containers){
        containers[item].querySelector('.tasks').innerHTML=''
    }
}
function getTaskInfo(index){
    showModal();
    statusInput.value=taskArr[index].status;
    categoryInput.value=taskArr[index].category;
    titleInput.value=taskArr[index].title;
    descriptionInput.value=taskArr[index].description;
    addBtnModal.classList.add('d-none');
    updateBtnModal.classList.replace('d-none','d-block');
    updateIndex=index;
}
function updateTask(){
    taskArr[updateIndex].status=statusInput.value;
    taskArr[updateIndex].category=categoryInput.value
    taskArr[updateIndex].title=titleInput.value
    taskArr[updateIndex].description=descriptionInput.value
    localStorage.setItem('tasks',JSON.stringify(taskArr));
    emptyContainer();
    resetCount();
    for(let i=0;i<taskArr.length;i++){
        displayTask(i);
    }
    hiddenModal();
    addBtnModal.classList.remove("d-none");
    updateBtnModal.classList.replace("d-block","d-none");
}
function resetInput(){
    statusInput.value='nextUp';
    titleInput.value='';
    categoryInput.value='education';
    descriptionInput.value='';
}
function changeMode(){
    if(modeBtn.classList.contains('bi-brightness-high-fill')){
        root.style.setProperty('--main-black','#f1ebeb');
        root.style.setProperty('--sec-black','#eee');
        root.style.setProperty('--text-color','#000');
        root.style.setProperty('--mid-gray','#ced0d4');
        modeBtn.classList.replace('bi-brightness-high-fill','bi-moon-stars-fill');
    }else{ 
        root.style.setProperty('--main-black','#0d1117');
        root.style.setProperty('--sec-black','#161b22');
        root.style.setProperty('--text-color','#a5a6a7');
        root.style.setProperty('--mid-gray','#474a4e');
        modeBtn.classList.replace('bi-moon-stars-fill','bi-brightness-high-fill');
    }
} 
function validate(regex,element){
    if(regex.test(element.value)){
        element.classList.add('is-valid');
        element.classList.remove('is-invalid');
        element.parentElement.nextElementSibling.classList.add('d-none');
        return true;
    }else{
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
        element.parentElement.nextElementSibling.classList.remove('d-none');
        return false;
    }
}
function changeToBars(){
    gridBtn.classList.remove('active');
    barsBtn.classList.add('active');
    for(let i=0;i<section.length;i++){
        section[i].classList.remove('col-md-6','col-lg-4');
        section[i].style.overflow='auto';
    }
    for(let j=0;j < tasksContainer.length;j++){
        tasksContainer[j].setAttribute("data-view","bars");
    }
}
function changeToGrid() {
    barsBtn.classList.remove("active");
    gridBtn.classList.add("active");
    for (var i = 0; i < section.length; i++) {
        section[i].classList.add("col-md-6", "col-lg-4");
    }
    for (var j = 0; j < tasksContainer.length; j++) {
        tasksContainer[j].removeAttribute("data-view");
    }
}
function searchTask(){
    emptyContainer();
    resetCount();
    let keySearch = searchInput.value;
    for(let i=0;i<taskArr.length;i++){
        if( taskArr[i].title.toLowerCase().includes(keySearch.toLowerCase()) ||taskArr[i].category.toLowerCase().includes(keySearch.toLowerCase())){
            displayTask(i);
        }
    }
}
function setLocationStatus(status){
    switch(status){
        case"nextUp":
        nextCount++;
        nextUpCountElement.innerHTML=nextCount;
        break;
        case"inProgress":
        inProgressCount++;
        inProgressCountElement.innerHTML=inProgressCount;
        break;
        case"done":
        doneCount++;
        doneCountElement.innerHTML=doneCount;
        break;
    }
}
function resetCount(){
    nextCount=0;
    inProgressCount=0;
    doneCount=0;
    nextUpCountElement.innerHTML=nextCount;
    inProgressCountElement.innerHTML=inProgressCount;
    doneCountElement.innerHTML=doneCount;
}