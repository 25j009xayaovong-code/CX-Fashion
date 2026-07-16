import { useState, useEffect } from 'react';
import { DEFAULT_PROFILE } from '../utils/constants';
import { convertFileToBase64, generateOrderId, convertThaiDateToISO } from '../utils/helpers';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export function useAppState() {

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
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useLocalStorage('fashion_cart', []);
    const [orders, setOrders] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(DEFAULT_PROFILE);
    const [adminAccounts, setAdminAccounts] = useState([]);
    const [customerAccounts, setCustomerAccounts] = useState([]);

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
        if (currentUser?.id) {
            return order.username === currentUser.id;
        }
        return order.username === 'guest' || order.buyer === userProfile.displayName;
    });

    // --- Supabase data loading ---
    const toProduct = (product) => ({ ...product, img: product.image_url });
    const toProfile = (profile) => ({
        displayName: profile.display_name,
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        defaultPayment: profile.default_payment || 'bank'
    });
    const refreshStore = async () => {
        if (!supabase) return;
        const [{ data: productData, error: productError }, { data: orderData, error: orderError }] = await Promise.all([
            supabase.from('products').select('*').order('id'),
            supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false })
        ]);
        if (productError || orderError) {
            showAlert('โหลดข้อมูลไม่สำเร็จ', productError?.message || orderError?.message || 'กรุณาลองใหม่อีกครั้ง');
            return;
        }
        setProducts((productData || []).map(toProduct));
        setOrders((orderData || []).map((order) => ({
            orderId: order.order_number,
            date: new Date(order.created_at).toLocaleDateString('th-TH'),
            time: new Date(order.created_at).toLocaleTimeString('th-TH'),
            buyer: order.buyer, username: order.user_id, contact: order.contact, address: order.address,
            payment: order.payment, subtotal: order.subtotal, discountAmount: order.discount_amount,
            shippingFee: order.shipping_fee, coupon: order.coupon, couponLabel: order.coupon_label, total: order.total,
            items: (order.order_items || []).map((item) => ({ id: item.product_id, name: item.name, price: item.price, qty: item.quantity, img: item.image_url }))
        })));
    };
    const loadAccount = async (user) => {
        if (!supabase || !user) return;
        const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (error) { showAlert('ไม่พบโปรไฟล์', error.message); return; }
        const nextProfile = toProfile(profile);
        setCurrentUser({ id: user.id, username: profile.username, email: user.email, isAdmin: profile.role === 'admin' });
        setUserProfile(nextProfile);
        setSettingsForm(nextProfile);
        setCheckoutName(nextProfile.displayName);
        setCheckoutPhone(nextProfile.phone);
        setCheckoutAddress(nextProfile.address);
        setCheckoutPayment(nextProfile.defaultPayment);
        if (profile.role === 'admin') {
            const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
            setAdminAccounts((profiles || []).filter((account) => account.role === 'admin').map((account) => ({ username: account.username })));
            setCustomerAccounts((profiles || []).filter((account) => account.role !== 'admin').map((account) => ({ username: account.username, displayName: account.display_name, email: account.email })));
        }
    };
    useEffect(() => {
        if (!isSupabaseConfigured) return;
        refreshStore();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) loadAccount(session.user);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) loadAccount(session.user);
            else { setCurrentUser(null); setUserProfile(DEFAULT_PROFILE); setSettingsForm(DEFAULT_PROFILE); }
        });
        return () => subscription.unsubscribe();
    }, []);

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
            showAlert('จำกัดสิทธิ์', 'กรุณาเข้าสู่ระบบด้วยบัญชีที่ได้รับสิทธิ์ผู้ดูแลระบบ');
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

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        if (currentUser?.isAdmin !== true) {
            showAlert('ไม่มีสิทธิ์', 'เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเพิ่มบัญชีผู้ดูแลได้');
            return;
        }

        const username = newAdminUsername.trim().toLowerCase();
        const password = newAdminPassword;
        if (!username.includes('@') || password.length < 6) {
            showAlert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกอีเมล และรหัสผ่านอย่างน้อย 6 ตัวอักษร');
            return;
        }
        const { error } = await supabase.functions.invoke('create-admin', { body: { email: username, password, displayName: username.split('@')[0] } });
        if (error) { showAlert('เพิ่มผู้ดูแลไม่สำเร็จ', error.message); return; }
        setNewAdminUsername('');
        setNewAdminPassword('');
        await loadAccount({ id: currentUser.id, email: currentUser.email });
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
            async () => {
                const { error } = await supabase.functions.invoke('delete-admin', { body: { username } });
                if (error) { showAlert('ลบบัญชีไม่สำเร็จ', error.message); return; }
                await loadAccount({ id: currentUser.id, email: currentUser.email });
                showAlert('ลบบัญชีสำเร็จ', `ลบบัญชีผู้ดูแล "${username}" เรียบร้อยแล้ว`);
            }
        );
    };

    // --- Auth ---
    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        if (!usernameInput || !passwordInput) {
            showAlert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วนด้วยนะครับ');
            return;
        }
        if (!supabase) { showAlert('ยังไม่ได้เชื่อมฐานข้อมูล', 'กรุณาตั้งค่า VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY ก่อนใช้งาน'); return; }
        const email = usernameInput.trim().toLowerCase();
        const result = authMode === 'signup'
            ? await supabase.auth.signUp({ email, password: passwordInput, options: { data: { username: email.split('@')[0], display_name: email.split('@')[0] } } })
            : await supabase.auth.signInWithPassword({ email, password: passwordInput });
        if (result.error) { showAlert(authMode === 'signup' ? 'สมัครสมาชิกไม่สำเร็จ' : 'เข้าสู่ระบบไม่สำเร็จ', result.error.message); return; }
        setIsAuthOpen(false); setUsernameInput(''); setPasswordInput(''); setAuthMode('login');
        if (authMode === 'signup' && !result.data.session) showAlert('ตรวจสอบอีเมลของคุณ', 'เราได้ส่งลิงก์ยืนยันบัญชีไปยังอีเมลแล้ว');
        else showAlert(authMode === 'signup' ? 'สมัครสมาชิกสำเร็จ' : 'เข้าสู่ระบบสำเร็จ', 'บัญชีของคุณเชื่อมกับระบบกลางเรียบร้อยแล้ว');
    };

    const handleLogout = () => {
        showConfirm('ยืนยันการออกจากระบบ', 'คุณต้องการออกจากระบบสมาชิกใช่หรือไม่?', () => {
            setCurrentUser(null);
            setViewMode('customer');
            supabase?.auth.signOut();
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
            showAlert('จำกัดสิทธิ์', 'กรุณาเข้าสู่ระบบด้วยบัญชีที่ได้รับสิทธิ์ผู้ดูแลระบบ');
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
        showAlert('จำกัดสิทธิ์', 'บัญชีนี้ยังไม่ได้รับสิทธิ์ผู้ดูแลระบบ');
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
        if (!exist || exist.qty === 1) {
            setCart(cart.filter(item => item.id !== product.id));
        } else {
            setCart(cart.map(item => item.id === product.id ? { ...exist, qty: exist.qty - 1 } : item));
        }
    };

    const handleCheckout = async () => {
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

        const subtotal = cartSubtotal;
        const discountValue = discountAmount;
        const shippingValue = shippingFee;
        const finalTotal = grandTotal;
        const newOrder = {
            orderId: generateOrderId(),
            date: new Date().toLocaleDateString('th-TH'),
            time: new Date().toLocaleTimeString('th-TH'),
            buyer: checkoutName.trim(),
            username: currentUser?.id,
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

        if (!supabase || !currentUser?.id) {
            showAlert('กรุณาเข้าสู่ระบบ', 'ต้องเข้าสู่ระบบก่อนจึงจะสั่งซื้อและบันทึกข้อมูลข้ามเครื่องได้');
            return;
        }
        const { error } = await supabase.rpc('create_order', { payload: newOrder });
        if (error) { showAlert('ชำระเงินไม่สำเร็จ', error.message); return; }
        await refreshStore();
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
    const adjustStock = async (id, amount) => {
        const product = products.find((item) => item.id === id);
        if (!product || !supabase) return;
        const { error } = await supabase.from('products').update({ stock: Math.max(0, product.stock + amount) }).eq('id', id);
        if (error) { showAlert('อัปเดตสต็อกไม่สำเร็จ', error.message); return; }
        await refreshStore();
    };

    const handleDeleteProduct = (id, name) => {
        showConfirm('ยืนยันการถอดสินค้า', `คุณต้องการลบสินค้า "${name}" ออกจากระบบใช่หรือไม่?`, () => {
            supabase?.from('products').delete().eq('id', id).then(async ({ error }) => {
                if (error) { showAlert('ลบสินค้าไม่สำเร็จ', error.message); return; }
                await refreshStore();
            });
            setCart(cart.filter(item => item.id !== id));
            showAlert('สำเร็จ', `ถอดสินค้าเรียบร้อยแล้ว`);
        });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.name.trim() || newProduct.price === '' || newProduct.stock === '') {
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
            name: newProduct.name,
            price: Number(newProduct.price),
            category: finalCategory,
            image_url: finalImage,
            stock: Number(newProduct.stock)
        };
        const { error } = await supabase.from('products').insert(createdProduct);
        if (error) { showAlert('เพิ่มสินค้าไม่สำเร็จ', error.message); return; }
        await refreshStore();
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

        const { error } = await supabase.from('products').update({
            name: editingProduct.name,
            price: Number(editingProduct.price),
            stock: Number(editingProduct.stock),
            category: finalCategory,
            image_url: finalImage
        }).eq('id', editingProduct.id);
        if (error) { showAlert('อัปเดตสินค้าไม่สำเร็จ', error.message); return; }
        await refreshStore();
        setEditingProduct(null);
        setEditProductImagePreview('');
        showAlert('สำเร็จ!', `อัปเดตข้อมูลสินค้าเรียบร้อยแล้วครับ`);
    };

    const handleClearOrders = () => {
        showConfirm('ยืนยันการล้างข้อมูล', 'คุณต้องการเคลียร์ประวัติใบออเดอร์ลูกค้าทั้งหมดในระบบใช่หรือไม่?', () => {
            supabase?.from('orders').delete().neq('id', '').then(async ({ error }) => {
                if (error) { showAlert('ล้างออเดอร์ไม่สำเร็จ', error.message); return; }
                await refreshStore();
            });
            showAlert('สำเร็จ', 'ล้างข้อมูลออเดอร์เรียบร้อยแล้ว');
        });
    };

    const handleDeleteSingleOrder = (orderId, buyer) => {
        showConfirm(
            'ยืนยันการเคลียร์ออเดอร์',
            `คุณต้องการลบคำสั่งซื้อหมายเลข ${orderId} ของคุณ ${buyer} ออกจากระบบใช่หรือไม่?`,
            () => {
                supabase?.from('orders').delete().eq('order_number', orderId).then(async ({ error }) => {
                    if (error) { showAlert('ลบออเดอร์ไม่สำเร็จ', error.message); return; }
                    await refreshStore();
                });
                showAlert('สำเร็จ', `เคลียร์คำสั่งซื้อ ${orderId} เรียบร้อยแล้วครับ`);
            }
        );
    };

    // --- Settings ---
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        const nextProfile = { ...settingsForm };
        if (!supabase || !currentUser?.id) { showAlert('กรุณาเข้าสู่ระบบ', 'ต้องเข้าสู่ระบบก่อนบันทึกข้อมูล'); return; }
        const { error } = await supabase.from('profiles').update({
            display_name: nextProfile.displayName,
            phone: nextProfile.phone, address: nextProfile.address, default_payment: nextProfile.defaultPayment
        }).eq('id', currentUser.id);
        if (error) { showAlert('บันทึกไม่สำเร็จ', error.message); return; }
        setUserProfile(nextProfile);
        showAlert('บันทึกสำเร็จ!', 'อัปเดตข้อมูลบัญชีผู้ใช้งานของคุณเรียบร้อยแล้วครับ');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            showAlert('แจ้งเตือน', 'คุณต้องล็อกอินด้วยบัญชีสมาชิกก่อนเปลี่ยนรหัสผ่านครับ');
            return;
        }
        if (!newPassword || newPassword.length < 4) {
            showAlert('เกิดข้อผิดพลาด', 'กรุณาระบุรหัสผ่านใหม่ที่มีความยาวอย่างน้อย 4 ตัวอักษร');
            return;
        }
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) { showAlert('เปลี่ยนรหัสผ่านไม่สำเร็จ', error.message); return; }
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
