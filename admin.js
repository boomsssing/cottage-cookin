// Admin Panel JavaScript

// Load classes from localStorage with admin format
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
    
    // INSTANT SYNC: Update customer-facing storage immediately
    const customerClasses = adminClasses
        .filter(cls => new Date(cls.date) >= new Date()) // Only future classes
        .map(cls => ({
            id: cls.id,
            date: cls.date,
            class: cls.name,
            seats: cls.maxSeats - cls.bookedSeats
        }));
    
    localStorage.setItem('cottageClasses', JSON.stringify(customerClasses));
    
    // Trigger immediate update
    triggerCalendarUpdate();
    
    // Force storage event for cross-tab communication
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'cottageClasses',
        newValue: JSON.stringify(customerClasses),
        oldValue: null
    }));
    
    console.log('✅ REAL-TIME: Classes saved and instantly synced to customer site!', {
        adminClasses: adminClasses.length,
        customerClasses: customerClasses.length
    });
}

let classes = getAdminClassesFromStorage();

let currentMonth = new Date();

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeSchedule();
    setupEventListeners();
    updateDashboardStats();
});

function setupEventListeners() {
    // Add class form submission
    const addClassForm = document.getElementById('addClassForm');
    if (addClassForm) {
        addClassForm.addEventListener('submit', handleAddClass);
    }
    
    // Navigation
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Modal close button
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }

    // Modal background click to close
    const modal = document.getElementById('classModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal();
            }
        });
    }
}

function handleAddClass(e) {
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
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Check if date is in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showMessage('Please select a future date.', 'error');
        return;
    }
    
    // Get class name
    const classNames = {
        'bread': 'Artisan Bread Making',
        'farm-to-table': 'Farm-to-Table Cooking',
        'desserts': 'Classic Desserts'
    };
    
    // Create new class object
    const newClass = {
        id: Date.now(), // Simple ID generation
        type: formData.type,
        name: classNames[formData.type],
        date: formData.date,
        time: formData.time,
        maxSeats: formData.maxSeats,
        bookedSeats: 0,
        price: formData.price,
        notes: formData.notes
    };
    
    // Add to classes array
    classes.push(newClass);
    
    // INSTANT SAVE: Save to localStorage and update displays
    saveAdminClassesToStorage(classes);
    initializeSchedule();
    updateDashboardStats();
    
    // Multiple triggers to ensure customer site updates
    triggerCalendarUpdate();
    
    // Additional manual trigger after short delay
    setTimeout(() => {
        triggerCalendarUpdate();
        console.log('⚡ DOUBLE-CHECK: Triggered second update to ensure sync');
    }, 200);
    
    console.log('✅ New class added and INSTANTLY synced to customer site!');
    
    // Show success message
    showMessage(`${newClass.name} class added successfully for ${formatDate(formData.date)}!`, 'success');
    
    // Reset form
    document.getElementById('addClassForm').reset();
    
    // In a real app, you would send this to your backend:
    console.log('New class added:', newClass);
}

// Global variable to store currently selected class
let selectedClass = null;

