import React from 'react';

function SettingsView({ state }) {
    const {
        userProfile, settingsForm, setSettingsForm, handleSaveSettings,
        currentUser, oldPassword, setOldPassword, newPassword, setNewPassword,
        handleChangePassword, customerOrders
    } = state;

    return (
        <div className="flex-grow">
<<<<<<< HEAD
            <div className="container mx-auto max-w-4xl px-4 py-7 sm:px-6 sm:py-10">
=======
            <div className="container mx-auto px-6 py-10 max-w-4xl">
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
                <div className="mb-8 border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-black text-gray-950">👤 การตั้งค่าโปรไฟล์และบัญชี</h2>
                    <p className="text-xs text-gray-500 mt-1">จัดการที่อยู่จัดส่งสินค้า วิธีการชำระเงินที่ต้องการ และอัปเดตข้อมูลความปลอดภัยของบัญชีผู้ใช้นี้</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-150 h-fit space-y-6 text-center">
                        <div>
                            <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-3 shadow-inner">
                                {userProfile.displayName.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="font-bold text-gray-900 text-base">{userProfile.displayName}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{userProfile.email}</p>
                        </div>
                        <div className="border-t border-gray-100 pt-4 text-left space-y-3">
                            <div>
                                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">สถานะสมาชิก</span>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                                    {currentUser ? 'บัญชีสมาชิกยืนยันแล้ว' : 'ผู้มาเยือน (Guest Account)'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">เบอร์โทรศัพท์ติดต่อ</span>
                                <span className="text-xs text-gray-700 font-semibold">{userProfile.phone || 'ยังไม่กำหนด'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs">
                            <h4 className="text-sm font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">📦 ข้อมูลส่วนตัวและที่อยู่จัดส่งหลัก</h4>
                            <form onSubmit={handleSaveSettings} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">ชื่อแสดงผลลูกค้า *</label>
                                        <input type="text" required value={settingsForm.displayName} onChange={(e) => setSettingsForm({ ...settingsForm, displayName: e.target.value })} className="w-full px-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">เบอร์โทรติดต่อ *</label>
                                        <input type="text" required value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} className="w-full px-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-amber-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">อีเมลผู้ใช้งาน</label>
<<<<<<< HEAD
                                    <input type="email" value={settingsForm.email} readOnly className="w-full cursor-not-allowed bg-gray-50 px-4 py-2 text-xs rounded-lg border border-gray-200 text-gray-500" />
                                    <p className="mt-1 text-[10px] text-gray-400">อีเมลเชื่อมกับบัญชี Supabase และแก้ไขจากหน้าโปรไฟล์นี้ไม่ได้</p>
=======
                                    <input type="email" value={settingsForm.email} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} className="w-full px-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-amber-500" />
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">ที่อยู่จัดส่งสินค้าโดยเริ่มต้น *</label>
                                    <textarea required rows="3" value={settingsForm.address} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} placeholder="ใส่ที่อยู่จัดส่งเพื่อให้ระบบกรอกใบเสร็จให้อัตโนมัติ..." className="w-full px-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-amber-500 bg-white"></textarea>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">ช่องทางชำระเงินที่สะดวกที่สุด</label>
                                    <select value={settingsForm.defaultPayment} onChange={(e) => setSettingsForm({ ...settingsForm, defaultPayment: e.target.value })} className="w-full px-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-amber-500 bg-white">
                                        <option value="bank">โอนเงินเข้าบัญชีธนาคาร (Bank Transfer)</option>
                                        <option value="card">บัตรเครดิต/เดบิตหลัก (Credit Card)</option>
                                        <option value="wallet">กระเป๋าเงินออนไลน์ (TrueMoney Wallet)</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition-all shadow-xs">บันทึกข้อมูลและที่อยู่จัดส่งหลัก</button>
                            </form>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs">
                            <h4 className="text-sm font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">🧾 ประวัติคำสั่งซื้อของคุณ</h4>
                            {customerOrders.length === 0 ? (
                                <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-400">ยังไม่มีประวัติคำสั่งซื้อในระบบสำหรับบัญชีนี้</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {customerOrders.slice(0, 4).map((order) => (
                                        <div key={order.orderId} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <div>
                                                    <p className="text-[11px] font-black text-gray-900">{order.orderId}</p>
                                                    <p className="text-[10px] text-gray-500">{order.date} • {order.time}</p>
                                                </div>
                                                <span className="text-[11px] font-black text-blue-600">฿{order.total.toLocaleString()}</span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2">
<<<<<<< HEAD
                                                <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full">{({ pending: 'รอชำระเงิน', paid: 'ชำระแล้ว', packing: 'กำลังแพ็ก', shipped: 'จัดส่งแล้ว', completed: 'สำเร็จ', cancelled: 'ยกเลิก' })[order.status] || 'รอชำระเงิน'}</span>
                                                {order.trackingNumber && <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">พัสดุ: {order.trackingNumber}</span>}
=======
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
                                                {order.couponLabel && (
                                                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{order.couponLabel}</span>
                                                )}
                                                <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{order.payment}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs">
<<<<<<< HEAD
                            <h4 className="text-sm font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">🔒 ความปลอดภัย</h4>
=======
                            <h4 className="text-sm font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">🔒 ความปลอดภัย (จำลองเปลี่ยนรหัสผ่าน)</h4>
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
                            {currentUser ? (
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">รหัสผ่านเดิมปัจจุบัน</label>
                                            <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="••••••" className="w-full px-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-red-400" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">รหัสผ่านใหม่ที่ต้องการใช้</label>
                                            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••" className="w-full px-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-red-400" />
                                        </div>
                                    </div>
                                    <button type="submit" className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition">เปลี่ยนรหัสผ่านบัญชีของฉัน</button>
                                </form>
                            ) : (
                                <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-400">คุณล็อกอินแบบ Guest อยู่ กรุณา "สมัครสมาชิก" หรือ "เข้าสู่ระบบ" เพื่อตั้งค่าระบบรหัสผ่านความปลอดภัยที่นี่</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

<<<<<<< HEAD
export default SettingsView;
=======
export default SettingsView;
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
