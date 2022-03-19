import _ from 'lodash';
import './style.css';

let allData = {};

function dataBinds() {
  for (let i = 0; i < allData.Items.length; i++) {
    const item = allData.Items[i];
    const el = document.getElementById(item.foodName);
    console.log(item);
    document.getElementById(`healthy${i}`).innerHTML = item.healthy;
    document.getElementById(`unhealthy${i}`).innerHTML = item.unhealthy;
  }
  setButtonCallbacks();
}

function setButtonCallbacks() {
  // Iterate each vote div to get buttons
  const voteDivs = document.querySelectorAll('.vote');
  for(let i = 0; i < voteDivs.length; i++) {
    // Set eventListener for vote POST request with specific args
    const btns = voteDivs[i].querySelectorAll('button');
    btns[0].addEventListener('click', ()=>{
      submitVote(true,allData.Items[i].foodName);
    })
    btns[1].addEventListener('click', ()=>{
      submitVote(false,allData.Items[i].foodName);
    })
  }
}

function submitVote(healthy, foodName) {
  if(healthy !== undefined && foodName) {

    // Convert true/false into API inputs (healthy vs unhealthy)
    let healthVal = 'healthy'
    if (healthy === false) healthVal = 'unhealthy';

    var data = JSON.stringify({
      "foodName": foodName,
      "data": healthVal
    });
    
    // Update UI to reflect vote
    setVisible(foodName);
    
    var xhr = new XMLHttpRequest();
    
    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        console.log(this.responseText);
      }
    });
    
    xhr.open("POST", process.env.POST_API);
    
    xhr.send(data);
  } else {
    console.log('Unable to vote as insufficient arguments', healthy, foodName);
  }
}

function setVisible(foodName) {
  // Show answers
  const el = document.getElementById(foodName);
  console.log(el);
  el.style.display = 'block';

  // Hide vote buttons
  const el2 = document.getElementById(`${foodName}-buttons`);
  el2.style.display = 'none';
}


function getData() {
  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", process.env.GET_API)
  //send the Http request
  xhr.send()

  xhr.onload = function() {
    if (xhr.status === 200) {
      allData = JSON.parse(xhr.responseText);
      dataBinds();  
    } else {
      console.log('not found');
    }
  }
}

getData();
