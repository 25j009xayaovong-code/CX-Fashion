import React, { useState } from 'react';

function CustomerView({ state }) {
    const {
        customerCategory, setCustomerCategory, filteredProductsForCustomer,
        allCategoryTabs, addToCart, userProfile, isCartOpen, setIsCartOpen,
        cart, removeFromCart, clearCart, handleCheckout, checkoutName, setCheckoutName,
        checkoutPhone, setCheckoutPhone, checkoutAddress, setCheckoutAddress,
        checkoutPayment, setCheckoutPayment, couponCodeInput, setCouponCodeInput,
        appliedCoupon, couponFeedback, cartSubtotal, discountAmount, shippingFee, grandTotal,
        applyCoupon, removeCoupon
    } = state;
    const [selectedQuantities, setSelectedQuantities] = useState({});

    return (
        <div className="flex-grow bg-stone-50">
            <section className="store-hero px-5 py-10 sm:px-8 sm:py-16">
                <div className="mx-auto grid max-w-6xl items-end gap-6 sm:gap-10 lg:grid-cols-[1fr_auto]">
                    <div>
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-amber-200">New season / curated essentials</p>
                        <h2 className="max-w-2xl text-[2.45rem] font-black leading-[0.9] tracking-[-0.045em] text-white sm:text-6xl sm:leading-[0.95]">Style that feels<br /><em className="font-serif font-normal text-amber-200">like you.</em></h2>
                        <p className="mt-5 max-w-lg text-sm leading-6 text-stone-300 sm:mt-6">สวัสดีคุณ {userProfile.displayName} — เลือกไอเท็มที่ใช่สำหรับทุกวันของคุณ</p>
                    </div>
                    <div className="w-full rounded-2xl border border-white/15 bg-white/10 p-3 text-right backdrop-blur-sm sm:w-auto sm:p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-300">Free shipping</p>
                        <p className="mt-1 text-sm font-bold text-white">เมื่อสั่งซื้อครบ ฿1,500</p>
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-14">
                <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end sm:gap-5">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">Shop by category</p>
                        <h3 className="mt-2 text-2xl font-black tracking-tight text-stone-950 sm:text-3xl">เลือกสิ่งที่เป็นคุณ</h3>
                    </div>
                    <p className="text-sm text-stone-500">พบ {filteredProductsForCustomer.length} รายการ</p>
                </div>

                <div className="category-rail -mx-5 mb-7 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mb-10 sm:px-0">
                    {allCategoryTabs.map(cat => (
                        <button key={cat} onClick={() => setCustomerCategory(cat)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${customerCategory === cat ? 'bg-stone-950 text-white shadow-lg shadow-stone-900/15' : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-950'}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {filteredProductsForCustomer.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-20 text-center">
                        <p className="text-3xl">⌕</p>
                        <p className="mt-3 text-sm font-semibold text-stone-600">ไม่พบสินค้าที่กำลังตามหา</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4">
                        {filteredProductsForCustomer.map((product) => {
                            const isOutOfStock = product.stock <= 0;
                            const quantityInCart = cart.find((item) => item.id === product.id)?.qty || 0;
                            const availableToAdd = Math.max(0, product.stock - quantityInCart);
                            const selectedQuantity = Math.min(selectedQuantities[product.id] || 1, Math.max(1, availableToAdd));
                            return (
                                <article key={product.id} className="product-card group flex flex-col">
                                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-200 sm:aspect-[4/5]">
                                        <img src={product.img} alt={product.name} className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-40' : ''}`} />
                                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-stone-900 backdrop-blur">{product.category}</span>
                                        {isOutOfStock && <span className="absolute inset-0 m-auto flex h-10 w-28 items-center justify-center rounded-full bg-stone-950 text-[10px] font-bold text-white">สินค้าหมด</span>}
                                    </div>
                                    <div className="px-0.5 pt-3 sm:px-1 sm:pt-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <h4 className="min-h-10 text-[13px] font-bold leading-5 text-stone-900 line-clamp-2 sm:text-sm">{product.name}</h4>
                                            <span className="whitespace-nowrap text-sm font-black text-stone-950 sm:text-base">฿{product.price.toLocaleString()}</span>
                                        </div>
                                        <p className={`mt-1 text-[11px] font-medium ${product.stock <= 3 ? 'text-amber-700' : 'text-stone-400'}`}>เหลือ {product.stock} ชิ้น {product.stock <= 3 && product.stock > 0 ? '· ใกล้หมด' : ''}</p>
                                        <div className="mt-3 flex justify-end gap-1.5 sm:mt-4 sm:justify-start sm:gap-2">
                                            <select value={selectedQuantity} onChange={(e) => setSelectedQuantities((quantities) => ({ ...quantities, [product.id]: Number(e.target.value) }))} disabled={availableToAdd === 0} aria-label={`เลือกจำนวน ${product.name}`} className="w-9 rounded-lg border border-stone-200 bg-white px-0.5 py-1.5 text-[11px] font-bold text-stone-700 focus:border-stone-950 focus:outline-none disabled:cursor-not-allowed disabled:bg-stone-100 sm:w-14 sm:rounded-xl sm:px-1.5 sm:py-2.5 sm:text-xs">
                                                {Array.from({ length: availableToAdd }, (_, index) => index + 1).map((quantity) => <option key={quantity} value={quantity}>{quantity}</option>)}
                                            </select>
                                            <button onClick={() => addToCart(product, selectedQuantity)} disabled={isOutOfStock || availableToAdd === 0} className={`w-[4.25rem] flex-none rounded-lg px-1.5 py-1.5 text-[11px] font-bold transition sm:flex-1 sm:w-auto sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs ${isOutOfStock || availableToAdd === 0 ? 'cursor-not-allowed bg-stone-100 text-stone-400' : 'bg-stone-950 text-white hover:bg-amber-700'}`}>
                                                {isOutOfStock ? 'หมดแล้ว' : <><span className="sm:hidden">เพิ่ม</span><span className="hidden sm:inline">เพิ่มลงตะกร้า</span></>}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>

            {isCartOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-stone-950/45 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                    <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">Your bag</p><h3 className="mt-1 text-lg font-black text-stone-950">ตะกร้าของฉัน ({cart.reduce((sum, i) => sum + i.qty, 0)})</h3></div><button onClick={() => setIsCartOpen(false)} className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-950" aria-label="ปิดตะกร้า">✕</button></div>
                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {cart.length === 0 ? <div className="py-20 text-center"><p className="text-3xl">🛍️</p><p className="mt-3 text-sm font-semibold text-stone-600">ตะกร้าของคุณยังว่าง</p><button onClick={() => setIsCartOpen(false)} className="mt-4 text-xs font-bold text-amber-700 underline underline-offset-4">เลือกซื้อสินค้า</button></div> : <>
                                <div className="space-y-4 border-b border-stone-200 pb-5">{cart.map((item) => <div key={item.id} className="flex gap-3"><img src={item.img} alt={item.name} className="h-16 w-14 rounded-xl object-cover" /><div className="min-w-0 flex-1"><h5 className="text-xs font-bold leading-5 text-stone-900 line-clamp-1">{item.name}</h5><p className="mt-1 text-xs font-black text-stone-950">฿{item.price.toLocaleString()}</p></div><div className="flex h-8 items-center overflow-hidden rounded-lg border border-stone-200"><button onClick={() => removeFromCart(item)} className="px-2 text-sm text-stone-600">−</button><span className="px-1 text-xs font-bold">{item.qty}</span><button onClick={() => addToCart(item)} className="px-2 text-sm text-stone-600">+</button></div></div>)}</div>
                                <div className="space-y-4 py-5"><div className="rounded-2xl bg-stone-100 p-3.5"><div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-stone-600"><span>โค้ดส่วนลด</span>{appliedCoupon && <button onClick={removeCoupon} className="text-red-600">ลบ</button>}</div>{appliedCoupon ? <p className="text-xs font-bold text-emerald-700">{appliedCoupon.label} ถูกเลือกแล้ว</p> : <div className="flex gap-2"><input type="text" value={couponCodeInput} onChange={(e) => setCouponCodeInput(e.target.value)} placeholder="SAVE10" className="min-w-0 flex-1 rounded-lg border-0 bg-white px-3 py-2 text-xs focus:ring-1 focus:ring-stone-950" /><button onClick={applyCoupon} className="rounded-lg bg-stone-950 px-3 text-[10px] font-bold text-white">ใช้</button></div>}{couponFeedback && <p className="mt-2 text-[10px] text-stone-500">{couponFeedback}</p>}</div>
                                    <div><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">Delivery details</p><div className="space-y-3"><input type="text" required value={checkoutName} onChange={(e) => setCheckoutName(e.target.value)} placeholder="ชื่อผู้รับสินค้า *" className="checkout-input" /><div className="grid grid-cols-2 gap-3"><input type="text" required value={checkoutPhone} onChange={(e) => setCheckoutPhone(e.target.value)} placeholder="เบอร์โทร *" className="checkout-input" /><select value={checkoutPayment} onChange={(e) => setCheckoutPayment(e.target.value)} className="checkout-input"><option value="bank">โอนเงิน</option><option value="card">บัตรเครดิต</option><option value="wallet">TrueMoney</option></select></div><textarea required rows="2" value={checkoutAddress} onChange={(e) => setCheckoutAddress(e.target.value)} placeholder="ที่อยู่จัดส่ง *" className="checkout-input resize-none" /></div></div>
                                </div>
                            </>}
                        </div>
                        <div className="border-t border-stone-200 bg-stone-50 px-6 py-5"><div className="mb-4 space-y-2 text-xs text-stone-600"><div className="flex justify-between"><span>ยอดรวมสินค้า</span><span>฿{cartSubtotal.toLocaleString()}</span></div>{discountAmount > 0 && <div className="flex justify-between text-emerald-700"><span>ส่วนลด</span><span>-฿{discountAmount.toLocaleString()}</span></div>}<div className="flex justify-between"><span>จัดส่ง</span><span>{shippingFee === 0 ? 'ฟรี' : `฿${shippingFee.toLocaleString()}`}</span></div><div className="flex justify-between border-t border-stone-200 pt-3 text-base font-black text-stone-950"><span>ยอดสุทธิ</span><span>฿{grandTotal.toLocaleString()}</span></div></div><button onClick={handleCheckout} disabled={cart.length === 0} className="w-full rounded-xl bg-stone-950 py-3 text-xs font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-stone-300">ยืนยันคำสั่งซื้อ</button>{cart.length > 0 && <button onClick={clearCart} className="mt-3 w-full text-[10px] font-bold text-stone-400 hover:text-red-600">ล้างตะกร้า</button>}</div>
                    </aside>
                </div>
            )}
        </div>
    );
}

export default CustomerView;
