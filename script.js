// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Add active class styles for mobile menu
    const style = document.createElement('style');
    style.textContent = `
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
    `;
    document.head.appendChild(style);
    
    // Form submission handler
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmission();
        });
    }
    
    // Initialize calendar
    initializeCalendar();
    
    // Navigation link active state
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Skip the Admin link - let its onclick handler work
            if (href === '#' && this.hasAttribute('onclick')) {
                return; // Don't prevent default for Admin link
            }
            e.preventDefault();
            const targetId = href.substring(1);
            scrollToSection(targetId);
        });
    });
});

// USER-FRIENDLY Calendar with real-time updates
function initializeCalendar() {
    const calendar = document.getElementById('calendar');
    if (!calendar) return;
    
    // Get classes from localStorage with real-time sync
    const availableDates = getClassesFromStorage();
    const today = new Date();
    
    // Filter only future classes and sort by date
    const futureClasses = availableDates
        .filter(item => new Date(item.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6); // Show next 6 classes
    
    let calendarHTML = `
        <div class="calendar-header">
            <h4 style="color: #2c5530; margin-bottom: 20px;">📅 Available Classes</h4>
            <p style="color: #666; font-size: 0.7rem; margin-bottom: 20px;">Book your seat today! Classes update in real-time.</p>
        </div>
        <div class="classes-list">
    `;
    
    if (futureClasses.length === 0) {
        calendarHTML += `
            <div class="no-classes" style="text-align: center; padding: 30px; color: #666;">
                <div style="font-size: 2rem; margin-bottom: 10px;">📝</div>
                <p>No upcoming classes scheduled.</p>
                <p style="font-size: 0.7rem;">Check back soon for new dates!</p>
            </div>
        `;
    } else {
        futureClasses.forEach((item, index) => {
            const date = new Date(item.date);
            const isToday = date.toDateString() === today.toDateString();
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const seatColor = item.seats === 0 ? '#dc3545' : 
                             item.seats <= 2 ? '#fd7e14' : 
                             '#7a9a4d';
            
            const canBook = item.seats > 0;
            
            calendarHTML += `
                <div class="class-card-calendar" ${canBook ? `onclick="quickBook('${item.class}', '${item.date}')"` : ''}>
                    ${isToday ? '<div style="position: absolute; top: -5px; right: -5px; background: #dc3545; color: white; padding: 2px 6px; border-radius: 8px; font-size: 0.6rem; font-weight: bold;">TODAY</div>' : ''}
                    
                    <div class="date-circle" style="background: ${seatColor};">
                        <div style="font-size: 0.6rem; line-height: 1;">${date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
                        <div style="font-size: 1rem; line-height: 1;">${date.getDate()}</div>
                    </div>
                    
                    <div class="class-info-compact">
                        <div class="class-title-compact">${item.class}</div>
                        <div class="class-date-compact">${dayName}, ${monthDay}</div>
                        <div class="class-availability-compact">
                            ${item.seats === 0 ? '🚫 FULL' : 
                              item.seats === 1 ? '⚠️ 1 SEAT LEFT' : 
                              item.seats <= 2 ? `⚠️ ${item.seats} SEATS LEFT` : 
                              `✅ ${item.seats} AVAILABLE`}
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    calendarHTML += `
        </div>
        <div style="text-align: center; margin-top: 20px; padding: 15px; background: #f8faf8; border-radius: 8px;">
            <p style="font-size: 0.7rem; color: #666; margin: 0;">💡 Classes are updated in real-time. Book quickly as seats fill up fast!</p>
        </div>
    `;
    
    calendar.innerHTML = calendarHTML;
    console.log('📅 Calendar updated with', futureClasses.length, 'available classes');
}

// Quick booking function
function quickBook(className, date) {
    // Auto-fill the booking form
    const classSelect = document.getElementById('className');
    const dateInput = document.getElementById('classDate');
    
    if (classSelect && dateInput) {
        // Map class names to form values
        const classMap = {
            'Artisan Bread Making': 'bread',
            'Farm-to-Table Cooking': 'farm-to-table', 
            'Classic Desserts': 'desserts'
        };
        
        const classValue = Object.keys(classMap).find(key => className.includes(key.split(' ')[0]));
        if (classValue) {
            classSelect.value = classMap[classValue];
            dateInput.value = date;
            
            // Scroll to booking form smoothly
            document.querySelector('.booking-form').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Highlight the form
            const form = document.querySelector('.booking-form');
            form.style.boxShadow = '0 0 20px rgba(122, 154, 77, 0.5)';
            form.style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                form.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                form.style.transform = 'scale(1)';
            }, 2000);
            
            // Show helpful message
            const message = document.createElement('div');
            message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #7a9a4d; color: white; padding: 10px 15px; border-radius: 5px; z-index: 1001; font-size: 0.7rem;';
            message.textContent = `✅ ${className} selected! Complete your booking below.`;
            document.body.appendChild(message);
            
            setTimeout(() => message.remove(), 3000);
        }
    }
}

// REAL-TIME localStorage functions for calendar management
function getClassesFromStorage() {
    // Always get fresh data from localStorage
    const stored = localStorage.getItem('cottageClasses');
    if (stored) {
        const classes = JSON.parse(stored);
        console.log('📊 Loaded', classes.length, 'classes from storage');
        return classes;
    }
    
    // Default classes if none stored
    const defaultClasses = [
        { date: '2025-02-14', class: 'Artisan Bread Making', seats: 4, id: 1 },
        { date: '2025-02-17', class: 'Farm-to-Table Cooking', seats: 6, id: 2 },
        { date: '2025-02-21', class: 'Classic Desserts', seats: 3, id: 3 },
        { date: '2025-02-24', class: 'Artisan Bread Making', seats: 5, id: 4 },
        { date: '2025-02-28', class: 'Farm-to-Table Cooking', seats: 2, id: 5 }
    ];
    
    // Save defaults to localStorage
    saveClassesToStorage(defaultClasses);
    return defaultClasses;
}

function saveClassesToStorage(classes) {
    localStorage.setItem('cottageClasses', JSON.stringify(classes));
    // Trigger calendar refresh if on main page
    if (document.getElementById('calendar')) {
        initializeCalendar();
    }
}

// ENHANCED: Listen for storage changes from admin panel
window.addEventListener('storage', function(e) {
    if (e.key === 'cottageClasses' || e.key === 'cottageClassesAdmin') {
        console.log('📺 Admin updated classes - refreshing customer view...');
        initializeCalendar();
        
        // Show update notification to user
        showUpdateNotification();
    }
});

// Show notification when classes are updated
function showUpdateNotification() {
    // Remove existing notification
    const existing = document.getElementById('updateNotification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.id = 'updateNotification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #7a9a4d;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1001;
        font-size: 0.7rem;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = '✨ Classes updated! Fresh availability shown below.';
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// REAL-TIME: Function to trigger calendar updates across tabs
function triggerCalendarUpdate() {
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('classesUpdated'));
    // Trigger storage event for cross-tab updates
    localStorage.setItem('lastUpdate', Date.now().toString());
    
    // Force immediate refresh of calendar
    setTimeout(() => {
        if (document.getElementById('calendar')) {
            console.log('🔄 Triggering real-time calendar update...');
            initializeCalendar();
        }
    }, 50);
    
    // Also trigger a storage event manually for same-tab updates
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'cottageClasses',
        newValue: localStorage.getItem('cottageClasses')
    }));
}

// Listen for calendar updates
window.addEventListener('classesUpdated', function() {
    if (document.getElementById('calendar')) {
        console.log('🔄 Classes updated event received - refreshing...');
        initializeCalendar();
    }
});

// Auto-refresh calendar every 30 seconds to stay in sync
setInterval(() => {
    if (document.getElementById('calendar')) {
        const lastUpdate = localStorage.getItem('lastUpdate');
        if (lastUpdate) {
            const timeSince = Date.now() - parseInt(lastUpdate);
            if (timeSince < 30000) { // If updated within last 30 seconds
                console.log('🔄 Auto-refreshing calendar for recent updates...');
                initializeCalendar();
            }
        }
    }
}, 30000);

// Handle booking form submission
function handleBookingSubmission() {
    const formData = {
        className: document.getElementById('className').value,
        classDate: document.getElementById('classDate').value,
        seats: document.getElementById('seats').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dietary: document.getElementById('dietary').value
    };
    
    // Basic validation
    if (!formData.className || !formData.classDate || !formData.seats || 
        !formData.name || !formData.email || !formData.phone) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // REAL UPDATE: Update seat count in localStorage AND admin system
    const classes = getClassesFromStorage();
    const adminClasses = JSON.parse(localStorage.getItem('cottageClassesAdmin') || '[]');
    
    // Find matching class in customer storage
    const classToUpdate = classes.find(cls => {
        const clsDate = new Date(cls.date).toISOString().split('T')[0];
        const formDate = new Date(formData.classDate).toISOString().split('T')[0];
        return clsDate === formDate && cls.class.toLowerCase().includes(getClassNameFromValue(formData.className));
    });
    
    // Find matching class in admin storage
    const adminClassToUpdate = adminClasses.find(cls => {
        const clsDate = new Date(cls.date).toISOString().split('T')[0];
        const formDate = new Date(formData.classDate).toISOString().split('T')[0];
        return clsDate === formDate && cls.name.toLowerCase().includes(getClassNameFromValue(formData.className));
    });
    
    if (classToUpdate && classToUpdate.seats >= parseInt(formData.seats)) {
        // Update customer storage
        classToUpdate.seats -= parseInt(formData.seats);
        
        // Update admin storage - increase booked seats
        if (adminClassToUpdate) {
            adminClassToUpdate.bookedSeats += parseInt(formData.seats);
            localStorage.setItem('cottageClassesAdmin', JSON.stringify(adminClasses));
        }
        
        // Save booking record
        const bookings = JSON.parse(localStorage.getItem('cottageBookings') || '[]');
        const newBooking = {
            id: Date.now(),
            date: formData.classDate,
            customerName: formData.name,
            email: formData.email,
            phone: formData.phone,
            className: formData.className,
            seats: parseInt(formData.seats),
            dietary: formData.dietary,
            status: 'confirmed',
            bookingTime: new Date().toISOString()
        };
        bookings.push(newBooking);
        localStorage.setItem('cottageBookings', JSON.stringify(bookings));
        
        saveClassesToStorage(classes);
        triggerCalendarUpdate();
        
        // Show enhanced success message
        const successMessage = `✅ BOOKING CONFIRMED!\n\nThank you, ${formData.name}!\n${formData.seats} seat(s) booked for ${getFullClassName(formData.className)}\nDate: ${new Date(formData.classDate).toLocaleDateString()}\n\nConfirmation will be sent to: ${formData.email}\n\n⚡ Calendar updated in real-time!`;
        
        alert(successMessage);
        
        // Reset form
        document.getElementById('bookingForm').reset();
        
        // Scroll back to calendar to show updated availability
        setTimeout(() => {
            document.getElementById('calendar').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 1000);
    } else {
        alert('❌ Sorry, not enough seats available for this class. Please try a different date or fewer seats.\n\n🔄 Check the calendar below for updated availability!');
        // Refresh calendar to show current availability
        initializeCalendar();
    }
    
    // In a real application, this would also send data to a backend server
    console.log('Booking submission:', formData);
    
    // In a real app, you would:
    // 1. Send data to your backend API
    // 2. Process payment if required
    // 3. Send confirmation email
    // 4. Update calendar availability
    // 5. Add to booking management system
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Admin functions for updating classes (for future implementation)
const AdminPanel = {
    // These functions would be implemented when you add admin functionality
    addClass: function(classData) {
        // Add new class to calendar
        console.log('Adding class:', classData);
    },
    
    updateClass: function(classId, newData) {
        // Update existing class
        console.log('Updating class:', classId, newData);
    },
    
    removeClass: function(classId) {
        // Remove class from calendar
        console.log('Removing class:', classId);
    },
    
    updateMonthlySchedule: function(monthData) {
        // Update entire month's schedule
        console.log('Updating monthly schedule:', monthData);
    }
};

// Export admin functions for future use
// Helper functions
function getClassNameFromValue(value) {
    const mapping = {
        'bread': 'bread making',
        'farm-to-table': 'farm-to-table',
        'desserts': 'desserts'
    };
    return mapping[value] || value;
}

function getFullClassName(value) {
    const mapping = {
        'bread': 'Artisan Bread Making',
        'farm-to-table': 'Farm-to-Table Cooking',
        'desserts': 'Classic Desserts'
    };
    return mapping[value] || value;
}

// =====================================================================
// INTEGRATED ADMIN FUNCTIONALITY
// =====================================================================

// Admin state variables
let adminCurrentMonth = new Date();
let adminClasses = [];

// Admin Section Navigation
function showAdminSection(sectionName) {
    // Hide all admin sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.style.display = 'none');
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.admin-nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(`admin-${sectionName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Add active class to clicked button
    const targetButton = document.getElementById(`${sectionName.replace('-', '')}Btn`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    
    // Update content based on section
    if (sectionName === 'dashboard') {
        updateAdminDashboardStats();
    } else if (sectionName === 'manage-classes') {
        initializeAdminSchedule();
    } else if (sectionName === 'bookings') {
        updateAdminBookingsTable();
    }
}

// Load admin classes from localStorage
function getAdminClassesFromStorage() {
    const stored = localStorage.getItem('cottageClassesAdmin');
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Default admin classes if none stored
    const defaultClasses = [
        {
            id: 1,
            type: 'bread',
            name: 'Artisan Bread Making',
            date: '2025-02-14',
            time: '10:00',
            maxSeats: 6,
            bookedSeats: 2,
            price: 85
        },
        {
            id: 2,
            type: 'farm-to-table',
            name: 'Farm-to-Table Cooking',
            date: '2025-02-17',
            time: '14:00',
            maxSeats: 8,
            bookedSeats: 2,
            price: 75
        },
        {
            id: 3,
            type: 'desserts',
            name: 'Classic Desserts',
            date: '2025-02-21',
            time: '11:00',
            maxSeats: 6,
            bookedSeats: 3,
            price: 95
        },
        {
            id: 4,
            type: 'bread',
            name: 'Artisan Bread Making',
            date: '2025-02-24',
            time: '10:00',
            maxSeats: 6,
            bookedSeats: 1,
            price: 85
        },
        {
            id: 5,
            type: 'farm-to-table',
            name: 'Farm-to-Table Cooking',
            date: '2025-02-28',
            time: '14:00',
            maxSeats: 8,
            bookedSeats: 6,
            price: 75
        }
    ];
    
    saveAdminClassesToStorage(defaultClasses);
    return defaultClasses;
}

function saveAdminClassesToStorage(adminClasses) {
    // Save admin classes
    localStorage.setItem('cottageClassesAdmin', JSON.stringify(adminClasses));
    
    // Update customer-facing storage immediately
    const customerClasses = adminClasses
        .filter(cls => new Date(cls.date) >= new Date())
        .map(cls => ({
            id: cls.id,
            date: cls.date,
            class: cls.name,
            seats: cls.maxSeats - cls.bookedSeats
        }));
    
    localStorage.setItem('cottageClasses', JSON.stringify(customerClasses));
    
    // Trigger calendar update for customer side
    triggerCalendarUpdate();
    
    console.log('✅ Admin classes saved and synced to customer site!');
}

// Initialize admin panel
function initializeAdminPanel() {
    adminClasses = getAdminClassesFromStorage();
    showAdminSection('dashboard');
    setupAdminEventListeners();
}

function setupAdminEventListeners() {
    // Add class form
    const addClassForm = document.getElementById('addClassForm');
    if (addClassForm) {
        addClassForm.addEventListener('submit', handleAdminAddClass);
    }
}

// Handle adding new class
function handleAdminAddClass(e) {
    e.preventDefault();
    
    const formData = {
        type: document.getElementById('classType').value,
        date: document.getElementById('classDate').value,
        time: document.getElementById('classTime').value,
        maxSeats: parseInt(document.getElementById('maxSeats').value),
        price: parseFloat(document.getElementById('price').value),
        notes: document.getElementById('notes').value
    };
    
    // Validation
    if (!formData.type || !formData.date || !formData.time || !formData.maxSeats || !formData.price) {
        showAdminMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Check if date is in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showAdminMessage('Please select a future date.', 'error');
        return;
    }
    
    // Get class name mapping
    const classNames = {
        'bread': 'Artisan Bread Making',
        'farm-to-table': 'Farm-to-Table Cooking',
        'desserts': 'Classic Desserts'
    };
    
    // Create new class
    const newClass = {
        id: Date.now(),
        type: formData.type,
        name: classNames[formData.type],
        date: formData.date,
        time: formData.time,
        maxSeats: formData.maxSeats,
        bookedSeats: 0,
        price: formData.price,
        notes: formData.notes
    };
    
    adminClasses.push(newClass);
    saveAdminClassesToStorage(adminClasses);
    
    // Update displays
    initializeAdminSchedule();
    updateAdminDashboardStats();
    
    showAdminMessage(`${newClass.name} class added for ${formatAdminDate(formData.date)}!`, 'success');
    
    // Reset form
    document.getElementById('addClassForm').reset();
}

// Admin dashboard stats
function updateAdminDashboardStats() {
    const now = new Date();
    const currentMonthStr = now.toISOString().substring(0, 7);
    
    const currentMonthClasses = adminClasses.filter(cls => 
        cls.date.startsWith(currentMonthStr)
    );
    
    const bookings = JSON.parse(localStorage.getItem('cottageBookings') || '[]');
    const currentMonthBookings = bookings.filter(booking => 
        booking.date.startsWith(currentMonthStr)
    );
    
    const totalBookings = currentMonthClasses.reduce((sum, cls) => sum + cls.bookedSeats, 0);
    const totalSeats = currentMonthClasses.reduce((sum, cls) => sum + cls.maxSeats, 0);
    const availableSeats = totalSeats - totalBookings;
    const revenue = currentMonthClasses.reduce((sum, cls) => sum + (cls.bookedSeats * cls.price), 0);
    
    // Update stats
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('upcomingClasses').textContent = currentMonthClasses.length;
    document.getElementById('availableSeats').textContent = availableSeats;
    document.getElementById('monthlyRevenue').textContent = `$${revenue.toLocaleString()}`;
    
    // Update bookings table
    updateAdminBookingsTable(currentMonthBookings);
}

// Admin schedule
function initializeAdminSchedule() {
    const scheduleGrid = document.getElementById('adminScheduleGrid');
    const currentMonthSpan = document.getElementById('currentAdminMonth');
    
    if (!scheduleGrid || !currentMonthSpan) return;
    
    currentMonthSpan.textContent = adminCurrentMonth.toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    const firstDay = new Date(adminCurrentMonth.getFullYear(), adminCurrentMonth.getMonth(), 1);
    const lastDay = new Date(adminCurrentMonth.getFullYear(), adminCurrentMonth.getMonth() + 1, 0);
    
    let scheduleHTML = '';
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(adminCurrentMonth.getFullYear(), adminCurrentMonth.getMonth(), day);
        const dateString = currentDate.toISOString().split('T')[0];
        
        const dayClasses = adminClasses.filter(cls => cls.date === dateString);
        const hasClass = dayClasses.length > 0;
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
        
        scheduleHTML += `
            <div class="schedule-item ${hasClass ? 'has-class' : ''}">
                <div class="schedule-date">${dayName}, ${day}</div>
        `;
        
        if (dayClasses.length > 0) {
            dayClasses.forEach(cls => {
                const availableSeats = cls.maxSeats - cls.bookedSeats;
                scheduleHTML += `
                    <div class="schedule-class">${cls.name}</div>
                    <div class="schedule-seats">${cls.time} - ${availableSeats} seats available</div>
                `;
            });
        } else {
            scheduleHTML += '<div class="schedule-class">No classes scheduled</div>';
        }
        
        scheduleHTML += '</div>';
    }
    
    scheduleGrid.innerHTML = scheduleHTML;
}

function changeAdminMonth(direction) {
    adminCurrentMonth.setMonth(adminCurrentMonth.getMonth() + direction);
    initializeAdminSchedule();
}

// Simplified class management - no modals needed

// Bookings table
function updateAdminBookingsTable(bookings = null) {
    if (!bookings) {
        bookings = JSON.parse(localStorage.getItem('cottageBookings') || '[]');
    }
    
    const tableBody = document.getElementById('adminBookingsTableBody');
    if (!tableBody) return;
    
    if (bookings.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666;">No bookings yet</td></tr>';
        return;
    }
    
    tableBody.innerHTML = bookings.slice(-10).reverse().map(booking => {
        const date = new Date(booking.date).toLocaleDateString();
        const className = getFullClassNameFromType(booking.className);
        return `
            <tr>
                <td>${date}</td>
                <td>${booking.customerName}</td>
                <td>${className}</td>
                <td>${booking.seats}</td>
                <td>${booking.email}<br/>${booking.phone}</td>
                <td><span class="status ${booking.status}">${booking.status}</span></td>
                <td>
                    <button class="action-btn" onclick="editAdminBooking('${booking.id}')">View</button>
                    <button class="action-btn cancel" onclick="cancelAdminBooking('${booking.id}')">Cancel</button>
                </td>
            </tr>
        `;
    }).join('');
}

function editAdminBooking(bookingId) {
    showAdminMessage('Booking details would open here.', 'info');
}

function cancelAdminBooking(bookingId) {
    if (confirm('Cancel this booking?')) {
        showAdminMessage('Booking cancelled.', 'info');
    }
}

// Utility functions
function formatAdminDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getFullClassNameFromType(type) {
    const mapping = {
        'bread': 'Artisan Bread Making',
        'farm-to-table': 'Farm-to-Table Cooking',
        'desserts': 'Classic Desserts'
    };
    return mapping[type] || type;
}

function showAdminMessage(text, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.admin-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `admin-message ${type}`;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1001;
        font-size: 0.9rem;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    message.textContent = text;
    
    document.body.appendChild(message);
    
    setTimeout(() => message.remove(), 4000);
}

// Initialize admin functionality when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
    setupAdminEventListeners();
});

// Listen for storage changes for real-time updates
window.addEventListener('storage', function(e) {
    if (e.key === 'cottageBookings') {
        console.log('New booking detected in admin panel');
        updateAdminDashboardStats();
        showAdminMessage('New customer booking received!', 'success');
    }
});

// Make admin functions globally available
window.showAdminSection = showAdminSection;
window.changeAdminMonth = changeAdminMonth;
window.editAdminBooking = editAdminBooking;
window.cancelAdminBooking = cancelAdminBooking;

// =====================================================================
// VIDEO GALLERY FUNCTIONALITY
// =====================================================================

// Video player controls
function playMainVideo() {
    const video = document.getElementById('mainVideo');
    const overlay = document.querySelector('.video-overlay');
    
    if (video) {
        if (video.paused) {
            video.play();
            overlay.style.opacity = '0';
        } else {
            video.pause();
            overlay.style.opacity = '1';
        }
    }
}

// Toggle fullscreen video
function toggleFullscreen() {
    const video = document.getElementById('mainVideo');
    const container = document.querySelector('.video-container');
    
    if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
        
        showVideoMessage('🔳 Entered fullscreen mode', 'success');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        showVideoMessage('🔳 Exited fullscreen mode', 'info');
    }
}

// Share video functionality
function shareVideo() {
    const videoTitle = "World's Largest Birthday Cake - Las Vegas Centennial by Chef Brian Averna";
    const videoUrl = window.location.href + "#gallery";
    
    if (navigator.share) {
        navigator.share({
            title: videoTitle,
            text: "Check out this amazing culinary achievement by Chef Brian Averna - the World's Largest Birthday Cake!",
            url: videoUrl,
        }).then(() => {
            showVideoMessage('📤 Video shared successfully!', 'success');
        }).catch(() => {
            fallbackShare(videoTitle, videoUrl);
        });
    } else {
        fallbackShare(videoTitle, videoUrl);
    }
}

// Fallback share function
function fallbackShare(title, url) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showVideoMessage('🔗 Video link copied to clipboard!', 'success');
        }).catch(() => {
            showShareModal(title, url);
        });
    } else {
        showShareModal(title, url);
    }
}

