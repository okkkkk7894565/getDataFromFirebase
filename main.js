const firebaseConfig = {
    apiKey: "AIzaSyDO7QsBc5frdD6xl96FbLiLecF1lrucbY4",
    authDomain: "demometter.firebaseapp.com",
    databaseURL: "https://demometter-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "demometter",
    storageBucket: "demometter.appspot.com",
    messagingSenderId: "334154010668",
    appId: "1:334154010668:web:14171a1a506491d90a4189"
};
// 1 time to change
// Creat Firebase
firebase.initializeApp(firebaseConfig);
// Reference to the root node
var meterDatabase = firebase.database();
const usersRef = meterDatabase.ref("METTER");


//Create Object to get Data From Firebase
class PowerMeasurement {
    constructor(ID, Name, Energy, Frequency, PF, Vol, Ampe, Wat) {
        this.ID = ID;
        this.Name = Name;
        this.Energy = Energy;
        this.Frequency = Frequency;
        this.PF = PF;
        this.Vol = Vol;
        this.Ampe = Ampe;
        this.Wat = Wat;
    }
}
const powerMeasurementsArray = [];

// Every change in Firebase will update powerMeasurementsArray (object data)
usersRef.on('value', snapshot => {
    powerMeasurementsArray.length = 0;
    // Clear the array
    snapshot.forEach(childSnapshot => {
        const user = childSnapshot.val().Data;

        //key is id of ESP board. Can not update or delete >>> esp can not send data, web can not get data
        const key = childSnapshot.key;
        // console.log(key)
        //can not update 

        const nameMapping = childSnapshot.val().idName;
        // console.log(user);
        // console.log(nameMapping);
        // push object data that is updated to Array >> show
        powerMeasurementsArray.push(new PowerMeasurement(key, nameMapping, user.Energy, user.Frequency, user.PF, user.Vol, user.ampe, user.wat));

    });
    displayPowerMeasurements();
});



function displayPowerMeasurements() {
    // Clear existing rows
    const tableBody = document.getElementById('powerTableBody');
    tableBody.innerHTML = '';
    powerMeasurementsArray.forEach(measurement => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${measurement.Name}</td>
        <td>${measurement.Vol}</td>
        <td>${measurement.Ampe}</td>
        <td>${measurement.PF}</td>
        <td>${measurement.Wat}</td>
        <td>${measurement.Frequency}</td>
        <td>${measurement.Energy}</td>
        <td><button class="btn btn-primary" type="button" onclick="transfer('${measurement.ID}')" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" >Mapping</button></td>`
        //   button to update name following room  (update propertie idName not update esp's ID)
        //   default name is ESP ID
        //   Ex: Esp has id :"minhndhe163891" >>  default Name(ID mapping) is "minhndhe163891" (using for IT room) >>> change Name(ID mapping) to "IT room"
        tableBody.appendChild(row);
    });
}

//get ID of Esp need update Name(ID Mapping)
function transfer(id) {
    console.log("Esp's ID: " + id)
    document.getElementById("id").value = id;
}
//Set Name(ID Mapping)<get new name from modal changeName > for Esp has in function transfer(id)
function clickMe() {
    console.log("Change Name!!!")
    var id = document.getElementById("id").value;
    var data = document.getElementById("changeName").value;
    var path = "/METTER/" + id + "/idName";
    console.log("Path:" + path);
    console.log("Name(ID Mapping): " + data);
    meterDatabase.ref(path).set(data);
    displayPowerMeasurements();
    $('#exampleModal').modal('hide');
    let volt = 3.14159; // Giả sử volt là giá trị bạn muốn làm tròn

    // Sử dụng hàm toFixed để làm tròn với đúng hai số sau dấu phẩy
    let roundedVolt = volt.toFixed(2);

    console.log("Original Volt: ", volt);
    console.log("Rounded Volt: ", roundedVolt);
}

