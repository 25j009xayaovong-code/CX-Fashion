import { useState, useEffect } from 'react';
import { DEFAULT_PRODUCTS, DEFAULT_PROFILE } from '../utils/constants';
import { convertFileToBase64, generateOrderId, convertThaiDateToISO } from '../utils/helpers';

export function useAppState() {
    const SPECIAL_ADMIN_USERNAME = 'Rin';
    const SPECIAL_ADMIN_EMAIL = 'rin@example.com';
    const SPECIAL_ADMIN_PASSWORD = '1234';

    const isSpecialAdminCredential = (value, password) => {
        const normalized = String(value || '').trim().toLowerCase();
        return (normalized === SPECIAL_ADMIN_USERNAME.toLowerCase() || normalized === SPECIAL_ADMIN_EMAIL.toLowerCase())
            && String(password || '') === SPECIAL_ADMIN_PASSWORD;
    };

    const getSpecialAdminProfile = () => ({
        ...DEFAULT_PROFILE,
        displayName: SPECIAL_ADMIN_USERNAME,
        email: SPECIAL_ADMIN_EMAIL,
        phone: '081-111-2222',
        address: '123/4 ถ.สุขุมวิท แขวงคลองตัน กรุงเทพฯ 10110',
        defaultPayment: 'bank'
    });

    const getStoredProfile = (username) => {
        if (!username) return DEFAULT_PROFILE;
        try {
            const item = localStorage.getItem(`fashion_profile_${username}`);
            if (item) {
                const parsed = JSON.parse(item);
                return { ...DEFAULT_PROFILE, ...parsed };
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        }
        return DEFAULT_PROFILE;
    };

    const saveUserProfile = (username, profile) => {
        if (!username) return;
        localStorage.setItem(`fashion_profile_${username}`, JSON.stringify(profile));
    };

    const getStoredCustomerAccounts = () => {
        try {
            const storedAdmins = JSON.parse(localStorage.getItem('fashion_admin_accounts') || '[]');
            const adminUsernames = new Set([
                SPECIAL_ADMIN_USERNAME.toLowerCase(),
                ...storedAdmins.map((account) => account.username.toLowerCase())
            ]);

            return Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
                .filter((key) => key?.startsWith('user_db_'))
                .map((key) => key.slice('user_db_'.length))
                .filter((username) => !adminUsernames.has(username.toLowerCase()))
                .map((username) => {
                    const profile = getStoredProfile(username);
                    return {
                        username,
                        displayName: profile.displayName || username,
                        email: profile.email || ''
                    };
                });
        } catch {
            return [];
        }
    };

    // --- Local Storage Helpers ---
    const useLocalStorage = (key, initialValue) => {
        const [storedValue, setStoredValue] = useState(() => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            } catch {
                return initialValue;
            }
        });

        useEffect(() => {
            localStorage.setItem(key, JSON.stringify(storedValue));
        }, [key, storedValue]);

        return [storedValue, setStoredValue];
    };

    // --- States ---
    const [products, setProducts] = useLocalStorage('fashion_products', DEFAULT_PRODUCTS);
    const [cart, setCart] = useLocalStorage('fashion_cart', []);
    const [orders, setOrders] = useLocalStorage('fashion_orders', []);
    const [currentUser, setCurrentUser] = useLocalStorage('fashion_user', null);
    const [userProfile, setUserProfile] = useLocalStorage('fashion_profile', DEFAULT_PROFILE);
    const [adminAccounts, setAdminAccounts] = useLocalStorage('fashion_admin_accounts', []);
    const [customerAccounts, setCustomerAccounts] = useLocalStorage('fashion_customer_accounts', getStoredCustomerAccounts());

    // --- UI States ---
    const [viewMode, setViewMode] = useState('customer');
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'alert',
        onConfirm: null
    });
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    // --- Customer States ---
    const [customerCategory, setCustomerCategory] = useState('ทั้งหมด');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [checkoutName, setCheckoutName] = useState('');
    const [checkoutPhone, setCheckoutPhone] = useState('');
    const [checkoutAddress, setCheckoutAddress] = useState('');
    const [checkoutPayment, setCheckoutPayment] = useState('bank');
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponFeedback, setCouponFeedback] = useState('');

    // --- Seller States ---
    const [sellerCategory, setSellerCategory] = useState('ทั้งหมด');
    const [isOrderViewOpen, setIsOrderViewOpen] = useState(false);
    const [isAddProductViewOpen, setIsAddProductViewOpen] = useState(false);
    const [isInventoryViewOpen, setIsInventoryViewOpen] = useState(false);
    const [isAdminManagementViewOpen, setIsAdminManagementViewOpen] = useState(false);
    const [orderDateFilter, setOrderDateFilter] = useState('');
    const [orderDateFrom, setOrderDateFrom] = useState('');
    const [orderDateTo, setOrderDateTo] = useState('');
    const [isCustomerAccountViewOpen, setIsCustomerAccountViewOpen] = useState(false);
    const [customerAccountSearch, setCustomerAccountSearch] = useState('');
    const [newAdminUsername, setNewAdminUsername] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');

    // --- Add Product States ---
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: 'เสื้อผ้า',
        img: '',
        stock: ''
    });
    const [customCategoryInput, setCustomCategoryInput] = useState('');
    const [newProductImagePreview, setNewProductImagePreview] = useState('');

    // --- Edit Product States ---
    const [editingProduct, setEditingProduct] = useState(null);
    const [editCategoryInput, setEditCategoryInput] = useState('');
    const [editProductImagePreview, setEditProductImagePreview] = useState('');

    // --- Settings States ---
    const [settingsForm, setSettingsForm] = useState({ ...userProfile });
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // --- Computed ---
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    const defaultDropdownCategories = ['เสื้อผ้า', 'รองเท้า', 'หมวก', 'แว่นตา', 'การ์ตูน'];
    const dropdownOptions = Array.from(new Set([...defaultDropdownCategories, ...uniqueCategories]));
    const allCategoryTabs = ['ทั้งหมด', ...uniqueCategories];

    const filteredProductsForCustomer = products.filter(p => {
        const matchesCategory = customerCategory === 'ทั้งหมด' || p.category === customerCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const filteredProductsForSeller = products.filter(p => {
        const matchesCategory = sellerCategory === 'ทั้งหมด' || p.category === sellerCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const filteredCustomerAccounts = customerAccounts.filter((account) => {
        const search = customerAccountSearch.trim().toLowerCase();
        if (!search) return true;
        return [account.username, account.displayName, account.email]
            .some((value) => String(value || '').toLowerCase().includes(search));
    });

    const filteredOrders = orders.filter(order => {
        const searchString = orderDateFilter.toLowerCase();
        const matchesSearch =
            order.orderId.toLowerCase().includes(searchString) ||
            order.buyer.toLowerCase().includes(searchString) ||
            order.date.toLowerCase().includes(searchString) ||
            (order.time && order.time.toLowerCase().includes(searchString));

        let matchesDateRange = true;
        if (orderDateFrom || orderDateTo) {
            const orderDateStr = convertThaiDateToISO(order.date);
            if (orderDateFrom && orderDateStr < orderDateFrom) {
                matchesDateRange = false;
            }
            if (orderDateTo && orderDateStr > orderDateTo) {
                matchesDateRange = false;
            }
        }

        return matchesSearch && matchesDateRange;
    });

    const couponRules = {
        SAVE10: { code: 'SAVE10', label: 'ส่วนลด 10%', type: 'percent', value: 10 },
        SAVE15: { code: 'SAVE15', label: 'ส่วนลด 15%', type: 'percent', value: 15 },
        FREESHIP: { code: 'FREESHIP', label: 'ค่าจัดส่งฟรี', type: 'shipping', value: 0 }
    };

    const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discountAmount = appliedCoupon?.type === 'percent'
        ? Math.round(cartSubtotal * (appliedCoupon.value / 100))
        : 0;
    const shippingFee = cartSubtotal > 0 ? (appliedCoupon?.type === 'shipping' ? 0 : 60) : 0;
    const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

    const sellerStats = {
        totalProducts: products.length,
        lowStockProducts: products.filter(product => product.stock <= 3).length,
        totalOrders: orders.length,
        totalSales: orders.reduce((sum, order) => sum + (order.total || 0), 0)
    };

    const customerOrders = orders.filter(order => {
        if (currentUser?.username) {
            return order.username === currentUser.username;
        }
        return order.username === 'guest' || order.buyer === userProfile.displayName;
    });

    // --- Effects ---
    useEffect(() => {
        if (!currentUser?.username) {
            const resetProfile = { ...DEFAULT_PROFILE };
            setUserProfile(resetProfile);
            setSettingsForm(resetProfile);
            setCheckoutName(resetProfile.displayName);
            setCheckoutPhone(resetProfile.phone);
            setCheckoutAddress(resetProfile.address);
            setCheckoutPayment(resetProfile.defaultPayment);
            return;
        }

        const profile = getStoredProfile(currentUser.username);
        setUserProfile(profile);
        setSettingsForm({ ...profile });
        setCheckoutName(profile.displayName);
        setCheckoutPhone(profile.phone);
        setCheckoutAddress(profile.address);
        setCheckoutPayment(profile.defaultPayment);
    }, [currentUser?.username, setUserProfile]);

    useEffect(() => {
        setSettingsForm({ ...userProfile });
        setCheckoutName(userProfile.displayName);
        setCheckoutPhone(userProfile.phone);
        setCheckoutAddress(userProfile.address);
        setCheckoutPayment(userProfile.defaultPayment);
    }, [userProfile]);

    useEffect(() => {
        if (viewMode !== 'seller') {
            return;
        }

        if (!currentUser?.username) {
            setViewMode('customer');
            setIsAuthOpen(true);
            showAlert('กรุณาเข้าสู่ระบบ', 'คุณต้องล็อกอินก่อนถึงจะเข้าไปดูหน้าโปรไฟล์และตั้งค่าได้');
            return;
        }

        const isAdminUser = currentUser?.isAdmin === true;

        if (!isAdminUser) {
            setViewMode('customer');
            showAlert('จำกัดสิทธิ์', 'ต้องล็อกอินด้วยบัญชี Rin หรืออีเมล Rin และรหัสผ่าน 1234 เพื่อเข้าใช้งานหน้าจัดการระบบ');
        }
    }, [currentUser?.username, currentUser?.isAdmin, viewMode]);

    useEffect(() => {
        if (viewMode === 'settings' && !currentUser?.username) {
            setViewMode('customer');
            setIsAuthOpen(true);
            showAlert('กรุณาเข้าสู่ระบบ', 'คุณต้องล็อกอินก่อนถึงจะเข้าไปดูหน้าโปรไฟล์และตั้งค่าได้');
        }
    }, [currentUser?.username, viewMode]);

    // --- Notification ---
    const showAlert = (title, message) => {
        setNotification({
            isOpen: true,
            title,
            message,
            type: 'alert',
            onConfirm: () => setNotification(prev => ({ ...prev, isOpen: false }))
        });
    };

    const showConfirm = (title, message, onConfirmAction) => {
        setNotification({
            isOpen: true,
            title,
            message,
            type: 'confirm',
            onConfirm: () => {
                onConfirmAction();
                setNotification(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const closeNotification = () => setNotification(prev => ({ ...prev, isOpen: false }));

    const clearAllFilters = () => {
        setOrderDateFilter('');
        setOrderDateFrom('');
        setOrderDateTo('');
    };

    const applyCoupon = () => {
        const code = couponCodeInput.trim().toUpperCase();
        if (!code) {
            setCouponFeedback('');
            return;
        }

        const matchedCoupon = couponRules[code];
        if (!matchedCoupon) {
            setAppliedCoupon(null);
            setCouponFeedback('โค้ดส่วนลดไม่ถูกต้อง กรุณาลองใหม่');
            showAlert('คูปองไม่ถูกต้อง', 'โค้ดคูปองที่คุณใส่ไม่ตรงกับคูปองที่ร้านมีให้ใช้');
            return;
        }

        setAppliedCoupon(matchedCoupon);
        setCouponFeedback(`${matchedCoupon.label} จะถูกใช้เมื่อชำระเงิน`);
        showAlert('ใช้คูปองสำเร็จ', `${matchedCoupon.label} ถูกเลือกไว้แล้วครับ`);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCodeInput('');
        setCouponFeedback('');
        showAlert('ลบคูปองแล้ว', 'โค้ดส่วนลดถูกลบออกจากคำสั่งซื้อนี้แล้ว');
    };

    const findAdditionalAdmin = (value, password) => {
        const normalized = String(value || '').trim().toLowerCase();
        return adminAccounts.find((account) => (
            account.username.toLowerCase() === normalized
            && account.password === String(password || '')
        ));
    };

    const handleCreateAdmin = (e) => {
        e.preventDefault();
        if (currentUser?.isAdmin !== true) {
            showAlert('ไม่มีสิทธิ์', 'เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเพิ่มบัญชีผู้ดูแลได้');
            return;
        }

        const username = newAdminUsername.trim();
        const password = newAdminPassword;
        const normalizedUsername = username.toLowerCase();
        if (username.length < 3 || password.length < 4) {
            showAlert('ข้อมูลไม่ครบถ้วน', 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร และรหัสผ่านอย่างน้อย 4 ตัวอักษร');
            return;
        }
        if (normalizedUsername === SPECIAL_ADMIN_USERNAME.toLowerCase() || normalizedUsername === SPECIAL_ADMIN_EMAIL.toLowerCase()) {
            showAlert('ชื่อผู้ใช้สงวนไว้', 'ชื่อผู้ใช้นี้เป็นบัญชีผู้ดูแลหลักของระบบ');
            return;
        }
        if (adminAccounts.some((account) => account.username.toLowerCase() === normalizedUsername) || localStorage.getItem(`user_db_${username}`)) {
            showAlert('ไม่สามารถเพิ่มบัญชีได้', 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น');
            return;
        }

        const profile = {
            ...DEFAULT_PROFILE,
            displayName: username,
            email: `${username}@example.com`
        };
        setAdminAccounts((accounts) => [...accounts, { username, password }]);
        localStorage.setItem(`user_db_${username}`, password);
        saveUserProfile(username, profile);
        setNewAdminUsername('');
        setNewAdminPassword('');
        showAlert('เพิ่มผู้ดูแลสำเร็จ', `บัญชี "${username}" สามารถเข้าสู่หน้าแดชบอร์ดได้แล้ว`);
    };

    const handleDeleteAdmin = (username) => {
        if (currentUser?.isAdmin !== true) {
            showAlert('ไม่มีสิทธิ์', 'เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถลบบัญชีผู้ดูแลได้');
            return;
        }
        if (username.toLowerCase() === currentUser.username.toLowerCase()) {
            showAlert('ไม่สามารถลบบัญชีได้', 'ไม่สามารถลบบัญชีผู้ดูแลที่กำลังล็อกอินอยู่ได้');
            return;
        }

        showConfirm(
            'ยืนยันการลบบัญชีผู้ดูแล',
            `คุณต้องการลบบัญชีผู้ดูแล "${username}" ใช่หรือไม่? บัญชีนี้จะไม่สามารถเข้าสู่แดชบอร์ดได้อีก`,
            () => {
                setAdminAccounts((accounts) => accounts.filter((account) => account.username !== username));
                localStorage.removeItem(`user_db_${username}`);
                localStorage.removeItem(`fashion_profile_${username}`);
                showAlert('ลบบัญชีสำเร็จ', `ลบบัญชีผู้ดูแล "${username}" เรียบร้อยแล้ว`);
            }
        );
    };

    // --- Auth ---
    const handleAuthSubmit = (e) => {
        e.preventDefault();
        if (!usernameInput || !passwordInput) {
            showAlert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วนด้วยนะครับ');
            return;
        }

        if (authMode === 'signup') {
            const normalizedUsername = usernameInput.trim().toLowerCase();
            if (normalizedUsername === SPECIAL_ADMIN_USERNAME.toLowerCase() || normalizedUsername === SPECIAL_ADMIN_EMAIL.toLowerCase()) {
                showAlert('ชื่อผู้ใช้สงวนไว้', 'ชื่อผู้ใช้นี้สงวนไว้สำหรับผู้ดูแลระบบ กรุณาเลือกชื่อผู้ใช้อื่น');
                return;
            }
            localStorage.setItem(`user_db_${usernameInput}`, passwordInput);
            const newProfile = {
                ...DEFAULT_PROFILE,
                displayName: usernameInput,
                email: `${usernameInput}@example.com`
            };
            saveUserProfile(usernameInput, newProfile);
            setCustomerAccounts((accounts) => {
                const normalizedUsername = usernameInput.trim().toLowerCase();
                const withoutExisting = accounts.filter((account) => account.username.toLowerCase() !== normalizedUsername);
                return [...withoutExisting, {
                    username: usernameInput,
                    displayName: newProfile.displayName,
                    email: newProfile.email
                }];
            });
            setCurrentUser({ username: usernameInput });
            setUserProfile(newProfile);
            setSettingsForm({ ...newProfile });
            setCheckoutName(newProfile.displayName);
            setCheckoutPhone(newProfile.phone);
            setCheckoutAddress(newProfile.address);
            setCheckoutPayment(newProfile.defaultPayment);
            setIsAuthOpen(false);
            setUsernameInput('');
            setPasswordInput('');
            setAuthMode('login');
            showAlert('สมัครสมาชิกสำเร็จ', 'บัญชีจำลองพร้อมใช้งานแล้วครับ!');
        } else {
            const additionalAdmin = findAdditionalAdmin(usernameInput, passwordInput);
            if (isSpecialAdminCredential(usernameInput, passwordInput) || additionalAdmin) {
                const isPrimaryAdmin = !additionalAdmin;
                const adminUsername = isPrimaryAdmin ? SPECIAL_ADMIN_USERNAME : additionalAdmin.username;
                const adminProfile = isPrimaryAdmin
                    ? getSpecialAdminProfile()
                    : getStoredProfile(adminUsername);
                if (isPrimaryAdmin) {
                    localStorage.setItem(`user_db_${SPECIAL_ADMIN_USERNAME}`, SPECIAL_ADMIN_PASSWORD);
                    saveUserProfile(SPECIAL_ADMIN_USERNAME, adminProfile);
                }
                setCurrentUser({ username: adminUsername, isAdmin: true, email: adminProfile.email });
                setUserProfile(adminProfile);
                setSettingsForm({ ...adminProfile });
                setCheckoutName(adminProfile.displayName);
                setCheckoutPhone(adminProfile.phone);
                setCheckoutAddress(adminProfile.address);
                setCheckoutPayment(adminProfile.defaultPayment);
                setViewMode('seller');
                setIsOrderViewOpen(false);
                setIsAuthOpen(false);
                setUsernameInput('');
                setPasswordInput('');
                setAuthMode('login');
                showAlert('เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับกลับมาครับ คุณ ${adminUsername}!`);
                return;
            }

            const savedPassword = localStorage.getItem(`user_db_${usernameInput}`);
            if (savedPassword && savedPassword === passwordInput) {
                const profile = getStoredProfile(usernameInput);
                setCurrentUser({ username: usernameInput });
                setUserProfile(profile);
                setSettingsForm({ ...profile });
                setCheckoutName(profile.displayName);
                setCheckoutPhone(profile.phone);
                setCheckoutAddress(profile.address);
                setCheckoutPayment(profile.defaultPayment);
                setViewMode('customer');
                setIsAuthOpen(false);
                setUsernameInput('');
                setPasswordInput('');
                setAuthMode('login');
                showAlert('เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับกลับมาครับ คุณ ${usernameInput}!`);
            } else {
                showAlert('เข้าสู่ระบบไม่สำเร็จ', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
        }
    };

    const handleLogout = () => {
        showConfirm('ยืนยันการออกจากระบบ', 'คุณต้องการออกจากระบบสมาชิกใช่หรือไม่?', () => {
            setCurrentUser(null);
            setViewMode('customer');
            showAlert('ออกจากระบบแล้ว', 'ระบบตัดการเชื่อมต่อเรียบร้อยครับ');
        });
    };

    const clearCart = () => {
        setCart([]);
        showAlert('ล้างตะกร้าแล้ว', 'ตะกร้าสินค้าถูกล้างเรียบร้อยแล้วครับ');
    };

    const handleSellerAccess = () => {
        const isAllowedAdmin = currentUser?.isAdmin === true;

        if (!currentUser?.username) {
            setAuthMode('login');
            setIsAuthOpen(true);
            showAlert('จำกัดสิทธิ์', 'ต้องล็อกอินด้วยบัญชี Rin หรืออีเมล Rin และรหัสผ่าน 1234 เพื่อเข้าใช้งานหน้าจัดการระบบ');
            return;
        }

        if (isAllowedAdmin) {
            setViewMode('seller');
            setSearchQuery('');
            setIsOrderViewOpen(false);
            setIsAuthOpen(false);
            return;
        }

        setAuthMode('login');
        setIsAuthOpen(true);
        showAlert('จำกัดสิทธิ์', 'ต้องล็อกอินด้วยบัญชี Rin หรืออีเมล Rin และรหัสผ่าน 1234 เพื่อเข้าใช้งานหน้าจัดการระบบ');
    };

    // --- Customer Functions ---
    const addToCart = (product, quantity = 1) => {
        const currentInStore = products.find(p => p.id === product.id);
        const inCart = cart.find(item => item.id === product.id);
        const currentCartQty = inCart ? inCart.qty : 0;
        const requestedQty = Math.max(1, Number(quantity) || 1);

        if (!currentInStore || currentInStore.stock < currentCartQty + requestedQty) {
            showAlert('สินค้าหมดคลัง', `ขออภัยครับ สินค้า "${product.name}" ในคลังหมดแล้ว`);
            return;
        }

        if (inCart) {
            setCart(cart.map(item => item.id === product.id ? { ...inCart, qty: inCart.qty + requestedQty } : item));
        } else {
            setCart([...cart, { ...product, qty: requestedQty }]);
        }
        showAlert('สำเร็จ!', `เพิ่ม "${product.name}" จำนวน ${requestedQty} ชิ้นลงในตะกร้าแล้ว`);
    };

    const removeFromCart = (product) => {
        const exist = cart.find(item => item.id === product.id);
        if (exist.qty === 1) {
            setCart(cart.filter(item => item.id !== product.id));
        } else {
            setCart(cart.map(item => item.id === product.id ? { ...exist, qty: exist.qty - 1 } : item));
        }
    };

    const handleCheckout = () => {
        if (!checkoutName.trim() || !checkoutPhone.trim() || !checkoutAddress.trim()) {
            showAlert('ข้อมูลส่งของไม่ครบ', 'กรุณากรอกชื่อ เบอร์โทร และที่อยู่จัดส่งให้ครบถ้วนก่อนการชำระเงินนะครับ');
            return;
        }

        let canCheckout = true;
        let outOfStockItemName = '';

        for (const item of cart) {
            const currentInStore = products.find(p => p.id === item.id);
            if (!currentInStore || currentInStore.stock < item.qty) {
                canCheckout = false;
                outOfStockItemName = item.name;
                break;
            }
        }

        if (!canCheckout) {
            showAlert('ชำระเงินไม่สำเร็จ', `สินค้า "${outOfStockItemName}" ในคลังมีไม่เพียงพอสำหรับการสั่งซื้อแล้วครับ`);
            return;
        }

        const updatedProducts = products.map(p => {
            const cartItem = cart.find(item => item.id === p.id);
            return cartItem ? { ...p, stock: Math.max(0, p.stock - cartItem.qty) } : p;
        });

        const subtotal = cartSubtotal;
        const discountValue = discountAmount;
        const shippingValue = shippingFee;
        const finalTotal = grandTotal;
        const newOrder = {
            orderId: generateOrderId(),
            date: new Date().toLocaleDateString('th-TH'),
            time: new Date().toLocaleTimeString('th-TH'),
            buyer: checkoutName.trim(),
            username: currentUser?.username || 'guest',
            contact: checkoutPhone,
            address: checkoutAddress,
            payment: checkoutPayment === 'bank' ? 'โอนเงินธนาคาร' : checkoutPayment === 'card' ? 'บัตรเครดิต/เดบิต' : 'TrueMoney Wallet',
            items: [...cart],
            subtotal,
            discountAmount: discountValue,
            shippingFee: shippingValue,
            coupon: appliedCoupon?.code || null,
            couponLabel: appliedCoupon?.label || null,
            total: finalTotal
        };

        setOrders(prev => [newOrder, ...prev]);
        setProducts(updatedProducts);
        showAlert(
            'การชำระเงินจำลองเสร็จสมบูรณ์!',
            `ยอดชำระ ฿${finalTotal.toLocaleString()} บันทึกออเดอร์ในนามคุณ "${checkoutName.trim()}" เรียบร้อย!`
        );
        setCart([]);
        setIsCartOpen(false);
        setCouponCodeInput('');
        setAppliedCoupon(null);
        setCouponFeedback('');
    };

    // --- Seller Functions ---
    const adjustStock = (id, amount) => {
        setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p));
    };

    const handleDeleteProduct = (id, name) => {
        showConfirm('ยืนยันการถอดสินค้า', `คุณต้องการลบสินค้า "${name}" ออกจากระบบใช่หรือไม่?`, () => {
            setProducts(products.filter(p => p.id !== id));
            setCart(cart.filter(item => item.id !== id));
            showAlert('สำเร็จ', `ถอดสินค้าเรียบร้อยแล้ว`);
        });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price || !newProduct.stock) {
            showAlert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลหลักให้ครบถ้วนด้วยครับ');
            return;
        }

        let finalCategory = newProduct.category;
        if (newProduct.category === 'CUSTOM_OPTION') {
            if (!customCategoryInput.trim()) {
                showAlert('กรอกข้อมูลไม่ครบ', 'กรุณาระบุชื่อหมวดหมู่ใหม่ด้วยครับ');
                return;
            }
            finalCategory = customCategoryInput.trim();
        }

        let finalImage = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80';
        const fileInput = document.getElementById('newProductImage');
        if (fileInput && fileInput.files && fileInput.files[0]) {
            try {
                finalImage = await convertFileToBase64(fileInput.files[0]);
            } catch (error) {
                console.error('Error converting image:', error);
            }
        } else if (newProduct.img) {
            finalImage = newProduct.img;
        }

        const createdProduct = {
            id: Date.now(),
            name: newProduct.name,
            price: Number(newProduct.price),
            category: finalCategory,
            img: finalImage,
            stock: Number(newProduct.stock)
        };

        setProducts([createdProduct, ...products]);
        setNewProduct({ name: '', price: '', category: 'เสื้อผ้า', img: '', stock: '' });
        setCustomCategoryInput('');
        setNewProductImagePreview('');
        showAlert('สำเร็จ!', `เพิ่มสินค้าใหม่ในหมวดหมู่ "${finalCategory}" แล้ว`);
    };

    const startEditingProduct = (product) => {
        setEditingProduct({ ...product });
        setEditCategoryInput('');
        setEditProductImagePreview(product.img);
    };

    const handleSaveEditProduct = async (e) => {
        e.preventDefault();
        if (!editingProduct.name || !editingProduct.price || editingProduct.stock === '') {
            showAlert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกชื่อ ราคา และสต็อกให้เรียบร้อยครับ');
            return;
        }

        let finalCategory = editingProduct.category;
        if (editingProduct.category === 'CUSTOM_OPTION') {
            if (!editCategoryInput.trim()) {
                showAlert('กรอกข้อมูลไม่ครบ', 'กรุณาระบุชื่อหมวดหมู่ใหม่ด้วยครับ');
                return;
            }
            finalCategory = editCategoryInput.trim();
        }

        let finalImage = editingProduct.img || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80';
        const fileInput = document.getElementById('editProductImage');
        if (fileInput && fileInput.files && fileInput.files[0]) {
            try {
                finalImage = await convertFileToBase64(fileInput.files[0]);
            } catch (error) {
                console.error('Error converting image:', error);
            }
        }

        const updatedProducts = products.map(p => {
            if (p.id === editingProduct.id) {
                return {
                    ...p,
                    name: editingProduct.name,
                    price: Number(editingProduct.price),
                    stock: Number(editingProduct.stock),
                    category: finalCategory,
                    img: finalImage
                };
            }
            return p;
        });

        setProducts(updatedProducts);
        setEditingProduct(null);
        setEditProductImagePreview('');
        showAlert('สำเร็จ!', `อัปเดตข้อมูลสินค้าเรียบร้อยแล้วครับ`);
    };

    const handleClearOrders = () => {
        showConfirm('ยืนยันการล้างข้อมูล', 'คุณต้องการเคลียร์ประวัติใบออเดอร์ลูกค้าทั้งหมดในระบบใช่หรือไม่?', () => {
            setOrders([]);
            showAlert('สำเร็จ', 'ล้างข้อมูลออเดอร์เรียบร้อยแล้ว');
        });
    };

    const handleDeleteSingleOrder = (orderId, buyer) => {
        showConfirm(
            'ยืนยันการเคลียร์ออเดอร์',
            `คุณต้องการลบคำสั่งซื้อหมายเลข ${orderId} ของคุณ ${buyer} ออกจากระบบใช่หรือไม่?`,
            () => {
                setOrders(orders.filter(order => order.orderId !== orderId));
                showAlert('สำเร็จ', `เคลียร์คำสั่งซื้อ ${orderId} เรียบร้อยแล้วครับ`);
            }
        );
    };

    // --- Settings ---
    const handleSaveSettings = (e) => {
        e.preventDefault();
        const nextProfile = { ...settingsForm };
        setUserProfile(nextProfile);
        if (currentUser?.username) {
            saveUserProfile(currentUser.username, nextProfile);
        }
        showAlert('บันทึกสำเร็จ!', 'อัปเดตข้อมูลบัญชีผู้ใช้งานของคุณเรียบร้อยแล้วครับ');
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (!currentUser) {
            showAlert('แจ้งเตือน', 'คุณต้องล็อกอินด้วยบัญชีสมาชิกก่อนเปลี่ยนรหัสผ่านครับ');
            return;
        }
        if (currentUser.isAdmin && currentUser.username.toLowerCase() === SPECIAL_ADMIN_USERNAME.toLowerCase()) {
            showAlert('ไม่สามารถเปลี่ยนรหัสผ่านได้', 'บัญชีผู้ดูแลหลักใช้รหัสผ่านที่กำหนดไว้สำหรับระบบจำลอง');
            return;
        }
        const realPassword = localStorage.getItem(`user_db_${currentUser.username}`);
        if (oldPassword !== realPassword) {
            showAlert('เกิดข้อผิดพลาด', 'รหัสผ่านปัจจุบันไม่ถูกต้องครับ');
            return;
        }
        if (!newPassword || newPassword.length < 4) {
            showAlert('เกิดข้อผิดพลาด', 'กรุณาระบุรหัสผ่านใหม่ที่มีความยาวอย่างน้อย 4 ตัวอักษร');
            return;
        }
        localStorage.setItem(`user_db_${currentUser.username}`, newPassword);
        if (currentUser.isAdmin) {
            setAdminAccounts((accounts) => accounts.map((account) => (
                account.username.toLowerCase() === currentUser.username.toLowerCase()
                    ? { ...account, password: newPassword }
                    : account
            )));
        }
        setOldPassword('');
        setNewPassword('');
        showAlert('เปลี่ยนรหัสผ่านแล้ว!', 'ระบบจำลองบันทึกรหัสผ่านใหม่ของคุณเรียบร้อยแล้วครับ');
    };

    return {
        products, setProducts,
        cart, setCart,
        orders, setOrders,
        currentUser, setCurrentUser,
        userProfile, setUserProfile,
        viewMode, setViewMode,
        searchQuery, setSearchQuery,
        notification,
        isAuthOpen, setIsAuthOpen,
        authMode, setAuthMode,
        usernameInput, setUsernameInput,
        passwordInput, setPasswordInput,
        customerCategory, setCustomerCategory,
        isCartOpen, setIsCartOpen,
        checkoutName, setCheckoutName,
        checkoutPhone, setCheckoutPhone,
        checkoutAddress, setCheckoutAddress,
        checkoutPayment, setCheckoutPayment,
        couponCodeInput, setCouponCodeInput,
        appliedCoupon, couponFeedback,
        cartSubtotal, discountAmount, shippingFee, grandTotal,
        sellerCategory, setSellerCategory,
        adminAccounts,
        customerAccounts,
        isCustomerAccountViewOpen, setIsCustomerAccountViewOpen,
        customerAccountSearch, setCustomerAccountSearch,
        newAdminUsername, setNewAdminUsername,
        newAdminPassword, setNewAdminPassword,
        isOrderViewOpen, setIsOrderViewOpen,
        isAddProductViewOpen, setIsAddProductViewOpen,
        isInventoryViewOpen, setIsInventoryViewOpen,
        isAdminManagementViewOpen, setIsAdminManagementViewOpen,
        orderDateFilter, setOrderDateFilter,
        orderDateFrom, setOrderDateFrom,
        orderDateTo, setOrderDateTo,
        newProduct, setNewProduct,
        customCategoryInput, setCustomCategoryInput,
        newProductImagePreview, setNewProductImagePreview,
        editingProduct, setEditingProduct,
        editCategoryInput, setEditCategoryInput,
        editProductImagePreview, setEditProductImagePreview,
        settingsForm, setSettingsForm,
        oldPassword, setOldPassword,
        newPassword, setNewPassword,
        dropdownOptions,
        allCategoryTabs,
        filteredProductsForCustomer,
        filteredProductsForSeller,
        filteredCustomerAccounts,
        filteredOrders,
        sellerStats,
        showAlert,
        showConfirm,
        closeNotification,
        clearAllFilters,
        applyCoupon,
        removeCoupon,
        customerOrders,
        handleSellerAccess,
        handleAuthSubmit,
        handleLogout,
        addToCart,
        removeFromCart,
        clearCart,
        handleCheckout,
        adjustStock,
        handleDeleteProduct,
        handleAddProduct,
        startEditingProduct,
        handleSaveEditProduct,
        handleClearOrders,
        handleDeleteSingleOrder,
        handleCreateAdmin,
        handleDeleteAdmin,
        handleSaveSettings,
        handleChangePassword,
    };
}
