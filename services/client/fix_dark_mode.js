const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Convert existing custom hex to zinc palette
    content = content.replace(/dark:bg-\[#1a1b1b\]/g, 'dark:bg-zinc-900');
    content = content.replace(/dark:bg-\[#1e1f1f\]/g, 'dark:bg-zinc-900');
    content = content.replace(/dark:bg-\[#111212\]/g, 'dark:bg-zinc-950');
    content = content.replace(/dark:border-gray-800/g, 'dark:border-zinc-800');
    content = content.replace(/dark:border-gray-700/g, 'dark:border-zinc-700');
    content = content.replace(/dark:text-white/g, 'dark:text-zinc-100');
    content = content.replace(/dark:text-gray-300/g, 'dark:text-zinc-300');
    content = content.replace(/dark:text-gray-400/g, 'dark:text-zinc-400');
    content = content.replace(/dark:text-gray-500/g, 'dark:text-zinc-500');
    content = content.replace(/dark:bg-gray-800/g, 'dark:bg-zinc-800');
    content = content.replace(/dark:hover:bg-gray-800\/40/g, 'dark:hover:bg-zinc-800');
    content = content.replace(/dark:hover:bg-gray-800\/60/g, 'dark:hover:bg-zinc-800');
    content = content.replace(/dark:hover:bg-gray-800/g, 'dark:hover:bg-zinc-800');
    content = content.replace(/dark:bg-gray-900\/40/g, 'dark:bg-zinc-900');
    content = content.replace(/dark:bg-gray-900\/30/g, 'dark:bg-zinc-900');
    
    // Add dark variants where there are missing ones for bg-white
    content = content.replace(/bg-white(?!\s+dark:bg)/g, 'bg-white dark:bg-zinc-900');
    content = content.replace(/bg-white\s+dark:bg-\w+(-\d+)?(\/\d+)?(?!\s)/g, 'bg-white dark:bg-zinc-900');

    // Add dark variants for text-gray-900
    content = content.replace(/text-gray-900(?!\s+dark:text)/g, 'text-gray-900 dark:text-zinc-100');
    content = content.replace(/text-gray-900\s+dark:text-\w+(-\d+)?(?!\s)/g, 'text-gray-900 dark:text-zinc-100');

    // Add dark variants for text-[#1b1c1c]
    content = content.replace(/text-\[#1b1c1c\](?!\s+dark:text)/g, 'text-[#1b1c1c] dark:text-zinc-100');
    content = content.replace(/text-\[#1b1c1c\]\s+dark:text-\w+(-\d+)?(?!\s)/g, 'text-[#1b1c1c] dark:text-zinc-100');

    // Add dark variants for border-gray-200
    content = content.replace(/border-gray-200(?!\s+dark:border)/g, 'border-gray-200 dark:border-zinc-800');
    content = content.replace(/border-gray-200\s+dark:border-\w+(-\d+)?(\/\d+)?(?!\s)/g, 'border-gray-200 dark:border-zinc-800');

    // Add dark variants for border-gray-300
    content = content.replace(/border-gray-300(?!\s+dark:border)/g, 'border-gray-300 dark:border-zinc-700');
    
    // Fix text-gray-800
    content = content.replace(/text-gray-800(?!\s+dark:text)/g, 'text-gray-800 dark:text-zinc-200');

    // Add transition if missing on generic widgets?
    // We will leave transition-colors to be mostly covered or handled by specific components.
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log("Done");
