const socket = io();
const messages = document.getElementById("messages");
const connectedUsers = document.getElementById("connectedUsers");
const messageInput = document.getElementById("messageInput");
const sendMessage = document.getElementById("sendMessage");
const nameContent = document.getElementById("name");
const subNameContent = document.getElementById("subName"); 

let userId;

let messageForm = {
    message: "",
    sendBy: "",
    date: "09:55"
}

// App Load : when the app load run This :;
function appLoad() {
    console.log("app loaded");
    userId = generateUniqueId();
    socket.emit("user connected", userId);
    nameContent.textContent  = userId;
    subNameContent.textContent = userId;
}

// Listen to chat message
socket.on('chat message', (msg) => {
    createMessage(msg);
    messages.scrollTop = messages.scrollHeight;
});

// listen if new user connected to room
socket.on('user connected', (msg) => {
    connectedUsers.innerHTML = '';
    msg.forEach(user => {
        createUser(user);
    });    
});

// send Message To Server if user click in send icone
sendMessage.addEventListener("click", () => {
    sendMessageFun();
})

// send Message To Server if user click in 'clickKey in keyboard'
messageInput.addEventListener("keyup", (event) => {
    if(event.key === "Enter") sendMessageFun();
})


// Send Message Function 
function sendMessageFun() {
    if(messageInput.value){

        messageForm.message = messageInput.value;
        messageForm.date = moment().format('LT');
        messageForm.sendBy = userId;

        socket.emit("chat message", messageForm);

        messageForm.message = '';
        messageForm.date = '';
        messageForm.sendBy = '';

        messageInput.value = '';

    }
}

// Create new message Element
function createMessage(messageData){

    // create messageItem
    let messageItem = document.createElement("div");
    messageItem.classList.add("messageItem", "p-3", "shadow-sm", "rounded");
    messageData.sendBy == userId ? messageItem.classList.add("me") : false;

    // create sendBy
    let sendBy = document.createElement("strong");
    sendBy.classList.add("sendBy");
    sendBy.textContent = messageData.sendBy;

    // create message
    let messageP = document.createElement("p");
    messageP.classList.add("message");
    messageP.textContent = messageData.message;

    // create date
    let date = document.createElement("p");
    date.classList.add("date");
    date.textContent = messageData.date;

    messageItem.appendChild(sendBy);
    messageItem.appendChild(messageP);
    messageItem.appendChild(date);


    messages.appendChild(messageItem);

} 


// Create New User Element
function createUser(userIdData){

    // create user Item
    let userItem = document.createElement("div");
    userItem.classList.add("userItem");

    // create userImage
    let userImage = document.createElement("div");
    userImage.classList.add("userImage");

    // create image
    let image = document.createElement("img");
    image.src = "./assets/images/user.jpg";
    image.alt = "user image";

    // create info
    let info = document.createElement("div");
    info.classList.add("info");

    // create name
    let name = document.createElement("h5");
    name.classList.add("name");

    // create subName
    let subName = document.createElement("h6");
    subName.classList.add("subName", "my-1");

    name.textContent = userIdData.slice(0, 15);
    subName.textContent = userIdData.slice(0, 15);

    userImage.appendChild(image);
    info.appendChild(name);
    info.appendChild(subName);

    userItem.appendChild(userImage);
    userItem.appendChild(info);

    connectedUsers.appendChild(userItem);

}

// Generate Unique Id
function generateUniqueId(){
    // always start with a letter (for DOM friendlyness)
    var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
    do {                
        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
        var ascicode=Math.floor((Math.random()*42)+48);
        if (ascicode<58 || ascicode>64){
            // exclude all chars between : (58) and @ (64)
            idstr+=String.fromCharCode(ascicode);    
        }                
    } while (idstr.length<32);

    return (idstr);
}