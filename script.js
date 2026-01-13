// تخزين البيانات محلياً
let savedReports = JSON.parse(localStorage.getItem('dailyReports')) || [];

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تعيين التاريخ الحالي
    document.getElementById('date').valueAsDate = new Date();
    
    // عرض البيانات المحفوظة
    displaySavedData();
    
    // معالج إرسال النموذج
    document.getElementById('dailyReportForm').addEventListener('submit', handleFormSubmit);
    
    // معالج تصدير Excel
    document.getElementById('exportExcel').addEventListener('click', exportToExcel);
    
    // معالج تصدير PDF
    document.getElementById('exportPDF').addEventListener('click', exportToPDF);
});

// معالج إرسال النموذج
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reportData = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        sector: formData.get('sector'),
        date: formData.get('date'),
        dayOfWeek: formData.get('dayOfWeek'),
        week: formData.get('week'),
        supervisor: formData.get('supervisor'),
        task: formData.get('task'),
        schoolNames: formData.get('schoolNames'),
        serviceType: formData.get('serviceType'),
        stages: formData.getAll('stage'),
        schoolType: formData.get('schoolType'),
        platform: formData.get('platform'),
        learningOutcomes: {
            planning: {
                points: formData.get('planning_points'),
                notes: formData.get('planning_notes')
            },
            execution: {
                points: formData.get('execution_points'),
                notes: formData.get('execution_notes')
            },
            evaluation: {
                points: formData.get('evaluation_points'),
                notes: formData.get('evaluation_notes')
            }
        },
        resources: {
            labs: {
                status: formData.get('labs'),
                notes: formData.get('labs_notes')
            },
            tech: {
                status: formData.get('tech'),
                notes: formData.get('tech_notes')
            },
            library: {
                status: formData.get('library'),
                notes: formData.get('library_notes')
            }
        },
        arrivalTime: formData.get('arrivalTime'),
        departureTime: formData.get('departureTime'),
        initiatives: formData.get('initiatives'),
        experiences: formData.get('experiences'),
        recommendations: formData.get('recommendations'),
        suggestions: formData.get('suggestions')
    };
    
    // حفظ البيانات
    savedReports.push(reportData);
    localStorage.setItem('dailyReports', JSON.stringify(savedReports));
    
    // إظهار رسالة نجاح
    showAlert('تم حفظ البيانات بنجاح!', 'success');
    
    // تحديث الجدول
    displaySavedData();
    
    // إعادة تعيين النموذج
    e.target.reset();
    document.getElementById('date').valueAsDate = new Date();
}

