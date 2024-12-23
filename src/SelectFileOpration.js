const fs = require("fs/promises");
const createKeyboard = require("./createKeyboard");
const handleCaption = require("./handleCaption");

// دالة للتحقق مما إذا كان المستخدم هو المسؤول
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

// دالة لحذف مجلد أو ملف
async function deleteItem(jsonData, path) {
    let current = jsonData;
    const pathParts = path.split('/');
    const target = pathParts.pop();

    // الوصول إلى المجلد الأب
    for (const part of pathParts) {
        if (current[part] && current[part].file_type === 'folder') {
            current = current[part].content;
        }
    }

    // حذف العنصر
    if (current[target]) {
        delete current[target];
        return true;
    }
    return false;
}

// دالة لإعادة تسمية مجلد أو ملف
async function renameItem(jsonData, oldPath, newName) {
    let current = jsonData;
    const pathParts = oldPath.split('/');
    const oldName = pathParts.pop();

    // الوصول إلى المجلد الأب
    for (const part of pathParts) {
        if (current[part] && current[part].file_type === 'folder') {
            current = current[part].content;
        }
    }

    // إعادة التسمية
    if (current[oldName]) {
        current[newName] = current[oldName];
        delete current[oldName];
        return true;
    }
    return false;
}

// دالة لإنشاء لوحة المفاتيح العادية
function createNormalKeyboard(data) {
    const keys = Object.keys(data).filter(key => !key.startsWith('_')).sort();
    const keyboard = [];
    
    // إنشاء صف جديد لكل زوج من الأزرار
    for (let i = 0; i < keys.length; i += 2) {
        const row = [];
        
        // إضافة الزر الأول
        if (data[keys[i]] && data[keys[i]].file_type) {
            row.push(keys[i]);
        }
        
        // إضافة الزر الثاني إذا كان موجوداً
        if (i + 1 < keys.length && data[keys[i + 1]] && data[keys[i + 1]].file_type) {
            row.push(keys[i + 1]);
        }
        
        if (row.length > 0) {
            keyboard.push(row);
        }
    }

    // إضافة زر العودة في الأسفل
    keyboard.push(['⬅️ رجوع']);
    return keyboard;
}

// دالة لإنشاء أزرار الإدارة
function createAdminKeyboard(currentPath) {
    return {
        inline_keyboard: [
            [
                { text: '🗑️ حذف', callback_data: `delete_${currentPath}` },
                { text: '✏️ إعادة تسمية', callback_data: `rename_${currentPath}` }
            ]
        ]
    };
}

