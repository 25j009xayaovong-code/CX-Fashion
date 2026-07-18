import React, { useState } from 'react';

function ProductDetail({ product, onBack, addToCart, isFavorite, toggleFavorite, reviews, canReview, submitReview }) {
    const sizes = product.sizes?.length ? product.sizes : ['One size'];
    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const selectedVariant = product.variants?.find((variant) => variant.size === selectedSize);
    const availableStock = selectedVariant?.stock ?? product.stock;
    const isOutOfStock = availableStock <= 0;

    return (
        <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-12">
            <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-stone-600 transition hover:text-amber-700">← กลับไปเลือกสินค้า</button>
            <div className="grid gap-7 lg:grid-cols-2 lg:gap-12">
                <div className="overflow-hidden rounded-3xl bg-white"><img src={product.img} alt={product.name} className="aspect-square h-full w-full object-contain p-3 lg:aspect-[4/5]" /></div>
                <div className="flex flex-col justify-center py-1 sm:py-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">{product.category}</p>
                    <div className="mt-3 flex items-start justify-between gap-4"><h2 className="text-3xl font-black leading-tight tracking-tight text-stone-950 sm:text-5xl">{product.name}</h2><button onClick={() => toggleFavorite(product.id)} className={`rounded-full border p-3 text-lg transition ${isFavorite ? 'border-red-200 bg-red-50 text-red-600' : 'border-stone-200 text-stone-500 hover:border-red-200 hover:text-red-600'}`} aria-label="บันทึกรายการโปรด">{isFavorite ? '♥' : '♡'}</button></div>
                    <p className="mt-4 text-2xl font-black text-stone-950">฿{product.price.toLocaleString()}</p>
                    <p className="mt-6 max-w-lg text-sm leading-7 text-stone-600">{product.description || 'ไอเท็มคัดสรรสำหรับเติมสไตล์ในทุกวันของคุณ'}</p>
                    <div className="mt-8 border-y border-stone-200 py-6">
                        <div className="flex items-center justify-between"><h3 className="text-sm font-black text-stone-950">เลือกไซซ์</h3><span className="text-xs text-stone-500">ไซซ์ที่เลือก: <strong className="text-stone-950">{selectedSize}</strong></span></div>
                        <div className="mt-3 flex flex-wrap gap-2">{sizes.map((size) => { const variant = product.variants?.find((entry) => entry.size === size); const soldOut = (variant?.stock ?? product.stock) <= 0; return <button key={size} onClick={() => { if (!soldOut) { setSelectedSize(size); setQuantity(1); } }} disabled={soldOut} className={`min-w-11 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${selectedSize === size ? 'border-stone-950 bg-stone-950 text-white' : 'border-stone-200 bg-white text-stone-700 hover:border-stone-500'} ${soldOut ? 'cursor-not-allowed opacity-35 line-through' : ''}`}>{size}</button>; })}</div>
                    </div>
                    <div className="mt-6 flex items-center gap-3"><span className="text-xs font-bold text-stone-600">จำนวน</span><div className="flex items-center overflow-hidden rounded-xl border border-stone-200"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-3 py-2 text-lg text-stone-600">−</button><span className="min-w-9 text-center text-sm font-bold">{quantity}</span><button onClick={() => setQuantity((value) => Math.min(availableStock, value + 1))} className="px-3 py-2 text-lg text-stone-600">+</button></div><span className={`text-xs ${availableStock <= 3 ? 'text-amber-700' : 'text-stone-500'}`}>เหลือไซซ์นี้ {availableStock} ชิ้น</span></div>
                    <button onClick={() => addToCart(product, quantity, selectedSize, selectedVariant?.id)} disabled={isOutOfStock} className="mt-7 w-full rounded-xl bg-stone-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-stone-300">{isOutOfStock ? 'ไซซ์นี้หมด' : `เพิ่มไซซ์ ${selectedSize} ลงตะกร้า`}</button>
                    <section className="mt-10 border-t border-stone-200 pt-7">
                        <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">Verified buyers</p><h3 className="mt-1 text-lg font-black text-stone-950">รีวิวจากลูกค้า</h3></div><span className="text-xs font-bold text-stone-500">{reviews.length} รีวิว</span></div>
                        {canReview && <div className="mt-4 rounded-2xl bg-stone-100 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold text-stone-800">ให้คะแนนสินค้าที่คุณเคยซื้อ</p><div className="flex gap-1">{[1, 2, 3, 4, 5].map((star) => <button key={star} onClick={() => setRating(star)} className={`text-lg ${star <= rating ? 'text-amber-500' : 'text-stone-300'}`} aria-label={`${star} ดาว`}>★</button>)}</div></div><textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} maxLength="800" rows="2" placeholder="แบ่งปันประสบการณ์ของคุณ (ไม่บังคับ)" className="mt-3 w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs outline-none focus:border-stone-950" /><button onClick={async () => { if (await submitReview(product.id, rating, reviewText)) setReviewText(''); }} className="mt-3 rounded-xl bg-stone-950 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700">ส่งรีวิว</button></div>}
                        <div className="mt-4 space-y-3">{reviews.length === 0 ? <p className="rounded-xl border border-dashed border-stone-200 py-5 text-center text-xs text-stone-500">ยังไม่มีรีวิวสำหรับสินค้านี้</p> : reviews.slice(0, 4).map((review) => <article key={review.id} className="rounded-xl border border-stone-200 bg-white p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold text-stone-900">{review.reviewer_name}</p><span className="text-xs tracking-wide text-amber-500">{'★'.repeat(review.rating)}<span className="text-stone-200">{'★'.repeat(5 - review.rating)}</span></span></div>{review.comment && <p className="mt-2 text-xs leading-5 text-stone-600">{review.comment}</p>}</article>)}</div>
                    </section>
                </div>
            </div>
        </main>
    );
}