function showModal() {
    const modal = document.getElementById('classModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalButtons = document.getElementById('modalButtons');
    
    if (!modal || !modalTitle || !modalButtons || !selectedClass) return;
    
    // Clear existing buttons
    modalButtons.innerHTML = '';
    
    if (selectedClass.hasClass === false) {
        // Empty day - show "Add Class" option
        modalTitle.textContent = `Add Class - ${formatDate(selectedClass.date)}`;
        modalButtons.innerHTML = `
            <button onclick="handleAddNewClass()" class="admin-button">Add Class</button>
        `;
    } else {
        // Day has class - show "Edit" and "Delete" options
        modalTitle.textContent = `Manage Class - ${formatDate(selectedClass.date)}`;
        modalButtons.innerHTML = `
            <button onclick="handleEditClass()" class="admin-button">Edit Class</button>
            <button onclick="handleDeleteClass()" class="admin-button cancel">Delete Class</button>
        `;
    }
    
    modal.style.display = 'block';
}

function hideModal() {
    const modal = document.getElementById('classModal');
    if (modal) {
        modal.style.display = 'none';
        selectedClass = null;
    }
}

function handleAddNewClass() {
    if (!selectedClass || selectedClass.hasClass !== false) return;
    
    // Pre-populate the date field
    document.getElementById('classDate').value = selectedClass.date;
    
    // Clear other fields
    document.getElementById('classType').value = '';
    document.getElementById('classTime').value = '';
    document.getElementById('maxSeats').value = '';
    document.getElementById('price').value = '';
    document.getElementById('notes').value = '';
    
    // Scroll to the form
    document.getElementById('classes').scrollIntoView({ behavior: 'smooth' });
    
    hideModal();
    
    showMessage('Please fill in the class details in the form above.', 'info');
}

function handleEditClass() {
    if (!selectedClass || selectedClass.hasClass === false) return;
    
    // Populate the add class form with the selected class data
    document.getElementById('classType').value = selectedClass.type;
    document.getElementById('classDate').value = selectedClass.date;
    document.getElementById('classTime').value = selectedClass.time;
    document.getElementById('maxSeats').value = selectedClass.maxSeats;
    document.getElementById('price').value = selectedClass.price;
    document.getElementById('notes').value = selectedClass.notes || '';
    
    // Scroll to the form
    document.getElementById('classes').scrollIntoView({ behavior: 'smooth' });
    
    // Remove the old class
    classes = classes.filter(cls => cls.id !== selectedClass.id);
    
    // Hide modal
    hideModal();
    
    // Update displays
    saveAdminClassesToStorage(classes);
    initializeSchedule();
    updateDashboardStats();
    
    showMessage('Please update the class details in the form above.', 'info');
}

function handleDeleteClass() {
    if (!selectedClass || selectedClass.hasClass === false) return;
    
    if (confirm(`Are you sure you want to delete the ${selectedClass.name} class on ${formatDate(selectedClass.date)}?`)) {
        // Remove the class
        classes = classes.filter(cls => cls.id !== selectedClass.id);
        
        // Update storage and displays
        saveAdminClassesToStorage(classes);
        initializeSchedule();
        updateDashboardStats();
        
        showMessage('Class deleted successfully.', 'success');
    }
    
    hideModal();
}

function handleScheduleItemDoubleClick(classData) {
    selectedClass = classData;
    showModal();
}

function initializeSchedule() {
    const scheduleGrid = document.getElementById('scheduleGrid');
    const currentMonthSpan = document.getElementById('currentMonth');
    
    if (!scheduleGrid || !currentMonthSpan) return;
    
    // Update month display
    currentMonthSpan.textContent = currentMonth.toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Get first and last day of current month
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    let scheduleHTML = '';
    
    // Generate calendar days
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateString = currentDate.toISOString().split('T')[0];
        
        // Find classes for this date
        const dayClasses = classes.filter(cls => cls.date === dateString);
        
        const hasClass = dayClasses.length > 0;
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Add double-click to ALL days, pass the date and any existing class data
        const clickData = hasClass ? dayClasses[0] : { date: dateString, hasClass: false };
        
        scheduleHTML += `
            <div class="schedule-item ${hasClass ? 'has-class' : ''}" ondblclick="handleScheduleItemDoubleClick(${JSON.stringify(clickData).replace(/"/g, '&quot;')})">
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

function changeMonth(direction) {
    currentMonth.setMonth(currentMonth.getMonth() + direction);
    initializeSchedule();
}

function updateDashboardStats() {
    // REAL STATS: Calculate current month stats from actual bookings
    const now = new Date();
    const currentMonthStr = now.toISOString().substring(0, 7); // YYYY-MM format
    
    const currentMonthClasses = classes.filter(cls => 
        cls.date.startsWith(currentMonthStr)
    );
    
    // Get real bookings from localStorage
    const bookings = JSON.parse(localStorage.getItem('cottageBookings') || '[]');
    const currentMonthBookings = bookings.filter(booking => 
        booking.date.startsWith(currentMonthStr)
    );
    
    const totalBookings = currentMonthClasses.reduce((sum, cls) => sum + cls.bookedSeats, 0);
    const totalSeats = currentMonthClasses.reduce((sum, cls) => sum + cls.maxSeats, 0);
    const availableSeats = totalSeats - totalBookings;
    const revenue = currentMonthClasses.reduce((sum, cls) => sum + (cls.bookedSeats * cls.price), 0);
    
    // Update stats display with REAL numbers
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('.stat-number').textContent = totalBookings;
        statCards[1].querySelector('.stat-number').textContent = currentMonthClasses.length;
        statCards[2].querySelector('.stat-number').textContent = availableSeats;
        statCards[3].querySelector('.stat-number').textContent = `$${revenue.toLocaleString()}`;
    }
    
    // Update bookings table with real bookings
    updateBookingsTable(currentMonthBookings);
}

function showMessage(text, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert at top of main content
    const main = document.querySelector('main');
    const firstSection = main.querySelector('section');
    main.insertBefore(message, firstSection);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Booking management functions
function confirmBooking(bookingId) {
    // In a real app, this would update the database
    console.log('Confirming booking:', bookingId);
    showMessage('Booking confirmed successfully!', 'success');
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        // In a real app, this would update the database
        console.log('Cancelling booking:', bookingId);
        showMessage('Booking cancelled successfully.', 'info');
    }
}

function editBooking(bookingId) {
    // In a real app, this would open an edit form
    console.log('Editing booking:', bookingId);
    showMessage('Edit functionality would open here.', 'info');
}

// Export functions for global access
window.changeMonth = changeMonth;
window.confirmBooking = confirmBooking;
window.cancelBooking = cancelBooking;
window.editBooking = editBooking;

// Monthly schedule update functionality
function updateMonthlySchedule() {
    // This function would be called to update the entire month's schedule
    // Could include bulk operations like:
    // - Adding recurring classes
    // - Adjusting prices for the month
    // - Setting special holiday schedules
    
    const monthlyUpdates = {
        month: currentMonth.toISOString().substring(0, 7),
        classes: classes.filter(cls => cls.date.startsWith(currentMonth.toISOString().substring(0, 7)))
    };
    
    console.log('Monthly schedule update:', monthlyUpdates);
    
    // In a real application, this would:
    // 1. Send data to backend API
    // 2. Update database with new schedule
    // 3. Send notifications to customers about changes
    // 4. Update calendar availability
    
    showMessage('Monthly schedule updated successfully!', 'success');
}

// ENHANCED: Function to trigger calendar updates across tabs
function triggerCalendarUpdate() {
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('classesUpdated'));
    
    // Trigger storage event for cross-tab updates  
    localStorage.setItem('lastUpdate', Date.now().toString());
    
    // Force multiple storage events to ensure customer site updates
    setTimeout(() => {
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'cottageClasses',
            newValue: localStorage.getItem('cottageClasses')
        }));
    }, 100);
    
    console.log('🔄 ADMIN: Triggered cross-tab calendar update');
}

// ENHANCED REAL-TIME: Listen for storage changes from customer site
window.addEventListener('storage', function(e) {
    if (e.key === 'cottageClasses' || e.key === 'cottageClassesAdmin' || e.key === 'cottageBookings') {
        console.log('📺 Customer booking detected - updating admin panel...');
        
        // Reload admin classes if customer made booking
        classes = getAdminClassesFromStorage();
        initializeSchedule();
        updateDashboardStats();
        
        // Show admin notification
        showAdminNotification('New customer booking received!');
        
        console.log('✅ Admin panel updated in real-time!');
    }
});

// Show admin notification
function showAdminNotification(message) {
    const existing = document.getElementById('adminNotification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.id = 'adminNotification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1001;
        font-size: 0.7rem;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    notification.textContent = '🔔 ' + message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 4000);
}

// REAL-TIME: Update bookings table
function updateBookingsTable(bookings) {
    const tableBody = document.getElementById('bookingsTableBody');
    if (!tableBody || !bookings) return;
    
    if (bookings.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666;">No bookings yet</td></tr>';
        return;
    }
    
    tableBody.innerHTML = bookings.map(booking => {
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
                    <button class="action-btn" onclick="editBooking('${booking.id}')">Edit</button>
                    <button class="action-btn cancel" onclick="cancelBooking('${booking.id}')">Cancel</button>
                </td>
            </tr>
        `;
    }).join('');
}

function getFullClassNameFromType(type) {
    const mapping = {
        'bread': 'Artisan Bread Making',
        'farm-to-table': 'Farm-to-Table Cooking', 
        'desserts': 'Classic Desserts'
    };
    return mapping[type] || type;
}

// Make monthly update function globally available
window.updateMonthlySchedule = updateMonthlySchedule;
window.triggerCalendarUpdate = triggerCalendarUpdate;