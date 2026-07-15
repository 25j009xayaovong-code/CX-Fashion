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
        <div className="flex-grow">
            <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-14 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">SHOP THE LATEST TRENDS</h2>
                    <p className="text-gray-400 text-sm mb-6 font-medium">ยินดีต้อนรับคุณ {userProfile.displayName}! ค้นหาและช้อปปิ้งออนไลน์ที่นี่</p>
                    <div className="flex justify-center gap-1.5 flex-wrap">
                        {allCategoryTabs.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCustomerCategory(cat)}
                                className={`text-xs px-4 py-2 rounded-full transition-all duration-200 ${customerCategory === cat ? 'bg-white text-gray-900 font-black shadow-sm' : 'bg-white/10 hover:bg-white/20 text-white font-medium'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <main className="container mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-extrabold text-gray-950">รายการหมวดหมู่: <span className="text-blue-600">{customerCategory}</span></h3>
                </div>

                {filteredProductsForCustomer.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-250">
                        <p className="text-gray-450 text-sm">ไม่พบรายการสินค้าที่คุณกำลังตามหา</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {filteredProductsForCustomer.map((product) => {
                            const isOutOfStock = product.stock <= 0;
                            const quantityInCart = cart.find((item) => item.id === product.id)?.qty || 0;
                            const availableToAdd = Math.max(0, product.stock - quantityInCart);
                            const selectedQuantity = Math.min(selectedQuantities[product.id] || 1, Math.max(1, availableToAdd));
                            return (
                                <div key={product.id} className="bg-white rounded-xl shadow-xs border border-gray-150 overflow-hidden hover:shadow-md transition duration-300 flex flex-col justify-between">
                                    <div className="relative bg-gray-100 h-72">
                                        <img src={product.img} alt={product.name} className={`w-full h-full object-cover ${isOutOfStock ? 'opacity-40 grayscale' : ''}`} />
                                        <span className="absolute top-3 left-3 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">{product.category}</span>
                                        {isOutOfStock && <span className="absolute inset-0 m-auto h-10 w-28 bg-red-600 text-white text-xs font-black rounded-lg flex items-center justify-center shadow-md">หมดคลังชั่วคราว</span>}
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h4>
                                            <p className="text-[11px] text-gray-400 mb-3">คงเหลือในร้าน: {product.stock} ชิ้น</p>
                                        </div>
                                        <div className="flex justify-between items-center gap-2 pt-2 border-t border-gray-50">
                                            <span className="text-lg font-black text-gray-950">฿{product.price.toLocaleString()}</span>
                                            <div className="flex items-center gap-1.5">
                                                <select
                                                    value={selectedQuantity}
                                                    onChange={(e) => setSelectedQuantities((quantities) => ({ ...quantities, [product.id]: Number(e.target.value) }))}
                                                    disabled={availableToAdd === 0}
                                                    aria-label={`เลือกจำนวน ${product.name}`}
                                                    className="w-14 rounded-lg border border-gray-200 bg-white px-1.5 py-2 text-xs font-bold text-gray-700 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                                                >
                                                    {Array.from({ length: availableToAdd }, (_, index) => index + 1).map((quantity) => (
                                                        <option key={quantity} value={quantity}>{quantity}</option>
                                                    ))}
                                                </select>
                                                <button onClick={() => addToCart(product, selectedQuantity)} disabled={isOutOfStock || availableToAdd === 0} className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${isOutOfStock || availableToAdd === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                                                {isOutOfStock ? 'หมด' : 'ใส่ตะกร้า'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Cart Drawer */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsCartOpen(false)}></div>
                    <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-55/10">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-extrabold text-gray-900">🛒 ตะกร้าของฉัน ({cart.reduce((sum, i) => sum + i.qty, 0)})</h3>
                                    {cart.length > 0 && (
                                        <button onClick={clearCart} className="text-[10px] font-bold text-red-500 hover:text-red-700">ล้างตะกร้า</button>
                                    )}
                                </div>
                                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-500">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {cart.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400 text-xs">
                                        <p className="mb-2">ไม่มีสินค้าใดๆ อยู่ในตะกร้า</p>
                                        <button onClick={() => setIsCartOpen(false)} className="text-blue-600 font-bold hover:underline">ไปช้อปปิ้งเพิ่ม</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-4 pb-4 border-b border-gray-100">
                                            {cart.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between">
                                                    <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded-md bg-gray-100 flex-shrink-0" />
                                                    <div className="flex-1 ml-4 pr-2">
                                                        <h5 className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</h5>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">฿{item.price.toLocaleString()} x {item.qty}</p>
                                                    </div>
                                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                                                        <button onClick={() => removeFromCart(item)} className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 font-bold text-xs">-</button>
                                                        <span className="px-2 text-xs font-semibold">{item.qty}</span>
                                                        <button onClick={() => addToCart(item)} className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 font-bold text-xs">+</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-4 pt-2">
                                            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">🎫 คูปองส่วนลด</span>
                                                    {appliedCoupon && (
                                                        <button onClick={removeCoupon} className="text-[10px] font-bold text-red-500">ลบคูปอง</button>
                                                    )}
                                                </div>
                                                {appliedCoupon ? (
                                                    <p className="text-[11px] font-semibold text-emerald-600">{appliedCoupon.label} จะถูกใช้ในคำสั่งซื้อนี้</p>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <input type="text" value={couponCodeInput} onChange={(e) => setCouponCodeInput(e.target.value)} placeholder="SAVE10 / SAVE15 / FREESHIP" className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none" />
                                                        <button onClick={applyCoupon} className="px-3 py-2 bg-gray-900 text-white text-[10px] font-bold rounded-lg">ใช้คูปอง</button>
                                                    </div>
                                                )}
                                                {couponFeedback && <p className="text-[10px] text-gray-500">{couponFeedback}</p>}
                                            </div>

                                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">📍 รายละเอียดการจัดส่งและการชำระเงิน</h4>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-gray-400 mb-1">ชื่อ-นามสกุล ผู้รับเงิน/ของ *</label>
                                                <input type="text" required value={checkoutName} onChange={(e) => setCheckoutName(e.target.value)} placeholder="กรอกชื่อเพื่อส่งของ..." className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[10px] font-semibold text-gray-400 mb-1">เบอร์โทรศัพท์มือถือ *</label>
                                                    <input type="text" required value={checkoutPhone} onChange={(e) => setCheckoutPhone(e.target.value)} placeholder="เช่น 0891234567" className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-semibold text-gray-400 mb-1">วิธีการชำระเงิน *</label>
                                                    <select value={checkoutPayment} onChange={(e) => setCheckoutPayment(e.target.value)} className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none bg-white">
                                                        <option value="bank">โอนเข้าบัญชีธนาคาร</option>
                                                        <option value="card">บัตรเครดิต</option>
                                                        <option value="wallet">TrueMoney Wallet</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-gray-400 mb-1">ที่จัดส่งสินค้าโดยละเอียด *</label>
                                                <textarea required rows="2" value={checkoutAddress} onChange={(e) => setCheckoutAddress(e.target.value)} placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ..." className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none bg-white"></textarea>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <div className="space-y-2 text-xs font-semibold text-gray-700 mb-4">
                                    <div className="flex justify-between">
                                        <span>ยอดรวมสินค้า</span>
                                        <span>฿{cartSubtotal.toLocaleString()}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-emerald-600">
                                            <span>ส่วนลด</span>
                                            <span>-฿{discountAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>ค่าจัดส่ง</span>
                                        <span>{shippingFee === 0 ? 'ฟรี' : `฿${shippingFee.toLocaleString()}`}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                                        <span>ยอดสุทธิ</span>
                                        <span className="text-lg text-blue-600">฿{grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button onClick={handleCheckout} disabled={cart.length === 0} className={`w-full py-2.5 rounded-xl font-bold text-center text-xs shadow-md transition ${cart.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-950 text-white hover:bg-gray-800'}`}>
                                    ชำระเงินและส่งคำสั่งซื้อจำลอง
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerView;
