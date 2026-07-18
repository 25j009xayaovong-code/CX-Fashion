import { useState, useEffect } from 'react';
import { DEFAULT_PROFILE } from '../utils/constants';
import { generateOrderId, convertThaiDateToISO } from '../utils/helpers';
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
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [customerPriceRange, setCustomerPriceRange] = useState({ min: '', max: '' });
    const [customerInStockOnly, setCustomerInStockOnly] = useState(false);
    const [customerSort, setCustomerSort] = useState('newest');
    const [customerSize, setCustomerSize] = useState('');
    const [customerColor, setCustomerColor] = useState('');
    const [favoriteProductIds, setFavoriteProductIds] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [checkoutName, setCheckoutName] = useState('');
    const [checkoutPhone, setCheckoutPhone] = useState('');
    const [checkoutAddress, setCheckoutAddress] = useState('');
    const [checkoutPayment, setCheckoutPayment] = useState('bank');
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponFeedback, setCouponFeedback] = useState('');
    const [paymentProofFile, setPaymentProofFile] = useState(null);

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
    const [isCouponManagementViewOpen, setIsCouponManagementViewOpen] = useState(false);
    const [newCoupon, setNewCoupon] = useState({ code: '', label: '', type: 'percent', value: '10', minimumOrder: '', usageLimit: '', expiresAt: '' });

    // --- Add Product States ---
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: 'เสื้อผ้า',
        img: '',
        stock: '',
        description: '',
        color: '',
        sizes: 'S, M, L, XL',
        variantStocks: 'S: 0, M: 0, L: 0, XL: 0'
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
    const allCategoryTabs = ['ทั้งหมด', 'รายการโปรด', ...uniqueCategories];
    const availableSizes = Array.from(new Set(products.flatMap((product) => product.sizes || []))).filter(Boolean);
    const availableColors = Array.from(new Set(products.map((product) => product.color).filter(Boolean)));

    const filteredProductsForCustomer = products.filter(p => {
        const matchesCategory = customerCategory === 'ทั้งหมด' || (customerCategory === 'รายการโปรด' ? favoriteProductIds.includes(p.id) : p.category === customerCategory);
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMin = !customerPriceRange.min || p.price >= Number(customerPriceRange.min);
        const matchesMax = !customerPriceRange.max || p.price <= Number(customerPriceRange.max);
        const matchesStock = !customerInStockOnly || p.stock > 0;
        const matchesSize = !customerSize || (p.sizes || []).includes(customerSize);
        const matchesColor = !customerColor || p.color === customerColor;
        return matchesCategory && matchesSearch && matchesMin && matchesMax && matchesStock && matchesSize && matchesColor;
    }).sort((a, b) => customerSort === 'price-low' ? a.price - b.price : customerSort === 'price-high' ? b.price - a.price : b.id - a.id);

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

    const [coupons, setCoupons] = useState([]);
    const couponRules = Object.fromEntries(coupons.map((coupon) => [coupon.code, { code: coupon.code, label: coupon.label, type: coupon.type, value: coupon.value, minimumOrder: coupon.minimum_order, expiresAt: coupon.expires_at, usageLimit: coupon.usage_limit, usedCount: coupon.used_count }]));

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
    const sellerSalesByDay = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(); date.setDate(date.getDate() - (6 - index));
        const dayKey = date.toLocaleDateString('en-CA');
        return { label: date.toLocaleDateString('th-TH', { weekday: 'short' }), total: orders.filter((order) => new Date(order.createdAt || order.date).toLocaleDateString('en-CA') === dayKey).reduce((sum, order) => sum + order.total, 0) };
    });

    const customerOrders = orders.filter(order => {
        if (currentUser?.id) {
            return order.username === currentUser.id;
        }
        return order.username === 'guest' || order.buyer === userProfile.displayName;
    });
    const favoriteProducts = products.filter((product) => favoriteProductIds.includes(product.id));
    const unreadNotificationCount = notifications.filter((item) => !item.is_read).length;
    const getProductReviews = (productId) => reviews.filter((review) => review.product_id === productId);
    const canReviewProduct = (productId) => Boolean(currentUser?.id && customerOrders.some((order) => order.status !== 'cancelled' && order.items.some((item) => item.id === productId)));

    // --- Supabase data loading ---
    const toProduct = (product) => ({
        ...product,
        img: product.image_url,
        color: product.color || '',
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
        const [{ data: productData, error: productError }, { data: orderData, error: orderError }, { data: couponData }, { data: reviewData }] = await Promise.all([
            supabase.from('products').select('*, product_variants(*)').order('id'),
            supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
            supabase.from('coupons').select('*').order('created_at', { ascending: false }),
            supabase.from('product_reviews').select('*').order('created_at', { ascending: false })
        ]);
        if (productError || orderError) {
            showAlert('โหลดข้อมูลไม่สำเร็จ', productError?.message || orderError?.message || 'กรุณาลองใหม่อีกครั้ง');
            return;
        }
        setProducts((productData || []).map(toProduct));
        setCoupons(couponData || []);
        setReviews(reviewData || []);
        setOrders((orderData || []).map((order) => ({
            orderId: order.order_number,
            date: new Date(order.created_at).toLocaleDateString('th-TH'),
            time: new Date(order.created_at).toLocaleTimeString('th-TH'),
            buyer: order.buyer, username: order.user_id, contact: order.contact, address: order.address,
            payment: order.payment, subtotal: order.subtotal, discountAmount: order.discount_amount,
            shippingFee: order.shipping_fee, coupon: order.coupon, couponLabel: order.coupon_label, total: order.total, status: order.status, trackingNumber: order.tracking_number, paymentProofPath: order.payment_proof_path, paymentNote: order.payment_note, createdAt: order.created_at,
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
        const [{ data: favorites }, { data: userNotifications }] = await Promise.all([
            supabase.from('favorites').select('product_id').eq('user_id', user.id),
            supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(12)
        ]);
        setFavoriteProductIds((favorites || []).map((favorite) => favorite.product_id));
        setNotifications(userNotifications || []);
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

    const submitProductReview = async (productId, rating, comment) => {
        if (!supabase || !currentUser?.id) { showAlert('กรุณาเข้าสู่ระบบ', 'เข้าสู่ระบบก่อนเขียนรีวิวสินค้า'); return false; }
        const { error } = await supabase.rpc('submit_product_review', { payload: { productId, rating, comment } });
        if (error) { showAlert('ส่งรีวิวไม่สำเร็จ', error.message); return false; }
        await refreshStore();
        showAlert('ขอบคุณสำหรับรีวิว', 'บันทึกความคิดเห็นของคุณเรียบร้อยแล้ว');
        return true;
    };

    const markNotificationsRead = async () => {
        if (!supabase || !currentUser?.id) return;
        const unreadIds = notifications.filter((item) => !item.is_read).map((item) => item.id);
        if (unreadIds.length) await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
        setNotifications((items) => items.map((item) => ({ ...item, is_read: true })));
    };

    const uploadPaymentProof = async (orderNumber, file, note = '') => {
        if (!supabase || !currentUser?.id) { showAlert('กรุณาเข้าสู่ระบบ', 'ต้องเข้าสู่ระบบก่อนแนบหลักฐานการชำระเงิน'); return false; }
        if (!file || !file.type.startsWith('image/')) { showAlert('ไฟล์ไม่ถูกต้อง', 'กรุณาเลือกไฟล์รูปภาพของหลักฐานการชำระเงิน'); return false; }
        if (file.size > 8 * 1024 * 1024) { showAlert('ไฟล์มีขนาดใหญ่เกินไป', 'กรุณาเลือกไฟล์ขนาดไม่เกิน 8 MB'); return false; }
        const extension = file.name.split('.').pop() || 'jpg';
        const path = `${currentUser.id}/${orderNumber}-${Date.now()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('payment-slips').upload(path, file, { upsert: false, contentType: file.type });
        if (uploadError) { showAlert('อัปโหลดหลักฐานไม่สำเร็จ', uploadError.message); return false; }
        const { error: proofError } = await supabase.rpc('submit_payment_proof', { order_number_input: orderNumber, proof_path: path, proof_note: note });
        if (proofError) { showAlert('บันทึกหลักฐานไม่สำเร็จ', proofError.message); return false; }
        await refreshStore();
        setPaymentProofFile(null);
        showAlert('ส่งหลักฐานแล้ว', 'ร้านได้รับหลักฐานการชำระเงินแล้ว และจะตรวจสอบให้เร็วที่สุด');
        return true;
    };

    const openPaymentProof = async (path) => {
        if (!supabase || !path) return;
        const { data, error } = await supabase.storage.from('payment-slips').createSignedUrl(path, 60);
        if (error || !data?.signedUrl) { showAlert('เปิดหลักฐานไม่สำเร็จ', error?.message || 'ไม่พบไฟล์'); return; }
        window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
    };

    const reorderItems = (items) => {
        if (!items?.length) return;
        let nextCart = [...cart];
        items.forEach((item) => {
            const product = products.find((entry) => entry.id === item.id);
            const variant = product?.variants?.find((entry) => entry.id === item.variantId || entry.size === item.size);
            const stock = variant?.stock ?? product?.stock ?? 0;
            const cartKey = `${item.id}:${variant?.id || item.variantId || item.size || 'One size'}`;
            const existing = nextCart.find((entry) => (entry.cartKey || `${entry.id}:${entry.variantId || entry.size || 'One size'}`) === cartKey);
            const currentQty = existing?.qty || 0;
            if (product && stock > currentQty) {
                const quantity = Math.min(item.qty, stock - currentQty);
                nextCart = existing
                    ? nextCart.map((entry) => entry === existing ? { ...entry, qty: entry.qty + quantity } : entry)
                    : [...nextCart, { ...product, size: item.size || variant?.size || 'One size', variantId: variant?.id || item.variantId || null, cartKey, qty: quantity }];
            }
        });
        setCart(nextCart);
        setIsCartOpen(true);
        showAlert('เพิ่มสินค้าซ้ำแล้ว', 'เราเพิ่มสินค้าที่มีสต็อกลงตะกร้าของคุณให้แล้ว');
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
            showAlert('สินค้าหมดคลัง', `ขออภัยครับ สินค้า "${product.name}" ในคลังหมดแล้ว`);
            return;
        }

        if (inCart) {
            setCart(cart.map(item => getCartKey(item) === cartKey ? { ...inCart, cartKey, size: selectedSize, variantId: resolvedVariantId, qty: inCart.qty + requestedQty } : item));
        } else {
            setCart([...cart, { ...product, size: selectedSize, variantId: resolvedVariantId, cartKey, qty: requestedQty }]);
        }
        showAlert('สำเร็จ!', `เพิ่ม "${product.name}" จำนวน ${requestedQty} ชิ้นลงในตะกร้าแล้ว`);
    };

    const removeFromCart = (product) => {
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
        if (!checkoutName.trim() || !checkoutPhone.trim() || !checkoutAddress.trim()) {
            showAlert('ข้อมูลส่งของไม่ครบ', 'กรุณากรอกชื่อ เบอร์โทร และที่อยู่จัดส่งให้ครบถ้วนก่อนการชำระเงินนะครับ');
            return;
        }
        if (!paymentProofFile) {
            showAlert('ยังไม่ได้แนบหลักฐาน', 'กรุณาแนบรูปหลักฐานการโอนเงินหรือรายการชำระผ่าน TrueMoney ก่อนยืนยันออเดอร์');
            return;
        }

        let canCheckout = true;
        let outOfStockItemName = '';

        for (const item of cart) {
            const currentInStore = products.find(p => p.id === item.id);
            const variant = currentInStore?.variants?.find((entry) => entry.id === item.variantId);
            if (!currentInStore || (variant?.stock ?? currentInStore.stock) < item.qty) {
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
        const proofUploaded = await uploadPaymentProof(newOrder.orderId, paymentProofFile);
        if (!proofUploaded) {
            await refreshStore();
            showAlert('สร้างออเดอร์แล้ว', `ออเดอร์ ${newOrder.orderId} ถูกสร้างแล้ว แต่ยังไม่พบหลักฐานการชำระเงิน กรุณาแนบจากหน้า “บัญชีของฉัน”`);
            return;
        }
        await refreshStore();
        showAlert(
            'รับคำสั่งซื้อและหลักฐานแล้ว!',
            `ยอดชำระ ฿${finalTotal.toLocaleString()} ของออเดอร์ ${newOrder.orderId} อยู่ระหว่างตรวจสอบ`
        );
        setCart([]);
        setIsCartOpen(false);
        setCouponCodeInput('');
        setAppliedCoupon(null);
        setCouponFeedback('');
    };

    // --- Seller Functions ---
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
                finalImage = await uploadProductImage(fileInput.files[0], finalImage);
            } catch (error) {
                showAlert('อัปโหลดรูปไม่สำเร็จ', error.message);
                return;
            }
        } else if (newProduct.img) {
            finalImage = newProduct.img;
        }

        const variants = parseVariantStocks(newProduct.sizes, newProduct.variantStocks, newProduct.stock);
        const createdProduct = {
            name: newProduct.name,
            price: Number(newProduct.price),
            category: finalCategory,
            image_url: finalImage,
            stock: variants.reduce((sum, variant) => sum + variant.stock, 0),
            description: newProduct.description.trim(),
            color: newProduct.color.trim(),
            sizes: variants.map((variant) => variant.size)
        };
        const { data: insertedProduct, error } = await supabase.from('products').insert(createdProduct).select('id').single();
        if (error) { showAlert('เพิ่มสินค้าไม่สำเร็จ', error.message); return; }
        const { error: variantError } = await supabase.from('product_variants').insert(variants.map((variant) => ({ ...variant, product_id: insertedProduct.id })));
        if (variantError) { showAlert('เพิ่มไซซ์ไม่สำเร็จ', variantError.message); return; }
        await refreshStore();
        setNewProduct({ name: '', price: '', category: 'เสื้อผ้า', img: '', stock: '', description: '', color: '', sizes: 'S, M, L, XL', variantStocks: 'S: 0, M: 0, L: 0, XL: 0' });
        setCustomCategoryInput('');
        setNewProductImagePreview('');
        showAlert('สำเร็จ!', `เพิ่มสินค้าใหม่ในหมวดหมู่ "${finalCategory}" แล้ว`);
    };

    const startEditingProduct = (product) => {
        setEditingProduct({ ...product, sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes || '', variantStocks: (product.variants || []).map((variant) => `${variant.size}: ${variant.stock}`).join(', ') });
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
            color: (editingProduct.color || '').trim(),
            sizes: variants.map((variant) => variant.size)
        }).eq('id', editingProduct.id);
        if (error) { showAlert('อัปเดตสินค้าไม่สำเร็จ', error.message); return; }
        const { error: deleteVariantsError } = await supabase.from('product_variants').delete().eq('product_id', editingProduct.id);
        if (deleteVariantsError) { showAlert('อัปเดตไซซ์ไม่สำเร็จ', deleteVariantsError.message); return; }
        const { error: variantError } = await supabase.from('product_variants').insert(variants.map((variant) => ({ ...variant, product_id: editingProduct.id })));
        if (variantError) { showAlert('อัปเดตไซซ์ไม่สำเร็จ', variantError.message); return; }
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
        selectedProduct, setSelectedProduct,
        customerPriceRange, setCustomerPriceRange,
        customerInStockOnly, setCustomerInStockOnly,
        customerSort, setCustomerSort,
        customerSize, setCustomerSize,
        customerColor, setCustomerColor,
        availableSizes, availableColors,
        favoriteProductIds,
        favoriteProducts,
        reviews, getProductReviews, canReviewProduct,
        notifications, unreadNotificationCount, isNotificationOpen, setIsNotificationOpen, markNotificationsRead,
        isCartOpen, setIsCartOpen,
        checkoutName, setCheckoutName,
        checkoutPhone, setCheckoutPhone,
        checkoutAddress, setCheckoutAddress,
        checkoutPayment, setCheckoutPayment,
        couponCodeInput, setCouponCodeInput,
        appliedCoupon, couponFeedback,
        paymentProofFile, setPaymentProofFile,
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
        isCouponManagementViewOpen, setIsCouponManagementViewOpen,
        newCoupon, setNewCoupon,
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
        sellerSalesByDay,
        coupons,
        showAlert,
        showConfirm,
        closeNotification,
        clearAllFilters,
        applyCoupon,
        removeCoupon,
        toggleFavorite,
        submitProductReview,
        uploadPaymentProof,
        openPaymentProof,
        reorderItems,
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
        updateOrderStatus,
        handleCreateCoupon,
        toggleCoupon,
        handleCreateAdmin,
        handleDeleteAdmin,
        handleSaveSettings,
        handleChangePassword,
    };
}
