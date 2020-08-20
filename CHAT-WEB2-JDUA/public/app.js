const button = document.querySelector('#button')
const username = document.querySelector('#username')
const saludo  =document.querySelector('#saludo')
const sendText = document.querySelector('#sendText')
const iChat = document.querySelector('#iChat');
const archive = document.querySelector('#archive')

firebase.auth().onAuthStateChanged(user =>{
    
if(user){
    console.log(user)
    button.innerHTML = 
    /*html*/
    `<button class="btn btn-outline-danger" id="btnCerrar">Cerrar</button>`
    username.innerHTML = user.displayName
    logout();
    
    sendText.classList ='input-group py-3 fixed-bottom container '
    

    chat(user);

}else{
    console.log('no existe ')
    button.innerHTML =/*html*/
     `<button class="btn btn-outline-success" id="btnAcceder">Acceder</button>`
    login();
    username.innerHTML = 'chat';
    saludo.innerHTML= /*html*/
    `<p class=" text-center lead mt-5">debes iniciar sesion </p>`
    sendText.classList ='input-group py-3 fixed-bottom container d-none';
}


})


const login=()=>{
const btnAcceder = document.querySelector('#btnAcceder')
    btnAcceder.addEventListener('click',async()=>{
        //console.log('verga')
        try{
         const provider = new firebase.auth.GoogleAuthProvider();
                await firebase.auth().signInWithPopup(provider)

        }catch(error){
            console.log(error)
        }
    })

};


const logout=()=>{
    const btnCerrar = document.querySelector("#btnCerrar")
    btnCerrar.addEventListener('click',()=>{
        firebase.auth().signOut();
    })
}




const chat = (user)=>{
    sendText.addEventListener('submit',(e)=>{
        e.preventDefault()
        console.log('hola chamo aaaaaaaaa')
        console.log(iChat.value)
        if(!iChat.value.trim()){
            console.log('esta vacio vez no hay mostruos aqui')
            return
        }
         firebase.firestore().collection('chat').add({
            texto: iChat.value,
            uid: user.uid,
            fecha: Date.now()
        })
        .then(res=> {console.log('msg save')})
        .catch(e=> console.log(e))
        iChat.value = ''

    })
firebase.firestore().collection('chat').orderBy('fecha')
    
    
    .onSnapshot(query => {
        saludo.innerHTML =''
        console.log('verga sirvio')
        query.forEach(doc =>{
        if(user.uid === doc.data().uid){
        saludo.innerHTML += /*html*/ `<div class="d-flex justify-content-end mb-2">
        <span class="badge badge-pill badge-primary">${doc.data().texto}</span>
      </div>`
    }else
    {
          saludo.innerHTML +=/*html*/`<div class="d-flex justify-content-start mb-2">
          <span class="badge badge-pill badge-secondary">${doc.data().texto}</span>
        </div>`

      }
      saludo.scrollTop =saludo.scrollHeight
        })
    })
}