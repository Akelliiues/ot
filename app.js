/* ==========================================================================
   OT Management System - สำนักงานสาธารณสุขอำเภอตาลสุม
   Logic: Automatic Weekend & Thai Public Holiday Detection, Thai Numerals,
          Fixed Anchor Today + 3 Months Future Bound (Always Returnable)
   ========================================================================== */

function toThaiNumerals(val) {
    if (val === null || val === undefined || val === '') return '';
    const str = val.toString();
    const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
    return str.replace(/[0-9]/g, char => thaiDigits[char]);
}

function formatDottedCount(num) {
    const valStr = (num > 0) ? toThaiNumerals(num) : '-';
    return `.......${valStr}.......`;
}

// Master Default Staff List matching official PDF document 100%
const defaultStaffList = [
    {
        id: 1,
        name: "นางสาวพัชรี ภูธร",
        position: "นักวิชาการสาธารณสุขชำนาญการ",
        type: "GOVT",
        typeText: "ข้าราชการ",
        dutyName: "งานพัฒนายุทธศาสตร์สาธารณสุข",
        dutyReason: "วิเคราะห์ข้อมูลงานยุทธศาสตร์ แผนปฏิบัติการ ติดตามควบคุมกำกับการดำเนินงาน รพ.สต./ข้อมูลพัฒนา รพ.สต. รูปแบบบริการฯ"
    },
    {
        id: 2,
        name: "นางสาวภัทรจิตร คำน้อย",
        position: "จพ.สาธารณสุขชำนาญงาน",
        type: "GOVT",
        typeText: "ข้าราชการ",
        dutyName: "งานสุขภาพจิตยาเสพติดและงานสุขภาพภาคประชาชน",
        dutyReason: "วิเคราะห์ข้อมูลงานสุขภาพจิตและยาเสพติด ติดตามงานสาธารณสุขภาคประชาชน"
    },
    {
        id: 3,
        name: "นางสาวศิริวิมล ทองก่ำ",
        position: "นักวิชาการสาธารณสุขชำนาญการ",
        type: "GOVT",
        typeText: "ข้าราชการ",
        dutyName: "งานอนามัยสิ่งแวดล้อมและงานคุ้มครองผู้บริโภค",
        dutyReason: "วิเคราะห์ข้อมูลงานคุ้มครองผู้บริโภค จัดทำรายงานคุ้มครองผู้บริโภคด้านผลิตภัณฑ์สุขภาพฯ"
    },
    {
        id: 4,
        name: "นางสาวจันทร์ทิพย์ เชื้อชม",
        position: "นักวิชาการสาธารณสุข",
        type: "MOH",
        typeText: "พนักงานกระทรวงสาธารณสุข",
        dutyName: "งานควบคุมโรคติดต่อและโรคไม่ติดต่อ",
        dutyReason: "วิเคราะห์ข้อมูลและรายงานโรคติดต่อและไม่ติดต่อ"
    },
    {
        id: 5,
        name: "นายสกุลทิพย์ พิมกรรณ์",
        position: "นักวิชาการสาธารณสุข",
        type: "MOH",
        typeText: "พนักงานกระทรวงสาธารณสุข",
        dutyName: "งานส่งเสริมสุขภาพ",
        dutyReason: "วิเคราะห์ข้อมูล งานอนามัยแม่และเด็กฯ ติดตามกำกับตัวชี้วัด Ranging"
    },
    {
        id: 6,
        name: "นางสาววันเพ็ญ จันทาโย",
        position: "จพ.การเงินและบัญชี",
        type: "STATE",
        typeText: "พนักงานราชการ",
        dutyName: "งานบริหารทั่วไป งานการเงิน",
        dutyReason: "รายงานการเงิน GL บัญชี ๔๐๔ , ๔๐๗"
    },
    {
        id: 7,
        name: "นายบุญธรรม พันธ์ใหญ่",
        position: "นักวิชาการคอมพิวเตอร์ปฏิบัติการ",
        type: "GOVT",
        typeText: "ข้าราชการ",
        dutyName: "งานเทคโนโลยีสารสนเทศ",
        dutyReason: "งานพัฒนาข้อมูลและสารสนเทศ ระบบต่างๆที่ใช้ได้แก่ J-HCIS ,ฐานข้อมูล HDC ,หมอพร้อม ,Healthy ID ,Provider ID"
    }
];

// Official Thai Public Holidays Dictionary
const thaiPublicHolidays = {
    "2026-01-01": "วันขึ้นปีใหม่",
    "2026-03-03": "วันมาฆบูชา",
    "2026-04-06": "วันพระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช และวันที่ระลึกมหาจักรีบรมราชวงศ์",
    "2026-04-13": "วันสงกรานต์",
    "2026-04-14": "วันสงกรานต์",
    "2026-04-15": "วันสงกรานต์",
    "2026-05-04": "วันฉัตรมงคล",
    "2026-05-31": "วันวิสาขบูชา",
    "2026-06-03": "วันเฉลิมพระชนมพรรษาสมเด็จพระนางเจ้าฯ พระบรมราชินี",
    "2026-07-28": "วันเฉลิมพระชนมพรรษาพระบาทสมเด็จพระเจ้าอยู่หัว",
    "2026-07-29": "วันอาสาฬหบูชา",
    "2026-07-30": "วันเข้าพรรษา",
    "2026-08-12": "วันแม่แห่งชาติ / วันเฉลิมพระชนมพรรษาสมเด็จพระบรมราชชนนีพันปีหลวง",
    "2026-10-13": "วันคล้ายวันสวรรคตพระบาทสมเด็จพระบรมชนกาธิเบศร มหาภูมิพลอดุลยเดชมหาราช บรมนาถบพิตร",
    "2026-10-23": "วันปิยมหาราช",
    "2026-12-05": "วันพ่อแห่งชาติ",
    "2026-12-10": "วันรัฐธรรมนูญ",
    "2026-12-31": "วันสิ้นปี"
};

// Thai Day Names for Index 0 (Sunday) to 6 (Saturday)
const daysOfWeekThai = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

// Sample OT Matrix Data across multiple months

let otMatrixStorage = {
    "2026-07": {
        1: { 3: 2, 6: 2, 9: 2, 10: 2, 13: 2, 14: 2, 20: 2, 21: 2 },
        2: { 1: 2, 2: 2, 3: 2, 6: 2, 7: 2, 9: 2, 15: 2, 27: 2 },
        3: { 2: 2, 3: 2, 6: 2, 8: 2, 17: 2, 22: 2, 23: 2, 27: 2 },
        4: { 1: 2, 3: 2, 6: 2, 7: 2, 8: 2, 9: 2, 15: 2, 31: 2 },
        5: { 6: 2, 7: 2, 9: 2, 10: 2, 13: 2, 14: 2, 16: 2 },
        6: { 2: 2, 4: 2, 7: 2, 9: 2, 11: 2, 14: 2, 16: 2, 18: 2, 21: 2, 23: 2, 25: 4, 26: 4, 28: 4, 29: 4 },
        7: { 2: 2, 3: 2, 7: 2, 8: 2, 9: 2, 20: 2, 31: 2 }
    },
    "2026-08": {
        1: { 4: 2, 5: 2, 11: 2, 12: 4, 18: 2, 19: 2 },
        2: { 3: 2, 6: 2, 10: 2, 12: 4, 17: 2, 24: 2 },
        3: { 4: 2, 7: 2, 12: 4, 14: 2, 20: 2, 21: 2 },
        4: { 5: 2, 6: 2, 11: 2, 12: 4, 19: 2, 25: 2 },
        5: { 3: 2, 7: 2, 10: 2, 12: 4, 18: 2, 26: 2 },
        6: { 4: 2, 6: 2, 12: 4, 15: 4, 22: 4, 23: 4 },
        7: { 5: 2, 7: 2, 11: 2, 12: 4, 21: 2, 28: 2 }
    },
    "2026-09": {
        1: { 1: 2, 2: 2, 8: 2, 15: 2, 22: 2, 29: 2 },
        2: { 2: 2, 3: 2, 9: 2, 16: 2, 23: 2, 30: 2 },
        3: { 3: 2, 4: 2, 10: 2, 17: 2, 24: 2 },
        4: { 4: 2, 7: 2, 11: 2, 18: 2, 25: 2 },
        5: { 1: 2, 8: 2, 14: 2, 21: 2, 28: 2 },
        6: { 5: 4, 6: 4, 12: 4, 13: 4, 19: 4, 20: 4 },
        7: { 2: 2, 9: 2, 15: 2, 22: 2, 29: 2 }
    }
};

