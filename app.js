// ========================================
// منصة الخدمات الرقمية - JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة التطبيق
    initApp();
});

function initApp() {
    // تهيئة عناصر التحكم
    initNavigation();
    initThemeToggle();
    initMenuToggle();
    initServicePanels();
    initUploadArea();
    initTaskManagement();
    initNotifications();
    initAnimations();
}

// ========================================
// التنقل بين الخدمات
// ========================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const servicePanels = document.querySelectorAll('.service-panel');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            
            // تحديث التنشط في القائمة الجانبية
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // إظهار اللوحة المناسبة
            servicePanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === serviceId) {
                    panel.classList.add('active');
                    // إضافة تأثير الحركة
                    panel.style.animation = 'none';
                    panel.offsetHeight; // Trigger reflow
                    panel.style.animation = 'fadeIn 0.4s ease';
                }
            });

            // إغلاق القائمة الجانبية في الشاشات الصغيرة
            const sidebar = document.querySelector('.sidebar');
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
        });
    });
}

// ========================================
// تبديل السمة (داكن/فاتح)
// ========================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    themeToggle.addEventListener('click', function() {
        const icon = this.querySelector('i');
        
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.remove('light-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        }
    });

    // استعادة السمة المحفوظة
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.querySelector('i').classList.remove('fa-moon');
        themeToggle.querySelector('i').classList.add('fa-sun');
    }
}

// ========================================
// تبديل القائمة الجانبية
// ========================================

function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
}

// ========================================
// لوحات الخدمات
// ========================================

function initServicePanels() {
    // تهيئة منتقي الألوان
    initColorPicker();
    
    // تهيئة أزرار الإجراءات
    initActionButtons();
    
    // تهيئة خيارات التقارير
    initReportTypeCards();
}

function initColorPicker() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(color => {
        color.addEventListener('click', function() {
            // إزالة التحديد من جميع الألوان
            colorOptions.forEach(c => c.classList.remove('selected'));
            // إضافة التحديد للون المحدد
            this.classList.add('selected');
        });
    });
}

// تم التعديل هنا لربط الأزرار الأساسية بسحابة n8n
function initActionButtons() {
    // أزرار الإنشاء
    const primaryButtons = document.querySelectorAll('.primary-btn');
    
    primaryButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            const icon = this.querySelector('i');
            const originalText = this.innerHTML;
            
            // تأثير التحميل
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
            this.disabled = true;
            
            try {
                // تجهيز البيانات لإرسالها
                const dataToSend = {
                    action: "button_clicked",
                    buttonText: this.innerText.replace('جاري المعالجة...', '').trim(),
                    timestamp: new Date().toISOString()
                };

                // إرسال البيانات إلى n8n (الانتظار حتى يتم الإرسال)
                await sendDataToN8n(dataToSend);
                
                // إعادة الزر لحالته الأصلية وعرض إشعار النجاح
                this.innerHTML = originalText;
                this.disabled = false;
                showNotification('تم إرسال الطلب ومعالجته بنجاح!', 'success');
                
            } catch (error) {
                // في حال فشل الاتصال، نُعيد الزر لحالته الطبيعية مع إشعار بالخطأ
                this.innerHTML = originalText;
                this.disabled = false;
                showNotification('حدث خطأ في الاتصال بالخادم السحابي', 'error');
            }
        });
    });

    // أزرار التحويل
    const conversionBtn = document.querySelector('#convert .primary-btn');
    if (conversionBtn) {
        conversionBtn.addEventListener('click', function() {
            showNotification('جاري تحويل الملف...', 'info');
            
            setTimeout(() => {
                showNotification('تم تحويل الملف بنجاح!', 'success');
            }, 2500);
        });
    }

    // أزرار التقارير
    const reportBtn = document.querySelector('#reports .primary-btn');
    if (reportBtn) {
        reportBtn.addEventListener('click', function() {
            showNotification('جاري إنشاء التقرير...', 'info');
            
            setTimeout(() => {
                showNotification('تم إنشاء التقرير بنجاح!', 'success');
            }, 3000);
        });
    }
}

function initReportTypeCards() {
    const reportCards = document.querySelectorAll('.report-type-card');
    
    reportCards.forEach(card => {
        card.addEventListener('click', function() {
            reportCards.forEach(c => c.style.borderColor = '');
            this.style.borderColor = 'var(--primary-color)';
        });
    });
}

// ========================================
// منطقة رفع الملفات
// ========================================

function initUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const browseBtn = uploadArea?.querySelector('.browse-btn');

    if (uploadArea) {
        // حدث السحب والإفلات
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--primary-color)';
            this.style.background = 'rgba(99, 102, 241, 0.1)';
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files);
            }
        });

        // حدث النقر
        uploadArea.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4';
            input.multiple = true;
            
            input.addEventListener('change', function() {
                if (this.files.length > 0) {
                    handleFileUpload(this.files);
                }
            });
            
            input.click();
        });
    }
}

