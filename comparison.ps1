# comparison_organized.ps1
$folder1 = "c:\Users\Dell Presicion\Desktop\wikitayoub-main 2\src"
$folder2 = "c:\Users\Dell Presicion\Desktop\wikit-mainbranch\src"

# Get all files and create relative path mappings
$files1 = Get-ChildItem -LiteralPath $folder1 -Recurse -File
$files2 = Get-ChildItem -LiteralPath $folder2 -Recurse -File

$rel1 = @{}
$rel2 = @{}

# Create relative paths by removing the base folder path
$files1 | ForEach-Object { 
    $relPath = $_.FullName.Substring($folder1.Length).TrimStart('\')
    $rel1[$relPath] = $_.FullName
}

$files2 | ForEach-Object { 
    $relPath = $_.FullName.Substring($folder2.Length).TrimStart('\')
    $rel2[$relPath] = $_.FullName
}

# Get all unique relative paths
$allPaths = ($rel1.Keys + $rel2.Keys) | Sort-Object | Get-Unique

# Separate into categories
$onlyInCurrent = @()
$onlyInUpstream = @()
$different = @()

$allPaths | ForEach-Object {
    $relPath = $_
    $file1 = $rel1[$relPath]
    $file2 = $rel2[$relPath]
    
    if ($file1 -and $file2) {
        # Both files exist - check if they're different
        $hash1 = (Get-FileHash -LiteralPath $file1).Hash
        $hash2 = (Get-FileHash -LiteralPath $file2).Hash
        if ($hash1 -ne $hash2) {
            $different += $relPath
        }
    } elseif ($file1) {
        $onlyInCurrent += $relPath
    } else {
        $onlyInUpstream += $relPath
    }
}

# Output organized results
$output = @()
$output += "=" * 60
$output += "FILES ONLY IN CURRENT (wikitayoub-main 2)"
$output += "=" * 60
$onlyInCurrent | ForEach-Object { $output += $_ }

$output += ""
$output += "=" * 60
$output += "FILES ONLY IN UPSTREAM (wikit-mainbranch)"
$output += "=" * 60
$onlyInUpstream | ForEach-Object { $output += $_ }

$output += ""
$output += "=" * 60
$output += "FILES IN BOTH BUT DIFFERENT CONTENT"
$output += "=" * 60
$different | ForEach-Object { $output += $_ }

$output += ""
$output += "=" * 60
$output += "SUMMARY"
$output += "=" * 60
$output += "Only in Current: $($onlyInCurrent.Count) files"
$output += "Only in Upstream: $($onlyInUpstream.Count) files"
$output += "Different Content: $($different.Count) files"
$output += "Total Files Analyzed: $($allPaths.Count)"

$output | Out-File "comparison_organized.txt" -Encoding UTF8