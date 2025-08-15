toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};


const supabaseUrl = 'https://ipoviueuhflhqjemgfkw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwb3ZpdWV1aGZsaHFqZW1nZmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mzc5NzEsImV4cCI6MjA2ODUxMzk3MX0.ACNfp4MRa7-r1YYmu04VDltBo5UudrKWWw2NyDPBrk0'
const client = supabase.createClient(supabaseUrl, supabaseKey)



// let mainDiv = document.getElementById('info')
const mainDiv = document.getElementById('info')
const adminLoginDiv = document.getElementById('adminlogin')
const studentLogin = document.getElementById('studentLogin')
const adminLoginInput = document.getElementById('adminlogininput')
const loader = document.getElementById('loader')
const img = document.getElementById('img')

const studentName = document.getElementById('name')
const email = document.getElementById('email')
const fatherName = document.getElementById('f-name')
const mobileNumber = document.getElementById('m-number')
const age = document.getElementById('age')
const Qualfication = document.getElementById('Qualfication')
const address = document.getElementById('address')
const gender = document.getElementById('gender')



function capitalizeFirst(input) {
    let value = input.value.toLowerCase();
    input.value = value.replace(/\b\w/g, char => char.toUpperCase());
}




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
            toastr.success('Admin Login')
            setTimeout(() => {
                window.location.href = "admin.html";
            }, 1000)
        } else {
            toastr.error('Wrong Key')
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

let pkNumberRegex = /^(\+92|0092|92|0)3[0-9]{9}$/;
let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let addStudentData = document.getElementById('addStudent')
if (addStudentData) {
    mobileNumber.addEventListener('input', () => {
        if (pkNumberRegex.test(mobileNumber.value)) {
            mobileNumber.style.border = `none`
        } else {
            mobileNumber.style.border = `2.5px solid red`
            return;
        }
    })

    email.addEventListener('input', () => {
        if (emailRegex.test(email.value)) {
            email.style.border = `none`
        } else {
            email.style.border = `2.5px solid red`
            return;
        }
    })
    age.addEventListener('input', () => {
        if (age.value >= 30) {
            age.style.border = `2.5px solid red`
            toastr.error(`Your Age Is Above Of 30`)
        } else {
            age.style.border = `none`

        }
    })

    const courseCatagary = document.getElementById('CourseCatagary')
    const courses = document.getElementById('Course')
    courses.addEventListener('change', () => {
        courseCatagary.style.display = 'block'
        if (courses.value == 'Language') {
            courseCatagary.innerHTML = `
            <option value="" selected disabled>Select Course</option>
            <option value="English">English</option>
            <option value="Chinese">Chinese</option>
            <option value="Arabic">Arabic</option>
            `
        } else {
            courseCatagary.innerHTML = `
<option value="" selected disabled>Select Course</option>
<option value="Web Development">Web Development</option>
<option value="Graphic Designing">Graphic Designing</option>
<option value="Digital Marketing">Digital Marketing</option>
<option value="Cyber Security">Cyber Security</option>
`
        }
    })


    addStudentData.addEventListener('click', async () => {

        const { data: userid } = await client
            .from('RollNumber')
            .insert({ email: email.value })
            .select('id')
        console.log(userid[0].id);
        if (studentName.value === `` && fatherName.value === '' && pkNumberRegex.test(mobileNumber.value) && age.value === '' && Qualfication.value === '' && gender.value === '' && address.value === `` && !emailRegex.test(email.value)) {
            toastr.error('Please Fill All Field')
            return;
        } else {

            let QualficationChange = Qualfication.value.slice(0, 1).toUpperCase() + Qualfication.value.slice(1)
            const allData = {
                name: studentName.value.trim(),
                fatherName: fatherName.value.trim(),
                mobile: mobileNumber.value.trim(),
                age: age.value.trim(),
                email: email.value,
                Qualification: QualficationChange.trim(),
                gender: gender.value.trim(),
                course: courseCatagary.value,
                address: address.value.trim(),
                RollNumber: userid[0].id,
            }
            startloader()
            const { data, error } = await client
                .from('Students')
                .insert([allData])
                .select('*')

            const { data: getStdData, error: StdDataError } = await client
                .from('Students')
                .select('uid')
                .eq('RollNumber', userid[0].id)
            console.log(getStdData);
            const file = img.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `StudentAddImage/${getStdData[0].uid}.${fileExt}`;
            const { data: userImage, error: userError } = await client.storage
                .from('StudentImage')
                .upload(fileName, file, {
                });
            if (userError) {
                alert(userError.message)
            }
            console.log("userImage uploaded");
            const { data: publicurl } = client
                .storage
                .from('StudentImage')
                .getPublicUrl(fileName)
            // console.log(publicurl.publicUrl);

            const { error: updateError } = await client
                .from('Students')
                .update({ imgPath: publicurl.publicUrl })
                .eq('RollNumber', userid[0].id)

            loader.style.display = `none`
            if (error) {
                console.log(error.message);
                return;
            } else {
                toastr.success('Student Added')
                // console.log(data);
                setTimeout(() => {
                    window.location.href = "StudentsData.html";
                }, 1000)
            }
        }
    })
}






function adminlogout() {
    localStorage.clear()
    toastr.info('Admin Logout')
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000)
    // window.location.href = "index.html";

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
    loader.style.display = `flex`
    const { data, error } = await client
        .from('Students')
        .select('*')
        .eq('RollNumber', Roll.value)
    loader.style.display = `none`
    if (error) {
        alert(error.message)
    } else {
        if (!data.length == 0 && Roll.value == data[0].RollNumber) {
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
            toastr.error(`Please Enter A Correct Roll Number`)

        }
    }
}


function backToMain() {
    adminLoginDiv.style.display = 'none';
    studentLogin.style.display = 'none';
    mainDiv.style.display = 'flex';
}