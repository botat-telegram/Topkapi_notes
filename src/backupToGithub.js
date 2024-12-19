const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

async function backupToGithub(jsonFilePath) {
    try {
        // قراءة محتوى ملف JSON
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
        
        // إنشاء اسم الملف مع التاريخ والوقت
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `backup_${timestamp}.json`;
        const backupPath = path.join(path.dirname(jsonFilePath), 'backups', backupFileName);

        // التأكد من وجود مجلد النسخ الاحتياطية
        if (!fs.existsSync(path.dirname(backupPath))) {
            fs.mkdirSync(path.dirname(backupPath), { recursive: true });
        }

        // حفظ النسخة الاحتياطية
        fs.writeFileSync(backupPath, jsonContent);

        // رفع الملفات إلى GitHub
        exec('git add .', (error) => {
            if (error) {
                console.error('خطأ في إضافة الملفات:', error);
                return;
            }
            
            exec(`git commit -m "نسخة احتياطية تلقائية - ${timestamp}"`, (error) => {
                if (error) {
                    console.error('خطأ في عمل commit:', error);
                    return;
                }
                
                exec('git push', (error) => {
                    if (error) {
                        console.error('خطأ في الرفع إلى GitHub:', error);
                        return;
                    }
                    console.log('تم رفع النسخة الاحتياطية بنجاح');
                });
            });
        });

    } catch (error) {
        console.error('حدث خطأ أثناء عمل النسخة الاحتياطية:', error);
    }
}

module.exports = backupToGithub;
