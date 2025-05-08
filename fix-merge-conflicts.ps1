# Script to fix merge conflicts in the project
Write-Host "Finding files with merge conflicts..." -ForegroundColor Cyan

# Find all files with merge conflict markers
$conflictFiles = Get-ChildItem -Path "D:\TEST CODE\NOTUN-THIKANA\project" -Recurse -File | 
    Where-Object { $_.Extension -match "\.(tsx|ts|js|jsx|css|scss)$" } |
    Select-String -Pattern "<<<<<<< HEAD" -List |
    Select-Object -ExpandProperty Path

Write-Host "Found $($conflictFiles.Count) files with merge conflicts" -ForegroundColor Yellow

foreach ($file in $conflictFiles) {
    Write-Host "Fixing merge conflicts in: $file" -ForegroundColor Green
    
    # Read the file content
    $content = Get-Content -Path $file -Raw
    
    # Choose the HEAD version (our changes)
    $fixedContent = $content -replace "<<<<<<< HEAD([\s\S]*?)=======[\s\S]*?>>>>>>> .*?`n", '$1'
    
    # Write the fixed content back to the file
    Set-Content -Path $file -Value $fixedContent -NoNewline
    
    Write-Host "Fixed merge conflicts in: $file" -ForegroundColor Green
}

Write-Host "All merge conflicts have been fixed!" -ForegroundColor Cyan