const monthNamesThai = {
    "01": "มกราคม", "02": "กุมภาพันธ์", "03": "มีนาคม", "04": "เมษายน",
    "05": "พฤษภาคม", "06": "มิถุนายน", "07": "กรกฎาคม", "08": "สิงหาคม",
    "09": "กันยายน", "10": "ตุลาคม", "11": "พฤศจิกายน", "12": "ธันวาคม"
};

class OTApp {
    constructor() {
        this.year = 2026;
        this.month = 7;
        this.currentMonthKey = "2026-07";
        this.selectedCertifierId = 1;

        // Initialize Staff Master List with Guaranteed 7 Default Staff
        const savedStaff = localStorage.getItem('ot_staff_list');
        if (savedStaff) {
            try {
                const parsed = JSON.parse(savedStaff);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    this.staffList = parsed;
                } else {
                    this.staffList = JSON.parse(JSON.stringify(defaultStaffList));
                    localStorage.setItem('ot_staff_list', JSON.stringify(this.staffList));
                }
            } catch (e) {
                this.staffList = JSON.parse(JSON.stringify(defaultStaffList));
                localStorage.setItem('ot_staff_list', JSON.stringify(this.staffList));
            }
        } else {
            this.staffList = JSON.parse(JSON.stringify(defaultStaffList));
            localStorage.setItem('ot_staff_list', JSON.stringify(this.staffList));
        }

