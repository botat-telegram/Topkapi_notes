// مصفوفة لتخزين حالة المستخدمين
const stack = new Map();


const getUserSession = async (chatId, userId) => {
    try {
        // البحث عن المستخدم الحالي
        let currentUser = stack.get(chatId);

        if (!currentUser) {
            // إنشاء مستخدم جديد
            currentUser = {
                chatId,
                userId,
                path: [],
                lastActivity: Date.now()
            };
            stack.set(chatId, currentUser);
        } else {
            // تحديث معلومات المستخدم الحالي
            currentUser.lastActivity = Date.now();
            currentUser.isAdmin = false;
            currentUser.userId = userId;
            stack.set(chatId, currentUser);
        }

        return currentUser;
    } catch (error) {
        console.error('Error in getUserSession:', error);
        return null;
    }
}


module.exports = getUserSession