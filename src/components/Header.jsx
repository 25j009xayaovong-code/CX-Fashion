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
            <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/95 shadow-sm backdrop-blur">
                <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row sm:gap-4 sm:px-6 sm:py-4">
                    <div className="flex w-full items-center justify-between sm:w-auto">
                        <h1
                            onClick={() => { setViewMode('customer'); setSearchQuery(''); setIsOrderViewOpen(false); }}
                            className="cursor-pointer select-none text-lg font-black tracking-tight text-stone-950 sm:text-xl sm:tracking-wider"
                        >
                            FASHION STORE
                        </h1>
                    </div>

                    <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-4">
                        {viewMode !== 'settings' && !isOrderViewOpen && (
                            <div className="relative min-w-0 flex-1 sm:flex-none">
                                <input
                                    type="text"
                                    placeholder="ค้นหาไอเท็ม..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-stone-300 py-2.5 pl-9 pr-3 text-xs focus:border-stone-950 focus:outline-none sm:w-56"
                                />
                                <svg className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        )}

                        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
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
                                <button onClick={handleLogout} className="rounded-xl border border-red-200 px-2.5 py-2.5 text-[11px] font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white sm:px-3 sm:text-xs">
                                    ออกจากระบบ
                                </button>
                            ) : (
                                <button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} className="rounded-xl border border-stone-300 px-2.5 py-2.5 text-[11px] font-bold text-stone-700 transition hover:bg-stone-950 hover:text-white sm:px-3.5 sm:text-xs">
                                    เข้าสู่ระบบ
                                </button>
                            )}

                            {!isAdminUser && viewMode === 'customer' && (
                                <button onClick={() => setIsCartOpen(true)} className="relative rounded-xl p-2.5 text-stone-700 transition hover:bg-stone-100" aria-label="เปิดตะกร้าสินค้า">
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
                        <p className="text-[10px] text-gray-400 text-center mb-6">เข้าสู่ระบบเพื่อบันทึกข้อมูลไว้บนคลาวด์ และใช้งานข้ามเครื่องได้</p>

                        <form onSubmit={handleAuthSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">อีเมล</label>
                                <input
                                    type="text"
                                    value={usernameInput}
                                    onChange={(e) => setUsernameInput(e.target.value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">รหัสผ่าน</label>
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="อย่างน้อย 6 ตัวอักษร"
                                    autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md transition-all mt-6">
                                {authMode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิกใหม่'}
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
