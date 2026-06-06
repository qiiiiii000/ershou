function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function checkLogin() {
    const user = getCurrentUser();
    if (!user) {
        alert('请先登录');
        window.location.href = 'login.html';
        return false;
    }
    return user;
}

function updateCartBadge() {
    const user = getCurrentUser();
    if (!user) return;
    const cartKey = `cart_${user.id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) {
        const oldValue = parseInt(badge.innerText) || 0;
        if (oldValue !== totalCount) {
            badge.classList.remove('animate');
            void badge.offsetWidth;
            badge.classList.add('animate');
            setTimeout(() => badge.classList.remove('animate'), 300);
        }
        badge.innerText = totalCount;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function addToCart(bookId, quantity = 1) {
    const user = checkLogin();
    if (!user) return false;
    fetch('js/books.json')
        .then(res => res.json())
        .then(books => {
            const book = books.find(b => b.id == bookId);
            if (!book) return;
            const cartKey = `cart_${user.id}`;
            let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
            const exist = cart.find(item => item.id == bookId);
            if (exist) {
                exist.quantity += quantity;
            } else {
                cart.push({
                    id: book.id,
                    name: book.name,
                    price: book.price,
                    quantity: quantity,
                    image: book.image
                });
            }
            localStorage.setItem(cartKey, JSON.stringify(cart));
            alert('已加入购物车');
            updateCartBadge();
        });
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
});