        this.populateMonthOptions();
        this.initMonthSelector();
        this.initTheme();
        this.initTabs();
        this.loadMonthData();
        this.checkAuth();
    }

    // Authentication Checks & Handlers
    checkAuth() {
        const isLoggedIn = sessionStorage.getItem('ot_logged_in') === 'true';
        const loginOverlay = document.getElementById('loginOverlay');
        const logoutBtn = document.getElementById('logoutBtn');

        if (isLoggedIn) {
            if (loginOverlay) loginOverlay.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-flex';
        } else {
            if (loginOverlay) loginOverlay.style.display = 'flex';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }

    handleLogin(e) {
        if (e) e.preventDefault();
        const usernameInput = document.getElementById('loginUsername');
        const passwordInput = document.getElementById('loginPassword');
        const errorMsg = document.getElementById('loginError');

        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        if (username === 'ssotansum' && password === '00325') {
            sessionStorage.setItem('ot_logged_in', 'true');
            if (errorMsg) errorMsg.style.display = 'none';
            this.checkAuth();
        } else {
            if (errorMsg) {
                errorMsg.innerText = '❌ ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
                errorMsg.style.display = 'block';
            }
        }
    }

    handleLogout() {
        if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
            sessionStorage.removeItem('ot_logged_in');
            const usernameInput = document.getElementById('loginUsername');
            const passwordInput = document.getElementById('loginPassword');
            if (usernameInput) usernameInput.value = '';
            if (passwordInput) passwordInput.value = '';
            this.checkAuth();
        }
    }

    togglePasswordVisibility() {
        const pwdInput = document.getElementById('loginPassword');
        if (!pwdInput) return;
        if (pwdInput.type === 'password') {
            pwdInput.type = 'text';
        } else {
            pwdInput.type = 'password';
        }
    }

    redirectToMainSite() {
        window.location.href = 'https://www.ssotansum.com';
    }

    resetDefaultStaff() {
        if (confirm('คุณต้องการรีเซ็ตรายชื่อและตำแหน่งกลับเป็นข้อมูลตั้งต้นเจ้าหน้าที่ ๗ ท่านตามเอกสารราชการใช่หรือไม่?')) {
            this.staffList = JSON.parse(JSON.stringify(defaultStaffList));
            localStorage.setItem('ot_staff_list', JSON.stringify(this.staffList));
            this.renderStaffList();
            this.renderPlanMatrix();
            this.renderSummaryTable();
            this.renderMemoDoc();
            this.renderReportDoc();
            this.initCertifierSelect();
            alert('คืนค่ารายชื่อและตำแหน่งตั้งต้น ๗ ท่านเรียบร้อยแล้ว!');
        }
    }

    // Populate Single Main Header Month Selector
    populateMonthOptions() {
        const baseYear = 2026;
        const baseMonth = 7;

        // Parse current selected month
        const [selYear, selMonth] = this.currentMonthKey.split('-').map(Number);

        // Upper Bound is max(Base + 3 Months, Selected Month + 3 Months)
        const baseFutureDate = new Date(baseYear, baseMonth - 1 + 3, 1);
        const selFutureDate = new Date(selYear, selMonth - 1 + 3, 1);
        const maxFutureDate = (baseFutureDate > selFutureDate) ? baseFutureDate : selFutureDate;

        // Lower Bound is min(Base - 12 Months, Selected Month - 3 Months)
        const basePastDate = new Date(baseYear, baseMonth - 1 - 12, 1);
        const selPastDate = new Date(selYear, selMonth - 1 - 3, 1);
        const minPastDate = (basePastDate < selPastDate) ? basePastDate : selPastDate;

        const months = [];

        // Iterate backwards from newest date to oldest date
        let d = new Date(maxFutureDate);
        while (d >= minPastDate) {
            const y = d.getFullYear();
            const m = d.getMonth() + 1;
            const mStr = String(m).padStart(2, '0');
            const key = `${y}-${mStr}`;
            const label = `${monthNamesThai[mStr]} ${toThaiNumerals(y + 543)}`;
            months.push({ key, label });

            d.setMonth(d.getMonth() - 1);
        }

        const el = document.getElementById('monthSelect');
        if (el) {
            let html = '';
            months.forEach(m => {
                const sel = m.key === this.currentMonthKey ? 'selected' : '';
                html += `<option value="${m.key}" ${sel}>${m.label}</option>`;
            });
            el.innerHTML = html;
        }
    }

    // Change Month from Main Header Dropdown
    changeMonthFromTab(monthKey) {
        this.currentMonthKey = monthKey;
        this.populateMonthOptions();
        this.loadMonthData();
    }

    loadMonthData() {
        const [yStr, mStr] = this.currentMonthKey.split('-');
        this.year = parseInt(yStr);
        this.month = parseInt(mStr);
        this.daysInMonth = new Date(this.year, this.month, 0).getDate();

        const monthName = monthNamesThai[mStr];
        const yearThai = toThaiNumerals(this.year + 543);
        const fullMonthText = `${monthName} พ.ศ. ${yearThai}`;

        // Sync main month selector
        const topSel = document.getElementById('monthSelect');
        if (topSel) topSel.value = this.currentMonthKey;

        document.querySelectorAll('.current-month-text').forEach(el => {
            el.innerText = fullMonthText;
        });

        if (!otMatrixStorage[this.currentMonthKey]) {
            otMatrixStorage[this.currentMonthKey] = {};
        }

        this.renderCalendarHeader();
        this.renderPlanMatrix();
        this.initDailyPicker();
        this.renderDailyLog(1);
        this.renderSummaryTable();
        this.initCertifierSelect();
        this.renderMemoDoc();
        this.renderReportDoc();
        this.renderStaffList();
        this.updateDocumentTitle();
    }

    // Dynamic Document Title & Dynamic Print Page Orientation (Landscape vs Portrait)
    updateDocumentTitle() {
        const activeTab = document.querySelector('.tab-btn.active');
        const tabId = activeTab ? activeTab.getAttribute('data-tab') : 'tab-plan';
        const mStr = String(this.month).padStart(2, '0');
        const monthName = monthNamesThai[mStr];
        const yearThai = toThaiNumerals(this.year + 543);

        let tabPrefix = "๑_แผนการปฏิบัติงานOT";
        let isLandscape = false;

        if (tabId === 'tab-plan') {
            tabPrefix = "๑_แผนการปฏิบัติงานOT";
            isLandscape = true;
        } else if (tabId === 'tab-daily') {
            const dateSelect = document.getElementById('dailyDateSelect');
            const dayVal = dateSelect ? dateSelect.value : 1;
            tabPrefix = `๒_บัญชีลงเวลารายวัน_วันที่${toThaiNumerals(dayVal)}`;
            isLandscape = false;
        } else if (tabId === 'tab-summary') {
            tabPrefix = "๓_หลักฐานการจ่ายเงินOT";
            isLandscape = true;
        } else if (tabId === 'tab-memo') {
            tabPrefix = "๔_บันทึกข้อความขออนุมัติ";
            isLandscape = false;
        } else if (tabId === 'tab-report') {
            tabPrefix = "๕_รายงานผลการปฏิบัติงาน_เอกสาร๔";
            isLandscape = false;
        } else if (tabId === 'tab-staff') {
            tabPrefix = "๖_ข้อมูลบุคลากร";
            isLandscape = false;
        }

        document.title = `${tabPrefix}_${monthName}_${yearThai}_สสอ.ตาลสุม`;

        // Inject dynamic @page print style for exact page orientation (Landscape vs Portrait)
        let printStyleEl = document.getElementById('dynamic-print-style');
        if (!printStyleEl) {
            printStyleEl = document.createElement('style');
            printStyleEl.id = 'dynamic-print-style';
            document.head.appendChild(printStyleEl);
        }

        if (isLandscape) {
            printStyleEl.innerHTML = `
                @media print {
                    @page {
                        size: A4 landscape !important;
                        margin: 0.8cm 0.8cm 0.8cm 0.8cm !important;
                    }
                }
            `;
        } else {
            printStyleEl.innerHTML = `
                @media print {
                    @page {
                        size: A4 portrait !important;
                        margin-top: 1.8cm !important;
                        margin-bottom: 1.5cm !important;
                        margin-left: 2.5cm !important;
                        margin-right: 2.0cm !important;
                    }
                }
            `;
        }

    }

    initMonthSelector() {
        const monthSelect = document.getElementById('monthSelect');
        if (monthSelect) {
            monthSelect.addEventListener('change', (e) => {
                this.changeMonthFromTab(e.target.value);
            });
        }
    }

    getHolidayInfo(day) {
        const dateObj = new Date(this.year, this.month - 1, day);
        const dayOfWeek = dateObj.getDay();
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

        const mStr = String(this.month).padStart(2, '0');
        const dStr = String(day).padStart(2, '0');
        const dateKey = `${this.year}-${mStr}-${dStr}`;

        const publicHolidayName = thaiPublicHolidays[dateKey];
        const isPublicHoliday = !!publicHolidayName;

        return {
            isHoliday: isWeekend || isPublicHoliday,
            isWeekend: isWeekend,
            isPublicHoliday: isPublicHoliday,
            name: publicHolidayName || (isWeekend ? (dayOfWeek === 0 ? 'วันอาทิตย์' : 'วันเสาร์') : 'วันปกติ')
        };
    }

    initTheme() {
        const toggleSwitch = document.getElementById('checkbox');
        if (!toggleSwitch) return;
        const currentTheme = localStorage.getItem('theme') || 'light';

        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            toggleSwitch.checked = true;
        }

        toggleSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                btn.style.setProperty('--mouse-x', `${x}px`);
                btn.style.setProperty('--mouse-y', `${y}px`);
            });

            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                const targetContent = document.getElementById(tabId);
                if (targetContent) targetContent.classList.add('active');

                this.updateDocumentTitle();
            });
        });
    }

    renderCalendarHeader() {
        const planHeaderDates = document.getElementById('planHeaderDates');
        const summaryHeaderDates = document.getElementById('summaryHeaderDates');

        let planHtml = '';
        let summaryHtml = '';

        for (let d = 1; d <= this.daysInMonth; d++) {
            const holidayInfo = this.getHolidayInfo(d);
            const bgStyle = holidayInfo.isHoliday ? 'style="background-color: #fef08a; color: #a16207;"' : '';
            const titleTooltip = `title="${holidayInfo.name}"`;
            const thaiD = toThaiNumerals(d);

            planHtml += `<th class="date-col" ${bgStyle} ${titleTooltip}>${thaiD}</th>`;
            summaryHtml += `<th class="date-col" ${bgStyle} ${titleTooltip}>${thaiD}</th>`;
        }

        const subHeadersHtml = `<th class="summary-subcol">วันทำการ</th><th class="summary-subcol">วันหยุด</th>`;
        planHtml += subHeadersHtml;
        summaryHtml += subHeadersHtml;

        if (planHeaderDates) planHeaderDates.innerHTML = planHtml;
        if (summaryHeaderDates) summaryHeaderDates.innerHTML = summaryHtml;
    }

    renderPlanMatrix() {
        const tbody = document.getElementById('planTableBody');
        if (!tbody) return;
        let html = '';
        const currentData = otMatrixStorage[this.currentMonthKey] || {};

        this.staffList.forEach((staff, idx) => {
            const staffOt = currentData[staff.id] || {};
            let weekdayCount = 0;
            let holidayCount = 0;

            let dayCells = '';
            for (let d = 1; d <= this.daysInMonth; d++) {
                const hours = staffOt[d] || 0;
                const holidayInfo = this.getHolidayInfo(d);

                if (hours > 0) {
                    if (holidayInfo.isHoliday) holidayCount += hours / 4;
                    else weekdayCount += hours / 2;
                }

                let cellClass = 'day-cell';
                if (hours > 0) {
                    cellClass += holidayInfo.isHoliday ? ' selected-holiday' : ' selected-weekday';
                }

                dayCells += `<td class="${cellClass}" title="${holidayInfo.name}" onclick="app.toggleOtDay(${staff.id}, ${d})">${hours > 0 ? toThaiNumerals(hours) : ''}</td>`;
            }

            const totalWeekdayHrs = weekdayCount * 2;
            const totalHolidayHrs = holidayCount * 4;

            html += `
                <tr>
                    <td>${toThaiNumerals(idx + 1)}</td>
                    <td style="text-align: left; font-weight: 500;">${staff.name}</td>
                    <td style="text-align: left;">${staff.position}</td>
                    <td>๕๐ / ๖๐</td>
                    ${dayCells}
                    <td style="font-weight: bold;">${toThaiNumerals(totalWeekdayHrs)}</td>
                    <td style="font-weight: bold;">${toThaiNumerals(totalHolidayHrs)}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    toggleOtDay(staffId, day) {
        if (!otMatrixStorage[this.currentMonthKey]) otMatrixStorage[this.currentMonthKey] = {};
        if (!otMatrixStorage[this.currentMonthKey][staffId]) otMatrixStorage[this.currentMonthKey][staffId] = {};

        const current = otMatrixStorage[this.currentMonthKey][staffId][day] || 0;
        const holidayInfo = this.getHolidayInfo(day);

        if (current > 0) {
            delete otMatrixStorage[this.currentMonthKey][staffId][day];
        } else {
            otMatrixStorage[this.currentMonthKey][staffId][day] = holidayInfo.isHoliday ? 4 : 2;
        }

        this.renderPlanMatrix();
        this.renderSummaryTable();
        const picker = document.getElementById('dailyDateSelect');
        this.renderDailyLog(parseInt(picker ? picker.value : 1));
        this.renderReportDoc();
    }

    initDailyPicker() {
        const select = document.getElementById('dailyDateSelect');
        if (!select) return;
        let html = '';
        const mStr = String(this.month).padStart(2, '0');
        const monthName = monthNamesThai[mStr];
        const yearThai = toThaiNumerals(this.year + 543);

        for (let d = 1; d <= this.daysInMonth; d++) {
            const holidayInfo = this.getHolidayInfo(d);
            const thaiD = toThaiNumerals(d);
            const holidayLabel = holidayInfo.isHoliday ? `(${holidayInfo.name})` : '(วันปกติ)';
            const label = `วันที่ ${thaiD} ${monthName} ${yearThai} ${holidayLabel}`;
            html += `<option value="${d}">${label}</option>`;
        }
        select.innerHTML = html;

        select.addEventListener('change', (e) => {
            this.renderDailyLog(parseInt(e.target.value));
            this.updateDocumentTitle();
        });
    }

    // Render Tab 2 Daily Log
    renderDailyLog(day) {
        const mStr = String(this.month).padStart(2, '0');
        const monthName = monthNamesThai[mStr];
        const yearThai = toThaiNumerals(this.year + 543);
        const thaiD = toThaiNumerals(day);
        const holidayInfo = this.getHolidayInfo(day);

        const textEl = document.getElementById('dailyDateText');
        if (textEl) textEl.innerText = `${thaiD} ${monthName} ${yearThai}`;
        const tbody = document.getElementById('dailyTableBody');
        if (!tbody) return;
        let html = '';

        let countGov = 0;
        let countState = 0;
        let countMoh = 0;

        const currentData = otMatrixStorage[this.currentMonthKey] || {};

        let activeIndex = 1;
        let firstActiveStaff = null;
        this.staffList.forEach(staff => {
            const staffOt = currentData[staff.id] || {};
            const hours = staffOt[day] || 0;

            if (hours > 0) {
                if (!firstActiveStaff) {
                    firstActiveStaff = staff;
                }
                if (staff.type === 'GOVT') countGov++;
                else if (staff.type === 'STATE') countState++;
                else if (staff.type === 'MOH') countMoh++;

                const timeIn = holidayInfo.isHoliday ? '๐๘.๓๐' : '๑๖.๓๐';
                const timeOut = holidayInfo.isHoliday ? '๑๖.๓๐' : '๑๘.๓๐';

                html += `
                    <tr class="active-staff-row">
                        <td>${toThaiNumerals(activeIndex++)}</td>
                        <td style="text-align: left; font-weight: 500;">${staff.name}</td>
                        <td style="text-align: left;">${staff.position}</td>
                        <td>${timeIn}</td>
                        <td></td>
                        <td>${timeOut}</td>
                        <td></td>
                        <td></td>
                    </tr>
                `;
            }
        });

        // Insert Blank Rows for Print Only (14 total print rows guarantee 1-page A4 portrait)
        const totalPrintRows = 14;
        for (let i = activeIndex; i <= totalPrintRows; i++) {
            html += `
                <tr class="print-only-row">
                    <td>${toThaiNumerals(i)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            `;
        }

        if (activeIndex === 1) {
            html += `<tr class="screen-only-empty"><td colspan="8" style="padding: 16px; color: #64748b;">ไม่มีเจ้าหน้าที่ปฏิบัติงานนอกเวลาราชการในวันนี้</td></tr>`;
        }

        tbody.innerHTML = html;

        const cGovEl = document.getElementById('countGov');
        if (cGovEl) cGovEl.innerText = formatDottedCount(countGov);
        const cStateEl = document.getElementById('countState');
        if (cStateEl) cStateEl.innerText = formatDottedCount(countState);
        const cMohEl = document.getElementById('countMoh');
        if (cMohEl) cMohEl.innerText = formatDottedCount(countMoh);
        const cTotEl = document.getElementById('countTotal');
        if (cTotEl) cTotEl.innerText = formatDottedCount(countGov + countState + countMoh);

        const supNameEl = document.getElementById('dailySupervisorName');
        const supPosEl = document.getElementById('dailySupervisorPosition');
        if (firstActiveStaff) {
            if (supNameEl) supNameEl.innerText = `(${firstActiveStaff.name})`;
            if (supPosEl) supPosEl.innerText = firstActiveStaff.position;
        } else {
            if (supNameEl) supNameEl.innerText = '(...................................................)';
            if (supPosEl) supPosEl.innerText = '...................................................';
        }
    }

    renderSummaryTable() {
        const tbody = document.getElementById('summaryTableBody');
        if (!tbody) return;
        let html = '';

        let totalAllBaht = 0;
        let totalAllWeekdayHrs = 0;
        let totalAllHolidayHrs = 0;

        const currentData = otMatrixStorage[this.currentMonthKey] || {};

        this.staffList.forEach((staff, idx) => {
            const staffOt = currentData[staff.id] || {};
            let weekdayHours = 0;
            let holidayHours = 0;

            let dayCells = '';
            for (let d = 1; d <= this.daysInMonth; d++) {
                const hours = staffOt[d] || 0;
                const holidayInfo = this.getHolidayInfo(d);

                if (hours > 0) {
                    if (holidayInfo.isHoliday) holidayHours += hours;
                    else weekdayHours += hours;
                }

                dayCells += `<td>${hours > 0 ? toThaiNumerals(hours) : ''}</td>`;
            }

            const weekdayBaht = (weekdayHours / 2) * 100;
            const holidayBaht = (holidayHours / 4) * 240;
            const totalStaffBaht = weekdayBaht + holidayBaht;

            totalAllBaht += totalStaffBaht;
            totalAllWeekdayHrs += weekdayHours;
            totalAllHolidayHrs += holidayHours;

            html += `
                <tr>
                    <td>${toThaiNumerals(idx + 1)}</td>
                    <td style="text-align: left; font-weight: 500;">${staff.name}</td>
                    <td>๕๐ / ๖๐</td>
                    ${dayCells}
                    <td style="font-weight: bold;">${weekdayHours > 0 ? toThaiNumerals(weekdayHours) : '๐'}</td>
                    <td style="font-weight: bold;">${holidayHours > 0 ? toThaiNumerals(holidayHours) : '๐'}</td>
                    <td style="font-weight: bold;">${toThaiNumerals(totalStaffBaht.toLocaleString())}</td>
                    <td style="font-weight: bold;">${toThaiNumerals(totalStaffBaht.toLocaleString())}</td>
                    <td></td>
                    <td></td>
                </tr>
            `;
        });

        tbody.innerHTML = html;

        const sumDaysEl = document.getElementById('sumTotalDays');
        if (sumDaysEl) sumDaysEl.innerText = toThaiNumerals(totalAllWeekdayHrs);
        const sumBahtEl = document.getElementById('sumTotalBaht');
        if (sumBahtEl) sumBahtEl.innerText = toThaiNumerals(totalAllHolidayHrs);
        const sumTotalHoursEl = document.getElementById('sumTotalHours');
        if (sumTotalHoursEl) sumTotalHoursEl.innerText = toThaiNumerals(totalAllBaht.toLocaleString());
        const sumGrandTotalEl = document.getElementById('sumGrandTotal');
        if (sumGrandTotalEl) sumGrandTotalEl.innerText = toThaiNumerals(totalAllBaht.toLocaleString());
        const bahtTextEl = document.getElementById('bahtTextCell');
        if (bahtTextEl) bahtTextEl.innerText = this.numToThaiBaht(totalAllBaht);
    }

    initCertifierSelect() {
        const select = document.getElementById('memoCertifierSelect');
        if (!select) return;
        let html = '';
        this.staffList.forEach(staff => {
            const selected = staff.id === this.selectedCertifierId ? 'selected' : '';
            html += `<option value="${staff.id}" ${selected}>${staff.name} (${staff.position})</option>`;
        });
        select.innerHTML = html;
    }

    // Render Tab 4: Official Request Memorandum (บันทึกข้อความ) - Bulletproof Safe
    renderMemoDoc() {
        const memoDocNoEl = document.getElementById('memoDocNo');
        const memoDocDateEl = document.getElementById('memoDocDate');
        const certSelect = document.getElementById('memoCertifierSelect');

        const docNoInput = memoDocNoEl ? memoDocNoEl.value : 'อบ ๐๘๓๓ /';
        const docDateInput = memoDocDateEl ? memoDocDateEl.value : '๓๐ เดือน มิถุนายน พ.ศ.๒๕๖๙';

        if (certSelect) this.selectedCertifierId = parseInt(certSelect.value || 1);
        const certifier = this.staffList.find(s => s.id === this.selectedCertifierId) || this.staffList[0];

        const docNoTextEl = document.getElementById('memoDocNoText');
        if (docNoTextEl) docNoTextEl.innerText = docNoInput;

        let dateVal = docDateInput;
        if (!dateVal.includes('เดือน') && dateVal.includes(' ')) {
            const parts = dateVal.trim().split(/\s+/);
            if (parts.length === 3) {
                dateVal = `${parts[0]} เดือน ${parts[1]} พ.ศ.${parts[2]}`;
            }
        }
        const docDateTextEl = document.getElementById('memoDocDateText');
        if (docDateTextEl) docDateTextEl.innerText = dateVal;

        const mStr = String(this.month).padStart(2, '0');
        const monthName = monthNamesThai[mStr];
        const yearThai = toThaiNumerals(this.year + 543);

        const startEl = document.getElementById('memoStartDateText');
        if (startEl) startEl.innerText = `๑ ${monthName} ${yearThai}`;
        const endEl = document.getElementById('memoEndDateText');
        if (endEl) endEl.innerText = `${toThaiNumerals(this.daysInMonth)} ${monthName} ${yearThai}`;

        let workingDaysCount = 0;
        for (let d = 1; d <= this.daysInMonth; d++) {
            const h = this.getHolidayInfo(d);
            if (!h.isHoliday) workingDaysCount++;
        }

        const totalWorkdaysEl = document.getElementById('memoTotalWorkdaysText');
        if (totalWorkdaysEl) totalWorkdaysEl.innerText = toThaiNumerals(workingDaysCount);
        const staffCountEl = document.getElementById('memoStaffCountText');
        if (staffCountEl) staffCountEl.innerText = toThaiNumerals(this.staffList.length);

        if (certifier) {
            const certNameTextEl = document.getElementById('memoCertifierNameText');
            if (certNameTextEl) certNameTextEl.innerText = certifier.name;
            const certNameSubEl = document.getElementById('memoCertifierNameSub');
            if (certNameSubEl) certNameSubEl.innerText = certifier.name;
            const certTitleSubEl = document.getElementById('memoCertifierTitleSub');
            if (certTitleSubEl) certTitleSubEl.innerText = certifier.position;
        }

        const memoTbody = document.getElementById('memoStaffTableBody');
        if (memoTbody) {
            let html = '';
            this.staffList.forEach((staff, idx) => {
                html += `
                    <tr>
                        <td>${toThaiNumerals(idx + 1)}</td>
                        <td style="text-align: left; font-weight: 500; white-space: nowrap;">${staff.name}</td>
                        <td style="text-align: left;">${staff.position}</td>
                        <td style="text-align: left;">${staff.dutyName}</td>
                        <td style="text-align: left;">${staff.dutyReason}</td>
                    </tr>
                `;
            });
            memoTbody.innerHTML = html;
        }
    }

    // Render Tab 5: OT Performance Report (แบบรายงานผล - เอกสารหมายเลข ๔) - Bulletproof Safe
    renderReportDoc() {
        const reportDateInputEl = document.getElementById('reportDocDate');
        if (reportDateInputEl) {
            const dateTextEl = document.getElementById('reportDocDateText');
            if (dateTextEl) dateTextEl.innerText = reportDateInputEl.value;
        }

        const memoDocNoEl = document.getElementById('memoDocNo');
        const memoDocDateEl = document.getElementById('memoDocDate');
        const docNoInput = memoDocNoEl ? memoDocNoEl.value : 'อบ ๐๘๓๓ /';
        const docDateInput = memoDocDateEl ? memoDocDateEl.value : '๓๐ เดือน มิถุนายน พ.ศ.๒๕๖๙';

        const refNoEl = document.getElementById('reportRefDocNo');
        if (refNoEl) refNoEl.innerText = docNoInput;
        const refDateEl = document.getElementById('reportRefDocDate');
        if (refDateEl) refDateEl.innerText = docDateInput;

        const certifier = this.staffList.find(s => s.id === this.selectedCertifierId) || this.staffList[0];
        if (certifier) {
            const certNameEl = document.getElementById('reportCertifierName');
            if (certNameEl) certNameEl.innerText = certifier.name;
            const certTitleEl = document.getElementById('reportCertifierTitle');
            if (certTitleEl) certTitleEl.innerText = certifier.position;

            const certNameTextEl = document.getElementById('reportCertifierNameText');
            if (certNameTextEl) certNameTextEl.innerText = certifier.name;
            const certTitleTextEl = document.getElementById('reportCertifierTitleText');
            if (certTitleTextEl) certTitleTextEl.innerText = certifier.position;
        }


        const tbody = document.getElementById('reportTableBody');
        if (!tbody) return;
        let html = '';
        const currentData = otMatrixStorage[this.currentMonthKey] || {};

        this.staffList.forEach((staff, idx) => {
            const staffOt = currentData[staff.id] || {};
            const workedDates = [];
            let weekdayDaysCount = 0;
            let holidayDaysCount = 0;

            for (let d = 1; d <= this.daysInMonth; d++) {
                const hours = staffOt[d] || 0;
                if (hours > 0) {
                    workedDates.push(toThaiNumerals(d));
                    const holidayInfo = this.getHolidayInfo(d);
                    if (holidayInfo.isHoliday) holidayDaysCount += (hours >= 4 ? 1 : 0.5);
                    else weekdayDaysCount += (hours >= 2 ? 1 : 0.5);
                }
            }

            const datesFormattedText = workedDates.length > 0 ? workedDates.join(', ') : '-';
            const weekdayText = weekdayDaysCount > 0 ? toThaiNumerals(weekdayDaysCount) : '๐';
            const holidayText = holidayDaysCount > 0 ? toThaiNumerals(holidayDaysCount) : '๐';

            html += `
                <tr>
                    <td style="text-align: center; vertical-align: middle;">${toThaiNumerals(idx + 1)}</td>
                    <td style="text-align: left; font-weight: 500; white-space: nowrap; vertical-align: middle;">${staff.name}</td>
                    <td style="text-align: center; letter-spacing: 0.1px; padding: 4px 3px; font-size: 8.5pt; vertical-align: middle;">${datesFormattedText}</td>
                    <td style="font-weight: normal; text-align: center; vertical-align: middle;">${weekdayText}</td>
                    <td style="font-weight: normal; text-align: center; vertical-align: middle;">${holidayText}</td>
                    <td style="text-align: left; font-size: 8.2pt; line-height: 1.3; vertical-align: middle; padding: 4px 6px;">ปฏิบัติงานที่สำนักงานในหน้าที่รับผิดชอบ</td>
                    <td style="text-align: center; vertical-align: middle;"></td>
                </tr>
            `;


        });

        tbody.innerHTML = html;
    }

    recalculateAll() {
        this.renderPlanMatrix();
        this.renderSummaryTable();
        this.renderReportDoc();
        alert('ประมวลผลคำนวณยอดเงินและชั่วโมงเรียบร้อยแล้ว!');
    }

    numToThaiBaht(number) {
        if (number === 0) return 'ศูนย์บาทถ้วน';
        const txtNum = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
        const txtDigit = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

        let str = Math.floor(number).toString();
        let baht = '';
        let len = str.length;

        for (let i = 0; i < len; i++) {
            let digit = parseInt(str.charAt(i));
            let pos = len - i - 1;

            if (digit !== 0) {
                if (pos === 1 && digit === 1) baht += '';
                else if (pos === 1 && digit === 2) baht += 'ยี่';
                else if (pos === 0 && digit === 1 && len > 1) baht += 'เอ็ด';
                else baht += txtNum[digit];

                baht += txtDigit[pos];
            }
        }
        return baht + 'บาทถ้วน';
    }

    // Render Tab 6: Staff Management Full 8 Columns
    renderStaffList() {
        const tbody = document.getElementById('staffTableBody');
        if (!tbody) return;
        let html = '';
        if (!this.staffList || this.staffList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="padding: 24px; text-align: center; color: #64748b;">ไม่มีข้อมูลบุคลากรในระบบ (กดปุ่ม "➕ เพิ่มเจ้าหน้าที่ใหม่" หรือ "🔄 คืนค่าตั้งต้น ๗ ท่าน" เพื่อเพิ่มข้อมูล)</td></tr>`;
            return;
        }

        this.staffList.forEach((staff, idx) => {
            let badgeClass = 'badge-info';
            if (staff.type === 'STATE') badgeClass = 'badge-warning';
            else if (staff.type === 'MOH') badgeClass = 'badge-success';

            html += `
                <tr>
                    <td style="text-align: center; font-weight: 500;">${toThaiNumerals(idx + 1)}</td>
                    <td style="font-weight: 600; color: var(--text-primary); white-space: nowrap;">${staff.name}</td>
                    <td style="white-space: nowrap; color: var(--text-secondary);">${staff.position}</td>
                    <td style="text-align: center;"><span class="badge ${badgeClass}">${staff.typeText}</span></td>
                    <td style="font-size: 0.85rem; color: var(--text-secondary);">${staff.dutyName}</td>
                    <td style="font-size: 0.82rem; line-height: 1.35; color: var(--text-muted);">${staff.dutyReason}</td>
                    <td style="text-align: center; white-space: nowrap;">
                        <div style="display: flex; gap: 6px; justify-content: center; align-items: center;">
                            <button class="btn-action-icon edit-btn" title="แก้ไขข้อมูล" onclick="app.openStaffModal(${staff.id})">✏️</button>
                            <button class="btn-action-icon delete-btn" title="ลบข้อมูล" onclick="app.deleteStaff(${staff.id})">🗑️</button>
                        </div>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }



    // Modern Interactive Staff Modal Dialog Handler
    openStaffModal(id = null) {
        const modal = document.getElementById('staffModal');
        const modalTitle = document.getElementById('modalTitle');
        const idInput = document.getElementById('modalStaffId');
        const nameInput = document.getElementById('modalStaffName');
        const posInput = document.getElementById('modalStaffPosition');
        const typeInput = document.getElementById('modalStaffType');
        const dutyInput = document.getElementById('modalStaffDutyName');
        const reasonInput = document.getElementById('modalStaffDutyReason');

        if (!modal) return;

        if (id) {
            const staff = this.staffList.find(s => s.id === id);
            if (staff) {
                modalTitle.innerText = '✏️ แก้ไขข้อมูลเจ้าหน้าที่';
                idInput.value = staff.id;
                nameInput.value = staff.name || '';
                posInput.value = staff.position || '';
                typeInput.value = staff.type || 'GOVT';
                dutyInput.value = staff.dutyName || '';
                reasonInput.value = staff.dutyReason || '';
            }
        } else {
            modalTitle.innerText = '➕ เพิ่มเจ้าหน้าที่ใหม่';
            idInput.value = '';
            nameInput.value = '';
            posInput.value = 'นักวิชาการสาธารณสุข';
            typeInput.value = 'GOVT';
            dutyInput.value = 'งานสาธารณสุขทั่วไป';
            reasonInput.value = 'วิเคราะห์และสรุปรายงานข้อมูลสาธารณสุข';
        }

        modal.style.display = 'flex';
    }

    closeStaffModal() {
        const modal = document.getElementById('staffModal');
        if (modal) modal.style.display = 'none';
    }

    saveStaffFromModal() {
        const idInput = document.getElementById('modalStaffId').value;
        const name = document.getElementById('modalStaffName').value.trim();
        const position = document.getElementById('modalStaffPosition').value.trim();
        const type = document.getElementById('modalStaffType').value;
        const dutyName = document.getElementById('modalStaffDutyName').value.trim();
        const dutyReason = document.getElementById('modalStaffDutyReason').value.trim();

        if (!name) {
            alert('กรุณากรอกชื่อ-นามสกุล บุคลากร');
            return;
        }

        let typeText = 'ข้าราชการ';
        if (type === 'STATE') typeText = 'พนักงานราชการ';
        else if (type === 'MOH') typeText = 'พนักงานกระทรวงสาธารณสุข';

        if (idInput) {
            const staff = this.staffList.find(s => s.id === parseInt(idInput));
            if (staff) {
                staff.name = name;
                staff.position = position || 'เจ้าหน้าที่สาธารณสุข';
                staff.type = type;
                staff.typeText = typeText;
                staff.dutyName = dutyName;
                staff.dutyReason = dutyReason;
            }
        } else {
            this.staffList.push({
                id: Date.now(),
                name: name,
                position: position || 'เจ้าหน้าที่สาธารณสุข',
                type: type,
                typeText: typeText,
                dutyName: dutyName,
                dutyReason: dutyReason
            });
        }

        localStorage.setItem('ot_staff_list', JSON.stringify(this.staffList));
        this.closeStaffModal();

        this.renderStaffList();
        this.renderPlanMatrix();
        this.renderSummaryTable();
        this.renderMemoDoc();
        this.renderReportDoc();
        this.initCertifierSelect();
    }

    editStaff(id) {
        this.openStaffModal(id);
    }

    // Modern Delete Confirmation Modal Handlers
    deleteStaff(id) {
        const staff = this.staffList.find(s => s.id === id);
        if (!staff) return;

        const deleteModal = document.getElementById('deleteModal');
        const idInput = document.getElementById('deleteStaffId');
        const nameText = document.getElementById('deleteStaffNameText');

        if (deleteModal && idInput && nameText) {
            idInput.value = staff.id;
            nameText.innerText = `คุณต้องการลบเจ้าหน้าที่ "${staff.name}" ใช่หรือไม่?`;
            deleteModal.style.display = 'flex';
        } else {
            this.performDelete(id);
        }
    }

    closeDeleteModal() {
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) deleteModal.style.display = 'none';
    }

    confirmDeleteStaff() {
        const idInput = document.getElementById('deleteStaffId');
        if (idInput && idInput.value) {
            const id = parseInt(idInput.value);
            this.performDelete(id);
        }
        this.closeDeleteModal();
    }

    performDelete(id) {
        this.staffList = this.staffList.filter(s => s.id !== id);
        localStorage.setItem('ot_staff_list', JSON.stringify(this.staffList));
        this.renderStaffList();
        this.renderPlanMatrix();
        this.renderSummaryTable();
        this.renderMemoDoc();
        this.renderReportDoc();
        this.initCertifierSelect();
    }

    // Export Daily Log for Whole Month into a Single Excel File (1 Day = 1 Portrait A4 Page, Full Borders & Print Setup 100%)
    async exportDailyExcelMonth() {
        const progressModal = document.getElementById('excelProgressModal');
        const progressBar = document.getElementById('excelProgressBar');
        const statusText = document.getElementById('excelProgressStatusText');
        const percentText = document.getElementById('excelProgressPercentText');
        const detailText = document.getElementById('excelProgressDetailText');
        const iconEl = document.getElementById('excelProgressIcon');

        // Helper to update progress bar and yield execution to UI main thread
        const updateProgress = async (percent, statusMsg, detailMsg = '') => {
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (percentText) percentText.innerText = `${percent}%`;
            if (statusText) statusText.innerText = statusMsg;
            if (detailText) detailText.innerText = detailMsg;
            await new Promise(resolve => setTimeout(resolve, 15));
        };

        const escapeXml = (unsafe) => {
            if (unsafe === null || unsafe === undefined) return '';
            return unsafe.toString()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        };

        try {
            if (progressModal) progressModal.style.display = 'flex';
            if (iconEl) iconEl.innerText = '📊';

            await updateProgress(5, 'กำลังเตรียมโครงสร้างแบบฟอร์มการพิมพ์...', `0 / ${this.daysInMonth} วัน`);

            const currentData = otMatrixStorage[this.currentMonthKey] || {};
            const [yearStr, monthStr] = this.currentMonthKey.split('-');
            const selYear = parseInt(yearStr, 10);
            const selMonth = parseInt(monthStr, 10);
            const monthName = monthNamesThai[monthStr];
            const yearThai = toThaiNumerals(selYear + 543);

            let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>สำนักงานสาธารณสุขอำเภอตาลสุม</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="TH Sarabun PSK" ss:Size="11"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="TitleMain">
   <Font ss:FontName="TH Sarabun PSK" ss:Size="14" ss:Bold="1"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="TitleSub">
   <Font ss:FontName="TH Sarabun PSK" ss:Size="12" ss:Bold="1"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="TableHeader">
   <Font ss:FontName="TH Sarabun PSK" ss:Size="11" ss:Bold="1"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="TableCellCenter">
   <Font ss:FontName="TH Sarabun PSK" ss:Size="11"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
  </Style>
  <Style ss:ID="TableCellLeft">
   <Font ss:FontName="TH Sarabun PSK" ss:Size="11"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
  </Style>
  <Style ss:ID="SummaryText">
   <Font ss:FontName="TH Sarabun PSK" ss:Size="11"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SignatureText">
   <Font ss:FontName="TH Sarabun PSK" ss:Size="11"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
 </Styles>
`;

            await updateProgress(10, 'กำลังสร้าง Sheet 1: สรุปภาพรวมรายเดือน (ฟอนต์ TH Sarabun)...', `0 / ${this.daysInMonth} วัน`);

            // --- Sheet 1: สรุปภาพรวมรายเดือน ---
            xmlContent += ` <Worksheet ss:Name="สรุปภาพรวมรายเดือน">
  <Table ss:ExpandedColumnCount="6">
   <Column ss:Width="40"/>
   <Column ss:Width="160"/>
   <Column ss:Width="160"/>
   <Column ss:Width="130"/>
   <Column ss:Width="130"/>
   <Column ss:Width="130"/>
   <Row ss:Height="26">
    <Cell ss:MergeAcross="5" ss:StyleID="TitleMain"><Data ss:Type="String">สรุปบัญชีลงเวลาการปฏิบัติงานนอกเวลาราชการ ประจำเดือน ${monthName} พ.ศ. ${yearThai}</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:MergeAcross="5" ss:StyleID="TitleSub"><Data ss:Type="String">หน่วยงาน: สำนักงานสาธารณสุขอำเภอตาลสุม จังหวัดอุบลราชธานี</Data></Cell>
   </Row>
   <Row ss:Height="10"/>
   <Row ss:Height="26">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">ลำดับ</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">ชื่อ - สกุล</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">ตำแหน่ง</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">ประเภทบุคลากร</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">จำนวนวันมาปฏิบัติงาน (วัน)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">รวมจำนวนชั่วโมง (ชม.)</Data></Cell>
   </Row>
`;

            this.staffList.forEach((staff, idx) => {
                const staffOt = currentData[staff.id] || {};
                let totalDays = 0;
                let totalHours = 0;
                for (let d = 1; d <= this.daysInMonth; d++) {
                    const h = staffOt[d] || 0;
                    if (h > 0) {
                        totalDays++;
                        totalHours += h;
                    }
                }
                xmlContent += `   <Row ss:Height="24">
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String">${toThaiNumerals(idx + 1)}</Data></Cell>
    <Cell ss:StyleID="TableCellLeft"><Data ss:Type="String">${escapeXml(staff.name)}</Data></Cell>
    <Cell ss:StyleID="TableCellLeft"><Data ss:Type="String">${escapeXml(staff.position)}</Data></Cell>
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String">${escapeXml(staff.typeText || staff.type || 'ข้าราชการ')}</Data></Cell>
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String">${toThaiNumerals(totalDays)}</Data></Cell>
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String">${toThaiNumerals(totalHours)}</Data></Cell>
   </Row>
`;
            });

            xmlContent += `  </Table>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
   <PageSetup>
    <Layout ss:Orientation="Portrait"/>
    <PageMargins ss:Bottom="0.5" ss:Left="0.5" ss:Right="0.5" ss:Top="0.5"/>
   </PageSetup>
   <FitToPage/>
   <Print>
    <FitWidth>1</FitWidth>
    <FitHeight>1</FitHeight>
   </Print>
   <ProtectObjects>False</ProtectObjects>
   <ProtectScenarios>False</ProtectScenarios>
  </WorksheetOptions>
 </Worksheet>
`;

            // --- Sheets 2-N: Daily Attendance Sheets (8 Columns Perfect Fit) ---
            for (let d = 1; d <= this.daysInMonth; d++) {
                const pct = 10 + Math.round((d / this.daysInMonth) * 82);
                const dayNumThai = toThaiNumerals(d);
                await updateProgress(
                    pct,
                    `กำลังจัดหน้าตารางกรอบเส้นคมชัด ฟอนต์ TH Sarabun วันที่ ${dayNumThai} ${monthName}...`,
                    `${d} / ${this.daysInMonth} วัน`
                );

                const dateObj = new Date(selYear, selMonth - 1, d);
                const holidayInfo = this.getHolidayInfo(d);

                const activeStaffList = this.staffList.filter(staff => {
                    const staffOt = currentData[staff.id] || {};
                    return (staffOt[d] || 0) > 0;
                });

                const listToUse = activeStaffList.length > 0 ? activeStaffList : this.staffList;

                let countGov = 0;
                let countState = 0;
                let countMoh = 0;
                let activeCount = 0;

                const sheetName = `วันที่ ${dayNumThai}`;

                xmlContent += ` <Worksheet ss:Name="${sheetName}">
  <Table ss:ExpandedColumnCount="8">
   <Column ss:Width="35"/>
   <Column ss:Width="150"/>
   <Column ss:Width="150"/>
   <Column ss:Width="50"/>
   <Column ss:Width="80"/>
   <Column ss:Width="50"/>
   <Column ss:Width="80"/>
   <Column ss:Width="90"/>
   <Row ss:Height="26">
    <Cell ss:MergeAcross="7" ss:StyleID="TitleMain"><Data ss:Type="String">บัญชีลงเวลาการปฏิบัติงานนอกเวลาราชการและวันหยุดราชการ</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:MergeAcross="7" ss:StyleID="TitleSub"><Data ss:Type="String">หน่วยงาน สำนักงานสาธารณสุขอำเภอตาลสุม ประจำวันที่ ${dayNumThai} ${monthName} พ.ศ. ${yearThai}</Data></Cell>
   </Row>
   <Row ss:Height="8"/>
   <Row ss:Height="24">
    <Cell ss:StyleID="TableHeader" ss:MergeDown="1"><Data ss:Type="String">ลำดับ</Data></Cell>
    <Cell ss:StyleID="TableHeader" ss:MergeDown="1"><Data ss:Type="String">ชื่อ-สกุล</Data></Cell>
    <Cell ss:StyleID="TableHeader" ss:MergeDown="1"><Data ss:Type="String">ตำแหน่ง</Data></Cell>
    <Cell ss:StyleID="TableHeader" ss:MergeAcross="3"><Data ss:Type="String">เวลาปฏิบัติราชการนอกเวลาราชการปกติ</Data></Cell>
    <Cell ss:StyleID="TableHeader" ss:MergeDown="1"><Data ss:Type="String">หมายเหตุ</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:Index="4" ss:StyleID="TableHeader"><Data ss:Type="String">เวลามา</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">ลายมือชื่อ</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">เวลากลับ</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">ลายมือชื่อ</Data></Cell>
   </Row>
`;

                listToUse.forEach((staff, idx) => {
                    const staffOt = currentData[staff.id] || {};
                    const hours = staffOt[d] || 0;

                    if (hours > 0) {
                        activeCount++;
                        const typeStr = (staff.typeText || staff.type || '').toString();
                        if (typeStr.includes('ข้าราชการ') || staff.type === 'GOVT') countGov++;
                        else if (typeStr.includes('พนักงานราชการ') || staff.type === 'STATE') countState++;
                        else if (typeStr.includes('พนักงานกระทรวง') || staff.type === 'MOH') countMoh++;
                    }

                    let inTime = holidayInfo.isHoliday ? '๐๘.๓๐' : '๑๖.๓๐';
                    let outTime = holidayInfo.isHoliday ? '๑๖.๓๐' : '๑๘.๓๐';

                    xmlContent += `   <Row ss:Height="24">
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String">${toThaiNumerals(idx + 1)}</Data></Cell>
    <Cell ss:StyleID="TableCellLeft"><Data ss:Type="String">${escapeXml(staff.name)}</Data></Cell>
    <Cell ss:StyleID="TableCellLeft"><Data ss:Type="String">${escapeXml(staff.position)}</Data></Cell>
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String">${hours > 0 ? inTime : ''}</Data></Cell>
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String">${hours > 0 ? outTime : ''}</Data></Cell>
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String"></Data></Cell>
   </Row>
`;
                });

                // Pad remaining rows up to 14 print rows total
                const printRowsLimit = 14;
                for (let r = listToUse.length + 1; r <= printRowsLimit; r++) {
                    xmlContent += `   <Row ss:Height="24">
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String">${toThaiNumerals(r)}</Data></Cell>
    <Cell ss:StyleID="TableCellLeft"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TableCellLeft"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TableCellCenter"><Data ss:Type="String"></Data></Cell>
   </Row>
`;
                }

                xmlContent += `   <Row ss:Height="8"/>
   <Row ss:Height="20">
    <Cell ss:Index="1" ss:MergeAcross="1" ss:StyleID="SummaryText"><Data ss:Type="String">เวลาปฏิบัติงานนอกเวลาราชการ</Data></Cell>
    <Cell ss:Index="3" ss:StyleID="SummaryText"><Data ss:Type="String">วันปกติ</Data></Cell>
    <Cell ss:Index="4" ss:MergeAcross="4" ss:StyleID="SummaryText"><Data ss:Type="String">เริ่มปฏิบัติงานตั้งแต่เวลา ๑๖.๓๐-๑๘.๓๐ น.</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:Index="3" ss:StyleID="SummaryText"><Data ss:Type="String">วันหยุดราชการ</Data></Cell>
    <Cell ss:Index="4" ss:MergeAcross="4" ss:StyleID="SummaryText"><Data ss:Type="String">เริ่มปฏิบัติงานตั้งแต่เวลา ๐๘.๓๐-๑๖.๓๐ น.</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:Index="3" ss:StyleID="SummaryText"><Data ss:Type="String">หยุดพัก</Data></Cell>
    <Cell ss:Index="4" ss:MergeAcross="4" ss:StyleID="SummaryText"><Data ss:Type="String">เวลา ๑๒.๐๐-๑๓.๐๐ น.</Data></Cell>
   </Row>
   <Row ss:Height="16"/>
   <Row ss:Height="16"/>
   <Row ss:Height="20">
    <Cell ss:Index="1" ss:MergeAcross="7" ss:StyleID="SummaryText"><Data ss:Type="String">สรุปจำนวนข้าราชการ/พนักงานราชการ/พนักงานกระทรวงสาธารณสุข ที่อยู่ปฏิบัติราชการนอกเวลาราชการปกติ</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:Index="1" ss:MergeAcross="7" ss:StyleID="SummaryText"><Data ss:Type="String">ข้าราชการ ${formatDottedCount(countGov)} คน พนักงานราชการ ${formatDottedCount(countState)} คน</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:Index="1" ss:MergeAcross="7" ss:StyleID="SummaryText"><Data ss:Type="String">พนักงานกระทรวงสาธารณสุข ${formatDottedCount(countMoh)} คน รวม ${formatDottedCount(activeCount)} คน</Data></Cell>
   </Row>
   <Row ss:Height="16"/>
   <Row ss:Height="16"/>
   <Row ss:Height="16"/>
   <Row ss:Height="22">
    <Cell ss:Index="5" ss:MergeAcross="3" ss:StyleID="SignatureText"><Data ss:Type="String">(ลงชื่อ).................................................... ผู้ควบคุม/ตรวจสอบ</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:Index="5" ss:MergeAcross="3" ss:StyleID="SignatureText"><Data ss:Type="String">(${escapeXml(activeStaffList.length > 0 ? activeStaffList[0].name : '...................................................')})</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:Index="5" ss:MergeAcross="3" ss:StyleID="SignatureText"><Data ss:Type="String">ตำแหน่ง ${escapeXml(activeStaffList.length > 0 ? activeStaffList[0].position : '...................................................')}</Data></Cell>
   </Row>
  </Table>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
   <PageSetup>
    <Layout ss:Orientation="Portrait"/>
    <PageMargins ss:Bottom="0.5" ss:Left="0.5" ss:Right="0.5" ss:Top="0.5"/>
   </PageSetup>
   <FitToPage/>
   <Print>
    <FitWidth>1</FitWidth>
    <FitHeight>1</FitHeight>
   </Print>
   <ProtectObjects>False</ProtectObjects>
   <ProtectScenarios>False</ProtectScenarios>
  </WorksheetOptions>
 </Worksheet>
`;
            }

            xmlContent += `</Workbook>`;

            await updateProgress(95, 'กำลังรวบรวมไฟล์ Excel พร้อมกรอบเส้นตารางและตั้งค่าหน้าพิมพ์แนวตั้ง A4...', `${this.daysInMonth} / ${this.daysInMonth} วัน`);

            const fileName = `บัญชีลงเวลารายวัน_รายเดือน_${monthName}_${yearThai}_สสอ.ตาลสุม.xls`;

            const blob = new Blob(['\ufeff' + xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            await updateProgress(100, 'ส่งออกไฟล์ Excel กรอบเส้นคมชัด 1 หน้า A4 สำเร็จเรียบร้อย!', `${this.daysInMonth} / ${this.daysInMonth} วัน`);
            if (iconEl) iconEl.innerText = '✅';

            setTimeout(() => {
                if (progressModal) progressModal.style.display = 'none';
            }, 800);
        } catch (err) {
            console.error('Error in exportDailyExcelMonth:', err);
            if (statusText) statusText.innerText = 'เกิดข้อผิดพลาดในการสร้างไฟล์ Excel: ' + err.message;
            if (iconEl) iconEl.innerText = '❌';
            setTimeout(() => {
                if (progressModal) progressModal.style.display = 'none';
                alert('เกิดข้อผิดพลาดในการสร้างไฟล์ Excel: ' + err.message);
            }, 1500);
        }
    }
}






// Initialize Application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new OTApp();
});
