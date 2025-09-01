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
const cnic = document.getElementById('CNIC')
const address = document.getElementById('address')
const gender = document.getElementById('gender')



function capitalizeFirst(input) {
    let value = input.value.toLowerCase();
    input.value = value.replace(/\b\w/g, char => char.toUpperCase());
}

function formatCNIC(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length > 5 && value.length <= 12) {
        value = value.slice(0, 5) + "-" + value.slice(5);
    }
    if (value.length > 12) {
        value = value.slice(0, 5) + "-" + value.slice(5, 12) + "-" + value.slice(12, 13);
    }
    input.value = value;
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

const pkNumberRegex = /^(\+92|0092|92|0)3[0-9]{9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const addStudentData = document.getElementById('addStudent')


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
        if (studentName.value === `` && fatherName.value === '' && pkNumberRegex.test(mobileNumber.value) && age.value === '' && cnic.value === '' && gender.value === '' && address.value === `` && !emailRegex.test(email.value)) {
            toastr.error('Please Fill All Field')
            return;
        } else {
            const allData = {
                name: studentName.value.trim(),
                fatherName: fatherName.value.trim(),
                mobile: mobileNumber.value.trim(),
                age: age.value.trim(),
                email: email.value,
                cnic: cnic.value,
                gender: gender.value.trim(),
                course: courseCatagary.value,
                address: address.value.trim(),
                RollNumber: userid[0].id,
            }
            startloader()

            const { data } = await client
                .from('Students')
                .insert([allData])
                .select('*')

            const { data: getStdData, } = await client
                .from('Students')
                .select('uid')
                .eq('RollNumber', userid[0].id)
            console.log(getStdData);
            const file = img.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `StudentAddImage/${getStdData[0].uid}.${fileExt}`;
            const { error: userError } = await client.storage
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
            let imageUrl = publicurl.publicUrl
            loader.style.display = `none`
            if (updateError) {
                console.log(updateError.message);
                return;
            } else {
                toastr.success('Student Added')
                // console.log(data);
                // iD Card Start    

                // Show ID card and prepare PDF
                generateStudentIdCard({
                    name: studentName.value,
                    fatherName: fatherName.value,
                    age: age.value,
                    gender: gender.value,
                    Course: courseCatagary.value,
                    address: address.value,
                    CNIC: cnic.value,
                    id: userid[0].id,
                    imageUrl: imageUrl
                });

                function generateStudentIdCard(data) {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF({
                        orientation: 'portrait',
                        unit: 'mm',
                        format: 'a4',
                    });

                    const pageWidth = 210;
                    const pageHeight = 297;

                    const cardWidth = 85.6;
                    const cardHeight = 53.98;

                    const frontX = 20;
                    const backX = frontX + cardWidth + 20;
                    const cardY = 50;

                    fetch(data.imageUrl)
                        .then((res) => res.blob())
                        .then((blob) => {
                            const reader = new FileReader();
                            reader.onload = function () {
                                const imgData = reader.result;

                                // FRONT SIDE
                                doc.setFillColor(4, 22, 47); // Bootstrap primary blue
                                doc.rect(frontX, cardY, cardWidth, cardHeight, 'F');
                                doc.setTextColor(12, 65, 141);
                                doc.setFontSize(20);
                                doc.text('STUDENT ID CARD', frontX + 12, cardY + 8);

                                doc.addImage(imgData, 'JPEG', frontX + 5, cardY + 12, 25, 25);

                                doc.setTextColor(114, 167, 243);
                                doc.setFontSize(8);
                                doc.text(`Name: ${data.name}`, frontX + 35, cardY + 17);
                                doc.text(`Father: ${data.fatherName}`, frontX + 35, cardY + 23);
                                doc.text(`Gender: ${data.gender}`, frontX + 35, cardY + 29);
                                doc.text(`Course: ${data.Course}`, frontX + 35, cardY + 35);
                                doc.text(`Age: ${data.age}`, frontX + 35, cardY + 41);
                                doc.text(`Roll Number: ${data.id}`, frontX + 35, cardY + 47);

                                // BACK SIDE
                                doc.setFillColor(208, 226, 251);
                                doc.rect(backX, cardY, cardWidth, cardHeight, 'F');
                                doc.setTextColor(12, 65, 141);
                                doc.setFontSize(20);

                                doc.text('Student Details', backX + 5, cardY + 8);

                                // doc.setFontSize(20);
                                doc.setTextColor(0, 0, 0);
                                doc.setFontSize(8);
                                doc.text(`Address: ${data.address}`, backX + 5, cardY + 20, { maxWidth: cardWidth - 10 });
                                doc.text(`Valid Till: Dec 2025`, backX + 5, cardY + 28);

                                doc.setFontSize(7);
                                doc.text('Note: Carry this card at all times on campus.', backX + 5, cardY + cardHeight - 5);

                                // Instructions at bottom of page
                                doc.setFontSize(10);
                                doc.text(
                                    'Instructions: This ID card is mandatory for all students and must be shown on request. Losing it may result in a fine.',
                                    20,
                                    pageHeight - 150,
                                    { maxWidth: pageWidth - 40 }
                                );

                                doc.save('student_id_card.pdf');
                            };
                            reader.readAsDataURL(blob);
                        });
                }

                // id Card ENd\\
                adminLoginDiv.style.display = 'none';
                studentLogin.style.display = 'none';
                mainDiv.style.display = 'flex';

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







function backToMain() {
    adminLoginDiv.style.display = 'none';
    studentLogin.style.display = 'none';
    mainDiv.style.display = 'flex';
}

