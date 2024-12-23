// تحميل المتغيرات البيئية أولاً
require('dotenv').config();

const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs/promises");
const createKeyboard = require("./src/createKeyboard");
const addPath = require("./src/addPath");
const addFile = require("./src/addFile");
const SelectFileOpration = require("./src/SelectFileOpration");
const backupToGithub = require("./src/backupToGithub");

// التحقق من وجود التوكن
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
    console.error('Error: TELEGRAM_TOKEN not found in environment variables');
    process.exit(1);
}

console.log('Environment variables loaded:', {
    ADMIN_ID: process.env.ADMIN_ID,
    TOKEN_EXISTS: !!process.env.TELEGRAM_TOKEN
});

/*
* أبوالهدى: تم تعديل التعامل مع الأوامر لمنع إرسال النص الكامل إلى SelectFileOperation
* المشكلة: عند إرسال أمر /newpath، كان النص الكامل يُرسل إلى SelectFileOperation مما يسبب خطأ
* الحل: التحقق من وجود الأمر قبل محاولة عرض المحتويات
*/

const Bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// مصفوفة لتخزين حالة المستخدمين
const stack = new Map();

const filePath = "./data.json"

// إعداد أوامر البوت
Bot.setMyCommands([
    { command: "/start", description: "Start the bot" }
]);

// دالة للتحقق من المسؤول
async function isAdmin(userId) {
    try {
        userId = parseInt(userId);
        const adminId = parseInt(process.env.ADMIN_ID);
        const result = userId === adminId;
        console.log('isAdmin check - User ID:', userId, 'Admin ID:', adminId, 'Result:', result);
        return result;
    } catch (error) {
        console.error('Error in isAdmin:', error);
        return false;
    }
}

// دالة للحصول على معلومات المستخدم أو إنشاء مستخدم جديد
async function getUserSession(chatId, userId) {
    try {
        const isAdminUser = await isAdmin(userId);
        console.log(`Checking user session - Chat ID: ${chatId}, User ID: ${userId}, Is Admin: ${isAdminUser}`);
        
        // البحث عن المستخدم الحالي
        let currentUser = stack.get(chatId);
        
        if (!currentUser) {
            // إنشاء مستخدم جديد
            currentUser = {
                chatId,
                userId,
                path: [],
                isAdmin: isAdminUser,
                lastActivity: Date.now()
            };
            stack.set(chatId, currentUser);
            console.log(`Created new session:`, currentUser);
        } else {
            // تحديث معلومات المستخدم الحالي
            currentUser.lastActivity = Date.now();
            currentUser.isAdmin = isAdminUser;
            currentUser.userId = userId;
            stack.set(chatId, currentUser);
            console.log(`Updated existing session:`, currentUser);
        }
        
        return currentUser;
    } catch (error) {
        console.error('Error in getUserSession:', error);
        return null;
    }
}

// التعامل مع الرسائل الواردة
Bot.on("message", async (msg) => {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const text = msg.text || "";
        
        console.log('\n=== New Message ===');
        console.log('Chat ID:', chatId);
        console.log('User ID:', userId);
        console.log('Message:', text);
        console.log('Active Sessions:', stack.size);
        
        // الحصول على أو إنشاء جلسة المستخدم
        const currentUser = await getUserSession(chatId, userId);
        if (!currentUser) {
            console.error('Failed to get user session');
            await Bot.sendMessage(chatId, 'عذراً، حدث خطأ في إدارة الجلسة. الرجاء المحاولة مرة أخرى.');
            return;
        }

        // إعادة تحميل المتغيرات البيئية عند بدء البوت
        if (text === "/start") {
            console.log(`Processing /start command for user ${userId}`);
            delete require.cache[require.resolve('dotenv')];
            require('dotenv').config();
            
            // إعادة تعيين المسار
            currentUser.path = [];
            await SelectFileOpration(filePath, Bot, msg, currentUser);
            return;
        }

        // التعامل مع العودة للخلف
        if (text === "back") {
            if (currentUser.path.length > 0) {
                currentUser.path.pop();
                console.log(`User ${userId} went back. New path:`, currentUser.path);
                await SelectFileOpration(filePath, Bot, msg, currentUser);
            } else {
                await Bot.sendMessage(chatId, "أنت في المجلد الرئيسي.");
            }
            return;
        }

        // عملية تحديد الملفات
        if (text && text !== "back" && !text.startsWith("/")) {
            console.log(`Processing file operation for user ${userId}`);
            
            // التحقق من نوع الملف
            const isFile = currentUser.path.length > 0 && 
                          /\.(pdf|mov|mp4|mp3|jpg|png|jpeg|txt|js|docx|xlsx|pptx|zip|rar|exe|md|csv|html|css|xml)$/
                          .test(currentUser.path[currentUser.path.length - 1]);

            if (isFile) {
                currentUser.path.pop();
            }

            // إضافة المسار الجديد
            if (!currentUser.path.includes(text)) {
                currentUser.path.push(text);
            }

            console.log(`User ${userId} path updated:`, currentUser.path);
            await SelectFileOpration(filePath, Bot, msg, currentUser);
        }

        // إضافة مسار جديد (للمسؤول فقط)
        if (text.startsWith("/newpath") && currentUser.isAdmin) {
            console.log(`Admin ${userId} creating new path`);
            await addPath(filePath, Bot, msg);
        }

        // التعامل مع رفع الملفات (للمسؤول فقط)
        if (currentUser.isAdmin) {
            if (msg.document || msg.video || msg.photo) {
                console.log(`Admin ${userId} uploading file`);
                const file = msg.document || msg.video || msg.photo[msg.photo.length - 1];
                await addFile(filePath, Bot, msg, file);
            }
        }

        // تحديث الجلسة في المخزن
        stack.set(chatId, currentUser);
        
    } catch (error) {
        console.error('Error in message handler:', error);
        try {
            await Bot.sendMessage(msg.chat.id, 'عذراً، حدث خطأ ما. الرجاء المحاولة مرة أخرى.');
        } catch (sendError) {
            console.error('Error sending error message:', sendError);
        }
    }
});

// تنظيف الجلسات غير النشطة كل ساعة
setInterval(() => {
    try {
        const oneHour = 60 * 60 * 1000;
        const now = Date.now();
        let cleanedCount = 0;
        
        for (const [chatId, user] of stack.entries()) {
            if (now - user.lastActivity > oneHour) {
                stack.delete(chatId);
                cleanedCount++;
            }
        }
        
        if (cleanedCount > 0) {
            console.log(`Cleaned up ${cleanedCount} inactive sessions. Active sessions: ${stack.size}`);
        }
    } catch (error) {
        console.error('Error in cleanup interval:', error);
    }
}, 60 * 60 * 1000);

// معالجة الأخطاء غير المتوقعة
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
1