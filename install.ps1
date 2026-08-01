# sapiens installer (Windows)
#   irm https://raw.githubusercontent.com/parhamdavari/sapiens/main/install.ps1 | iex
# Copies the skill into your personal skills directory. Nothing else.

param(
  [switch]$Project,
  [string]$Ref = "main",
  [string]$Repo = "parhamdavari/sapiens"
)

$ErrorActionPreference = "Stop"
$skill = "sapiens"

Write-Host ""
Write-Host "sapiens" -ForegroundColor White -NoNewline
Write-Host " - talk like a person, not a caveman" -ForegroundColor DarkGray
Write-Host ""

$targetRoot = if ($Project) { Join-Path $PWD ".claude\skills" }
              elseif ($env:SAPIENS_DIR) { $env:SAPIENS_DIR }
              else { Join-Path $HOME ".claude\skills" }
$target = Join-Path $targetRoot $skill

$localSrc = Join-Path $PSScriptRoot "skills\$skill\SKILL.md"
$tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("sapiens-" + [guid]::NewGuid())

try {
  if (Test-Path $localSrc) {
    $src = Join-Path $PSScriptRoot "skills\$skill"
    Write-Host "installing from local checkout" -ForegroundColor DarkGray
  } else {
    Write-Host "downloading $Repo@$Ref" -ForegroundColor DarkGray
    New-Item -ItemType Directory -Path $tmp -Force | Out-Null
    $zip = Join-Path $tmp "src.zip"
    Invoke-WebRequest -Uri "https://codeload.github.com/$Repo/zip/$Ref" -OutFile $zip -UseBasicParsing
    Expand-Archive -Path $zip -DestinationPath $tmp -Force
    $found = Get-ChildItem -Path $tmp -Recurse -Directory -Filter $skill |
             Where-Object { Test-Path (Join-Path $_.FullName "SKILL.md") } | Select-Object -First 1
    if (-not $found) { throw "archive did not contain skills\$skill" }
    $src = $found.FullName
  }

  if (Test-Path $target) {
    $backup = "$target.backup." + (Get-Date -Format "yyyyMMddHHmmss")
    Move-Item $target $backup
    Write-Host "! existing install moved to $backup" -ForegroundColor Yellow
  }

  New-Item -ItemType Directory -Path $targetRoot -Force | Out-Null
  Copy-Item $src $target -Recurse

  $version = (Select-String -Path (Join-Path $target "SKILL.md") -Pattern '^\s+version:' |
              Select-Object -First 1).Line -replace '.*version:\s*','' -replace '"',''
  if (-not $version) { $version = "unknown" }

  Write-Host ""
  Write-Host "OK " -ForegroundColor Green -NoNewline
  Write-Host "installed sapiens $version to $target"
  Write-Host ""
  Write-Host "Next:"
  Write-Host "  1. restart Claude Code (skills load at startup)"
  Write-Host "  2. type /skills to confirm sapiens is listed"
  Write-Host "  3. say `"sapiens mode`" to turn it on, or /sapiens for one reply"
  Write-Host ""
  Write-Host "  levels: /sapiens lead   /sapiens dev   /sapiens geek"
  Write-Host "  off:    say `"stop sapiens`""
  Write-Host ""
  Write-Host "uninstall: Remove-Item -Recurse $target" -ForegroundColor DarkGray
  Write-Host ""
}
finally {
  if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue }
}
