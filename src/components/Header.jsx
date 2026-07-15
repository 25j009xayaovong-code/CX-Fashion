import React from 'react';

function Header({ state }) {
    const {
        viewMode, setViewMode, searchQuery, setSearchQuery,
        currentUser, handleLogout, setIsAuthOpen, setAuthMode,
        setIsCartOpen, cart, setIsOrderViewOpen, isOrderViewOpen,
        isAuthOpen, setIsAuthOpen: closeAuth,
        authMode, setAuthMode: switchAuthMode,
        usernameInput, setUsernameInput,
        passwordInput, setPasswordInput,
        handleAuthSubmit,
        notification, closeNotification
    } = state;

    const isAdminUser = currentUser?.isAdmin === true;

    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-5 justify-between w-full sm:w-auto">
                        <h1
                            onClick={() => { setViewMode('customer'); setSearchQuery(''); setIsOrderViewOpen(false); }}
                            className="text-xl font-black text-gray-950 tracking-wider cursor-pointer select-none"
                        >
                            FASHION STORE
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                        {viewMode !== 'settings' && !isOrderViewOpen && (
                            <div className="relative flex-1 sm:flex-none">
                                <input
                                    type="text"
                                    placeholder="ค้นหาไอเท็ม..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-56 pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-250 focus:outline-none focus:border-gray-500"
                                />
                                <svg className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        )}

                        <div className="flex items-center space-x-2">
                            {currentUser && (
                                <button
                                    onClick={() => { setViewMode('settings'); setSearchQuery(''); setIsOrderViewOpen(false); }}
                                    className={`text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 border ${viewMode === 'settings' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <span>👤</span>
                                    <span className="hidden md:inline">{currentUser.username}</span>
                                </button>
                            )}

                            {currentUser ? (
                                <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-white border border-red-200 hover:bg-red-500 px-3 py-2.5 rounded-xl transition-all">
                                    ออกจากระบบ
                                </button>
                            ) : (
                                <button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} className="text-xs font-bold text-gray-700 hover:text-blue-600 border border-gray-250 px-3.5 py-2.5 rounded-xl hover:bg-gray-50 transition">
                                    เข้าสู่ระบบ
                                </button>
                            )}

                            {!isAdminUser && viewMode === 'customer' && (
                                <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 text-gray-700 hover:bg-gray-100 rounded-full transition">
                                    <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    {cart.length > 0 && (
                                        <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black leading-none text-white bg-blue-600 rounded-full animate-bounce">
                                            {cart.reduce((sum, i) => sum + i.qty, 0)}
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Auth Modal */}
            {isAuthOpen && (
                <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => closeAuth(false)}></div>
                    <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl relative z-10 border border-gray-100">
                        <h3 className="text-xl font-black text-gray-950 mb-1 text-center">
                            {authMode === 'login' ? 'ล็อกอินเข้าสู่ระบบ' : 'สมัครสมาชิกระบบ'}
                        </h3>
                        <p className="text-[10px] text-gray-400 text-center mb-6">ล็อกอินเพื่อบันทึกข้อมูลและดึงที่อยู่จัดส่งของคุณขึ้นมาใช้ทันที</p>

                        <form onSubmit={handleAuthSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">ชื่อบัญชีผู้ใช้งาน</label>
                                <input
                                    type="text"
                                    value={usernameInput}
                                    onChange={(e) => setUsernameInput(e.target.value)}
                                    placeholder="เช่น fashion_admin"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">รหัสผ่าน</label>
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="******"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md transition-all mt-6">
                                {authMode === 'login' ? 'เข้าสู่ระบบจำลอง' : 'สมัครสมาชิกใหม่'}
                            </button>
                        </form>

                        <div className="mt-4 text-center text-xs">
                            <button onClick={() => { switchAuthMode(authMode === 'login' ? 'signup' : 'login'); setPasswordInput(''); }} className="text-blue-600 hover:underline font-bold">
                                {authMode === 'login' ? 'สร้างบัญชีผู้ใช้งานใหม่ตรงนี้' : 'สลับกลับไปยังหน้าล็อกอินหลัก'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification */}
            {notification.isOpen && (
                <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative z-10 border border-gray-100 text-center">
                        <h4 className="text-base font-extrabold text-gray-900 mb-1">{notification.title}</h4>
                        <p className="text-xs text-gray-500 mb-6 whitespace-pre-line leading-relaxed">{notification.message}</p>
                        <div className="flex gap-2 justify-center">
                            {notification.type === 'confirm' ? (
                                <>
                                    <button onClick={closeNotification} className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition">ยกเลิก</button>
                                    <button onClick={notification.onConfirm} className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs transition">ยืนยัน</button>
                                </>
                            ) : (
                                <button onClick={notification.onConfirm} className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition">ตกลง</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;
