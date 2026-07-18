import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { DEFAULT_PROFILE } from '../utils/constants';
import { generateOrderId, convertThaiDateToISO } from '../utils/helpers';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export function useAppState() {
=======
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
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465

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
<<<<<<< HEAD
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useLocalStorage('fashion_cart', []);
    const [orders, setOrders] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(DEFAULT_PROFILE);
    const [adminAccounts, setAdminAccounts] = useState([]);
    const [customerAccounts, setCustomerAccounts] = useState([]);
=======
    const [products, setProducts] = useLocalStorage('fashion_products', DEFAULT_PRODUCTS);
    const [cart, setCart] = useLocalStorage('fashion_cart', []);
    const [orders, setOrders] = useLocalStorage('fashion_orders', []);
    const [currentUser, setCurrentUser] = useLocalStorage('fashion_user', null);
    const [userProfile, setUserProfile] = useLocalStorage('fashion_profile', DEFAULT_PROFILE);
    const [adminAccounts, setAdminAccounts] = useLocalStorage('fashion_admin_accounts', []);
    const [customerAccounts, setCustomerAccounts] = useLocalStorage('fashion_customer_accounts', getStoredCustomerAccounts());
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465

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
<<<<<<< HEAD
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [customerPriceRange, setCustomerPriceRange] = useState({ min: '', max: '' });
    const [customerInStockOnly, setCustomerInStockOnly] = useState(false);
    const [customerSort, setCustomerSort] = useState('newest');
    const [favoriteProductIds, setFavoriteProductIds] = useState([]);
=======
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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
<<<<<<< HEAD
    const [isCouponManagementViewOpen, setIsCouponManagementViewOpen] = useState(false);
    const [newCoupon, setNewCoupon] = useState({ code: '', label: '', type: 'percent', value: '10', minimumOrder: '', usageLimit: '', expiresAt: '' });
=======
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465

    // --- Add Product States ---
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: 'เสื้อผ้า',
        img: '',
<<<<<<< HEAD
        stock: '',
        description: '',
        sizes: 'S, M, L, XL',
        variantStocks: 'S: 0, M: 0, L: 0, XL: 0'
=======
        stock: ''
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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
<<<<<<< HEAD
    const allCategoryTabs = ['ทั้งหมด', 'รายการโปรด', ...uniqueCategories];

    const filteredProductsForCustomer = products.filter(p => {
        const matchesCategory = customerCategory === 'ทั้งหมด' || (customerCategory === 'รายการโปรด' ? favoriteProductIds.includes(p.id) : p.category === customerCategory);
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMin = !customerPriceRange.min || p.price >= Number(customerPriceRange.min);
        const matchesMax = !customerPriceRange.max || p.price <= Number(customerPriceRange.max);
        const matchesStock = !customerInStockOnly || p.stock > 0;
        return matchesCategory && matchesSearch && matchesMin && matchesMax && matchesStock;
    }).sort((a, b) => customerSort === 'price-low' ? a.price - b.price : customerSort === 'price-high' ? b.price - a.price : b.id - a.id);
=======
    const allCategoryTabs = ['ทั้งหมด', ...uniqueCategories];

    const filteredProductsForCustomer = products.filter(p => {
        const matchesCategory = customerCategory === 'ทั้งหมด' || p.category === customerCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465

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

<<<<<<< HEAD
    const [coupons, setCoupons] = useState([]);
    const couponRules = Object.fromEntries(coupons.map((coupon) => [coupon.code, { code: coupon.code, label: coupon.label, type: coupon.type, value: coupon.value, minimumOrder: coupon.minimum_order, expiresAt: coupon.expires_at, usageLimit: coupon.usage_limit, usedCount: coupon.used_count }]));
=======
    const couponRules = {
        SAVE10: { code: 'SAVE10', label: 'ส่วนลด 10%', type: 'percent', value: 10 },
        SAVE15: { code: 'SAVE15', label: 'ส่วนลด 15%', type: 'percent', value: 15 },
        FREESHIP: { code: 'FREESHIP', label: 'ค่าจัดส่งฟรี', type: 'shipping', value: 0 }
    };
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465

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
<<<<<<< HEAD
    const sellerSalesByDay = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(); date.setDate(date.getDate() - (6 - index));
        const dayKey = date.toLocaleDateString('en-CA');
        return { label: date.toLocaleDateString('th-TH', { weekday: 'short' }), total: orders.filter((order) => new Date(order.createdAt || order.date).toLocaleDateString('en-CA') === dayKey).reduce((sum, order) => sum + order.total, 0) };
    });

    const customerOrders = orders.filter(order => {
        if (currentUser?.id) {
            return order.username === currentUser.id;
=======

    const customerOrders = orders.filter(order => {
        if (currentUser?.username) {
            return order.username === currentUser.username;
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
        }
        return order.username === 'guest' || order.buyer === userProfile.displayName;
    });

<<<<<<< HEAD
    // --- Supabase data loading ---
    const toProduct = (product) => ({
        ...product,
        img: product.image_url,
        description: product.description || '',
        variants: product.product_variants || [],
        sizes: (product.product_variants || []).length ? product.product_variants.map((variant) => variant.size) : (Array.isArray(product.sizes) && product.sizes.length ? product.sizes : ['One size'])
    });
    const toProfile = (profile) => ({
        displayName: profile.display_name,
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        defaultPayment: profile.default_payment || 'bank'
    });
    const refreshStore = async () => {
        if (!supabase) return;
        const [{ data: productData, error: productError }, { data: orderData, error: orderError }, { data: couponData }] = await Promise.all([
            supabase.from('products').select('*, product_variants(*)').order('id'),
            supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
            supabase.from('coupons').select('*').order('created_at', { ascending: false })
        ]);
        if (productError || orderError) {
            showAlert('โหลดข้อมูลไม่สำเร็จ', productError?.message || orderError?.message || 'กรุณาลองใหม่อีกครั้ง');
            return;
        }
        setProducts((productData || []).map(toProduct));
        setCoupons(couponData || []);
        setOrders((orderData || []).map((order) => ({
            orderId: order.order_number,
            date: new Date(order.created_at).toLocaleDateString('th-TH'),
            time: new Date(order.created_at).toLocaleTimeString('th-TH'),
            buyer: order.buyer, username: order.user_id, contact: order.contact, address: order.address,
            payment: order.payment, subtotal: order.subtotal, discountAmount: order.discount_amount,
            shippingFee: order.shipping_fee, coupon: order.coupon, couponLabel: order.coupon_label, total: order.total, status: order.status, trackingNumber: order.tracking_number, createdAt: order.created_at,
            items: (order.order_items || []).map((item) => ({ id: item.product_id, variantId: item.variant_id, name: item.name, price: item.price, qty: item.quantity, size: item.size, img: item.image_url }))
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
        const { data: favorites } = await supabase.from('favorites').select('product_id').eq('user_id', user.id);
        setFavoriteProductIds((favorites || []).map((favorite) => favorite.product_id));
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
=======
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
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465

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
<<<<<<< HEAD
            showAlert('จำกัดสิทธิ์', 'กรุณาเข้าสู่ระบบด้วยบัญชีที่ได้รับสิทธิ์ผู้ดูแลระบบ');
=======
            showAlert('จำกัดสิทธิ์', 'ต้องล็อกอินด้วยบัญชี Rin หรืออีเมล Rin และรหัสผ่าน 1234 เพื่อเข้าใช้งานหน้าจัดการระบบ');
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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

<<<<<<< HEAD
    const toggleFavorite = async (productId) => {
        if (!supabase || !currentUser?.id) { showAlert('กรุณาเข้าสู่ระบบ', 'เข้าสู่ระบบเพื่อบันทึกรายการโปรดของคุณ'); return; }
        const isFavorite = favoriteProductIds.includes(productId);
        const request = isFavorite
            ? supabase.from('favorites').delete().eq('user_id', currentUser.id).eq('product_id', productId)
            : supabase.from('favorites').insert({ user_id: currentUser.id, product_id: productId });
        const { error } = await request;
        if (error) { showAlert('บันทึกรายการโปรดไม่สำเร็จ', error.message); return; }
        setFavoriteProductIds((ids) => isFavorite ? ids.filter((id) => id !== productId) : [...ids, productId]);
    };

    const updateOrderStatus = async (orderId, status, trackingNumber) => {
        const { error } = await supabase.from('orders').update({ status, tracking_number: trackingNumber || null }).eq('order_number', orderId);
        if (error) { showAlert('อัปเดตออเดอร์ไม่สำเร็จ', error.message); return; }
        await refreshStore();
        showAlert('อัปเดตแล้ว', 'บันทึกสถานะออเดอร์เรียบร้อยแล้ว');
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        const code = newCoupon.code.trim().toUpperCase();
        if (!code || !newCoupon.label.trim()) { showAlert('ข้อมูลไม่ครบ', 'กรุณากรอกรหัสและชื่อคูปอง'); return; }
        const { error } = await supabase.from('coupons').insert({ code, label: newCoupon.label.trim(), type: newCoupon.type, value: Number(newCoupon.value || 0), minimum_order: Number(newCoupon.minimumOrder || 0), usage_limit: newCoupon.usageLimit ? Number(newCoupon.usageLimit) : null, expires_at: newCoupon.expiresAt || null });
        if (error) { showAlert('สร้างคูปองไม่สำเร็จ', error.message); return; }
        setNewCoupon({ code: '', label: '', type: 'percent', value: '10', minimumOrder: '', usageLimit: '', expiresAt: '' });
        await refreshStore();
        showAlert('สร้างคูปองแล้ว', `คูปอง ${code} พร้อมใช้งาน`);
    };

    const toggleCoupon = async (coupon) => {
        const { error } = await supabase.from('coupons').update({ active: !coupon.active }).eq('code', coupon.code);
        if (error) { showAlert('อัปเดตคูปองไม่สำเร็จ', error.message); return; }
        await refreshStore();
    };

    const handleCreateAdmin = async (e) => {
=======
    const findAdditionalAdmin = (value, password) => {
        const normalized = String(value || '').trim().toLowerCase();
        return adminAccounts.find((account) => (
            account.username.toLowerCase() === normalized
            && account.password === String(password || '')
        ));
    };

    const handleCreateAdmin = (e) => {
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
        e.preventDefault();
        if (currentUser?.isAdmin !== true) {
            showAlert('ไม่มีสิทธิ์', 'เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเพิ่มบัญชีผู้ดูแลได้');
            return;
        }

<<<<<<< HEAD
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
=======
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
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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
<<<<<<< HEAD
            async () => {
                const { error } = await supabase.functions.invoke('delete-admin', { body: { username } });
                if (error) { showAlert('ลบบัญชีไม่สำเร็จ', error.message); return; }
                await loadAccount({ id: currentUser.id, email: currentUser.email });
=======
            () => {
                setAdminAccounts((accounts) => accounts.filter((account) => account.username !== username));
                localStorage.removeItem(`user_db_${username}`);
                localStorage.removeItem(`fashion_profile_${username}`);
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
                showAlert('ลบบัญชีสำเร็จ', `ลบบัญชีผู้ดูแล "${username}" เรียบร้อยแล้ว`);
            }
        );
    };

    // --- Auth ---
<<<<<<< HEAD
    const handleAuthSubmit = async (e) => {
=======
    const handleAuthSubmit = (e) => {
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
        e.preventDefault();
        if (!usernameInput || !passwordInput) {
            showAlert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วนด้วยนะครับ');
            return;
        }
<<<<<<< HEAD
        if (!supabase) { showAlert('ยังไม่ได้เชื่อมฐานข้อมูล', 'กรุณาตั้งค่า VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY ก่อนใช้งาน'); return; }
        const email = usernameInput.trim().toLowerCase();
        const result = authMode === 'signup'
            ? await supabase.auth.signUp({ email, password: passwordInput, options: { data: { username: email.split('@')[0], display_name: email.split('@')[0] } } })
            : await supabase.auth.signInWithPassword({ email, password: passwordInput });
        if (result.error) { showAlert(authMode === 'signup' ? 'สมัครสมาชิกไม่สำเร็จ' : 'เข้าสู่ระบบไม่สำเร็จ', result.error.message); return; }
        setIsAuthOpen(false); setUsernameInput(''); setPasswordInput(''); setAuthMode('login');
        if (authMode === 'signup' && !result.data.session) showAlert('ตรวจสอบอีเมลของคุณ', 'เราได้ส่งลิงก์ยืนยันบัญชีไปยังอีเมลแล้ว');
        else showAlert(authMode === 'signup' ? 'สมัครสมาชิกสำเร็จ' : 'เข้าสู่ระบบสำเร็จ', 'บัญชีของคุณเชื่อมกับระบบกลางเรียบร้อยแล้ว');
=======

        if (authMode === 'signup') {
            const normalizedUsername = usernameInput.trim().toLowerCase();
            if (normalizedUsername === SPECIAL_ADMIN_USERNAME.toLowerCase() || normalizedUsername === SPECIAL_ADMIN_EMAIL.toLowerCase()) {
                showAlert('ชื่อผู้ใช้สงวนไว้', 'ชื่อผู้ใช้นี้สงวนไว้สำหรับผู้ดูแลระบบ กรุณาเลือกชื่อผู้ใช้อื่น');
                return;
            }
            if (localStorage.getItem(`user_db_${usernameInput.trim()}`)) {
                showAlert('ไม่สามารถสมัครได้', 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น');
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
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
    };

    const handleLogout = () => {
        showConfirm('ยืนยันการออกจากระบบ', 'คุณต้องการออกจากระบบสมาชิกใช่หรือไม่?', () => {
            setCurrentUser(null);
            setViewMode('customer');
<<<<<<< HEAD
            supabase?.auth.signOut();
=======
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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
<<<<<<< HEAD
            showAlert('จำกัดสิทธิ์', 'กรุณาเข้าสู่ระบบด้วยบัญชีที่ได้รับสิทธิ์ผู้ดูแลระบบ');
=======
            showAlert('จำกัดสิทธิ์', 'ต้องล็อกอินด้วยบัญชี Rin หรืออีเมล Rin และรหัสผ่าน 1234 เพื่อเข้าใช้งานหน้าจัดการระบบ');
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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
<<<<<<< HEAD
        showAlert('จำกัดสิทธิ์', 'บัญชีนี้ยังไม่ได้รับสิทธิ์ผู้ดูแลระบบ');
    };

    // --- Customer Functions ---
    const addToCart = (product, quantity = 1, size = null, variantId = null) => {
        const currentInStore = products.find(p => p.id === product.id);
        const selectedSize = size || product.sizes?.[0] || 'One size';
        const selectedVariant = currentInStore?.variants?.find((variant) => variant.id === variantId || variant.size === selectedSize);
        const resolvedVariantId = variantId || selectedVariant?.id || null;
        const cartKey = `${product.id}:${resolvedVariantId || selectedSize}`;
        const getCartKey = (item) => item.cartKey || `${item.id}:${item.size || item.sizes?.[0] || 'One size'}`;
        const inCart = cart.find(item => getCartKey(item) === cartKey);
        const currentCartQty = cart.filter(item => (resolvedVariantId ? item.variantId === resolvedVariantId : item.id === product.id)).reduce((sum, item) => sum + item.qty, 0);
        const requestedQty = Math.max(1, Number(quantity) || 1);

        const availableStock = selectedVariant?.stock ?? currentInStore?.stock;
        if (!currentInStore || availableStock < currentCartQty + requestedQty) {
=======
        showAlert('จำกัดสิทธิ์', 'ต้องล็อกอินด้วยบัญชี Rin หรืออีเมล Rin และรหัสผ่าน 1234 เพื่อเข้าใช้งานหน้าจัดการระบบ');
    };

    // --- Customer Functions ---
    const addToCart = (product, quantity = 1) => {
        const currentInStore = products.find(p => p.id === product.id);
        const inCart = cart.find(item => item.id === product.id);
        const currentCartQty = inCart ? inCart.qty : 0;
        const requestedQty = Math.max(1, Number(quantity) || 1);

        if (!currentInStore || currentInStore.stock < currentCartQty + requestedQty) {
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
            showAlert('สินค้าหมดคลัง', `ขออภัยครับ สินค้า "${product.name}" ในคลังหมดแล้ว`);
            return;
        }

        if (inCart) {
<<<<<<< HEAD
            setCart(cart.map(item => getCartKey(item) === cartKey ? { ...inCart, cartKey, size: selectedSize, variantId: resolvedVariantId, qty: inCart.qty + requestedQty } : item));
        } else {
            setCart([...cart, { ...product, size: selectedSize, variantId: resolvedVariantId, cartKey, qty: requestedQty }]);
=======
            setCart(cart.map(item => item.id === product.id ? { ...inCart, qty: inCart.qty + requestedQty } : item));
        } else {
            setCart([...cart, { ...product, qty: requestedQty }]);
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
        }
        showAlert('สำเร็จ!', `เพิ่ม "${product.name}" จำนวน ${requestedQty} ชิ้นลงในตะกร้าแล้ว`);
    };

    const removeFromCart = (product) => {
<<<<<<< HEAD
        const cartKey = product.cartKey || `${product.id}:${product.variantId || product.size || product.sizes?.[0] || 'One size'}`;
        const getCartKey = (item) => item.cartKey || `${item.id}:${item.size || item.sizes?.[0] || 'One size'}`;
        const exist = cart.find(item => getCartKey(item) === cartKey);
        if (!exist || exist.qty === 1) {
            setCart(cart.filter(item => getCartKey(item) !== cartKey));
        } else {
            setCart(cart.map(item => getCartKey(item) === cartKey ? { ...exist, cartKey, qty: exist.qty - 1 } : item));
        }
    };

    const handleCheckout = async () => {
=======
        const exist = cart.find(item => item.id === product.id);
        if (!exist || exist.qty === 1) {
            setCart(cart.filter(item => item.id !== product.id));
        } else {
            setCart(cart.map(item => item.id === product.id ? { ...exist, qty: exist.qty - 1 } : item));
        }
    };

    const handleCheckout = () => {
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
        if (!checkoutName.trim() || !checkoutPhone.trim() || !checkoutAddress.trim()) {
            showAlert('ข้อมูลส่งของไม่ครบ', 'กรุณากรอกชื่อ เบอร์โทร และที่อยู่จัดส่งให้ครบถ้วนก่อนการชำระเงินนะครับ');
            return;
        }

        let canCheckout = true;
        let outOfStockItemName = '';

        for (const item of cart) {
            const currentInStore = products.find(p => p.id === item.id);
<<<<<<< HEAD
            const variant = currentInStore?.variants?.find((entry) => entry.id === item.variantId);
            if (!currentInStore || (variant?.stock ?? currentInStore.stock) < item.qty) {
=======
            if (!currentInStore || currentInStore.stock < item.qty) {
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
                canCheckout = false;
                outOfStockItemName = item.name;
                break;
            }
        }

        if (!canCheckout) {
            showAlert('ชำระเงินไม่สำเร็จ', `สินค้า "${outOfStockItemName}" ในคลังมีไม่เพียงพอสำหรับการสั่งซื้อแล้วครับ`);
            return;
        }

<<<<<<< HEAD
=======
        const updatedProducts = products.map(p => {
            const cartItem = cart.find(item => item.id === p.id);
            return cartItem ? { ...p, stock: Math.max(0, p.stock - cartItem.qty) } : p;
        });

>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
        const subtotal = cartSubtotal;
        const discountValue = discountAmount;
        const shippingValue = shippingFee;
        const finalTotal = grandTotal;
        const newOrder = {
            orderId: generateOrderId(),
            date: new Date().toLocaleDateString('th-TH'),
            time: new Date().toLocaleTimeString('th-TH'),
            buyer: checkoutName.trim(),
<<<<<<< HEAD
            username: currentUser?.id,
=======
            username: currentUser?.username || 'guest',
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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

<<<<<<< HEAD
        if (!supabase || !currentUser?.id) {
            showAlert('กรุณาเข้าสู่ระบบ', 'ต้องเข้าสู่ระบบก่อนจึงจะสั่งซื้อและบันทึกข้อมูลข้ามเครื่องได้');
            return;
        }
        const { error } = await supabase.rpc('create_order', { payload: newOrder });
        if (error) { showAlert('ชำระเงินไม่สำเร็จ', error.message); return; }
        await refreshStore();
=======
        setOrders(prev => [newOrder, ...prev]);
        setProducts(updatedProducts);
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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
<<<<<<< HEAD
    const adjustStock = async (id, amount, variantId = null) => {
        const product = products.find((item) => item.id === id);
        if (!product || !supabase) return;
        const variant = product.variants?.find((entry) => entry.id === variantId) || product.variants?.[0];
        if (variant) {
            const { error } = await supabase.from('product_variants').update({ stock: Math.max(0, variant.stock + amount) }).eq('id', variant.id);
            if (error) { showAlert('อัปเดตสต็อกไม่สำเร็จ', error.message); return; }
            const nextTotal = product.variants.reduce((sum, entry) => sum + (entry.id === variant.id ? Math.max(0, entry.stock + amount) : entry.stock), 0);
            await supabase.from('products').update({ stock: nextTotal }).eq('id', id);
        } else {
            const { error } = await supabase.from('products').update({ stock: Math.max(0, product.stock + amount) }).eq('id', id);
            if (error) { showAlert('อัปเดตสต็อกไม่สำเร็จ', error.message); return; }
        }
        await refreshStore();
=======
    const adjustStock = (id, amount) => {
        setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p));
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
    };

    const handleDeleteProduct = (id, name) => {
        showConfirm('ยืนยันการถอดสินค้า', `คุณต้องการลบสินค้า "${name}" ออกจากระบบใช่หรือไม่?`, () => {
<<<<<<< HEAD
            supabase?.from('products').delete().eq('id', id).then(async ({ error }) => {
                if (error) { showAlert('ลบสินค้าไม่สำเร็จ', error.message); return; }
                await refreshStore();
            });
=======
            setProducts(products.filter(p => p.id !== id));
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
            setCart(cart.filter(item => item.id !== id));
            showAlert('สำเร็จ', `ถอดสินค้าเรียบร้อยแล้ว`);
        });
    };

<<<<<<< HEAD
    const parseVariantStocks = (sizesInput, stocksInput, fallbackStock = 0) => {
        const sizes = String(sizesInput || 'One size').split(',').map((size) => size.trim()).filter(Boolean);
        const stockBySize = Object.fromEntries(String(stocksInput || '').split(',').map((entry) => entry.trim()).filter(Boolean).map((entry) => {
            const [size, stock] = entry.split(':');
            return [size?.trim(), Math.max(0, Number(stock?.trim()) || 0)];
        }));
        return sizes.map((size, index) => ({ size, stock: stockBySize[size] ?? (sizes.length === 1 ? Number(fallbackStock) || 0 : index === 0 ? Number(fallbackStock) || 0 : 0) }));
    };

    const uploadProductImage = async (file, fallbackImage) => {
        if (!file) return fallbackImage;
        const extension = file.name.split('.').pop() || 'jpg';
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
        const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false, contentType: file.type });
        if (error) throw error;
        return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.name.trim() || newProduct.price === '') {
=======
    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.name.trim() || newProduct.price === '' || newProduct.stock === '') {
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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
<<<<<<< HEAD
                finalImage = await uploadProductImage(fileInput.files[0], finalImage);
            } catch (error) {
                showAlert('อัปโหลดรูปไม่สำเร็จ', error.message);
                return;
=======
                finalImage = await convertFileToBase64(fileInput.files[0]);
            } catch (error) {
                console.error('Error converting image:', error);
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
            }
        } else if (newProduct.img) {
            finalImage = newProduct.img;
        }

<<<<<<< HEAD
        const variants = parseVariantStocks(newProduct.sizes, newProduct.variantStocks, newProduct.stock);
        const createdProduct = {
            name: newProduct.name,
            price: Number(newProduct.price),
            category: finalCategory,
            image_url: finalImage,
            stock: variants.reduce((sum, variant) => sum + variant.stock, 0),
            description: newProduct.description.trim(),
            sizes: variants.map((variant) => variant.size)
        };
        const { data: insertedProduct, error } = await supabase.from('products').insert(createdProduct).select('id').single();
        if (error) { showAlert('เพิ่มสินค้าไม่สำเร็จ', error.message); return; }
        const { error: variantError } = await supabase.from('product_variants').insert(variants.map((variant) => ({ ...variant, product_id: insertedProduct.id })));
        if (variantError) { showAlert('เพิ่มไซซ์ไม่สำเร็จ', variantError.message); return; }
        await refreshStore();
        setNewProduct({ name: '', price: '', category: 'เสื้อผ้า', img: '', stock: '', description: '', sizes: 'S, M, L, XL', variantStocks: 'S: 0, M: 0, L: 0, XL: 0' });
=======
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
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
        setCustomCategoryInput('');
        setNewProductImagePreview('');
        showAlert('สำเร็จ!', `เพิ่มสินค้าใหม่ในหมวดหมู่ "${finalCategory}" แล้ว`);
    };

    const startEditingProduct = (product) => {
<<<<<<< HEAD
        setEditingProduct({ ...product, sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes || '', variantStocks: (product.variants || []).map((variant) => `${variant.size}: ${variant.stock}`).join(', ') });
=======
        setEditingProduct({ ...product });
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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
<<<<<<< HEAD
                finalImage = await uploadProductImage(fileInput.files[0], finalImage);
            } catch (error) {
                showAlert('อัปโหลดรูปไม่สำเร็จ', error.message);
                return;
            }
        }

        const variants = parseVariantStocks(editingProduct.sizes, editingProduct.variantStocks, editingProduct.stock);
        const { error } = await supabase.from('products').update({
            name: editingProduct.name,
            price: Number(editingProduct.price),
            stock: variants.reduce((sum, variant) => sum + variant.stock, 0),
            category: finalCategory,
            image_url: finalImage,
            description: (editingProduct.description || '').trim(),
            sizes: variants.map((variant) => variant.size)
        }).eq('id', editingProduct.id);
        if (error) { showAlert('อัปเดตสินค้าไม่สำเร็จ', error.message); return; }
        const { error: deleteVariantsError } = await supabase.from('product_variants').delete().eq('product_id', editingProduct.id);
        if (deleteVariantsError) { showAlert('อัปเดตไซซ์ไม่สำเร็จ', deleteVariantsError.message); return; }
        const { error: variantError } = await supabase.from('product_variants').insert(variants.map((variant) => ({ ...variant, product_id: editingProduct.id })));
        if (variantError) { showAlert('อัปเดตไซซ์ไม่สำเร็จ', variantError.message); return; }
        await refreshStore();
=======
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
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
        setEditingProduct(null);
        setEditProductImagePreview('');
        showAlert('สำเร็จ!', `อัปเดตข้อมูลสินค้าเรียบร้อยแล้วครับ`);
    };

    const handleClearOrders = () => {
        showConfirm('ยืนยันการล้างข้อมูล', 'คุณต้องการเคลียร์ประวัติใบออเดอร์ลูกค้าทั้งหมดในระบบใช่หรือไม่?', () => {
<<<<<<< HEAD
            supabase?.from('orders').delete().neq('id', '').then(async ({ error }) => {
                if (error) { showAlert('ล้างออเดอร์ไม่สำเร็จ', error.message); return; }
                await refreshStore();
            });
=======
            setOrders([]);
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
            showAlert('สำเร็จ', 'ล้างข้อมูลออเดอร์เรียบร้อยแล้ว');
        });
    };

    const handleDeleteSingleOrder = (orderId, buyer) => {
        showConfirm(
            'ยืนยันการเคลียร์ออเดอร์',
            `คุณต้องการลบคำสั่งซื้อหมายเลข ${orderId} ของคุณ ${buyer} ออกจากระบบใช่หรือไม่?`,
            () => {
<<<<<<< HEAD
                supabase?.from('orders').delete().eq('order_number', orderId).then(async ({ error }) => {
                    if (error) { showAlert('ลบออเดอร์ไม่สำเร็จ', error.message); return; }
                    await refreshStore();
                });
=======
                setOrders(orders.filter(order => order.orderId !== orderId));
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
                showAlert('สำเร็จ', `เคลียร์คำสั่งซื้อ ${orderId} เรียบร้อยแล้วครับ`);
            }
        );
    };

    // --- Settings ---
<<<<<<< HEAD
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
=======
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
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
        e.preventDefault();
        if (!currentUser) {
            showAlert('แจ้งเตือน', 'คุณต้องล็อกอินด้วยบัญชีสมาชิกก่อนเปลี่ยนรหัสผ่านครับ');
            return;
        }
<<<<<<< HEAD
=======
        if (currentUser.isAdmin && currentUser.username.toLowerCase() === SPECIAL_ADMIN_USERNAME.toLowerCase()) {
            showAlert('ไม่สามารถเปลี่ยนรหัสผ่านได้', 'บัญชีผู้ดูแลหลักใช้รหัสผ่านที่กำหนดไว้สำหรับระบบจำลอง');
            return;
        }
        const realPassword = localStorage.getItem(`user_db_${currentUser.username}`);
        if (oldPassword !== realPassword) {
            showAlert('เกิดข้อผิดพลาด', 'รหัสผ่านปัจจุบันไม่ถูกต้องครับ');
            return;
        }
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
        if (!newPassword || newPassword.length < 4) {
            showAlert('เกิดข้อผิดพลาด', 'กรุณาระบุรหัสผ่านใหม่ที่มีความยาวอย่างน้อย 4 ตัวอักษร');
            return;
        }
<<<<<<< HEAD
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) { showAlert('เปลี่ยนรหัสผ่านไม่สำเร็จ', error.message); return; }
=======
        localStorage.setItem(`user_db_${currentUser.username}`, newPassword);
        if (currentUser.isAdmin) {
            setAdminAccounts((accounts) => accounts.map((account) => (
                account.username.toLowerCase() === currentUser.username.toLowerCase()
                    ? { ...account, password: newPassword }
                    : account
            )));
        }
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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
<<<<<<< HEAD
        selectedProduct, setSelectedProduct,
        customerPriceRange, setCustomerPriceRange,
        customerInStockOnly, setCustomerInStockOnly,
        customerSort, setCustomerSort,
        favoriteProductIds,
=======
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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
<<<<<<< HEAD
        isCouponManagementViewOpen, setIsCouponManagementViewOpen,
        newCoupon, setNewCoupon,
=======
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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
<<<<<<< HEAD
        sellerSalesByDay,
        coupons,
=======
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
        showAlert,
        showConfirm,
        closeNotification,
        clearAllFilters,
        applyCoupon,
        removeCoupon,
<<<<<<< HEAD
        toggleFavorite,
=======
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
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
<<<<<<< HEAD
        updateOrderStatus,
        handleCreateCoupon,
        toggleCoupon,
=======
>>>>>>> a9cd2f35ff6b348f243e459dcd25956bc61b0465
        handleCreateAdmin,
        handleDeleteAdmin,
        handleSaveSettings,
        handleChangePassword,
    };
}