// Show share modal
function showShareModal(title, url) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        ">
            <h3 style="color: #2c5530; margin-bottom: 20px;">Share This Video</h3>
            <p style="margin-bottom: 20px; color: #666;">${title}</p>
            <input type="text" value="${url}" readonly style="
                width: 100%;
                padding: 10px;
                border: 2px solid #7a9a4d;
                border-radius: 5px;
                margin-bottom: 20px;
                font-size: 0.9rem;
            " onclick="this.select()">
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="copyToClipboard('${url}'); closeShareModal();" style="
                    background: #7a9a4d;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Copy Link</button>
                <button onclick="closeShareModal()" style="
                    background: #ccc;
                    color: #333;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentShareModal = modal;
}

// Close share modal
function closeShareModal() {
    if (window.currentShareModal) {
        window.currentShareModal.remove();
        window.currentShareModal = null;
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showVideoMessage('🔗 Link copied to clipboard!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showVideoMessage('🔗 Link copied to clipboard!', 'success');
    }
}

// Download video functionality
function downloadVideo() {
    showVideoMessage('⬇️ Video download initiated...', 'info');
    
    // Create a temporary link to download the video
    const link = document.createElement('a');
    link.href = 'las vegas cake.mp4';
    link.download = 'Brian_Averna_Las_Vegas_Birthday_Cake.mp4';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
        showVideoMessage('📁 Check your downloads folder!', 'success');
    }, 1000);
}

