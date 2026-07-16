import React from 'react';
import { formatDateDisplay } from '../utils/helpers';

function SellerView({ state }) {
    const {
        filteredProductsForSeller, sellerCategory, setSellerCategory,
        allCategoryTabs, adjustStock, startEditingProduct, handleDeleteProduct,
        newProduct, setNewProduct, customCategoryInput, setCustomCategoryInput,
        sellerStats,
        newProductImagePreview, setNewProductImagePreview, dropdownOptions,
        handleAddProduct, isOrderViewOpen, setIsOrderViewOpen,
        isAddProductViewOpen, setIsAddProductViewOpen,
        isInventoryViewOpen, setIsInventoryViewOpen,
        isAdminManagementViewOpen, setIsAdminManagementViewOpen,
        adminAccounts, newAdminUsername, setNewAdminUsername,
        newAdminPassword, setNewAdminPassword, handleCreateAdmin, handleDeleteAdmin,
        customerAccounts, isCustomerAccountViewOpen, setIsCustomerAccountViewOpen,
        customerAccountSearch, setCustomerAccountSearch, filteredCustomerAccounts,
        orders, filteredOrders, orderDateFilter, setOrderDateFilter,
        orderDateFrom, setOrderDateFrom,
        orderDateTo, setOrderDateTo,
        clearAllFilters,
        handleClearOrders, handleDeleteSingleOrder,
        editingProduct, setEditingProduct, editCategoryInput, setEditCategoryInput,
        editProductImagePreview, setEditProductImagePreview, handleSaveEditProduct
    } = state;

    const handleNewProductImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setNewProductImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleEditProductImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setEditProductImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const hasActiveFilters = orderDateFilter || orderDateFrom || orderDateTo;
    const isFocusedSellerView = isAddProductViewOpen || isInventoryViewOpen || isCustomerAccountViewOpen || isAdminManagementViewOpen || isOrderViewOpen;
    const returnToDashboard = () => {
        setIsAddProductViewOpen(false);
        setIsInventoryViewOpen(false);
        setIsCustomerAccountViewOpen(false);
        setIsAdminManagementViewOpen(false);
        setIsOrderViewOpen(false);
    };

    return (
        <div className="flex-grow container mx-auto px-6 py-10">
            <div className="mb-8 border-b border-gray-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-950 flex items-center gap-2">⚙️ Dashboard ผู้จัดการระบบหลังบ้าน</h2>
                    <p className="text-xs text-gray-500 mt-1">คุณสามารถเพิ่มไอเท็มใหม่ ตรวจสอบคลังสินค้า และเปิดเช็คประวัติรายการสั่งซื้อออเดอร์ของลูกค้าได้ที่นี่</p>
                </div>
                {isOrderViewOpen && (
                    <button onClick={returnToDashboard} className="text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm bg-gray-700 hover:bg-gray-800 text-white">
                        <span>← กลับแดชบอร์ด</span>
                    </button>
                )}
            </div>

            {!isFocusedSellerView && (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">จำนวนสินค้า</p>
                    <p className="text-xl font-black text-gray-900 mt-1">{sellerStats.totalProducts}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">สินค้าต่ำสต็อก</p>
                    <p className="text-xl font-black text-amber-600 mt-1">{sellerStats.lowStockProducts}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">ยอดออเดอร์ / รายได้</p>
                    <p className="text-lg font-black text-gray-900 mt-1">{sellerStats.totalOrders} ออเดอร์</p>
                    <p className="text-[11px] text-gray-500">รวม ฿{sellerStats.totalSales.toLocaleString()}</p>
                </div>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                    <button type="button" onClick={() => { returnToDashboard(); setIsAdminManagementViewOpen(true); }} className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm text-left hover:border-purple-300 hover:bg-purple-50/30 transition">
                        <span className="text-2xl">👥</span>
                        <span className="block mt-3 text-base font-extrabold text-gray-900">เพิ่มบัญชีผู้ดูแล</span>
                        <span className="block mt-1 text-xs text-gray-400">สร้างและจัดการบัญชีผู้ดูแล</span>
                    </button>
                    <button type="button" onClick={() => { returnToDashboard(); setIsCustomerAccountViewOpen(true); }} className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm text-left hover:border-blue-300 hover:bg-blue-50/30 transition">
                        <span className="text-2xl">🧑‍💼</span>
                        <span className="block mt-3 text-base font-extrabold text-gray-900">รายชื่อบัญชีลูกค้า</span>
                        <span className="block mt-1 text-xs text-gray-400">{customerAccounts.length} บัญชี · ค้นหารายชื่อลูกค้า</span>
                    </button>
                    <button type="button" onClick={() => { returnToDashboard(); setIsOrderViewOpen(true); }} className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm text-left hover:border-amber-300 hover:bg-amber-50/30 transition">
                        <span className="text-2xl">📋</span>
                        <span className="block mt-3 text-base font-extrabold text-gray-900">เช็คออเดอร์ลูกค้า</span>
                        <span className="block mt-1 text-xs text-gray-400">{orders.length} ออเดอร์ · ตรวจสอบคำสั่งซื้อ</span>
                    </button>
                    <button type="button" onClick={() => { setIsAddProductViewOpen(true); setIsInventoryViewOpen(false); }} className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm text-left hover:border-purple-300 hover:bg-purple-50/30 transition">
                        <span className="text-2xl">➕</span>
                        <span className="block mt-3 text-base font-extrabold text-gray-900">นำสินค้าใหม่เข้าร้าน</span>
                        <span className="block mt-1 text-xs text-gray-400">เปิดหน้าสำหรับเพิ่มสินค้าใหม่</span>
                    </button>
                    <button type="button" onClick={() => { setIsInventoryViewOpen(true); setIsAddProductViewOpen(false); }} className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm text-left hover:border-blue-300 hover:bg-blue-50/30 transition">
                        <span className="text-2xl">📦</span>
                        <span className="block mt-3 text-base font-extrabold text-gray-900">รายงานสต็อกสินค้าหน้าร้าน</span>
                        <span className="block mt-1 text-xs text-gray-400">{filteredProductsForSeller.length} รายการ · ตรวจสอบและจัดการสต็อก</span>
                    </button>
                </section>
            </>
            )}

            {isAdminManagementViewOpen && (
                <section className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-gray-100">
                        <div>
                            <h3 className="text-base font-extrabold text-gray-900">👥 เพิ่มบัญชีผู้ดูแล</h3>
                            <p className="text-[11px] text-gray-400 mt-1">สร้างและจัดการบัญชีผู้ดูแลระบบ</p>
                        </div>
                        <button type="button" onClick={returnToDashboard} className="text-xs font-bold text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">← กลับ</button>
                    </div>
                    <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input type="email" required value={newAdminUsername} onChange={(e) => setNewAdminUsername(e.target.value)} placeholder="อีเมลผู้ดูแลใหม่" className="px-3 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-purple-500 focus:outline-none" />
                        <input type="password" required minLength="6" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} placeholder="รหัสผ่าน 6 ตัวขึ้นไป" className="px-3 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-purple-500 focus:outline-none" />
                        <button type="submit" className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs transition">เพิ่มผู้ดูแล</button>
                    </form>
                    {adminAccounts.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 mb-2">ผู้ดูแลเพิ่มเติม</p>
                            <div className="flex flex-wrap gap-2">
                                {adminAccounts.map((account) => (
                                    <span key={account.username} className="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 px-2 py-1 text-[10px] font-semibold">
                                        {account.username}
                                        <button type="button" onClick={() => handleDeleteAdmin(account.username)} className="text-red-500 hover:text-red-700 font-black leading-none" aria-label={`ลบบัญชีผู้ดูแล ${account.username}`} title="ลบบัญชีผู้ดูแล">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {isCustomerAccountViewOpen && (
                <section className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
                        <div>
                            <h3 className="text-base font-extrabold text-gray-900">🧑‍💼 รายชื่อบัญชีลูกค้า</h3>
                            <p className="text-[11px] text-gray-400 mt-1">ทั้งหมด {customerAccounts.length} บัญชี</p>
                        </div>
                        <button type="button" onClick={() => { setCustomerAccountSearch(''); returnToDashboard(); }} className="px-3 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">← กลับ</button>
                    </div>
                    <div className="relative my-4">
                        <input type="search" value={customerAccountSearch} onChange={(e) => setCustomerAccountSearch(e.target.value)} placeholder="ค้นหาชื่อผู้ใช้, ชื่อ หรืออีเมล..." className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-blue-500 focus:outline-none" />
                        <span className="absolute left-3 top-2.5 text-sm text-gray-400">🔍</span>
                    </div>
                    {filteredCustomerAccounts.length === 0 ? (
                        <p className="py-8 text-center text-xs text-gray-400">ไม่พบบัญชีลูกค้าที่ค้นหา</p>
                    ) : (
                        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                            {filteredCustomerAccounts.map((account) => (
                                <div key={account.username} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 text-xs">
                                    <div><p className="font-bold text-gray-800">{account.displayName}</p><p className="mt-0.5 text-[10px] text-gray-400">ชื่อผู้ใช้: {account.username}</p></div>
                                    <span className="text-[11px] text-gray-500">{account.email || 'ไม่ได้ระบุอีเมล'}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {isOrderViewOpen ? (
                <div className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden animate-fadeIn">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-base font-extrabold text-gray-950 flex items-center gap-2">
                                    📋 รายการออเดอร์ที่ถูกบันทึกทั้งหมด ({filteredOrders.length} ออเดอร์)
                                </h3>
                                <p className="text-[11px] text-gray-400 mt-0.5">ใช้ตรวจสอบวันเวลาทำรายการ, สถานะการโอน, เบอร์โทรศัพท์ และที่อยู่ผู้รับ</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        placeholder="ค้นหา (เช่น วันที่, เลขออเดอร์, ชื่อลูกค้า)..."
                                        value={orderDateFilter}
                                        onChange={(e) => setOrderDateFilter(e.target.value)}
                                        className="w-full md:w-56 pl-9 pr-8 py-2 text-xs rounded-xl border border-gray-250 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                                    />
                                    <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
                                    {orderDateFilter && (
                                        <button
                                            onClick={() => setOrderDateFilter('')}
                                            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 text-xs"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 flex-wrap sm:flex-nowrap">
                                    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">📅 ช่วงวันที่:</span>
                                    <input
                                        type="date"
                                        value={orderDateFrom}
                                        onChange={(e) => setOrderDateFrom(e.target.value)}
                                        className="w-24 sm:w-28 text-xs px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 bg-white"
                                        title="วันที่เริ่มต้น"
                                    />
                                    <span className="text-[10px] text-gray-400">—</span>
                                    <input
                                        type="date"
                                        value={orderDateTo}
                                        onChange={(e) => setOrderDateTo(e.target.value)}
                                        className="w-24 sm:w-28 text-xs px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 bg-white"
                                        title="วันที่สิ้นสุด"
                                    />
                                    {(orderDateFrom || orderDateTo) && (
                                        <button
                                            onClick={() => {
                                                setOrderDateFrom('');
                                                setOrderDateTo('');
                                            }}
                                            className="text-[10px] font-bold text-red-400 hover:text-red-600 transition px-1 py-1"
                                            title="ล้างตัวกรองวันที่"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                {orders.length > 0 && (
                                    <button
                                        onClick={handleClearOrders}
                                        className="text-xs font-bold text-red-500 hover:text-red-700 transition px-4 py-2 border border-red-200 rounded-xl hover:bg-red-50 whitespace-nowrap"
                                    >
                                        🗑️ ล้างออเดอร์ทั้งหมด
                                    </button>
                                )}
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div className="mt-3 flex items-center gap-2 flex-wrap pt-2 border-t border-gray-200">
                                <span className="text-[10px] font-bold text-gray-400">ตัวกรองที่ใช้งาน:</span>
                                {orderDateFilter && (
                                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                                        ค้นหา: "{orderDateFilter}"
                                    </span>
                                )}
                                {orderDateFrom && (
                                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                        ตั้งแต่ {formatDateDisplay(orderDateFrom)}
                                    </span>
                                )}
                                {orderDateTo && (
                                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                        ถึง {formatDateDisplay(orderDateTo)}
                                    </span>
                                )}
                                <span className="text-[10px] text-gray-400 ml-1">
                                    (พบ {filteredOrders.length} ออเดอร์)
                                </span>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-[10px] font-bold text-red-400 hover:text-red-600 transition ml-2"
                                    >
                                        ล้างทั้งหมด
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-16 text-gray-400 text-xs flex flex-col items-center justify-center gap-2">
                            <span className="text-3xl">📭</span>
                            <span>
                                {hasActiveFilters
                                    ? 'ไม่พบข้อมูลออเดอร์ที่ตรงกับตัวกรองที่เลือก'
                                    : 'ยังไม่มีประวัติการทำรายการสั่งซื้อใดๆ ในระบบ'}
                            </span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                                        <th className="py-4 px-6">เลขออเดอร์</th>
                                        <th className="py-4 px-6">📅 วันที่ & 🕒 เวลาสั่งซื้อ</th>
                                        <th className="py-4 px-6">ลูกค้า & สิทธิ์ชำระเงิน</th>
                                        <th className="py-4 px-6">ผู้รับปลายทาง / เบอร์ติดต่อ</th>
                                        <th className="py-4 px-6">สินค้าทั้งหมด</th>
                                        <th className="py-4 px-6 text-right">ยอดรวมสุทธิ</th>
                                        <th className="py-4 px-6 text-center">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-150 text-xs">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.orderId} className="hover:bg-gray-50/20 transition">
                                            <td className="py-4 px-6"><span className="font-black text-blue-600 text-sm block">{order.orderId}</span></td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-md"><span>📅</span> {order.date}</span>
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-800 text-[11px] font-bold rounded-md ml-1 sm:ml-0 block sm:w-fit"><span>🕒</span> {order.time || 'ไม่ระบุเวลา'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[11px] block w-fit mb-1.5">{order.buyer}</span>
                                                <span className="text-[10px] text-gray-550 block font-semibold">💳 {order.payment}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="max-w-[200px] text-gray-600 leading-relaxed text-[11px]">
                                                    <p className="font-bold text-gray-800">📞 โทร: {order.contact}</p>
                                                    <p className="line-clamp-2 mt-1">{order.address}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="text-gray-700 flex items-center gap-1.5">
                                                            <span className="w-2.5 h-2.5 rounded-full bg-purple-100 flex items-center justify-center text-[8px] font-bold text-purple-700">{idx + 1}</span>
                                                            <span className="font-semibold">{item.name}</span>
                                                            <span className="text-gray-400">(x{item.qty})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right font-black text-gray-950 text-sm">฿{order.total.toLocaleString()}</td>
                                            <td className="py-4 px-6 text-center">
                                                <button onClick={() => handleDeleteSingleOrder(order.orderId, order.buyer)} className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs">✓ สำเร็จออเดอร์</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className={isAddProductViewOpen ? 'max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-150' : 'hidden'}>
                        <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-gray-100">
                            <h3 className="text-base font-extrabold text-gray-900">➕ นำสินค้าใหม่เข้าร้าน</h3>
                            <button type="button" onClick={returnToDashboard} className="text-xs font-bold text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">← กลับ</button>
                        </div>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">ชื่อสินค้า *</label>
                                <input type="text" required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="เช่น เสื้อโค้ทกันหนาวสไตล์เกาหลี" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-purple-500 focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">ราคา (บาท) *</label>
                                    <input type="number" required min="0" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="เช่น 1200" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-purple-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">สต็อกเริ่มต้น *</label>
                                    <input type="number" required min="0" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="เช่น 20" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-purple-500 focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">หมวดหมู่สินค้า *</label>
                                <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-purple-500 focus:outline-none bg-white mb-2">
                                    {dropdownOptions.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                    <option value="CUSTOM_OPTION" className="text-purple-600 font-bold">➕ เพิ่มหมวดหมู่ใหม่เอง...</option>
                                </select>
                                {newProduct.category === 'CUSTOM_OPTION' && (
                                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 mt-2">
                                        <label className="block text-[10px] font-bold text-purple-700 mb-1">พิมพ์ระบุหมวดหมู่ใหม่:</label>
                                        <input type="text" required={newProduct.category === 'CUSTOM_OPTION'} value={customCategoryInput} onChange={(e) => setCustomCategoryInput(e.target.value)} placeholder="เช่น กระเป๋า, อุปกรณ์เสริม" className="w-full px-3 py-2 rounded-lg border border-purple-200 text-xs focus:border-purple-500 focus:outline-none bg-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">รูปภาพสินค้า</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-purple-400 transition bg-gray-50 flex flex-col items-center justify-center cursor-pointer relative mb-3">
                                    <input type="file" accept="image/*" id="newProductImage" onChange={handleNewProductImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    {newProductImagePreview ? (
                                        <div className="text-center">
                                            <img src={newProductImagePreview} alt="preview" className="h-20 w-20 object-cover rounded-md mx-auto mb-1.5 shadow-sm border border-gray-150" />
                                            <p className="text-[9px] text-purple-600 font-bold">เลือกรูปใหม่แล้ว ✓</p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-2">
                                            <svg className="h-6 w-6 text-gray-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <p className="text-[10px] text-gray-550 font-semibold">คลิกเพื่ออัปโหลดจากเครื่อง</p>
                                        </div>
                                    )}
                                </div>
                                <div className="relative flex items-center justify-center my-2">
                                    <span className="absolute bg-white px-2 text-[9px] text-gray-400 uppercase font-bold tracking-wider">หรือ</span>
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <input type="url" value={newProduct.img} onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })} placeholder="ใส่ลิงก์ภาพ URL แทนได้" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-purple-500 focus:outline-none mt-2" />
                            </div>
                            <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs shadow-md transition-all mt-4">บันทึกเข้าสู่คลังสินค้า</button>
                        </form>
                    </div>

                    <div className={isInventoryViewOpen ? 'max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden' : 'hidden'}>
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-extrabold text-gray-900">📦 รายงานสต็อกสินค้าหน้าร้าน ({filteredProductsForSeller.length} รายการ)</h3>
                                    <p className="text-[11px] text-gray-400 mt-0.5">บริหารจัดการสต็อกได้อย่างรวดเร็ว</p>
                                </div>
                                <button type="button" onClick={returnToDashboard} className="text-xs font-bold text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">← กลับ</button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-150">
                                {allCategoryTabs.map((cat) => (
                                    <button key={cat} onClick={() => setSellerCategory(cat)} className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${sellerCategory === cat ? 'bg-purple-600 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            {filteredProductsForSeller.length === 0 ? (
                                <div className="text-center py-16 text-gray-400 text-xs">ไม่พบรายการสินค้าใดๆ ในหมวดหมู่นี้</div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                                            <th className="py-4 px-6">สินค้า</th>
                                            <th className="py-4 px-6">หมวดหมู่</th>
                                            <th className="py-4 px-6">ราคา</th>
                                            <th className="py-4 px-6 text-center">คลังคงเหลือ</th>
                                            <th className="py-4 px-6 text-center">การจัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredProductsForSeller.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50/30 transition">
                                                <td className="py-4 px-6 flex items-center space-x-4">
                                                    <img src={product.img} alt={product.name} className="w-10 h-10 object-cover rounded-md bg-gray-100 flex-shrink-0" />
                                                    <div className="font-bold text-gray-900 text-xs line-clamp-2 max-w-[170px]">{product.name}</div>
                                                </td>
                                                <td className="py-4 px-6"><span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{product.category}</span></td>
                                                <td className="py-4 px-6 font-bold text-gray-900 text-xs">฿{product.price.toLocaleString()}</td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-center space-x-1.5">
                                                        <button onClick={() => adjustStock(product.id, -1)} className="w-6 h-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center justify-center font-bold text-xs">-</button>
                                                        <span className="w-8 text-center font-bold text-xs text-gray-900">{product.stock}</span>
                                                        <button onClick={() => adjustStock(product.id, 1)} className="w-6 h-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center justify-center font-bold text-xs">+</button>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <button onClick={() => startEditingProduct(product)} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition">แก้ไข</button>
                                                        <span className="text-gray-300">|</span>
                                                        <button onClick={() => handleDeleteProduct(product.id, product.name)} className="text-xs font-bold text-red-500 hover:text-red-700 transition">ลบออก</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {editingProduct && (
                <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setEditingProduct(null)}></div>
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative z-10 border border-gray-100 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                            <h3 className="text-base font-extrabold text-gray-900">✏️ แก้ไขรายละเอียดสินค้า</h3>
                            <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-650 text-sm">✕</button>
                        </div>
                        <form onSubmit={handleSaveEditProduct} className="space-y-4">
                            <div className="flex justify-center mb-2">
                                <img src={editProductImagePreview || editingProduct.img || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80'} alt="preview" className="w-24 h-24 object-cover rounded-lg border border-gray-150 bg-gray-50 shadow-xs" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">ชื่อสินค้า *</label>
                                <input type="text" required value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-purple-500 focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">ราคา (บาท) *</label>
                                    <input type="number" required min="0" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-purple-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">จำนวนสต็อก *</label>
                                    <input type="number" required min="0" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-purple-500 focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">หมวดหมู่สินค้า *</label>
                                <select value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-purple-500 focus:outline-none bg-white">
                                    {dropdownOptions.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                    <option value="CUSTOM_OPTION" className="text-purple-600 font-bold">➕ เพิ่มหมวดหมู่ใหม่เอง...</option>
                                </select>
                                {editingProduct.category === 'CUSTOM_OPTION' && (
                                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 mt-2">
                                        <label className="block text-[10px] font-bold text-purple-700 mb-1">พิมพ์ระบุหมวดหมู่ใหม่:</label>
                                        <input type="text" required={editingProduct.category === 'CUSTOM_OPTION'} value={editCategoryInput} onChange={(e) => setEditCategoryInput(e.target.value)} placeholder="เช่น กระเป๋า, อุปกรณ์เสริม" className="w-full px-3 py-2 rounded-lg border border-purple-200 text-xs focus:border-purple-500 focus:outline-none bg-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">เปลี่ยนรูปภาพสินค้า</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-purple-400 transition bg-gray-50 flex flex-col items-center justify-center cursor-pointer relative mb-3">
                                    <input type="file" accept="image/*" id="editProductImage" onChange={handleEditProductImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <div className="text-center py-1">
                                        <svg className="h-5 w-5 text-gray-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <p className="text-[10px] text-gray-550 font-semibold">อัปโหลดไฟล์ภาพใหม่จากเครื่อง</p>
                                    </div>
                                </div>
                                <div className="relative flex items-center justify-center my-2">
                                    <span className="absolute bg-white px-2 text-[9px] text-gray-400 uppercase font-bold tracking-wider">หรือ</span>
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <input type="url" value={editingProduct.img} onChange={(e) => setEditingProduct({ ...editingProduct, img: e.target.value })} placeholder="เปลี่ยนด้วยลิงก์ภาพ URL แทน" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-purple-500 focus:outline-none mt-2" />
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-gray-100">
                                <button type="button" onClick={() => { setEditingProduct(null); }} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs transition">ยกเลิก</button>
                                <button type="submit" className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs shadow-md transition">บันทึกการแก้ไข</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellerView;