function CustomerView({ state }) {
    const {
        customerCategory, setCustomerCategory, filteredProductsForCustomer, selectedProduct, setSelectedProduct,
        customerPriceRange, setCustomerPriceRange, customerInStockOnly, setCustomerInStockOnly, customerSort, setCustomerSort,
        customerSize, setCustomerSize, customerColor, setCustomerColor, availableSizes, availableColors,
        favoriteProductIds, toggleFavorite,
        getProductReviews, canReviewProduct, submitProductReview,
        allCategoryTabs, addToCart, userProfile, isCartOpen, setIsCartOpen,
        cart, removeFromCart, clearCart, handleCheckout, checkoutName, setCheckoutName,
        checkoutPhone, setCheckoutPhone, checkoutAddress, setCheckoutAddress,
        checkoutPayment, setCheckoutPayment, couponCodeInput, setCouponCodeInput,
        appliedCoupon, couponFeedback, cartSubtotal, discountAmount, shippingFee, grandTotal,
        applyCoupon, removeCoupon, paymentProofFile, setPaymentProofFile
    } = state;
    const [selectedQuantities, setSelectedQuantities] = useState({});

    if (selectedProduct) {
        const currentProduct = filteredProductsForCustomer.find((product) => product.id === selectedProduct.id) || selectedProduct;
        return <div className="flex-grow bg-stone-50"><ProductDetail product={currentProduct} onBack={() => setSelectedProduct(null)} addToCart={addToCart} isFavorite={favoriteProductIds.includes(currentProduct.id)} toggleFavorite={toggleFavorite} reviews={getProductReviews(currentProduct.id)} canReview={canReviewProduct(currentProduct.id)} submitReview={submitProductReview} /></div>;
    }

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
                <div className="mb-8 grid grid-cols-2 gap-2 rounded-2xl border border-stone-200 bg-white p-3 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                    <input type="number" min="0" value={customerPriceRange.min} onChange={(e) => setCustomerPriceRange((range) => ({ ...range, min: e.target.value }))} placeholder="ราคาต่ำสุด" className="min-w-0 rounded-lg border border-stone-200 px-3 py-2 text-xs focus:border-stone-950 focus:outline-none" />
                    <input type="number" min="0" value={customerPriceRange.max} onChange={(e) => setCustomerPriceRange((range) => ({ ...range, max: e.target.value }))} placeholder="ราคาสูงสุด" className="min-w-0 rounded-lg border border-stone-200 px-3 py-2 text-xs focus:border-stone-950 focus:outline-none" />
                    <label className="col-span-2 flex items-center gap-2 text-xs font-semibold text-stone-600 sm:col-auto"><input type="checkbox" checked={customerInStockOnly} onChange={(e) => setCustomerInStockOnly(e.target.checked)} className="accent-stone-950" /> พร้อมส่งเท่านั้น</label>
                    <select value={customerSize} onChange={(e) => setCustomerSize(e.target.value)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 focus:border-stone-950 focus:outline-none"><option value="">ทุกไซซ์</option>{availableSizes.map((size) => <option key={size} value={size}>ไซซ์ {size}</option>)}</select>
                    <select value={customerColor} onChange={(e) => setCustomerColor(e.target.value)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 focus:border-stone-950 focus:outline-none"><option value="">ทุกสี</option>{availableColors.map((color) => <option key={color} value={color}>{color}</option>)}</select>
                    <select value={customerSort} onChange={(e) => setCustomerSort(e.target.value)} className="col-span-2 rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 focus:border-stone-950 focus:outline-none sm:col-auto"><option value="newest">ใหม่ล่าสุด</option><option value="price-low">ราคา: น้อยไปมาก</option><option value="price-high">ราคา: มากไปน้อย</option></select>
                    <button onClick={() => { setCustomerPriceRange({ min: '', max: '' }); setCustomerInStockOnly(false); setCustomerSize(''); setCustomerColor(''); setCustomerSort('newest'); }} className="col-span-2 text-xs font-bold text-stone-500 underline underline-offset-2 sm:col-auto">ล้างตัวกรอง</button>
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
                            const quantityInCart = cart.filter((item) => item.id === product.id).reduce((sum, item) => sum + item.qty, 0);
                            const availableToAdd = Math.max(0, product.stock - quantityInCart);
                            const selectedQuantity = Math.min(selectedQuantities[product.id] || 1, Math.max(1, availableToAdd));
                            return (
                                <article key={product.id} className="product-card group relative flex flex-col">
                                    <button onClick={() => setSelectedProduct(product)} className="relative aspect-square w-full overflow-hidden rounded-2xl bg-stone-200 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 sm:aspect-[4/5]" aria-label={`ดูรายละเอียด ${product.name}`}>
                                        <img src={product.img} alt={product.name} className={`h-full w-full object-contain p-2 transition duration-700 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-40' : ''}`} />
                                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-stone-900 backdrop-blur">{product.category}</span>
                                        {isOutOfStock && <span className="absolute inset-0 m-auto flex h-10 w-28 items-center justify-center rounded-full bg-stone-950 text-[10px] font-bold text-white">สินค้าหมด</span>}
                                        <span className="absolute bottom-3 right-3 rounded-full bg-stone-950/85 px-2.5 py-1 text-[9px] font-bold text-white opacity-0 backdrop-blur transition group-hover:opacity-100">ดูรายละเอียด</span>
                                    </button>
                                    <button onClick={() => toggleFavorite(product.id)} className={`absolute right-2 top-2 z-10 rounded-full bg-white/90 px-2 py-1 text-base shadow-sm backdrop-blur ${favoriteProductIds.includes(product.id) ? 'text-red-600' : 'text-stone-500'}`} aria-label="บันทึกรายการโปรด">{favoriteProductIds.includes(product.id) ? '♥' : '♡'}</button>
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
                                            <button onClick={() => addToCart(product, selectedQuantity, product.sizes?.[0], product.variants?.[0]?.id)} disabled={isOutOfStock || availableToAdd === 0} className={`w-[4.25rem] flex-none rounded-lg px-1.5 py-1.5 text-[11px] font-bold transition sm:flex-1 sm:w-auto sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs ${isOutOfStock || availableToAdd === 0 ? 'cursor-not-allowed bg-stone-100 text-stone-400' : 'bg-stone-950 text-white hover:bg-amber-700'}`}>
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
                                <div className="space-y-4 border-b border-stone-200 pb-5">{cart.map((item) => <div key={item.cartKey || item.id} className="flex gap-3"><img src={item.img} alt={item.name} className="h-16 w-14 rounded-xl object-cover" /><div className="min-w-0 flex-1"><h5 className="text-xs font-bold leading-5 text-stone-900 line-clamp-1">{item.name}</h5><p className="mt-1 text-[10px] font-semibold text-amber-700">ไซซ์: {item.size || 'One size'}</p><p className="mt-1 text-xs font-black text-stone-950">฿{item.price.toLocaleString()}</p></div><div className="flex h-8 items-center overflow-hidden rounded-lg border border-stone-200"><button onClick={() => removeFromCart(item)} className="px-2 text-sm text-stone-600">−</button><span className="px-1 text-xs font-bold">{item.qty}</span><button onClick={() => addToCart(item, 1, item.size, item.variantId)} className="px-2 text-sm text-stone-600">+</button></div></div>)}</div>
                                <div className="space-y-4 py-5"><div className="rounded-2xl bg-stone-100 p-3.5"><div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-stone-600"><span>โค้ดส่วนลด</span>{appliedCoupon && <button onClick={removeCoupon} className="text-red-600">ลบ</button>}</div>{appliedCoupon ? <p className="text-xs font-bold text-emerald-700">{appliedCoupon.label} ถูกเลือกแล้ว</p> : <div className="flex gap-2"><input type="text" value={couponCodeInput} onChange={(e) => setCouponCodeInput(e.target.value)} placeholder="SAVE10" className="min-w-0 flex-1 rounded-lg border-0 bg-white px-3 py-2 text-xs focus:ring-1 focus:ring-stone-950" /><button onClick={applyCoupon} className="rounded-lg bg-stone-950 px-3 text-[10px] font-bold text-white">ใช้</button></div>}{couponFeedback && <p className="mt-2 text-[10px] text-stone-500">{couponFeedback}</p>}</div>
                                    <div><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">Delivery & payment</p><div className="space-y-3"><input type="text" required value={checkoutName} onChange={(e) => setCheckoutName(e.target.value)} placeholder="ชื่อผู้รับสินค้า *" className="checkout-input" /><div className="grid grid-cols-2 gap-3"><input type="text" required value={checkoutPhone} onChange={(e) => setCheckoutPhone(e.target.value)} placeholder="เบอร์โทร *" className="checkout-input" /><select value={checkoutPayment} onChange={(e) => setCheckoutPayment(e.target.value)} className="checkout-input"><option value="bank">โอนเงินธนาคาร</option><option value="wallet">TrueMoney</option></select></div><textarea required rows="2" value={checkoutAddress} onChange={(e) => setCheckoutAddress(e.target.value)} placeholder="ที่อยู่จัดส่ง *" className="checkout-input resize-none" /><label className="block rounded-xl border border-dashed border-amber-300 bg-amber-50 p-3 text-xs font-semibold text-stone-700">แนบหลักฐานการชำระเงิน *<input type="file" accept="image/*" onChange={(event) => setPaymentProofFile(event.target.files?.[0] || null)} className="mt-2 block w-full text-[10px] text-stone-500" />{paymentProofFile && <span className="mt-1 block text-[10px] text-emerald-700">เลือกแล้ว: {paymentProofFile.name}</span>}<span className="mt-1 block text-[10px] font-normal text-stone-500">รองรับรูปภาพไม่เกิน 8 MB</span></label></div></div>
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
