import React from 'react';

function StoreInfoView() {
    const cards = [
        ['🚚', 'การจัดส่ง', 'จัดส่งภายใน 1–2 วันทำการหลังตรวจสอบการชำระเงิน พร้อมเลขพัสดุในหน้า “บัญชีของฉัน”'],
        ['↩️', 'เปลี่ยน/คืนสินค้า', 'แจ้งปัญหาภายใน 7 วันหลังได้รับสินค้า โดยสินค้าอยู่ในสภาพเดิมและมีป้ายครบถ้วน'],
        ['💬', 'ติดต่อเรา', 'หากต้องการความช่วยเหลือเรื่องไซซ์ ออเดอร์ หรือสินค้า ติดต่อผ่านช่องทางของร้านได้ทุกวัน'],
    ];

    return <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        <section className="overflow-hidden rounded-3xl bg-stone-950 px-6 py-10 text-white sm:px-12 sm:py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">About fashion store</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">สไตล์ที่เลือกได้<br /><em className="font-serif font-normal text-amber-200">ในแบบของคุณ</em></h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-stone-300">เราเลือกไอเท็มที่สวมใส่ได้จริงและดูดีในทุกวัน พร้อมรายละเอียดสินค้า สต็อก และสถานะออเดอร์ที่ตรวจสอบได้</p>
        </section>
        <section className="mt-7 grid gap-4 md:grid-cols-3">
            {cards.map(([icon, title, description]) => <article key={title} className="rounded-2xl border border-stone-200 bg-white p-6"><span className="text-2xl">{icon}</span><h3 className="mt-4 text-base font-black text-stone-950">{title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{description}</p></article>)}
        </section>
        <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6"><h3 className="text-base font-black text-stone-950">คำถามที่พบบ่อย</h3><div className="mt-4 space-y-4 text-sm text-stone-600"><p><strong className="text-stone-900">ต้องเลือกไซซ์อย่างไร?</strong><br />กดดูรายละเอียดสินค้าเพื่อเช็กไซซ์และสต็อกของแต่ละขนาดก่อนเพิ่มลงตะกร้า</p><p><strong className="text-stone-900">ตรวจสอบการชำระเงินได้อย่างไร?</strong><br />หลังสั่งซื้อ ให้แนบหลักฐานการโอนในตะกร้าหรือหน้า “บัญชีของฉัน” แล้วร้านจะอัปเดตสถานะให้</p></div></section>
    </main>;
}

export default StoreInfoView;