function handleFileUpload(files) {
    const fileNames = Array.from(files).map(f => f.name).join(', ');
    showNotification(`تم رفع: ${fileNames}`, 'success');
    
    // تحديث منطقة الرفع
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success-color); margin-bottom: 16px;"></i>
            <p style="color: var(--text-primary); font-weight: 600;">${files.length} ملف تم رفعه</p>
            <span class="supported-formats">${fileNames}</span>
        `;
    }
}

// ========================================
// إدارة المهام
// ========================================

function initTaskManagement() {
    const addTaskBtn = document.querySelector('.add-task-btn');
    const taskInput = document.querySelector('.task-input');
    const taskDate = document.querySelector('.task-date');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const taskCheckboxes = document.querySelectorAll('.task-checkbox input');

    // إضافة مهمة جديدة
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', function() {
            const title = taskInput?.value.trim();
            const date = taskDate?.value;
            
            if (title) {
                addNewTask(title, date);
                taskInput.value = '';
                taskDate.value = '';
                showNotification('تمت إضافة المهمة بنجاح!', 'success');
            } else {
                showNotification('الرجاء إدخال عنوان للمهمة', 'warning');
            }
        });

        // إضافة المهمة عند الضغط على Enter
        if (taskInput) {
            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addTaskBtn.click();
                }
            });
        }
    }

    // تصفية المهام
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.textContent.trim();
            filterTasks(filter);
        });
    });

    // إكمال المهمة
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            if (this.checked) {
                taskItem.style.opacity = '0.6';
                taskItem.style.textDecoration = 'line-through';
            } else {
                taskItem.style.opacity = '1';
                taskItem.style.textDecoration = 'none';
            }
        });
    });
}

function addNewTask(title, date) {
    const tasksList = document.querySelector('.tasks-list');
    if (!tasksList) return;

    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
        <div class="task-checkbox">
            <input type="checkbox" id="task${Date.now()}">
            <label for="task${Date.now()}"></label>
        </div>
        <div class="task-details">
            <span class="task-title">${title}</span>
            <span class="task-date-info">
                <i class="fas fa-calendar"></i>
                ${date || 'بدون تاريخ'}
            </span>
        </div>
        <div class="task-priority medium">متوسطة</div>
    `;

    tasksList.appendChild(taskItem);

    // إضافة حدث الإكمال
    const checkbox = taskItem.querySelector('input');
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            taskItem.style.opacity = '0.6';
            taskItem.style.textDecoration = 'line-through';
        } else {
            taskItem.style.opacity = '1';
            taskItem.style.textDecoration = 'none';
        }
    });
}

function filterTasks(filter) {
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        const checkbox = item.querySelector('input');
        
        switch(filter) {
            case 'الكل':
                item.style.display = 'flex';
                break;
            case 'نشطة':
                item.style.display = checkbox.checked ? 'none' : 'flex';
                break;
            case 'مكتملة':
                item.style.display = checkbox.checked ? 'flex' : 'none';
                break;
        }
    });
}

// ========================================
// الإشعارات
// ========================================

function initNotifications() {
    const notificationsBtn = document.getElementById('notificationsBtn');
    
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            showNotification('لا توجد إشعارات جديدة', 'info');
        });
    }
}

function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // أيقونة الإشعار
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'error') icon = 'fa-times-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 16px 24px;
        background: ${getNotificationBg(type)};
        border: 1px solid ${getNotificationBorder(type)};
        border-radius: 12px;
        color: white;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        animation: slideDown 0.3s ease;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        font-family: 'Cairo', sans-serif;
    `;

    document.body.appendChild(notification);

    // زر إغلاق الإشعار
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // إخفاء الإشعار تلقائياً
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

function getNotificationBg(type) {
    const colors = {
        'success': 'linear-gradient(135deg, #10b981, #059669)',
        'warning': 'linear-gradient(135deg, #f59e0b, #d97706)',
        'error': 'linear-gradient(135deg, #ef4444, #dc2626)',
        'info': 'linear-gradient(135deg, #3b82f6, #2563eb)'
    };
    return colors[type] || colors['info'];
}

function getNotificationBorder(type) {
    const borders = {
        'success': 'rgba(16, 185, 129, 0.5)',
        'warning': 'rgba(245, 158, 11, 0.5)',
        'error': 'rgba(239, 68, 68, 0.5)',
        'info': 'rgba(59, 130, 246, 0.5)'
    };
    return borders[type] || borders['info'];
}

// ========================================
// التأثيرات الحركية
// ========================================

function initAnimations() {
    // إضافة أنماط الحركة
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }
        
        .float-animation {
            animation: float 3s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);

    // إضافة تأثير Hover للأزرار
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // إضافة تأثيرات للعناصر عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const panels = document.querySelectorAll('.service-panel');
    panels.forEach(panel => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(20px)';
        panel.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(panel);
    });
}

// ========================================
// دوال مساعدة
// ========================================

// دالة للبحث
function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const navItems = document.querySelectorAll('.nav-item');
            
            navItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// تهيئة البحث
initSearch();

// دالة مساعدة للتحقق من صحة البيانات
function validateInput(input, regex) {
    return regex.test(input);
}

// دالة لتنسيق التاريخ
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ar-SA', options);
}

// دالة لتوليد معرف فريد
function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ========================================
// دالة إرسال البيانات إلى سحابة n8n
// ========================================
async function sendDataToN8n(payload) {
    const webhookUrl = "https://digitalservises.app.n8n.cloud/webhook-test/39eb115d-b580-486e-a454-992725de5e5c";
    
    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        
        // إرجاع الرد القادم من n8n
        return await response.json(); 
    } catch (error) {
        console.error("خطأ في الاتصال بـ n8n:", error);
        throw error;
    }
}