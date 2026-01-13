/*
 * سكربت نموذج متابعة دعم التميز المدرسي.
 * يقوم هذا الملف بتهيئة القوائم والحقول، جمع البيانات، حفظها محليًا،
 * تصديرها إلى ملف Excel، وطباعة تقرير واحد.
 */

(() => {
  'use strict';

  /**
   * تعريف القوائم الثابتة.
   */
  const weeks = [
    'الأسبوع الأول - ٢٠٢٦/٠١/١٨ إلى ٢٠٢٦/٠١/٢٢',
    'الأسبوع الثاني - ٢٠٢٦/٠١/٢٥ إلى ٢٠٢٦/٠١/٢٩',
    'الأسبوع الثالث - ٢٠٢٦/٠٢/٠٢ إلى ٢٠٢٦/٠٢/٠٦',
    'الأسبوع الرابع - ٢٠٢٦/٠٢/٠٩ إلى ٢٠٢٦/٠٢/١٢',
    'الأسبوع الخامس - ٢٠٢٦/٠٢/١٥ إلى ٢٠٢٦/٠٢/١٩',
    'الأسبوع السادس - ٢٠٢٦/٠٢/٢٢ إلى ٢٠٢٦/٠٢/٢٦',
    'الأسبوع السابع - ٢٠٢٦/٠٣/٠١ إلى ٢٠٢٦/٠٣/٠٥',
    'الأسبوع الثامن - ٢٠٢٦/٠٣/٢٩ إلى ٢٠٢٦/٠٤/٠٢',
    'الأسبوع التاسع - ٢٠٢٦/٠٤/٠٥ إلى ٢٠٢٦/٠٤/٠٩',
    'الأسبوع العاشر - ٢٠٢٦/٠٤/١٢ إلى ٢٠٢٦/٠٤/١٦',
    'الأسبوع الحادي عشر - ٢٠٢٦/٠٤/١٩ إلى ٢٠٢٦/٠٤/٢٣',
    'الأسبوع الثاني عشر - ٢٠٢٦/٠٤/٢٦ إلى ٢٠٢٦/٠٤/٣٠',
    'الأسبوع الثالث عشر - ٢٠٢٦/٠٥/٠٣ إلى ٢٠٢٦/٠٥/٠٧',
    'الأسبوع الرابع عشر - ٢٠٢٦/٠٥/١٠ إلى ٢٠٢٦/٠٥/١٤',
    'الأسبوع الخامس عشر - ٢٠٢٦/٠٥/١٧ إلى ٢٠٢٦/٠٥/٢١',
    'الأسبوع السادس عشر - ٢٠٢٦/٠٥/٣١ إلى ٢٠٢٦/٠٦/٠٤',
    'الأسبوع السابع عشر - ٢٠٢٦/٠٦/٠٧ إلى ٢٠٢٦/٠٦/١١',
    'الأسبوع الثامن عشر - ٢٠٢٦/٠٦/١٤ إلى ٢٠٢٦/٠٦/١٨',
    'الأسبوع التاسع عشر - ٢٠٢٦/٠٦/٢١ إلى ٢٠٢٦/٠٦/٢٥',
    'الأسبوع العشرون - ٢٠٢٦/٠٦/٢٨ إلى ٢٠٢٦/٠٧/٠٢'
  ];

  const days = ['الأحد','الأثنين','الثلاثاء','الأربعاء','الخميس'];

  const missionTypes = [
    'تقديم خدمات دعم تميز مدرسي',
    'مهمة رسمية وتم تسجيلها في نظام حضوري'
  ];

  const sectors = [
    'القطيف',
    'الدمام',
    'الجبيل',
    'الخبر',
    'الخفجي',
    'رأس تنورة',
    'حفر الباطن',
    'القرية العليا',
    'النعيرية',
    'بقيق'
  ];

  // بيانات القطاع: لكل قطاع، قائمة بأسماء المشرفين والمدارس الأساسية والإضافية.
  const sectorData = {
    'الدمام': {
      supervisors: [
        'بندر بن سعيد القحطاني',
        'فهد بن محمد الشهري',
        'فائز بن علي الغامدي',
        'جهاد بن محمد آل طلحة',
        'مبارك بن فهد المرير'
      ],
      assignedSchools: [
        'مدرسة ابن كثير الابتدائية',
        'مدرسة النور المتوسطة',
        'مدرسة الفيصلية الثانوية'
      ],
      additionalSchools: [
        'مجمع منذر بن محمد',
        'مدرسة عبد الله بن عباس'
      ]
    },
    'الخبر': {
      supervisors: ['أحمد بن علي الغامدي', 'سعود بن محمد الدوسري'],
      assignedSchools: ['مدرسة الخبر الابتدائية', 'مدرسة النخبة الثانوية'],
      additionalSchools: ['مدرسة الخبر المتوسطة']
    },
    'القطيف': {
      supervisors: ['محمد بن خالد الزهراني', 'علي بن عبدالله الشمري'],
      assignedSchools: ['مدرسة القطيف الابتدائية'],
      additionalSchools: ['مدرسة سيهات المتوسطة']
    },
    'رأس تنورة': {
      supervisors: ['سلمان بن ناصر القحطاني'],
      assignedSchools: ['مدرسة رأس تنورة الثانوية'],
      additionalSchools: ['مدرسة رحيمة الابتدائية']
    },
    'الجبيل': {
      supervisors: ['خالد بن عبدالله البوعينين'],
      assignedSchools: ['مدرسة الجبيل الابتدائية'],
      additionalSchools: ['مدرسة الجبيل المتوسطة']
    },
    'بقيق': {
      supervisors: ['ناصر بن محمد الدوسري'],
      assignedSchools: ['مدرسة بقيق الابتدائية'],
      additionalSchools: ['مدرسة بقيق الثانوية']
    },
    'النعيرية': {
      supervisors: ['حمد بن علي الخالدي'],
      assignedSchools: ['مدرسة النعيرية الابتدائية'],
      additionalSchools: ['مدرسة النعيرية الثانوية']
    },
    'القرية العليا': {
      supervisors: ['عبدالله بن راشد العتيبي'],
      assignedSchools: ['مدرسة القرية العليا الابتدائية'],
      additionalSchools: ['مدرسة القرية العليا المتوسطة']
    },
    'الخفجي': {
      supervisors: ['علي بن محمد القحطاني'],
      assignedSchools: ['مدرسة الخفجي الابتدائية'],
      additionalSchools: ['مدرسة الخفجي الثانوية']
    },
    'حفر الباطن': {
      supervisors: ['فهد بن عبدالعزيز السبيعي'],
      assignedSchools: ['مدرسة حفر الباطن الابتدائية'],
      additionalSchools: ['مدرسة حفر الباطن المتوسطة']
    }
  };

  const supportDomains = [
    'التدريس',
    'نواتج التعلم',
    'التوجيه الطلابي',
    'النشاط الطلابي',
    'غير ذلك'
  ];

  const domainActions = {
    teaching: [
      'زيارة صفية بالتنسيق مع إدارة المدرسة واللجان المعنية بقصد التطوير أو قياس الأثر',
      'تقديم تغذية راجعة لمعلم أو أكثر',
      'مراجعة خطة الدرس أو الخطة الفصلية',
      'دعم توظيف أدوات التقويم (أدائية – تحريرية – شفهية)',
      'دعم وتحفيز تفعيل مجتمعات التعلم المهنية بين المعلمين',
      'إعداد أو مراجعة أدوات تقييم أداء الطلاب',
      'تقديم استشارات لدعم التعليم الالكتروني',
      'تقديم التطوير المهني المستمر لمنسوبي المدرسة في مجال التدريس',
      'غير ذلك'
    ],
    learning: [
      'تحليل نتائج اختبارات المدرسة أو الاختبارات الوطنية المختلفة أو دعم اللجنة المختصة بالمدرسة في ذلك',
      'دعم ومشاركة اللجان المختصة بالمدرسة في معالجة مواطن الضعف واستثمار مواطن القوة',
      'دعم اللجنة المختصة بالمدرسة في إعداد خطة علاجية أو إثرائية',
      'دعم تكييف التعليم وفق الفروق الفردية',
      'متابعة مؤشرات التحصيل عبر المنصات وغيرها',
      'تقديم التطوير المهني المستمر لمنسوبي المدرسة في مجال نواتج التعلم',
      'غير ذلك'
    ],
    guidance: [
      'لقاء مع الموجه الطلابي أو لجنة التوجيه',
      'دعم الموجه الطلابي أو اللجنة المختصة في معالجة حالات الطلاب',
      'دعم قيم الانضباط والسلوك',
      'دعم خطة التوجيه الطلابي السنوية',
      'التشجيع على تبني المبادرات في الشراكة المجتمعية',
      'دعم اللجنة المختصة في تعزيز التطور الصحي والنفسي والاجتماعي للطلبة',
      'تقديم التطوير المهني المستمر لمنسوبي المدرسة في مجال التوجيه الطلابي',
      'غير ذلك'
    ],
    activity: [
      'المشاركة في إعداد خطة النشاط',
      'حضور أو دعم مناشط صفية أو غير صفية',
      'مواءمة الأنشطة مع القيم والمهارات المستهدفة',
      'دعم اللجنة المختصة بالنشاط المدرسي',
      'إبراز إنجاز طلابي متميز',
      'المشاركة في نشر ثقافة العمل التطوعي لمنسوبي المدرسة',
      'تقديم التطوير المهني المستمر لمنسوبي المدرسة في مجال النشاط الطلابي',
      'غير ذلك'
    ]
  };

  const empowermentActions = [
    'اتخاذ القرار الذاتي',
    'تحليل البيانات',
    'المساءلة الذاتية',
    'المبادرة المدرسية',
    'تطوير الخطط المؤسسية',
    'تبادل الخبرات داخليًا',
    'لازالت إدارة المدرسة ولجانها في طور البناء',
    'غير ذلك'
  ];

  /**
   * تعبئة قائمة منسدلة بالقيم المعطاة.
   * @param {string} selectId معرف العنصر select
   * @param {string[]} items مصفوفة العناصر
   */
  function populateSelect(selectId, items) {
    const select = document.getElementById(selectId);
    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      select.appendChild(option);
    });
  }

  /**
   * تعبئة مجموعة من مربعات الاختيار بالقيم المعطاة.
   * @param {string} containerId معرف حاوية checkboxes
   * @param {string[]} items مصفوفة العناصر
   */
  function populateCheckboxGroup(containerId, items) {
    const container = document.getElementById(containerId);
    items.forEach(item => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = item;
      label.appendChild(checkbox);
      // نص الخيار
      const span = document.createElement('span');
      span.textContent = item;
      span.style.marginRight = '4px';
      label.appendChild(span);
      container.appendChild(label);
    });
  }

  /**
   * تحديث قوائم المشرفين والمدارس بناءً على القطاع.
   */
  function updateSectorData() {
    const sector = document.getElementById('sector').value;
    const supervisorSelect = document.getElementById('supervisor');
    const assignedSelect = document.getElementById('assignedSchool');
    const additionalSelect = document.getElementById('additionalSchool');
    // إعادة تعيين القوائم
    supervisorSelect.innerHTML = '<option value="">اختر المشرف/ة</option>';
    assignedSelect.innerHTML = '<option value="">اختر المدرسة</option>';
    additionalSelect.innerHTML = '<option value="">اختر المدرسة الإضافية</option>';
    const data = sectorData[sector];
    if (!data) return;
    data.supervisors.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      supervisorSelect.appendChild(opt);
    });
    data.assignedSchools.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      assignedSelect.appendChild(opt);
    });
    data.additionalSchools.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      additionalSelect.appendChild(opt);
    });
  }

  /**
   * الحصول على قيم مربعات الاختيار المحددة في حاوية معينة.
   * @param {string} containerId
   * @returns {string[]}
   */
  function getCheckedValues(containerId) {
    const container = document.getElementById(containerId);
    const values = [];
    container.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      values.push(cb.value);
    });
    return values;
  }

  /**
   * إظهار أو إخفاء خانة سبب عدم التفعيل.
   */
  function toggleMadrasatiReason() {
    const select = document.getElementById('madrasati');
    const reasonLabel = document.getElementById('madrasatiReasonLabel');
    if (select.value === 'لا') {
      reasonLabel.style.display = 'block';
    } else {
      reasonLabel.style.display = 'none';
    }
  }

  /**
   * جمع بيانات النموذج وتحويلها إلى كائن.
   */
  function collectFormData() {
    const data = {};
    data.date = document.getElementById('date').value;
    data.day = document.getElementById('day').value;
    data.week = document.getElementById('week').value;
    data.mission = document.getElementById('mission').value;
    data.sector = document.getElementById('sector').value;
    data.supervisor = document.getElementById('supervisor').value;
    data.gender = document.getElementById('gender').value;
    data.educationStage = document.getElementById('educationStage').value;
    data.serviceType = document.getElementById('serviceType').value;
    data.schoolTargetType = document.getElementById('schoolTargetType').value;
    data.assignedSchool = document.getElementById('assignedSchool').value;
    data.additionalSchool = document.getElementById('additionalSchool').value;
    data.madrasati = document.getElementById('madrasati').value;
    data.madrasatiReason = data.madrasati === 'لا' ? document.getElementById('madrasatiReason').value : '';
    data.attendanceTime = document.getElementById('attendanceTime').value;
    data.departureTime = document.getElementById('departureTime').value;
    data.supportDomains = getCheckedValues('supportDomains');
    // إجراءات المجالات
    data.teachingActions = getCheckedValues('teachingActions');
    const teachOther = document.getElementById('teachingOther').value.trim();
    if (teachOther) data.teachingActions.push('أخرى: ' + teachOther);
    data.teachingCount = document.getElementById('teachingCount').value;
    data.learningActions = getCheckedValues('learningActions');
    const learningOther = document.getElementById('learningOther').value.trim();
    if (learningOther) data.learningActions.push('أخرى: ' + learningOther);
    data.learningCount = document.getElementById('learningCount').value;
    data.guidanceActions = getCheckedValues('guidanceActions');
    const guidanceOther = document.getElementById('guidanceOther').value.trim();
    if (guidanceOther) data.guidanceActions.push('أخرى: ' + guidanceOther);
    data.guidanceCount = document.getElementById('guidanceCount').value;
    data.activityActions = getCheckedValues('activityActions');
    const activityOther = document.getElementById('activityOther').value.trim();
    if (activityOther) data.activityActions.push('أخرى: ' + activityOther);
    data.activityCount = document.getElementById('activityCount').value;
    data.empowermentActions = getCheckedValues('empowermentActions');
    data.participationLevel = document.getElementById('participationLevel').value;
    data.experiences = document.getElementById('experiences').value;
    data.initiatives = document.getElementById('initiatives').value;
    data.challenges = document.getElementById('challenges').value;
    data.remedies = document.getElementById('remedies').value;
    data.recommendations = document.getElementById('recommendations').value;
    data.proposals = document.getElementById('proposals').value;
    return data;
  }

  /**
   * حفظ سجل النموذج في localStorage.
   */
  function saveRecord() {
    const record = collectFormData();
    const records = JSON.parse(localStorage.getItem('supportRecords') || '[]');
    records.push(record);
    localStorage.setItem('supportRecords', JSON.stringify(records));
    alert('تم حفظ التقرير بنجاح.');
    resetForm();
  }

  /**
   * إعادة تعيين النموذج.
   */
  function resetForm() {
    document.getElementById('date').value = '';
    document.getElementById('day').value = '';
    document.getElementById('week').value = '';
    document.getElementById('mission').value = '';
    document.getElementById('sector').value = '';
    updateSectorData(); // سيعيد تعيين القوائم التابعة
    document.getElementById('gender').value = '';
    document.getElementById('educationStage').value = '';
    document.getElementById('serviceType').value = '';
    document.getElementById('schoolTargetType').value = '';
    document.getElementById('madrasati').value = '';
    document.getElementById('madrasatiReason').value = '';
    toggleMadrasatiReason();
    document.getElementById('attendanceTime').value = '';
    document.getElementById('departureTime').value = '';
    // إلغاء تحديد جميع مربعات الاختيار
    document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(cb => cb.checked = false);
    // مسح حقول أخرى والنصوص
    ['teachingOther','learningOther','guidanceOther','activityOther'].forEach(id => document.getElementById(id).value = '');
    ['teachingCount','learningCount','guidanceCount','activityCount'].forEach(id => document.getElementById(id).value = 0);
    document.getElementById('participationLevel').value = '';
    document.getElementById('experiences').value = '';
    document.getElementById('initiatives').value = '';
    document.getElementById('challenges').value = '';
    document.getElementById('remedies').value = '';
    document.getElementById('recommendations').value = '';
    document.getElementById('proposals').value = '';
  }

  /**
   * تصدير السجلات إلى ملف Excel.
   */
  function exportToExcel() {
    const records = JSON.parse(localStorage.getItem('supportRecords') || '[]');
    if (records.length === 0) {
      alert('لا توجد تقارير محفوظة للتصدير.');
      return;
    }
    // إعداد رأس الجدول
    const headers = [
      'التاريخ','اليوم','الأسبوع','المهمة','القطاع','المشرف/ة','النوع','المرحلة الدراسية',
      'نوع الخدمة','نوع المدرسة','المدرسة','المدرسة الإضافية','تفعيل منصة مدرستي','سبب عدم التفعيل',
      'وقت الحضور','وقت الانصراف','مجالات الدعم','إجراءات التدريس','عدد إجراءات التدريس',
      'إجراءات نواتج التعلم','عدد إجراءات نواتج التعلم','إجراءات التوجيه الطلابي','عدد إجراءات التوجيه الطلابي',
      'إجراءات النشاط الطلابي','عدد إجراءات النشاط الطلابي','تمكين المدرسة','مستوى مشاركة الإدارة',
      'الخبرات','المبادرات','التحديات','المعالجات','التوصيات','المقترحات'
    ];
    const aoa = [headers];
    records.forEach(rec => {
      const row = [];
      row.push(rec.date);
      row.push(rec.day);
      row.push(rec.week);
      row.push(rec.mission);
      row.push(rec.sector);
      row.push(rec.supervisor);
      row.push(rec.gender);
      row.push(rec.educationStage);
      row.push(rec.serviceType);
      row.push(rec.schoolTargetType);
      row.push(rec.assignedSchool);
      row.push(rec.additionalSchool);
      row.push(rec.madrasati);
      row.push(rec.madrasatiReason);
      row.push(rec.attendanceTime);
      row.push(rec.departureTime);
      row.push(rec.supportDomains.join('; '));
      row.push(rec.teachingActions.join('; '));
      row.push(rec.teachingCount);
      row.push(rec.learningActions.join('; '));
      row.push(rec.learningCount);
      row.push(rec.guidanceActions.join('; '));
      row.push(rec.guidanceCount);
      row.push(rec.activityActions.join('; '));
      row.push(rec.activityCount);
      row.push(rec.empowermentActions.join('; '));
      row.push(rec.participationLevel);
      row.push(rec.experiences);
      row.push(rec.initiatives);
      row.push(rec.challenges);
      row.push(rec.remedies);
      row.push(rec.recommendations);
      row.push(rec.proposals);
      aoa.push(row);
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(wb, ws, 'التقارير');
    XLSX.writeFile(wb, 'support_records.xlsx');
  }

  /**
   * إنشاء تقرير للطباعة.
   */
  function printReport() {
    const rec = collectFormData();
    let html = '';
    html += '<html dir="rtl"><head><title>تقرير متابعة دعم التميز</title>';
    html += '<style>body{font-family:Tajawal,Arial,sans-serif;direction:rtl;padding:20px;}';
    html += 'h2{color:#014446;} table{width:100%;border-collapse:collapse;margin-top:10px;}';
    html += 'th,td{border:1px solid #ccc;padding:4px 6px;text-align:center;} th{background:#eaf4f3;}</style>';
    html += '</head><body>';
    html += '<h2>تقرير متابعة دعم التميز</h2>';
    // معلومات أساسية
    function addLine(label, value) {
      if (value && value !== '') {
        html += '<p><strong>' + label + ':</strong> ' + value + '</p>';
      }
    }
    addLine('التاريخ', rec.date);
    addLine('اليوم', rec.day);
    addLine('الأسبوع', rec.week);
    addLine('المهمة', rec.mission);
    addLine('القطاع', rec.sector);
    addLine('المشرف/ة', rec.supervisor);
    addLine('النوع', rec.gender);
    addLine('المرحلة الدراسية', rec.educationStage);
    addLine('نوع الخدمة', rec.serviceType);
    addLine('نوع المدرسة', rec.schoolTargetType);
    addLine('اسم المدرسة', rec.assignedSchool);
    addLine('اسم المدرسة الإضافية', rec.additionalSchool);
    addLine('تفعيل منصة مدرستي', rec.madrasati);
    if (rec.madrasati === 'لا') {
      addLine('سبب عدم التفعيل', rec.madrasatiReason);
    }
    addLine('وقت الحضور', rec.attendanceTime);
    addLine('وقت الانصراف', rec.departureTime);
    // مجالات الدعم
    if (rec.supportDomains.length) {
      addLine('مجالات الدعم الرئيسة', rec.supportDomains.join(', '));
    }
    // جدول الإجراءات
    html += '<h3>إجراءات مجالات الدعم</h3>';
    html += '<table><thead><tr><th>المجال</th><th>الإجراءات</th><th>عدد الإجراءات</th></tr></thead><tbody>';
    html += '<tr><td>التدريس</td><td>' + rec.teachingActions.join('<br>') + '</td><td>' + rec.teachingCount + '</td></tr>';
    html += '<tr><td>نواتج التعلم</td><td>' + rec.learningActions.join('<br>') + '</td><td>' + rec.learningCount + '</td></tr>';
    html += '<tr><td>التوجيه الطلابي</td><td>' + rec.guidanceActions.join('<br>') + '</td><td>' + rec.guidanceCount + '</td></tr>';
    html += '<tr><td>النشاط الطلابي</td><td>' + rec.activityActions.join('<br>') + '</td><td>' + rec.activityCount + '</td></tr>';
    html += '</tbody></table>';
    // تمكين المدرسة
    if (rec.empowermentActions.length) {
      addLine('تمكين المدرسة', rec.empowermentActions.join(', '));
    }
    addLine('مستوى مشاركة الإدارة', rec.participationLevel);
    addLine('الخبرات الإشرافية', rec.experiences);
    addLine('المبادرات', rec.initiatives);
    addLine('أبرز التحديات', rec.challenges);
    addLine('أبرز المعالجات', rec.remedies);
    addLine('التوصيات', rec.recommendations);
    addLine('المقترحات', rec.proposals);
    html += '</body></html>';
    const win = window.open('', '', 'width=900,height=700');
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  /**
   * تهيئة النموذج عند تحميل الصفحة.
   */
  function init() {
    // تعبئة القوائم الثابتة
    populateSelect('week', weeks);
    populateSelect('day', days);
    populateSelect('mission', missionTypes);
    populateSelect('sector', sectors);
    // مجالات الدعم
    populateCheckboxGroup('supportDomains', supportDomains);
    // إجراءات المجالات
    populateCheckboxGroup('teachingActions', domainActions.teaching);
    populateCheckboxGroup('learningActions', domainActions.learning);
    populateCheckboxGroup('guidanceActions', domainActions.guidance);
    populateCheckboxGroup('activityActions', domainActions.activity);
    // تمكين المدرسة
    populateCheckboxGroup('empowermentActions', empowermentActions);
    // تحديث القوائم التابعة عند تغيير القطاع
    document.getElementById('sector').addEventListener('change', updateSectorData);
    // إظهار حقل سبب عدم التفعيل
    document.getElementById('madrasati').addEventListener('change', toggleMadrasatiReason);
    // أزرار الأحداث
    document.getElementById('saveButton').addEventListener('click', saveRecord);
    document.getElementById('exportButton').addEventListener('click', exportToExcel);
    document.getElementById('printButton').addEventListener('click', printReport);
  }

  // تنفيذ التهيئة بعد اكتمال تحميل DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();