const SelectFileOperation = async (filePath, Bot, msg, currentUser) => {
    try {
        console.log('=== SelectFileOperation ===');
        console.log('Current User:', JSON.stringify(currentUser, null, 2));
        
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        // قراءة محتوى الملف
        const fileContent = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        console.log('File content loaded successfully');

        const isAdminUser = await isAdmin(userId);
        console.log('SelectFileOperation - User ID:', userId, 'Is Admin:', isAdminUser);
        currentUser.isAdmin = isAdminUser;
        
        // تعريف معالج الأزرار بعد قراءة البيانات
        const handleCallback = async (query) => {
            try {
                console.log('=== Handle Callback ===');
                console.log('Query:', JSON.stringify(query, null, 2));
                
                const data = query.data;
                console.log("Callback data:", data);
                
                // تحقق من أن المستخدم هو المسؤول
                if (!currentUser.isAdmin) {
                    console.log('User is not admin, rejecting operation');
                    await Bot.answerCallbackQuery(query.id, { 
                        text: 'عذراً، هذه الميزة متاحة فقط للمسؤول',
                        show_alert: true 
                    });
                    return;
                }
                
                if (data.startsWith('delete_')) {
                    const pathToDelete = data.replace('delete_', '');
                    const success = await deleteItem(jsonData, pathToDelete);
                    
                    if (success) {
                        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
                        await Bot.answerCallbackQuery(query.id, { text: 'تم الحذف بنجاح!' });
                        currentUser.path.pop();
                        await SelectFileOperation(filePath, Bot, msg, currentUser);
                    }
                }
                
                else if (data.startsWith('rename_')) {
                    const pathToRename = data.replace('rename_', '');
                    currentUser.awaitingRename = { path: pathToRename, jsonData };
                    await Bot.sendMessage(chatId, 'الرجاء إدخال الاسم الجديد:');
                    await Bot.answerCallbackQuery(query.id);
                }
            } catch (error) {
                console.error('Error in handleCallback:', error);
                try {
                    await Bot.answerCallbackQuery(query.id, {
                        text: 'عذراً، حدث خطأ ما',
                        show_alert: true
                    });
                } catch (sendError) {
                    console.error('Error sending callback error message:', sendError);
                }
            }
        };

        // التنقل إلى المجلد المطلوب
        let currentData = jsonData;
        let currentPath = '';

        // إذا كان المسار فارغاً، نستخدم البيانات الأساسية
        if (currentUser.path.length === 0) {
            currentData = jsonData;
        } else {
            // التنقل عبر المسار
            for (const segment of currentUser.path) {
                console.log('Current data for segment:', segment);
                console.log('Available keys:', Object.keys(currentData));
                
                if (currentData[segment] && currentData[segment].file_type === 'folder') {
                    currentData = currentData[segment].content;
                } else {
                    throw new Error(`المسار "${segment}" غير موجود. المسارات المتاحة: ${Object.keys(currentData).join(', ')}`);
                }
            }
        }

        // إنشاء لوحة المفاتيح العادية
        const normalKeyboard = createNormalKeyboard(currentData);
        console.log('Normal Keyboard:', normalKeyboard);

        // إرسال الرسالة مع لوحة المفاتيح
        const message = currentUser.path.length > 0 ? 
            `📍 المسار الحالي: /${currentUser.path.join('/')}` : 
            '📂 المجلد الرئيسي';

        // إرسال الرسالة الأساسية مع لوحة المفاتيح العادية للجميع
        await Bot.sendMessage(chatId, `${message}\n\nاختر ملفًا أو مجلدًا:`, {
            reply_markup: {
                keyboard: normalKeyboard,
                resize_keyboard: true
            }
        });

        // إذا كان المستخدم مسؤولاً وكان هناك مسار، أضف أزرار الإدارة
        if (currentUser.isAdmin && currentUser.path.length > 0) {
            const currentPath = currentUser.path.join('/');
            console.log('Creating admin keyboard for path:', currentPath);
            const adminKeyboard = createAdminKeyboard(currentPath);
            console.log('Admin Keyboard:', adminKeyboard);
            
            await Bot.sendMessage(chatId, 'خيارات الإدارة:', {
                reply_markup: adminKeyboard
            });
        }

        // إزالة المستمع القديم وإضافة المستمع الجديد
        Bot.removeAllListeners('callback_query');
        Bot.on('callback_query', handleCallback);

        // معالجة الرسائل العادية (النقر على المجلدات والملفات)
        Bot.removeAllListeners('message');
        Bot.on('message', async (msg) => {
            // إذا كان المستخدم في وضع إعادة التسمية
            if (currentUser.awaitingRename && msg.text) {
                const { path: oldPath, jsonData: data } = currentUser.awaitingRename;
                const success = await renameItem(data, oldPath, msg.text);
                
                if (success) {
                    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
                    await Bot.sendMessage(chatId, 'تم إعادة التسمية بنجاح!');
                    delete currentUser.awaitingRename;
                    currentUser.path.pop();
                    await SelectFileOperation(filePath, Bot, msg, currentUser);
                }
                return;
            }

            if (msg.text === '⬅️ رجوع') {
                if (currentUser.path.length > 0) {
                    currentUser.path.pop();
                    await SelectFileOperation(filePath, Bot, msg, currentUser);
                }
                return;
            }
            
            if (currentData[msg.text]) {
                if (currentData[msg.text].file_type === 'folder') {
                    currentUser.path.push(msg.text);
                    await SelectFileOperation(filePath, Bot, msg, currentUser);
                } else if (currentData[msg.text].file_type === 'file') {
                    await Bot.sendDocument(chatId, currentData[msg.text].file_id, {
                        caption: msg.text
                    });
                }
            }
        });

    } catch (error) {
        console.error('Error in SelectFileOperation:', error);
        try {
            await Bot.sendMessage(msg.chat.id, 'عذراً، حدث خطأ ما. الرجاء المحاولة مرة أخرى.');
        } catch (sendError) {
            console.error('Error sending error message:', sendError);
        }
    }
};

module.exports = SelectFileOperation;
