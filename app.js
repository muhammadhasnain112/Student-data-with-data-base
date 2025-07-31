const supabaseUrl = 'https://ipoviueuhflhqjemgfkw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwb3ZpdWV1aGZsaHFqZW1nZmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mzc5NzEsImV4cCI6MjA2ODUxMzk3MX0.ACNfp4MRa7-r1YYmu04VDltBo5UudrKWWw2NyDPBrk0'
const client = supabase.createClient(supabaseUrl, supabaseKey)



// let mainDiv = document.getElementById('info')
let mainDiv = document.getElementById('info')
let adminLoginDiv = document.getElementById('adminlogin')
let studentLogin = document.getElementById('studentLogin')
let adminLoginInput = document.getElementById('adminlogininput')
let loader = document.getElementById('loader')

let studentName = document.getElementById('name')
let fatherName = document.getElementById('f-name')
let mobileNumber = document.getElementById('m-number')
let age = document.getElementById('age')
let Qualfication = document.getElementById('Qualfication')
let address = document.getElementById('address')
let gender = document.getElementById('gender')

async function adminLogin() {
    let token = localStorage.getItem('authToken')
    if (token) {
        window.location.href = `admin.html`
    }
    mainDiv.style.display = 'none'
    studentLogin.style.display = 'none'
    adminLoginDiv.style.display = 'flex'
    function abc() {
        if (adminLoginInput.value == 12446) {
            localStorage.setItem("authToken", "userLoggedIn");
            Swal.fire("Admin!", "Login Successfuly!", "success").then(() => {
                window.location.href = "admin.html";
            });
        } else {
            alert('wrong key')
            adminLoginInput.value = ``
        }
    }
    document.getElementById('login').addEventListener('click', abc)
    document.addEventListener('keyup', (e) => {
        if (e.key == 'Enter') {
            abc()
        }
    })

}


function addStudent() {
    mainDiv.style.display = 'none'
    adminLoginDiv.style.display = 'none'
    studentLogin.style.display = `flex`

}


let addStudentData = document.getElementById('addStudent')
if (addStudentData) {
    let random = Math.floor(Math.random() * 100 + 100)
    addStudentData.addEventListener('click', async () => {
        if (studentName.value == `` && fatherName.value == '' && mobileNumber.value == '' && age.value == '' && Qualfication.value == '' && gender.value == '' && address.value == ``) {
            alert('Please Fill All Field')
        } else {
            let Sname = studentName.value.slice(0, 1).toUpperCase() + studentName.value.slice(1)
            let Fname = fatherName.value.slice(0, 1).toUpperCase() + fatherName.value.slice(1)
            const allData = {
                name: Sname,
                fatherName: Fname,
                mobile: mobileNumber.value,
                age: age.value,
                Qualification: Qualfication.value,
                gender: gender.value,
                address: address.value,
                RollNumber: random
            }
            startloader()
            const { data, error } = await client
                .from('Students')
                .insert([allData])
                .select('*')
            loader.style.display = `none`
            if (error) {
                console.log(error.message);
            } else {
                // console.log(data);
                Swal.fire("Student!", "Add Successfuly!", "success").then(() => {
                    window.location.href = `StudentsData.html`
                    // window.location.href = "index.html";
                });
            }
        }
    })
}



function adminlogout() {
    localStorage.clear()
    Swal.fire("Admin!", "Logout Successfuly!", "success").then(() => {
        window.location.href = "index.html";
    });
}


function checkstudents() {
    window.location.href = `StudentsData.html`
}


function startloader() {
    mainDiv.style.display = 'none'
    adminLoginDiv.style.display = 'none'
    studentLogin.style.display = `none`
    loader.style.display = `block`
}


function checkstudentwithrollnum() {
    window.location.href = 'checkstudent.html'
}

let Roll = document.getElementById('roll')

let StudentDataWithRoll = document.getElementById('Studentdatawithroll')
// let ShowFilter = document.getElementById('ShowFilter')

async function stdcheck() {
    // Roll.style.display = 'none'
    loader.style.display = `flex`
    const { data, error } = await client
        .from('Students')
        .select('*')
        .eq('RollNumber', Roll.value)
    loader.style.display = `none`
    if (error) {
        alert(error.message)
    } else {
        console.log(data.length);


        if (!data.length == 0) {
            console.log(data[0]);
            Roll.style.display = 'none'
            check.style.display = 'none'
            StudentDataWithRoll.innerHTML = `
            <h1>Name : ${data[0].name}</h1>
        <h2>Father Name : ${data[0].fatherName}</h2>
        <p>Roll Number : ${data[0].RollNumber}</p>
        <p>Mobile Number : ${data[0].mobile}</p>
        <p>Age : ${data[0].age}</p>
        <p>Qualification : ${data[0].Qualification}</p>
        <p>Gender : ${data[0].gender}</p>
        <p>Id : ${data[0].id}</p>
        <p>Status : ${data[0].status}</p>
        <p>Address : ${data[0].address}</p>
        `
        } else {
            alert('Please Enter A Correct Roll Number')
        }
    }
}




