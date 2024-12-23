const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// دالة للتحقق من وجود مستودع Git وتهيئته إذا لم يكن موجوداً
async function initGitIfNeeded(repoPath) {
    try {
        // تعيين متغير البيئة للسماح بالعمل عبر نظام الملفات
        process.env.GIT_DISCOVERY_ACROSS_FILESYSTEM = '1';

        // التحقق من وجود مجلد .git
        if (!fs.existsSync(path.join(repoPath, '.git'))) {
            console.log('تهيئة مستودع Git...');
            
            const gitCommands = [
                `git init "${repoPath}"`,
                `git -C "${repoPath}" config --global --add safe.directory "${repoPath}"`,
                `git -C "${repoPath}" config user.email "${process.env.GIT_EMAIL}"`,
                `git -C "${repoPath}" config user.name "${process.env.GIT_USERNAME}"`,
                // استخدام توكن GitHub في الرابط
                `git -C "${repoPath}" remote add origin "https://${process.env.GITHUB_TOKEN}@github.com/XMhamdX/Topkapi_notes.git"`,
                // جلب أحدث التغييرات من GitHub
                `git -C "${repoPath}" fetch origin`,
                `git -C "${repoPath}" branch -M main`,
                `git -C "${repoPath}" pull origin main --allow-unrelated-histories || true`
            ];

            for (const cmd of gitCommands) {
                await new Promise((resolve, reject) => {
                    exec(cmd, (error, stdout, stderr) => {
                        if (error && !error.message.includes('already exists')) {
                            console.error(`خطأ في تنفيذ الأمر ${cmd}:`, error);
                            reject(error);
                            return;
                        }
                        console.log(stdout);
                        resolve(stdout);
                    });
                });
            }
            console.log('تم تهيئة مستودع Git بنجاح');
        }
    } catch (error) {
        console.error('خطأ في تهيئة مستودع Git:', error);
        throw error;
    }
}

function findChanges(oldData, newData, parentPath = '') {
    const changes = {};
    
    if (!oldData) {
        return { [parentPath]: newData };
    }

    for (const key in newData) {
        const currentPath = parentPath ? `${parentPath}/${key}` : key;
        
        if (!oldData[key]) {
            changes[currentPath] = newData[key];
            continue;
        }

        if (newData[key].file_type === 'folder') {
            const subChanges = findChanges(oldData[key].content, newData[key].content, `${currentPath}/content`);
            if (Object.keys(subChanges).length > 0) {
                Object.assign(changes, subChanges);
            }
        }
    }

    return changes;
}

async function backupToGithub(jsonFilePath) {
    try {
        // قراءة محتوى الملف الحالي
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
        const currentData = JSON.parse(jsonContent);
        
        // إنشاء مسار مجلد النسخ الاحتياطية
        const repoRoot = path.resolve(__dirname, '..');
        const backupsDir = path.join(repoRoot, 'github_backups');
        
        if (!fs.existsSync(backupsDir)) {
            fs.mkdirSync(backupsDir, { recursive: true });
        }

        // التأكد من تهيئة Git
        await initGitIfNeeded(repoRoot);

        // قراءة آخر نسخة احتياطية
        let lastBackupData = {};
        const backupFiles = fs.readdirSync(backupsDir)
            .filter(file => file.endsWith('.json'))
            .sort()
            .reverse();
        
        if (backupFiles.length > 0) {
            const lastBackupContent = fs.readFileSync(path.join(backupsDir, backupFiles[0]), 'utf8');
            lastBackupData = JSON.parse(lastBackupContent);
        }

        // البحث عن التغييرات
        const changes = findChanges(lastBackupData, currentData);

        if (Object.keys(changes).length === 0) {
            console.log('لا توجد تغييرات جديدة');
            return;
        }

        // إنشاء ملف للتغييرات محلياً
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `changes_${timestamp}.json`;
        const backupPath = path.join(backupsDir, backupFileName);

        const backupContent = {
            timestamp: new Date().toISOString(),
            changes: changes
        };

        // حفظ الملف محلياً فقط
        fs.writeFileSync(backupPath, JSON.stringify(backupContent, null, 2));
        console.log(`تم حفظ التغييرات محلياً في: ${backupFileName}`);

        // تحضير رسالة التغييرات
        let commitMessage = `تغييرات ${new Date().toLocaleString('ar-SA')}\n\n`;
        
        // إضافة وصف التغييرات
        for (const [path, content] of Object.entries(changes)) {
            if (content.file_type === 'folder') {
                commitMessage += `✨ إضافة مجلد جديد: ${path}\n`;
            } else {
                commitMessage += `📝 تعديل: ${path}\n`;
            }
        }

        console.log('جاري رفع التغييرات إلى GitHub...');
        
        // تنفيذ أوامر Git في المجلد الصحيح مع تجاوز .gitignore
        const gitCommands = [
            `git -C "${repoRoot}" add -f data.json`,
            `git -C "${repoRoot}" commit -m "${commitMessage.replace(/"/g, '\\"')}"`,
            `git -C "${repoRoot}" push origin main`
        ];

        // تنفيذ الأوامر بالتسلسل
        for (const cmd of gitCommands) {
            try {
                await new Promise((resolve, reject) => {
                    exec(cmd, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`خطأ في تنفيذ الأمر ${cmd}:`, error);
                            reject(error);
                            return;
                        }
                        console.log(stdout);
                        resolve(stdout);
                    });
                });
            } catch (error) {
                throw error;
            }
        }

        console.log('تم رفع التغييرات بنجاح إلى GitHub');

    } catch (error) {
        console.error('حدث خطأ أثناء عمل النسخة الاحتياطية:', error);
    }
}

module.exports = backupToGithub;