// عرض البيانات المحفوظة
function displaySavedData() {
    const tbody = document.getElementById('savedDataBody');
    tbody.innerHTML = '';
    
    if (savedReports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">لا توجد بيانات محفوظة</td></tr>';
        return;
    }
    
    savedReports.reverse().forEach((report, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${report.date}</td>
            <td>${report.sector}</td>
            <td>${report.supervisor}</td>
            <td>${report.schoolNames.substring(0, 50)}...</td>
            <td class="action-buttons">
                <button class="action-btn view-btn" onclick="viewReport(${savedReports.length - 1 - index})">عرض</button>
                <button class="action-btn delete-btn" onclick="deleteReport(${savedReports.length - 1 - index})">حذف</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    savedReports.reverse();
}

// عرض التقرير
function viewReport(index) {
    const report = savedReports[index];
    
    // ملء النموذج بالبيانات
    document.getElementById('sector').value = report.sector;
    document.getElementById('date').value = report.date;
    document.getElementById('dayOfWeek').value = report.dayOfWeek;
    document.getElementById('week').value = report.week;
    document.getElementById('supervisor').value = report.supervisor;
    document.getElementById('task').value = report.task;
    document.getElementById('schoolNames').value = report.schoolNames;
    document.getElementById('serviceType').value = report.serviceType;
    
    // المراحل الدراسية
    document.querySelectorAll('input[name="stage"]').forEach(checkbox => {
        checkbox.checked = report.stages.includes(checkbox.value);
    });
    
    // نوع المدرسة
    document.querySelector(`input[name="schoolType"][value="${report.schoolType}"]`).checked = true;
    
    // المنصة
    document.querySelector(`input[name="platform"][value="${report.platform}"]`).checked = true;
    
    // نواتج التعلم
    if (report.learningOutcomes) {
        document.querySelector('input[name="planning_points"]').value = report.learningOutcomes.planning.points || '';
        document.querySelector('input[name="planning_notes"]').value = report.learningOutcomes.planning.notes || '';
        document.querySelector('input[name="execution_points"]').value = report.learningOutcomes.execution.points || '';
        document.querySelector('input[name="execution_notes"]').value = report.learningOutcomes.execution.notes || '';
        document.querySelector('input[name="evaluation_points"]').value = report.learningOutcomes.evaluation.points || '';
        document.querySelector('input[name="evaluation_notes"]').value = report.learningOutcomes.evaluation.notes || '';
    }
    
    // الإمكانات
    if (report.resources) {
        if (report.resources.labs.status) {
            document.querySelector(`input[name="labs"][value="${report.resources.labs.status}"]`).checked = true;
        }
        document.querySelector('input[name="labs_notes"]').value = report.resources.labs.notes || '';
        
        if (report.resources.tech.status) {
            document.querySelector(`input[name="tech"][value="${report.resources.tech.status}"]`).checked = true;
        }
        document.querySelector('input[name="tech_notes"]').value = report.resources.tech.notes || '';
        
        if (report.resources.library.status) {
            document.querySelector(`input[name="library"][value="${report.resources.library.status}"]`).checked = true;
        }
        document.querySelector('input[name="library_notes"]').value = report.resources.library.notes || '';
    }
    
    // الأوقات
    document.getElementById('arrivalTime').value = report.arrivalTime;
    document.getElementById('departureTime').value = report.departureTime;
    
    // المعلومات الإضافية
    document.getElementById('initiatives').value = report.initiatives || '';
    document.getElementById('experiences').value = report.experiences || '';
    document.getElementById('recommendations').value = report.recommendations || '';
    document.getElementById('suggestions').value = report.suggestions || '';
    
    // التمرير للأعلى
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showAlert('تم تحميل البيانات للعرض', 'success');
}

// حذف التقرير
function deleteReport(index) {
    if (confirm('هل أنت متأكد من حذف هذا التقرير؟')) {
        savedReports.splice(index, 1);
        localStorage.setItem('dailyReports', JSON.stringify(savedReports));
        displaySavedData();
        showAlert('تم حذف التقرير بنجاح', 'success');
    }
}

// تصدير إلى Excel
function exportToExcel() {
    if (savedReports.length === 0) {
        showAlert('لا توجد بيانات للتصدير', 'error');
        return;
    }
    
    // إنشاء محتوى CSV
    let csv = '\uFEFF'; // BOM للدعم العربي
    
    // الرؤوس
    csv += 'التاريخ,اليوم,الأسبوع,القطاع,المشرف,المهمة,أسماء المدارس,نوع الخدمة,المرحلة الدراسية,نوع المدرسة,منصة مدرستي,';
    csv += 'نقاط التخطيط,ملاحظات التخطيط,نقاط التنفيذ,ملاحظات التنفيذ,نقاط التقويم,ملاحظات التقويم,';
    csv += 'المعامل,ملاحظات المعامل,التقنيات,ملاحظات التقنيات,المكتبة,ملاحظات المكتبة,';
    csv += 'وقت الحضور,وقت الانصراف,المبادرات,الخبرات,التوصيات,المقترحات\n';
    
    // البيانات
    savedReports.forEach(report => {
        csv += `"${report.date}","${report.dayOfWeek}","${report.week}","${report.sector}","${report.supervisor}","${report.task}",`;
        csv += `"${report.schoolNames}","${report.serviceType}","${report.stages.join(', ')}","${report.schoolType}","${report.platform}",`;
        csv += `"${report.learningOutcomes.planning.points || ''}","${report.learningOutcomes.planning.notes || ''}",`;
        csv += `"${report.learningOutcomes.execution.points || ''}","${report.learningOutcomes.execution.notes || ''}",`;
        csv += `"${report.learningOutcomes.evaluation.points || ''}","${report.learningOutcomes.evaluation.notes || ''}",`;
        csv += `"${report.resources.labs.status || ''}","${report.resources.labs.notes || ''}",`;
        csv += `"${report.resources.tech.status || ''}","${report.resources.tech.notes || ''}",`;
        csv += `"${report.resources.library.status || ''}","${report.resources.library.notes || ''}",`;
        csv += `"${report.arrivalTime}","${report.departureTime}",`;
        csv += `"${report.initiatives || ''}","${report.experiences || ''}","${report.recommendations || ''}","${report.suggestions || '"}"\n`;
    });
    
    // تحميل الملف
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `التقرير_اليومي_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('تم تصدير البيانات إلى Excel بنجاح!', 'success');
}

// تصدير إلى PDF
function exportToPDF() {
    const form = document.getElementById('dailyReportForm');
    
    // التحقق من وجود بيانات في النموذج
    const formData = new FormData(form);
    if (!formData.get('sector') || !formData.get('date')) {
        showAlert('يرجى ملء النموذج أو تحميل تقرير من البيانات المحفوظة', 'error');
        return;
    }
    
    // إخفاء الأزرار مؤقتاً
    const buttons = document.querySelector('.button-group');
    const savedSection = document.querySelector('.saved-data-section');
    buttons.style.display = 'none';
    savedSection.style.display = 'none';
    
    // طباعة الصفحة
    window.print();
    
    // إظهار الأزرار مرة أخرى
    setTimeout(() => {
        buttons.style.display = 'flex';
        savedSection.style.display = 'block';
    }, 1000);
}

// إظهار رسالة تنبيه
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const form = document.getElementById('dailyReportForm');
    form.insertBefore(alertDiv, form.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

// التحقق من صحة البيانات
document.getElementById('dailyReportForm').addEventListener('input', function(e) {
    if (e.target.type === 'number') {
        if (e.target.value < 0) {
            e.target.value = 0;
        } else if (e.target.value > 100) {
            e.target.value = 100;
        }
    }
});
