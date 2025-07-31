const supabaseUrl = 'https://ipoviueuhflhqjemgfkw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwb3ZpdWV1aGZsaHFqZW1nZmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mzc5NzEsImV4cCI6MjA2ODUxMzk3MX0.ACNfp4MRa7-r1YYmu04VDltBo5UudrKWWw2NyDPBrk0'
const client = supabase.createClient(supabaseUrl, supabaseKey)
const table = document.getElementById('table')
const th = document.getElementById('th')
const loader = document.getElementById('loader')
const maintable = document.getElementById('maintable')
const h1 = document.getElementById('h1')



async function showdata() {
    loader.style.display = 'flex'
    h1.style.display = `none`
    maintable.style.display = 'none'
    const { data, error } = await client
        .from('Students')
        .select('*')
    loader.style.display = 'none'
    h1.style.display = `block`
    maintable.style.display = 'block'
    if (error) {
        alert(error.message)
    } else {
        data.forEach((e) => {
            table.innerHTML += `
          <tr>
            <td data-label="Name">${e.name}</td>
            <td data-label="Father Name">${e.fatherName}</td>
            <td data-label="Mobile">${e.mobile}</td>
            <td data-label="Age">${e.age}</td>
            <td data-label="Roll Number">${e.RollNumber}</td>
            <td data-label="Qualification">${e.Qualification}</td>
            <td data-label="Gender">${e.gender}</td>
            <td data-label="Address">${e.address}</td>
            <td data-label="Status">${e.status}</td>
          </tr>
          `
        });
    }
}
let token = localStorage.getItem('authToken')
if (token) {
    adminshowdata()
} else {
    showdata()
}
async function adminshowdata() {
    table.innerHTML = ``
    th.innerHTML += `
            <th>Delete</th>`
    loader.style.display = `flex`
    h1.style.display = `none`
    maintable.style.display = 'none'
    const { data, error } = await client
        .from('Students')
        .select('*')
    loader.style.display = 'none'
    h1.style.display = `block`
    maintable.style.display = 'block'
    if (error) {
        alert(error.message)
    } else {
        data.forEach((e) => {
            table.innerHTML += `
          <tr>
            <td data-label="Name">${e.name}</td>
            <td data-label="Father Name">${e.fatherName}</td>
            <td data-label="Mobile">${e.mobile}</td>
            <td data-label="Age">${e.age}</td>
            <td data-label="Roll Number">${e.RollNumber}</td>
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
        alert(`Student Status Changed to ${checkstatus.value}`)
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
    } else {
        Swal.fire("Student!", "Removed!", "success").then(() => {
            adminshowdata()
        });
    }

}