// Show video message
function showVideoMessage(text, type = 'info') {
    // Remove existing video messages
    const existingMessages = document.querySelectorAll('.video-message');
    existingMessages.forEach(msg => msg.remove());
    
    const message = document.createElement('div');
    message.className = `video-message ${type}`;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1001;
        font-size: 0.9rem;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
    `;
    message.textContent = text;
    
    // Add animation styles if not already present
    if (!document.getElementById('videoMessageStyles')) {
        const style = document.createElement('style');
        style.id = 'videoMessageStyles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Video event listeners
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('mainVideo');
    const overlay = document.querySelector('.video-overlay');
    
    if (video && overlay) {
        // Update overlay visibility based on video state
        video.addEventListener('play', () => {
            overlay.style.opacity = '0';
        });
        
        video.addEventListener('pause', () => {
            overlay.style.opacity = '1';
        });
        
        video.addEventListener('ended', () => {
            overlay.style.opacity = '1';
            showVideoMessage('🎬 Video finished! Thanks for watching!', 'success');
        });
        
        // Click on video to toggle play/pause
        video.addEventListener('click', playMainVideo);
        
        // Keyboard controls
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space' && e.target === video) {
                e.preventDefault();
                playMainVideo();
            } else if (e.code === 'KeyF' && e.target === video) {
                e.preventDefault();
                toggleFullscreen();
            }
        });
    }
    
    // Gallery item click handlers (for future expansion)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('p').textContent;
            showVideoMessage(`📱 ${title} - Coming soon!`, 'info');
        });
    });
});

// Export video functions for global access
window.playMainVideo = playMainVideo;
window.toggleFullscreen = toggleFullscreen;
window.shareVideo = shareVideo;
window.downloadVideo = downloadVideo;
window.closeShareModal = closeShareModal;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdminPanel };
}