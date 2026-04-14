#!/usr/bin/env node
/**
 * Animation Generator - Extract HTML code block from LLM response
 * Usage: node extract-html.js <input_file> [output_file]
 */

const fs = require('fs');
const path = require('path');

function extractHtml(content) {
    // Match ```html ... ``` code block
    const htmlMatch = content.match(/```html\s*([\s\S]*?)\s*```/);
    if (htmlMatch && htmlMatch[1]) {
        return htmlMatch[1].trim();
    }
    
    // Fallback: match ``` ... ``` and check if it looks like HTML
    const codeMatch = content.match(/```\s*([\s\S]*?)\s*```/);
    if (codeMatch && codeMatch[1]) {
        const code = codeMatch[1].trim();
        if (code.includes('<!DOCTYPE html>') || code.includes('<html')) {
            return code;
        }
    }
    
    // Last resort: check if the content itself is HTML
    if (content.includes('<!DOCTYPE html>') || content.includes('<html')) {
        return content.trim();
    }
    
    return null;
}

function validateHtml(html) {
    if (!html) return false;
    
    // Basic validation
    const hasDoctype = html.includes('<!DOCTYPE html>');
    const hasHtmlTag = html.includes('<html');
    const hasHead = html.includes('<head>');
    const hasBody = html.includes('<body>');
    const hasClosingHtml = html.includes('</html>');
    
    return hasDoctype && hasHtmlTag && hasHead && hasBody && hasClosingHtml;
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.error('Usage: node extract-html.js <input_file> [output_file]');
        process.exit(1);
    }
    
    const inputFile = args[0];
    let outputFile = args[1];
    
    if (!fs.existsSync(inputFile)) {
        console.error(`Error: Input file not found: ${inputFile}`);
        process.exit(1);
    }
    
    const content = fs.readFileSync(inputFile, 'utf-8');
    const html = extractHtml(content);
    
    if (!html) {
        console.error('Error: No HTML code block found in input file');
        process.exit(1);
    }
    
    if (!validateHtml(html)) {
        console.warn('Warning: Extracted HTML may be incomplete or invalid');
    }
    
    // If no output file specified, use input filename with .html extension
    if (!outputFile) {
        const baseName = path.basename(inputFile, path.extname(inputFile));
        const dirName = path.dirname(inputFile);
        outputFile = path.join(dirName, '..', 'outputs', `${baseName}.html`);
    }
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, html, 'utf-8');
    console.log(`HTML extracted to: ${outputFile}`);
}

main();
