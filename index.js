const uploadZone = document.getElementById('uploadZone');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const scanningStatus = document.getElementById('scanningStatus');
const extractionCount = document.getElementById('extractionCount');
const tableBody = document.getElementById('tableBody');
const emptyRow = document.getElementById('emptyRow');
const exportBtn = document.getElementById('exportBtn');
const imageModal = document.getElementById('imageModal');
const exportMenu = document.getElementById('exportMenu');

const shelfData = {
    1: [
        { title: "The Bible As History", author: "Ian Wilson", isbn: "9780882142272", date: "Mar 13, 2026" },
        { title: "101 World Heroes", author: "Simon Sebag Montefiore", isbn: "9781847248831", date: "Mar 13, 2026" },
        { title: "The Hard Thing About Hard Things", author: "Ben Horowitz", isbn: "9780062273208", date: "Mar 13, 2026" },
        { title: "Rework", author: "Jason Fried & David Heinemeier Hansson", isbn: "9780307463746", date: "Mar 13, 2026" },
        { title: "Blitzscaling", author: "Reid Hoffman and Chris Yeh", isbn: "9781526600400", date: "Mar 13, 2026" }
    ],
    2: [
        { title: "The Utopia of Rules", author: "David Graeber", isbn: "9781612193748", date: "Mar 13, 2026" },
        { title: "Man's Search for Meaning", author: "Viktor E. Frankl", isbn: "9780807014295", date: "Mar 13, 2026" },
        { title: "A Random Walk Down Wall Street", author: "Burton G. Malkiel", isbn: "9780393356173", date: "Mar 13, 2026" },
        { title: "The Lean Startup", author: "Eric Ries", isbn: "9780307887894", date: "Mar 13, 2026" },
        { title: "Principles: Life & Work", author: "Ray Dalio", isbn: "9781501124020", date: "Mar 13, 2026" }
    ],
    3: [
        { title: "Skin in the Game", author: "Nassim Nicholas Taleb", isbn: "9780425284643", date: "Mar 13, 2026" },
        { title: "7 Powers", author: "Hamilton Helmer", isbn: "9780998116310", date: "Mar 13, 2026" },
        { title: "The Start-up of You", author: "Reid Hoffman and Ben Casnocha", isbn: "9780307888907", date: "Mar 13, 2026" },
        { title: "Traction", author: "Gabriel Weinberg and Justin Mares", isbn: "9781591848363", date: "Mar 13, 2026" },
        { title: "The Cold Start Problem", author: "Andrew Chen", isbn: "9780062969071", date: "Mar 13, 2026" }
    ],
    4: [
        { title: "Creativity, Inc.", author: "Ed Catmull", isbn: "9780812993011", date: "Mar 13, 2026" },
        { title: "The Black Swan", author: "Nassim Nicholas Taleb", isbn: "9781400063512", date: "Mar 13, 2026" },
        { title: "Bullshit Jobs", author: "David Graeber", isbn: "9781501140068", date: "Mar 13, 2026" },
        { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", isbn: "9780374275631", date: "Mar 13, 2026" },
        { title: "Brave New World", author: "Aldous Huxley", isbn: "9780060850524", date: "Mar 13, 2026" }
    ]
};

let currentBooks = [];

uploadZone.addEventListener('click', () => {
    if (!uploadZone.classList.contains('is-scanning')) {
        imageModal.classList.add('active');
        const firstFocusable = imageModal.querySelector('[tabindex="0"], button');
        if (firstFocusable) firstFocusable.focus();
    }
});

uploadZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        uploadZone.click();
    }
});

window.closeModal = function() {
    imageModal.classList.remove('active');
    uploadZone.focus();
}

window.handleSampleKey = function(e, id) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectSample(id);
    }
}

// Modal focus trapping
imageModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        return;
    }
    if (e.key === 'Tab') {
        const focusable = imageModal.querySelectorAll('button, [tabindex="0"]');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

window.selectSample = function(id) {
    closeModal();
    simulateScanning(id);
}

function simulateScanning(id) {
    const booksToPopulate = shelfData[id] || shelfData[1];
    currentBooks = booksToPopulate;
    
    // Clear previous results
    tableBody.innerHTML = '';
    
    uploadZone.classList.add('is-scanning');
    uploadPlaceholder.classList.add('hidden');
    scanningStatus.classList.remove('hidden');
    scanningStatus.innerHTML = `
        <p>Analyzing book spines...</p>
        <div id="extractionCount" style="font-size: 3rem; font-weight: 700; color: var(--primary); margin: 20px 0;" aria-live="polite">0</div>
        <p>Books detected</p>
    `;
    
    const countDisplay = document.getElementById('extractionCount');
    let count = 0;
    const interval = setInterval(() => {
        count++;
        countDisplay.innerText = count;
        
        if (count <= booksToPopulate.length) {
            addBookToTable(booksToPopulate[count - 1]);
        }

        if (count >= booksToPopulate.length) {
            clearInterval(interval);
            setTimeout(() => {
                uploadZone.classList.remove('is-scanning');
                scanningStatus.innerHTML = `<p style="color: #4ade80;">✓ Analysis Complete</p><p style="font-size: 3rem; font-weight: 700; color: #4ade80;">${booksToPopulate.length}</p><p>Books Cataloged</p>`;
                exportBtn.disabled = false;
                exportBtn.style.opacity = "1";
            }, 1000);
        }
    }, 800);
}

function addBookToTable(book) {
    if (emptyRow) emptyRow.classList.add('hidden');
    
    const tr = document.createElement('tr');
    tr.style.animation = "fadeIn 0.5s ease forwards";
    tr.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td><code style="background: var(--glass); padding: 2px 5px; border-radius: 4px;">${book.isbn}</code></td>
        <td>${book.date}</td>
    `;
    tableBody.appendChild(tr);
}

function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Title,Author,ISBN-13,Date Added\n";
    currentBooks.forEach(book => {
        csvContent += `"${book.title}","${book.author}","${book.isbn}","${book.date}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "shelfsmart_catalog.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.toggleExportMenu = function() {
    exportMenu.classList.toggle('active');
}

window.handleExport = function(type) {
    exportMenu.classList.remove('active');
    
    const btn = document.getElementById('exportBtn');
    const originalText = btn.innerText;
    
    if (type === 'CSV') {
        exportCSV();
        showExportFeedback('CSV Exported!');
    } else {
        // Simulate sync
        btn.innerText = `Syncing to ${type}...`;
        btn.disabled = true;
        btn.style.opacity = "0.7";
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            btn.style.opacity = "1";
            showExportFeedback(`Synced to ${type}!`);
        }, 2000);
    }
}

function showExportFeedback(message) {
    const toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--primary);
        color: #000;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 600;
        box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        z-index: 2000;
        animation: fadeIn 0.3s ease-out;
    `;
    toast.innerText = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Close menu on outside click
window.addEventListener('click', (e) => {
    if (!e.target.closest('.export-group')) {
        exportMenu.classList.remove('active');
    }
});

window.toggleFaq = function(element) {
    const parent = element.parentElement;
    parent.classList.toggle('active');
    const expanded = parent.classList.contains('active');
    element.setAttribute('aria-expanded', expanded);
}
