const Cart = require('../models/Cart'); // Assuming you have a Cart model defined

const addOrUpdateCartItem = async (req, res) => {
    const { productId, variantId, quantity } = req.body;
    const userId = req.user.user.id;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, variantId, quantity }]
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) =>
                    item.productId.toString() === productId &&
                    item.variantId.toString() === variantId
            );

            if (itemIndex > -1) {
                // Update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Add new item
                cart.items.push({ productId, variantId, quantity });
            }
        }

        cart.updatedAt = Date.now();
        await cart.save();
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update cart' });
    }
};


const removeCartItem = async (req, res) => {
    const { productId, variantId } = req.body;
    const userId = req.user.user.id;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = cart.items.filter(
            (item) =>
                item.productId.toString() !== productId ||
                item.variantId.toString() !== variantId
        );

        cart.updatedAt = Date.now();
        await cart.save();
        res.status(200).json({ success: true, cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to remove item' });
    }
};

const updateCartItemQuantity = async (req, res) => {
    const { productId, variantId, quantity } = req.body;
    const userId = req.user.user.id;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        const item = cart.items.find(
            (item) =>
                item.productId.toString() === productId &&
                item.variantId.toString() === variantId
        );

        if (!item) return res.status(404).json({ success: false, message: "Item not in cart" });

        item.quantity = quantity;
        cart.updatedAt = Date.now();
        await cart.save();
        res.status(200).json({ success: true, cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update quantity' });
    }
};
const getCartItems = async (req, res) => {
    const userId = req.user.user.id;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        // Map through items and attach variant info manually
        const detailedItems = cart.items.map(item => {
            const product = item.productId;
            const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());

            return {
                productId: product._id,
                variantId: item.variantId,
                quantity: item.quantity,
                name: product.name,
                price: variant?.price,
                image: variant?.images[0],
                frameColor: variant?.frameColor,
                frameStyle: product.frameStyle,
                material: product.material,
                lens: product.lens,
                frameType: product.frameType,
                description: product.description
            };
        });

        return res.status(200).json({ success: true, items: detailedItems });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Failed to fetch cart items' });
    }
};


module.exports = {
    addOrUpdateCartItem,
    removeCartItem,
    updateCartItemQuantity,
    getCartItems
};
