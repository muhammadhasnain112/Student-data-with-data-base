// Toastr configuration
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
const table = document.getElementById('table')
const th = document.getElementById('th')
const loader = document.getElementById('loader')
const maintable = document.getElementById('maintable')
const h1 = document.getElementById('h1')
const courseFilter = document.getElementById('courseFilter')
const statusFilter = document.getElementById('statusFilter')

let token = localStorage.getItem('authToken')
if (token) {
    adminshowdata()
} else {
    showdata()
}



courseFilter.addEventListener('change', async () => {
    const ITcourses = ['Web Development', 'Graphic Designing', 'Digital Marketing', 'Cyber Security'];
    const LanguageCourses = ['English', 'Chinese', 'Arabic'];
    const { data, error } = await client
        .from('Students')
        .select('*');
    if (error) {
        console.error(error.message);
        return;
    }
    let filteredData = [];
    if (courseFilter.value === "IT") {
        filteredData = data.filter(student => ITcourses.includes(student.course));
    }
    else if (courseFilter.value === "Language") {
        filteredData = data.filter(student => LanguageCourses.includes(student.course));
    }
    else {
        filteredData = data;
    }
    showStudents(filteredData);
})

function showStudents(students) {
    console.log(students);
    if (token) {
        table.innerHTML = ``
        students.forEach(e => {
            console.log(e);
            table.innerHTML +=
                ` <tr>
            <td data-label="Name"><img src="${e.imgPath}" alt="" width="40"></td>
            <td data-label="Name">${e.name}</td>
            <td data-label="Father Name">${e.fatherName}</td>
            <td data-label="Mobile">${e.mobile}</td>
            <td data-label="Age">${e.age}</td>
            <td data-label="Mobile">${e.email}</td>
            <td data-label="Roll Number">${e.RollNumber}</td>
            <td data-label="course">${e.course}</td>
            <td data-label="Qualification">${e.Qualification}</td>
            <td data-label="Gender">${e.gender}</td>
            <td data-label="Address">${e.address}</td>
            <td data-label="Status"><select onchange="status(${e.id})" id="status"><option value="" selected disabled >${e.status}</option><option value="Pending">Pending</option><option value="Active">Active</option><option value="Reject">Reject</option></select></td>
            <td data-label="Status"><img src="img/delete.png" alt=""  width="35" onclick="dlt(${e.id})"></td>
          </tr>`

        });
    } else {
        table.innerHTML = ``
        students.forEach(e => {
            console.log(e);
            table.innerHTML +=
                ` <tr>
            <td data-label="Name"><img src="${e.imgPath}" alt="" width="40"></td>
            <td data-label="Name">${e.name}</td>
            <td data-label="Father Name">${e.fatherName}</td>
            <td data-label="Mobile">${e.mobile}</td>
            <td data-label="Age">${e.age}</td>
            <td data-label="Mobile">${e.email}</td>
            <td data-label="Roll Number">${e.RollNumber}</td>
            <td data-label="course">${e.course}</td>
            <td data-label="Qualification">${e.Qualification}</td>
            <td data-label="Gender">${e.gender}</td>
            <td data-label="Address">${e.address}</td>
            <td data-label="Status">${e.status}</td>
            </tr>`

        });
    }

}
statusFilter.addEventListener('change', async () => {
    const { data, error } = await client
        .from('Students')
        .select('*');
    if (error) {
        console.error(error.message);
        return;
    }
    let filteredData = [];
    data.forEach(element => {
        console.log(element);
        if (element.status === statusFilter.value) {
            filteredData.push(element)
        }
    });
    showStudents(filteredData);
})



async function showdata() {
    // loader.style.display = 'flex'
    // h1.style.display = `none`
    // maintable.style.display = 'none'
    const { data, error } = await client
        .from('Students')
        .select('*')
    courseFilter.addEventListener('change', () => {
        const ITcourses = ['Web Development', 'Graphic Designing', 'Digital Marketing', 'Cyber Security']
        const LanguageCourses = ['English', 'Chinese', 'Arabic']
        courseFilter.value ? "IT"
            : "Language"
    })
    if (error) {
        alert(error.message)
    } else {
        data.forEach((e) => {
            table.innerHTML += `
          <tr>
            <td data-label="Name"><img src="${e.imgPath}" alt="" width="40"></td>
            <td data-label="Name">${e.name}</td>
            <td data-label="Father Name">${e.fatherName}</td>
            <td data-label="Mobile">${e.mobile}</td>
            <td data-label="Age">${e.age}</td>
            <td data-label="Mobile">${e.email}</td>
            <td data-label="Roll Number">${e.RollNumber}</td>
            <td data-label="course">${e.course}</td>
            <td data-label="Qualification">${e.Qualification}</td>
            <td data-label="Gender">${e.gender}</td>
            <td data-label="Address">${e.address}</td>
            <td data-label="Status">${e.status}</td>
          </tr>
          `
        });
    }
}

function adminshowdata() {
    table.innerHTML = ``
    th.innerHTML += `<th>Delete</th>`;
    showadmin()
}

async function showadmin() {
    const { data, error } = await client
        .from('Students')
        .select('*')
    if (error) {
        alert(error.message)
        return;
    } else {
        table.innerHTML = ``
        data.forEach((e) => {
            table.innerHTML += `
            <tr>
            <td data-label="Name"><img src="${e.imgPath}" alt="" width="40"></td>
            <td data-label="Name">${e.name}</td>
            <td data-label="Father Name">${e.fatherName}</td>
            <td data-label="Mobile">${e.mobile}</td>
            <td data-label="Age">${e.age}</td>
            <td data-label="Mobile">${e.email}</td>
            <td data-label="Roll Number">${e.RollNumber}</td>
            <td data-label="course">${e.course}</td>
            <td data-label="Qualification">${e.Qualification}</td>
            <td data-label="Gender">${e.gender}</td>
            <td data-label="Address">${e.address}</td>
            <td data-label="Status"><select onchange="status(${e.id})" id="status"><option value="" selected disabled >${e.status}</option><option value="Pending">Pending</option><option value="Active">Active</option><option value="Reject">Reject</option></select></td>
            <td data-label="Status"><img src="img/delete.png" alt=""  width="35" onclick="dlt(${e.id})"></td>
            </tr>
            `
        });
    }
}



async function status(id) {
    let checkstatus = document.getElementById('status')
    const { data, error } = await client
        .from('Students')
        .update({ status: checkstatus.value })
        .eq('id', id)
        .select()
    if (error) {
        alert(error.message)
    } else {
        // alert(`Student Status Changed to ${checkstatus.value}`)
        toastr.success(`Student Status Changed to ${checkstatus.value}`)

    }
}


async function dlt(id) {
    const { data, error } = await client
        .from('Students')
        .delete()
        .eq('id', id)
        .select()
    if (error) {
        alert(error.message)
        return;
    } else {
        toastr.info(`Student Removed`)
        showadmin()
    }

}