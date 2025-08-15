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

// Supabase configuration
const supabaseUrl = 'https://ipoviueuhflhqjemgfkw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwb3ZpdWV1aGZsaHFqZW1nZmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mzc5NzEsImV4cCI6MjA2ODUxMzk3MX0.ACNfp4MRa7-r1YYmu04VDltBo5UudrKWWw2NyDPBrk0';
const client = supabase.createClient(supabaseUrl, supabaseKey);

// DOM elements
const mainDiv = document.getElementById('info');
const adminLoginDiv = document.getElementById('adminlogin');
const studentLogin = document.getElementById('studentLogin');
const loader = document.getElementById('loader');

// Regex patterns
const pkNumberRegex = /^(\+92|0092|92|0)?3[0-9]{9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Initialize form validation
function initFormValidation() {
    const mobileNumber = document.getElementById('m-number');
    const email = document.getElementById('email');
    const age = document.getElementById('age');

    // Mobile number validation
    mobileNumber.addEventListener('blur', () => {
        if (!pkNumberRegex.test(mobileNumber.value)) {
            mobileNumber.classList.add('invalid');
            toastr.error('Please enter a valid Pakistani mobile number');
        } else {
            mobileNumber.classList.remove('invalid');
        }
    });

    // Email validation
    email.addEventListener('blur', () => {
        if (!emailRegex.test(email.value)) {
            email.classList.add('invalid');
            toastr.error('Please enter a valid email address');
        } else {
            email.classList.remove('invalid');
        }
    });

    // Age validation
    age.addEventListener('blur', () => {
        if (age.value < 16 || age.value > 30) {
            age.classList.add('invalid');
            toastr.error('Age must be between 16 and 30 years');
        } else {
            age.classList.remove('invalid');
        }
    });

    // Course selection
    const courseCategory = document.getElementById('Course');
    const courseSelect = document.getElementById('CourseCatagary');

    courseCategory.addEventListener('change', () => {
        courseSelect.innerHTML = '<option value="" disabled selected>Select Course</option>';
        if (courseCategory.value === 'Language') {
            courseSelect.innerHTML = `
                    <option value="" disabled selected>Select Course</option>
                    <option value="English" >English</option>
                    <option value="Chinese" >Chinese</option>
                    <option value="Arabic" >Arabic</option>
                    <option value="French" >French</option>
                    <option value="German" >German</option>
                    `
        } else if (courseCategory.value === 'IT') {
            const itCourses = ['Web Development', 'Graphic Designing', 'Digital Marketing',
                'Cyber Security', 'Data Science', 'Mobile App Development'];
            courseSelect.innerHTML = `
          <option value="" disabled selected>Select Course</option>
          <option value="Web Development">Web Development</option>
          <option value="Graphic Designing">Graphic Designing</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="Cyber Security">Cyber Security</option>
          <option value="Data Science">Data Science</option>
          <option value="Mobile App Development">Mobile App Development</option>
          `


        }
    });
}

// Capitalize first letter of each word
function capitalizeFirst(input) {
    let value = input.value.toLowerCase();
    input.value = value.replace(/\b\w/g, char => char.toUpperCase());
}

// Show loader
function showLoader() {
    loader.style.display = 'flex';
}

// Hide loader
function hideLoader() {
    loader.style.display = 'none';
}

// Back to main menu
function backToMain() {
    adminLoginDiv.style.display = 'none';
    studentLogin.style.display = 'none';
    mainDiv.style.display = 'flex';
}

// Admin login function
function adminLogin() {
    const token = localStorage.getItem('authToken');
    if (token) {
        window.location.href = 'admin.html';
        return;
    }

    mainDiv.style.display = 'none';
    studentLogin.style.display = 'none';
    adminLoginDiv.style.display = 'block';

    const adminLoginInput = document.getElementById('adminlogininput');
    const loginBtn = document.getElementById('login');

    const attemptLogin = () => {
        if (adminLoginInput.value === '12446') {
            localStorage.setItem('authToken', 'userLoggedIn');
            toastr.success('Admin login successful');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
        } else {
            toastr.error('Invalid admin key');
            adminLoginInput.classList.add('invalid');
        }
    };

    loginBtn.addEventListener('click', attemptLogin);
    adminLoginInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') attemptLogin();
    });
}

// Add student form
function addStudent() {
    mainDiv.style.display = 'none';
    adminLoginDiv.style.display = 'none';
    studentLogin.style.display = 'block';
    initFormValidation();
}

// Register student
document.getElementById('addStudent').addEventListener('click', async () => {
    // Get all form values
    const formFields = [
        'name', 'f-name', 'm-number', 'email',
        'age', 'Qualfication', 'gender',
        'Course', 'CourseCatagary', 'address'
    ];

    const formData = {};
    let isValid = true;

    // Validate all fields
    formFields.forEach(field => {
        const element = document.getElementById(field);
        const value = element.value.trim();

        if (!value) {
            element.classList.add('invalid');
            isValid = false;
        } else {
            element.classList.remove('invalid');
            formData[field] = value;
        }
    });

    // Special validations
    if (!pkNumberRegex.test(formData['m-number'])) {
        document.getElementById('m-number').classList.add('invalid');
        isValid = false;
    }

    if (!emailRegex.test(formData['email'])) {
        document.getElementById('email').classList.add('invalid');
        isValid = false;
    }

    if (formData['age'] < 16 || formData['age'] > 30) {
        document.getElementById('age').classList.add('invalid');
        isValid = false;
    }

    if (!isValid) {
        toastr.error('Please fill all fields correctly');
        return;
    }

    // Prepare data for Supabase
    const studentData = {
        name: formData['name'],
        fatherName: formData['f-name'],
        mobile: formData['m-number'],
        email: formData['email'],
        age: formData['age'],
        Qualification: formData['Qualfication'],
        gender: formData['gender'],
        courseCategory: formData['Course'],
        course: formData['CourseCatagary'],
        address: formData['address'],
        RollNumber: Math.floor(Math.random() * 1000) + 1000,
        registrationDate: new Date().toISOString()
    };

    // Submit to Supabase
    showLoader();
    try {
        const { data, error } = await client
            .from('Students')
            .insert([studentData])
            .select();

        hideLoader();

        if (error) throw error;

        toastr.success('Student registered successfully!');
        setTimeout(() => {
            window.location.href = 'StudentsData.html';
        }, 1500);
    } catch (error) {
        hideLoader();
        toastr.error('Error registering student: ' + error.message);
        console.error('Supabase error:', error);
    }
});

// Other functions
function checkstudents() {
    window.location.href = 'StudentsData.html';
}

function checkstudentwithrollnum() {
    window.location.href = 'checkstudent.html';
}

function adminlogout() {
    localStorage.clear();
    toastr.info('Logged out successfully');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}