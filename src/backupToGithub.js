const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

async function backupToGithub(jsonFilePath) {
    try {
        // قراءة محتوى ملف JSON
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
        
        // إنشاء مسار مجلد النسخ الاحتياطية في المستودع الرئيسي
        const repoRoot = path.resolve(__dirname, '..');
        const backupsDir = path.join(repoRoot, 'github_backups');
        
        // إنشاء اسم الملف مع التاريخ والوقت
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `backup_${timestamp}.json`;
        const backupPath = path.join(backupsDir, backupFileName);

        // التأكد من وجود مجلد النسخ الاحتياطية
        if (!fs.existsSync(backupsDir)) {
            fs.mkdirSync(backupsDir, { recursive: true });
        }

        // حفظ النسخة الاحتياطية
        fs.writeFileSync(backupPath, jsonContent);

        // إضافة ملف .gitkeep للتأكد من أن المجلد سيتم رفعه حتى لو كان فارغاً
        const gitkeepPath = path.join(backupsDir, '.gitkeep');
        if (!fs.existsSync(gitkeepPath)) {
            fs.writeFileSync(gitkeepPath, '');
        }

        // رفع الملفات إلى GitHub
        exec('git add github_backups/*', (error) => {
            if (error) {
                console.error('خطأ في إضافة الملفات:', error);
                return;
            }
            
            exec(`git commit -m "نسخة احتياطية تلقائية - ${timestamp}"`, (error) => {
                if (error) {
                    console.error('خطأ في عمل commit:', error);
                    return;
                }
                
                exec('git push origin main', (error) => {
                    if (error) {
                        console.error('خطأ في الرفع إلى GitHub:', error);
                        return;
                    }
                    console.log(`تم رفع النسخة الاحتياطية بنجاح إلى مجلد github_backups/${backupFileName}`);
                });
            });
        });

    } catch (error) {
        console.error('حدث خطأ أثناء عمل النسخة الاحتياطية:', error);
    }
}

module.exports = backupToGithub;
