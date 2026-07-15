export const generateOrderId = () => {
    return 'ORD-' + Date.now().toString().slice(-6);
};

export const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const convertThaiDateToISO = (thaiDateStr) => {
    if (!thaiDateStr) return '';
    const parts = thaiDateStr.split('/');
    if (parts.length !== 3) return '';

    let year = parts[2] || '2569';
    if (year.length === 4 && parseInt(year) > 2400) {
        year = String(parseInt(year) - 543);
    }
    const month = (parts[1] || '01').padStart(2, '0');
    const day = (parts[0] || '01').padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};